# PhonePrint — Phase 06 Audit Bundle: Experiment Studio
## Targeted Correction Pass

**Project:** PhonePrint: Smartphone Brand & Feature Preference Analytics Platform  
**Phase:** Phase 06 — Experiment Studio (Empirical Hypothesis Testing & Discrete Combinatorics)  
**Correction Pass Status:** COMPLETED & FULLY VERIFIED  
**Test Suite:** 117 / 117 Tests Passing (100% Pass Rate) across 9 Test Files  
**Python Pipeline:** 7 / 7 Unit Tests Passing (100% Pass Rate)  
**TypeScript:** Zero Compilation Errors (`tsc --noEmit` clean)  
**ESLint:** Zero Warnings / Zero Errors (`next lint` clean)  
**Production Build:** Successfully Built and Prerendered (`next build` 9/9 static routes)  

---

## 1. Targeted Audit Corrections Overview

Gemini's independent technical audit identified two targeted issues. Both have been resolved in full while preserving the mathematical architecture, visual design conventions, and existing features.

### Defect 1 (High Priority): Incorrect Static 300% Feature Sum Label

- **File Modified:** `src/app/experiment-studio/page.tsx`, `src/lib/math/brandFeatureExperiment.ts`, `src/types/experiment.ts`, `src/components/experiment-studio/BrandFeatureHeatmap.tsx`, `src/components/experiment-studio/BrandFeatureControls.tsx`.
- **Original Problem:** The UI displayed a static "Feature Sum: 300%" label. However, the 300% sum invariant ($\sum_{f \in F_7} P(f \mid b) = 300.0\%$) is mathematically guaranteed only when all seven canonical features are evaluated. When users filtered features to a subset $A \subset F_7$, the displayed sum is $\sum_{f \in A} P(f \mid b)$, which varies by brand and is not generally 300%.
- **Implemented Correction:**
  1. Implemented `calculateBrandFeaturePercentageSum(matrix, brand, cohortSize)` in `brandFeatureExperiment.ts` and exposed `featurePercentageSumByBrand` and `isFullFeatureUniverse` in `BrandFeatureAssociationResult`.
  2. Replaced the static 300% badge in `src/app/experiment-studio/page.tsx` with a dynamic label:
     - When all 7 features are selected: `300.0% (All 7 Features (Expected: 300%))`
     - When a subset of features is selected: displays the actual dynamic range/value (e.g. `100.0% – 200.0% (3/7 Features; Dynamic Sum)`) without implying that 300% is expected.
     - When 0 features are selected: displays `0.0% (0 Features Selected)` safely.
  3. Added the exact required explanatory note:
     > *"When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum."*
  4. Added a `Displayed % Sum` column to the cross-tabulation heatmap table in `BrandFeatureHeatmap.tsx` so users can inspect the exact dynamic sum for each brand.
  5. Enhanced `BrandFeatureControls.tsx` to support clearing all features, toggling individual features freely, and selecting presets ("All 7 Features", "Core Trinity").
- **Extended Test Suite:** Added 5 new unit tests to `src/__tests__/brand_feature_experiment.test.ts` verifying:
  - All seven features selected: percentage sum equals 300%.
  - Subset of two features: displayed sum equals actual sum of those two features (e.g. Apple = 200.0%, Samsung = 33.33%, not 300%).
  - Subset of three features: displayed sum is computed correctly (e.g. Apple = 166.66%, Samsung = 133.33%).
  - Empty feature selection: zero cells, returns 0.0%, no NaN or Infinity.
  - Filtering features does not alter the underlying brand cohort denominator $N(b)$.

### Defect 2 (Low Priority): Grouped Bar Chart Orientation

- **File Modified:** `src/components/experiment-studio/BrandFeatureBarChart.tsx`.
- **Original Problem:** The chart grouped bars by feature, which made within-brand distributions difficult to compare because different brands have different cohort denominators $N(b)$.
- **Implemented Correction:**
  1. Reworked the chart so the **X-axis groups data by Brand** (`Apple (N=3)`, `Samsung (N=3)`, etc.).
  2. Each selected canonical feature is represented by a consistent series in the legend with an accessible color from `FEATURE_PALETTE` (Cobalt, Acid Lime, Amber, Cyan, Purple, Pink, Teal).
  3. The Y-axis continues to show within-brand percentage $P(f \mid b) \in [0, 100\%]$.
  4. Tooltip clearly identifies the Brand name, Brand cohort size $N(b)$, each feature name, respondent count $C(b, f)$, and percentage $P(f \mid b)$.
  5. Chart values continue to strictly use the brand-specific denominator $N(b)$ without artificial normalization.
  6. Handled single selected brand and single selected feature edge cases cleanly, with graceful empty states for 0 selections.
  7. Updated the footnote note with the required explanatory text.

---

## 2. Bundle File Index

| Index | File Path | Language | Description |
| :---: | :--- | :---: | :--- |
| 01 | `src/types/experiment.ts` | `typescript` | TypeScript Data Models for Experiment 1 (Brand-Feature Association), Experiment 2 (Budget Combinations), and Formal Hypotheses |
| 02 | `src/lib/math/brandFeatureExperiment.ts` | `typescript` | Discrete Set-Theoretic Brand-Feature Cross-Tabulation Engine (|S_b ∩ S_f|, Within-Brand P(f|b), Dynamic Feature Sum Engine calculateBrandFeaturePercentageSum) |
| 03 | `src/lib/math/budgetCombinationExperiment.ts` | `typescript` | Discrete Triplet Budget Combinatorics Engine (Unranked 3-Feature Set Equality, Within-Budget P(t|p), 100% Stratum Sum Conservation, C(7,3)=35 Theoretical vs 10 Observed vs 25 Voids) |
| 04 | `src/__tests__/brand_feature_experiment.test.ts` | `typescript` | Vitest Unit Test Suite for Brand-Feature Association Engine (10 Tests: Intersections, Denominators, 300% Invariant, 2-Feature Subsets, 3-Feature Subsets, Empty Selection Safety, Invariant Denominators) |
| 05 | `src/__tests__/budget_combination_experiment.test.ts` | `typescript` | Vitest Unit Test Suite for Budget Combinations Engine (6 Tests: 35 Theoretical Triplet Enumeration, 10 Observed vs 25 Voids, 100% Stratum Conservation, Empty Segments) |
| 06 | `src/components/experiment-studio/BrandFeatureControls.tsx` | `tsx` | Interactive Multi-Select Controls for Smartphone Brands and Canonical Features with Quick Selection Helpers and Clear All Support |
| 07 | `src/components/experiment-studio/BrandFeatureHeatmap.tsx` | `tsx` | Cross-Tabulation Matrix (Heatmap) Displaying Discrete Intersections |S_b ∩ S_f|, Within-Brand Percentages, Dynamic Displayed % Sum Column, and Explanatory Note |
| 08 | `src/components/experiment-studio/BrandFeatureBarChart.tsx` | `tsx` | Recharts Grouped Bar Chart Visualizing Within-Brand Preferences with X-Axis Grouped by Brand, Feature Legend Series, and Detailed Tooltips |
| 09 | `src/components/experiment-studio/BrandFeatureInterpretation.tsx` | `tsx` | Academic Methodology & Descriptive Interpretation Panel for Experiment 1 (H_0 vs H_1 Hypotheses, Strict Non-Causal Guardrails) |
| 10 | `src/components/experiment-studio/BudgetCombinationControls.tsx` | `tsx` | Multi-Select Filter Controls for Budget Segments with Quick Selection Presets |
| 11 | `src/components/experiment-studio/BudgetCombinationMetrics.tsx` | `tsx` | Combinatorial Stat Cards Tracking C(7,3)=35 Theoretical Space, 10 Observed Triplet Count, 25 Combinatorial Voids, and Sample Size |
| 12 | `src/components/experiment-studio/BudgetCombinationChart.tsx` | `tsx` | Recharts Visual Frequency Comparison of Feature Triplets across Selected Budget Tiers |
| 13 | `src/components/experiment-studio/BudgetCombinationTable.tsx` | `tsx` | Searchable and Filterable 35-Combination Table with Observed / All / Voids Tabs, Frequencies, and Within-Budget Percentages |
| 14 | `src/components/experiment-studio/BudgetCombinationInterpretation.tsx` | `tsx` | Academic Interpretation Panel for Experiment 2 (H_0 vs H_1 Hypotheses, 100% Stratum Conservation Law, KaTeX Formulations) |
| 15 | `src/components/experiment-studio/RespondentInspectorModal.tsx` | `tsx` | Drill-Down Respondent Inspector Modal Displaying Anonymous Student Profiles or Empty Set (∅) State |
| 16 | `src/app/experiment-studio/page.tsx` | `tsx` | Integrated Experiment Studio Research Page with Tabbed Navigation, Dynamic Feature Percentage Sum Display, Explanatory Note, and Modal Inspector |

---

## File 01: `src/types/experiment.ts`

**Description:** TypeScript Data Models for Experiment 1 (Brand-Feature Association), Experiment 2 (Budget Combinations), and Formal Hypotheses  
**File Size:** 3396 characters, 97 lines  

```typescript
/**
 * PhonePrint - Experiment Studio Types
 * Developed for University Discrete Mathematics & Graph Theory Experiential Learning.
 */

import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "./survey";

/**
 * Single cell in the Brand-Feature preference matrix.
 */
export interface BrandFeatureCell {
  readonly brand: SmartphoneBrand;
  readonly feature: SmartphoneFeature;
  readonly count: number; // C(b, f) = |S_b ∩ S_f|
  readonly percentage: number; // P(f | b) = (C(b, f) / N(b)) * 100
  readonly matchingRespondentIds: readonly string[];
}

/**
 * Result data model for Experiment 1: Brand–Feature Association.
 */
export interface BrandFeatureAssociationResult {
  readonly selectedBrands: readonly SmartphoneBrand[];
  readonly selectedFeatures: readonly SmartphoneFeature[];
  readonly totalCohortSize: number;
  readonly brandTotals: Record<SmartphoneBrand, number>; // N(b)
  readonly brandSets: Record<SmartphoneBrand, Set<string>>; // S_b
  readonly featureSets: Record<SmartphoneFeature, Set<string>>; // S_f
  readonly matrix: readonly BrandFeatureCell[];
  readonly topFeaturesByBrand: Record<
    SmartphoneBrand,
    readonly { feature: SmartphoneFeature; count: number; percentage: number }[]
  >;
  readonly featurePercentageSumByBrand: Record<SmartphoneBrand, number>; // Σ_{f ∈ selectedFeatures} P(f | b)
  readonly isFullFeatureUniverse: boolean; // True when all 7 canonical features are selected
  readonly descriptiveNotes: readonly string[];
}

/**
 * Observed feature combination row across budget segments.
 */
export interface BudgetCombinationRow {
  readonly combinationId: string; // e.g. "COMB-01"
  readonly features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  readonly key: string;
  readonly isObservedOverall: boolean;
  readonly totalObservedOverall: number;
  readonly frequenciesByBudget: Record<BudgetRange, number>; // C(p, t)
  readonly percentagesByBudget: Record<BudgetRange, number>; // P(t | p)
  readonly matchingRespondentIdsByBudget: Record<
    BudgetRange,
    readonly string[]
  >;
}

/**
 * Result data model for Experiment 2: Feature Combinations by Budget.
 */
export interface BudgetCombinationAnalysisResult {
  readonly selectedBudgets: readonly BudgetRange[];
  readonly totalCohortSize: number;
  readonly budgetTotals: Record<BudgetRange, number>; // N(p)
  readonly distinctCombinationsCountByBudget: Record<BudgetRange, number>; // D(p)
  readonly totalTheoreticalCombinations: number; // Exactly 35
  readonly totalObservedInDataset: number; // Combinations observed in at least 1 respondent
  readonly totalUnobservedInDataset: number; // Combinations with frequency = 0
  readonly observedRows: readonly BudgetCombinationRow[];
  readonly all35Rows: readonly BudgetCombinationRow[];
  readonly mostFrequentByBudget: Record<
    BudgetRange,
    readonly BudgetCombinationRow[]
  >;
  readonly descriptiveNotes: readonly string[];
}

/**
 * Metadata for research hypothesis framing.
 */
export interface ExperimentHypothesis {
  readonly id: string;
  readonly researchQuestion: string;
  readonly nullHypothesis: string;
  readonly alternativeHypothesis: string;
  readonly independentVariable: string;
  readonly dependentVariable: string;
  readonly mathematicalMethod: string;
  readonly formulaLatex: string;
  readonly limitations: readonly string[];
}
```

---

## File 02: `src/lib/math/brandFeatureExperiment.ts`

**Description:** Discrete Set-Theoretic Brand-Feature Cross-Tabulation Engine (|S_b ∩ S_f|, Within-Brand P(f|b), Dynamic Feature Sum Engine calculateBrandFeaturePercentageSum)  
**File Size:** 7412 characters, 226 lines  

```typescript
/**
 * PhonePrint - Experiment 1: Brand–Feature Association Analytics
 *
 * Implements discrete set intersections between smartphone brand preference sets (S_b)
 * and canonical feature preference sets (S_f).
 * All calculations use actual respondent IDs. Aggregate multiplication is strictly avoided.
 */

import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SurveyResponse,
  type SmartphoneBrand,
  type SmartphoneFeature,
} from "@/types/survey";
import { setIntersection } from "./sets";
import type {
  BrandFeatureCell,
  BrandFeatureAssociationResult,
} from "@/types/experiment";

/**
 * Calculates the displayed percentage sum for a given brand cohort across the selected features:
 * Σ_{f ∈ A} P(f | b)
 *
 * When A is the full 7-feature universe (SMARTPHONE_FEATURES), every student's 3 chosen features
 * are accounted for, so the sum mathematically equals 300.0% for any populated brand cohort.
 * When A is a filtered subset, the sum is dynamically computed from the actual within-brand percentages
 * without artificial normalization.
 *
 * @param matrix - The computed brand-feature intersection cells
 * @param brand - The target brand
 * @param cohortSize - Optional cohort size N(b) for validation
 * @returns The displayed percentage sum (0.0 if empty or unpopulated)
 */
export function calculateBrandFeaturePercentageSum(
  matrix: readonly BrandFeatureCell[],
  brand: SmartphoneBrand,
  cohortSize?: number
): number {
  const brandCells = matrix.filter((c) => c.brand === brand);
  if (brandCells.length === 0) return 0.0;

  // Check if all 7 canonical features are present in this brand's cells
  const isAllSeven =
    brandCells.length === SMARTPHONE_FEATURES.length &&
    SMARTPHONE_FEATURES.every((f) => brandCells.some((c) => c.feature === f));

  if (isAllSeven && (cohortSize === undefined || cohortSize > 0)) {
    // Mathematically invariant: each student selects exactly 3 distinct features.
    // Therefore sum_{f in F_7} C(b, f) = 3 * N(b), so the exact sum of within-brand percentages is 300.0%.
    return 300.0;
  }

  // For a filtered subset of features (or empty), sum the actual computed percentages:
  const rawSum = brandCells.reduce((acc, c) => acc + c.percentage, 0);
  return Number(rawSum.toFixed(2));
}

/**
 * Computes the Brand–Feature Association matrix across selected brands and features.
 *
 * Mathematical formulation:
 * C(b, f) = |S_b ∩ S_f|
 * P(f | b) = (C(b, f) / N(b)) * 100
 *
 * @param responses - Validated survey response cohort
 * @param selectedBrands - Array of brands to compare
 * @param selectedFeatures - Array of features to compare
 * @returns Complete BrandFeatureAssociationResult
 */
export function computeBrandFeatureAssociation(
  responses: readonly SurveyResponse[],
  selectedBrands: readonly SmartphoneBrand[] = SMARTPHONE_BRANDS,
  selectedFeatures: readonly SmartphoneFeature[] = SMARTPHONE_FEATURES
): BrandFeatureAssociationResult {
  const totalCohortSize = responses.length;

  // 1. Build discrete sets of respondent IDs for all canonical brands
  const brandSets = {} as Record<SmartphoneBrand, Set<string>>;
  const brandTotals = {} as Record<SmartphoneBrand, number>;

  for (const b of SMARTPHONE_BRANDS) {
    brandSets[b] = new Set<string>();
    brandTotals[b] = 0;
  }

  for (const resp of responses) {
    if (resp.preferred_brand in brandSets) {
      brandSets[resp.preferred_brand].add(resp.response_id);
    }
  }

  for (const b of SMARTPHONE_BRANDS) {
    brandTotals[b] = brandSets[b].size;
  }

  // 2. Build discrete sets of respondent IDs for all canonical features
  const featureSets = {} as Record<SmartphoneFeature, Set<string>>;

  for (const f of SMARTPHONE_FEATURES) {
    featureSets[f] = new Set<string>();
  }

  for (const resp of responses) {
    for (const f of resp.preferred_features) {
      if (f in featureSets) {
        featureSets[f].add(resp.response_id);
      }
    }
  }

  // 3. Compute pairwise intersections S_b ∩ S_f for selected brands and features
  const matrix: BrandFeatureCell[] = [];

  for (const brand of selectedBrands) {
    const s_b = brandSets[brand] ?? new Set<string>();
    const n_b = brandTotals[brand] ?? 0;

    for (const feature of selectedFeatures) {
      const s_f = featureSets[feature] ?? new Set<string>();
      const intersectionSet = setIntersection(s_b, s_f);
      const count = intersectionSet.size;

      // Safe division: denominator is strictly the selected brand's cohort size N(b)
      const percentage =
        n_b > 0 ? Number(((count / n_b) * 100).toFixed(2)) : 0;

      matrix.push({
        brand,
        feature,
        count,
        percentage,
        matchingRespondentIds: Array.from(intersectionSet).sort(),
      });
    }
  }

  // 4. Identify top features and calculate dynamic feature percentage sum for each brand
  const topFeaturesByBrand = {} as Record<
    SmartphoneBrand,
    { feature: SmartphoneFeature; count: number; percentage: number }[]
  >;
  const featurePercentageSumByBrand = {} as Record<SmartphoneBrand, number>;

  const isFullFeatureUniverse =
    selectedFeatures.length === SMARTPHONE_FEATURES.length &&
    SMARTPHONE_FEATURES.every((f) => selectedFeatures.includes(f));

  for (const brand of SMARTPHONE_BRANDS) {
    const brandCells = matrix.filter((c) => c.brand === brand);
    const n_b = brandTotals[brand] ?? 0;

    const sorted = [...brandCells]
      .sort((a, b) => b.count - a.count || b.percentage - a.percentage)
      .map((c) => ({
        feature: c.feature,
        count: c.count,
        percentage: c.percentage,
      }));

    topFeaturesByBrand[brand] = sorted;
    featurePercentageSumByBrand[brand] = calculateBrandFeaturePercentageSum(
      matrix,
      brand,
      n_b
    );
  }

  // 5. Generate descriptive, non-causal interpretation notes
  const descriptiveNotes: string[] = [];

  for (const brand of selectedBrands) {
    const n_b = brandTotals[brand] ?? 0;
    if (n_b === 0) {
      descriptiveNotes.push(
        `Brand "${brand}" has 0 respondents in the current dataset (no within-brand distribution available).`
      );
      continue;
    }

    if (selectedFeatures.length === 0) {
      descriptiveNotes.push(
        `Among respondents preferring ${brand} (N = ${n_b}), no canonical features are currently selected for comparison.`
      );
      continue;
    }

    const topList = topFeaturesByBrand[brand];
    if (topList && topList.length > 0) {
      const maxCount = topList[0]?.count ?? 0;
      const dominant = topList.filter(
        (item) => item.count === maxCount && maxCount > 0
      );

      if (dominant.length > 0) {
        const featNames = dominant
          .map((d) => `"${d.feature}" (${d.percentage}%)`)
          .join(", ");
        descriptiveNotes.push(
          `Among respondents preferring ${brand} (N = ${n_b}), the most frequently co-selected feature${
            dominant.length > 1 ? "s were tied:" : " was"
          } ${featNames}.`
        );
      } else {
        descriptiveNotes.push(
          `Among respondents preferring ${brand} (N = ${n_b}), none of the selected features were chosen.`
        );
      }
    }
  }

  return {
    selectedBrands,
    selectedFeatures,
    totalCohortSize,
    brandTotals,
    brandSets,
    featureSets,
    matrix,
    topFeaturesByBrand,
    featurePercentageSumByBrand,
    isFullFeatureUniverse,
    descriptiveNotes,
  };
}
```

---

## File 03: `src/lib/math/budgetCombinationExperiment.ts`

**Description:** Discrete Triplet Budget Combinatorics Engine (Unranked 3-Feature Set Equality, Within-Budget P(t|p), 100% Stratum Sum Conservation, C(7,3)=35 Theoretical vs 10 Observed vs 25 Voids)  
**File Size:** 6353 characters, 200 lines  

```typescript
/**
 * PhonePrint - Experiment 2: Feature Combinations by Budget Analytics
 *
 * Evaluates the empirical distribution of three-feature preference triplets across
 * student budget segments. Uses exact set equality on feature triplets.
 */

import {
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  type SurveyResponse,
  type BudgetRange,
  type SmartphoneFeature,
} from "@/types/survey";
import { enumerateCombinations } from "./combinations";
import {
  canonicalizeFeatureTriplet,
  getCombinationKey,
} from "@/lib/data/combinationAnalytics";
import type {
  BudgetCombinationRow,
  BudgetCombinationAnalysisResult,
} from "@/types/experiment";

/**
 * Computes the feature combination distribution segmented by student budget tiers.
 *
 * Mathematical formulation:
 * C(p, t) = | { id ∈ U | budget(id) = p ∧ features(id) = t } |
 * P(t | p) = (C(p, t) / N(p)) * 100
 *
 * @param responses - Validated survey response cohort
 * @param selectedBudgets - Array of budget segments to evaluate
 * @returns Complete BudgetCombinationAnalysisResult
 */
export function computeBudgetCombinationAnalysis(
  responses: readonly SurveyResponse[],
  selectedBudgets: readonly BudgetRange[] = BUDGET_RANGES
): BudgetCombinationAnalysisResult {
  const totalCohortSize = responses.length;

  // 1. Calculate budget segment sample sizes N(p)
  const budgetTotals = {} as Record<BudgetRange, number>;
  for (const b of BUDGET_RANGES) {
    budgetTotals[b] = 0;
  }
  for (const resp of responses) {
    if (resp.budget_range in budgetTotals) {
      budgetTotals[resp.budget_range]++;
    }
  }

  // 2. Map survey respondents by canonical combination key and budget
  // Key format: "FeatureA|FeatureB|FeatureC"
  const responsesByComboKey = new Map<string, SurveyResponse[]>();
  for (const resp of responses) {
    const key = getCombinationKey(resp.preferred_features);
    const existing = responsesByComboKey.get(key);
    if (existing) {
      existing.push(resp);
    } else {
      responsesByComboKey.set(key, [resp]);
    }
  }

  // 3. Enumerate all C(7, 3) = 35 theoretical triplets
  const theoreticalTriplets = enumerateCombinations(SMARTPHONE_FEATURES, 3) as [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ][];

  // 4. Construct rows for all 35 combinations
  const all35Rows: BudgetCombinationRow[] = theoreticalTriplets.map(
    (triplet, index) => {
      const canonicalTriplet = canonicalizeFeatureTriplet(triplet);
      const key = getCombinationKey(canonicalTriplet);
      const matchingAll = responsesByComboKey.get(key) ?? [];
      const totalObservedOverall = matchingAll.length;
      const isObservedOverall = totalObservedOverall > 0;

      const frequenciesByBudget = {} as Record<BudgetRange, number>;
      const percentagesByBudget = {} as Record<BudgetRange, number>;
      const matchingRespondentIdsByBudget = {} as Record<
        BudgetRange,
        string[]
      >;

      for (const budget of BUDGET_RANGES) {
        const matchingInTier = matchingAll.filter(
          (r) => r.budget_range === budget
        );
        const count = matchingInTier.length;
        const n_p = budgetTotals[budget] ?? 0;
        const percentage =
          n_p > 0 ? Number(((count / n_p) * 100).toFixed(2)) : 0;

        frequenciesByBudget[budget] = count;
        percentagesByBudget[budget] = percentage;
        matchingRespondentIdsByBudget[budget] = matchingInTier
          .map((r) => r.response_id)
          .sort();
      }

      return {
        combinationId: `COMB-${String(index + 1).padStart(2, "0")}`,
        features: canonicalTriplet,
        key,
        isObservedOverall,
        totalObservedOverall,
        frequenciesByBudget,
        percentagesByBudget,
        matchingRespondentIdsByBudget,
      };
    }
  );

  // 5. Partition into observed rows and theoretical voids
  const observedRows = all35Rows.filter((r) => r.isObservedOverall);
  const totalTheoreticalCombinations = all35Rows.length; // 35
  const totalObservedInDataset = observedRows.length;
  const totalUnobservedInDataset =
    totalTheoreticalCombinations - totalObservedInDataset;

  // 6. Distinct combinations and top combinations per budget segment
  const distinctCombinationsCountByBudget = {} as Record<BudgetRange, number>;
  const mostFrequentByBudget = {} as Record<
    BudgetRange,
    BudgetCombinationRow[]
  >;

  for (const budget of selectedBudgets) {
    const inTier = observedRows.filter(
      (r) => r.frequenciesByBudget[budget] > 0
    );
    distinctCombinationsCountByBudget[budget] = inTier.length;

    if (inTier.length > 0) {
      const sorted = [...inTier].sort(
        (a, b) =>
          b.frequenciesByBudget[budget] - a.frequenciesByBudget[budget]
      );
      const maxCount = sorted[0]?.frequenciesByBudget[budget] ?? 0;
      mostFrequentByBudget[budget] = sorted.filter(
        (r) => r.frequenciesByBudget[budget] === maxCount && maxCount > 0
      );
    } else {
      mostFrequentByBudget[budget] = [];
    }
  }

  // 7. Generate objective, descriptive interpretation notes
  const descriptiveNotes: string[] = [];

  for (const budget of selectedBudgets) {
    const n_p = budgetTotals[budget] ?? 0;
    const distinctCount = distinctCombinationsCountByBudget[budget] ?? 0;

    if (n_p === 0) {
      descriptiveNotes.push(
        `Budget segment "${budget}" contains 0 respondents in the current dataset.`
      );
      continue;
    }

    const topCombos = mostFrequentByBudget[budget] ?? [];
    if (topCombos.length > 0) {
      const topStr = topCombos
        .map(
          (c) =>
            `${c.combinationId} (${c.features.join(", ")}: ${
              c.percentagesByBudget[budget]
            }%)`
        )
        .join("; ");

      descriptiveNotes.push(
        `In the "${budget}" tier (N = ${n_p}), ${distinctCount} distinct combination${
          distinctCount > 1 ? "s were" : " was"
        } observed. The highest frequency combination${
          topCombos.length > 1 ? "s (tied) were" : " was"
        }: ${topStr}.`
      );
    }
  }

  return {
    selectedBudgets,
    totalCohortSize,
    budgetTotals,
    distinctCombinationsCountByBudget,
    totalTheoreticalCombinations,
    totalObservedInDataset,
    totalUnobservedInDataset,
    observedRows,
    all35Rows,
    mostFrequentByBudget,
    descriptiveNotes,
  };
}
```

---

## File 04: `src/__tests__/brand_feature_experiment.test.ts`

**Description:** Vitest Unit Test Suite for Brand-Feature Association Engine (10 Tests: Intersections, Denominators, 300% Invariant, 2-Feature Subsets, 3-Feature Subsets, Empty Selection Safety, Invariant Denominators)  
**File Size:** 10453 characters, 288 lines  

```typescript
import { describe, it, expect } from "vitest";
import {
  computeBrandFeatureAssociation,
  calculateBrandFeaturePercentageSum,
} from "@/lib/math/brandFeatureExperiment";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SurveyResponse,
} from "@/types/survey";

describe("Experiment 1: Brand–Feature Association Analysis", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses; // 12 respondents

  it("computes accurate brand-feature intersection counts using actual respondent IDs", () => {
    const result = computeBrandFeatureAssociation(responses);

    // In demo data: Apple respondents are DEMO_RESP_001, DEMO_RESP_004, DEMO_RESP_009 (total 3)
    // 001 features: Camera, Battery, Build
    // 004 features: Build, Software, Camera
    // 009 features: Processing, Build, Camera
    // Intersection Apple ∩ Camera: all 3 (001, 004, 009)
    // Intersection Apple ∩ Build: all 3 (001, 004, 009)
    // Intersection Apple ∩ Battery: 1 (001)
    // Intersection Apple ∩ Software: 1 (004)
    // Intersection Apple ∩ Processing: 1 (009)
    // Intersection Apple ∩ Display: 0
    // Intersection Apple ∩ Storage: 0

    const appleCamera = result.matrix.find(
      (c) => c.brand === "Apple" && c.feature === "Camera Quality"
    );
    expect(appleCamera).toBeDefined();
    expect(appleCamera?.count).toBe(3);
    expect(appleCamera?.percentage).toBe(100.0);
    expect(appleCamera?.matchingRespondentIds).toEqual([
      "DEMO_RESP_001",
      "DEMO_RESP_004",
      "DEMO_RESP_009",
    ]);

    const appleDisplay = result.matrix.find(
      (c) => c.brand === "Apple" && c.feature === "Display Quality"
    );
    expect(appleDisplay?.count).toBe(0);
    expect(appleDisplay?.percentage).toBe(0);
    expect(appleDisplay?.matchingRespondentIds).toEqual([]);
  });

  it("strictly enforces the brand-specific cohort size as denominator", () => {
    const result = computeBrandFeatureAssociation(responses);

    // Apple has 3 respondents
    expect(result.brandTotals["Apple"]).toBe(3);

    // Samsung has 3 respondents: DEMO_RESP_002, DEMO_RESP_006, DEMO_RESP_011
    // 002: Display, Processing, Storage
    // 006: Camera, Display, Storage
    // 011: Battery, Storage, Processing
    // Samsung ∩ Storage: all 3 => 3 / 3 = 100%
    // Samsung ∩ Processing: 2 (002, 011) => 2 / 3 = 66.67%
    // Samsung ∩ Display: 2 (002, 006) => 2 / 3 = 66.67%
    expect(result.brandTotals["Samsung"]).toBe(3);

    const samsungStorage = result.matrix.find(
      (c) => c.brand === "Samsung" && c.feature === "Storage Capacity"
    );
    expect(samsungStorage?.count).toBe(3);
    expect(samsungStorage?.percentage).toBe(100.0);

    const samsungProcessing = result.matrix.find(
      (c) => c.brand === "Samsung" && c.feature === "Processing Performance"
    );
    expect(samsungProcessing?.count).toBe(2);
    expect(samsungProcessing?.percentage).toBeCloseTo(66.67, 1);
  });

  it("satisfies the property that feature percentages within a brand sum to 300% across all 7 features", () => {
    const result = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      SMARTPHONE_FEATURES
    );

    // For any populated brand, because every respondent chooses exactly 3 features:
    // sum_f C(b, f) = 3 * N(b)
    // sum_f P(f | b) = sum_f (C(b, f) / N(b) * 100) = (3 * N(b) / N(b)) * 100 = 300%
    for (const brand of SMARTPHONE_BRANDS) {
      const n_b = result.brandTotals[brand];
      if (n_b > 0) {
        const brandCells = result.matrix.filter((c) => c.brand === brand);
        const sumCount = brandCells.reduce((acc, c) => acc + c.count, 0);
        expect(sumCount).toBe(3 * n_b);

        const sumPercentage = brandCells.reduce(
          (acc, c) => acc + c.percentage,
          0
        );
        expect(sumPercentage).toBeCloseTo(300.0, 1);
      }
    }
  });

  it("handles empty brand groups without NaN or Infinity", () => {
    // Artificial dataset with no Google respondents
    const noGoogleResponses: SurveyResponse[] = [
      {
        response_id: "TEST_001",
        preferred_brand: "Apple",
        budget_range: "Over $1,000",
        preferred_features: [
          "Camera Quality",
          "Battery Life",
          "Build & Design Quality",
        ],
        primary_use: "Everyday General Use",
        os_preference: "iOS",
      },
    ];

    const result = computeBrandFeatureAssociation(noGoogleResponses, [
      "Apple",
      "Google",
    ]);

    expect(result.brandTotals["Google"]).toBe(0);

    const googleCells = result.matrix.filter((c) => c.brand === "Google");
    expect(googleCells.length).toBe(7);

    for (const cell of googleCells) {
      expect(cell.count).toBe(0);
      expect(cell.percentage).toBe(0);
      expect(Number.isNaN(cell.percentage)).toBe(false);
      expect(Number.isFinite(cell.percentage)).toBe(true);
    }
  });

  it("supports arbitrary subsets of brands and features", () => {
    const customBrands = ["Apple", "Samsung"] as const;
    const customFeatures = ["Camera Quality", "Battery Life"] as const;

    const result = computeBrandFeatureAssociation(
      responses,
      customBrands,
      customFeatures
    );

    expect(result.matrix.length).toBe(4); // 2 brands * 2 features
    expect(result.selectedBrands).toEqual(customBrands);
    expect(result.selectedFeatures).toEqual(customFeatures);
  });

  // =========================================================================
  // Phase 06 Targeted Corrections - Dynamic Feature Sum & Invariants
  // =========================================================================

  it("verifies that when all seven features are selected, the percentage sum equals 300%", () => {
    const result = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      SMARTPHONE_FEATURES
    );

    expect(result.isFullFeatureUniverse).toBe(true);

    for (const brand of SMARTPHONE_BRANDS) {
      const n_b = result.brandTotals[brand];
      if (n_b > 0) {
        expect(result.featurePercentageSumByBrand[brand]).toBe(300.0);
        expect(
          calculateBrandFeaturePercentageSum(result.matrix, brand, n_b)
        ).toBe(300.0);
      } else {
        expect(result.featurePercentageSumByBrand[brand]).toBe(0.0);
      }
    }
  });

  it("verifies that for a subset of two features, displayed sum equals the actual sum of those two feature percentages, not an assumed 300%", () => {
    const twoFeatures = ["Camera Quality", "Build & Design Quality"] as const;
    const result = computeBrandFeatureAssociation(
      responses,
      ["Apple", "Samsung"],
      twoFeatures
    );

    expect(result.isFullFeatureUniverse).toBe(false);

    // Apple: Camera Quality = 100%, Build & Design Quality = 100% => Sum = 200.0% (NOT 300%)
    const appleCells = result.matrix.filter((c) => c.brand === "Apple");
    const actualAppleSum = Number(
      appleCells.reduce((acc, c) => acc + c.percentage, 0).toFixed(2)
    );
    expect(actualAppleSum).toBe(200.0);
    expect(result.featurePercentageSumByBrand["Apple"]).toBe(actualAppleSum);
    expect(result.featurePercentageSumByBrand["Apple"]).not.toBe(300.0);

    // Samsung: Camera Quality = 33.33%, Build & Design Quality = 0% => Sum = 33.33% (NOT 300%)
    const samsungCells = result.matrix.filter((c) => c.brand === "Samsung");
    const actualSamsungSum = Number(
      samsungCells.reduce((acc, c) => acc + c.percentage, 0).toFixed(2)
    );
    expect(actualSamsungSum).toBe(33.33);
    expect(result.featurePercentageSumByBrand["Samsung"]).toBe(actualSamsungSum);
    expect(result.featurePercentageSumByBrand["Samsung"]).not.toBe(300.0);
  });

  it("verifies that for a subset of three features, displayed sum is computed correctly", () => {
    const threeFeatures = [
      "Camera Quality",
      "Battery Life",
      "Processing Performance",
    ] as const;
    const result = computeBrandFeatureAssociation(
      responses,
      ["Apple", "Samsung"],
      threeFeatures
    );

    expect(result.isFullFeatureUniverse).toBe(false);

    // Apple: Camera 100%, Battery 33.33%, Processing 33.33% => Sum = 166.66%
    const expectedAppleSum = Number((100.0 + 33.33 + 33.33).toFixed(2));
    expect(result.featurePercentageSumByBrand["Apple"]).toBe(expectedAppleSum);

    // Samsung: Camera 33.33%, Battery 33.33%, Processing 66.67% => Sum = 133.33%
    const expectedSamsungSum = Number((33.33 + 33.33 + 66.67).toFixed(2));
    expect(result.featurePercentageSumByBrand["Samsung"]).toBe(expectedSamsungSum);
  });

  it("handles empty feature selection safely without NaN or Infinity", () => {
    const result = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      []
    );

    expect(result.isFullFeatureUniverse).toBe(false);
    expect(result.matrix.length).toBe(0);

    for (const brand of SMARTPHONE_BRANDS) {
      const sum = result.featurePercentageSumByBrand[brand];
      expect(Number.isNaN(sum)).toBe(false);
      expect(Number.isFinite(sum)).toBe(true);
      expect(sum).toBe(0.0);
    }

    // Descriptive notes should handle empty features safely
    expect(result.descriptiveNotes.length).toBeGreaterThan(0);
    for (const note of result.descriptiveNotes) {
      expect(note.includes("NaN")).toBe(false);
      expect(note.includes("Infinity")).toBe(false);
    }
  });

  it("verifies that filtering features does not alter the underlying brand cohort denominator", () => {
    const resultAll = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      SMARTPHONE_FEATURES
    );

    const resultFiltered = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      ["Camera Quality"]
    );

    // Brand totals (denominators) must remain identical
    for (const brand of SMARTPHONE_BRANDS) {
      expect(resultFiltered.brandTotals[brand]).toBe(
        resultAll.brandTotals[brand]
      );
    }

    // Apple has 3 respondents in total cohort; Camera Quality intersection is 3.
    // Denominator is 3, so percentage is 3/3 = 100.0%, NOT normalized to 100% of something else.
    const appleCell = resultFiltered.matrix.find(
      (c) => c.brand === "Apple" && c.feature === "Camera Quality"
    );
    expect(appleCell?.count).toBe(3);
    expect(appleCell?.percentage).toBe(100.0);
    expect(resultFiltered.brandTotals["Apple"]).toBe(3);
  });
});
```

---

## File 05: `src/__tests__/budget_combination_experiment.test.ts`

**Description:** Vitest Unit Test Suite for Budget Combinations Engine (6 Tests: 35 Theoretical Triplet Enumeration, 10 Observed vs 25 Voids, 100% Stratum Conservation, Empty Segments)  
**File Size:** 5494 characters, 134 lines  

```typescript
import { describe, it, expect } from "vitest";
import { computeBudgetCombinationAnalysis } from "@/lib/math/budgetCombinationExperiment";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { BUDGET_RANGES, type SurveyResponse } from "@/types/survey";

describe("Experiment 2: Feature Combinations by Budget Analytics", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses; // 12 respondents

  it("dynamically maintains exactly C(7, 3) = 35 theoretical combinations", () => {
    const result = computeBudgetCombinationAnalysis(responses);
    expect(result.totalTheoreticalCombinations).toBe(35);
    expect(result.all35Rows.length).toBe(35);
  });

  it("correctly identifies observed combinations and theoretical voids", () => {
    const result = computeBudgetCombinationAnalysis(responses);

    // In the 12-respondent demo cohort: exactly 10 combinations observed, 25 voids
    expect(result.totalObservedInDataset).toBe(10);
    expect(result.totalUnobservedInDataset).toBe(25);
    expect(result.observedRows.length).toBe(10);
    expect(result.totalObservedInDataset + result.totalUnobservedInDataset).toBe(35);

    for (const row of result.observedRows) {
      expect(row.isObservedOverall).toBe(true);
      expect(row.totalObservedOverall).toBeGreaterThan(0);
    }
  });

  it("uses the budget-specific cohort size as denominator and sums to 100% per populated segment", () => {
    const result = computeBudgetCombinationAnalysis(responses);

    // Sample sizes:
    // Under $400: 2 respondents
    // $400 - $700: 4 respondents
    // $700 - $1,000: 3 respondents
    // Over $1,000: 3 respondents
    expect(result.budgetTotals["Under $400"]).toBe(2);
    expect(result.budgetTotals["$400 - $700"]).toBe(4);
    expect(result.budgetTotals["$700 - $1,000"]).toBe(3);
    expect(result.budgetTotals["Over $1,000"]).toBe(3);

    for (const budget of BUDGET_RANGES) {
      const n_p = result.budgetTotals[budget];
      const sumCounts = result.observedRows.reduce(
        (acc, r) => acc + r.frequenciesByBudget[budget],
        0
      );
      expect(sumCounts).toBe(n_p);

      if (n_p > 0) {
        const sumPercentages = result.observedRows.reduce(
          (acc, r) => acc + r.percentagesByBudget[budget],
          0
        );
        // Subject only to minor floating-point decimal rounding (100.0 ± 0.1)
        expect(sumPercentages).toBeCloseTo(100.0, 1);
      }
    }
  });

  it("matches combinations by exact unordered set equality without regard to feature order", () => {
    // In demo dataset:
    // DEMO_RESP_007 has ["Battery Life", "Storage Capacity", "Processing Performance"]
    // DEMO_RESP_011 has ["Battery Life", "Storage Capacity", "Processing Performance"]
    // These two form the same canonical combination (Battery, Processing, Storage)
    const result = computeBudgetCombinationAnalysis(responses);

    const combo = result.observedRows.find((r) =>
      r.features.includes("Battery Life") &&
      r.features.includes("Processing Performance") &&
      r.features.includes("Storage Capacity")
    );

    expect(combo).toBeDefined();
    // 007 is in Under $400, 011 is in $400 - $700
    expect(combo?.frequenciesByBudget["Under $400"]).toBe(1);
    expect(combo?.frequenciesByBudget["$400 - $700"]).toBe(1);
    expect(combo?.frequenciesByBudget["$700 - $1,000"]).toBe(0);
    expect(combo?.frequenciesByBudget["Over $1,000"]).toBe(0);
    expect(combo?.totalObservedOverall).toBe(2);

    // Percentage in Under $400: 1 / 2 = 50.0%
    expect(combo?.percentagesByBudget["Under $400"]).toBe(50.0);
    // Percentage in $400 - $700: 1 / 4 = 25.0%
    expect(combo?.percentagesByBudget["$400 - $700"]).toBe(25.0);
  });

  it("handles empty budget segments safely without NaN or division by zero", () => {
    // Artificial cohort with only Over $1,000 responses
    const singleTierCohort: SurveyResponse[] = [
      {
        response_id: "T1",
        preferred_brand: "Apple",
        budget_range: "Over $1,000",
        preferred_features: [
          "Camera Quality",
          "Battery Life",
          "Build & Design Quality",
        ],
        primary_use: "Everyday General Use",
        os_preference: "iOS",
      },
    ];

    const result = computeBudgetCombinationAnalysis(singleTierCohort);

    expect(result.budgetTotals["Under $400"]).toBe(0);
    expect(result.distinctCombinationsCountByBudget["Under $400"]).toBe(0);

    for (const row of result.all35Rows) {
      expect(row.frequenciesByBudget["Under $400"]).toBe(0);
      expect(row.percentagesByBudget["Under $400"]).toBe(0);
      expect(Number.isNaN(row.percentagesByBudget["Under $400"])).toBe(false);
      expect(Number.isFinite(row.percentagesByBudget["Under $400"])).toBe(true);
    }
  });

  it("correctly identifies distinct combinations count per budget tier", () => {
    const result = computeBudgetCombinationAnalysis(responses);

    // Under $400 has 2 distinct combinations (each with 1 respondent):
    // 007: Battery + Storage + Processing
    // 010: Battery + Display + Storage
    expect(result.distinctCombinationsCountByBudget["Under $400"]).toBe(2);

    // $400 - $700 has 3 distinct combinations across 4 respondents:
    // 003, 012: Camera + Battery + Software (count 2)
    // 005: Processing + Display + Battery (count 1)
    // 011: Battery + Storage + Processing (count 1)
    expect(result.distinctCombinationsCountByBudget["$400 - $700"]).toBe(3);
  });
});
```

---

## File 06: `src/components/experiment-studio/BrandFeatureControls.tsx`

**Description:** Interactive Multi-Select Controls for Smartphone Brands and Canonical Features with Quick Selection Helpers and Clear All Support  
**File Size:** 5403 characters, 151 lines  

```tsx
"use client";

import React from "react";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SmartphoneBrand,
  type SmartphoneFeature,
} from "@/types/survey";

export interface BrandFeatureControlsProps {
  selectedBrands: readonly SmartphoneBrand[];
  setSelectedBrands: (brands: SmartphoneBrand[]) => void;
  selectedFeatures: readonly SmartphoneFeature[];
  setSelectedFeatures: (features: SmartphoneFeature[]) => void;
}

export function BrandFeatureControls({
  selectedBrands,
  setSelectedBrands,
  selectedFeatures,
  setSelectedFeatures,
}: BrandFeatureControlsProps) {
  const toggleBrand = (b: SmartphoneBrand) => {
    if (selectedBrands.includes(b)) {
      setSelectedBrands(selectedBrands.filter((brand) => brand !== b));
    } else {
      setSelectedBrands([...selectedBrands, b]);
    }
  };

  const toggleFeature = (f: SmartphoneFeature) => {
    if (selectedFeatures.includes(f)) {
      setSelectedFeatures(selectedFeatures.filter((feat) => feat !== f));
    } else {
      setSelectedFeatures([...selectedFeatures, f]);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-card">
      {/* Brand Selection */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            1. Select Brands to Compare ({selectedBrands.length} / {SMARTPHONE_BRANDS.length})
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedBrands([...SMARTPHONE_BRANDS])}
              className="text-cobalt-600 hover:underline font-semibold"
            >
              Select All
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setSelectedBrands(["Apple", "Samsung", "Google"])}
              className="text-cobalt-600 hover:underline font-semibold"
            >
              Top 3 Rivals
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setSelectedBrands(["Xiaomi", "Motorola", "OnePlus"])}
              className="text-cobalt-600 hover:underline font-semibold"
            >
              Alternative Tier
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SMARTPHONE_BRANDS.map((b) => {
            const isSelected = selectedBrands.includes(b);
            return (
              <button
                key={b}
                onClick={() => toggleBrand(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cobalt-600 text-white shadow-sm ring-2 ring-cobalt-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Selection */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            2. Canonical Features to Evaluate ({selectedFeatures.length} / {SMARTPHONE_FEATURES.length})
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedFeatures([...SMARTPHONE_FEATURES])}
              className="text-cobalt-600 hover:underline font-semibold"
            >
              All 7 Features
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() =>
                setSelectedFeatures([
                  "Camera Quality",
                  "Battery Life",
                  "Processing Performance",
                ])
              }
              className="text-cobalt-600 hover:underline font-semibold"
            >
              Core Trinity
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setSelectedFeatures([])}
              className="text-slate-500 hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SMARTPHONE_FEATURES.map((f) => {
            const isSelected = selectedFeatures.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-lime-600 text-white shadow-sm ring-2 ring-lime-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## File 07: `src/components/experiment-studio/BrandFeatureHeatmap.tsx`

**Description:** Cross-Tabulation Matrix (Heatmap) Displaying Discrete Intersections |S_b ∩ S_f|, Within-Brand Percentages, Dynamic Displayed % Sum Column, and Explanatory Note  
**File Size:** 8712 characters, 189 lines  

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type {
  BrandFeatureAssociationResult,
  BrandFeatureCell,
} from "@/types/experiment";

export interface BrandFeatureHeatmapProps {
  result: BrandFeatureAssociationResult;
  onSelectCell?: (cell: BrandFeatureCell) => void;
}

export function BrandFeatureHeatmap({
  result,
  onSelectCell,
}: BrandFeatureHeatmapProps) {
  const {
    selectedBrands,
    selectedFeatures,
    matrix,
    brandTotals,
    featurePercentageSumByBrand,
    isFullFeatureUniverse,
  } = result;

  // Helper to get color intensity based on within-brand percentage P(f | b)
  const getCellBg = (count: number, percentage: number) => {
    if (count === 0) return "bg-slate-50 text-slate-400 hover:bg-slate-100";
    if (percentage >= 80) return "bg-lime-500 text-white font-bold hover:bg-lime-600";
    if (percentage >= 60) return "bg-cobalt-600 text-white font-semibold hover:bg-cobalt-700";
    if (percentage >= 35) return "bg-cobalt-100 text-cobalt-950 font-medium hover:bg-cobalt-200";
    return "bg-slate-100 text-slate-800 hover:bg-slate-200";
  };

  const hasBrands = selectedBrands.length > 0;
  const hasFeatures = selectedFeatures.length > 0;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Brand–Feature Preference Matrix (Heatmap)"
        subtitle="Cross-tabulation of brand preference S_b and canonical feature selection S_f"
        badge={
          <Badge variant="cobalt">
            {isFullFeatureUniverse
              ? "All 7 Features (Expected Sum: 300%)"
              : `Filtered Subset: ${selectedFeatures.length}/7 Features`}
          </Badge>
        }
      />
      <CardContent className="space-y-4">
        {!hasBrands ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs">
            No brands selected. Please select one or more brands in the controls above.
          </div>
        ) : !hasFeatures ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs">
            No features selected. Please select one or more canonical features in the controls above to view intersections.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3 text-left w-36">Brand / Feature</th>
                  {selectedFeatures.map((f) => (
                    <th key={f} className="px-2 py-3 min-w-28 text-center">
                      <span className="block truncate" title={f}>
                        {f.replace(" Quality", "").replace(" Experience", "").replace(" Performance", "")}
                      </span>
                      <span className="text-[10px] text-slate-600 font-normal block truncate">
                        {f}
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 w-24 text-center bg-slate-100 border-l border-slate-200">
                    Cohort N(b)
                  </th>
                  <th className="px-3 py-3 w-32 text-center bg-slate-100 border-l border-slate-200">
                    Displayed % Sum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {selectedBrands.map((brand) => {
                  const n_b = brandTotals[brand] ?? 0;
                  const pctSum = featurePercentageSumByBrand[brand] ?? 0;

                  return (
                    <tr key={brand} className="hover:bg-slate-50/50">
                      {/* Row Header: Brand */}
                      <td className="px-3.5 py-3 text-left font-bold text-slate-900 bg-slate-50/80 border-r border-slate-100">
                        <span>{brand}</span>
                        <span className="text-[10px] text-slate-600 font-normal block">
                          N = {n_b} ({n_b > 0 ? ((n_b / result.totalCohortSize) * 100).toFixed(1) : 0}%)
                        </span>
                      </td>

                      {/* Matrix Cells */}
                      {selectedFeatures.map((feature) => {
                        const cell = matrix.find(
                          (c) => c.brand === brand && c.feature === feature
                        );
                        const count = cell?.count ?? 0;
                        const pct = cell?.percentage ?? 0;
                        const cellClass = getCellBg(count, pct);

                        return (
                          <td key={feature} className="p-1">
                            <button
                              onClick={() => cell && onSelectCell?.(cell)}
                              className={`w-full h-12 rounded-lg p-1 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${cellClass}`}
                              title={`${brand} ∩ ${feature}: ${count} respondents (${pct}% of ${brand})`}
                            >
                              <span className="font-mono text-xs font-bold leading-tight">
                                {count} {count === 1 ? "resp." : "resps."}
                              </span>
                              <span className="text-[10px] font-mono leading-tight opacity-90">
                                {n_b > 0 ? `${pct}%` : "—"}
                              </span>
                            </button>
                          </td>
                        );
                      })}

                      {/* Row Total N(b) */}
                      <td className="px-3 py-3 font-mono font-bold text-slate-800 bg-slate-50/80 border-l border-slate-200">
                        {n_b}
                      </td>

                      {/* Dynamic Displayed % Sum */}
                      <td className="px-3 py-3 font-mono font-bold text-center border-l border-slate-200 bg-slate-50/40">
                        {n_b > 0 ? (
                          <span
                            className={
                              isFullFeatureUniverse
                                ? "text-lime-600 font-extrabold"
                                : "text-cobalt-600"
                            }
                          >
                            {pctSum.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Explanatory Note & Legend */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed text-[11px]">
            <strong>Note on Feature Percentage Sums:</strong> When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum.
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Percentage Intensity:</span>
              <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500">
                0% (Void)
              </span>
              <span className="px-2 py-0.5 rounded bg-cobalt-100 text-cobalt-950 font-medium">
                35% – 59%
              </span>
              <span className="px-2 py-0.5 rounded bg-cobalt-600 text-white font-medium">
                60% – 79%
              </span>
              <span className="px-2 py-0.5 rounded bg-lime-500 text-white font-bold">
                ≥ 80% (Dominant)
              </span>
            </div>

            <div className="text-[11px] text-slate-500 italic">
              *Percentages use the brand&apos;s cohort size N(b) as denominator: P(f | b) = C(b, f) / N(b).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## File 08: `src/components/experiment-studio/BrandFeatureBarChart.tsx`

**Description:** Recharts Grouped Bar Chart Visualizing Within-Brand Preferences with X-Axis Grouped by Brand, Feature Legend Series, and Detailed Tooltips  
**File Size:** 8688 characters, 208 lines  

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type {
  BrandFeatureAssociationResult,
  BrandFeatureCell,
} from "@/types/experiment";
import type { SmartphoneBrand, SmartphoneFeature } from "@/types/survey";

export interface BrandFeatureBarChartProps {
  result: BrandFeatureAssociationResult;
  onSelectCell?: (cell: BrandFeatureCell) => void;
}

/**
 * Consistent, accessible color palette representing the 7 canonical smartphone features.
 */
export const FEATURE_PALETTE: Record<SmartphoneFeature, string> = {
  "Camera Quality": "#2563eb", // Cobalt
  "Battery Life": "#84cc16", // Acid lime
  "Processing Performance": "#f59e0b", // Amber
  "Display Quality": "#06b6d4", // Cyan
  "Storage Capacity": "#8b5cf6", // Purple
  "Build & Design Quality": "#ec4899", // Pink
  "Software & OS Experience": "#14b8a6", // Teal
};

export function BrandFeatureBarChart({
  result,
  onSelectCell,
}: BrandFeatureBarChartProps) {
  const { selectedBrands, selectedFeatures, matrix, brandTotals } = result;

  // Transform data for Recharts: X-axis groups by BRAND, with feature percentage series
  const chartData = selectedBrands.map((brand) => {
    const n_b = brandTotals[brand] ?? 0;
    const entry: Record<string, string | number> = {
      brand,
      displayName: `${brand} (N=${n_b})`,
      cohortSize: n_b,
    };

    for (const feature of selectedFeatures) {
      const cell = matrix.find((c) => c.brand === brand && c.feature === feature);
      entry[`${feature}_pct`] = cell?.percentage ?? 0;
      entry[`${feature}_count`] = cell?.count ?? 0;
    }

    return entry;
  });

  const hasBrands = selectedBrands.length > 0;
  const hasFeatures = selectedFeatures.length > 0;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Comparative Feature Preference Distribution by Brand Cohort"
        subtitle="Grouped by brand cohort on the X-axis to evaluate conditional feature distributions P(Feature | Brand) using brand-specific denominators N(b)"
        badge={<Badge variant="lime">Brand-Grouped Distribution</Badge>}
      />
      <CardContent className="space-y-4">
        {!hasBrands ? (
          <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs">
            No brands selected. Please select one or more brands in the controls above.
          </div>
        ) : !hasFeatures ? (
          <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-xs">
            No features selected. Please select one or more canonical features in the controls above.
          </div>
        ) : (
          <div className="w-full h-96 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 35 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="displayName"
                  tick={{ fontSize: 11, fill: "#1e293b", fontWeight: 600 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  unit="%"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const brandEntry = chartData.find(
                        (d) => d.displayName === label || d.brand === label
                      );
                      const brandName =
                        (brandEntry?.brand as SmartphoneBrand) ??
                        (String(label).split(" ")[0] as SmartphoneBrand);
                      const n_b =
                        brandEntry?.cohortSize ??
                        (brandTotals[brandName] ?? 0);

                      return (
                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-2 min-w-52">
                          <div className="border-b border-slate-100 pb-1.5 flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {brandName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                              Cohort N(b) = {n_b}
                            </span>
                          </div>
                          <div className="space-y-1 max-h-56 overflow-y-auto">
                            {payload.map((entry) => {
                              const featureName = entry.dataKey
                                ? String(entry.dataKey).replace("_pct", "")
                                : String(entry.name);
                              const count =
                                brandEntry?.[`${featureName}_count`] ?? 0;
                              const pct = entry.value;

                              return (
                                <div
                                  key={featureName}
                                  className="flex items-center justify-between gap-3 text-[11px]"
                                >
                                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                    <span
                                      className="h-2.5 w-2.5 rounded-full shrink-0"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="truncate max-w-36">
                                      {featureName}:
                                    </span>
                                  </span>
                                  <span className="font-mono font-bold text-slate-900 shrink-0">
                                    {pct}% ({count}/{n_b})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{ paddingBottom: 16, fontSize: 11 }}
                  formatter={(value) => value.replace("_pct", "")}
                />
                {selectedFeatures.map((feature) => (
                  <Bar
                    key={feature}
                    dataKey={`${feature}_pct`}
                    name={feature}
                    fill={FEATURE_PALETTE[feature] ?? "#64748b"}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                    onClick={(data) => {
                      const brandName = (data.brand ??
                        String(data.name)) as SmartphoneBrand;
                      const cell = matrix.find(
                        (c) => c.brand === brandName && c.feature === feature
                      );
                      if (cell) onSelectCell?.(cell);
                    }}
                    className="cursor-pointer"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-[11px] text-slate-500 italic text-center">
          *Within-brand percentage: P(f | b) = C(b, f) / N(b) * 100. When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum.
        </p>
      </CardContent>
    </Card>
  );
}
```

---

## File 09: `src/components/experiment-studio/BrandFeatureInterpretation.tsx`

**Description:** Academic Methodology & Descriptive Interpretation Panel for Experiment 1 (H_0 vs H_1 Hypotheses, Strict Non-Causal Guardrails)  
**File Size:** 4479 characters, 98 lines  

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import type { BrandFeatureAssociationResult } from "@/types/experiment";

export interface BrandFeatureInterpretationProps {
  result: BrandFeatureAssociationResult;
}

export function BrandFeatureInterpretation({
  result,
}: BrandFeatureInterpretationProps) {
  const { descriptiveNotes, selectedBrands } = result;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Experiment 1: Scientific Methodology & Descriptive Interpretation"
        subtitle="Hypothesis framing, discrete intersection formulations, and non-causal observational synthesis"
        badge={<Badge variant="cobalt">Academic Analysis</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Hypothesis Framing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Descriptive Null Hypothesis (H₀)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Feature preference distributions are identical across the selected brand groups:
            </p>
            <KaTeXMath
              math="H_0: P(f \mid b_i) = P(f \mid b_j) \quad \forall f \in \text{Features}, \quad \forall i, j"
              block
              className="text-xs text-slate-800 font-semibold"
            />
          </div>

          <div className="p-4 rounded-xl border border-cobalt-200 bg-cobalt-50/50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cobalt-800 block">
              Descriptive Alternative Hypothesis (H₁)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Feature preference distributions differ across the selected brand groups:
            </p>
            <KaTeXMath
              math="H_1: \exists f \in \text{Features}, \exists i, j \text{ such that } P(f \mid b_i) \neq P(f \mid b_j)"
              block
              className="text-xs text-cobalt-950 font-semibold"
            />
          </div>
        </div>

        {/* Dynamically Generated Descriptive Findings */}
        <div className="rounded-xl border border-lime-200 bg-lime-50/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-950 block">
              Observed Descriptive Associations
            </span>
            <Badge variant="lime">
              {selectedBrands.length} Brand{selectedBrands.length > 1 ? "s" : ""} Compared
            </Badge>
          </div>

          {descriptiveNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-700">
              {descriptiveNotes.map((note, index) => (
                <li
                  key={index}
                  className="rounded-lg bg-white p-2.5 border border-lime-200/80 shadow-2xs flex items-start gap-2"
                >
                  <span className="text-cobalt-600 font-bold mr-0.5">&bull;</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No brand data available for the current selection.
            </p>
          )}
        </div>

        {/* Methodological Guidance & Causality Guardrails */}
        <Callout
          variant="warning"
          title="Methodological Guardrail: Association vs. Causation"
        >
          These findings describe observed co-occurrences in survey responses. They do <strong>not</strong> demonstrate causal relationships (e.g. that preferring Apple causes a desire for Camera Quality, or vice versa). Furthermore, given the small demonstration dataset (N = 12), these observational distributions illustrate discrete mathematical cross-tabulations and must <strong>not</strong> be cited as statistically significant market conclusions.
        </Callout>
      </CardContent>
    </Card>
  );
}
```

---

## File 10: `src/components/experiment-studio/BudgetCombinationControls.tsx`

**Description:** Multi-Select Filter Controls for Budget Segments with Quick Selection Presets  
**File Size:** 2698 characters, 76 lines  

```tsx
"use client";

import React from "react";
import { BUDGET_RANGES, type BudgetRange } from "@/types/survey";

export interface BudgetCombinationControlsProps {
  selectedBudgets: readonly BudgetRange[];
  setSelectedBudgets: (budgets: BudgetRange[]) => void;
}

export function BudgetCombinationControls({
  selectedBudgets,
  setSelectedBudgets,
}: BudgetCombinationControlsProps) {
  const toggleBudget = (b: BudgetRange) => {
    if (selectedBudgets.includes(b)) {
      if (selectedBudgets.length > 1) {
        setSelectedBudgets(selectedBudgets.filter((budget) => budget !== b));
      }
    } else {
      setSelectedBudgets([...selectedBudgets, b]);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Select Budget Segments to Compare ({selectedBudgets.length} / {BUDGET_RANGES.length})
        </span>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedBudgets([...BUDGET_RANGES])}
            className="text-cobalt-600 hover:underline font-semibold"
          >
            All Segments
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setSelectedBudgets(["Under $400", "Over $1,000"])}
            className="text-cobalt-600 hover:underline font-semibold"
          >
            Extreme Tiers
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setSelectedBudgets(["$400 - $700", "$700 - $1,000"])}
            className="text-cobalt-600 hover:underline font-semibold"
          >
            Mid-Range Tiers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {BUDGET_RANGES.map((b) => {
          const isSelected = selectedBudgets.includes(b);
          return (
            <button
              key={b}
              onClick={() => toggleBudget(b)}
              className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                isSelected
                  ? "border-cobalt-600 bg-cobalt-50 text-cobalt-950 ring-2 ring-cobalt-300 shadow-2xs"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## File 11: `src/components/experiment-studio/BudgetCombinationMetrics.tsx`

**Description:** Combinatorial Stat Cards Tracking C(7,3)=35 Theoretical Space, 10 Observed Triplet Count, 25 Combinatorial Voids, and Sample Size  
**File Size:** 2979 characters, 81 lines  

```tsx
"use client";

import React from "react";
import type { BudgetCombinationAnalysisResult } from "@/types/experiment";

export interface BudgetCombinationMetricsProps {
  result: BudgetCombinationAnalysisResult;
}

export function BudgetCombinationMetrics({
  result,
}: BudgetCombinationMetricsProps) {
  const {
    totalTheoreticalCombinations,
    totalObservedInDataset,
    totalUnobservedInDataset,
    selectedBudgets,
    budgetTotals,
  } = result;

  const totalRespondentsInSelected = selectedBudgets.reduce(
    (acc, b) => acc + (budgetTotals[b] ?? 0),
    0
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Theoretical Space */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
          Theoretical Triplet Space
        </span>
        <div className="mt-1 font-mono text-2xl font-extrabold text-slate-900">
          {totalTheoreticalCombinations}
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          C(7, 3) mathematical subsets
        </span>
      </div>

      {/* Observed Triplets */}
      <div className="rounded-xl border border-lime-200 bg-lime-50/40 p-4 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-lime-800 block">
          Observed in Dataset
        </span>
        <div className="mt-1 font-mono text-2xl font-extrabold text-lime-950">
          {totalObservedInDataset}
        </div>
        <span className="text-[11px] text-lime-700 font-medium">
          {((totalObservedInDataset / totalTheoreticalCombinations) * 100).toFixed(1)}% space coverage
        </span>
      </div>

      {/* Unobserved Voids */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
          Theoretical Voids
        </span>
        <div className="mt-1 font-mono text-2xl font-extrabold text-slate-700">
          {totalUnobservedInDataset}
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          {((totalUnobservedInDataset / totalTheoreticalCombinations) * 100).toFixed(1)}% unchosen in cohort
        </span>
      </div>

      {/* Selected Segments Sample */}
      <div className="rounded-xl border border-cobalt-200 bg-cobalt-50/40 p-4 shadow-2xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cobalt-800 block">
          Selected Segments Sample
        </span>
        <div className="mt-1 font-mono text-2xl font-extrabold text-cobalt-950">
          {totalRespondentsInSelected}
        </div>
        <span className="text-[11px] text-cobalt-700 font-medium">
          Across {selectedBudgets.length} budget tier{selectedBudgets.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
```

---

## File 12: `src/components/experiment-studio/BudgetCombinationChart.tsx`

**Description:** Recharts Visual Frequency Comparison of Feature Triplets across Selected Budget Tiers  
**File Size:** 7118 characters, 184 lines  

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type {
  BudgetCombinationAnalysisResult,
  BudgetCombinationRow,
} from "@/types/experiment";
import type { BudgetRange } from "@/types/survey";

export interface BudgetCombinationChartProps {
  result: BudgetCombinationAnalysisResult;
  onSelectRow?: (row: BudgetCombinationRow) => void;
}

const BUDGET_PALETTE: Record<BudgetRange, string> = {
  "Under $400": "#84cc16", // Acid lime
  "$400 - $700": "#2563eb", // Cobalt
  "$700 - $1,000": "#f59e0b", // Amber
  "Over $1,000": "#8b5cf6", // Purple
};

export function BudgetCombinationChart({
  result,
  onSelectRow,
}: BudgetCombinationChartProps) {
  const { selectedBudgets, observedRows, budgetTotals } = result;

  // Filter observed rows to those that appear in at least one of the selected budgets
  const activeRows = observedRows.filter((r) =>
    selectedBudgets.some((b) => r.frequenciesByBudget[b] > 0)
  );

  // Transform data for Recharts
  const chartData = activeRows.map((row) => {
    const shortNames = row.features
      .map((f) => f.split(" ")[0])
      .join(" + ");

    const entry: Record<string, string | number> = {
      combinationId: row.combinationId,
      label: `${row.combinationId}: ${shortNames}`,
      features: row.features.join(" • "),
    };

    for (const b of selectedBudgets) {
      entry[`${b}_count`] = row.frequenciesByBudget[b] ?? 0;
      entry[`${b}_pct`] = row.percentagesByBudget[b] ?? 0;
    }

    return entry;
  });

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Observed Feature Combination Frequencies by Budget Tier"
        subtitle="Comparing exact triplet frequencies C(p, t) across selected student budget segments"
        badge={<Badge variant="cobalt">Exact Triplet Frequencies</Badge>}
      />
      <CardContent className="space-y-4">
        {activeRows.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">
              No observed feature combinations exist for the currently selected budget segment(s).
            </p>
          </div>
        ) : (
          <div className="w-full h-84 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  domain={[0, "dataMax + 1"]}
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={190}
                  tick={{ fontSize: 11, fill: "#334155" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = chartData.find((d) => d.label === label);
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1.5 min-w-48">
                          <div className="font-mono font-bold text-slate-900 border-b border-slate-100 pb-1">
                            {item?.combinationId}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {item?.features}
                          </div>
                          <div className="space-y-1 pt-1">
                            {payload.map((entry) => {
                              const budgetName = entry.dataKey
                                ? String(entry.dataKey).replace("_count", "")
                                : "";
                              const count = entry.value;
                              const pct = item?.[`${budgetName}_pct`] ?? 0;
                              const n_p = budgetTotals[budgetName as BudgetRange] ?? 0;

                              return (
                                <div
                                  key={entry.name}
                                  className="flex items-center justify-between gap-3 text-[11px]"
                                >
                                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                    <span
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    {budgetName}:
                                  </span>
                                  <span className="font-mono font-bold text-slate-900">
                                    {count} resp. ({pct}% of {n_p})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                  formatter={(value) => value.replace("_count", "")}
                />
                {selectedBudgets.map((budget) => (
                  <Bar
                    key={budget}
                    dataKey={`${budget}_count`}
                    name={budget}
                    fill={BUDGET_PALETTE[budget] ?? "#64748b"}
                    radius={[0, 4, 4, 0]}
                    maxBarSize={18}
                    onClick={(entry) => {
                      const found = activeRows.find(
                        (r) => r.combinationId === entry.combinationId
                      );
                      if (found) onSelectRow?.(found);
                    }}
                    className="cursor-pointer"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-[11px] text-slate-500 italic text-center">
          *Within-segment percentages use the specific budget cohort size N(p) as denominator: P(t | p) = C(p, t) / N(p).
        </p>
      </CardContent>
    </Card>
  );
}
```

---

## File 13: `src/components/experiment-studio/BudgetCombinationTable.tsx`

**Description:** Searchable and Filterable 35-Combination Table with Observed / All / Voids Tabs, Frequencies, and Within-Budget Percentages  
**File Size:** 9835 characters, 235 lines  

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type {
  BudgetCombinationAnalysisResult,
  BudgetCombinationRow,
} from "@/types/experiment";

export interface BudgetCombinationTableProps {
  result: BudgetCombinationAnalysisResult;
  onSelectRow?: (row: BudgetCombinationRow) => void;
}

type TableFilter = "observed" | "all" | "voids";

export function BudgetCombinationTable({
  result,
  onSelectRow,
}: BudgetCombinationTableProps) {
  const { all35Rows, selectedBudgets, budgetTotals } = result;

  const [activeFilter, setActiveFilter] = useState<TableFilter>("observed");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    return all35Rows.filter((row) => {
      // 1. Status Filter
      if (activeFilter === "observed" && !row.isObservedOverall) return false;
      if (activeFilter === "voids" && row.isObservedOverall) return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = row.combinationId.toLowerCase().includes(q);
        const matchesFeature = row.features.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesFeature) return false;
      }

      return true;
    });
  }, [all35Rows, activeFilter, searchQuery]);

  const countObserved = all35Rows.filter((r) => r.isObservedOverall).length;
  const countVoids = all35Rows.length - countObserved;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Theoretical Space vs. Empirical Observations"
        subtitle="Full enumeration of all C(7, 3) = 35 combinations mapped against selected budget tiers"
        badge={
          <Badge variant="cobalt">
            {filteredRows.length} / {all35Rows.length} Triplets Displayed
          </Badge>
        }
      />
      <CardContent className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter("observed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === "observed"
                  ? "bg-lime-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Observed in Dataset ({countObserved})
            </button>
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-cobalt-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All 35 Theoretical Space ({all35Rows.length})
            </button>
            <button
              onClick={() => setActiveFilter("voids")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === "voids"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Theoretical Voids ({countVoids})
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-60">
            <input
              type="text"
              placeholder="Search by ID or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 placeholder-slate-400 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            />
          </div>
        </div>

        {/* Results Table */}
        {filteredRows.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">
              No combinations match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-semibold text-cobalt-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3.5 py-3 w-24">Triplet ID</th>
                  <th className="px-3.5 py-3 min-w-56">Canonical Feature Triplet</th>
                  <th className="px-3.5 py-3 text-center w-28">Status</th>
                  {selectedBudgets.map((b) => (
                    <th key={b} className="px-3 py-3 text-center min-w-28">
                      <span className="block truncate">{b}</span>
                      <span className="text-[10px] text-slate-600 font-normal block">
                        N = {budgetTotals[b] ?? 0}
                      </span>
                    </th>
                  ))}
                  <th className="px-3.5 py-3 text-center w-28 bg-slate-100 border-l border-slate-200">
                    Total Cohort
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRows.map((row) => (
                  <tr
                    key={row.combinationId}
                    onClick={() => onSelectRow?.(row)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      row.isObservedOverall ? "" : "opacity-75 bg-slate-50/40"
                    }`}
                  >
                    {/* ID */}
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900">
                      {row.combinationId}
                    </td>

                    {/* Features */}
                    <td className="px-3.5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.features.map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-3.5 py-3 text-center">
                      {row.isObservedOverall ? (
                        <Badge variant="lime" className="font-mono text-[10px]">
                          Observed
                        </Badge>
                      ) : (
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          Void
                        </span>
                      )}
                    </td>

                    {/* Frequencies by Selected Budget */}
                    {selectedBudgets.map((b) => {
                      const count = row.frequenciesByBudget[b] ?? 0;
                      const pct = row.percentagesByBudget[b] ?? 0;

                      return (
                        <td key={b} className="px-3 py-3 text-center">
                          {count > 0 ? (
                            <div className="font-mono">
                              <span className="font-bold text-slate-900">
                                {count} resp.
                              </span>
                              <span className="text-[10px] text-lime-700 block font-semibold">
                                {pct}% of tier
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono text-xs">
                              0
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Cohort Frequency */}
                    <td className="px-3.5 py-3 text-center font-mono font-bold text-slate-800 bg-slate-50/80 border-l border-slate-200">
                      {row.totalObservedOverall > 0 ? (
                        <div>
                          <span>{row.totalObservedOverall}</span>
                          <span className="text-[10px] text-slate-600 block font-normal">
                            {((row.totalObservedOverall / result.totalCohortSize) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## File 14: `src/components/experiment-studio/BudgetCombinationInterpretation.tsx`

**Description:** Academic Interpretation Panel for Experiment 2 (H_0 vs H_1 Hypotheses, 100% Stratum Conservation Law, KaTeX Formulations)  
**File Size:** 5533 characters, 113 lines  

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import type { BudgetCombinationAnalysisResult } from "@/types/experiment";

export interface BudgetCombinationInterpretationProps {
  result: BudgetCombinationAnalysisResult;
}

export function BudgetCombinationInterpretation({
  result,
}: BudgetCombinationInterpretationProps) {
  const { descriptiveNotes, selectedBudgets } = result;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Experiment 2: Scientific Methodology & Descriptive Interpretation"
        subtitle="Hypothesis framing, within-segment combination conservation, and observational synthesis"
        badge={<Badge variant="cobalt">Academic Analysis</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Hypothesis Framing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Descriptive Null Hypothesis (H₀)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              The observed three-feature preference triplet distribution is similar across budget segments:
            </p>
            <KaTeXMath
              math="H_0: P(t \mid p_i) = P(t \mid p_j) \quad \forall t \in \text{Triplets}, \quad \forall i, j"
              block
              className="text-xs text-slate-800 font-semibold"
            />
          </div>

          <div className="p-4 rounded-xl border border-cobalt-200 bg-cobalt-50/50 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cobalt-800 block">
              Descriptive Alternative Hypothesis (H₁)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              The observed three-feature preference triplet distribution differs across budget segments:
            </p>
            <KaTeXMath
              math="H_1: \exists t \in \text{Triplets}, \exists i, j \text{ such that } P(t \mid p_i) \neq P(t \mid p_j)"
              block
              className="text-xs text-cobalt-950 font-semibold"
            />
          </div>
        </div>

        {/* Within-Segment Percentage Conservation */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
            Mathematical Conservation Law:
          </span>
          <KaTeXMath
            math="\sum_{t \text{ observed}} P(t \mid p) = \sum_{t \text{ observed}} \frac{C(p, t)}{N(p)} \times 100\% = 100\% \quad (\text{for } N(p) > 0)"
            block
            className="text-xs text-slate-900 font-bold"
          />
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            Because every survey respondent belongs to exactly one budget tier and selects exactly one feature triplet, the sum of observed combination percentages within each populated budget stratum strictly conserves to 100% (subject only to rounding).
          </p>
        </div>

        {/* Dynamically Generated Descriptive Findings */}
        <div className="rounded-xl border border-lime-200 bg-lime-50/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-950 block">
              Observed Descriptive Associations
            </span>
            <Badge variant="lime">
              {selectedBudgets.length} Budget Tier{selectedBudgets.length > 1 ? "s" : ""} Compared
            </Badge>
          </div>

          {descriptiveNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-700">
              {descriptiveNotes.map((note, index) => (
                <li
                  key={index}
                  className="rounded-lg bg-white p-2.5 border border-lime-200/80 shadow-2xs flex items-start gap-2"
                >
                  <span className="text-cobalt-600 font-bold mr-0.5">&bull;</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No budget combination data available for the current selection.
            </p>
          )}
        </div>

        {/* Methodological Guidance Callout */}
        <Callout
          variant="warning"
          title="Methodological Guardrail: Observational Distribution"
        >
          These findings represent observational cross-sectional survey distributions. They demonstrate how student feature bundles cluster across budget tiers in this specific cohort. They do <strong>not</strong> prove that spending power causally dictates preference (or that preference causes budget allocation). With a benchmark sample size (N = 12), individual responses generate large percentage increments; these patterns should be evaluated as discrete combinatorial distributions rather than generalized consumer behavior.
        </Callout>
      </CardContent>
    </Card>
  );
}
```

---

## File 15: `src/components/experiment-studio/RespondentInspectorModal.tsx`

**Description:** Drill-Down Respondent Inspector Modal Displaying Anonymous Student Profiles or Empty Set (∅) State  
**File Size:** 4769 characters, 121 lines  

```tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SurveyResponse } from "@/types/survey";

export interface RespondentInspectorModalProps {
  title: string;
  subtitle: string;
  matchingIds: readonly string[];
  allResponses: readonly SurveyResponse[];
  onClose: () => void;
}

export function RespondentInspectorModal({
  title,
  subtitle,
  matchingIds,
  allResponses,
  onClose,
}: RespondentInspectorModalProps) {
  const matchingRecords = allResponses.filter((r) =>
    matchingIds.includes(r.response_id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              <Badge variant="cobalt" className="font-mono">
                {matchingIds.length} {matchingIds.length === 1 ? "Respondent" : "Respondents"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm font-bold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content Table or Empty State */}
        {matchingRecords.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-3xl font-serif text-slate-400 mb-1">∅</div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Empty Intersection (0 Respondents)
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No survey respondents match this exact brand-feature or budget-combination conjunction in the validated dataset.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5">Response ID</th>
                  <th className="px-3.5 py-2.5">Brand</th>
                  <th className="px-3.5 py-2.5">Budget</th>
                  <th className="px-3.5 py-2.5">Preferred Features</th>
                  <th className="px-3.5 py-2.5">Primary Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {matchingRecords.map((r) => (
                  <tr key={r.response_id} className="hover:bg-slate-50/80">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-cobalt-700">
                      {r.response_id}
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-slate-800">
                      {r.preferred_brand}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      {r.budget_range}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {r.preferred_features.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-500 text-[11px]">
                      {r.primary_use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## File 16: `src/app/experiment-studio/page.tsx`

**Description:** Integrated Experiment Studio Research Page with Tabbed Navigation, Dynamic Feature Percentage Sum Display, Explanatory Note, and Modal Inspector  
**File Size:** 22646 characters, 486 lines  

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { computeBrandFeatureAssociation } from "@/lib/math/brandFeatureExperiment";
import { computeBudgetCombinationAnalysis } from "@/lib/math/budgetCombinationExperiment";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
  type SmartphoneBrand,
  type SmartphoneFeature,
  type BudgetRange,
} from "@/types/survey";
import type {
  BrandFeatureCell,
  BudgetCombinationRow,
} from "@/types/experiment";

import { BrandFeatureControls } from "@/components/experiment-studio/BrandFeatureControls";
import { BrandFeatureHeatmap } from "@/components/experiment-studio/BrandFeatureHeatmap";
import { BrandFeatureBarChart } from "@/components/experiment-studio/BrandFeatureBarChart";
import { BrandFeatureInterpretation } from "@/components/experiment-studio/BrandFeatureInterpretation";
import { BudgetCombinationControls } from "@/components/experiment-studio/BudgetCombinationControls";
import { BudgetCombinationMetrics } from "@/components/experiment-studio/BudgetCombinationMetrics";
import { BudgetCombinationChart } from "@/components/experiment-studio/BudgetCombinationChart";
import { BudgetCombinationTable } from "@/components/experiment-studio/BudgetCombinationTable";
import { BudgetCombinationInterpretation } from "@/components/experiment-studio/BudgetCombinationInterpretation";
import { RespondentInspectorModal } from "@/components/experiment-studio/RespondentInspectorModal";

type ActiveTab = "all" | "exp1" | "exp2" | "methodology";

export default function ExperimentStudioPage() {
  // Load dataset
  const dataset = useMemo(() => loadDemoSurveyDataset(), []);
  const responses = dataset.responses;

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  // Experiment 1 State
  const [selectedBrands, setSelectedBrands] = useState<SmartphoneBrand[]>([
    ...SMARTPHONE_BRANDS,
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<SmartphoneFeature[]>([
    ...SMARTPHONE_FEATURES,
  ]);

  // Experiment 2 State
  const [selectedBudgets, setSelectedBudgets] = useState<BudgetRange[]>([
    ...BUDGET_RANGES,
  ]);

  // Modal State
  const [inspectorModal, setInspectorModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    matchingIds: readonly string[];
  } | null>(null);

  // Computations
  const brandFeatureResult = useMemo(
    () =>
      computeBrandFeatureAssociation(responses, selectedBrands, selectedFeatures),
    [responses, selectedBrands, selectedFeatures]
  );

  const budgetCombinationResult = useMemo(
    () => computeBudgetCombinationAnalysis(responses, selectedBudgets),
    [responses, selectedBudgets]
  );

  // Dynamic Feature Percentage Sum summary across currently selected populated brands
  const displayedFeatureSumSummary = useMemo(() => {
    if (brandFeatureResult.isFullFeatureUniverse) {
      return {
        label: "300.0%",
        note: "All 7 Features (Expected: 300%)",
        isExpected300: true,
      };
    }

    if (selectedFeatures.length === 0) {
      return {
        label: "0.0%",
        note: "0 Features Selected",
        isExpected300: false,
      };
    }

    const populatedSelectedBrands = selectedBrands.filter(
      (b) => (brandFeatureResult.brandTotals[b] ?? 0) > 0
    );

    if (populatedSelectedBrands.length === 0) {
      return {
        label: "0.0%",
        note: "No populated cohorts",
        isExpected300: false,
      };
    }

    const sums = populatedSelectedBrands.map(
      (b) => brandFeatureResult.featurePercentageSumByBrand[b] ?? 0
    );
    const minSum = Math.min(...sums);
    const maxSum = Math.max(...sums);

    const rangeLabel =
      minSum === maxSum
        ? `${minSum.toFixed(1)}%`
        : `${minSum.toFixed(1)}% – ${maxSum.toFixed(1)}%`;

    return {
      label: rangeLabel,
      note: `${selectedFeatures.length}/7 Features (Dynamic Sum)`,
      isExpected300: false,
    };
  }, [brandFeatureResult, selectedBrands, selectedFeatures]);

  // Modal Triggers
  const handleSelectCell = (cell: BrandFeatureCell) => {
    const brandCohortSize = brandFeatureResult.brandTotals[cell.brand] ?? 0;
    setInspectorModal({
      isOpen: true,
      title: `${cell.brand} × ${cell.feature}`,
      subtitle: `Discrete intersection S_${cell.brand} ∩ S_${cell.feature}: ${cell.count} respondents (${cell.percentage.toFixed(
        1
      )}% of ${cell.brand} cohort N=${brandCohortSize})`,
      matchingIds: cell.matchingRespondentIds,
    });
  };

  const handleSelectBudgetRow = (row: BudgetCombinationRow) => {
    const allMatchingIds = Object.values(row.matchingRespondentIdsByBudget).flat();
    setInspectorModal({
      isOpen: true,
      title: `${row.combinationId}: {${row.features.join(", ")}}`,
      subtitle: `Observed ${row.totalObservedOverall} times across all segments. ${
        row.isObservedOverall
          ? "Observed empirical combination."
          : "Combinatorial void (unobserved in dataset)."
      }`,
      matchingIds: allMatchingIds,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        eyebrow="Empirical Discrete Research"
        title="Experiment Studio: Preference Hypothesis Testing"
        description="Investigate empirical patterns and associations across smartphone brands, canonical features, and budget segments. Formulates formal hypotheses, evaluates discrete cross-tabulations, and contrasts theoretical combinatorial spaces against observed survey responses."
        badge={{ text: "Phase 06 Verified", variant: "lime" }}
        actions={
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-500 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-md">
              [DEMO DATA: N=12]
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Observational Non-Causal Framing Banner */}
        <Callout
          variant="warning"
          title="Methodological Grounding: Observational Study Notice"
        >
          <div className="space-y-1.5 text-xs text-graphite-300 leading-relaxed">
            <p>
              Data reflects an observational university sample ($N=12$). Cross-tabulations and segment percentages describe <strong>empirical associations</strong> within this cohort.
            </p>
            <p>
              They <strong>do not prove causal mechanisms</strong>, consumer utility invariance, or general population distributions. Percentages are strictly calculated using respective cohort sizes as denominators ($N(b)$ for brand cohorts; $N(p)$ for budget segments).
            </p>
          </div>
        </Callout>

        {/* Studio Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#182030] pb-4">
          <Button
            size="sm"
            variant={activeTab === "all" ? "primary" : "secondary"}
            onClick={() => setActiveTab("all")}
          >
            All Experiments
          </Button>
          <Button
            size="sm"
            variant={activeTab === "exp1" ? "primary" : "secondary"}
            onClick={() => setActiveTab("exp1")}
          >
            Exp 1: Brand–Feature Association
          </Button>
          <Button
            size="sm"
            variant={activeTab === "exp2" ? "primary" : "secondary"}
            onClick={() => setActiveTab("exp2")}
          >
            Exp 2: Combinations by Budget
          </Button>
          <Button
            size="sm"
            variant={activeTab === "methodology" ? "primary" : "secondary"}
            onClick={() => setActiveTab("methodology")}
          >
            Methodology &amp; Hypotheses
          </Button>
        </div>

        {/* EXPERIMENT 1 SECTION */}
        {(activeTab === "all" || activeTab === "exp1") && (
          <section className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="cobalt">Experiment 01</Badge>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Brand–Feature Preference Association
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Cross-tabulating brand affinity against canonical feature choices. Evaluates within-brand preference distributions P(f | b).
                </p>
                <p className="text-[11px] text-slate-400 mt-1.5 italic">
                  When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum.
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
                Denominator: <span className="text-cobalt-400 font-bold">N(b)</span> | Displayed Sum:{" "}
                <span
                  className={
                    displayedFeatureSumSummary.isExpected300
                      ? "text-lime-400 font-bold"
                      : "text-amber-400 font-bold"
                  }
                >
                  {displayedFeatureSumSummary.label}
                </span>{" "}
                <span className="text-slate-400 text-[10px]">
                  ({displayedFeatureSumSummary.note})
                </span>
              </div>
            </div>

            {/* Interactive Multi-Select Controls */}
            <BrandFeatureControls
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />

            {/* Heatmap Matrix */}
            <BrandFeatureHeatmap
              result={brandFeatureResult}
              onSelectCell={handleSelectCell}
            />

            {/* Grouped Bar Chart */}
            <BrandFeatureBarChart
              result={brandFeatureResult}
              onSelectCell={handleSelectCell}
            />

            {/* Scientific Interpretation & Descriptive Notes */}
            <BrandFeatureInterpretation result={brandFeatureResult} />
          </section>
        )}

        {/* EXPERIMENT 2 SECTION */}
        {(activeTab === "all" || activeTab === "exp2") && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="lime">Experiment 02</Badge>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Feature Triplet Combinations by Budget Segment
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Stratifying the 35 theoretical triplets across budget ranges. Evaluates C(7,3)=35 theoretical vs empirical observations and within-budget distributions P(t | p).
                </p>
              </div>
              <div className="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                Denominator: <span className="text-lime-400 font-bold">N(p)</span> | Triplet Sum: <span className="text-cobalt-400 font-bold">100%</span>
              </div>
            </div>

            {/* Budget Controls */}
            <BudgetCombinationControls
              selectedBudgets={selectedBudgets}
              setSelectedBudgets={setSelectedBudgets}
            />

            {/* Summary Stat Cards */}
            <BudgetCombinationMetrics result={budgetCombinationResult} />

            {/* Recharts Bar Chart */}
            <BudgetCombinationChart
              result={budgetCombinationResult}
              onSelectRow={handleSelectBudgetRow}
            />

            {/* Full 35 Combination Table */}
            <BudgetCombinationTable
              result={budgetCombinationResult}
              onSelectRow={handleSelectBudgetRow}
            />

            {/* Scientific Interpretation & Conservation Law */}
            <BudgetCombinationInterpretation result={budgetCombinationResult} />
          </section>
        )}

        {/* DEDICATED METHODOLOGY & HYPOTHESIS COMPARISON TAB */}
        {activeTab === "methodology" && (
          <section className="space-y-6 pt-2">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">Formal Framework</Badge>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Research Hypotheses &amp; Methodological Comparison
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Formal mathematical criteria, hypothesis definitions, and analytical guardrails for the PhonePrint research suite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exp 1 Summary Card */}
              <Card className="border-slate-200/90 shadow-card">
                <CardHeader
                  title="Experiment 1: Brand–Feature Preferences"
                  subtitle="Within-brand preference distributions"
                  badge={<Badge variant="cobalt">Exp 1 Protocol</Badge>}
                />
                <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Formal Hypothesis Framing
                    </span>
                    <p className="font-medium text-slate-900 mb-1">
                      <strong>H₀ (Null):</strong> Canonical feature selection is conditionally independent of brand choice: <KaTeXMath math="P(f \mid b) = P(f)" /> for all <KaTeXMath math="b \in B, f \in F" />.
                    </p>
                    <p className="font-medium text-slate-900">
                      <strong>H₁ (Alternative):</strong> Feature selection distributions systematically vary across brand cohorts: <KaTeXMath math="\exists b, f: P(f \mid b) \neq P(f)" />.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Mathematical Invariants
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Intersection count: <KaTeXMath math="C(b, f) = |S_b \cap S_f|" />.</li>
                      <li>Within-brand percentage: <KaTeXMath math="P(f \mid b) = \frac{C(b, f)}{N(b)} \times 100\%" />.</li>
                      <li>Because each student selects 3 features, <KaTeXMath math="\sum_{f=1}^7 P(f \mid b) = 300.0\%" /> for every populated brand cohort.</li>
                      <li>Safe zero-denominator handling: <KaTeXMath math="P(f \mid b) = 0.0\%" /> when <KaTeXMath math="N(b) = 0" />.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Exp 2 Summary Card */}
              <Card className="border-slate-200/90 shadow-card">
                <CardHeader
                  title="Experiment 2: Budget Segment Triplet Space"
                  subtitle="Discrete combinatorics across expenditure tiers"
                  badge={<Badge variant="lime">Exp 2 Protocol</Badge>}
                />
                <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Formal Hypothesis Framing
                    </span>
                    <p className="font-medium text-slate-900 mb-1">
                      <strong>H₀ (Null):</strong> Feature triplet choices are uniformly or identically distributed across budget tiers: <KaTeXMath math="P(t \mid p) = P(t)" /> for all <KaTeXMath math="p \in P" />.
                    </p>
                    <p className="font-medium text-slate-900">
                      <strong>H₁ (Alternative):</strong> Specific triplets concentrate within distinct budget tiers (e.g. premium hardware in high budget, value combinations in low budget).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Mathematical Invariants
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Theoretical space: <KaTeXMath math="C(7, 3) = \frac{7!}{3! \cdot 4!} = 35" /> distinct combinations.</li>
                      <li>Observed triplets in sample: 10 combinations; combinatorial voids: 25 combinations.</li>
                      <li>Exact unranked set equality: triplet <KaTeXMath math="t = \{f_a, f_b, f_c\}" /> matches regardless of order.</li>
                      <li>Within-budget percentage: <KaTeXMath math="P(t \mid p) = \frac{C(p, t)}{N(p)} \times 100\%" />.</li>
                      <li>Conservation law: <KaTeXMath math="\sum_{t \in C(7,3)} P(t \mid p) = 100.0\%" /> for each populated budget segment.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Comparison Matrix */}
            <Card className="border-slate-200/90 shadow-card">
              <CardHeader
                title="Experiment Comparison Matrix"
                subtitle="Methodological and computational properties of Experiments 1 and 2"
              />
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Experiment 1 (Brand–Feature)</th>
                        <th className="px-4 py-3">Experiment 2 (Budget–Combinations)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Analytical Entity</td>
                        <td className="px-4 py-3">Individual canonical features (<KaTeXMath math="f \in F, |F|=7" />)</td>
                        <td className="px-4 py-3">3-feature subsets / triplets (<KaTeXMath math="t \in \mathcal{P}_3(F), |\mathcal{P}_3(F)|=35" />)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Primary Denominator</td>
                        <td className="px-4 py-3 font-mono text-cobalt-600 font-bold">N(b) (Brand cohort size)</td>
                        <td className="px-4 py-3 font-mono text-lime-600 font-bold">N(p) (Budget segment size)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Sum Conservation Law</td>
                        <td className="px-4 py-3 font-mono">Σ P(f | b) = 300.0% (3 features / student)</td>
                        <td className="px-4 py-3 font-mono">Σ P(t | p) = 100.0% (1 triplet / student)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Theoretical vs Observed</td>
                        <td className="px-4 py-3">All 7 features observed in cohort</td>
                        <td className="px-4 py-3">35 theoretical, 10 observed, 25 combinatorial voids</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Set-Theoretic Foundation</td>
                        <td className="px-4 py-3 font-mono">|S_b ∩ S_f|</td>
                        <td className="px-4 py-3 font-mono">|&#123;id | budget = p ∧ features = t&#125;|</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Interpretation Boundary</td>
                        <td className="px-4 py-3 text-slate-500">Descriptive co-selection; no brand loyalty causality</td>
                        <td className="px-4 py-3 text-slate-500">Empirical concentration; no pricing elasticity causality</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Respondent Inspector Modal */}
      {inspectorModal && (
        <RespondentInspectorModal
          title={inspectorModal.title}
          subtitle={inspectorModal.subtitle}
          matchingIds={inspectorModal.matchingIds}
          allResponses={responses}
          onClose={() => setInspectorModal(null)}
        />
      )}
    </div>
  );
}
```

---


---

## 3. Regression & Verification Artifacts

### Test Suite Results
- **Vitest Unit Tests:** 9 test files, **117 / 117 tests passing (100% pass rate)**.
  - `src/__tests__/brand_feature_experiment.test.ts`: **10 / 10 tests passing**.
  - `src/__tests__/budget_combination_experiment.test.ts`: **6 / 6 tests passing**.
  - `src/__tests__/combinations.test.ts`: **26 / 26 tests passing**.
  - `src/__tests__/matching_engine.test.ts`: **16 / 16 tests passing**.
  - `src/__tests__/sets.test.ts`: **17 / 17 tests passing**.
  - `src/__tests__/venn.test.ts`: **15 / 15 tests passing**.
  - `src/__tests__/combination_analytics.test.ts`: **11 / 11 tests passing**.
  - `src/__tests__/inclusion_exclusion.test.ts`: **6 / 6 tests passing**.
  - `src/__tests__/survey.schema.test.ts`: **10 / 10 tests passing**.
- **Python Pipeline Tests:** 7 tests in `pipeline/test_pipeline.py` passing (100% pass rate).
- **TypeScript Typecheck:** `npm run typecheck` exited with code 0 (zero errors).
- **ESLint Validation:** `npm run lint` exited with 0 warnings, 0 errors.
- **Production Build:** `npm run build` succeeded; all 9 static routes prerendered.

### Updated Screenshot Evidence
- `desktop_experiment_studio_overview.png`: Full desktop overview with all 7 features, brand-grouped chart, and 300% expected sum badge.
- `desktop_experiment_studio_filtered.png`: Desktop view showing dynamic percentage sum (`100.0% – 200.0% (3/7 Features; Dynamic Sum)`), `Displayed % Sum` column in heatmap, and filtered brand-grouped chart.
- `desktop_experiment_studio_chart.png`: Focused view of the redesigned grouped bar chart with brands on the X-axis and features in the legend.
- `desktop_experiment_studio_modal.png`: Drilldown modal showing anonymous respondent records.
- `mobile_experiment_studio_overview.png`: Responsive mobile view on 390px viewport.
