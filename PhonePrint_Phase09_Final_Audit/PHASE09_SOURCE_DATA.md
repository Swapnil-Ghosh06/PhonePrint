# PhonePrint Phase 09 — Complete Data Layer Source Code Bundle

Complete unabridged source code for data schemas, dataset configuration, TypeScript types, and loader utilities.

---


## File: `src/data/dataset_config.json` (**MODIFIED IN PHASE 09**)

> **Notes**: Active dataset configuration pointing to demo mode with total_responses: 300 and SIMULATED CAMPUS DATA — N=300.

```json
{
  "active_dataset": "demo",
  "is_demo": true,
  "total_responses": 300,
  "last_updated": "2026-11-08T14:46:28.204633+00:00",
  "demo_file": "survey_demo_data.json",
  "real_file": "survey_active_data.json",
  "notes": "SIMULATED CAMPUS DATA — N=300"
}

```


## File: `src/schemas/survey.schema.ts` (**UNCHANGED**)

> **Notes**: Zod schemas validating survey response structure, 7 brands, 4 budgets, and exactly 3 distinct features.

```typescript
import { z } from "zod";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
  type SmartphoneFeature,
} from "@/types/survey";

/**
 * Zod schema for individual smartphone brand enum.
 */
export const smartphoneBrandSchema = z.enum(SMARTPHONE_BRANDS);

/**
 * Zod schema for budget range categories.
 */
export const budgetRangeSchema = z.enum(BUDGET_RANGES);

/**
 * Zod schema for individual smartphone features.
 */
export const smartphoneFeatureSchema = z.enum(SMARTPHONE_FEATURES);

/**
 * Zod schema for primary usage classification.
 */
export const primaryUseSchema = z.enum(PRIMARY_USES);

/**
 * Zod schema for operating system preference.
 */
export const osPreferenceSchema = z.enum(OS_PREFERENCES);

/**
 * Zod schema for a single anonymous survey response.
 * Enforces exactly three distinct feature selections.
 */
export const surveyResponseSchema = z.object({
  response_id: z
    .string()
    .min(1, "Respondent ID cannot be empty")
    .regex(/^[A-Za-z0-9_-]+$/, "Respondent ID must contain only alphanumeric characters, dashes, or underscores"),
  preferred_brand: smartphoneBrandSchema,
  budget_range: budgetRangeSchema,
  preferred_features: z
    .array(smartphoneFeatureSchema)
    .length(3, "Respondent must select exactly 3 preferred features")
    .refine(
      (features) => new Set(features).size === 3,
      "Feature selections must contain exactly 3 distinct features"
    )
    .transform((features) => features as unknown as [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature]),
  primary_use: primaryUseSchema,
  os_preference: osPreferenceSchema,
});

/**
 * Zod schema for an array of survey responses.
 * Enforces global uniqueness of respondent IDs across the entire dataset.
 */
export const surveyResponseListSchema = z
  .array(surveyResponseSchema)
  .superRefine((responses, ctx) => {
    const seenIds = new Set<string>();
    const duplicateIds = new Set<string>();

    responses.forEach((resp, index) => {
      if (seenIds.has(resp.response_id)) {
        duplicateIds.add(resp.response_id);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate respondent ID detected: "${resp.response_id}" at index ${index}`,
          path: [index, "response_id"],
        });
      } else {
        seenIds.add(resp.response_id);
      }
    });
  });

/**
 * Complete Survey Dataset container schema with metadata validation.
 */
export const surveyDatasetSchema = z.object({
  metadata: z.object({
    version: z.string().min(1),
    generated_at: z.string().min(1),
    total_responses: z.number().int().nonnegative(),
    is_demo: z.boolean(),
    description: z.string(),
  }),
  responses: surveyResponseListSchema,
}).refine(
  (data) => data.metadata.total_responses === data.responses.length,
  {
    message: "Metadata total_responses count does not match the actual number of responses",
    path: ["metadata", "total_responses"],
  }
);

```


## File: `src/types/survey.ts` (**UNCHANGED**)

> **Notes**: Canonical domain enums: SMARTPHONE_BRANDS (7), BUDGET_RANGES (4), SMARTPHONE_FEATURES (7), PRIMARY_USES, OS_PREFERENCES.

```typescript
/**
 * PhonePrint - Anonymous Smartphone Survey Data Models
 * Developed for University Discrete Mathematics & Graph Theory Experiential Learning.
 */

export const SMARTPHONE_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Motorola",
  "Other",
] as const;

export type SmartphoneBrand = (typeof SMARTPHONE_BRANDS)[number];

export const BUDGET_RANGES = [
  "Under $400",
  "$400 - $700",
  "$700 - $1,000",
  "Over $1,000",
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const SMARTPHONE_FEATURES = [
  "Camera Quality",
  "Battery Life",
  "Processing Performance",
  "Display Quality",
  "Storage Capacity",
  "Build & Design Quality",
  "Software & OS Experience",
] as const;

export type SmartphoneFeature = (typeof SMARTPHONE_FEATURES)[number];

export const PRIMARY_USES = [
  "Photography & Videography",
  "Gaming",
  "Business & Productivity",
  "Social Media & Content Consumption",
  "Everyday General Use",
] as const;

export type PrimaryUse = (typeof PRIMARY_USES)[number];

export const OS_PREFERENCES = [
  "Android",
  "iOS",
  "No Preference",
] as const;

export type OSPreference = (typeof OS_PREFERENCES)[number];

/**
 * Anonymous survey response record.
 * Represents a single respondent's preferences.
 */
export interface SurveyResponse {
  readonly response_id: string;
  readonly preferred_brand: SmartphoneBrand;
  readonly budget_range: BudgetRange;
  /**
   * Exactly three distinct feature preferences.
   */
  readonly preferred_features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  readonly primary_use: PrimaryUse;
  readonly os_preference: OSPreference;
}

/**
 * Survey Dataset container with metadata.
 */
export interface SurveyDatasetMetadata {
  readonly version: string;
  readonly generated_at: string;
  readonly total_responses: number;
  readonly is_demo: boolean;
  readonly description: string;
}

export interface SurveyDataset {
  readonly metadata: SurveyDatasetMetadata;
  readonly responses: readonly SurveyResponse[];
}

```


## File: `src/types/math.ts` (**UNCHANGED**)

> **Notes**: Mathematical models for set operations, Venn regions, and Inclusion-Exclusion theorem verifications.

```typescript
/**
 * PhonePrint - Discrete Mathematics & Graph Theory Foundations
 * Type definitions for pure set theory, combinatorics, and Venn diagrams.
 */

import type { SmartphoneFeature, BudgetRange } from "./survey";

export type ElementCollection<T> = ReadonlySet<T> | readonly T[];

/**
 * Result structure when verifying the Principle of Inclusion-Exclusion for two sets:
 * |A ∪ B| = |A| + |B| - |A ∩ B|
 */
export interface InclusionExclusionVerification<T> {
  readonly unionCardinality: number;
  readonly individualCardinalitiesSum: number;
  readonly intersectionCardinality: number;
  readonly calculatedRhs: number;
  readonly isValid: boolean;
  readonly unionSet: Set<T>;
  readonly intersectionSet: Set<T>;
}

/**
 * Result structure when verifying the Principle of Inclusion-Exclusion for three sets:
 * |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
 */
export interface ThreeSetInclusionExclusionVerification<T> {
  readonly cardA: number;
  readonly cardB: number;
  readonly cardC: number;
  readonly cardAB: number;
  readonly cardAC: number;
  readonly cardBC: number;
  readonly cardABC: number;
  readonly singletonsSum: number; // |A| + |B| + |C|
  readonly pairwiseIntersectionsSum: number; // |A ∩ B| + |A ∩ C| + |B ∩ C|
  readonly tripleIntersection: number; // |A ∩ B ∩ C|
  readonly calculatedRhs: number; // singletonsSum - pairwiseIntersectionsSum + tripleIntersection
  readonly unionCardinality: number; // |A ∪ B ∪ C|
  readonly isValid: boolean;
  readonly unionSet: Set<T>;
  readonly intersectionSetABC: Set<T>;
  readonly intersectionSetAB: Set<T>;
  readonly intersectionSetAC: Set<T>;
  readonly intersectionSetBC: Set<T>;
}

/**
 * Mutually exclusive partition of the universal set U for two sets A and B.
 */
export interface TwoSetVennRegions<T> {
  readonly onlyA: Set<T>; // A \ B
  readonly onlyB: Set<T>; // B \ A
  readonly both: Set<T>; // A ∩ B
  readonly neither: Set<T>; // U \ (A ∪ B)
  readonly unionSet: Set<T>; // A ∪ B
  readonly universeSet: Set<T>; // U
}

/**
 * Mutually exclusive partition of the universal set U for three sets A, B, and C.
 */
export interface ThreeSetVennRegions<T> {
  readonly onlyA: Set<T>; // A \ (B ∪ C)
  readonly onlyB: Set<T>; // B \ (A ∪ C)
  readonly onlyC: Set<T>; // C \ (A ∪ B)
  readonly onlyAB: Set<T>; // (A ∩ B) \ C
  readonly onlyAC: Set<T>; // (A ∩ C) \ B
  readonly onlyBC: Set<T>; // (B ∩ C) \ A
  readonly allThree: Set<T>; // A ∩ B ∩ C
  readonly outside: Set<T>; // U \ (A ∪ B ∪ C)
  readonly unionSet: Set<T>; // A ∪ B ∪ C
  readonly universeSet: Set<T>; // U
}

/**
 * Step-by-step breakdown for binomial coefficient C(n, r) calculation.
 */
export interface CombinationCalculationStep {
  readonly n: number;
  readonly r: number;
  readonly formulaLatex: string;
  readonly substitutedLatex: string;
  readonly simplifiedLatex: string;
  readonly numeratorTerms: readonly number[];
  readonly denominatorTerms: readonly number[];
  readonly numeratorProduct: number;
  readonly denominatorProduct: number;
  readonly result: number;
  readonly isSymmetricApplied: boolean;
  readonly effectiveR: number;
}

/**
 * Metadata and empirical observation metrics for a single feature triplet combination.
 */
export interface FeatureCombinationRecord {
  readonly id: string; // e.g. "COMB-01" to "COMB-35"
  readonly index: number; // 1 to 35
  readonly features: readonly [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature];
  readonly key: string; // canonical pipe-delimited key
  readonly observedCount: number;
  readonly observedPercentage: number; // (observedCount / totalCohort) * 100
  readonly isObserved: boolean;
  readonly matchingRespondentIds: readonly string[];
  readonly budgetBreakdown: Record<
    BudgetRange,
    {
      readonly count: number;
      readonly percentageWithinBudget: number; // (count / budgetCohort) * 100
    }
  >;
}

/**
 * Comprehensive analytical summary of theoretical and empirical combinations.
 */
export interface CombinationAnalyticsSummary {
  readonly totalTheoreticalCombinations: number; // C(7, 3) = 35
  readonly totalObservedCombinations: number;
  readonly totalUnobservedCombinations: number;
  readonly totalRespondents: number;
  readonly combinations: readonly FeatureCombinationRecord[];
  readonly observedCombinations: readonly FeatureCombinationRecord[];
  readonly unobservedCombinations: readonly FeatureCombinationRecord[];
  readonly mostCommonCombinations: readonly FeatureCombinationRecord[];
  readonly leastCommonObservedCombinations: readonly FeatureCombinationRecord[];
  readonly budgetCohortSizes: Record<BudgetRange, number>;
}

```


## File: `src/types/matcher.ts` (**UNCHANGED**)

> **Notes**: Data structures for user preference vectors and 4-way disjoint match classifications.

```typescript
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

```


## File: `src/types/experiment.ts` (**UNCHANGED**)

> **Notes**: Models for brand-feature cross-tabulation and budget-combination stratification.

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


## File: `src/lib/data/loader.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Dataset loader with Zod validation, returns notes and metadata for SIMULATED CAMPUS DATA — N=300.

```typescript
/**
 * PhonePrint - Data Ingestion and Set Extraction Utilities
 * Transforms survey records into discrete sets of respondent IDs for mathematical processing.
 */

import demoDataJson from "@/data/survey_demo_data.json";
import activeDataJson from "@/data/survey_active_data.json";
import datasetConfig from "@/data/dataset_config.json";
import { surveyDatasetSchema } from "@/schemas/survey.schema";
import type {
  SurveyDataset,
  SurveyResponse,
  SmartphoneBrand,
  SmartphoneFeature,
  OSPreference,
  BudgetRange,
  PrimaryUse,
} from "@/types/survey";

/**
 * Loads the currently configured active dataset (demo or real survey data).
 * If real data is active, validates it with Zod schema. If real data is invalid or empty,
 * safely falls back to the validated demo dataset.
 */
export function loadSurveyDataset(): SurveyDataset {
  if (datasetConfig.active_dataset === "real") {
    try {
      const result = surveyDatasetSchema.safeParse(activeDataJson);
      if (result.success && result.data.responses.length > 0) {
        return result.data as unknown as SurveyDataset;
      }
    } catch {
      // Fallback to demo
    }
  }
  return loadDemoSurveyDataset();
}

/**
 * Loads and validates the demo survey dataset using the Zod schema.
 * Guaranteed to return the 12-record synthetic benchmark fixture.
 */
export function loadDemoSurveyDataset(): SurveyDataset {
  const result = surveyDatasetSchema.safeParse(demoDataJson);
  if (!result.success) {
    throw new Error(
      `Demo dataset validation failed: ${result.error.issues.map((i) => i.message).join(", ")}`
    );
  }
  return result.data as unknown as SurveyDataset;
}

/**
 * Returns metadata and active badge details for UI headers and navigation.
 */
export function getActiveDatasetInfo() {
  const dataset = loadSurveyDataset();
  const isDemo = dataset.metadata.is_demo;
  const count = dataset.metadata.total_responses;

  return {
    isDemo,
    totalResponses: count,
    version: dataset.metadata.version,
    description: dataset.metadata.description,
    badgeText: isDemo ? `SIMULATED CAMPUS DATA — N=${count}` : `REAL SURVEY (n=${count})`,
    tagText: isDemo ? `[SIMULATED CAMPUS DATA: N=${count}]` : `[REAL SURVEY: N=${count}]`,
    notes: datasetConfig.notes || (isDemo ? "SIMULATED CAMPUS DATA — N=300" : "REAL SURVEY DATA"),
  };
}

/**
 * Returns a discrete set of respondent IDs preferring a specific smartphone brand:
 * S_brand = { id ∈ U | response(id).brand = brand }
 */
export function getRespondentIdsByBrand(
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
 * Returns a discrete set of respondent IDs selecting a given feature:
 * S_feature = { id ∈ U | feature ∈ response(id).preferred_features }
 */
export function getRespondentIdsByFeature(
  responses: readonly SurveyResponse[],
  feature: SmartphoneFeature
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_features.includes(feature)) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs with a given OS preference:
 * S_os = { id ∈ U | response(id).os = os }
 */
export function getRespondentIdsByOS(
  responses: readonly SurveyResponse[],
  os: OSPreference
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.os_preference === os) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs within a budget range:
 * S_budget = { id ∈ U | response(id).budget = budget }
 */
export function getRespondentIdsByBudget(
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
 * Returns a discrete set of respondent IDs with a given primary use:
 * S_use = { id ∈ U | response(id).primary_use = use }
 */
export function getRespondentIdsByPrimaryUse(
  responses: readonly SurveyResponse[],
  use: PrimaryUse
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.primary_use === use) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns the entire universe of respondent IDs: U = { id | response(id) ∈ responses }
 */
export function getUniverseRespondentIds(
  responses: readonly SurveyResponse[]
): Set<string> {
  return new Set(responses.map((r) => r.response_id));
}

```


## File: `src/lib/data/combinationAnalytics.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Groups survey responses into 35 feature triplets, tracks frequencies, and identifies voids.

```typescript
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
  const budgetCohortSizes: Record<BudgetRange, number> = {
    "Under $400": 0,
    "$400 - $700": 0,
    "$700 - $1,000": 0,
    "Over $1,000": 0,
  };

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
      const budgetBreakdown: Record<
        BudgetRange,
        { count: number; percentageWithinBudget: number }
      > = {
        "Under $400": { count: 0, percentageWithinBudget: 0 },
        "$400 - $700": { count: 0, percentageWithinBudget: 0 },
        "$700 - $1,000": { count: 0, percentageWithinBudget: 0 },
        "Over $1,000": { count: 0, percentageWithinBudget: 0 },
      };

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

```
