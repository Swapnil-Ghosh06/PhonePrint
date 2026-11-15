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
