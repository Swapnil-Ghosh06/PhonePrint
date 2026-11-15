# PhonePrint — Data Architecture Specification

This directory houses survey response datasets and structure definitions for the PhonePrint Discrete Mathematics & Graph Theory platform.

> **ACADEMIC DISCLAIMER**: All datasets currently located here and marked with `[DEMO DATA]` or `is_demo: true` contain synthetic development benchmark records. They are generated solely for architectural validation and algorithm testing, and do not represent empirical research results.

---

## 1. Schema Definition

Each respondent record contains six discrete fields:

| Field Name | Type | Allowed Values / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `response_id` | `string` | Unique identifier (e.g. `DEMO_RESP_001`) | Anonymised unique respondent ID. Must be strictly distinct across the dataset. |
| `preferred_brand` | `string` | `Apple`, `Samsung`, `Google`, `OnePlus`, `Xiaomi`, `Motorola`, `Other` | The respondent's primary smartphone brand choice. |
| `budget_range` | `string` | `Under ₹15,000`, `₹15,000 - ₹30,000`, `₹30,000 - ₹60,000`, `Above ₹60,000` | Target smartphone purchasing budget category. |
| `preferred_features` | `string[]` | Exactly **3 distinct** features from canonical list | Array of 3 features prioritized by the respondent. |
| `primary_use` | `string` | `Photography & Videography`, `Gaming`, `Business & Productivity`, `Social Media & Content Consumption`, `Everyday General Use` | Primary daily smartphone use case. |
| `os_preference` | `string` | `Android`, `iOS`, `No Preference` | Operating system ecosystem preference. |

### Canonical Feature Domain (7 Features)
1. `Camera Quality`
2. `Battery Life`
3. `Processing Performance`
4. `Display Quality`
5. `Storage Capacity`
6. `Build & Design Quality`
7. `Software & OS Experience`

---

## 2. CSV Format

- Delimiter: comma (`,`)
- Text encoding: UTF-8
- Line comments starting with `#` are ignored by the Python ingestion pipeline.
- Fields containing commas (such as `"Above ₹60,000"`, `"₹30,000 - ₹60,000"`, `"Photography & Videography"`) must be enclosed in double quotes.
- `preferred_features` contains exactly 3 features separated by semicolons (`;`).

```csv
# PHONEPRINT SYNTHETIC BENCHMARK DATASET [DEMO DATA]
response_id,preferred_brand,budget_range,preferred_features,primary_use,os_preference
DEMO_RESP_001,Apple,"Above ₹60,000",Camera Quality; Battery Life; Build & Design Quality,Photography & Videography,iOS
DEMO_RESP_002,Samsung,"₹30,000 - ₹60,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android
DEMO_RESP_003,Google,"₹15,000 - ₹30,000",Camera Quality; Software & OS Experience; Battery Life,Everyday General Use,Android
```

---

## 3. JSON Format

The JSON document contains top-level dataset `metadata` and an array of `responses`:

```json
{
  "metadata": {
    "version": "2.1.0",
    "generated_at": "2026-11-03T17:32:06.000000+00:00",
    "total_responses": 30,
    "is_demo": true,
    "description": "SIMULATED CAMPUS DATA — N=30. Realistic synthetic student preference survey for university discrete mathematics exploration."
  },
  "responses": [
    {
      "response_id": "RESP_001",
      "preferred_brand": "Apple",
      "budget_range": "Above ₹60,000",
      "preferred_features": [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality"
      ],
      "primary_use": "Photography & Videography",
      "os_preference": "iOS"
    }
  ]
}
```
