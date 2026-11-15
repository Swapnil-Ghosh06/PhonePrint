# PhonePrint: University Smartphone Brand & Feature Preference Analytics
## Final Academic Defense & Comprehensive Project Presentation
**Course / Discipline**: Discrete Mathematics, Combinatorial Structures & Full-Stack Systems Engineering  
**Academic Term**: Experiential Learning Final Defense  
**Project Status**: Phase 09 — Visual Redesign, Editorial Light Theme & N=300 Simulated Dataset Upgrade  
**Active Dataset Mode**: `[SIMULATED CAMPUS DATA: N=300]` (Calibrated Synthetic Demonstration Benchmark)  
**System Architecture**: Next.js 15 (App Router), TypeScript 5.8, Tailwind CSS, KaTeX, Vitest, Python 3.12 Data Pipeline  
**Design Theme**: Editorial Light Mathematics Theme (`#FBFBF9` warm paper, `#181715` typography, restrained `#2563EB` cobalt & `#84CC16` lime accents)  

---

## 1. Title & Abstract

### 1.1 Project Title
**PhonePrint**: Modeling University Smartphone Brand and Feature Preferences via Pure Discrete Set Theory, Combinatorial Analytics, and High-Assurance Web Engineering.

### 1.2 Abstract
University student cohorts represent one of the most technologically saturated and brand-conscious demographics in modern consumer economics. However, traditional market research methodologies frequently rely on black-box heuristics or lossy aggregate metrics that obscure individual decision-making mechanisms. 

**PhonePrint** is an experiential-learning laboratory designed to explore student smartphone preferences through the rigorous lens of Discrete Mathematics. Operating on an anonymous survey universe $U$, PhonePrint formalizes brand allegiances, purchasing constraints, and feature prioritization as discrete set-theoretic partitions and combinatorial choices. Every participant selects a primary smartphone brand from a canonical set of seven, a discrete budget tier from four bounded intervals, and exactly three distinct features from an approved universe of seven canonical hardware/software attributes ($C(7,3) = 35$).

By mapping respondent preferences to deterministic set operations—including the Principle of Inclusion-Exclusion (PIE) in two and three dimensions, symmetric difference, relative complements, and exact triplet enumeration—PhonePrint transforms survey data into an interactive, mathematically verifiable pedagogical laboratory.

> **Academic Dataset Status**: In accordance with institutional research integrity protocols, the application is presented in **Simulated Benchmark Mode ($N=300$)** labeled **`SIMULATED CAMPUS DATA — N=300`**. Simulated demonstration records are explicitly identified and never conflated with real human research findings; instead, a complete, idempotent Python data hygiene pipeline stands ready to ingest and activate genuine Google Forms exports upon survey closure.

---

## 2. Executive Summary

### 2.1 Research Objectives
1. **Pedagogical Grounding**: Bridge abstract discrete mathematics (naive set theory, Boolean algebra, combinatorics, proof verification) with modern software engineering and data visualization.
2. **Deterministic Modeling**: Replace approximate or heuristic preference matching with pure set operations executed directly on discrete sets of respondent IDs.
3. **Data Integrity & Privacy**: Guarantee zero collection or retention of Personally Identifiable Information (PII) by utilizing SHA-256 cryptographic hashing with salt and UUID generation.
4. **Architectural Robustness**: Deliver a production-grade, statically prerendered web application accompanied by an automated, atomic offline data ingestion and validation pipeline.
5. **Editorial Visual Design**: Provide a publication-grade light editorial aesthetic inspired by *MathIt* and *WOVE*, featuring crisp serif display typography, double hairline dividers, subtle glassmorphism, and high-contrast accessibility.

### 2.2 Core Modules Overview
* **Campus Pulse (`/`)**: High-level cohort demographics, brand share, budget stratification, and individual feature frequency histograms over the 300 simulated respondents.
* **My PhonePrint (`/my-phoneprint`)**: Personalized preference matching engine computing exact set intersections ($B \cap P \cap F$) and a mutually exclusive 4-way partition ($N_3 + N_2 + N_1 + N_0 = 300$).
* **SetLab (`/setlab`)**: Interactive discrete mathematics laboratory enabling real-time evaluation of unions, intersections, set differences, symmetric differences, and formal PIE step-by-step proofs on 2-set and 3-set Venn diagrams over $U=300$.
* **ComboLab (`/combolab`)**: Combinatorial feature space explorer analyzing all $\binom{7}{3} = 35$ theoretical triplets, calculating empirical densities across the 300 simulated responses, and contrasting permutations $P(n, r)$ against combinations $C(n, r)$.
* **Experiment Studio (`/experiment-studio`)**: Dual-experiment hypothesis testing suite featuring a dynamic 300% Brand-Feature association matrix and a Budget-Tier combination distribution table.
* **Methodology & Data Hygiene (`/methodology`)**: Formal documentation of data schemas, mathematical proofs, offline sanitization pipelines, and atomic activation protocols.

---

## 3. Mathematical Foundations: Set Theory

PhonePrint models all respondent interactions using axiomatic naive set theory.

### 3.1 Universe and Subsets
Let $U$ represent the universal set of all validated survey respondents:
$$U = \{ u_1, u_2, \dots, u_N \}, \quad |U| = N$$
In current simulated demo mode, $N = 300$.

For any attribute condition $C$ (such as brand preference or feature selection), the cohort satisfying $C$ is defined as the discrete subset:
$$S_C = \{ u \in U \mid \text{condition}(u) = C \} \subseteq U$$

### 3.2 Fundamental Set Operations
For any two subsets $A, B \subseteq U$:
* **Union**: $A \cup B = \{ u \in U \mid u \in A \lor u \in B \}$
* **Intersection**: $A \cap B = \{ u \in U \mid u \in A \land u \in B \}$
* **Relative Complement (Set Difference)**: $A \setminus B = \{ u \in U \mid u \in A \land u \notin B \}$
* **Absolute Complement**: $A^c = U \setminus A = \{ u \in U \mid u \notin A \}$
* **Symmetric Difference**: $A \Delta B = (A \setminus B) \cup (B \setminus A) = (A \cup B) \setminus (A \cap B)$

### 3.3 Principle of Inclusion-Exclusion (PIE)

#### Two-Set Formulation
For any two arbitrary subsets $A, B \subseteq U$, the cardinality of their union satisfies:
$$|A \cup B| = |A| + |B| - |A \cap B|$$

*Empirical Example ($N=300$)*:
Let $A = \text{Apple}$ ($|A| = 105$), $B = \text{Camera Quality}$ ($|B| = 177$).
Their intersection $|A \cap B| = 70$.
$$|A \cup B| = 105 + 177 - 70 = 212$$
Evaluating direct set union on unique respondent IDs yields exactly 212 elements, confirming the theorem.

#### Three-Set Formulation
For any three arbitrary subsets $A, B, C \subseteq U$:
$$|A \cup B \cup C| = |A| + |B| + |C| - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|$$

*Step-by-step verification in SetLab*:
1. **Singletons**: $S_1 = |A| + |B| + |C|$
2. **Pairwise Intersections**: $S_2 = |A \cap B| + |A \cap C| + |B \cap C|$
3. **Triple Intersection**: $S_3 = |A \cap B \cap C|$
4. **Calculated RHS**: $|A \cup B \cup C| = S_1 - S_2 + S_3$

SetLab evaluates this theorem dynamically across all brand and feature combinations, verifying that the empirical set union $|A \cup B \cup C|$ matches the calculated algebraic right-hand side identically.

---

## 4. Mathematical Foundations: Combinatorics

### 4.1 Canonical Feature Universe
Let $\mathcal{F}$ denote the approved universe of seven smartphone features:
$$\mathcal{F} = \{ f_1, f_2, f_3, f_4, f_5, f_6, f_7 \}, \quad |\mathcal{F}| = 7$$
where:
1. $f_1$: Camera Quality
2. $f_2$: Battery Life
3. $f_3$: Processing Performance
4. $f_4$: Display Quality
5. $f_5$: Storage Capacity
6. $f_6$: Build & Design Quality
7. $f_7$: Software & OS Experience

### 4.2 Combinations $C(7, 3)$
Since the order in which a respondent selects their three preferred features does not matter (selecting Camera, Battery, Display is identical to selecting Display, Camera, Battery), feature selections form unordered combinations:
$$C(n, r) = \binom{n}{r} = \frac{n!}{r!(n - r)!}$$
For $n = 7, r = 3$:
$$\binom{7}{3} = \frac{7!}{3! \times 4!} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35$$

### 4.3 Permutations $P(7, 3)$
If feature selections were ordered (e.g. 1st priority, 2nd priority, 3rd priority), the parameter space would expand:
$$P(7, 3) = \frac{7!}{(7 - 3)!} = 7 \times 6 \times 5 = 210$$
PhonePrint's ComboLab demonstrates this ratio:
$$\frac{P(7, 3)}{C(7, 3)} = 3! = 6$$
Every unordered combination represents exactly 6 distinct ordered permutations.

---

## 5. Campus Pulse (`/`)

### 5.1 Cohort Architecture
The Campus Pulse dashboard provides real-time exploratory analytics over the active simulated dataset ($N=300$).
* **Total Sample Size**: $N = 300$ verified anonymous student records.
* **Canonical Universe**: 7 approved smartphone brands, 4 budget intervals, 7 canonical features.
* **Selection Rule**: Exactly 3 distinct features per student, yielding $3 \times 300 = 900$ total feature selections across the cohort.

### 5.2 Observed Distributions within the Simulated Dataset ($N=300$)
* **Brand Shares**:
  * Apple: $105 / 300 = 35.0\%$
  * Samsung: $74 / 300 = 24.7\%$
  * Google: $53 / 300 = 17.7\%$
  * OnePlus: $34 / 300 = 11.3\%$
  * Xiaomi: $18 / 300 = 6.0\%$
  * Motorola: $11 / 300 = 3.7\%$
  * Other: $5 / 300 = 1.7\%$
  * $\sum P(B) = 100.0\%$ (Conservation of whole cohort)
* **Budget Allocations**:
  * Under \$400: $42 / 300 = 14.0\%$
  * \$400 - \$700: $87 / 300 = 29.0\%$
  * \$700 - \$1,000: $96 / 300 = 32.0\%$
  * Over \$1,000: $75 / 300 = 25.0\%$
  * $\sum P(P) = 100.0\%$
* **Feature Frequencies**:
  * Camera Quality: $177 / 300 = 59.0\%$
  * Battery Life: $172 / 300 = 57.3\%$
  * Processing Performance: $146 / 300 = 48.7\%$
  * Display Quality: $142 / 300 = 47.3\%$
  * Storage Capacity: $112 / 300 = 37.3\%$
  * Build & Design Quality: $89 / 300 = 29.7\%$
  * Software & OS Experience: $62 / 300 = 20.7\%$
  * Sum of Feature Selections: $177 + 172 + 146 + 142 + 112 + 89 + 62 = 900 = 3 \times 300$.

---

## 6. My PhonePrint (`/my-phoneprint`)

### 6.1 Preference Vector Formulation
A user defines their smartphone preference vector $\mathbf{v} = (b^*, p^*, F^*)$, where:
* $b^* \in \mathcal{B}$ (Target Brand)
* $p^* \in \mathcal{P}$ (Target Budget)
* $F^* = \{f_a, f_b, f_c\} \subset \mathcal{F}, |F^*| = 3$ (Target Feature Triplet)

### 6.2 Exact Matching ($B \cap P \cap F$)
Let:
$$B = \{ u \in U \mid \text{brand}(u) = b^* \}$$
$$P = \{ u \in U \mid \text{budget}(u) = p^* \}$$
$$F = \{ u \in U \mid \text{features}(u) = F^* \}$$
The exact matching subset is computed directly as the three-way intersection:
$$\text{ExactMatches} = B \cap P \cap F$$

### 6.3 Mutually Exclusive 4-Way Partition
Every respondent $u \in U$ matches $k \in \{0, 1, 2, 3\}$ of the user's primary criteria:
$$\mathbf{1}_B(u) + \mathbf{1}_P(u) + \mathbf{1}_F(u) = k$$
This partitions the universe $U$ into four pairwise disjoint subsets:
$$U = C_3 \cup C_2 \cup C_1 \cup C_0$$
where:
* $C_3 = \text{ExactMatches}$ (All 3 criteria satisfied)
* $C_2 = (B \cap P \setminus F) \cup (B \cap F \setminus P) \cup (P \cap F \setminus B)$ (Exactly 2 criteria)
* $C_1 = (B \setminus (P \cup F)) \cup (P \setminus (B \cup F)) \cup (F \setminus (B \cup P))$ (Exactly 1 criterion)
* $C_0 = U \setminus (B \cup P \cup F)$ (0 criteria satisfied)

**Conservation Law**:
$$|C_3| + |C_2| + |C_1| + |C_0| = |U| = 300$$
The matching engine verifies this identity at runtime for every user input.

---

## 7. SetLab (`/setlab`)

SetLab provides an interactive visual laboratory for evaluating discrete set theory.
* Evaluates 2-set and 3-set Venn diagrams with high-contrast SVG geometry on an editorial warm paper canvas.
* Live step-by-step arithmetic proofs verifying algebraic cardinality against direct set union.
* Interactive respondent inspector listing the exact respondent IDs within any selected Venn region.

---

## 8. ComboLab (`/combolab`)

ComboLab explores the discrete combinatorial space of feature triplets:
* **The 35 Triplet Universe**: Displays all $C(7,3) = 35$ feature triplets with empirical ranking across the 300 responses.
* **Combinations Calculator**: Implements $C(n, r)$ and $P(n, r)$ with strict integer recurrence up to $n = 18$ ($18! = 6,402,373,705,728,000 \le \text{Number.MAX\_SAFE\_INTEGER}$).
* **Budget Stratification**: Cross-tabulates all 35 triplets against the 4 budget tiers, verifying the conservation law $\sum_{t=1}^{35} P(t \mid p) = 100.0\%$ for each budget tier.

---

## 9. Experiment Studio (`/experiment-studio`)

Experiment Studio enables academic hypothesis testing:
* **Experiment 01 (Brand–Feature Matrix)**: Cross-tabulates brands against canonical features. Demonstrates that $\sum_{f=1}^7 P(f \mid b) = 300.0\%$ when all 7 features are included, and dynamically updates the displayed sum with an explanatory badge when features are filtered.
* **Experiment 02 (Combinations by Budget)**: Evaluates triplet concentration across price tiers with exact budget segment denominators $N(p)$.

---

## 10. Methodology & Data Hygiene (`/methodology`)

* Documents the 6-field survey data schema validated via TypeScript Zod.
* Outlines the offline Python data sanitization pipeline (`pipeline/process_survey.py`) with duplicate submission handling and pseudonymization.
* Outlines the atomic deployment protocol (`pipeline/activate_dataset.py`) ensuring zero-downtime dataset swaps with automatic rollback recovery.

---

## 11. Technical Architecture & Quality Assurance

### 11.1 Technology Stack
* **Framework**: Next.js 15.2 (React 19, App Router, TypeScript 5.8)
* **Styling**: Tailwind CSS with custom editorial light design tokens (`paper`, `stone-900`, `cobalt-600`, `lime-600`)
* **Typography**: Serif display font stack (`font-serif`) and monospace data codes (`font-mono`)
* **Mathematical Typography**: KaTeX 0.16
* **Visualizations**: Recharts 2.15 & Custom SVG Venn Diagrams
* **Testing**: Vitest 3.0 (135 tests), Python `unittest` (25 tests)

### 11.2 Verification Scorecard
* **Vitest Suite**: 11 test suites, **135 / 135 passing tests** (100% pass rate).
* **Python Pipeline Suite**: **25 / 25 passing tests**.
* **TypeScript Compiler**: `tsc --noEmit` passed with **0 errors**.
* **ESLint**: Next.js linter passed with **0 warnings / 0 errors**.
* **Static Build**: `next build` compiled **10 / 10 static routes**.

---
*Report certified for Phase 09 Light Editorial & N=300 Release.*
