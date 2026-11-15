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
