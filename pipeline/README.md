# PhonePrint — Offline Data-Processing Pipeline

This directory contains the Python data-cleaning and validation pipeline for the PhonePrint Discrete Mathematics and Graph Theory experiential-learning project.

## Responsibilities
- Ingests raw survey CSV files.
- Validates structural requirements and schema conformity.
- Enforces strict uniqueness of anonymous respondent identifiers (`response_id`).
- Enforces selection of **exactly 3 distinct features** per respondent.
- Canonicalizes and normalizes case, spacing, and delimiter variations.
- Emits structured JSON datasets with explicit `is_demo` metadata flagging.

## Directory Structure
```
pipeline/
├── data/
│   ├── survey_demo_data.csv       # Synthetic benchmark CSV [DEMO DATA]
│   └── survey_demo_data.json      # Pipeline-generated JSON output
├── process_survey.py              # Core data-cleaning and validation pipeline
├── test_pipeline.py               # Pipeline unit tests
├── requirements.txt               # Pinned Python dependencies
└── README.md
```

## Running the Pipeline

Ensure the Python virtual environment is activated or call the interpreter directly:

```bash
# Process demo CSV and output JSON
.venv\Scripts\python.exe pipeline/process_survey.py --sync-web-data

# Run pipeline validation tests
.venv\Scripts\python.exe -m unittest pipeline/test_pipeline.py
```

## Disclaimer
All data files marked with `[DEMO DATA]` or `is_demo: true` contain synthetic records designed solely for software architecture and mathematical algorithm verification. They do not represent empirical findings.
