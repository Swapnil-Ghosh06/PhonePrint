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
