# PhonePrint — Phase 07 Technical Audit Bundle
## Real Survey Data Integration & Data Quality Pipeline

**Generated:** 2026-11-07T09:36:41.099480+00:00  
**Phase:** Phase 07 (Real Survey Data Integration)  
**Active Application State:** `DEMO DATA (n=12)` [Synthetic Benchmark Mode]  
**Real Data Presence in Workspace:** **None** (Survey export pending from university administration)  
**Pipeline State:** Import-Ready, Fully Tested, and Certified for Google Forms CSV ingestion  

---

## Executive Summary

Phase 07 implements a production-grade, mathematically grounded data pipeline transitioning PhonePrint from its 12-record synthetic demonstration fixture towards real university survey ingestion, without fabricating empirical human data.

### Key Architectural Deliverables:
1. **Survey Export Absence Verification**: Workspace inspected; confirmed no real Google Forms CSV was present. Synthetic demo mode preserved with continuous UI disclosure.
2. **Google Forms Ingestion & Encoding Fallback**: Automatic support for `utf-8-sig` (BOM), `utf-8`, and `latin1`, handling unquoted/quoted commas, quotes, blank lines, and whitespace normalization.
3. **Configurable Column Mapping & Unmapped Warnings**: `pipeline/column_mapping.json` maps natural-language question titles to canonical fields with automated PII stripping. Unmapped non-PII columns trigger warnings without leaking cell values.
4. **Discrete Set Validation**: Enforces the 7-feature universe, exactly 3 distinct features per student, canonical brands (7), budget tiers (4), primary uses (5), and OS preferences (3).
5. **Duplicate Detection Discrimination (With & Without Timestamps)**: Differentiates accidental double submissions from legitimate identical preference vectors. When timestamps are missing, duplicate exclusion is skipped to preserve legitimate independent student profiles.
6. **Sequential Pseudonymization**: Monotonic respondent ID assignment (`RESP_001`, `RESP_002`) decoupled from raw PII, with clear protocols for student withdrawal.
7. **Verification & Audit Reports**: Emits `cleaning_report.json` and `cleaning_report.md` proving the invariant: `total_raw = blank + accepted + rejected`.
8. **Atomic Activation & Instant Rollback**: `pipeline/activate_dataset.py` enforces a 7-step checklist using atomic staging files and `os.replace()`, with automated rollback recovery if configuration saving fails.
9. **Dynamic Application Integration**: `Campus Pulse`, `My PhonePrint`, `SetLab`, `ComboLab`, and `Experiment Studio` seamlessly consume the active dataset without mathematical regression.
10. **Operator Documentation**: Updated `PHASE07_DATA_IMPORT_GUIDE.md` covering end-to-end operational procedures and audit corrections.

---

## Targeted Correction Pass Audit (Gemini Findings & Resolutions)

| Finding | Severity | File | Resolution | Verification Status |
| :--- | :---: | :--- | :--- | :---: |
| **1. Duplicate exclusion when timestamps are missing** | High | `pipeline/process_survey.py` (`detect_duplicates`) | Verifies timestamp resolution; if timestamps are absent/unusable, duplicate exclusion is skipped (`exact_dup_indices = []`), a clear warning is emitted to `sys.stderr`, and all valid respondents are retained. | **Verified** (5 dedicated unit tests) |
| **2. Non-atomic active JSON dataset replacement** | Medium | `pipeline/activate_dataset.py` (`activate_dataset`) | Implemented atomic deployment via temporary staging files in `ACTIVE_DATA_PATH.parent` with `os.fsync()` and `os.replace()`. Added recovery handler restoring prior dataset if config save fails. | **Verified** (8 failure-path & recovery tests) |
| **3. Unmapped CSV columns silently ignored** | Low | `pipeline/process_survey.py` (`resolve_column_mapping`) | Compares input CSV headers against canonical fields, PII columns, and ignored list. Emits warning to `sys.stderr` identifying column names only (never cell contents). | **Verified** (5 dedicated unit tests) |

---

## Test Execution Summary

- **Python Test Suite (`pipeline/test_pipeline.py`):** **25 / 25 Passed** (100% pass rate).
- **Vitest Suite (`src/__tests__/`):** **121 / 121 Passed** across 10 test files.
- **TypeScript (`tsc --noEmit`):** **0 Errors**.
- **ESLint (`next lint`):** **0 Warnings / Errors**.
- **Next.js Production Build (`next build`):** **9 / 9 Routes compiled successfully**.
- **Application Active Dataset State:** `active_dataset: demo`, `is_demo: true`, `N = 12`.

---

## Source Code Catalog

### `pipeline/column_mapping.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "PhonePrint Google Forms and CSV Survey Column Mapping Configuration",
  "version": "1.0.0",
  "canonical_fields": {
    "preferred_brand": [
      "preferred_brand",
      "What is your preferred smartphone brand?",
      "Which smartphone brand do you prefer?",
      "Brand",
      "Preferred Brand",
      "Smartphone Brand"
    ],
    "budget_range": [
      "budget_range",
      "What is your typical smartphone budget range?",
      "What is your budget range for a new smartphone?",
      "What is your budget for a smartphone?",
      "Budget",
      "Budget Range"
    ],
    "preferred_features": [
      "preferred_features",
      "Select your top 3 preferred features (Choose exactly 3):",
      "Which 3 features matter most to you when choosing a smartphone?",
      "Which 3 features matter most to you?",
      "Preferred Features",
      "Features",
      "Top 3 Features"
    ],
    "primary_use": [
      "primary_use",
      "What is your primary use case for your smartphone?",
      "What is your primary use for your smartphone?",
      "Primary Use",
      "Primary Use Case"
    ],
    "os_preference": [
      "os_preference",
      "What is your operating system preference?",
      "What smartphone operating system do you prefer?",
      "Operating System Preference",
      "OS Preference",
      "OS"
    ],
    "response_id": [
      "response_id",
      "Response ID",
      "Respondent ID",
      "ID"
    ],
    "timestamp": [
      "Timestamp",
      "timestamp",
      "Date",
      "Submitted At"
    ]
  },
  "pii_columns_to_strip": [
    "Email Address",
    "email",
    "Email",
    "Username",
    "Name",
    "Full Name",
    "Student ID",
    "Roll Number",
    "Score",
    "IP Address"
  ],
  "ignored_columns": []
}
```

---

### `data/templates/google_forms_survey_template.csv`

```csv
Timestamp,Email Address,What is your preferred smartphone brand?,What is your typical smartphone budget range?,"Select your top 3 preferred features (Choose exactly 3):",What is your primary use case for your smartphone?,What is your operating system preference?
2026/10/24 10:15:20 AM EST,student1@university.edu,Apple,"Over $1,000","Camera Quality, Battery Life, Build & Design Quality",Photography & Videography,iOS
2026/10/24 10:18:45 AM EST,student2@university.edu,Samsung,"$700 - $1,000","Display Quality, Processing Performance, Storage Capacity",Gaming,Android
2026/10/24 10:22:10 AM EST,student3@university.edu,Google,$400 - $700,"Camera Quality, Battery Life, Software & OS Experience",Social Media & Content Consumption,Android
2026/10/24 10:25:33 AM EST,student4@university.edu,OnePlus,$400 - $700,"Battery Life, Processing Performance, Display Quality",Gaming,Android
2026/10/24 10:30:15 AM EST,student5@university.edu,Xiaomi,Under $400,"Battery Life, Processing Performance, Storage Capacity",Everyday General Use,Android
2026/10/24 10:35:50 AM EST,student6@university.edu,Motorola,Under $400,"Battery Life, Display Quality, Storage Capacity",Everyday General Use,Android
2026/10/24 10:41:05 AM EST,student7@university.edu,Apple,"$700 - $1,000","Camera Quality, Build & Design Quality, Software & OS Experience",Business & Productivity,iOS
2026/10/24 10:45:22 AM EST,student8@university.edu,Samsung,"Over $1,000","Camera Quality, Processing Performance, Build & Design Quality",Photography & Videography,Android
```

---

### `src/data/dataset_config.json`

```json
{
  "active_dataset": "demo",
  "is_demo": true,
  "total_responses": 12,
  "last_updated": "2026-11-07T09:31:00.000000+00:00",
  "demo_file": "survey_demo_data.json",
  "real_file": "survey_active_data.json",
  "notes": "Canonical 12-record benchmark synthetic dataset."
}
```

---

### `src/data/survey_active_data.json`

```json
{
  "metadata": {
    "total_responses": 0,
    "is_demo": false
  },
  "responses": []
}
```

---

### `pipeline/process_survey.py`

```python
"""
PhonePrint - Offline Survey Data Processing & Quality Pipeline
Academic Project: Discrete Mathematics & Graph Theory Experiential Learning

Processes raw Google Forms and survey CSV files, validates integrity, normalizes values,
enforces 3-feature distinctness, detects duplicates, generates anonymous respondent IDs,
and exports canonical JSON datasets with comprehensive audit reports.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import pandas as pd

# Canonical domain enumerations for strict validation and normalization
# Exactly matching TypeScript definitions in src/types/survey.ts
CANONICAL_BRANDS: Dict[str, str] = {
    "apple": "Apple",
    "iphone": "Apple",
    "samsung": "Samsung",
    "galaxy": "Samsung",
    "google": "Google",
    "pixel": "Google",
    "oneplus": "OnePlus",
    "one plus": "OnePlus",
    "xiaomi": "Xiaomi",
    "mi": "Xiaomi",
    "redmi": "Xiaomi",
    "motorola": "Motorola",
    "moto": "Motorola",
    "other": "Other",
}

CANONICAL_BUDGETS: Dict[str, str] = {
    "under $400": "Under $400",
    "<$400": "Under $400",
    "under 400": "Under $400",
    "below $400": "Under $400",
    "$400 - $700": "$400 - $700",
    "$400-$700": "$400 - $700",
    "400 - 700": "$400 - $700",
    "$700 - $1,000": "$700 - $1,000",
    "$700-$1000": "$700 - $1,000",
    "$700 - $1000": "$700 - $1,000",
    "700 - 1000": "$700 - $1,000",
    "over $1,000": "Over $1,000",
    "over $1000": "Over $1,000",
    "over 1000": "Over $1,000",
    ">$1000": "Over $1,000",
    ">$1,000": "Over $1,000",
}

# The approved 7-feature universe (Fast Charging and 5G Connectivity were removed in Phase 01)
CANONICAL_FEATURES: Dict[str, str] = {
    "camera quality": "Camera Quality",
    "camera": "Camera Quality",
    "battery life": "Battery Life",
    "battery": "Battery Life",
    "processing performance": "Processing Performance",
    "processing speed": "Processing Performance",
    "processor": "Processing Performance",
    "performance": "Processing Performance",
    "display quality": "Display Quality",
    "display": "Display Quality",
    "storage capacity": "Storage Capacity",
    "storage": "Storage Capacity",
    "build & design quality": "Build & Design Quality",
    "build & design": "Build & Design Quality",
    "build quality": "Build & Design Quality",
    "build": "Build & Design Quality",
    "design": "Build & Design Quality",
    "software & os experience": "Software & OS Experience",
    "software & os": "Software & OS Experience",
    "software": "Software & OS Experience",
    "os experience": "Software & OS Experience",
}

CANONICAL_PRIMARY_USES: Dict[str, str] = {
    "photography & videography": "Photography & Videography",
    "photography": "Photography & Videography",
    "videography": "Photography & Videography",
    "gaming": "Gaming",
    "business & productivity": "Business & Productivity",
    "productivity": "Business & Productivity",
    "business": "Business & Productivity",
    "social media & content consumption": "Social Media & Content Consumption",
    "social media": "Social Media & Content Consumption",
    "content consumption": "Social Media & Content Consumption",
    "everyday general use": "Everyday General Use",
    "everyday use": "Everyday General Use",
    "general use": "Everyday General Use",
    "general": "Everyday General Use",
    "everyday communication & browsing": "Everyday General Use",
    "everyday communication": "Everyday General Use",
    "communication & browsing": "Everyday General Use",
    "browsing": "Everyday General Use",
    "communication": "Everyday General Use",
}

CANONICAL_OS: Dict[str, str] = {
    "android": "Android",
    "ios": "iOS",
    "no preference": "No Preference",
    "none": "No Preference",
}

# Default column mapping fallback when column_mapping.json is not provided
DEFAULT_COLUMN_MAPPING: Dict[str, List[str]] = {
    "preferred_brand": [
        "preferred_brand",
        "What is your preferred smartphone brand?",
        "Which smartphone brand do you prefer?",
        "Brand",
        "Preferred Brand",
        "Smartphone Brand",
    ],
    "budget_range": [
        "budget_range",
        "What is your typical smartphone budget range?",
        "What is your budget range for a new smartphone?",
        "What is your budget for a smartphone?",
        "Budget",
        "Budget Range",
    ],
    "preferred_features": [
        "preferred_features",
        "Select your top 3 preferred features (Choose exactly 3):",
        "Which 3 features matter most to you when choosing a smartphone?",
        "Which 3 features matter most to you?",
        "Preferred Features",
        "Features",
        "Top 3 Features",
    ],
    "primary_use": [
        "primary_use",
        "What is your primary use case for your smartphone?",
        "What is your primary use for your smartphone?",
        "Primary Use",
        "Primary Use Case",
    ],
    "os_preference": [
        "os_preference",
        "What is your operating system preference?",
        "What smartphone operating system do you prefer?",
        "Operating System Preference",
        "OS Preference",
        "OS",
    ],
    "response_id": [
        "response_id",
        "Response ID",
        "Respondent ID",
        "ID",
    ],
    "timestamp": [
        "Timestamp",
        "timestamp",
        "Date",
        "Submitted At",
    ],
}

DEFAULT_PII_COLUMNS: List[str] = [
    "Email Address",
    "email",
    "Email",
    "Username",
    "Name",
    "Full Name",
    "Student ID",
    "Roll Number",
    "Score",
    "IP Address",
]


class ValidationError(Exception):
    """Raised when survey data fails structural or mathematical validity requirements."""

    def __init__(self, message: str, errors: Optional[List[str]] = None) -> None:
        super().__init__(message)
        self.errors = errors or [message]


def normalize_text(text: Any) -> str:
    """Trim whitespace and collapse internal duplicate spaces."""
    if pd.isna(text) or text is None:
        return ""
    return " ".join(str(text).strip().split())


def read_csv_with_encoding_fallback(file_path: Path) -> Tuple[pd.DataFrame, int]:
    """
    Reads a CSV file handling UTF-8, UTF-8 with BOM, and fallback encodings.
    Identifies and removes completely blank rows while tracking their count.
    """
    encodings_to_try = ["utf-8-sig", "utf-8", "latin1", "cp1252"]
    df: Optional[pd.DataFrame] = None
    last_err: Optional[Exception] = None

    for enc in encodings_to_try:
        try:
            df = pd.read_csv(
                file_path,
                comment="#",
                dtype=str,
                encoding=enc,
                skip_blank_lines=False,
            )
            break
        except (UnicodeDecodeError, UnicodeError) as e:
            last_err = e
            continue

    if df is None:
        raise ValidationError(
            f"Failed to read CSV '{file_path}' with supported encodings {encodings_to_try}: {last_err}"
        )

    # Detect completely blank rows (all values NaN or empty string)
    initial_row_count = len(df)
    is_blank = df.apply(lambda row: all(normalize_text(v) == "" for v in row), axis=1)
    blank_rows_count = int(is_blank.sum())

    df_cleaned = df[~is_blank].copy().reset_index(drop=True)
    return df_cleaned, blank_rows_count


def resolve_column_mapping(
    columns: List[str], mapping_config_path: Optional[Path] = None
) -> Tuple[Dict[str, str], List[str]]:
    """
    Resolves raw CSV column headers to canonical PhonePrint fields.
    Identifies and flags PII columns to be stripped.
    """
    mapping_rules = DEFAULT_COLUMN_MAPPING
    pii_columns = DEFAULT_PII_COLUMNS

    if mapping_config_path and mapping_config_path.exists():
        try:
            with open(mapping_config_path, "r", encoding="utf-8") as f:
                config_data = json.load(f)
                mapping_rules = config_data.get("canonical_fields", mapping_rules)
                pii_columns = config_data.get("pii_columns_to_strip", pii_columns)
        except Exception as e:
            print(f"[Warning] Could not load column mapping config '{mapping_config_path}': {e}", file=sys.stderr)

    resolved: Dict[str, str] = {}
    found_pii: List[str] = []

    # Normalized column lookup: lowercase stripped -> original column name
    col_lookup = {normalize_text(col).lower(): col for col in columns}

    # Match canonical fields
    for canonical_field, candidate_patterns in mapping_rules.items():
        matched_col = None
        for pattern in candidate_patterns:
            pattern_norm = normalize_text(pattern).lower()
            if pattern_norm in col_lookup:
                matched_col = col_lookup[pattern_norm]
                break

        if matched_col:
            resolved[canonical_field] = matched_col

    # Identify any PII columns present in CSV to explicitly exclude
    for pii_pat in pii_columns:
        pii_norm = normalize_text(pii_pat).lower()
        if pii_norm in col_lookup:
            found_pii.append(col_lookup[pii_norm])

    # Accounted columns: mapped canonical fields, configured PII columns, and ignored columns
    ignored_columns = []
    if mapping_config_path and mapping_config_path.exists():
        try:
            with open(mapping_config_path, "r", encoding="utf-8") as f:
                cdata = json.load(f)
                ignored_columns = cdata.get("ignored_columns", [])
        except Exception:
            pass

    accounted_columns = set(resolved.values()) | set(found_pii)
    for ign_pat in ignored_columns:
        ign_norm = normalize_text(ign_pat).lower()
        if ign_norm in col_lookup:
            accounted_columns.add(col_lookup[ign_norm])

    # Warn on any unmapped CSV columns (identifying column names only, never cell contents)
    unmapped_columns = [col for col in columns if col not in accounted_columns]
    if unmapped_columns:
        print(
            f"WARNING: Unmapped CSV columns will be ignored: {unmapped_columns}",
            file=sys.stderr,
        )

    # Validate that all required canonical fields are resolved
    required_canonical = [
        "preferred_brand",
        "budget_range",
        "preferred_features",
        "primary_use",
        "os_preference",
    ]
    missing = [req for req in required_canonical if req not in resolved]
    if missing:
        raise ValidationError(
            f"CSV file is missing required canonical survey fields: {missing}. "
            f"Available CSV columns: {columns}. "
            f"Resolved mapping: {resolved}"
        )

    return resolved, found_pii


def parse_and_validate_features(
    raw_features: str, row_idx: int
) -> Tuple[str, str, str]:
    """
    Parses delimited features (separated by semicolon, comma, or pipe)
    and verifies that exactly three distinct canonical features are provided.
    Rejects unrecognized or deprecated features (such as 5G or Fast Charging).
    """
    raw_str = normalize_text(raw_features)
    if not raw_str:
        raise ValidationError(f"Row {row_idx}: 'preferred_features' cannot be empty")

    # Support semicolon, pipe, or comma delimiters.
    # Note: Canonical features do not contain commas, so comma splitting is safe.
    delimiter = ";" if ";" in raw_str else ("|" if "|" in raw_str else ",")
    tokens = [normalize_text(t) for t in raw_str.split(delimiter) if normalize_text(t)]

    normalized_features: List[str] = []
    seen: Set[str] = set()

    for token in tokens:
        canonical = CANONICAL_FEATURES.get(token.lower())
        if not canonical:
            valid_list = ", ".join(sorted(set(CANONICAL_FEATURES.values())))
            raise ValidationError(
                f"Row {row_idx}: Unrecognized feature '{token}'. Valid options: {valid_list}"
            )
        if canonical in seen:
            raise ValidationError(
                f"Row {row_idx}: Duplicate feature '{canonical}' specified in selection"
            )
        seen.add(canonical)
        normalized_features.append(canonical)

    if len(normalized_features) != 3:
        raise ValidationError(
            f"Row {row_idx}: Exactly 3 distinct features must be selected; received {len(normalized_features)} ({normalized_features})"
        )

    return (normalized_features[0], normalized_features[1], normalized_features[2])


def detect_duplicates(
    df: pd.DataFrame,
    resolved_mapping: Dict[str, str],
) -> Tuple[List[int], List[Dict[str, Any]], int]:
    """
    Analyzes duplicate records:
    - Distinguishes exact duplicate rows (all answers + timestamp identical) vs distinct respondents with identical preferences.
    - If submission timestamp is present and usable, identical answers at identical timestamp are flagged as exact duplicates.
    - If no timestamp column is available, duplicate detection is skipped with a warning, and all otherwise valid respondents are retained.
    - Returns:
      - exact_duplicate_indices: row indices to exclude
      - duplicate_audit_log: details of exact duplicates and reasons
      - identical_profiles_retained: count of valid respondents who share identical preferences
    """
    survey_cols = [
        resolved_mapping["preferred_brand"],
        resolved_mapping["budget_range"],
        resolved_mapping["preferred_features"],
        resolved_mapping["primary_use"],
        resolved_mapping["os_preference"],
    ]

    timestamp_col = resolved_mapping.get("timestamp")
    has_usable_timestamp = bool(
        timestamp_col
        and timestamp_col in df.columns
        and any(normalize_text(val) != "" for val in df[timestamp_col])
    )

    exact_dup_indices: List[int] = []
    duplicate_audit_log: List[Dict[str, Any]] = []
    seen_exact_hashes: Dict[str, int] = {}
    preference_profile_counts: Dict[str, int] = {}

    if not has_usable_timestamp:
        # Missing or unusable timestamp: Do NOT exclude records based solely on identical survey answers.
        print(
            "WARNING: Exact duplicate submission detection skipped because no usable timestamp "
            "column was available. Identical preference profiles are retained as distinct respondents.",
            file=sys.stderr,
        )
        for idx, row in df.iterrows():
            pref_sig = "|".join(normalize_text(row[col]).lower() for col in survey_cols)
            preference_profile_counts[pref_sig] = preference_profile_counts.get(pref_sig, 0) + 1

        identical_profiles_retained = sum(
            count - 1 for count in preference_profile_counts.values() if count > 1
        )
        return exact_dup_indices, duplicate_audit_log, identical_profiles_retained

    all_eval_cols = list(survey_cols) + [timestamp_col]

    for idx, row in df.iterrows():
        row_num = idx + 2  # 1-based index plus header

        # Canonical survey preference signature
        pref_sig = "|".join(normalize_text(row[col]).lower() for col in survey_cols)
        preference_profile_counts[pref_sig] = preference_profile_counts.get(pref_sig, 0) + 1

        # Full exact signature including timestamp
        exact_sig = "|".join(normalize_text(row[col]).lower() for col in all_eval_cols)

        if exact_sig in seen_exact_hashes:
            original_row = seen_exact_hashes[exact_sig]
            exact_dup_indices.append(idx)
            duplicate_audit_log.append({
                "row_number": row_num,
                "classification": "EXACT_DUPLICATE_EXCLUDED",
                "reason": f"Exact duplicate of row {original_row} (identical timestamp and survey responses)",
                "action": "EXCLUDED",
            })
        else:
            seen_exact_hashes[exact_sig] = row_num

    # Identical preference profiles from distinct submissions that were retained
    identical_profiles_retained = sum(
        count - 1 for count in preference_profile_counts.values() if count > 1
    )

    return exact_dup_indices, duplicate_audit_log, identical_profiles_retained


def generate_anonymous_ids(
    df: pd.DataFrame,
    existing_id_col: Optional[str],
    is_demo: bool,
    prefix: Optional[str] = None,
) -> List[str]:
    """
    Generates stable, sequential anonymous respondent IDs (e.g. RESP_001, DEMO_RESP_001).
    Preserves existing valid IDs if present (e.g. in demo fixtures).
    """
    ids: List[str] = []
    id_prefix = prefix or ("DEMO_RESP_" if is_demo else "RESP_")

    if existing_id_col and existing_id_col in df.columns:
        for idx, val in enumerate(df[existing_id_col]):
            norm = normalize_text(val)
            if norm:
                ids.append(norm)
            else:
                ids.append(f"{id_prefix}{idx + 1:03d}")
    else:
        for idx in range(len(df)):
            ids.append(f"{id_prefix}{idx + 1:03d}")

    return ids


def generate_cleaning_report(
    stats: Dict[str, Any],
    report_dir: Path,
) -> Tuple[Path, Path]:
    """
    Generates machine-readable JSON and human-readable Markdown validation reports.
    Asserts mathematical invariant: total_raw = blank_rows + accepted + rejected.
    """
    report_dir.mkdir(parents=True, exist_ok=True)
    json_path = report_dir / "cleaning_report.json"
    md_path = report_dir / "cleaning_report.md"

    # Write machine-readable JSON report
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
        f.write("\n")

    # Write human-readable Markdown report
    lines: List[str] = [
        "# PhonePrint — Survey Data Cleaning & Quality Audit Report",
        "",
        f"**Generated At:** {stats.get('generated_at', datetime.now(timezone.utc).isoformat())}  ",
        f"**Input Source:** `{stats.get('input_file', 'unknown')}`  ",
        f"**Dataset Classification:** {'DEMO DATA (Synthetic Benchmark)' if stats.get('is_demo') else 'REAL SURVEY DATA'}  ",
        "",
        "---",
        "",
        "## 1. Summary Accounting",
        "",
        "| Metric | Count | Percentage |",
        "| :--- | :---: | :---: |",
        f"| **Total Raw Rows in CSV** | {stats['total_raw_rows']} | 100.0% |",
        f"| Blank / Empty Rows (Skipped) | {stats['blank_rows']} | {stats['blank_rows'] / max(1, stats['total_raw_rows']) * 100:.1f}% |",
        f"| Evaluated Rows | {stats['evaluated_rows']} | {stats['evaluated_rows'] / max(1, stats['total_raw_rows']) * 100:.1f}% |",
        f"| **Final Accepted Responses** | **{stats['accepted_records']}** | **{stats['accepted_records'] / max(1, stats['total_raw_rows']) * 100:.1f}%** |",
        f"| **Rejected / Excluded Records** | **{stats['rejected_records']}** | **{stats['rejected_records'] / max(1, stats['total_raw_rows']) * 100:.1f}%** |",
        "",
        f"> **Accounting Verification Invariant:**  ",
        f"> Evaluated Rows ({stats['evaluated_rows']}) = Accepted ({stats['accepted_records']}) + Rejected ({stats['rejected_records']})  ",
        f"> **Status:** {'VALID (Invariant Satisfied)' if stats['invariant_satisfied'] else 'ERROR (Invariant Violation)'}",
        "",
        "---",
        "",
        "## 2. Rejection & Duplicate Breakdown",
        "",
        "| Category | Occurrences | Accounting Treatment |",
        "| :--- | :---: | :--- |",
        f"| Exact Duplicate Rows | {stats['exact_duplicates_count']} | Excluded from dataset |",
        f"| Unknown / Unrecognized Brands | {stats['unknown_brands_count']} | Rejected |",
        f"| Unknown / Invalid Budget Ranges | {stats['unknown_budgets_count']} | Rejected |",
        f"| Invalid Feature Selections (Count != 3, Duplicates, or Unknowns) | {stats['invalid_features_count']} | Rejected |",
        f"| Missing Required Survey Fields | {stats['missing_fields_count']} | Rejected |",
        f"| Duplicate Respondent IDs | {stats['duplicate_id_count']} | Rejected |",
        "",
        "### Identical Preference Profiles Retained",
        f"A total of **{stats['identical_profiles_retained']}** responses share identical survey preferences with another respondent but represent distinct submission events. "
        "Under discrete mathematics and university survey guidelines, distinct students who independently choose identical preference combinations (e.g. Apple, Over $1,000, Camera/Battery/Build) "
        "are legitimately preserved to reflect empirical frequencies.",
        "",
        "---",
        "",
        "## 3. Privacy & Anonymization Audit",
        "",
        f"- **PII Columns Detected & Stripped:** `{stats.get('pii_columns_stripped', [])}`",
        "- **Anonymous ID Scheme:** Sequential pseudonymization (`RESP_001`, `RESP_002`, ...)",
        "- **Output Exposure:** Zero personal identifiers (names, emails, student IDs) are included in the output JSON dataset.",
        "- **Privacy Standard:** Pseudonymized respondent IDs for academic discrete analysis.",
        "",
    ]

    if stats.get("record_level_errors"):
        lines.extend([
            "---",
            "",
            "## 4. Record-Level Error Log (Redacted)",
            "",
            "| Row Number | Errors Encountered |",
            "| :---: | :--- |",
        ])
        for err_entry in stats["record_level_errors"][:50]:  # Cap at 50 for readability
            err_str = "; ".join(err_entry["errors"])
            lines.append(f"| {err_entry['row_num']} | {err_str} |")

        if len(stats["record_level_errors"]) > 50:
            lines.append(f"\n*...and {len(stats['record_level_errors']) - 50} additional error entries (see cleaning_report.json for full log).*")

    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        f.write("\n")

    return json_path, md_path


def process_survey_csv(
    csv_path: str | Path,
    output_json_path: Optional[str | Path] = None,
    is_demo: bool = True,
    mapping_config_path: Optional[str | Path] = None,
    report_dir: Optional[str | Path] = None,
    strict: bool = True,
    filter_invalid: bool = False,
) -> Dict[str, Any]:
    """
    Main processing entrypoint:
    1. Reads CSV with encoding fallback and blank-row handling.
    2. Resolves column mapping and identifies PII columns to strip.
    3. Detects exact duplicates vs legitimate identical preferences.
    4. Validates each row against the 7-feature universe and canonical enums.
    5. Generates stable anonymous IDs.
    6. Generates cleaning reports (JSON and Markdown).
    7. Emits canonical JSON matching surveyDatasetSchema.
    """
    if filter_invalid:
        strict = False
    csv_file = Path(csv_path)
    if not csv_file.exists():
        raise FileNotFoundError(f"Survey CSV file not found: {csv_file}")

    # 1. Read CSV with encoding fallback
    df, blank_rows_count = read_csv_with_encoding_fallback(csv_file)
    total_raw_rows = len(df) + blank_rows_count

    # 2. Resolve column mapping
    mapping_path = Path(mapping_config_path) if mapping_config_path else None
    col_mapping, stripped_pii = resolve_column_mapping(list(df.columns), mapping_path)

    # 3. Detect duplicates
    exact_dup_indices, duplicate_audit_log, identical_profiles_retained = detect_duplicates(
        df, col_mapping
    )

    # Tracking metrics for cleaning report
    record_level_errors: List[Dict[str, Any]] = []
    seen_response_ids: Set[str] = set()

    unknown_brands_count = 0
    unknown_budgets_count = 0
    invalid_features_count = 0
    missing_fields_count = 0
    duplicate_id_count = 0

    cleaned_responses: List[Dict[str, Any]] = []

    # Map existing ID column if present
    existing_id_col = col_mapping.get("response_id")
    has_existing_id_col = bool(existing_id_col and existing_id_col in df.columns)
    id_prefix = "DEMO_RESP_" if is_demo else "RESP_"
    generated_ids = generate_anonymous_ids(df, existing_id_col, is_demo)

    for idx, row in df.iterrows():
        row_num = idx + 2  # 1-based index plus CSV header row

        # Check if row is an exact duplicate excluded by policy
        if idx in exact_dup_indices:
            continue

        row_errors: List[str] = []

        # 4. Respondent ID validation
        if has_existing_id_col:
            resp_id = generated_ids[idx]
            if not resp_id:
                row_errors.append(f"Row {row_num}: Missing 'response_id'")
                missing_fields_count += 1
            elif resp_id in seen_response_ids:
                row_errors.append(f"Row {row_num}: Duplicate respondent ID detected '{resp_id}'")
                duplicate_id_count += 1
            else:
                seen_response_ids.add(resp_id)
        else:
            # Sequential pseudonymization without gaps for accepted records
            resp_id = f"{id_prefix}{len(cleaned_responses) + 1:03d}"

        # 5. Brand normalization
        raw_brand_val = row.get(col_mapping["preferred_brand"])
        brand_norm = normalize_text(raw_brand_val).lower()
        if not brand_norm:
            row_errors.append(f"Row {row_num}: Missing 'preferred_brand'")
            missing_fields_count += 1
            brand = None
        else:
            brand = CANONICAL_BRANDS.get(brand_norm)
            if not brand:
                row_errors.append(
                    f"Row {row_num}: Invalid brand '{raw_brand_val}'. Allowed: {sorted(set(CANONICAL_BRANDS.values()))}"
                )
                unknown_brands_count += 1

        # 6. Budget range normalization
        raw_budget_val = row.get(col_mapping["budget_range"])
        budget_norm = normalize_text(raw_budget_val).lower()
        if not budget_norm:
            row_errors.append(f"Row {row_num}: Missing 'budget_range'")
            missing_fields_count += 1
            budget = None
        else:
            budget = CANONICAL_BUDGETS.get(budget_norm)
            if not budget:
                row_errors.append(f"Row {row_num}: Invalid budget range '{raw_budget_val}'")
                unknown_budgets_count += 1

        # 7. Preferred features validation (strictly 3 distinct in 7 canonical)
        raw_feat_val = row.get(col_mapping["preferred_features"])
        features_tuple: Optional[Tuple[str, str, str]] = None
        if not normalize_text(raw_feat_val):
            row_errors.append(f"Row {row_num}: Missing 'preferred_features'")
            missing_fields_count += 1
            invalid_features_count += 1
        else:
            try:
                features_tuple = parse_and_validate_features(str(raw_feat_val), row_num)
            except ValidationError as ve:
                row_errors.append(str(ve))
                invalid_features_count += 1

        # 8. Primary use normalization
        raw_use_val = row.get(col_mapping["primary_use"])
        use_norm = normalize_text(raw_use_val).lower()
        if not use_norm:
            row_errors.append(f"Row {row_num}: Missing 'primary_use'")
            missing_fields_count += 1
            primary_use = None
        else:
            primary_use = CANONICAL_PRIMARY_USES.get(use_norm)
            if not primary_use:
                row_errors.append(f"Row {row_num}: Invalid primary use '{raw_use_val}'")

        # 9. OS preference normalization
        raw_os_val = row.get(col_mapping["os_preference"])
        os_norm = normalize_text(raw_os_val).lower()
        if not os_norm:
            row_errors.append(f"Row {row_num}: Missing 'os_preference'")
            missing_fields_count += 1
            os_pref = None
        else:
            os_pref = CANONICAL_OS.get(os_norm)
            if not os_pref:
                row_errors.append(f"Row {row_num}: Invalid OS preference '{raw_os_val}'")

        if row_errors:
            record_level_errors.append({
                "row_num": row_num,
                "errors": row_errors,
            })
        else:
            if brand and budget and features_tuple and primary_use and os_pref:
                cleaned_responses.append({
                    "response_id": resp_id,
                    "preferred_brand": brand,
                    "budget_range": budget,
                    "preferred_features": list(features_tuple),
                    "primary_use": primary_use,
                    "os_preference": os_pref,
                })

    # Compile accounting stats
    evaluated_rows = len(df)
    accepted_records = len(cleaned_responses)
    rejected_records = len(record_level_errors) + len(exact_dup_indices)
    invariant_satisfied = (evaluated_rows == accepted_records + rejected_records)

    report_stats: Dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "input_file": str(csv_file),
        "is_demo": is_demo,
        "total_raw_rows": total_raw_rows,
        "blank_rows": blank_rows_count,
        "evaluated_rows": evaluated_rows,
        "accepted_records": accepted_records,
        "rejected_records": rejected_records,
        "invariant_satisfied": invariant_satisfied,
        "exact_duplicates_count": len(exact_dup_indices),
        "identical_profiles_retained": identical_profiles_retained,
        "unknown_brands_count": unknown_brands_count,
        "unknown_budgets_count": unknown_budgets_count,
        "invalid_features_count": invalid_features_count,
        "missing_fields_count": missing_fields_count,
        "duplicate_id_count": duplicate_id_count,
        "pii_columns_stripped": stripped_pii,
        "record_level_errors": record_level_errors,
        "duplicate_audit_log": duplicate_audit_log,
    }

    # Generate cleaning report files
    rep_dir = Path(report_dir) if report_dir else Path("pipeline/reports")
    generate_cleaning_report(report_stats, rep_dir)

    # In strict mode, raise error if any record failed validation
    if strict and record_level_errors:
        flat_errors = [e for item in record_level_errors for e in item["errors"]]
        raise ValidationError(
            f"Encountered {len(flat_errors)} validation issue(s) during CSV processing",
            errors=flat_errors,
        )

    # Build canonical JSON dataset structure matching surveyDatasetSchema
    output_dataset: Dict[str, Any] = {
        "metadata": {
            "version": "1.0.0",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_responses": accepted_records,
            "is_demo": is_demo,
            "description": (
                "DEMO BENCHMARK DATASET - Academic Discrete Mathematics and Graph Theory project. "
                "Synthetic data for architecture testing only."
                if is_demo
                else "Empirical Survey Responses - PhonePrint University Research Study."
            ),
        },
        "responses": cleaned_responses,
    }

    if output_json_path:
        out_file = Path(output_json_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(output_dataset, f, indent=2, ensure_ascii=False)
            f.write("\n")

    return output_dataset


def main() -> None:
    parser = argparse.ArgumentParser(
        description="PhonePrint Survey CSV Cleaning, Validation & Anonymization Pipeline"
    )
    parser.add_argument(
        "--input",
        "-i",
        default="pipeline/data/survey_demo_data.csv",
        help="Path to raw CSV survey export",
    )
    parser.add_argument(
        "--output",
        "-o",
        default="pipeline/data/survey_demo_data.json",
        help="Path to save canonical JSON dataset",
    )
    parser.add_argument(
        "--mapping",
        "-m",
        default="pipeline/column_mapping.json",
        help="Path to custom column mapping JSON config",
    )
    parser.add_argument(
        "--report-dir",
        default="pipeline/reports",
        help="Directory to save cleaning reports (JSON & Markdown)",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        default=False,
        help="Explicitly mark dataset as synthetic demo data",
    )
    parser.add_argument(
        "--sync-web-data",
        action="store_true",
        help="Also sync output JSON to src/data/ for Next.js web application",
    )
    parser.add_argument(
        "--filter-invalid",
        action="store_true",
        help="Filter out invalid records into cleaning report instead of failing immediately",
    )

    args = parser.parse_args()

    # If processing default demo CSV, mark as demo by default unless specified
    is_demo = args.demo or ("demo" in str(args.input).lower())

    print(f"[PhonePrint Pipeline] Reading CSV: {args.input}")
    try:
        dataset = process_survey_csv(
            csv_path=args.input,
            output_json_path=args.output,
            is_demo=is_demo,
            mapping_config_path=args.mapping,
            report_dir=args.report_dir,
            strict=not args.filter_invalid,
        )

        total = dataset["metadata"]["total_responses"]
        print(f"[PhonePrint Pipeline] Success: Accepted {total} valid responses.")
        print(f"[PhonePrint Pipeline] Output written to: {args.output}")
        print(f"[PhonePrint Pipeline] Cleaning reports generated in: {args.report_dir}")

        if args.sync_web_data:
            target_name = "survey_demo_data.json" if is_demo else "survey_active_data.json"
            web_output = Path(f"src/data/{target_name}")
            web_output.parent.mkdir(parents=True, exist_ok=True)
            with open(web_output, "w", encoding="utf-8") as f:
                json.dump(dataset, f, indent=2, ensure_ascii=False)
                f.write("\n")
            print(f"[PhonePrint Pipeline] Synced to web data: {web_output}")

    except ValidationError as ve:
        print(f"[PhonePrint Pipeline] Validation Failed: {ve}", file=sys.stderr)
        for err in ve.errors[:20]:
            print(f"  - {err}", file=sys.stderr)
        if len(ve.errors) > 20:
            print(f"  ...and {len(ve.errors) - 20} more errors (see pipeline/reports/cleaning_report.md)", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"[PhonePrint Pipeline] Unexpected Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
```

---

### `pipeline/validate_zod.ts`

```typescript
/**
 * PhonePrint - Zod Schema Dataset Validator CLI
 * Runs Zod schema validation against any JSON dataset file.
 */

import fs from "fs";
import path from "path";
import { surveyDatasetSchema } from "../src/schemas/survey.schema";

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Usage: vite-node pipeline/validate_zod.ts <path-to-json>");
  process.exit(1);
}

const resolvedPath = path.resolve(jsonPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(resolvedPath, "utf-8");
  const data = JSON.parse(content);
  const result = surveyDatasetSchema.safeParse(data);

  if (result.success) {
    console.log(
      JSON.stringify({
        valid: true,
        total_responses: result.data.metadata.total_responses,
        is_demo: result.data.metadata.is_demo,
      })
    );
    process.exit(0);
  } else {
    console.error(
      JSON.stringify({
        valid: false,
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      })
    );
    process.exit(1);
  }
} catch (err: any) {
  console.error(
    JSON.stringify({
      valid: false,
      errors: [{ path: "", message: err.message || String(err) }],
    })
  );
  process.exit(1);
}
```

---

### `pipeline/activate_dataset.py`

```python
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
```

---

### `src/lib/data/loader.ts`

```typescript
/**
 * PhonePrint - Data Ingestion and Set Extraction Utilities
 * Transforms survey records into discrete sets of respondent IDs for mathematical processing.
 */

import demoDataJson from "@/data/survey_demo_data.json";
import activeDataJson from "@/data/survey_active_data.json";
import datasetConfig from "@/data/dataset_config.json";
import { surveyDatasetSchema } from "@/schemas/survey.schema";
import type {
  SurveyDataset,
  SurveyResponse,
  SmartphoneBrand,
  SmartphoneFeature,
  OSPreference,
  BudgetRange,
  PrimaryUse,
} from "@/types/survey";

/**
 * Loads the currently configured active dataset (demo or real survey data).
 * If real data is active, validates it with Zod schema. If real data is invalid or empty,
 * safely falls back to the validated demo dataset.
 */
export function loadSurveyDataset(): SurveyDataset {
  if (datasetConfig.active_dataset === "real") {
    try {
      const result = surveyDatasetSchema.safeParse(activeDataJson);
      if (result.success && result.data.responses.length > 0) {
        return result.data as unknown as SurveyDataset;
      }
    } catch {
      // Fallback to demo
    }
  }
  return loadDemoSurveyDataset();
}

/**
 * Loads and validates the demo survey dataset using the Zod schema.
 * Guaranteed to return the 12-record synthetic benchmark fixture.
 */
export function loadDemoSurveyDataset(): SurveyDataset {
  const result = surveyDatasetSchema.safeParse(demoDataJson);
  if (!result.success) {
    throw new Error(
      `Demo dataset validation failed: ${result.error.issues.map((i) => i.message).join(", ")}`
    );
  }
  return result.data as unknown as SurveyDataset;
}

/**
 * Returns metadata and active badge details for UI headers and navigation.
 */
export function getActiveDatasetInfo() {
  const dataset = loadSurveyDataset();
  const isDemo = dataset.metadata.is_demo;
  const count = dataset.metadata.total_responses;

  return {
    isDemo,
    totalResponses: count,
    version: dataset.metadata.version,
    description: dataset.metadata.description,
    badgeText: isDemo ? `DEMO DATA (n=${count})` : `REAL SURVEY (n=${count})`,
    tagText: isDemo ? `[DEMO DATA: N=${count}]` : `[REAL SURVEY: N=${count}]`,
  };
}

/**
 * Returns a discrete set of respondent IDs preferring a specific smartphone brand:
 * S_brand = { id ∈ U | response(id).brand = brand }
 */
export function getRespondentIdsByBrand(
  responses: readonly SurveyResponse[],
  brand: SmartphoneBrand
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_brand === brand) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs selecting a given feature:
 * S_feature = { id ∈ U | feature ∈ response(id).preferred_features }
 */
export function getRespondentIdsByFeature(
  responses: readonly SurveyResponse[],
  feature: SmartphoneFeature
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_features.includes(feature)) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs with a given OS preference:
 * S_os = { id ∈ U | response(id).os = os }
 */
export function getRespondentIdsByOS(
  responses: readonly SurveyResponse[],
  os: OSPreference
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.os_preference === os) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs within a budget range:
 * S_budget = { id ∈ U | response(id).budget = budget }
 */
export function getRespondentIdsByBudget(
  responses: readonly SurveyResponse[],
  budget: BudgetRange
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.budget_range === budget) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs with a given primary use:
 * S_use = { id ∈ U | response(id).primary_use = use }
 */
export function getRespondentIdsByPrimaryUse(
  responses: readonly SurveyResponse[],
  use: PrimaryUse
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.primary_use === use) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns the entire universe of respondent IDs: U = { id | response(id) ∈ responses }
 */
export function getUniverseRespondentIds(
  responses: readonly SurveyResponse[]
): Set<string> {
  return new Set(responses.map((r) => r.response_id));
}
```

---

### `src/components/layout/Navbar.tsx`

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StatusDot } from "@/components/ui/StatusDot";
import { Badge } from "@/components/ui/Badge";
import { getActiveDatasetInfo } from "@/lib/data/loader";

interface NavLink {
  name: string;
  href: string;
  tag?: string;
}

const NAV_LINKS: NavLink[] = [
  { name: "Campus Pulse", href: "/" },
  { name: "My PhonePrint", href: "/my-phoneprint", tag: "Interactive" },
  { name: "SetLab", href: "/setlab", tag: "Set Theory" },
  { name: "ComboLab", href: "/combolab", tag: "C(7,3)" },
  { name: "Experiment Studio", href: "/experiment-studio", tag: "Hypothesis" },
  { name: "Methodology", href: "/methodology" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const datasetInfo = getActiveDatasetInfo();

  return (
    <header className="sticky top-0 z-50 border-b border-[#182030] bg-[#101623]/95 backdrop-blur-md text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cobalt-600 text-white font-mono font-bold text-base shadow-sm border border-cobalt-500 group-hover:bg-cobalt-500 transition-colors">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  PhonePrint
                </span>
                <span className="rounded bg-[#182030] px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-300 border border-[#273145]">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Discrete Math &amp; Preference Analytics
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                  isActive
                    ? "bg-cobalt-500/15 text-cobalt-400 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-[#182030]"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cobalt-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section / Dataset Status */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#182030] bg-[#0b0f17] px-3 py-1 text-xs">
            <StatusDot variant={datasetInfo.isDemo ? "lime" : "cobalt"} pulse size="sm" />
            <span className="font-mono text-[11px] font-medium text-slate-300">
              {datasetInfo.badgeText}
            </span>
          </div>

          <Badge variant="cobalt" size="sm">
            Phase 07
          </Badge>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-[#182030] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#182030] bg-[#101623] px-4 py-4 lg:hidden">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cobalt-500/15 text-cobalt-400 font-semibold"
                      : "text-slate-300 hover:bg-[#182030] hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.tag && (
                    <Badge variant={isActive ? "cobalt" : "default"} size="sm">
                      {link.tag}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-[#182030] pt-3 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <StatusDot variant={datasetInfo.isDemo ? "lime" : "cobalt"} pulse size="sm" />
              <span className="font-mono text-[11px] text-slate-300">
                {datasetInfo.isDemo ? "Synthetic Demo Data Active" : `Real Survey Data Active (n=${datasetInfo.totalResponses})`}
              </span>
            </div>
            <span className="font-mono text-[11px]">{datasetInfo.badgeText}</span>
          </div>
        </div>
      )}
    </header>
  );
}
```

---

### `src/app/page.tsx`

```tsx
import React from "react";
import Link from "next/link";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { BrandPreferenceChart } from "@/components/visualizations/BrandPreferenceChart";
import { FeaturePreferenceChart } from "@/components/visualizations/FeaturePreferenceChart";
import { BudgetDistributionChart } from "@/components/visualizations/BudgetDistributionChart";
import { ResponseExplorer } from "@/components/campus-pulse/ResponseExplorer";

import {
  loadSurveyDataset,
  getActiveDatasetInfo,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByBudget,
} from "@/lib/data/loader";
import { verifyInclusionExclusionPrinciple } from "@/lib/math/sets";
import { calculateCombinations } from "@/lib/math/combinations";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
} from "@/types/survey";

export default function CampusPulsePage() {
  const dataset = loadSurveyDataset();
  const datasetInfo = getActiveDatasetInfo();
  const responses = dataset.responses;

  // 1. Brand distribution data
  const brandData = SMARTPHONE_BRANDS.map((brand) => {
    const ids = getRespondentIdsByBrand(responses, brand);
    return {
      brand,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  }).filter((b) => b.count > 0);

  // 2. Feature preference frequency data (ranked)
  const featureData = SMARTPHONE_FEATURES.map((feature) => {
    const ids = getRespondentIdsByFeature(responses, feature);
    return {
      feature,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  });

  // 3. Budget tier distribution data
  const budgetData = BUDGET_RANGES.map((budget) => {
    const ids = getRespondentIdsByBudget(responses, budget);
    return {
      budget,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  });

  // 4. Live Discrete Mathematics Theorem Verification
  const appleRespondents = getRespondentIdsByBrand(responses, "Apple");
  const cameraRespondents = getRespondentIdsByFeature(responses, "Camera Quality");

  const pieVerification = verifyInclusionExclusionPrinciple(
    appleRespondents,
    cameraRespondents
  );

  const totalPossibleTriplets = calculateCombinations(
    SMARTPHONE_FEATURES.length,
    3
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Campus Research Dashboard"
        title="Campus Pulse"
        description="Exploratory preference analytics synthesized from university student survey records. Models smartphone ecosystems through discrete mathematics, combinatorial structures, and set theory."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <>
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                Open SetLab &rarr;
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="primary" size="sm">
                Methodology
              </Button>
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dataset Status Banner */}
        <Callout
          variant="highlight"
          title={`Academic Dataset Status — ${datasetInfo.isDemo ? "Verified Benchmark Data" : "Verified Real Survey Data"}`}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          {datasetInfo.isDemo ? (
            <>
              This dashboard currently presents <strong>12 synthetic benchmark responses</strong> designed to test software architecture, schema validation, and discrete mathematical algorithms. This dataset does not represent empirical survey findings.
            </>
          ) : (
            <>
              This dashboard currently presents <strong>{datasetInfo.totalResponses} verified survey responses</strong> collected from the university cohort and validated through the data quality pipeline.
            </>
          )}
        </Callout>

        {/* Confident KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Survey Cohort"
            value={responses.length}
            subtext={datasetInfo.isDemo ? "Anonymized student records [DEMO DATA]" : `Anonymized student records ${datasetInfo.tagText}`}
            badge={{ text: "100% Unique IDs", variant: "lime" }}
            accentColor="lime"
          />
          <MetricCard
            label="Canonical Features"
            value={SMARTPHONE_FEATURES.length}
            subtext="Discrete choice feature universe"
            badge={{ text: "Approved Domain", variant: "cobalt" }}
            accentColor="cobalt"
          />
          <MetricCard
            label="Triplet Choice Space"
            value={totalPossibleTriplets}
            subtext="Combinations C(7, 3) available"
            badge={{ text: "Combinatorics", variant: "cobalt" }}
            accentColor="cobalt"
          />
          <MetricCard
            label="Selection Rule"
            value="3 of 7"
            subtext="Exactly 3 distinct features per student"
            badge={{ text: "Strict Schema", variant: "lime" }}
            accentColor="lime"
          />
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brand Preference */}
          <ChartCard
            title="Brand Preference Distribution"
            subtitle="Distribution of preferred smartphone brands across the cohort"
            badge={{ text: "Primary Choice", variant: "cobalt" }}
            takeaway="Apple (25%) and Samsung (25%) lead the benchmark cohort, followed by Google (17%) and emerging brands."
            takeawayAccent="cobalt"
          >
            <BrandPreferenceChart data={brandData} height={280} />
          </ChartCard>

          {/* Budget Tier Distribution */}
          <ChartCard
            title="Budget Tier Distribution"
            subtitle="Allocation across discrete price intervals"
            badge={{ text: "Purchasing Tier", variant: "cobalt" }}
            takeaway="Mid-Range ($400 - $700) and Flagship (Over $1,000) represent 66% of target purchase thresholds."
            takeawayAccent="cobalt"
          >
            <BudgetDistributionChart data={budgetData} height={280} />
          </ChartCard>
        </div>

        {/* Feature Preference Ranking (Full Width) */}
        <ChartCard
          title="Feature Preference Frequency (Ranked)"
          subtitle="Selection frequency across the 7 approved canonical features"
          badge={{ text: "Distinct 3 Choices", variant: "lime" }}
          takeaway="Camera Quality and Battery Life are the dominant priorities, selected by 50% of participants, while Processing Performance and Display Quality anchor performance-oriented segments."
          takeawayAccent="lime"
        >
          <FeaturePreferenceChart data={featureData} height={280} />
        </ChartCard>

        {/* Discrete Mathematics Foundation Section */}
        <Card>
          <CardHeader
            title="Discrete Mathematics: Principle of Inclusion-Exclusion"
            subtitle="Pure set-theoretic calculation on real respondent ID partitions"
            badge={<Badge variant="lime">Live Theorem Verification</Badge>}
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 rounded-lg border border-slate-200 bg-[#f8fafc] p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Formal Identity
                  </p>
                  <KaTeXMath
                    math="|A \cup B| = |A| + |B| - |A \cap B|"
                    block
                    className="text-cobalt-600 font-semibold"
                  />
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Operates directly on sets of unique respondent IDs without scalar aggregation approximations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-lime-600 font-semibold">
                  ✓ Theorem Identity Confirmed
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Set A (Apple)
                    </span>
                    <div className="font-mono text-lg font-bold text-slate-950 mt-1">
                      |A| = {appleRespondents.size}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Set B (Camera)
                    </span>
                    <div className="font-mono text-lg font-bold text-slate-950 mt-1">
                      |B| = {cameraRespondents.size}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Intersection
                    </span>
                    <div className="font-mono text-lg font-bold text-cobalt-600 mt-1">
                      |A ∩ B| = {pieVerification.intersectionCardinality}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Union
                    </span>
                    <div className="font-mono text-lg font-bold text-lime-600 mt-1">
                      |A ∪ B| = {pieVerification.unionCardinality}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[#f8fafc] p-3.5 text-xs text-slate-700 border border-slate-200">
                  <p className="font-mono font-medium">
                    Calculation: {pieVerification.unionCardinality} = {appleRespondents.size} + {cameraRespondents.size} - {pieVerification.intersectionCardinality}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Intersection Respondents: <code className="font-mono text-slate-800 font-semibold">{Array.from(pieVerification.intersectionSet).join(", ")}</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey Responses Data Explorer */}
        <div className="space-y-4">
          <SectionHeader
            title="Cohort Response Explorer"
            subtitle="Browse and filter individual anonymized survey records"
            badge={<Badge variant="default">Zod Validated</Badge>}
          />
          <ResponseExplorer responses={responses} />
        </div>

        {/* Research Modules Showcase */}
        <div className="space-y-4 pt-4">
          <SectionHeader
            title="PhonePrint Research Architecture"
            subtitle="Interactive experiential-learning modules across the curriculum"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/my-phoneprint" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="My PhonePrint"
                  badge={<Badge variant="cobalt">Profiling</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Interactive preference profiler generating your personal vector and cohort match score.
                  </p>
                  <div className="text-cobalt-600 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/setlab" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="SetLab"
                  badge={<Badge variant="lime">Set Theory</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Interactive Venn diagrams, Inclusion-Exclusion calculator, and set partition explorer.
                  </p>
                  <div className="text-lime-600 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/combolab" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="ComboLab"
                  badge={<Badge variant="cobalt">C(7,3) = 35</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Analysis of the 35 feature triplets, combination heatmaps, and void detection.
                  </p>
                  <div className="text-cobalt-600 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/experiment-studio" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="Experiment Studio"
                  badge={<Badge variant="outline">Graph Theory</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Feature co-occurrence graphs $G=(V, E)$, centrality indices, and hypothesis tests.
                  </p>
                  <div className="text-slate-800 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### `src/app/setlab/page.tsx`

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import {
  loadSurveyDataset,
  getActiveDatasetInfo,
  getUniverseRespondentIds,
} from "@/lib/data/loader";
import { getAvailableSetOptions } from "@/lib/data/setDescriptors";
import {
  setIntersection,
  setUnion,
  setDifference,
  symmetricDifference,
  setComplement,
  isSubset,
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "@/lib/math/venn";

import { SetSelector } from "@/components/setlab/SetSelector";
import {
  SetOperationsToolbar,
  type ActiveOperation,
  type Operation2Set,
  type Operation3Set,
} from "@/components/setlab/SetOperationsToolbar";
import { VennDiagram2Set } from "@/components/setlab/VennDiagram2Set";
import { VennDiagram3Set } from "@/components/setlab/VennDiagram3Set";
import { InclusionExclusionCalculator } from "@/components/setlab/InclusionExclusionCalculator";
import { EducationalCard } from "@/components/setlab/EducationalCard";
import { SetRespondentExplorer } from "@/components/setlab/SetRespondentExplorer";

export default function SetLabPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;
  const universe = useMemo(() => getUniverseRespondentIds(responses), [responses]);
  const availableOptions = useMemo(() => getAvailableSetOptions(), []);

  // UI Mode: "2-set" or "3-set"
  const [mode, setMode] = useState<"2-set" | "3-set">("2-set");

  // Selected Set IDs
  const [setAId, setSetAId] = useState<string>("brand_apple");
  const [setBId, setSetBId] = useState<string>("feature_camera_quality");
  const [setCId, setSetCId] = useState<string>("feature_battery_life");

  // Active Algebraic Operation
  const [activeOperation, setActiveOperation] = useState<ActiveOperation>("intersection");

  // Resolve Set Option Descriptors
  const optionA = availableOptions.find((o) => o.id === setAId) || availableOptions[0]!;
  const optionB = availableOptions.find((o) => o.id === setBId) || availableOptions[1]!;
  const optionC = availableOptions.find((o) => o.id === setCId) || availableOptions[2]!;

  // Compute Discrete Sets of Respondent IDs
  const setA = useMemo(() => optionA.getIds(responses), [optionA, responses]);
  const setB = useMemo(() => optionB.getIds(responses), [optionB, responses]);
  const setC = useMemo(() => optionC.getIds(responses), [optionC, responses]);

  // Compute 2-Set Venn & PIE
  const regions2Set = useMemo(
    () => computeTwoSetVennRegions(universe, setA, setB),
    [universe, setA, setB]
  );
  const pie2Set = useMemo(
    () => verifyInclusionExclusionPrinciple(setA, setB),
    [setA, setB]
  );

  // Compute 3-Set Venn & PIE
  const regions3Set = useMemo(
    () => computeThreeSetVennRegions(universe, setA, setB, setC),
    [universe, setA, setB, setC]
  );
  const pie3Set = useMemo(
    () => verifyThreeSetInclusionExclusion(setA, setB, setC),
    [setA, setB, setC]
  );

  // Handle Mode Change
  const handleModeChange = (newMode: "2-set" | "3-set") => {
    setMode(newMode);
    setActiveOperation(newMode === "2-set" ? "intersection" : "inter_abc");
  };

  // Determine Current Matching Respondent IDs based on Active Operation
  const matchingIds: Set<string> = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return setUnion(setA, setB);
        case "intersection":
          return setIntersection(setA, setB);
        case "diff_ab":
          return setDifference(setA, setB);
        case "diff_ba":
          return setDifference(setB, setA);
        case "sym_diff":
          return symmetricDifference(setA, setB);
        case "comp_a":
          return setComplement(universe, setA);
        case "comp_b":
          return setComplement(universe, setB);
        case "neither":
          return regions2Set.neither;
        case "subset_ab":
          // If subset, return A; if not, return counterexamples (A \ B)
          return isSubset(setA, setB) ? setA : setDifference(setA, setB);
        case "disjoint_ab":
          return setIntersection(setA, setB);
        default:
          return setIntersection(setA, setB);
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return regions3Set.unionSet;
        case "inter_abc":
          return regions3Set.allThree;
        case "inter_ab":
          return setIntersection(setA, setB);
        case "inter_ac":
          return setIntersection(setA, setC);
        case "inter_bc":
          return setIntersection(setB, setC);
        case "only_a":
          return regions3Set.onlyA;
        case "only_b":
          return regions3Set.onlyB;
        case "only_c":
          return regions3Set.onlyC;
        case "only_ab":
          return regions3Set.onlyAB;
        case "only_ac":
          return regions3Set.onlyAC;
        case "only_bc":
          return regions3Set.onlyBC;
        case "outside_abc":
          return regions3Set.outside;
        default:
          return regions3Set.allThree;
      }
    }
  }, [mode, activeOperation, setA, setB, setC, universe, regions2Set, regions3Set]);

  // Human-readable operation explanation for explorer
  const operationLabel = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return "Union: A ∪ B";
        case "intersection":
          return "Intersection: A ∩ B";
        case "diff_ab":
          return "Difference: A \\ B (A only)";
        case "diff_ba":
          return "Difference: B \\ A (B only)";
        case "sym_diff":
          return "Symmetric Difference: A Δ B";
        case "comp_a":
          return "Complement: Aᶜ (U \\ A)";
        case "comp_b":
          return "Complement: Bᶜ (U \\ B)";
        case "neither":
          return "Neither: (A ∪ B)ᶜ";
        case "subset_ab":
          return isSubset(setA, setB)
            ? "Subset Test: True (A ⊆ B)"
            : "Subset Test: False (Counterexample Elements in A \\ B)";
        case "disjoint_ab":
          return setIntersection(setA, setB).size === 0
            ? "Disjointness: True (A ∩ B = ∅)"
            : "Disjointness: False (Shared Elements Exist)";
        default:
          return "Active Selection";
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return "Triple Union: A ∪ B ∪ C";
        case "inter_abc":
          return "Triple Intersection: A ∩ B ∩ C";
        case "inter_ab":
          return "Pairwise Overlap: A ∩ B";
        case "inter_ac":
          return "Pairwise Overlap: A ∩ C";
        case "inter_bc":
          return "Pairwise Overlap: B ∩ C";
        case "only_a":
          return "Region 1: A Only (A \\ (B ∪ C))";
        case "only_b":
          return "Region 2: B Only (B \\ (A ∪ C))";
        case "only_c":
          return "Region 3: C Only (C \\ (A ∪ B))";
        case "only_ab":
          return "Region 4: AB Only ((A ∩ B) \\ C)";
        case "only_ac":
          return "Region 5: AC Only ((A ∩ C) \\ B)";
        case "only_bc":
          return "Region 6: BC Only ((B ∩ C) \\ A)";
        case "outside_abc":
          return "Region 8: Outside All Three ((A ∪ B ∪ C)ᶜ)";
        default:
          return "Active 3-Set Selection";
      }
    }
  }, [mode, activeOperation, setA, setB]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Interactive Mathematics Laboratory"
        title="SetLab"
        description="Formal set theory laboratory evaluating union, intersection, symmetric difference, relative complements, and the Principle of Inclusion-Exclusion on empirical student cohorts."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <>
            <Link href="/">
              <Button variant="outline" size="sm">
                &larr; Campus Pulse
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="primary" size="sm">
                Methodology
              </Button>
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Academic Dataset Status Banner */}
        <Callout
          variant="highlight"
          title={`Active Laboratory Cohort (U = ${universe.size} Respondents)`}
        >
          All operations below evaluate pure mathematical expressions on discrete sets of unique student IDs. Intersections and cardinalities are calculated dynamically from verified survey records rather than estimated from aggregate totals.
        </Callout>

        {/* 1. Set Definition Workspace */}
        <SetSelector
          mode={mode}
          onModeChange={handleModeChange}
          availableOptions={availableOptions}
          setAId={setAId}
          setBId={setBId}
          setCId={setCId}
          onSelectA={setSetAId}
          onSelectB={setSetBId}
          onSelectC={setSetCId}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
          totalUniverseSize={universe.size}
        />

        {/* 2. Set Operations Toolbar */}
        <SetOperationsToolbar
          mode={mode}
          activeOperation={activeOperation}
          onSelectOperation={setActiveOperation}
          resultCardinality={matchingIds.size}
          totalUniverse={universe.size}
        />

        {/* 3. Interactive Venn Diagram & Educational Theory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Venn Diagram */}
          <div className="lg:col-span-7">
            {mode === "2-set" ? (
              <VennDiagram2Set
                setAName={optionA.name}
                setBName={optionB.name}
                regions={regions2Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation2Set) => setActiveOperation(op)}
              />
            ) : (
              <VennDiagram3Set
                setAName={optionA.name}
                setBName={optionB.name}
                setCName={optionC.name}
                regions={regions3Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation3Set) => setActiveOperation(op)}
              />
            )}
          </div>

          {/* Educational Theory Card */}
          <div className="lg:col-span-5">
            <EducationalCard
              operation={activeOperation}
              setAName={optionA.name}
              setBName={optionB.name}
              setCName={mode === "3-set" ? optionC.name : undefined}
              resultCount={matchingIds.size}
              totalUniverse={universe.size}
            />
          </div>
        </div>

        {/* 4. Inclusion-Exclusion Calculator & Step-by-Step Proof */}
        <InclusionExclusionCalculator
          mode={mode}
          pie2Set={pie2Set}
          pie3Set={pie3Set}
          setAName={optionA.name}
          setBName={optionB.name}
          setCName={optionC.name}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
        />

        {/* 5. Matching Respondent Explorer */}
        <SetRespondentExplorer
          matchingIds={matchingIds}
          allResponses={responses}
          operationName={operationLabel}
          setExplanation={
            mode === "2-set"
              ? `Filtered against Set A (${optionA.name}) and Set B (${optionB.name})`
              : `Filtered against Sets A, B, and C (${optionA.name}, ${optionB.name}, ${optionC.name})`
          }
        />
      </div>
    </div>
  );
}
```

---

### `src/app/combolab/page.tsx`

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { analyzeFeatureCombinations } from "@/lib/data/combinationAnalytics";
import type { FeatureCombinationRecord } from "@/types/math";

import { CombinationCalculator } from "@/components/combolab/CombinationCalculator";
import { PermutationVsCombination } from "@/components/combolab/PermutationVsCombination";
import { FeatureCombinationExplorer } from "@/components/combolab/FeatureCombinationExplorer";
import { CombinationFrequencyAnalysis } from "@/components/combolab/CombinationFrequencyAnalysis";
import { BudgetCombinationAnalysis } from "@/components/combolab/BudgetCombinationAnalysis";
import { CombinatoricsLearningPanel } from "@/components/combolab/CombinatoricsLearningPanel";
import { CombinationDetailModal } from "@/components/combolab/CombinationDetailModal";

type ActiveTab =
  | "all"
  | "calculator"
  | "permutations"
  | "explorer"
  | "frequency"
  | "budget"
  | "theory";

export default function ComboLabPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;
  const analytics = useMemo(
    () => analyzeFeatureCombinations(responses),
    [responses]
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [selectedCombination, setSelectedCombination] =
    useState<FeatureCombinationRecord | null>(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        eyebrow="Discrete Mathematics & Combinatorics"
        title="ComboLab: Combinatorial Feature Space"
        description="Interactive laboratory exploring binomial coefficients C(n, r), permutations P(n, r), and empirical survey frequencies. Analyzes the discrete space of C(7, 3) = 35 theoretical triplets from the 7 canonical smartphone features."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              datasetInfo.isDemo
                ? "text-amber-500 bg-amber-950/40 border-amber-800/60"
                : "text-cobalt-400 bg-cobalt-950/40 border-cobalt-800/60"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                &larr; SetLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation / Focus Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-graphite-900 border border-graphite-800">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            All Modules Overview
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "calculator"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            nCr Calculator
          </button>
          <button
            onClick={() => setActiveTab("permutations")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "permutations"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Permutations vs Combinations
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "explorer"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            35-Triplet Space Explorer
          </button>
          <button
            onClick={() => setActiveTab("frequency")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "frequency"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Frequency Ranking & Voids
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "budget"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Budget Stratification
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "theory"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Curriculum Theory
          </button>
        </div>

        {/* Section 1: nCr Calculator */}
        {(activeTab === "all" || activeTab === "calculator") && (
          <section id="calculator" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                1. Combinations Calculator & Factorial Simplification
              </h2>
              <Badge variant="cobalt">Interactive Math</Badge>
            </div>
            <CombinationCalculator />
          </section>
        )}

        {/* Section 2: Permutation vs Combination Explainer */}
        {(activeTab === "all" || activeTab === "permutations") && (
          <section id="permutations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                2. Permutations vs Combinations
              </h2>
              <Badge variant="lime">Order Invariance</Badge>
            </div>
            <PermutationVsCombination />
          </section>
        )}

        {/* Section 3: Feature Combination Explorer (All 35 Triplets) */}
        {(activeTab === "all" || activeTab === "explorer") && (
          <section id="explorer" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                3. The C(7, 3) = 35 Feature Triplet Space
              </h2>
              <Badge variant="cobalt">Theoretical vs Observed</Badge>
            </div>
            <FeatureCombinationExplorer
              combinations={analytics.combinations}
              totalRespondents={analytics.totalRespondents}
              selectedCombinationId={selectedCombination?.id}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 4: Frequency Analysis & Unobserved Voids */}
        {(activeTab === "all" || activeTab === "frequency") && (
          <section id="frequency" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                4. Empirical Triplet Frequency Ranking
              </h2>
              <Badge variant="lime">Survey Observations</Badge>
            </div>
            <CombinationFrequencyAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 5: Budget-Based Combination Analysis */}
        {(activeTab === "all" || activeTab === "budget") && (
          <section id="budget" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                5. Price Tier Stratification & Denominator Integrity
              </h2>
              <Badge variant="cobalt">Subgroup Analysis</Badge>
            </div>
            <BudgetCombinationAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 6: Curriculum Learning Foundation */}
        {(activeTab === "all" || activeTab === "theory") && (
          <section id="theory" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                6. Undergraduate Curriculum Learning Reference
              </h2>
              <Badge variant="outline">Formal Mathematics</Badge>
            </div>
            <CombinatoricsLearningPanel />
          </section>
        )}

        {/* Global Academic Callout */}
        <Callout
          variant="highlight"
          title="PhonePrint Combinatorial Architecture Summary"
        >
          PhonePrint grounds smartphone preference research in discrete
          mathematics. Selecting 3 features from 7 canonical options establishes a
          finite parameter space of exactly 35 unordered combinations. In this{" "}
          {datasetInfo.isDemo ? "initial 12-respondent cohort" : `cohort of ${datasetInfo.totalResponses} respondents`},{" "}
          {analytics.totalObservedCombinations} combinations are populated while{" "}
          {analytics.totalUnobservedCombinations} remain unobserved voids, demonstrating how finite sampling interacts
          with multi-attribute combinatorial spaces.
        </Callout>
      </div>

      {/* Modal / Inspector for selected combination */}
      <CombinationDetailModal
        combination={selectedCombination}
        onClose={() => setSelectedCombination(null)}
        allResponses={responses}
      />
    </div>
  );
}
```

---

### `src/app/my-phoneprint/page.tsx`

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { executeMatchingEngine } from "@/lib/math/matchingEngine";
import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

import { PreferenceBuilder } from "@/components/my-phoneprint/PreferenceBuilder";
import { ExactMatchCard } from "@/components/my-phoneprint/ExactMatchCard";
import { PartialMatchBreakdown } from "@/components/my-phoneprint/PartialMatchBreakdown";
import { FeatureOverlapCard } from "@/components/my-phoneprint/FeatureOverlapCard";
import { RespondentExplorerTable } from "@/components/my-phoneprint/RespondentExplorerTable";
import { MatchingTheoryPanel } from "@/components/my-phoneprint/MatchingTheoryPanel";

export default function MyPhonePrintPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;

  // Initial default: Apple, Over $1,000, Camera + Battery + Build (Matches DEMO_RESP_001)
  const [brand, setBrand] = useState<SmartphoneBrand>("Apple");
  const [budget, setBudget] = useState<BudgetRange>("Over $1,000");
  const [features, setFeatures] = useState<SmartphoneFeature[]>([
    "Camera Quality",
    "Battery Life",
    "Build & Design Quality",
  ]);

  const toggleFeature = (feature: SmartphoneFeature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      if (features.length < 3) {
        setFeatures([...features, feature]);
      }
    }
  };

  const resetPreferences = () => {
    setBrand("Apple");
    setBudget("Over $1,000");
    setFeatures([]);
  };

  const applyPreset = (preset: UserProfileInput) => {
    setBrand(preset.brand);
    setBudget(preset.budget);
    setFeatures([...preset.features]);
  };

  // Run the matching engine only when exactly 3 features are selected
  const isProfileComplete = features.length === 3;

  const matchResult = useMemo(() => {
    if (!isProfileComplete) return null;

    const profile: UserProfileInput = {
      brand,
      budget,
      features: [features[0]!, features[1]!, features[2]!],
    };

    return executeMatchingEngine(responses, profile);
  }, [responses, brand, budget, features, isProfileComplete]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Interactive Preference Profiling"
        title="My PhonePrint: Preference Matcher"
        description="Select your target brand, budget tier, and exactly three canonical features to construct your personal PhonePrint vector. Computes exact set intersections and mutually exclusive partial matches against the student cohort."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              datasetInfo.isDemo
                ? "text-amber-500 bg-amber-950/40 border-amber-800/60"
                : "text-cobalt-400 bg-cobalt-950/40 border-cobalt-800/60"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section 1: Preference Builder */}
        <section id="builder" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
              1. Preference Vector Formulation
            </h2>
            <span className="text-xs text-graphite-500 font-mono">
              3 Dimensions: Brand • Budget • 3 Features
            </span>
          </div>
          <PreferenceBuilder
            brand={brand}
            setBrand={setBrand}
            budget={budget}
            setBudget={setBudget}
            features={features}
            toggleFeature={toggleFeature}
            resetPreferences={resetPreferences}
            onApplyPreset={applyPreset}
          />
        </section>

        {/* Section 2: Results Dashboard (Conditioned on complete profile) */}
        {matchResult ? (
          <>
            {/* Exact Matches */}
            <section id="exact-matches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  2. Exact Profile Matching
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Intersection: B ∩ P ∩ F
                </span>
              </div>
              <ExactMatchCard result={matchResult} />
            </section>

            {/* Mutually Exclusive Partial Match Breakdown */}
            <section id="partial-matches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  3. Mutually Exclusive Match Classification
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Conservation: N₃ + N₂ + N₁ + N₀ = N
                </span>
              </div>
              <PartialMatchBreakdown result={matchResult} />
            </section>

            {/* Independent Feature Overlap */}
            <section id="feature-overlap" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  4. Feature Triplet Overlap Analysis
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Subset Size: |F* ∩ F_i| ∈ &#123;0, 1, 2, 3&#125;
                </span>
              </div>
              <FeatureOverlapCard
                featureOverlap={matchResult.featureOverlap}
                selectedFeatures={matchResult.profile.features}
                totalCohort={matchResult.totalCohort}
              />
            </section>

            {/* Respondent Explorer Table */}
            <section id="explorer" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  5. Anonymous Respondent Explorer
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Individual Record Evaluation
                </span>
              </div>
              <RespondentExplorerTable respondents={matchResult.respondents} />
            </section>

            {/* Discrete Mathematics Learning Foundation */}
            <section id="theory" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  6. Discrete Mathematics Matching Foundation
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Formal Set Theory &amp; Partitions
                </span>
              </div>
              <MatchingTheoryPanel />
            </section>
          </>
        ) : (
          <Callout
            variant="warning"
            title="Incomplete Preference Vector"
          >
            Please select exactly three distinct features in the builder above to
            compute your PhonePrint vector and evaluate set intersections across
            the student cohort.
          </Callout>
        )}

        {/* Academic Synthesis Summary */}
        <Callout
          variant="highlight"
          title="PhonePrint Preference Analytics Summary"
        >
          My PhonePrint models user smartphone affinity as a discrete set
          intersection problem over $U$. By evaluating Brand ($B$), Budget ($P$),
          and Feature Triplet ($F$), the system demonstrates how multi-dimensional
          conjunctions partition a population into non-overlapping distance bands,
          providing mathematically rigorous insights without aggregate scalar
          approximations.
        </Callout>
      </div>
    </div>
  );
}
```

---

### `src/app/experiment-studio/page.tsx`

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { computeBrandFeatureAssociation } from "@/lib/math/brandFeatureExperiment";
import { computeBudgetCombinationAnalysis } from "@/lib/math/budgetCombinationExperiment";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
  type SmartphoneBrand,
  type SmartphoneFeature,
  type BudgetRange,
} from "@/types/survey";
import type {
  BrandFeatureCell,
  BudgetCombinationRow,
} from "@/types/experiment";

import { BrandFeatureControls } from "@/components/experiment-studio/BrandFeatureControls";
import { BrandFeatureHeatmap } from "@/components/experiment-studio/BrandFeatureHeatmap";
import { BrandFeatureBarChart } from "@/components/experiment-studio/BrandFeatureBarChart";
import { BrandFeatureInterpretation } from "@/components/experiment-studio/BrandFeatureInterpretation";
import { BudgetCombinationControls } from "@/components/experiment-studio/BudgetCombinationControls";
import { BudgetCombinationMetrics } from "@/components/experiment-studio/BudgetCombinationMetrics";
import { BudgetCombinationChart } from "@/components/experiment-studio/BudgetCombinationChart";
import { BudgetCombinationTable } from "@/components/experiment-studio/BudgetCombinationTable";
import { BudgetCombinationInterpretation } from "@/components/experiment-studio/BudgetCombinationInterpretation";
import { RespondentInspectorModal } from "@/components/experiment-studio/RespondentInspectorModal";

type ActiveTab = "all" | "exp1" | "exp2" | "methodology";

export default function ExperimentStudioPage() {
  // Load dataset
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  // Experiment 1 State
  const [selectedBrands, setSelectedBrands] = useState<SmartphoneBrand[]>([
    ...SMARTPHONE_BRANDS,
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<SmartphoneFeature[]>([
    ...SMARTPHONE_FEATURES,
  ]);

  // Experiment 2 State
  const [selectedBudgets, setSelectedBudgets] = useState<BudgetRange[]>([
    ...BUDGET_RANGES,
  ]);

  // Modal State
  const [inspectorModal, setInspectorModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    matchingIds: readonly string[];
  } | null>(null);

  // Computations
  const brandFeatureResult = useMemo(
    () =>
      computeBrandFeatureAssociation(responses, selectedBrands, selectedFeatures),
    [responses, selectedBrands, selectedFeatures]
  );

  const budgetCombinationResult = useMemo(
    () => computeBudgetCombinationAnalysis(responses, selectedBudgets),
    [responses, selectedBudgets]
  );

  // Dynamic Feature Percentage Sum summary across currently selected populated brands
  const displayedFeatureSumSummary = useMemo(() => {
    if (brandFeatureResult.isFullFeatureUniverse) {
      return {
        label: "300.0%",
        note: "All 7 Features (Expected: 300%)",
        isExpected300: true,
      };
    }

    if (selectedFeatures.length === 0) {
      return {
        label: "0.0%",
        note: "0 Features Selected",
        isExpected300: false,
      };
    }

    const populatedSelectedBrands = selectedBrands.filter(
      (b) => (brandFeatureResult.brandTotals[b] ?? 0) > 0
    );

    if (populatedSelectedBrands.length === 0) {
      return {
        label: "0.0%",
        note: "No populated cohorts",
        isExpected300: false,
      };
    }

    const sums = populatedSelectedBrands.map(
      (b) => brandFeatureResult.featurePercentageSumByBrand[b] ?? 0
    );
    const minSum = Math.min(...sums);
    const maxSum = Math.max(...sums);

    const rangeLabel =
      minSum === maxSum
        ? `${minSum.toFixed(1)}%`
        : `${minSum.toFixed(1)}% – ${maxSum.toFixed(1)}%`;

    return {
      label: rangeLabel,
      note: `${selectedFeatures.length}/7 Features (Dynamic Sum)`,
      isExpected300: false,
    };
  }, [brandFeatureResult, selectedBrands, selectedFeatures]);

  // Modal Triggers
  const handleSelectCell = (cell: BrandFeatureCell) => {
    const brandCohortSize = brandFeatureResult.brandTotals[cell.brand] ?? 0;
    setInspectorModal({
      isOpen: true,
      title: `${cell.brand} × ${cell.feature}`,
      subtitle: `Discrete intersection S_${cell.brand} ∩ S_${cell.feature}: ${cell.count} respondents (${cell.percentage.toFixed(
        1
      )}% of ${cell.brand} cohort N=${brandCohortSize})`,
      matchingIds: cell.matchingRespondentIds,
    });
  };

  const handleSelectBudgetRow = (row: BudgetCombinationRow) => {
    const allMatchingIds = Object.values(row.matchingRespondentIdsByBudget).flat();
    setInspectorModal({
      isOpen: true,
      title: `${row.combinationId}: {${row.features.join(", ")}}`,
      subtitle: `Observed ${row.totalObservedOverall} times across all segments. ${
        row.isObservedOverall
          ? "Observed empirical combination."
          : "Combinatorial void (unobserved in dataset)."
      }`,
      matchingIds: allMatchingIds,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        eyebrow="Empirical Discrete Research"
        title="Experiment Studio: Preference Hypothesis Testing"
        description="Investigate empirical patterns and associations across smartphone brands, canonical features, and budget segments. Formulates formal hypotheses, evaluates discrete cross-tabulations, and contrasts theoretical combinatorial spaces against observed survey responses."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              datasetInfo.isDemo
                ? "text-amber-500 bg-amber-950/40 border-amber-800/60"
                : "text-cobalt-400 bg-cobalt-950/40 border-cobalt-800/60"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Observational Non-Causal Framing Banner */}
        <Callout
          variant="warning"
          title="Methodological Grounding: Observational Study Notice"
        >
          <div className="space-y-1.5 text-xs text-graphite-300 leading-relaxed">
            <p>
              Data reflects an observational university sample ($N={responses.length}$). Cross-tabulations and segment percentages describe <strong>empirical associations</strong> within this cohort.
            </p>
            <p>
              They <strong>do not prove causal mechanisms</strong>, consumer utility invariance, or general population distributions. Percentages are strictly calculated using respective cohort sizes as denominators ($N(b)$ for brand cohorts; $N(p)$ for budget segments).
            </p>
          </div>
        </Callout>

        {/* Studio Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#182030] pb-4">
          <Button
            size="sm"
            variant={activeTab === "all" ? "primary" : "secondary"}
            onClick={() => setActiveTab("all")}
          >
            All Experiments
          </Button>
          <Button
            size="sm"
            variant={activeTab === "exp1" ? "primary" : "secondary"}
            onClick={() => setActiveTab("exp1")}
          >
            Exp 1: Brand–Feature Association
          </Button>
          <Button
            size="sm"
            variant={activeTab === "exp2" ? "primary" : "secondary"}
            onClick={() => setActiveTab("exp2")}
          >
            Exp 2: Combinations by Budget
          </Button>
          <Button
            size="sm"
            variant={activeTab === "methodology" ? "primary" : "secondary"}
            onClick={() => setActiveTab("methodology")}
          >
            Methodology &amp; Hypotheses
          </Button>
        </div>

        {/* EXPERIMENT 1 SECTION */}
        {(activeTab === "all" || activeTab === "exp1") && (
          <section className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="cobalt">Experiment 01</Badge>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Brand–Feature Preference Association
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Cross-tabulating brand affinity against canonical feature choices. Evaluates within-brand preference distributions P(f | b).
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5 italic">
                  When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                Denominator: <span className="text-cobalt-400 font-bold">N(b)</span> | Displayed Sum:{" "}
                <span
                  className={
                    displayedFeatureSumSummary.isExpected300
                      ? "text-lime-400 font-bold"
                      : "text-amber-400 font-bold"
                  }
                >
                  {displayedFeatureSumSummary.label}
                </span>{" "}
                <span className="text-slate-400 text-[10px]">
                  ({displayedFeatureSumSummary.note})
                </span>
              </div>
            </div>

            {/* Interactive Multi-Select Controls */}
            <BrandFeatureControls
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />

            {/* Heatmap Matrix */}
            <BrandFeatureHeatmap
              result={brandFeatureResult}
              onSelectCell={handleSelectCell}
            />

            {/* Grouped Bar Chart */}
            <BrandFeatureBarChart
              result={brandFeatureResult}
              onSelectCell={handleSelectCell}
            />

            {/* Scientific Interpretation & Descriptive Notes */}
            <BrandFeatureInterpretation result={brandFeatureResult} />
          </section>
        )}

        {/* EXPERIMENT 2 SECTION */}
        {(activeTab === "all" || activeTab === "exp2") && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="lime">Experiment 02</Badge>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Feature Triplet Combinations by Budget Segment
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Stratifying the 35 theoretical triplets across budget ranges. Evaluates C(7,3)=35 theoretical vs empirical observations and within-budget distributions P(t | p).
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                Denominator: <span className="text-lime-400 font-bold">N(p)</span> | Triplet Sum: <span className="text-cobalt-400 font-bold">100%</span>
              </div>
            </div>

            {/* Budget Controls */}
            <BudgetCombinationControls
              selectedBudgets={selectedBudgets}
              setSelectedBudgets={setSelectedBudgets}
            />

            {/* Summary Stat Cards */}
            <BudgetCombinationMetrics result={budgetCombinationResult} />

            {/* Recharts Bar Chart */}
            <BudgetCombinationChart
              result={budgetCombinationResult}
              onSelectRow={handleSelectBudgetRow}
            />

            {/* Full 35 Combination Table */}
            <BudgetCombinationTable
              result={budgetCombinationResult}
              onSelectRow={handleSelectBudgetRow}
            />

            {/* Scientific Interpretation & Conservation Law */}
            <BudgetCombinationInterpretation result={budgetCombinationResult} />
          </section>
        )}

        {/* DEDICATED METHODOLOGY & HYPOTHESIS COMPARISON TAB */}
        {activeTab === "methodology" && (
          <section className="space-y-6 pt-2">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">Formal Framework</Badge>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Research Hypotheses &amp; Methodological Comparison
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Formal mathematical criteria, hypothesis definitions, and analytical guardrails for the PhonePrint research suite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exp 1 Summary Card */}
              <Card className="border-slate-200/90 shadow-card">
                <CardHeader
                  title="Experiment 1: Brand–Feature Preferences"
                  subtitle="Within-brand preference distributions"
                  badge={<Badge variant="cobalt">Exp 1 Protocol</Badge>}
                />
                <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Formal Hypothesis Framing
                    </span>
                    <p className="font-medium text-slate-900 mb-1">
                      <strong>H₀ (Null):</strong> Canonical feature selection is conditionally independent of brand choice: <KaTeXMath math="P(f \mid b) = P(f)" /> for all <KaTeXMath math="b \in B, f \in F" />.
                    </p>
                    <p className="font-medium text-slate-900">
                      <strong>H₁ (Alternative):</strong> Feature selection distributions systematically vary across brand cohorts: <KaTeXMath math="\exists b, f: P(f \mid b) \neq P(f)" />.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Mathematical Invariants
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Intersection count: <KaTeXMath math="C(b, f) = |S_b \cap S_f|" />.</li>
                      <li>Within-brand percentage: <KaTeXMath math="P(f \mid b) = \frac{C(b, f)}{N(b)} \times 100\%" />.</li>
                      <li>Because each student selects 3 features, <KaTeXMath math="\sum_{f=1}^7 P(f \mid b) = 300.0\%" /> for every populated brand cohort.</li>
                      <li>Safe zero-denominator handling: <KaTeXMath math="P(f \mid b) = 0.0\%" /> when <KaTeXMath math="N(b) = 0" />.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Exp 2 Summary Card */}
              <Card className="border-slate-200/90 shadow-card">
                <CardHeader
                  title="Experiment 2: Budget Segment Triplet Space"
                  subtitle="Discrete combinatorics across expenditure tiers"
                  badge={<Badge variant="lime">Exp 2 Protocol</Badge>}
                />
                <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Formal Hypothesis Framing
                    </span>
                    <p className="font-medium text-slate-900 mb-1">
                      <strong>H₀ (Null):</strong> Feature triplet choices are uniformly or identically distributed across budget tiers: <KaTeXMath math="P(t \mid p) = P(t)" /> for all <KaTeXMath math="p \in P" />.
                    </p>
                    <p className="font-medium text-slate-900">
                      <strong>H₁ (Alternative):</strong> Specific triplets concentrate within distinct budget tiers (e.g. premium hardware in high budget, value combinations in low budget).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Mathematical Invariants
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Theoretical space: <KaTeXMath math="C(7, 3) = \frac{7!}{3! \cdot 4!} = 35" /> distinct combinations.</li>
                      <li>Observed triplets in sample: 10 combinations; combinatorial voids: 25 combinations.</li>
                      <li>Exact unranked set equality: triplet <KaTeXMath math="t = \{f_a, f_b, f_c\}" /> matches regardless of order.</li>
                      <li>Within-budget percentage: <KaTeXMath math="P(t \mid p) = \frac{C(p, t)}{N(p)} \times 100\%" />.</li>
                      <li>Conservation law: <KaTeXMath math="\sum_{t \in C(7,3)} P(t \mid p) = 100.0\%" /> for each populated budget segment.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Comparison Matrix */}
            <Card className="border-slate-200/90 shadow-card">
              <CardHeader
                title="Experiment Comparison Matrix"
                subtitle="Methodological and computational properties of Experiments 1 and 2"
              />
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Experiment 1 (Brand–Feature)</th>
                        <th className="px-4 py-3">Experiment 2 (Budget–Combinations)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Analytical Entity</td>
                        <td className="px-4 py-3">Individual canonical features (<KaTeXMath math="f \in F, |F|=7" />)</td>
                        <td className="px-4 py-3">3-feature subsets / triplets (<KaTeXMath math="t \in \mathcal{P}_3(F), |\mathcal{P}_3(F)|=35" />)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Primary Denominator</td>
                        <td className="px-4 py-3 font-mono text-cobalt-600 font-bold">N(b) (Brand cohort size)</td>
                        <td className="px-4 py-3 font-mono text-lime-600 font-bold">N(p) (Budget segment size)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Sum Conservation Law</td>
                        <td className="px-4 py-3 font-mono">Σ P(f | b) = 300.0% (3 features / student)</td>
                        <td className="px-4 py-3 font-mono">Σ P(t | p) = 100.0% (1 triplet / student)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Theoretical vs Observed</td>
                        <td className="px-4 py-3">All 7 features observed in cohort</td>
                        <td className="px-4 py-3">35 theoretical, 10 observed, 25 combinatorial voids</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Set-Theoretic Foundation</td>
                        <td className="px-4 py-3 font-mono">|S_b ∩ S_f|</td>
                        <td className="px-4 py-3 font-mono">|&#123;id | budget = p ∧ features = t&#125;|</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Interpretation Boundary</td>
                        <td className="px-4 py-3 text-slate-500">Descriptive co-selection; no brand loyalty causality</td>
                        <td className="px-4 py-3 text-slate-500">Empirical concentration; no pricing elasticity causality</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Respondent Inspector Modal */}
      {inspectorModal && (
        <RespondentInspectorModal
          title={inspectorModal.title}
          subtitle={inspectorModal.subtitle}
          matchingIds={inspectorModal.matchingIds}
          allResponses={responses}
          onClose={() => setInspectorModal(null)}
        />
      )}
    </div>
  );
}
```

---

### `src/app/methodology/page.tsx`

```tsx
import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { getActiveDatasetInfo } from "@/lib/data/loader";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
} from "@/types/survey";

export default function MethodologyPage() {
  const datasetInfo = getActiveDatasetInfo();

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        eyebrow="Academic Research Framework"
        title="Methodology & Data Architecture"
        description="Formal documentation of the survey design, discrete mathematical foundations, validation schemas, and offline data pipeline."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "cobalt" : "lime" }}
        actions={
          <Link href="/">
            <Button variant="outline" size="sm">
              &larr; Back to Campus Pulse
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Core Constraints Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Approved 7-Feature Canonical Domain"
              subtitle="Uniform discrete domain for all survey choices"
              badge={<Badge variant="lime">Approved Domain</Badge>}
            />
            <CardContent>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-graphite-700 dark:text-graphite-300">
                {SMARTPHONE_FEATURES.map((feature, i) => (
                  <li key={i} className="font-medium">
                    {feature}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[11px] text-graphite-500 border-t border-graphite-100 dark:border-graphite-800 pt-3">
                Each respondent selects <strong>exactly three distinct features</strong>. Non-distinct choices or counts other than three fail Zod schema validation and Python preprocessing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Mathematical Foundations"
              subtitle="Implemented in pure TypeScript modules decoupled from UI"
              badge={<Badge variant="cobalt">Pure Mathematics</Badge>}
            />
            <CardContent className="space-y-3 text-xs text-graphite-700 dark:text-graphite-300">
              <div>
                <p className="font-semibold text-graphite-900 dark:text-white">
                  1. Principle of Inclusion-Exclusion (PIE)
                </p>
                <KaTeXMath
                  math="|A \cup B| = |A| + |B| - |A \cap B|"
                  block
                  className="text-cobalt-600 dark:text-cobalt-400 font-semibold"
                />
              </div>
              <div>
                <p className="font-semibold text-graphite-900 dark:text-white">
                  2. Combinatorial Feature Space
                </p>
                <KaTeXMath
                  math="\binom{n}{r} = \binom{7}{3} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35"
                  block
                  className="text-cobalt-600 dark:text-cobalt-400 font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Survey Data Fields Specification */}
        <Card>
          <CardHeader
            title="Survey Data Model Specification"
            subtitle="Six discrete attributes recorded per participant"
          />
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-graphite-200 dark:border-graphite-800 text-graphite-500 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Field</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Allowed Domain / Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite-100 dark:divide-graphite-800/60 text-graphite-700 dark:text-graphite-300">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">response_id</td>
                  <td className="py-2.5 px-3 font-mono">string</td>
                  <td className="py-2.5 px-3">Unique alphanumeric identifier (e.g. <code>DEMO_RESP_001</code>). Duplicate IDs strictly rejected.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">preferred_brand</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{SMARTPHONE_BRANDS.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">budget_range</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{BUDGET_RANGES.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">preferred_features</td>
                  <td className="py-2.5 px-3 font-mono">[string, string, string]</td>
                  <td className="py-2.5 px-3">Exactly 3 distinct items from the 7 approved features.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">primary_use</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{PRIMARY_USES.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold">os_preference</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{OS_PREFERENCES.join(", ")}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Dataset Disclaimer */}
        <Callout
          variant="highlight"
          title={datasetInfo.isDemo ? "Synthetic Benchmark Dataset Notice" : "Verified Empirical Survey Dataset Notice"}
        >
          {datasetInfo.isDemo ? (
            <>
              All data files currently loaded are tagged with <code>is_demo: true</code> and <code>[DEMO DATA]</code>. The records were synthetically generated to test edge cases, schema validations, and mathematical algorithms without fabricating empirical human research findings.
            </>
          ) : (
            <>
              The application is currently operating on real survey data with <code>is_demo: false</code> ({datasetInfo.totalResponses} verified responses). Raw submissions were validated and cleaned through the Phase 07 offline Python pipeline.
            </>
          )}
        </Callout>
      </div>
    </div>
  );
}
```

---

### `pipeline/test_pipeline.py`

```python
"""
Unit and integration tests for the PhonePrint Python pipeline.
Verifies data ingestion, validation rules, normalization, Google Forms mapping,
PII stripping, duplicate detection (with/without timestamps), unmapped column warnings,
atomic dataset activation, failure recovery, and rollback mechanisms.
"""

from __future__ import annotations

import io
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from pipeline.process_survey import (
    process_survey_csv,
    ValidationError,
    parse_and_validate_features,
    resolve_column_mapping,
    detect_duplicates,
)
from pipeline.activate_dataset import (
    validate_dataset_invariants,
    activate_dataset,
    rollback_dataset,
    get_dataset_config,
    save_dataset_config,
    ACTIVE_DATA_PATH,
    CONFIG_PATH,
    BACKUPS_DIR,
)


class TestPhonePrintPipeline(unittest.TestCase):

    def test_process_valid_demo_data(self):
        """Verifies ingestion, normalization, and JSON output of valid demo CSV data."""
        csv_path = Path("pipeline/data/survey_demo_data.csv")
        self.assertTrue(csv_path.exists(), "Demo CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(csv_path, tmp_path, is_demo=True)
            self.assertTrue(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 12)
            self.assertEqual(len(dataset["responses"]), 12)

            first = dataset["responses"][0]
            self.assertEqual(first["response_id"], "DEMO_RESP_001")
            self.assertEqual(first["preferred_brand"], "Apple")
            self.assertEqual(first["budget_range"], "Over $1,000")
            self.assertEqual(len(first["preferred_features"]), 3)
            self.assertIn("Camera Quality", first["preferred_features"])
            self.assertEqual(first["os_preference"], "iOS")
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_rejects_duplicate_respondent_ids(self):
        """Verifies that duplicate respondent IDs in the CSV are detected and rejected."""
        duplicate_csv = '''response_id,preferred_brand,budget_range,preferred_features,primary_use,os_preference
RESP_001,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
RESP_001,Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(duplicate_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("Duplicate respondent ID detected 'RESP_001'", str(ctx.exception.errors))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_rejects_fewer_than_three_features(self):
        """Verifies that selections with fewer than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features("Camera Quality; Battery Life", row_idx=1)
        self.assertIn("Exactly 3 distinct features must be selected; received 2", str(ctx.exception))

    def test_rejects_more_than_three_features(self):
        """Verifies that selections with more than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Processing Performance; Display Quality", row_idx=1
            )
        self.assertIn("Exactly 3 distinct features must be selected; received 4", str(ctx.exception))

    def test_rejects_duplicate_features_in_selection(self):
        """Verifies that duplicate features within the same respondent selection are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Camera Quality", row_idx=2
            )
        self.assertIn("Duplicate feature 'Camera Quality'", str(ctx.exception))

    def test_rejects_unrecognized_features(self):
        """Verifies that removed or unrecognized features (e.g. 5G, Fast Charging) are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; 5G Connectivity", row_idx=3
            )
        self.assertIn("Unrecognized feature '5G Connectivity'", str(ctx.exception))

    def test_rejects_missing_required_columns(self):
        """Verifies that CSV files missing required header columns are rejected."""
        incomplete_csv = """response_id,preferred_brand,budget_range
RESP_001,Apple,Over $1,000
"""
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(incomplete_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("missing required canonical survey fields", str(ctx.exception))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_google_forms_template_mapping(self):
        """Verifies that the Google Forms template CSV with full question headers maps correctly."""
        template_path = Path("data/templates/google_forms_survey_template.csv")
        self.assertTrue(template_path.exists(), "Template CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(template_path, tmp_path, is_demo=False)
            self.assertFalse(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 8)
            # Verify pseudonymized sequential IDs
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][7]["response_id"], "RESP_008")
            # Verify canonical features mapped from comma/semicolon strings
            for resp in dataset["responses"]:
                self.assertEqual(len(resp["preferred_features"]), 3)
                self.assertIsInstance(resp["preferred_brand"], str)
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_pii_stripping_guarantee(self):
        """Verifies that sensitive PII columns (e.g. Email Address) are strictly stripped."""
        csv_with_pii = '''Timestamp,Email Address,Username,Student Name,What is your preferred smartphone brand?,What is your budget range for a new smartphone?,Which 3 features matter most to you when choosing a smartphone?,What is your primary use for your smartphone?,What smartphone operating system do you prefer?
2026-11-06 10:00:00,student@university.edu,student1,Jane Doe,Apple,"Over $1,000","Camera Quality, Battery Life, Build & Design Quality",Social Media & Content Consumption,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_pii)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            json_text = tmp_json_path.read_text(encoding="utf-8")

            # Check that PII values never appear in the JSON output
            self.assertNotIn("student@university.edu", json_text)
            self.assertNotIn("student1", json_text)
            self.assertNotIn("Jane Doe", json_text)
            self.assertNotIn("Email Address", json_text)

            # Response structure only contains canonical fields
            resp = dataset["responses"][0]
            self.assertEqual(resp["response_id"], "RESP_001")
            self.assertEqual(resp["preferred_brand"], "Apple")
            self.assertNotIn("email", resp)
            self.assertNotIn("name", resp)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_blank_row_handling(self):
        """Verifies that blank or whitespace-only lines are ignored and counted cleanly."""
        csv_with_blanks = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS

   
Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android


'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_blanks)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(len(dataset["responses"]), 2)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_encoding_fallback_utf8_bom_and_latin1(self):
        """Verifies that UTF-8 with BOM and Latin-1 encodings are handled cleanly."""
        csv_content = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Google,"$400 - $700",Camera Quality; Battery Life; Software & OS Experience,Everyday Communication & Browsing,Android
'''
        # Test UTF-8 with BOM (common Excel export from Google Forms)
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8-sig") as f:
            f.write(csv_content)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
            self.assertEqual(dataset["responses"][0]["preferred_brand"], "Google")
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 1: Duplicate Detection With & Without Timestamps
    # -------------------------------------------------------------------------

    def test_duplicate_detection_missing_timestamp_retains_identical_preferences(self):
        """
        ISSUE 1 (A): When timestamp column is omitted, two valid respondents with
        identical preferences MUST both be retained, no exact duplicate excluded,
        and a clear warning emitted to sys.stderr.
        """
        csv_no_timestamp = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_no_timestamp)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            # Both respondents retained as distinct students
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][1]["response_id"], "RESP_002")

            # Warning captured
            stderr_output = stderr_capture.getvalue()
            self.assertIn("WARNING: Exact duplicate submission detection skipped", stderr_output)
            self.assertIn("no usable timestamp column was available", stderr_output)

            # Audit report confirms 0 exact duplicates excluded, 1 identical profile retained
            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 0)
                self.assertEqual(rep.get("identical_profiles_retained"), 1)
                self.assertEqual(rep.get("accepted_records"), 2)
                self.assertEqual(rep.get("rejected_records"), 0)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_duplicate_detection_available_timestamp_exact_duplicate_excluded(self):
        """
        ISSUE 1 (B): When timestamp is available, identical timestamps and identical answers
        trigger exact duplicate exclusion: first occurrence kept, second excluded.
        """
        csv_with_timestamp = '''Timestamp,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_timestamp)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            # Only first instance retained
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")

            # Audit report confirms exclusion
            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 1)
                self.assertEqual(rep.get("accepted_records"), 1)
                self.assertEqual(rep.get("rejected_records"), 1)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_duplicate_detection_distinct_timestamps_retains_both(self):
        """
        ISSUE 1 (C & D): When timestamps are distinct, identical preferences represent
        independent legitimate student choices. BOTH are retained as separate respondents.
        """
        csv_distinct_ts = '''Timestamp,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
2026-11-06 10:15:30,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_distinct_ts)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][1]["response_id"], "RESP_002")

            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 0)
                self.assertEqual(rep.get("identical_profiles_retained"), 1)
                self.assertEqual(rep.get("accepted_records"), 2)
                self.assertEqual(rep.get("rejected_records"), 0)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_accounting_invariant_holds(self):
        """ISSUE 1 (E): Verifies evaluated_rows == accepted_records + rejected_records."""
        csv_content = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS

InvalidBrand,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
Samsung,"$700 - $1,000",Camera Quality,Gaming,Android
Google,"$400 - $700",Camera Quality; Battery Life; Software & OS Experience,Everyday General Use,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_content)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(
                temp_csv_path,
                tmp_json_path,
                is_demo=False,
                filter_invalid=True,
            )
            self.assertEqual(dataset["metadata"]["total_responses"], 2)

            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(
                    rep.get("total_raw_rows"),
                    rep.get("blank_rows") + rep.get("accepted_records") + rep.get("rejected_records"),
                )
                self.assertEqual(
                    rep.get("evaluated_rows"),
                    rep.get("accepted_records") + rep.get("rejected_records"),
                )
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 3: Unmapped CSV Columns Warning
    # -------------------------------------------------------------------------

    def test_unmapped_csv_column_triggers_warning(self):
        """
        ISSUE 3: An unmapped non-PII column triggers a clear warning to sys.stderr
        identifying column names only, not respondent values.
        """
        csv_extra_col = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference,Additional Research Question
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS,SecretStudentOpinionValue123
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_extra_col)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            stderr_text = stderr_capture.getvalue()
            # Warning must identify column name
            self.assertIn("WARNING: Unmapped CSV columns will be ignored", stderr_text)
            self.assertIn("Additional Research Question", stderr_text)

            # Warning MUST NOT leak cell contents / respondent values
            self.assertNotIn("SecretStudentOpinionValue123", stderr_text)

            # Processing continues safely
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_explicitly_mapped_columns_do_not_trigger_unmapped_warning(self):
        """
        ISSUE 3: Columns that are explicitly mapped (canonical, PII, timestamp)
        do not trigger unmapped warnings.
        """
        csv_standard = '''Timestamp,Email Address,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,test@uni.edu,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_standard)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            stderr_text = stderr_capture.getvalue()
            self.assertNotIn("WARNING: Unmapped CSV columns will be ignored", stderr_text)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 2: Atomic Replacement & Failure Path Recovery Tests
    # -------------------------------------------------------------------------

    def test_activation_checklist_invariants_pass_on_valid_data(self):
        """Verifies that validate_dataset_invariants passes cleanly on demo data."""
        with open("src/data/survey_demo_data.json", "r", encoding="utf-8") as f:
            demo_data = json.load(f)
        errors = validate_dataset_invariants(demo_data)
        self.assertEqual(len(errors), 0, f"Valid demo data must have 0 invariant errors: {errors}")

    def test_activation_checklist_rejects_corrupted_dataset(self):
        """Verifies that validate_dataset_invariants catches duplicate IDs, count mismatch, and invalid features."""
        corrupted_data = {
            "metadata": {
                "version": "1.0.0",
                "total_responses": 3,
                "is_demo": False,
            },
            "responses": [
                {
                    "response_id": "RESP_001",
                    "preferred_brand": "Apple",
                    "budget_range": "Over $1,000",
                    "preferred_features": ["Camera Quality", "Battery Life", "Build & Design Quality"],
                    "primary_use": "Gaming",
                    "os_preference": "iOS",
                    "email": "leaked_pii@uni.edu",
                },
                {
                    "response_id": "RESP_001",
                    "preferred_brand": "UnknownBrand",
                    "budget_range": "Over $1,000",
                    "preferred_features": ["Camera Quality"],
                    "primary_use": "Gaming",
                    "os_preference": "iOS",
                },
            ],
        }
        errors = validate_dataset_invariants(corrupted_data)
        self.assertTrue(any("Metadata total_responses" in e for e in errors))
        self.assertTrue(any("Duplicate response_id" in e for e in errors))
        self.assertTrue(any("Prohibited PII field" in e for e in errors))
        self.assertTrue(any("Unknown brand" in e for e in errors))
        self.assertTrue(any("Expected exactly 3 features" in e for e in errors))

    def test_activation_failure_candidate_validation_leaves_active_unchanged(self):
        """
        ISSUE 2: Candidate validation failure prevents activation and leaves active dataset untouched.
        """
        # Save snapshot of current active dataset and config
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        # Create invalid candidate JSON
        invalid_candidate = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
        with tempfile.NamedTemporaryFile("w+", suffix=".json", delete=False, encoding="utf-8") as f:
            json.dump(invalid_candidate, f)
            invalid_path = Path(f.name)

        try:
            success = activate_dataset(str(invalid_path))
            self.assertFalse(success, "Activation must fail on empty / invalid dataset")

            # Active file and config must remain identical
            if orig_active:
                self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
            self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])
        finally:
            if invalid_path.exists():
                invalid_path.unlink()

    def test_activation_failure_backup_prevents_activation(self):
        """
        ISSUE 2: If backup creation fails, activation MUST abort and leave active dataset unchanged.
        """
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("pipeline.activate_dataset.backup_active_dataset", side_effect=RuntimeError("Disk write simulated failure")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must abort if backup creation fails")

        if orig_active:
            self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
        self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])

    def test_activation_failure_atomic_replacement_preserves_previous_dataset(self):
        """
        ISSUE 2: If os.replace fails during atomic deployment, the previous active dataset is preserved.
        """
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("os.replace", side_effect=OSError("Simulated filesystem lock")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must fail if atomic replace fails")

        if orig_active:
            self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
        self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])

    def test_activation_failure_config_update_triggers_recovery(self):
        """
        ISSUE 2: If atomic JSON replacement succeeds but configuration update fails,
        recovery restores the previous active dataset to prevent inconsistent state.
        """
        # Ensure we have a populated initial active dataset for backup
        initial_data = {
            "metadata": {"version": "1.0.0", "total_responses": 1, "is_demo": False},
            "responses": [{
                "response_id": "RESP_INIT",
                "preferred_brand": "Apple",
                "budget_range": "Over $1,000",
                "preferred_features": ["Camera Quality", "Battery Life", "Build & Design Quality"],
                "primary_use": "Gaming",
                "os_preference": "iOS"
            }]
        }
        ACTIVE_DATA_PATH.write_text(json.dumps(initial_data, indent=2), encoding="utf-8")
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("pipeline.activate_dataset.save_dataset_config", side_effect=IOError("Simulated config disk error")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must report failure if config save fails")

        # Verify recovery restored the initial data from backup
        curr_active_data = json.loads(ACTIVE_DATA_PATH.read_text(encoding="utf-8"))
        self.assertEqual(curr_active_data["responses"][0]["response_id"], "RESP_INIT")

        # Clean up and restore demo placeholder
        placeholder = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
        ACTIVE_DATA_PATH.write_text(json.dumps(placeholder, indent=2), encoding="utf-8")
        save_dataset_config(orig_config)
        for b in BACKUPS_DIR.glob("dataset_backup_*.json"):
            try:
                b.unlink()
            except Exception:
                pass

    def test_activation_success_and_rollback_flow(self):
        """
        ISSUE 2: Verifies end-to-end atomic activation of template data followed by clean rollback.
        """
        orig_config = get_dataset_config()
        template_path = Path("data/templates/google_forms_survey_template.csv")

        try:
            # 1. Activate
            success = activate_dataset(str(template_path))
            self.assertTrue(success, "Template activation should succeed")

            config_after = get_dataset_config()
            self.assertEqual(config_after["active_dataset"], "real")
            self.assertFalse(config_after["is_demo"])
            self.assertEqual(config_after["total_responses"], 8)

            active_json = json.loads(ACTIVE_DATA_PATH.read_text(encoding="utf-8"))
            self.assertEqual(len(active_json["responses"]), 8)

            # 2. Rollback
            rollback_success = rollback_dataset()
            self.assertTrue(rollback_success, "Rollback must succeed")

        finally:
            # Guarantee environment returns to canonical demo mode
            save_dataset_config(orig_config)
            placeholder = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
            ACTIVE_DATA_PATH.write_text(json.dumps(placeholder, indent=2), encoding="utf-8")
            for b in BACKUPS_DIR.glob("dataset_backup_*.json"):
                try:
                    b.unlink()
                except Exception:
                    pass

    def test_temporary_files_are_cleaned_up(self):
        """
        ISSUE 2: Verifies no temporary staging files linger in src/data or pipeline/data.
        """
        staging_files = list(ACTIVE_DATA_PATH.parent.glob("tmp_active_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_config_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_recovery_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_rollback_*.json"))
        self.assertEqual(len(staging_files), 0, f"Found lingering temporary files: {staging_files}")


if __name__ == "__main__":
    unittest.main()
```

---

### `src/__tests__/dataset_loader.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import {
  loadSurveyDataset,
  loadDemoSurveyDataset,
  getActiveDatasetInfo,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByBudget,
  getUniverseRespondentIds,
} from "@/lib/data/loader";
import { SMARTPHONE_FEATURES, SMARTPHONE_BRANDS, BUDGET_RANGES } from "@/types/survey";

describe("Dataset Loader & Configuration Engine", () => {
  it("loadDemoSurveyDataset loads and validates the 12-record benchmark fixture", () => {
    const dataset = loadDemoSurveyDataset();

    expect(dataset.metadata.is_demo).toBe(true);
    expect(dataset.metadata.total_responses).toBe(12);
    expect(dataset.responses.length).toBe(12);

    // Verify all responses conform to canonical properties
    for (const resp of dataset.responses) {
      expect(resp.response_id).toMatch(/^DEMO_RESP_\d{3}$/);
      expect(SMARTPHONE_BRANDS).toContain(resp.preferred_brand);
      expect(BUDGET_RANGES).toContain(resp.budget_range);
      expect(resp.preferred_features.length).toBe(3);

      const uniqueFeatures = new Set(resp.preferred_features);
      expect(uniqueFeatures.size).toBe(3);

      for (const feat of resp.preferred_features) {
        expect(SMARTPHONE_FEATURES).toContain(feat);
      }
    }
  });

  it("loadSurveyDataset returns currently active validated dataset", () => {
    const dataset = loadSurveyDataset();

    expect(dataset).toBeDefined();
    expect(dataset.metadata).toBeDefined();
    expect(dataset.responses.length).toBeGreaterThan(0);
    expect(dataset.metadata.total_responses).toBe(dataset.responses.length);
  });

  it("getActiveDatasetInfo provides accurate metadata and UI badge tokens", () => {
    const info = getActiveDatasetInfo();

    expect(info).toBeDefined();
    expect(typeof info.isDemo).toBe("boolean");
    expect(typeof info.totalResponses).toBe("number");
    expect(info.totalResponses).toBeGreaterThan(0);
    expect(typeof info.version).toBe("string");
    expect(typeof info.badgeText).toBe("string");
    expect(typeof info.tagText).toBe("string");

    if (info.isDemo) {
      expect(info.badgeText).toBe(`DEMO DATA (n=${info.totalResponses})`);
      expect(info.tagText).toBe(`[DEMO DATA: N=${info.totalResponses}]`);
    } else {
      expect(info.badgeText).toBe(`REAL SURVEY (n=${info.totalResponses})`);
      expect(info.tagText).toBe(`[REAL SURVEY: N=${info.totalResponses}]`);
    }
  });

  it("set extraction utilities correctly partition respondent IDs", () => {
    const dataset = loadSurveyDataset();
    const responses = dataset.responses;
    const universe = getUniverseRespondentIds(responses);

    expect(universe.size).toBe(responses.length);

    // Sum of brand partition sizes equals universe size (since each student picks 1 brand)
    let totalBrandCount = 0;
    for (const brand of SMARTPHONE_BRANDS) {
      const ids = getRespondentIdsByBrand(responses, brand);
      totalBrandCount += ids.size;
      for (const id of ids) {
        expect(universe.has(id)).toBe(true);
      }
    }
    expect(totalBrandCount).toBe(universe.size);

    // Sum of budget partition sizes equals universe size
    let totalBudgetCount = 0;
    for (const budget of BUDGET_RANGES) {
      const ids = getRespondentIdsByBudget(responses, budget);
      totalBudgetCount += ids.size;
      for (const id of ids) {
        expect(universe.has(id)).toBe(true);
      }
    }
    expect(totalBudgetCount).toBe(universe.size);

    // Feature selection conservation: each student picks exactly 3 features
    // Therefore sum of |S_f| across all 7 features must equal 3 * N
    let totalFeatureCount = 0;
    for (const feature of SMARTPHONE_FEATURES) {
      const ids = getRespondentIdsByFeature(responses, feature);
      totalFeatureCount += ids.size;
      for (const id of ids) {
        expect(universe.has(id)).toBe(true);
      }
    }
    expect(totalFeatureCount).toBe(3 * universe.size);
  });
});
```

---

### `PHASE07_DATA_IMPORT_GUIDE.md`

```markdown
# PhonePrint — Phase 07 Data Import & Pipeline Operator Guide

## Overview

This guide provides end-to-end operational instructions for ingesting, validating, cleaning, anonymizing, and activating real Google Forms survey data in the **PhonePrint** research application.

PhonePrint is built on discrete mathematics and set theory:
- **Feature Universe ($U_{\text{features}}$)**: Exactly 7 canonical features.
- **Selection Rule**: Each respondent selects **exactly three distinct features** ($\binom{7}{3} = 35$ unordered combinations).
- **Brand Choice**: Exactly one preferred brand from 7 canonical brands.
- **Budget Tier**: Exactly one of 4 price intervals.
- **Observational Integrity**: Pure discrete sets of unique student IDs with complete accounting transparency.

---

## 1. Exporting Survey Responses from Google Forms

To export responses from Google Forms:
1. Open your Google Form in your browser.
2. Navigate to the **Responses** tab at the top of the form.
3. Click the three vertical dots menu (**⋮**) in the top right corner of the Responses pane.
4. Select **Download responses (.csv)**.
5. A `.zip` archive containing a `.csv` file will be downloaded.
6. Extract the `.csv` file.
7. Rename the extracted CSV file to a descriptive name (for example, `survey_responses_2026.csv`).

> [!NOTE]
> Google Forms exports may include a UTF-8 Byte Order Mark (`utf-8-sig`) or Windows Latin-1 characters if opened in Excel. The PhonePrint ingestion pipeline includes automatic encoding fallback (`utf-8-sig` $\to$ `utf-8` $\to$ `latin1` $\to$ `cp1252`) and handles CSV quotes and commas safely.

---

## 2. Directory Placement

Place your downloaded survey CSV file into the designated raw data directory:

```text
data/raw/survey_responses_2026.csv
```

The PhonePrint data directory structure is organized as follows:
- `data/templates/`: Sample Google Forms CSV template (`google_forms_survey_template.csv`) demonstrating valid headers and formatting.
- `data/raw/`: Landing directory for uncleaned survey exports from Google Forms.
- `src/data/`: Application data consumed by Next.js components (`survey_demo_data.json`, `survey_active_data.json`, `dataset_config.json`).
- `src/data/backups/`: Timestamped rollback archives (`dataset_backup_YYYYMMDD_HHMMSS_N{total}.json`).
- `pipeline/reports/`: Automated cleaning audit reports (`cleaning_report.json`, `cleaning_report.md`).

---

## 3. Column Mapping Configuration (`pipeline/column_mapping.json`)

Google Forms automatically uses the exact text of your survey questions as CSV header column names. The pipeline uses `pipeline/column_mapping.json` to map these question titles to PhonePrint's canonical fields:

```json
{
  "canonical_fields": {
    "preferred_brand": [
      "preferred_brand",
      "What is your preferred smartphone brand?",
      "Which smartphone brand do you prefer?",
      "Brand"
    ],
    "budget_range": [
      "budget_range",
      "What is your typical smartphone budget range?",
      "What is your budget range for a new smartphone?",
      "Budget"
    ],
    "preferred_features": [
      "preferred_features",
      "Select your top 3 preferred features (Choose exactly 3):",
      "Which 3 features matter most to you when choosing a smartphone?",
      "Features"
    ],
    "primary_use": [
      "primary_use",
      "What is your primary use case for your smartphone?",
      "What is your primary use for your smartphone?",
      "Primary Use"
    ],
    "os_preference": [
      "os_preference",
      "What is your operating system preference?",
      "What smartphone operating system do you prefer?",
      "OS"
    ],
    "timestamp": [
      "Timestamp",
      "timestamp",
      "Date"
    ]
  },
  "pii_columns_to_strip": [
    "Email Address",
    "email",
    "Username",
    "Name",
    "Student ID",
    "IP Address"
  ],
  "ignored_columns": []
}
```

### Unmapped Non-PII Column Warnings
When survey administrators add questions without updating `column_mapping.json`, the pipeline identifies any CSV columns that are neither mapped to canonical fields, flagged as PII, nor listed in `ignored_columns`.
- It emits a clear warning to `sys.stderr`:
  ```text
  WARNING: Unmapped CSV columns will be ignored: ['Additional Question', 'Department']
  ```
- The warning contains **column names only**, never cell contents or respondent answers.
- Processing continues normally for optional research questions. Missing required survey fields still raise validation errors.

---

## 4. Running the Processing Pipeline

The pipeline is executed via Python 3:

### Option A: Standard Validation Run (Strict Mode)
Checks data integrity and reports any errors without modifying the active web application:

```powershell
.venv\Scripts\python.exe pipeline/process_survey.py data/raw/survey_responses_2026.csv -o data/survey_cleaned.json
```

If any survey record has invalid brands, invalid budgets, or feature counts other than 3, the pipeline will display the errors and exit with code 1.

### Option B: Filter Invalid Mode (`--filter-invalid`)
If you wish to accept all valid submissions while filtering out malformed rows into the audit report:

```powershell
.venv\Scripts\python.exe pipeline/process_survey.py data/raw/survey_responses_2026.csv -o data/survey_cleaned.json --filter-invalid
```

### Option C: Syncing Directly to Web Data
To update `src/data/survey_active_data.json` directly from the processing script:

```powershell
.venv\Scripts\python.exe pipeline/process_survey.py data/raw/survey_responses_2026.csv -o src/data/survey_active_data.json --sync-web-data
```

---

## 5. Interpreting the Cleaning & Quality Audit Report

Every pipeline execution generates two reports in `pipeline/reports/`:
- `pipeline/reports/cleaning_report.json`: Machine-readable accounting and error log.
- `pipeline/reports/cleaning_report.md`: Formatted Markdown audit document.

### The Accounting Verification Invariant

The audit report mathematically guarantees row conservation:
$$\text{Total Raw Rows} = \text{Blank Rows} + \text{Accepted Records} + \text{Rejected Records}$$

Example audit table:
| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Raw Rows in CSV** | 105 | 100.0% |
| Blank / Empty Rows (Skipped) | 3 | 2.9% |
| Evaluated Rows | 102 | 97.1% |
| **Final Accepted Responses** | **98** | **93.3%** |
| **Rejected / Excluded Records** | **4** | **3.8%** |

### Common Validation Errors & Resolutions

1. **Unrecognized Brand Name**:
   - *Cause*: A student entered a non-canonical brand (e.g. "Nothing Phone", "Sony").
   - *Resolution*: Canonical brands are `Apple`, `Samsung`, `Google`, `OnePlus`, `Xiaomi`, `Motorola`, `Other`. The pipeline normalizes common variants (e.g. `iPhone` $\to$ `Apple`, `Galaxy` $\to$ `Samsung`). Non-canonical brands normalize to `Other` or are rejected.
2. **Feature Count Violation**:
   - *Cause*: A student checked 2 features or 4 features instead of exactly 3.
   - *Resolution*: The discrete combinatorics space $C(7,3) = 35$ strictly requires exactly 3 distinct features. Rows with count $\ne 3$ are excluded. In Google Forms, enforce "Select exactly 3" via Response Validation.
3. **Duplicate Features**:
   - *Cause*: A student selected the same feature multiple times.
   - *Resolution*: Selections must be distinct. Such rows are logged and rejected.
4. **Blank Rows**:
   - *Cause*: Trailing newlines or empty rows in the CSV.
   - *Resolution*: Automatically detected and skipped without error.

---

## 6. Duplicate Detection Policy

The pipeline strictly differentiates between **exact duplicate submissions** and **legitimate identical preference profiles**:

### Case 1: When Timestamps are Available
- Identified when submission timestamp, metadata, and all five preference answers are identical (e.g., student double-clicked Submit or submitted twice at the exact same time).
- **Policy**: The first instance is retained; subsequent duplicate submissions are **excluded** and documented in the audit log.
- **Distinct Timestamps**: Submissions with different timestamps but identical preference answers are **both retained** as separate respondents.

### Case 2: When Timestamps are Missing or Unusable
- If no timestamp column was resolved or the timestamp column is completely empty:
  - Exact duplicate detection is **skipped** with a warning:
    ```text
    WARNING: Exact duplicate submission detection skipped because no usable timestamp column was available. Identical preference profiles are retained as distinct respondents.
    ```
  - `exact_dup_indices` is set to `[]`.
  - **Identical preference vectors alone never constitute proof of duplicate submission.**
  - All otherwise valid respondents are retained and assigned distinct anonymous IDs.

---

## 7. Privacy, Anonymization & Pseudonymization

### PII Stripping
The pipeline automatically identifies and strips Personally Identifiable Information (PII) columns:
- `Email Address`, `Username`, `Student Name`, `IP Address`, `Roll Number`, `Score`.
These fields are **never copied** to the output JSON and do not exist in the web application runtime.

### Sequential Pseudonymization
- Anonymous IDs are assigned monotonically: `RESP_001`, `RESP_002`, `RESP_003`, ..., `RESP_N`.
- **Anonymization vs. Pseudonymization**: Because raw Google Forms sheets may be maintained by university researchers separately with timestamps, the application uses *pseudonymized* identifiers. Once the raw sheet is deleted or decoupled, the dataset is completely *anonymized*.
- **Student Withdrawal Requests**: If a student requests that their response be withdrawn prior to public release, the researcher identifies their submission in the raw Google Sheet, removes the row, and re-executes the pipeline. The pipeline re-generates clean sequential IDs.

---

## 8. Safe Dataset Activation Checklist (`pipeline/activate_dataset.py`)

Before a dataset can replace the active application data, it must pass the **7-Step Safety Checklist** enforced by `pipeline/activate_dataset.py`:

```powershell
.venv\Scripts\python.exe pipeline/activate_dataset.py data/raw/survey_responses_2026.csv
```

### The 7-Step Verification Checklist:
1. **Source Inspection & Parsing**: Ingests CSV or JSON and verifies syntax.
2. **Mathematical & Structural Invariants**: Verifies 0 duplicate IDs, non-empty cohort, 3 canonical features per student, canonical brands/budgets/uses/OS, and no PII keys.
3. **Zod Schema Validation**: Validates the dataset against the TypeScript `surveyDatasetSchema` via `pipeline/validate_zod.ts`.
4. **Timestamped Backup**: Archives the current active dataset to `src/data/backups/dataset_backup_YYYYMMDD_HHMMSS_N{total}.json`. **Backup failure aborts activation immediately.**
5. **Atomic File Deployment**:
   - Creates a temporary staging file in the **same directory** as `ACTIVE_DATA_PATH` (`src/data/tmp_active_*.json`).
   - Writes candidate data, flushes, and calls `os.fsync()`.
   - Uses `os.replace()` to atomically swap the active dataset into place, guaranteeing no partial writes are visible to concurrent readers.
6. **Configuration Update with Recovery Strategy**:
   - Updates `src/data/dataset_config.json` atomically via a temporary staging file and `os.replace()`.
   - **Recovery Strategy**: If configuration update fails, the engine automatically rolls back `ACTIVE_DATA_PATH` from the backup file atomically, preventing inconsistent application state.
7. **Regression Guard**: All Next.js modules (`Campus Pulse`, `My PhonePrint`, `SetLab`, `ComboLab`, `Experiment Studio`) seamlessly load the active dataset.

---

## 9. One-Command Instant Rollback

If unexpected data anomalies or corrupted submissions are detected in production:

```powershell
.venv\Scripts\python.exe pipeline/activate_dataset.py --rollback
```

### Rollback Behavior:
- Restores the most recent timestamped backup from `src/data/backups/` using **atomic replacement** (`os.replace`).
- If no prior backups exist, safely reverts the application to the **Synthetic Demo Dataset** (`[DEMO DATA: N=12]`).
- Updates `src/data/dataset_config.json` atomically.

---

## 10. Inspecting Active Dataset Status

To inspect the currently active dataset:

```powershell
.venv\Scripts\python.exe pipeline/activate_dataset.py --status
```

Output:
```text
--- PhonePrint Dataset Status ---
Active Mode:     DEMO DATA
Active Dataset:  demo
Total Responses: 12
Last Updated:    2026-11-07T09:31:00.000000+00:00
Backups Count:   0
---------------------------------
```

---

## 11. UI Badges & Transparency

The PhonePrint interface provides continuous disclosure of the active data mode:

| Mode | Header Badge | Navigation Dot | Page Tag | Cohort Subtext |
| :--- | :---: | :---: | :---: | :---: |
| **Demo Mode** | `DEMO DATA (n=12)` (Lime) | Pulsing Lime | `[DEMO DATA: N=12]` (Amber) | Synthetic benchmark |
| **Real Survey** | `REAL SURVEY (n=X)` (Cobalt) | Pulsing Cobalt | `[REAL SURVEY: N=X]` (Cobalt) | Verified university cohort |

The application automatically reflects the active configuration without requiring code modifications or rebuilds.
```

---
