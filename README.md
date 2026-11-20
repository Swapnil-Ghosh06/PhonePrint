# 📱 PhonePrint — Discrete Preference Analytics

<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.0-black?style=for-the-badge&logo=framer)
![Vitest](https://img.shields.io/badge/Vitest-152_Tests_Passing-6E9F18?style=for-the-badge&logo=vitest)
![Theme](https://img.shields.io/badge/Theme-Warm_Beige_&_Cream-FBF9F4?style=for-the-badge)

<p align="center">
  <b>A visual discrete mathematics laboratory modeling smartphone preference dynamics through combinatorial feature spaces, empirical set theory, and graph affinity structures.</b>
</p>

[Live Interactive Modules](#-interactive-modules--visual-showcase) • [Mathematical Rigor](#-mathematical-foundations) • [Design System](#-design-system--editorial-aesthetic) • [Getting Started](#-getting-started) • [Test Suite](#-verification--test-suite)

</div>

---

## 🌟 Overview

**PhonePrint** is an experiential laboratory designed for university courses in **Discrete Mathematics** and **Graph Theory**. Rather than presenting abstract formulas in a vacuum, PhonePrint models real-world university student smartphone preferences through discrete mathematical structures:

- **Empirical Set Theory**: Set intersections ($A \cap B$), unions ($A \cup B$), relative complements ($A \setminus B$), symmetric differences ($A \mathbin{\Delta} B$), and formal proofs of the **Principle of Inclusion-Exclusion (PIE)**.
- **Combinatorial Space**: Enumeration of the $\binom{7}{3} = 35$ theoretical feature triplets against empirical observations, contrasting unordered bundle selections against the $P(7, 3) = 210$ ordered permutation priority space.
- **Stratified Hypothesis Testing**: Brand–feature preference associations ($P(f \mid b)$ strictly conserving to $300\%$ across 3-feature choices) and budget-segmented distributions ($P(t \mid p)$ strictly conserving to $100\%$).
- **Editorial Creative Studio Design**: A warm beige/cream aesthetic (`#FBF9F4`) with fluid spring interactions, interactive SVG Venn diagrams, and tactile bento components — strictly free of AI slop, harsh dark modes, or raw unformatted data dumps.

> [!NOTE]
> **Verified Benchmark Dataset ($N=30$)**  
> All active data files represent a calibrated benchmark cohort of 30 university student responses tagged with `is_demo: true` and labeled `SIMULATED CAMPUS DATA — N=30`. The records model realistic undergraduate preferences across all canonical brands, budget ranges, and 3-feature combinations to validate schema integrity, mathematical invariants, and interactive visual analytics.

---

## 📸 Interactive Modules & Visual Showcase

### Module 01: Campus Pulse (Hero & Preference Dynamics)
The interactive entryway featuring an archetype card deck, tactile slot-wheel combinatorics, and dynamic distribution bar charts.
![Campus Pulse Hero](docs/screenshots/01-campus-pulse-home.png)

---

### Module 02: My PhonePrint (Preference Profiler)
Construct personal smartphone priority profiles with brand selectors, budget intervals, and 3-of-7 canonical feature toggles. Computes exact matches ($N_3$) and partition breakdowns ($N_2, N_1, N_0$) satisfying $N_3 + N_2 + N_1 + N_0 = 30$.
![My PhonePrint Profiler](docs/screenshots/02-my-phoneprint.png)

---

### Module 03: SetLab (Set Theory & Interactive Venn Diagrams)
Evaluate pairwise and 3-set operations (union, intersection, symmetric difference, complement) on discrete sets of respondent IDs. Includes interactive SVG Venn diagrams with pastel translucent petals and step-by-step arithmetic proofs of the Principle of Inclusion-Exclusion (PIE).
![SetLab Venn Diagram](docs/screenshots/03-setlab.png)

---

### Module 04: ComboLab (Combinatorial Feature Space)
Explore the binomial coefficient space $C(n, r) = \binom{n}{r}$ with an interactive factorial scrubber, side-by-side comparisons of unordered combinations vs ordered permutations ($P(7, 3) = 210$), and exhaustive grid exploration of all 35 theoretical triplets.
![ComboLab Feature Space](docs/screenshots/04-combolab.png)

---

### Module 05: Experiment Studio (Preference Hypothesis Testing)
Hypothesis testing laboratory with dynamic multi-select controls, a cross-tabulation heatmap matrix, grouped Recharts distributions, and budget-stratified combination analysis with denominator integrity safeguards.
![Experiment Studio Heatmap](docs/screenshots/05-experiment-studio.png)

---

### Module 06: Methodology & Data Architecture
Comprehensive documentation of the 7-feature canonical domain, Zod validation schemas, discrete mathematical identities, and the 4-stage data ingestion pipeline.
![Methodology and Architecture](docs/screenshots/06-methodology.png)

---

## 📐 Mathematical Foundations

All mathematical operations in PhonePrint are implemented as **pure, side-effect-free TypeScript functions** operating directly on discrete collections of unique student IDs.

### 1. Set Theory & Principle of Inclusion-Exclusion (`src/lib/math/sets.ts`)
- **Intersection**: $A \cap B = \{ x \in U \mid x \in A \land x \in B \}$
- **Union**: $A \cup B = \{ x \in U \mid x \in A \lor x \in B \}$
- **Relative Complement**: $A \setminus B = \{ x \in U \mid x \in A \land x \notin B \}$
- **Symmetric Difference**: $A \mathbin{\Delta} B = (A \setminus B) \cup (B \setminus A)$
- **Two-Set PIE Identity**:
  $$|A \cup B| = |A| + |B| - |A \cap B|$$
- **Three-Set PIE Identity**:
  $$|A \cup B \cup C| = (|A| + |B| + |C|) - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|$$

### 2. Combinatorics & Permutations (`src/lib/math/combinations.ts`)
- **Canonical Feature Universe ($n = 7$)**:
  1. `Camera Quality`
  2. `Battery Life`
  3. `Processing Performance`
  4. `Display Quality`
  5. `Storage Capacity`
  6. `Build & Design Quality`
  7. `Software & OS Experience`
- **Selection Rule ($r = 3$)**: Each respondent selects **exactly three distinct features**.
- **Binomial Coefficients (Unordered Triplets)**:
  $$C(7, 3) = \binom{7}{3} = \frac{7!}{3!(7-3)!} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35$$
- **Permutations (Ordered Priority Podium)**:
  $$P(7, 3) = \frac{7!}{(7-3)!} = 7 \times 6 \times 5 = 210$$
  Each unordered combination corresponds to exactly $3! = 6$ distinct ordered permutations.

### 3. Empirical Invariants & Conservation Laws
- **Brand Feature Sum Invariant**: Because each respondent selects 3 features, the sum of conditional percentages across all 7 features for any populated brand cohort strictly conserves to $300\%$:
  $$\sum_{f=1}^{7} P(f \mid b) = 300.0\% \quad \text{where } P(f \mid b) = \frac{|S_b \cap S_f|}{N(b)} \times 100\%$$
- **Budget Stratification Conservation Law**: Because each respondent selects exactly one triplet and belongs to one budget tier:
  $$\sum_{t \in C(7,3)} P(t \mid p) = 100.0\% \quad \text{where } P(t \mid p) = \frac{C(p, t)}{N(p)} \times 100\%$$

---

## 🎨 Design System & Editorial Aesthetic

The user interface follows a **Creative Studio** visual direction, prioritizing warmth, elegance, tactile micro-interactions, and clear data communication:

| Design Dimension | Specification | Implementation Details |
| :--- | :--- | :--- |
| **Canvas Background** | Warm Parchment / Beige | `#FBF9F4` default background; `#FAF8F5` surface containers |
| **Card Surfaces** | Soft Ivory & Pure White | `#FFFFFF` cards with `#EAE3D5` hairline borders and `rounded-3xl` corners |
| **Primary Typography** | **DM Sans** | Used for all narrative, descriptive copy, and article paragraphs |
| **Heading Typography** | **Montserrat** | Used for bold section headers, titles, and brand banners |
| **Math & Metric Typography** | **Sora** | Used for LaTeX formulas, cardinalities ($n$), numbers, and badge chips |
| **Badges & Stickers** | Soft Pastel Glass | Amber (`#FEF08A`), Sage/Emerald (`#DCFCE7`), Sky (`#E0F2FE`), Lavender (`#F3E8FF`) |
| **Primary Actions** | Deep Obsidian | `#1C1B18` solid buttons with white text and spring hover scaling |
| **Animation Engine** | **Framer Motion** & **GSAP** | Spring physics, card deck spreads, smooth modal reveals, and SVG transitions |

---

## 📂 Project Architecture

```
PhonePrint/
├── docs/
│   └── screenshots/                  # High-resolution application screenshots
│       ├── 01-campus-pulse-home.png
│       ├── 02-my-phoneprint.png
│       ├── 03-setlab.png
│       ├── 04-combolab.png
│       ├── 05-experiment-studio.png
│       └── 06-methodology.png
├── pipeline/                         # Offline Python data-processing pipeline
│   ├── data/
│   │   ├── survey_demo_data.csv      # Raw survey benchmark CSV
│   │   └── survey_demo_data.json     # Validated runtime benchmark JSON
│   ├── process_survey.py             # Data normalization & Zod pre-validator
│   └── test_pipeline.py              # Automated pipeline test suite
├── public/                           # Static assets & public screenshot mirror
├── src/
│   ├── app/                          # Next.js App Router routes
│   │   ├── layout.tsx                # Font injection & persistent pill navbar
│   │   ├── page.tsx                  # Campus Pulse (Hero & Interactive Deck)
│   │   ├── my-phoneprint/page.tsx    # Personal preference profiler & matching
│   │   ├── setlab/page.tsx           # 2-Set & 3-Set Venn lab & PIE calculator
│   │   ├── combolab/page.tsx         # Combinatorics lab & 35-triplet explorer
│   │   ├── experiment-studio/page.tsx# Brand-feature cross-tabs & budget tiers
│   │   └── methodology/page.tsx      # Formal academic documentation
│   ├── components/
│   │   ├── home/                     # Hero, card deck, interactive set playground
│   │   ├── layout/                   # Navbar, AppShell, Footer
│   │   ├── my-phoneprint/            # PreferenceBuilder, MatchCards, Overlap
│   │   ├── setlab/                   # VennDiagram2Set, VennDiagram3Set, PIE, Explorer
│   │   ├── combolab/                 # CombinationCalc, Permutations, 35-Grid, Budget
│   │   ├── experiment-studio/        # Heatmap, BarChart, Controls, Modal
│   │   └── ui/                       # PageHeader, Button, Card, Badge, Callout, KaTeXMath
│   ├── lib/
│   │   ├── data/                     # Dataset loader & combination analytics
│   │   └── math/                     # Pure TypeScript discrete mathematics engine
│   │       ├── sets.ts               # Intersections, unions, differences, PIE
│   │       ├── combinations.ts       # nCr, nPr, permutations, subsets
│   │       ├── venn.ts               # 2-set & 3-set Venn partition geometries
│   │       ├── matchingEngine.ts     # Exact and partial preference matching
│   │       ├── brandFeatureExperiment.ts # Cross-tabulations & 300% conservation
│   │       └── budgetCombinationExperiment.ts # Budget stratification & voids
│   ├── schemas/
│   │   └── survey.schema.ts          # Zod validation schema (strict 3-feature rule)
│   ├── types/
│   │   ├── survey.ts                 # Domain models (Brand, Feature, Budget enums)
│   │   ├── math.ts                   # Set theory and combinatorics type interfaces
│   │   └── experiment.ts             # Cross-tabulation and matrix types
│   └── __tests__/                    # Vitest unit test suite (152 tests)
├── tailwind.config.ts                # Custom palette, fonts, and animation configs
├── tsconfig.json                     # Strict TypeScript compiler options
└── vitest.config.ts                  # Vitest runner configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x+` (Node.js 24 tested)
- **npm**: `v10.x+`

### Installation & Execution

```bash
# 1. Clone repository
git clone https://github.com/sukhirm/PhonePrint.git
cd PhonePrint

# 2. Install dependencies
npm install

# 3. Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification

```bash
# Verify TypeScript in strict mode
npm run typecheck

# Run full unit test suite (152 tests)
npm test

# Generate optimized static production build (10/10 routes)
npm run build

# Start production server
npm start
```

---

## 🧪 Verification & Test Suite

PhonePrint maintains a **100% pass rate across 152 unit tests** in Vitest, strictly verifying mathematical accuracy, schema conformity, and partition theorems:

| Test Suite File | Tests | Validated Mathematical Properties |
| :--- | :---: | :--- |
| `combinations.test.ts` | 26 | $n\text{C}r$ calculations, factorial boundaries ($n \le 18$), edge cases ($r > n, r=0, r=n$), symmetry $C(n,r) = C(n,n-r)$, and exact 35-triplet enumeration. |
| `sets.test.ts` | 17 | Intersection ($A \cap B$), union ($A \cup B$), difference ($A \setminus B$), symmetric difference ($A \mathbin{\Delta} B$), subset relations ($A \subseteq B$), and disjointness. |
| `venn.test.ts` | 15 | Two-set and three-set Venn region partitioning, ensuring the sum of all 7 disjoint internal regions equals the direct triple union $|A \cup B \cup C|$. |
| `inclusion_exclusion.test.ts` | 6 | Exact arithmetic identity $|A \cup B| = |A| + |B| - |A \cap B|$ and three-set theorem over empirical survey subsets with 0 aggregation error. |
| `matching_engine.test.ts` | 16 | Exact match filter ($N_3$) and disjoint partial match tiers ($N_2, N_1, N_0$) proving $N_3 + N_2 + N_1 + N_0 = N$. |
| `brand_feature_experiment.test.ts` | 10 | Cross-tabulation matrix $|S_b \cap S_f|$, denominator safety $N(b)$, and mathematical conservation to $300.0\%$. |
| `budget_combination_experiment.test.ts` | 6 | Stratified triplet counts across budget tiers, within-budget percentage conservation to $100.0\%$, and theoretical void detection. |
| `survey.schema.test.ts` | 10 | Zod schema validation: strict rejection of duplicate features, rejection of non-3 selections, and unique ID enforcement. |
| `dataset_loader.test.ts` | 4 | Anonymized student ID extraction and cohort universe validation. |
| `inr_currency.test.ts` | 10 | Currency tier parsing and boundary intervals. |
| `combination_analytics.test.ts` | 11 | Frequency sorting, tied rankings, and space coverage calculations. |
| `stress_test.test.ts` | 21 | High-throughput boundary testing under synthetic dataset loads. |
| **Total** | **152** | **All 152 Vitest unit tests passing cleanly.** |

---

## 📄 License & Academic Attribution

Developed as an experiential discrete mathematics project. Distributed under the MIT License. See `LICENSE` for details.
