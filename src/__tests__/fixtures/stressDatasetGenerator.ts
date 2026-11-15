/**
 * Deterministic Synthetic Stress-Test Dataset Generator
 *
 * Exclusively for test environment performance evaluation and mathematical stress testing.
 * NEVER activated as real survey data. NEVER merged into application data fixtures.
 */

import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
  type SurveyResponse,
  type SurveyDataset,
  type SmartphoneBrand,
  type BudgetRange,
  type SmartphoneFeature,
  type PrimaryUse,
  type OSPreference,
} from "@/types/survey";

/**
 * Generates a deterministic list of N valid SurveyResponse objects.
 * Uses index-based modular arithmetic to guarantee reproducible feature distributions.
 */
export function generateStressTestResponses(count: number): SurveyResponse[] {
  const responses: SurveyResponse[] = [];

  for (let i = 0; i < count; i++) {
    const id = `STRESS_RESP_${String(i + 1).padStart(count >= 1000 ? 4 : 3, "0")}`;

    // Deterministic distribution across canonical enums
    const brand = SMARTPHONE_BRANDS[i % SMARTPHONE_BRANDS.length] as SmartphoneBrand;
    const budget = BUDGET_RANGES[i % BUDGET_RANGES.length] as BudgetRange;
    const primaryUse = PRIMARY_USES[i % PRIMARY_USES.length] as PrimaryUse;
    const osPref = OS_PREFERENCES[i % OS_PREFERENCES.length] as OSPreference;

    // Pick 3 distinct features deterministically
    const f1Idx = i % 7;
    const f2Idx = (i + 1 + Math.floor(i / 7)) % 7;
    const offset = 1 + (i % 5);
    const f3Idx = (i + 1 + offset) % 7;

    const chosenIndices = new Set<number>([f1Idx]);
    if (!chosenIndices.has(f2Idx)) {
      chosenIndices.add(f2Idx);
    } else {
      chosenIndices.add((f2Idx + 1) % 7);
    }

    let third = f3Idx;
    while (chosenIndices.has(third)) {
      third = (third + 1) % 7;
    }
    chosenIndices.add(third);

    const distinctIndices = Array.from(chosenIndices);
    const preferredFeatures: [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature] = [
      SMARTPHONE_FEATURES[distinctIndices[0]!]!,
      SMARTPHONE_FEATURES[distinctIndices[1]!]!,
      SMARTPHONE_FEATURES[distinctIndices[2]!]!,
    ];

    responses.push({
      response_id: id,
      preferred_brand: brand,
      budget_range: budget,
      preferred_features: preferredFeatures,
      primary_use: primaryUse,
      os_preference: osPref,
    });
  }

  return responses;
}

/**
 * Wraps responses into a valid SurveyDataset object.
 */
export function generateStressTestDataset(count: number): SurveyDataset {
  const responses = generateStressTestResponses(count);
  return {
    metadata: {
      version: "1.0.0-stress-test",
      generated_at: new Date().toISOString(),
      total_responses: responses.length,
      is_demo: false, // Tagged for stress-test inspection
      description: `Synthetic stress-test cohort with N=${count} respondents for scalability benchmarking.`,
    },
    responses,
  };
}
