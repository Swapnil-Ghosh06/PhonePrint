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
    # Canonical INR bands
    "under ₹15,000": "Under ₹15,000",
    "under 15000": "Under ₹15,000",
    "under 15,000": "Under ₹15,000",
    "<15000": "Under ₹15,000",
    "<₹15,000": "Under ₹15,000",
    "below 15000": "Under ₹15,000",
    "below ₹15,000": "Under ₹15,000",
    "under 15k": "Under ₹15,000",
    "under ₹15k": "Under ₹15,000",
    "₹15,000 - ₹30,000": "₹15,000 - ₹30,000",
    "₹15,000-₹30,000": "₹15,000 - ₹30,000",
    "15000 - 30000": "₹15,000 - ₹30,000",
    "15,000 - 30,000": "₹15,000 - ₹30,000",
    "15000-30000": "₹15,000 - ₹30,000",
    "15k - 30k": "₹15,000 - ₹30,000",
    "₹30,000 - ₹60,000": "₹30,000 - ₹60,000",
    "₹30,000-₹60,000": "₹30,000 - ₹60,000",
    "30000 - 60000": "₹30,000 - ₹60,000",
    "30,000 - 60,000": "₹30,000 - ₹60,000",
    "30000-60000": "₹30,000 - ₹60,000",
    "30k - 60k": "₹30,000 - ₹60,000",
    "above ₹60,000": "Above ₹60,000",
    "above 60000": "Above ₹60,000",
    "above 60,000": "Above ₹60,000",
    "above 60k": "Above ₹60,000",
    "over ₹60,000": "Above ₹60,000",
    "over 60000": "Above ₹60,000",
    "over 60,000": "Above ₹60,000",
    "over 60k": "Above ₹60,000",
    ">60000": "Above ₹60,000",
    ">₹60,000": "Above ₹60,000",
    ">60k": "Above ₹60,000",
    # Legacy USD backward compatibility mapping
    "under $400": "Under ₹15,000",
    "<$400": "Under ₹15,000",
    "under 400": "Under ₹15,000",
    "below $400": "Under ₹15,000",
    "$400 - $700": "₹15,000 - ₹30,000",
    "$400-$700": "₹15,000 - ₹30,000",
    "400 - 700": "₹15,000 - ₹30,000",
    "$700 - $1,000": "₹30,000 - ₹60,000",
    "$700-$1000": "₹30,000 - ₹60,000",
    "$700 - $1000": "₹30,000 - ₹60,000",
    "700 - 1000": "₹30,000 - ₹60,000",
    "over $1,000": "Above ₹60,000",
    "over $1000": "Above ₹60,000",
    "over 1000": "Above ₹60,000",
    ">$1000": "Above ₹60,000",
    ">$1,000": "Above ₹60,000",
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
