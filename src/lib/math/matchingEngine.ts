/**
 * PhonePrint - Preference Matching Engine
 *
 * Implements discrete set-theoretic exact and partial matching algorithms.
 * All computations operate directly on respondent ID sets to preserve academic fidelity.
 */

import {
  multiSetIntersection,
} from "./sets";
import type {
  SurveyResponse,
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "@/types/survey";
import type {
  UserProfileInput,
  MatchEngineResult,
  RespondentMatchRecord,
  ConditionSubsetResult,
  FeatureOverlapSummary,
  MatchCategory,
} from "@/types/matcher";

/**
 * Creates a ConditionSubsetResult helper with safe percentage computation.
 */
function createSubsetResult(
  ids: Set<string>,
  totalCohort: number
): ConditionSubsetResult {
  const count = ids.size;
  const percentage =
    totalCohort > 0 ? Number(((count / totalCohort) * 100).toFixed(2)) : 0;
  return { ids, count, percentage };
}

/**
 * Builds discrete set of respondent IDs matching a preferred smartphone brand:
 * B = { id ∈ U | response(id).brand = brand }
 */
export function buildBrandSet(
  responses: readonly SurveyResponse[],
  brand: SmartphoneBrand
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_brand === brand) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Builds discrete set of respondent IDs matching a budget range:
 * P = { id ∈ U | response(id).budget = budget }
 */
export function buildBudgetSet(
  responses: readonly SurveyResponse[],
  budget: BudgetRange
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.budget_range === budget) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Builds discrete set of respondent IDs matching all three chosen features:
 * F = { id ∈ U | {f1, f2, f3} ⊆ response(id).preferred_features }
 *
 * Because each survey respondent selects exactly three features, matching all three
 * selected features is equivalent to an exact set equality of the feature triplets.
 */
export function buildExactFeatureSet(
  responses: readonly SurveyResponse[],
  features: readonly [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature]
): Set<string> {
  const [f1, f2, f3] = features;
  const result = new Set<string>();
  for (const resp of responses) {
    const pf = resp.preferred_features;
    if (pf.includes(f1) && pf.includes(f2) && pf.includes(f3)) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Calculates the number of features overlapping between a user's selection and a respondent's selection:
 * overlap = | F_user ∩ F_respondent | ∈ {0, 1, 2, 3}
 */
export function calculateFeatureOverlap(
  userFeatures: readonly SmartphoneFeature[],
  respondentFeatures: readonly SmartphoneFeature[]
): number {
  let count = 0;
  for (const f of userFeatures) {
    if (respondentFeatures.includes(f)) {
      count++;
    }
  }
  return count;
}

/**
 * Computes exact matches via three-way set intersection:
 * ExactMatches = B ∩ P ∩ F
 */
export function computeExactMatches(
  bSet: Set<string>,
  pSet: Set<string>,
  fSet: Set<string>
): Set<string> {
  return multiSetIntersection(bSet, pSet, fSet);
}

/**
 * Executes the complete preference matching engine against a survey cohort.
 *
 * Evaluates:
 * 1. Brand set B, Budget set P, Exact feature triplet set F.
 * 2. Exact matches B ∩ P ∩ F.
 * 3. Mutually exclusive 4-way classification (3/3, 2/3, 1/3, 0/3).
 * 4. Independent feature overlap analysis (3, ≥2, ≥1, 0).
 * 5. Full respondent-level record generation.
 *
 * @param responses - Validated survey response cohort
 * @param profile - User-selected preference vector
 * @returns Complete MatchEngineResult
 */
export function executeMatchingEngine(
  responses: readonly SurveyResponse[],
  profile: UserProfileInput
): MatchEngineResult {
  const totalCohort = responses.length;

  // 1. Build discrete sets for the three core conditions
  const brandSet = buildBrandSet(responses, profile.brand);
  const budgetSet = buildBudgetSet(responses, profile.budget);
  const featureSet = buildExactFeatureSet(responses, profile.features);

  // 2. Exact Matches: B ∩ P ∩ F
  const exactMatchesSet = computeExactMatches(brandSet, budgetSet, featureSet);

  // Sets for mutually exclusive categories
  const cat3ExactSet = new Set<string>();

  const cat2BrandAndBudgetSet = new Set<string>();
  const cat2BrandAndFeatureSet = new Set<string>();
  const cat2BudgetAndFeatureSet = new Set<string>();
  const cat2TotalSet = new Set<string>();

  const cat1OnlyBrandSet = new Set<string>();
  const cat1OnlyBudgetSet = new Set<string>();
  const cat1OnlyFeatureSet = new Set<string>();
  const cat1TotalSet = new Set<string>();

  const cat0NoneSet = new Set<string>();

  // Feature overlap sets (independent of brand and budget)
  const overlapAllThreeSet = new Set<string>();
  const overlapTwoSet = new Set<string>();
  const overlapOneSet = new Set<string>();
  const overlapNoneSet = new Set<string>();
  const overlapAtLeastTwoSet = new Set<string>();
  const overlapAtLeastOneSet = new Set<string>();

  const respondents: RespondentMatchRecord[] = [];

  // 3. Evaluate each respondent individually
  for (const resp of responses) {
    const id = resp.response_id;
    const brandMatch = brandSet.has(id);
    const budgetMatch = budgetSet.has(id);
    const featureMatch = featureSet.has(id);

    const featureOverlapCount = calculateFeatureOverlap(
      profile.features,
      resp.preferred_features
    );

    // Feature overlap grouping
    if (featureOverlapCount === 3) {
      overlapAllThreeSet.add(id);
      overlapAtLeastTwoSet.add(id);
      overlapAtLeastOneSet.add(id);
    } else if (featureOverlapCount === 2) {
      overlapTwoSet.add(id);
      overlapAtLeastTwoSet.add(id);
      overlapAtLeastOneSet.add(id);
    } else if (featureOverlapCount === 1) {
      overlapOneSet.add(id);
      overlapAtLeastOneSet.add(id);
    } else {
      overlapNoneSet.add(id);
    }

    const matchedConditionsList: ("Brand" | "Budget" | "Features")[] = [];
    if (brandMatch) matchedConditionsList.push("Brand");
    if (budgetMatch) matchedConditionsList.push("Budget");
    if (featureMatch) matchedConditionsList.push("Features");

    const matchedConditionsCount = matchedConditionsList.length;
    let matchCategory: MatchCategory;

    // Mutually exclusive partitioning
    if (matchedConditionsCount === 3) {
      matchCategory = "exact_3";
      cat3ExactSet.add(id);
    } else if (matchedConditionsCount === 2) {
      matchCategory = "partial_2";
      cat2TotalSet.add(id);
      if (brandMatch && budgetMatch) {
        cat2BrandAndBudgetSet.add(id);
      } else if (brandMatch && featureMatch) {
        cat2BrandAndFeatureSet.add(id);
      } else if (budgetMatch && featureMatch) {
        cat2BudgetAndFeatureSet.add(id);
      }
    } else if (matchedConditionsCount === 1) {
      matchCategory = "partial_1";
      cat1TotalSet.add(id);
      if (brandMatch) {
        cat1OnlyBrandSet.add(id);
      } else if (budgetMatch) {
        cat1OnlyBudgetSet.add(id);
      } else if (featureMatch) {
        cat1OnlyFeatureSet.add(id);
      }
    } else {
      matchCategory = "none_0";
      cat0NoneSet.add(id);
    }

    respondents.push({
      response_id: id,
      preferred_brand: resp.preferred_brand,
      budget_range: resp.budget_range,
      preferred_features: resp.preferred_features,
      brandMatch,
      budgetMatch,
      featureMatch,
      featureOverlapCount,
      matchedConditionsCount,
      matchCategory,
      matchedConditionsList,
    });
  }

  // Feature overlap summary
  const featureOverlap: FeatureOverlapSummary = {
    matchAllThree: createSubsetResult(overlapAllThreeSet, totalCohort),
    matchTwo: createSubsetResult(overlapTwoSet, totalCohort),
    matchOne: createSubsetResult(overlapOneSet, totalCohort),
    matchNone: createSubsetResult(overlapNoneSet, totalCohort),
    atLeastTwo: createSubsetResult(overlapAtLeastTwoSet, totalCohort),
    atLeastOne: createSubsetResult(overlapAtLeastOneSet, totalCohort),
  };

  return {
    profile,
    totalCohort,
    brandSet,
    budgetSet,
    featureSet,
    exactMatches: createSubsetResult(exactMatchesSet, totalCohort),
    category3Exact: createSubsetResult(cat3ExactSet, totalCohort),
    category2Partial: {
      total: createSubsetResult(cat2TotalSet, totalCohort),
      brandAndBudget: createSubsetResult(cat2BrandAndBudgetSet, totalCohort),
      brandAndFeature: createSubsetResult(cat2BrandAndFeatureSet, totalCohort),
      budgetAndFeature: createSubsetResult(cat2BudgetAndFeatureSet, totalCohort),
    },
    category1Partial: {
      total: createSubsetResult(cat1TotalSet, totalCohort),
      onlyBrand: createSubsetResult(cat1OnlyBrandSet, totalCohort),
      onlyBudget: createSubsetResult(cat1OnlyBudgetSet, totalCohort),
      onlyFeature: createSubsetResult(cat1OnlyFeatureSet, totalCohort),
    },
    category0None: createSubsetResult(cat0NoneSet, totalCohort),
    featureOverlap,
    respondents,
  };
}
