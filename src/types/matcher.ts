/**
 * PhonePrint - Preference Matching and Profiling Data Models
 * Developed for University Discrete Mathematics & Graph Theory Experiential Learning.
 */

import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "./survey";

/**
 * User-selected preference profile vector.
 */
export interface UserProfileInput {
  readonly brand: SmartphoneBrand;
  readonly budget: BudgetRange;
  readonly features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
}

/**
 * Subset result containing matching IDs, count, and cohort percentage.
 */
export interface ConditionSubsetResult {
  readonly ids: Set<string>;
  readonly count: number;
  readonly percentage: number; // (count / totalCohort) * 100
}

/**
 * Mutually exclusive 4-way match category.
 */
export type MatchCategory = "exact_3" | "partial_2" | "partial_1" | "none_0";

/**
 * Anonymous survey respondent record annotated with preference match criteria.
 */
export interface RespondentMatchRecord {
  readonly response_id: string;
  readonly preferred_brand: SmartphoneBrand;
  readonly budget_range: BudgetRange;
  readonly preferred_features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  readonly brandMatch: boolean;
  readonly budgetMatch: boolean;
  readonly featureMatch: boolean; // true if all 3 features match
  readonly featureOverlapCount: number; // 0, 1, 2, or 3
  readonly matchedConditionsCount: number; // 0, 1, 2, or 3
  readonly matchCategory: MatchCategory;
  readonly matchedConditionsList: readonly ("Brand" | "Budget" | "Features")[];
}

/**
 * Independent feature overlap distribution summary.
 */
export interface FeatureOverlapSummary {
  readonly matchAllThree: ConditionSubsetResult; // overlap == 3
  readonly matchTwo: ConditionSubsetResult; // overlap == 2
  readonly matchOne: ConditionSubsetResult; // overlap == 1
  readonly matchNone: ConditionSubsetResult; // overlap == 0
  readonly atLeastTwo: ConditionSubsetResult; // overlap >= 2
  readonly atLeastOne: ConditionSubsetResult; // overlap >= 1
}

/**
 * Complete result output of the preference matching engine.
 */
export interface MatchEngineResult {
  readonly profile: UserProfileInput;
  readonly totalCohort: number;
  readonly brandSet: Set<string>; // B
  readonly budgetSet: Set<string>; // P
  readonly featureSet: Set<string>; // F (exact feature triplet)

  // Exact matches: B ∩ P ∩ F
  readonly exactMatches: ConditionSubsetResult;

  // Mutually exclusive 4-way categorization
  readonly category3Exact: ConditionSubsetResult;
  readonly category2Partial: {
    readonly total: ConditionSubsetResult;
    readonly brandAndBudget: ConditionSubsetResult;
    readonly brandAndFeature: ConditionSubsetResult;
    readonly budgetAndFeature: ConditionSubsetResult;
  };
  readonly category1Partial: {
    readonly total: ConditionSubsetResult;
    readonly onlyBrand: ConditionSubsetResult;
    readonly onlyBudget: ConditionSubsetResult;
    readonly onlyFeature: ConditionSubsetResult;
  };
  readonly category0None: ConditionSubsetResult;

  // Independent feature overlap analysis
  readonly featureOverlap: FeatureOverlapSummary;

  // Full respondent-level annotations
  readonly respondents: readonly RespondentMatchRecord[];
}
