# PhonePrint: Faculty Demonstration Guide & Oral Defense Script
## Experiential Learning Presentation & Live Evaluation Protocol
**Target Audience**: Academic Faculty Committee, Discrete Mathematics & Software Engineering Evaluators  
**Estimated Defense Duration**: 15–20 minutes  
**Application Status**: Phase 09 — Light Editorial Redesign & N=300 Simulated Dataset Upgrade  
**Dataset Active**: Verified Simulated Benchmark Dataset (`[SIMULATED CAMPUS DATA: N=300]`)  
**Design Theme**: Editorial Light Mathematics Theme (`#FBFBF9` warm paper, `#181715` typography, cobalt/lime accents)  

---

## 1. Demonstration Setup & Protocol Checklist

### 1.1 Pre-Flight Verification
Before initiating the oral defense, confirm that the following commands succeed in the terminal:
```bash
# 1. Verify TypeScript type safety
npm run typecheck

# 2. Verify coding standards and lint hygiene
npm run lint

# 3. Verify Vitest unit & stress test suites (135 tests)
npm test -- --run

# 4. Verify Python data pipeline test suite (25 tests)
.venv\Scripts\python.exe -m unittest pipeline/test_pipeline.py

# 5. Launch the production application
npm run build
npm run start
```
Open a browser at `http://localhost:3000`. Confirm the status badge in the navigation bar displays:
`SIMULATED CAMPUS DATA — N=300`

---

## 2. Minute-by-Minute Faculty Presentation Script

### Minute 00:00 – 02:30 | Introduction & Academic Context
* **Presenter Dialogue**:
  > *"Good morning, esteemed faculty committee. Today, I am proud to present **PhonePrint**, an experiential-learning laboratory that connects undergraduate Discrete Mathematics and Combinatorics with high-assurance modern web systems.*
  >
  > *Market preference surveys typically present aggregate percentages, hiding individual decision paths behind opaque summaries. In PhonePrint, we model survey responses using **pure discrete set theory**.*
  >
  > *Every student response is treated as an element in a discrete universal set $U$. Every brand, budget interval, and hardware attribute corresponds to an exact subset. By executing deterministic set algebra directly on sets of anonymous student identifiers, we eliminate statistical estimation errors and make mathematical theorems—such as the Principle of Inclusion-Exclusion and Binomial Coefficients—tangible, interactive, and verifiable.*
  >
  > *Notice our publication-grade **Editorial Light Theme**, inspired by classic mathematics typography and editorial design: warm off-white paper canvas, high-contrast serif display titles, double hairline dividers, and minimal vector branding uniting smartphone contours with biometric fingerprint ridges.*
  >
  > *Before we tour the modules, an important academic data disclosure: the application is running on a calibrated benchmark of **300 simulated undergraduate responses** (`SIMULATED CAMPUS DATA — N=300`). We explicitly label this dataset as simulated demonstration data and never present it as genuine human survey findings. An automated, atomic offline Python pipeline stands ready to ingest and activate genuine Google Forms exports upon survey completion."*

---

### Minute 02:30 – 05:00 | Route 1: Campus Pulse (`/`)
* **Presenter Action**: Navigate to `/` (Campus Pulse).
* **Presenter Dialogue**:
  > *"We begin at **Campus Pulse**, our cohort overview.*
  >
  > *Notice our four primary structural metrics:
  > 1. **Survey Cohort**: $N = 300$ verified student records with 100% unique IDs.
  > 2. **Canonical Features**: Exactly 7 approved hardware and software attributes.
  > 3. **Triplet Choice Space**: Exactly $\binom{7}{3} = 35$ available feature combinations.
  > 4. **Selection Rule**: Exactly 3 distinct features per student, establishing an exact invariant of $3 \times 300 = 900$ feature selections across the cohort.*
  >
  > *Below the metrics, our Recharts bar charts illustrate:
  > - **Brand Preference**: Apple (35.0%) and Samsung (24.7%) lead the cohort, followed by Google (17.7%) and OnePlus (11.3%).
  > - **Budget Allocation**: Mid-Range and Flagship tiers dominate ($700–$1,000 represents 32.0%, $400–$700 represents 29.0%).
  > - **Feature Ranking**: Camera Quality (59.0%) and Battery Life (57.3%) lead student hardware priorities.*
  >
  > *At the bottom of Campus Pulse, we see our first live theorem verification: the **Principle of Inclusion-Exclusion** $|A \cup B| = |A| + |B| - |A \cap B|$. Taking Set A (Apple, $|A|=105$) and Set B (Camera, $|B|=177$), their intersection is $|A \cap B| = 70$. The direct set union cardinality is $|A \cup B| = 212$, identically matching $105 + 177 - 70 = 212$."*

---

### Minute 05:00 – 08:00 | Route 2: My PhonePrint (`/my-phoneprint`)
* **Presenter Action**: Click **02 My PhonePrint** in the top navigation bar.
* **Presenter Dialogue**:
  > *"Next, we enter **My PhonePrint**, our personalized preference profiler.*
  >
  > *Here, a user specifies their personal PhonePrint vector: a brand, a budget tier, and exactly three canonical features.*
  >
  > *Let us select **Apple**, **Over \$1,000**, and **{Camera Quality, Battery Life, Build & Design Quality}**.*
  >
  > *Immediately, the matching engine computes:
  > 1. **Exact Matches ($B \cap P \cap F$)**: 13 students in the cohort share this exact three-dimensional profile.
  > 2. **Mutually Exclusive 4-Way Partition**: The cohort is partitioned into four non-overlapping equivalence classes:
  >    - $N_3$ (Exact match on all 3 dimensions): 13 students.
  >    - $N_2$ (Matches exactly 2 dimensions): 51 students.
  >    - $N_1$ (Matches exactly 1 dimension): 138 students.
  >    - $N_0$ (Matches 0 dimensions): 98 students.
  >    - **Conservation Law**: $13 + 51 + 138 + 98 = 300 = N$.
  > 3. **Independent Feature Overlap**: Evaluating only feature triplet overlap $|F^* \cap \text{features}(u)|$:
  >    - 3 of 3 features: 24 students.
  >    - At least 2 of 3 features: 142 students.
  >    - At least 1 of 3 features: 270 students.*
  >
  > *In the table below, clicking any row inspects the anonymized survey submission in full."*

---

### Minute 08:00 – 11:00 | Route 3: SetLab (`/setlab`)
* **Presenter Action**: Navigate to **03 SetLab**.
* **Presenter Dialogue**:
  > *"Now let us examine **SetLab**, our interactive set theory laboratory.*
  >
  > *SetLab allows users to select two or three subsets from the universe and visualize their Boolean algebra on custom SVG Venn diagrams.*
  >
  > *Let us select:
  > - **Set A**: Apple ($|A| = 105$)
  > - **Set B**: Camera Quality ($|B| = 177$)*
  >
  > *Notice the operations toolbar: Union ($A \cup B$), Intersection ($A \cap B$), Relative Complement ($A \setminus B$), Symmetric Difference ($A \Delta B$), and Absolute Complement ($A^c$).*
  >
  > *Clicking any operation updates the Venn diagram shading and dynamically populates the **Step-by-Step PIE Proof Box** below, verifying the algebraic identity against direct set union.*
  >
  > *Switching to **Three Sets (A, B, C)** partitions the canvas into eight disjoint minterms, evaluating the 3-set PIE formula:
  > $$|A \cup B \cup C| = S_1 - S_2 + S_3$$
  > where $S_1$ sums the 3 singletons, $S_2$ sums the 3 pairwise intersections, and $S_3$ adds the triple intersection."*

---

### Minute 11:00 – 14:00 | Route 4: ComboLab (`/combolab`)
* **Presenter Action**: Navigate to **04 ComboLab**.
* **Presenter Dialogue**:
  > *"In **ComboLab**, we explore the combinatorial structure of the feature space.*
  >
  > *Because each student chooses 3 distinct features from 7 without regard to order, there are exactly:
  > $$\binom{7}{3} = \frac{7!}{3! \times 4!} = 35 \text{ theoretical combinations.}$$
  >
  > *Our interactive calculator computes binomial coefficients and permutations with safe integer arithmetic up to $n=18$ ($18! = 6,402,373,705,728,000 \le \text{Number.MAX\_SAFE\_INTEGER}$).*
  >
  > *Below the calculator, the **35-Triplet Space Explorer** maps every combination to its empirical frequency in the simulated cohort. In this 300-student dataset, all 35 theoretical combinations are observed, with the leading triplet `{Camera Quality, Battery Life, Processing Performance}` selected by 22 students (7.3%).*
  >
  > *In the **Price Tier Stratification Table**, we cross-tabulate all 35 triplets against the four budget intervals, proving the within-segment conservation law:
  > $$\sum_{t=1}^{35} P(t \mid p) = 100.0\% \text{ for every budget tier } p."*$$

---

### Minute 14:00 – 17:00 | Route 5: Experiment Studio (`/experiment-studio`)
* **Presenter Action**: Navigate to **05 Experiment Studio**.
* **Presenter Dialogue**:
  > *"In **Experiment Studio**, we formulate and test empirical research hypotheses.*
  >
  > *In **Experiment 01 (Brand–Feature Association)**, we cross-tabulate preferred brands against canonical features.*
  >
  > *Notice the dynamic indicator at the top right:
  > `Denominator: N(b) | Displayed Sum: 300.0% (All 7 Features (Expected: 300%))`
  > Because each student selects 3 features, the sum of within-brand percentages across all 7 features must equal exactly 300.0%. If we filter the features using the multi-select controls, the system dynamically recalculates the displayed sum and updates the indicator to show the exact sub-sum.*
  >
  > *In **Experiment 02 (Combinations by Budget)**, we test whether feature preferences concentrate within price tiers, strictly using the budget segment size $N(p)$ as the denominator."*

---

### Minute 17:00 – 20:00 | Route 6: Methodology (`/methodology`) & Conclusion
* **Presenter Action**: Navigate to **06 Methodology**.
* **Presenter Dialogue**:
  > *"Finally, **Methodology** documents our formal data model, validation schemas, and offline data pipeline.*
  >
  > *Our offline Python pipeline (`pipeline/process_survey.py`) handles raw Google Forms exports, normalizes synonyms, enforces the $|F|=3$ invariant, and pseudonymizes respondents with cryptographic hashing.*
  >
  > *The deployment manager (`pipeline/activate_dataset.py`) performs atomic filesystem replacement with automatic rollback on error.*
  >
  > *In summary:
  > - 135 Vitest tests and 25 Python tests passing (100% pass rate).
  > - Zero TypeScript or ESLint errors.
  > - Fully responsive across desktop and mobile in a publication-grade Editorial Light Theme.
  > - Rigorous, uncompromising mathematical integrity throughout.*
  >
  > *Thank you. I welcome your questions."*

---
*Demonstration Guide certified for Phase 09 Oral Defense.*
