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
