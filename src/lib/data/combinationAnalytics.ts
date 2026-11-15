/**
 * PhonePrint - Combinatorial Space & Empirical Frequency Analytics
 *
 * Implements theoretical combination enumeration and empirical survey analysis
 * for the C(7, 3) = 35 canonical smartphone feature space.
 */

import {
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
  type SmartphoneFeature,
  type BudgetRange,
  type SurveyResponse,
} from "@/types/survey";
import { enumerateCombinations } from "@/lib/math/combinations";
import type {
  FeatureCombinationRecord,
  CombinationAnalyticsSummary,
} from "@/types/math";

/**
 * Normalizes a 3-feature selection into canonical order based on the 7 canonical features.
 * Ensures consistent key generation and comparison regardless of input order.
 */
export function canonicalizeFeatureTriplet(
  features: readonly SmartphoneFeature[]
): [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature] {
  if (features.length !== 3) {
    throw new Error(
      `Feature triplet must contain exactly 3 features, received: ${features.length}`
    );
  }

  const sorted = [...features].sort(
    (a, b) => SMARTPHONE_FEATURES.indexOf(a) - SMARTPHONE_FEATURES.indexOf(b)
  );

  return [sorted[0]!, sorted[1]!, sorted[2]!];
}

/**
 * Generates a stable pipe-delimited string key for a combination.
 */
export function getCombinationKey(
  features: readonly SmartphoneFeature[]
): string {
  return canonicalizeFeatureTriplet(features).join("|");
}

/**
 * Analyzes the C(7, 3) = 35 theoretical feature space against empirical survey responses.
 *
 * Calculates:
 * - Complete dynamic enumeration of all 35 theoretical combinations.
 * - Exact empirical observed frequencies and full-cohort percentages.
 * - Segmentation by budget tier with strictly accurate within-budget denominators.
 * - Ranking with proper tie handling.
 * - Clear identification of unobserved theoretical voids (frequency = 0).
 *
 * @param responses - Validated survey response cohort
 * @returns Comprehensive analytical summary
 */
export function analyzeFeatureCombinations(
  responses: readonly SurveyResponse[]
): CombinationAnalyticsSummary {
  // 1. Enumerate all C(7, 3) = 35 theoretical feature triplets dynamically
  const theoreticalTriplets = enumerateCombinations(SMARTPHONE_FEATURES, 3) as [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ][];

  const totalRespondents = responses.length;

  // 2. Count respondents in each budget tier (strictly used as within-budget denominators)
  const budgetCohortSizes = {} as Record<BudgetRange, number>;
  for (const range of BUDGET_RANGES) {
    budgetCohortSizes[range] = 0;
  }

  for (const resp of responses) {
    if (resp.budget_range in budgetCohortSizes) {
      budgetCohortSizes[resp.budget_range]++;
    }
  }

  // 3. Map respondents by their canonical combination key
  const responsesByKey = new Map<string, SurveyResponse[]>();
  for (const resp of responses) {
    const key = getCombinationKey(resp.preferred_features);
    const existing = responsesByKey.get(key);
    if (existing) {
      existing.push(resp);
    } else {
      responsesByKey.set(key, [resp]);
    }
  }

  // 4. Construct combination records for all 35 theoretical combinations
  const combinations: FeatureCombinationRecord[] = theoreticalTriplets.map(
    (triplet, index) => {
      const canonicalTriplet = canonicalizeFeatureTriplet(triplet);
      const key = getCombinationKey(canonicalTriplet);
      const matching = responsesByKey.get(key) ?? [];
      const observedCount = matching.length;
      const isObserved = observedCount > 0;
      const observedPercentage =
        totalRespondents > 0
          ? Number(((observedCount / totalRespondents) * 100).toFixed(2))
          : 0;

      // Calculate budget breakdown with guarded denominators
      const budgetBreakdown = {} as Record<
        BudgetRange,
        { count: number; percentageWithinBudget: number }
      >;

      for (const range of BUDGET_RANGES) {
        const count = matching.filter((r) => r.budget_range === range).length;
        const tierCohort = budgetCohortSizes[range];
        const percentageWithinBudget =
          tierCohort > 0
            ? Number(((count / tierCohort) * 100).toFixed(2))
            : 0;

        budgetBreakdown[range] = {
          count,
          percentageWithinBudget,
        };
      }

      return {
        id: `COMB-${String(index + 1).padStart(2, "0")}`,
        index: index + 1,
        features: canonicalTriplet,
        key,
        observedCount,
        observedPercentage,
        isObserved,
        matchingRespondentIds: matching.map((r) => r.response_id),
        budgetBreakdown,
      };
    }
  );

  // 5. Partition into observed and unobserved
  const observedCombinations = combinations
    .filter((c) => c.isObserved)
    .sort((a, b) => b.observedCount - a.observedCount);

  const unobservedCombinations = combinations.filter((c) => !c.isObserved);

  // 6. Compute rankings with proper tie handling
  let mostCommonCombinations: FeatureCombinationRecord[] = [];
  let leastCommonObservedCombinations: FeatureCombinationRecord[] = [];

  if (observedCombinations.length > 0) {
    const maxCount = observedCombinations[0]!.observedCount;
    mostCommonCombinations = observedCombinations.filter(
      (c) => c.observedCount === maxCount
    );

    const minCount =
      observedCombinations[observedCombinations.length - 1]!.observedCount;
    leastCommonObservedCombinations = observedCombinations.filter(
      (c) => c.observedCount === minCount
    );
  }

  return {
    totalTheoreticalCombinations: combinations.length, // Exactly 35
    totalObservedCombinations: observedCombinations.length,
    totalUnobservedCombinations: unobservedCombinations.length,
    totalRespondents,
    combinations,
    observedCombinations,
    unobservedCombinations,
    mostCommonCombinations,
    leastCommonObservedCombinations,
    budgetCohortSizes,
  };
}
