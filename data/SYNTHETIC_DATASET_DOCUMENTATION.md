# PhonePrint — Synthetic Campus Survey Dataset (N=30)

## 1. Academic Disclosure & Dataset Identity

> **IMPORTANT NOTICE**:
> This dataset is a **simulated benchmark cohort** consisting of exactly 30 synthetic student records (`N = 30`).
> It is constructed specifically for testing, demonstrating, and evaluating discrete mathematical set operations,
> combinatorial structures, and web application interactions in the PhonePrint platform.
> **These records are NOT empirical survey submissions collected from human subjects.**

## 2. Structural Characteristics

- **Total Record Count ($N$)**: 30 unique respondents (`RESP_001` through `RESP_030`).
- **Canonical Smartphone Brands ($|\mathcal{B}| = 7$)**:
  - Apple: 10 (33.3%)
  - Samsung: 6 (20.0%)
  - Google: 5 (16.7%)
  - Xiaomi: 4 (13.3%)
  - OnePlus: 3 (10.0%)
  - Motorola: 1 (3.3%)
  - Other: 1 (3.3%)
  *Total: 30 (100.0%)*

- **Canonical Budget Ranges ($|\mathcal{P}| = 4$)**:
  - Under ₹15,000: 3 (10.0%)
  - ₹15,000 - ₹30,000: 13 (43.3%)
  - ₹30,000 - ₹60,000: 8 (26.7%)
  - Above ₹60,000: 6 (20.0%)
  *Total: 30 (100.0%)*

- **Canonical Feature Selection Rules**:
  - Strict cardinality: Exactly 3 distinct features per student chosen from the 7 canonical features.
  - Total feature selections across cohort: $3 \times 30 = 90$.
  - Total theoretical combinations available: $\binom{7}{3} = 35$.

## 3. Feature Selection Frequencies

  - Battery Life: 19 selections (63.3% of students)
  - Processing Performance: 19 selections (63.3% of students)
  - Camera Quality: 18 selections (60.0% of students)
  - Display Quality: 15 selections (50.0% of students)
  - Storage Capacity: 10 selections (33.3% of students)
  - Software & OS Experience: 5 selections (16.7% of students)
  - Build & Design Quality: 4 selections (13.3% of students)

  *Sum of feature selections: 90 (Guaranteed = 3N = 90)*

## 4. File Formats & Deliverables

1. `PhonePrint_Synthetic_Survey_Dataset.xlsx`: Official academic Excel workbook (3 sheets: Responses, Summary, Methodology).
2. `src/data/survey_demo_data.json`: Canonical JSON structure consumed by the Next.js runtime.
3. `src/data/survey_demo_data.csv`: Tabular CSV format compatible with spreadsheet software.
4. `data/synthetic_survey_30.csv`: Flat tabular export.
