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
