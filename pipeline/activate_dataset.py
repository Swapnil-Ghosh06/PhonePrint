"""
PhonePrint - Safe Dataset Activation & Rollback Engine
Academic Project: Discrete Mathematics & Graph Theory Experiential Learning

Enforces the 7-step activation checklist before a real survey dataset can replace
the active application dataset. Manages timestamped backups and provides one-command rollback.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from pipeline.process_survey import (
    CANONICAL_BRANDS,
    CANONICAL_BUDGETS,
    CANONICAL_FEATURES,
    CANONICAL_OS,
    CANONICAL_PRIMARY_USES,
    ValidationError,
    process_survey_csv,
)

CONFIG_PATH = Path("src/data/dataset_config.json")
ACTIVE_DATA_PATH = Path("src/data/survey_active_data.json")
DEMO_DATA_PATH = Path("src/data/survey_demo_data.json")
BACKUPS_DIR = Path("src/data/backups")


def run_zod_validation(json_path: Path) -> Dict[str, Any]:
    """
    Executes Zod schema validation using vite-node and src/schemas/survey.schema.ts.
    """
    cmd = [
        Path("node_modules/.bin/vite-node.cmd") if os.name == "nt" else Path("node_modules/.bin/vite-node"),
        "--config",
        "vitest.config.ts",
        "pipeline/validate_zod.ts",
        str(json_path),
    ]

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False,
            shell=(os.name == "nt"),
        )
        if proc.returncode == 0:
            return json.loads(proc.stdout.strip())
        else:
            try:
                err_data = json.loads(proc.stderr.strip() or proc.stdout.strip())
                return err_data
            except Exception:
                return {
                    "valid": False,
                    "errors": [{"path": "zod_execution", "message": proc.stderr or proc.stdout}],
                }
    except Exception as e:
        return {"valid": False, "errors": [{"path": "zod_runner", "message": str(e)}]}


def validate_dataset_invariants(data: Dict[str, Any]) -> List[str]:
    """
    Validates structural and mathematical invariants:
    1. Metadata presence & count synchronization
    2. At least 1 response
    3. Global respondent ID uniqueness
    4. Exactly 3 distinct features per response belonging to 7 canonical features
    5. Canonical brand, budget, primary use, and OS
    6. Absence of PII fields
    """
    errors: List[str] = []

    metadata = data.get("metadata")
    if not metadata or not isinstance(metadata, dict):
        return ["Dataset is missing required 'metadata' object."]

    responses = data.get("responses")
    if not isinstance(responses, list):
        return ["Dataset is missing required 'responses' array."]

    total_responses = metadata.get("total_responses")
    if total_responses != len(responses):
        errors.append(
            f"Metadata total_responses ({total_responses}) does not match response count ({len(responses)})."
        )

    if len(responses) == 0:
        errors.append("Dataset contains 0 responses. Cannot activate an empty dataset.")

    seen_ids: set[str] = set()
    pii_keys = {"email", "email address", "name", "full name", "student id", "ip", "username"}

    for idx, resp in enumerate(responses):
        resp_id = resp.get("response_id")
        if not resp_id:
            errors.append(f"Record {idx}: Missing 'response_id'")
        elif resp_id in seen_ids:
            errors.append(f"Record {idx}: Duplicate response_id '{resp_id}' detected")
        else:
            seen_ids.add(resp_id)

        # Check for leaked PII keys
        for key in resp.keys():
            if key.lower() in pii_keys:
                errors.append(f"Record {idx}: Prohibited PII field detected '{key}'")

        # Canonical brand
        brand = resp.get("preferred_brand")
        if brand not in set(CANONICAL_BRANDS.values()):
            errors.append(f"Record {idx} ({resp_id}): Unknown brand '{brand}'")

        # Canonical budget
        budget = resp.get("budget_range")
        if budget not in set(CANONICAL_BUDGETS.values()):
            errors.append(f"Record {idx} ({resp_id}): Unknown budget range '{budget}'")

        # Features: strictly 3 distinct in 7-feature universe
        features = resp.get("preferred_features")
        if not isinstance(features, list):
            errors.append(f"Record {idx} ({resp_id}): 'preferred_features' must be an array")
        else:
            if len(features) != 3:
                errors.append(
                    f"Record {idx} ({resp_id}): Expected exactly 3 features, got {len(features)}"
                )
            if len(set(features)) != len(features):
                errors.append(
                    f"Record {idx} ({resp_id}): Feature selections must be distinct, got {features}"
                )
            for f in features:
                if f not in set(CANONICAL_FEATURES.values()):
                    errors.append(
                        f"Record {idx} ({resp_id}): Unknown feature '{f}' outside canonical 7"
                    )

        # Primary use & OS
        use = resp.get("primary_use")
        if use not in set(CANONICAL_PRIMARY_USES.values()):
            errors.append(f"Record {idx} ({resp_id}): Unknown primary use '{use}'")

        os_val = resp.get("os_preference")
        if os_val not in set(CANONICAL_OS.values()):
            errors.append(f"Record {idx} ({resp_id}): Unknown OS preference '{os_val}'")

    return errors


def get_dataset_config() -> Dict[str, Any]:
    """Reads dataset_config.json with safe defaults."""
    if CONFIG_PATH.exists():
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass

    return {
        "active_dataset": "demo",
        "is_demo": True,
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "demo_file": "survey_demo_data.json",
        "real_file": "survey_active_data.json",
    }


def save_dataset_config(config: Dict[str, Any]) -> None:
    """Writes dataset_config.json deterministically and atomically."""
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    import tempfile
    with tempfile.NamedTemporaryFile(
        mode="w",
        dir=CONFIG_PATH.parent,
        prefix="tmp_config_",
        suffix=".json",
        delete=False,
        encoding="utf-8",
    ) as tmp_f:
        tmp_name = Path(tmp_f.name)
        json.dump(config, tmp_f, indent=2, ensure_ascii=False)
        tmp_f.write("\n")
        tmp_f.flush()
        os.fsync(tmp_f.fileno())
    os.replace(tmp_name, CONFIG_PATH)


def backup_active_dataset() -> Optional[Path]:
    """Creates a timestamped backup of the current active dataset if populated."""
    if not ACTIVE_DATA_PATH.exists():
        return None

    try:
        with open(ACTIVE_DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            total = data.get("metadata", {}).get("total_responses", 0)
            if total == 0:
                return None  # Do not backup unpopulated placeholder
    except Exception as e:
        print(f"[Backup Error] Failed to read current active dataset: {e}", file=sys.stderr)
        raise RuntimeError(f"Failed to read existing active dataset for backup: {e}")

    BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUPS_DIR / f"dataset_backup_{ts}_N{total}.json"
    try:
        shutil.copy2(ACTIVE_DATA_PATH, backup_file)
    except Exception as e:
        print(f"[Backup Error] Failed to copy active dataset to backup file: {e}", file=sys.stderr)
        raise RuntimeError(f"Failed to create active dataset backup: {e}")

    print(f"[Backup] Saved current active dataset to: {backup_file}")
    return backup_file


def activate_dataset(source_path_str: str) -> bool:
    """
    Executes the full controlled activation process with atomic file replacement:
    1. CSV parsing or JSON loading.
    2. Invariant verification (unique IDs, 3 canonical features, enums).
    3. Zod schema validation via vite-node.
    4. Backup creation of prior active dataset (failure aborts activation).
    5. Atomic deployment to src/data/survey_active_data.json via temporary file + os.replace.
    6. Updating src/data/dataset_config.json with recovery rollback on failure.
    """
    source_path = Path(source_path_str)
    if not source_path.exists():
        print(f"[Error] Source file does not exist: {source_path}", file=sys.stderr)
        return False

    print(f"\n=======================================================")
    print(f"  PhonePrint Controlled Dataset Activation Protocol")
    print(f"=======================================================")
    print(f"Step 1: Inspecting source file: {source_path}")

    temp_json_path: Optional[Path] = None

    # If source is CSV, run pipeline to produce canonical JSON first
    if source_path.suffix.lower() == ".csv":
        print("  - Input is CSV. Running processing pipeline...")
        temp_json_path = Path("pipeline/data/temp_activation_candidate.json")
        try:
            dataset_dict = process_survey_csv(
                csv_path=source_path,
                output_json_path=temp_json_path,
                is_demo=False,
                strict=True,
            )
            candidate_path = temp_json_path
        except ValidationError as ve:
            print(f"[Activation Failed] CSV validation errors:\n{ve}", file=sys.stderr)
            return False
    else:
        candidate_path = source_path
        try:
            with open(candidate_path, "r", encoding="utf-8") as f:
                dataset_dict = json.load(f)
        except Exception as e:
            print(f"[Activation Failed] Invalid JSON syntax: {e}", file=sys.stderr)
            return False

    # Step 2: Validate domain & mathematical invariants
    print("Step 2: Validating mathematical & structural invariants...")
    invariant_errors = validate_dataset_invariants(dataset_dict)
    if invariant_errors:
        print(f"[Activation Failed] {len(invariant_errors)} invariant violation(s):", file=sys.stderr)
        for err in invariant_errors[:10]:
            print(f"  - {err}", file=sys.stderr)
        if temp_json_path and temp_json_path.exists():
            try:
                temp_json_path.unlink()
            except Exception:
                pass
        return False
    print("  [OK] All mathematical and domain invariants satisfied.")

    # Step 3: Run Zod schema validation
    print("Step 3: Running Zod schema validation via TypeScript schema...")
    zod_result = run_zod_validation(candidate_path)
    if not zod_result.get("valid"):
        print(f"[Activation Failed] Zod schema validation failed:", file=sys.stderr)
        for err in zod_result.get("errors", [])[:10]:
            print(f"  - {err.get('path')}: {err.get('message')}", file=sys.stderr)
        if temp_json_path and temp_json_path.exists():
            try:
                temp_json_path.unlink()
            except Exception:
                pass
        return False
    print(f"  [OK] Zod validation succeeded ({zod_result.get('total_responses')} responses).")

    # Step 4: Backup existing active dataset (failure prevents activation)
    print("Step 4: Preserving backup of existing active dataset...")
    try:
        backup_file = backup_active_dataset()
    except Exception as e:
        print(f"[Activation Failed] Backup failure prevents activation: {e}", file=sys.stderr)
        if temp_json_path and temp_json_path.exists():
            try:
                temp_json_path.unlink()
            except Exception:
                pass
        return False

    # Step 5: Atomic replacement of active dataset
    print(f"Step 5: Deploying dataset atomically to {ACTIVE_DATA_PATH}...")
    target_dir = ACTIVE_DATA_PATH.parent
    target_dir.mkdir(parents=True, exist_ok=True)

    staging_file: Optional[Path] = None
    try:
        import tempfile
        with tempfile.NamedTemporaryFile(
            mode="w",
            dir=target_dir,
            prefix="tmp_active_",
            suffix=".json",
            delete=False,
            encoding="utf-8",
        ) as tmp_staging:
            staging_file = Path(tmp_staging.name)
            with open(candidate_path, "r", encoding="utf-8") as src_f:
                shutil.copyfileobj(src_f, tmp_staging)
            tmp_staging.flush()
            os.fsync(tmp_staging.fileno())
    except Exception as e:
        print(f"[Activation Failed] Failed to write temporary staging file: {e}", file=sys.stderr)
        if staging_file and staging_file.exists():
            try:
                staging_file.unlink()
            except Exception:
                pass
        if temp_json_path and temp_json_path.exists():
            try:
                temp_json_path.unlink()
            except Exception:
                pass
        return False

    try:
        os.replace(staging_file, ACTIVE_DATA_PATH)
    except Exception as e:
        print(f"[Activation Failed] Atomic replacement failed: {e}", file=sys.stderr)
        if staging_file and staging_file.exists():
            try:
                staging_file.unlink()
            except Exception:
                pass
        if temp_json_path and temp_json_path.exists():
            try:
                temp_json_path.unlink()
            except Exception:
                pass
        return False

    # Step 6: Update configuration with automatic rollback recovery on failure
    print(f"Step 6: Updating dataset configuration in {CONFIG_PATH}...")
    total_n = dataset_dict["metadata"]["total_responses"]
    config = get_dataset_config()
    config["active_dataset"] = "real"
    config["is_demo"] = False
    config["total_responses"] = total_n
    config["last_activated"] = datetime.now(timezone.utc).isoformat()
    config["source_file"] = str(source_path)
    if backup_file:
        config["last_backup"] = str(backup_file)

    try:
        save_dataset_config(config)
    except Exception as config_err:
        print(f"[Activation Failed] Configuration update failed: {config_err}", file=sys.stderr)
        print("[Recovery] Initiating atomic recovery to restore previous active dataset...", file=sys.stderr)
        # Recovery strategy: restore previous active dataset from backup_file atomically
        if backup_file and backup_file.exists():
            rec_staging: Optional[Path] = None
            try:
                import tempfile
                with tempfile.NamedTemporaryFile(
                    mode="w",
                    dir=target_dir,
                    prefix="tmp_recovery_",
                    suffix=".json",
                    delete=False,
                    encoding="utf-8",
                ) as tmp_rec:
                    rec_staging = Path(tmp_rec.name)
                    with open(backup_file, "r", encoding="utf-8") as bf:
                        shutil.copyfileobj(bf, tmp_rec)
                    tmp_rec.flush()
                    os.fsync(tmp_rec.fileno())
                os.replace(rec_staging, ACTIVE_DATA_PATH)
                print(f"[Recovery] Successfully restored active dataset from {backup_file.name}", file=sys.stderr)
            except Exception as rec_err:
                if rec_staging and rec_staging.exists():
                    try:
                        rec_staging.unlink()
                    except Exception:
                        pass
                print(f"[Critical Recovery Error] Failed to restore active dataset during recovery: {rec_err}", file=sys.stderr)

        if temp_json_path and temp_json_path.exists():
            try:
                temp_json_path.unlink()
            except Exception:
                pass
        return False

    # Cleanup temp working file
    if temp_json_path and temp_json_path.exists():
        try:
            temp_json_path.unlink()
        except Exception:
            pass

    print("\n=======================================================")
    print(f"  [SUCCESS] Real Survey Dataset Activated!")
    print(f"  Total Responses: {total_n}")
    print(f"  Active Dataset:  REAL SURVEY DATA")
    print(f"  To Rollback:     python pipeline/activate_dataset.py --rollback")
    print(f"=======================================================\n")
    return True


def rollback_dataset() -> bool:
    """
    Rolls back to the previous valid dataset or demo dataset using atomic file replacement.
    """
    print(f"\n=======================================================")
    print(f"  PhonePrint Dataset Rollback Protocol")
    print(f"=======================================================\n")

    backups = sorted(BACKUPS_DIR.glob("dataset_backup_*.json")) if BACKUPS_DIR.exists() else []
    config = get_dataset_config()

    if backups:
        latest_backup = backups[-1]
        print(f"Restoring latest backup atomically: {latest_backup}...")
        import tempfile
        staging_file: Optional[Path] = None
        try:
            with tempfile.NamedTemporaryFile(
                mode="w",
                dir=ACTIVE_DATA_PATH.parent,
                prefix="tmp_rollback_",
                suffix=".json",
                delete=False,
                encoding="utf-8",
            ) as tmp_staging:
                staging_file = Path(tmp_staging.name)
                with open(latest_backup, "r", encoding="utf-8") as bf:
                    shutil.copyfileobj(bf, tmp_staging)
                tmp_staging.flush()
                os.fsync(tmp_staging.fileno())
            os.replace(staging_file, ACTIVE_DATA_PATH)
        except Exception as e:
            if staging_file and staging_file.exists():
                try:
                    staging_file.unlink()
                except Exception:
                    pass
            print(f"[Rollback Failed] Could not atomically restore active dataset: {e}", file=sys.stderr)
            return False

        try:
            with open(latest_backup, "r", encoding="utf-8") as f:
                bdata = json.load(f)
                b_total = bdata.get("metadata", {}).get("total_responses", 0)
        except Exception:
            b_total = 0

        config["active_dataset"] = "real"
        config["is_demo"] = False
        config["total_responses"] = b_total
        config["last_activated"] = datetime.now(timezone.utc).isoformat()
        config["notes"] = f"Rolled back to {latest_backup.name}"
        save_dataset_config(config)
        print(f"[OK] Restored real dataset from backup ({b_total} responses).")
        return True
    else:
        print("No prior backups found. Reverting to DEMO DATASET mode...")
        config["active_dataset"] = "demo"
        config["is_demo"] = True
        config["total_responses"] = 12
        config["last_activated"] = datetime.now(timezone.utc).isoformat()
        config["notes"] = "Reverted to canonical demo dataset."
        save_dataset_config(config)
        print("[OK] Reverted application configuration to DEMO DATA.")
        return True
        config["total_responses"] = 12
        config["last_activated"] = datetime.now(timezone.utc).isoformat()
        config["notes"] = "Reverted to canonical demo dataset."
        save_dataset_config(config)
        print("[OK] Reverted application configuration to DEMO DATA.")
        return True


def print_status() -> None:
    """Prints current dataset configuration and status."""
    config = get_dataset_config()
    backups = sorted(BACKUPS_DIR.glob("dataset_backup_*.json")) if BACKUPS_DIR.exists() else []

    print(f"\n--- PhonePrint Dataset Status ---")
    print(f"Active Mode:     {'DEMO DATA' if config.get('is_demo') else 'REAL SURVEY DATA'}")
    print(f"Active Dataset:  {config.get('active_dataset', 'demo')}")
    print(f"Total Responses: {config.get('total_responses', 'N/A')}")
    print(f"Last Updated:    {config.get('last_activated', config.get('last_updated', 'N/A'))}")
    print(f"Backups Count:   {len(backups)}")
    if backups:
        print(f"Latest Backup:   {backups[-1].name}")
    print(f"---------------------------------\n")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="PhonePrint Dataset Activation & Rollback Controller"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--activate",
        "-a",
        metavar="FILE",
        help="Activate a verified CSV or JSON dataset",
    )
    group.add_argument(
        "--rollback",
        "-r",
        action="store_true",
        help="Rollback to the previous valid dataset or demo dataset",
    )
    group.add_argument(
        "--status",
        "-s",
        action="store_true",
        help="Print current active dataset status and backup inventory",
    )
    group.add_argument(
        "--demo",
        action="store_true",
        help="Explicitly switch to demo dataset mode",
    )

    args = parser.parse_args()

    if args.status:
        print_status()
    elif args.rollback:
        success = rollback_dataset()
        sys.exit(0 if success else 1)
    elif args.demo:
        config = get_dataset_config()
        config["active_dataset"] = "demo"
        config["is_demo"] = True
        config["total_responses"] = 12
        config["last_activated"] = datetime.now(timezone.utc).isoformat()
        save_dataset_config(config)
        print("Switched to DEMO DATA mode.")
        print_status()
    elif args.activate:
        success = activate_dataset(args.activate)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
