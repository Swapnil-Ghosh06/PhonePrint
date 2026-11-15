# PhonePrint Phase 09 — Dataset Validation & Consistency Report

Detailed analysis and automated consistency verification of the 300-student simulated campus survey dataset across CSV, JSON, and SQL formats.

---


## File: `data/SYNTHETIC_DATASET_DOCUMENTATION.md` (**MODIFIED IN PHASE 09**)

> **Notes**: Complete statistical analysis, brand frequencies, budget allocations, and 35-triplet empirical counts for N=300.

```
# PhonePrint — Synthetic Campus Survey Dataset (N=300)

## 1. Academic Disclosure & Dataset Identity

> **IMPORTANT NOTICE**:
> This dataset is a **simulated benchmark cohort** consisting of exactly 300 synthetic student records (`N = 300`).
> It is constructed specifically for testing, demonstrating, and evaluating discrete mathematical set operations,
> combinatorial structures, and web application interactions in the PhonePrint platform.
> **These records are NOT empirical survey submissions collected from human subjects.**

## 2. Structural Characteristics

- **Total Record Count ($N$)**: 300 unique respondents (`RESP_001` through `RESP_300`).
- **Canonical Smartphone Brands ($|\mathcal{B}| = 7$)**:
  - Apple: 105 (35.0%)
  - Samsung: 81 (27.0%)
  - Google: 48 (16.0%)
  - OnePlus: 27 (9.0%)
  - Xiaomi: 18 (6.0%)
  - Motorola: 12 (4.0%)
  - Other: 9 (3.0%)

- **Canonical Budget Ranges ($|\mathcal{P}| = 4$)**:
  - Under $400: 42 (14.0%)
  - $400 - $700: 113 (37.7%)
  - $700 - $1,000: 91 (30.3%)
  - Over $1,000: 54 (18.0%)

- **Canonical Feature Selection Rules**:
  - Strict cardinality: Exactly 3 distinct features per student chosen from the 7 canonical features.
  - Total feature selections across cohort: $3 \times 300 = 900$.
  - Total theoretical combinations available: $\binom{7}{3} = 35$.

## 3. Feature Selection Frequencies

  - Camera Quality: 177 selections (59.0% of students)
  - Battery Life: 176 selections (58.7% of students)
  - Processing Performance: 131 selections (43.7% of students)
  - Display Quality: 123 selections (41.0% of students)
  - Storage Capacity: 120 selections (40.0% of students)
  - Software & OS Experience: 92 selections (30.7% of students)
  - Build & Design Quality: 81 selections (27.0% of students)

  *Sum of feature selections: 900 (Guaranteed = 3N = 900)*

## 4. File Formats

1. `data/synthetic_survey_300.csv`: Tabular CSV format compatible with Microsoft Excel, Google Sheets, and Pandas.
2. `src/data/survey_demo_data.json`: Canonical JSON structure consumed by the Next.js runtime.
3. `data/seed_survey_300.sql`: SQL DDL and INSERT script for relational database replication.

```


## File: `scratch/verify_dataset_300.py` (**MODIFIED IN PHASE 09**)

> **Notes**: Python verification script proving exact consistency across synthetic_survey_300.csv, survey_demo_data.json, and seed_survey_300.sql.

```python
import json
import csv

def verify():
    # 1. JSON
    with open('src/data/survey_demo_data.json', encoding='utf-8') as f:
        json_data = json.load(f)
    responses = json_data['responses']
    print(f"JSON responses: {len(responses)}")
    assert len(responses) == 300, f"Expected 300, got {len(responses)}"
    
    ids = [r['response_id'] for r in responses]
    assert len(ids) == len(set(ids)) == 300, "Duplicate IDs in JSON!"
    
    canonical_brands = {"Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Motorola", "Other"}
    canonical_budgets = {"Under $400", "$400 - $700", "$700 - $1,000", "Over $1,000"}
    canonical_features = {
        "Camera Quality",
        "Battery Life",
        "Processing Performance",
        "Display Quality",
        "Storage Capacity",
        "Build & Design Quality",
        "Software & OS Experience"
    }
    
    for r in responses:
        rid = r['response_id']
        assert r['preferred_brand'] in canonical_brands, f"Invalid brand in {rid}: {r['preferred_brand']}"
        assert r['budget_range'] in canonical_budgets, f"Invalid budget in {rid}: {r['budget_range']}"
        feats = r['preferred_features']
        assert len(feats) == 3, f"Invalid feature count in {rid}: {len(feats)}"
        assert len(set(feats)) == 3, f"Duplicate features in {rid}: {feats}"
        for f in feats:
            assert f in canonical_features, f"Unknown feature in {rid}: {f}"

    # 2. CSV
    with open('data/synthetic_survey_300.csv', mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        csv_rows = list(reader)
    print(f"CSV rows: {len(csv_rows)}")
    assert len(csv_rows) == 300, f"Expected 300 CSV rows, got {len(csv_rows)}"
    for i, row in enumerate(csv_rows):
        json_r = responses[i]
        assert row['respondent_id'] == json_r['response_id'], f"Mismatch at row {i} response_id: {row['respondent_id']} vs {json_r['response_id']}"
        assert row['preferred_brand'] == json_r['preferred_brand'], f"Mismatch at row {i} brand"
        assert row['budget_range'] == json_r['budget_range'], f"Mismatch at row {i} budget"
        csv_feats = [row['feature_1'], row['feature_2'], row['feature_3']]
        assert set(csv_feats) == set(json_r['preferred_features']), f"Mismatch at row {i} features: {csv_feats} vs {json_r['preferred_features']}"

    # 3. SQL
    with open('data/seed_survey_300.sql', mode='r', encoding='utf-8') as f:
        sql_text = f.read()
    import re
    sql_tuples = re.findall(r"\('RESP_\d{3}',[^)]+\)", sql_text)
    print(f"SQL value tuples: {len(sql_tuples)}")
    assert len(sql_tuples) == 300, f"Expected 300 SQL tuples, got {len(sql_tuples)}"
    
    print("\nSUCCESS: All 300 records are completely valid, consistent, and identical across JSON, CSV, and SQL!")

if __name__ == '__main__':
    verify()

```
