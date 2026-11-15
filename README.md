# PhonePrint — Interactive Smartphone Preference Analytics

**PhonePrint** is an interactive smartphone brand and feature preference analytics platform developed as an experiential-learning project for university courses in **Discrete Mathematics and Graph Theory**.

The platform models respondent preference selections as discrete mathematical sets and combinatorial structures, enabling empirical exploration of set-theoretic properties (intersections, unions, relative complements, and the Principle of Inclusion-Exclusion) alongside graph-theoretic feature affinity networks.

> [!NOTE]
> **Academic Integrity & Simulated Benchmark Data (N=30)**  
> All active survey datasets currently loaded represent a calibrated benchmark of 30 simulated student responses explicitly marked `is_demo: true` and labeled `SIMULATED CAMPUS DATA — N=30`. These datasets contain synthetic benchmark records generated solely for algorithmic verification, schema validation, and discrete mathematical exploration. They do not represent empirical market research findings. An automated, atomic offline Python pipeline stands ready to ingest and activate genuine Google Forms exports upon survey closure.

---

## 1. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org/) | `15.x` | Modern server-rendered and statically generated React framework |
| **UI Library** | [React](https://react.dev/) | `19.x` | Component architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.x` | Strict type safety (`"strict": true`, unused param/local checking) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `3.4.x` | Utility-first responsive design system |
| **Visualizations**| [Recharts](https://recharts.org/) | `2.15.x` | Declarative SVG/HTML5 charting pipeline |
| **Schema Validation**| [Zod](https://zod.dev/) | `3.24.x` | Runtime schema parsing and domain integrity constraints |
| **Mathematics Rendering**| [KaTeX](https://katex.org/) | `0.16.x` | Fast LaTeX mathematical notation typography |
| **Unit Testing** | [Vitest](https://vitest.dev/) | `3.x` | High-performance ESM-native unit testing runner |
| **Offline Pipeline**| Python & Pandas | `3.13` / `pandas 3.1.x` | Batch CSV validation, text normalization, and JSON emission |

---

## 2. Project Architecture

The codebase strictly decouples mathematical set calculations and data processing from presentation components:

```
PhonePrint/
├── pipeline/                         # Offline Python data-processing pipeline
│   ├── data/
│   │   ├── survey_demo_data.csv      # Synthetic benchmark CSV [DEMO DATA]
│   │   └── survey_demo_data.json     # Pipeline-generated JSON output
│   ├── process_survey.py             # Data-cleaning, normalization, validation CLI
│   ├── test_pipeline.py              # Automated tests for pipeline
│   ├── requirements.txt              # Pinned Python dependencies (pandas, numpy)
│   └── README.md                     # Pipeline documentation
├── src/
│   ├── app/                          # Next.js App Router routes & pages
│   │   ├── layout.tsx                # Root layout with typography and metadata
│   │   ├── page.tsx                  # Technical foundation overview dashboard
│   │   └── globals.css               # Tailwind directives and KaTeX styling
│   ├── components/
│   │   ├── layout/                   # Structural layout (Header, Footer)
│   │   ├── ui/                       # Atomic UI widgets (Card, Badge, StatCard, KaTeXMath)
│   │   └── visualizations/           # Chart components (BrandDistributionChart via Recharts)
│   ├── data/                         # Web-accessible benchmark data
│   │   ├── survey_demo_data.json     # Cleaned demo dataset
│   │   ├── survey_demo_data.csv      # Raw demo CSV
│   │   └── README.md                 # Data architecture specification
│   ├── lib/
│   │   ├── math/                     # Pure mathematical foundations
│   │   │   ├── sets.ts               # Set intersection, union, difference, cardinality, PIE
│   │   │   ├── combinations.ts       # nCr calculation, nPr, combination enumeration
│   │   │   └── index.ts              # Mathematical barrel export
│   │   └── data/
│   │       └── loader.ts             # Discrete respondent ID set extraction utilities
│   ├── schemas/
│   │   └── survey.schema.ts          # Zod schemas for response and dataset validation
│   ├── types/
│   │   ├── survey.ts                 # Domain models, brand, budget, and feature enums
│   │   └── math.ts                   # Set theory and combinatorics type interfaces
│   └── __tests__/                    # Vitest unit test suites
│       ├── survey.schema.test.ts     # Schema conformity & duplicate ID tests
│       ├── sets.test.ts              # Set intersection, union, difference, cardinality
│       ├── combinations.test.ts      # nCr calculation, edge cases, subset enumeration
│       └── inclusion_exclusion.test.ts # Formal verification of |A ∪ B| = |A| + |B| - |A ∩ B|
├── public/                           # Static assets
├── eslint.config.mjs                 # Flat ESLint configuration
├── next.config.mjs                   # Next.js production configuration
├── package.json                      # Node dependencies and scripts
├── postcss.config.mjs                # PostCSS Tailwind plugins
├── tailwind.config.ts                # Tailwind theme and content extensions
├── tsconfig.json                     # Strict TypeScript configuration
├── vitest.config.ts                  # Vitest test configuration with @/* alias
└── README.md                         # Project documentation
```

---

## 3. Data Architecture & Format

Each survey response captures six discrete attributes:

1. `response_id`: Unique anonymised respondent identifier (e.g. `DEMO_RESP_001`). Enforced unique across the entire dataset.
2. `preferred_brand`: Canonical smartphone brand (`Apple`, `Samsung`, `Google`, `OnePlus`, `Xiaomi`, `Motorola`, `Other`).
3. `budget_range`: Target purchase tier (`Under $400`, `$400 - $700`, `$700 - $1,000`, `Over $1,000`).
4. `preferred_features`: **Exactly three distinct** feature selections from the canonical domain of 7 features.
5. `primary_use`: Primary use case (`Photography & Videography`, `Gaming`, `Business & Productivity`, `Social Media & Content Consumption`, `Everyday General Use`).
6. `os_preference`: Ecosystem preference (`Android`, `iOS`, `No Preference`).

### Canonical 7-Feature Domain
- `Camera Quality`
- `Battery Life`
- `Processing Performance`
- `Display Quality`
- `Storage Capacity`
- `Build & Design Quality`
- `Software & OS Experience`

---

## 4. Mathematical Module Overview

All calculations operate as **pure, side-effect-free functions** directly on discrete collections (Sets or Arrays of unique respondent identifiers), preventing invalid approximation errors:

### Set Operations (`src/lib/math/sets.ts`)
- **Intersection**: $A \cap B = \{ x \mid x \in A \land x \in B \}$ (includes generalized $n$-set intersection)
- **Union**: $A \cup B = \{ x \mid x \in A \lor x \in B \}$ (includes generalized $n$-set union)
- **Relative Complement (Difference)**: $A \setminus B = \{ x \in A \mid x \notin B \}$
- **Symmetric Difference**: $A \mathbin{\Delta} B = (A \setminus B) \cup (B \setminus A)$
- **Cardinality**: $|A|$ (count of unique elements)
- **Principle of Inclusion-Exclusion (PIE)**:
  $$|A \cup B| = |A| + |B| - |A \cap B|$$
  $$|A \cup B \cup C| = |A| + |B| + |C| - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|$$

### Combinatorics (`src/lib/math/combinations.ts`)
- **Binomial Coefficients (nCr)**:
  $$C(n, r) = \binom{n}{r} = \frac{n!}{r!(n - r)!}$$
  Implemented using an iterative multiplicative algorithm with symmetry optimization ($r = \min(r, n-r)$) to prevent intermediate integer overflow.
- **Combination Enumeration**:
  Generates all $\binom{n}{r}$ distinct subsets. For the canonical 7 features with $r = 3$, enumerates all $\binom{7}{3} = 35$ possible feature combinations.

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js**: v20+ (v24.x tested)
- **npm**: v10+ (v11.x tested)
- **Python**: v3.10+ (v3.13.x tested)

### 1. Web Application Setup
```bash
# Install node dependencies
npm install

# Run TypeScript type-checker in strict mode
npm run typecheck

# Run linter
npm run lint

# Run all unit tests with Vitest
npm test

# Build production bundle
npm run build

# Start production server
npm start
```

### 2. Python Offline Pipeline Setup
```bash
# Create Python virtual environment
python -m venv .venv

# Install required packages (Windows)
.venv\Scripts\pip.exe install -r pipeline/requirements.txt

# Execute survey ingestion and validation pipeline
.venv\Scripts\python.exe pipeline/process_survey.py --sync-web-data

# Run pipeline validation unit tests
.venv\Scripts\python.exe -m unittest pipeline/test_pipeline.py
```

---

## 6. Testing Instructions & Test Coverage

The test suite covers:
1. **Schema Validation (`src/__tests__/survey.schema.test.ts`)**:
   - Compliant response validation.
   - Rejection of fewer or more than 3 features.
   - Rejection of duplicate features in a respondent's selection.
   - Duplicate respondent ID detection across a dataset.
   - Synthetic benchmark dataset integrity validation.
2. **Set Operations (`src/__tests__/sets.test.ts`)**:
   - Overlapping, disjoint, subset, and empty set intersections.
   - Union, difference, and symmetric difference.
   - Cardinality calculation and array deduplication.
3. **Combinatorics (`src/__tests__/combinations.test.ts`)**:
   - $nCr$ calculations ($C(7, 3) = 35$, $C(5, 2) = 10$, $C(30, 4) = 27,405$).
   - Parameter boundary errors (negative $n$, $r > n$, non-integers).
   - Exact enumeration of all 35 distinct feature triplets.
4. **Inclusion-Exclusion Principle (`src/__tests__/inclusion_exclusion.test.ts`)**:
   - 2-set identity $|A \cup B| = |A| + |B| - |A \cap B|$.
   - 3-set identity verification.
   - Live evaluation over respondent sets partitioned by brand and feature.
5. **Python Pipeline (`pipeline/test_pipeline.py`)**:
   - CSV parsing, column validation, text normalization, duplicate rejection.
