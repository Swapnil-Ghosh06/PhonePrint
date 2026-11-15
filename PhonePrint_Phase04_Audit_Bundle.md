# PhonePrint — Phase 04 Source Code Audit Bundle

This document contains the complete, unabridged plaintext source code of all mathematical functions, data analytics engines, UI components, tests, and pages created or updated for **PhonePrint Phase 04: Interactive Combinatorics Laboratory (ComboLab)**.

All code is provided for independent technical review.

---

## File 1: `src/lib/math/combinations.ts`

**Description**: Pure Combinatorial Functions (nCr, nPr, Factorials, Step Breakdown, Permutations Generator)

```typescript
/**
 * PhonePrint - Discrete Mathematics Foundation
 * Combinatorics & Combinations Utilities
 *
 * Implements pure functions for calculating nCr (binomial coefficients)
 * and enumerating combinations of feature subsets.
 */

import type { CombinationCalculationStep } from "@/types/math";

/**
 * Validates whether a value is a finite integer.
 */
function isInteger(value: number): boolean {
  return Number.isFinite(value) && Math.floor(value) === value;
}

/**
 * Computes the binomial coefficient: nCr = n! / (r! * (n - r)!)
 *
 * Employs an iterative multiplicative algorithm to prevent intermediate
 * factorial overflow and maximize numeric precision.
 *
 * @param n - Total number of items in the set (n >= 0)
 * @param r - Number of items chosen (0 <= r <= n)
 * @returns The number of distinct combinations
 * @throws {TypeError} If n or r is not an integer
 * @throws {RangeError} If n < 0, r < 0, or r > n
 */
export function calculateCombinations(n: number, r: number): number {
  if (!isInteger(n)) {
    throw new TypeError(`Parameter n must be an integer, received: ${n}`);
  }
  if (!isInteger(r)) {
    throw new TypeError(`Parameter r must be an integer, received: ${r}`);
  }
  if (n < 0) {
    throw new RangeError(`Total items n cannot be negative, received: ${n}`);
  }
  if (r < 0) {
    throw new RangeError(`Chosen items r cannot be negative, received: ${r}`);
  }
  if (r > n) {
    throw new RangeError(`Chosen items r (${r}) cannot exceed total items n (${n})`);
  }

  // Base cases
  if (r === 0 || r === n) {
    return 1;
  }

  // Symmetry optimization: C(n, r) == C(n, n - r)
  const k = r > n - r ? n - r : r;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - k + i)) / i;
  }

  return Math.round(result);
}

/**
 * Computes permutations: nPr = n! / (n - r)!
 *
 * @param n - Total number of items
 * @param r - Number of items chosen
 * @returns The number of ordered arrangements
 */
export function calculatePermutations(n: number, r: number): number {
  if (!isInteger(n) || !isInteger(r)) {
    throw new TypeError(`Both n and r must be integers`);
  }
  if (n < 0 || r < 0) {
    throw new RangeError(`Both n and r must be non-negative`);
  }
  if (r > n) {
    throw new RangeError(`Chosen items r cannot exceed total items n`);
  }

  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= n - i;
  }
  return result;
}

/**
 * Enumerates all subsets of size r from a collection of items (k-combinations).
 *
 * @param items - Array of distinct elements
 * @param r - Size of combinations to generate (0 <= r <= items.length)
 * @returns Array of arrays, each representing a distinct r-combination
 * @throws {TypeError} If r is not an integer
 * @throws {RangeError} If r < 0 or r > items.length
 */
export function enumerateCombinations<T>(
  items: readonly T[],
  r: number
): T[][] {
  if (!isInteger(r)) {
    throw new TypeError(`Combination size r must be an integer, received: ${r}`);
  }
  if (r < 0) {
    throw new RangeError(`Combination size r cannot be negative, received: ${r}`);
  }
  if (r > items.length) {
    throw new RangeError(
      `Combination size r (${r}) cannot exceed collection size (${items.length})`
    );
  }

  if (r === 0) {
    return [[]];
  }

  if (r === items.length) {
    return [[...items]];
  }

  const combinations: T[][] = [];
  const current: T[] = [];

  function backtrack(startIdx: number, depth: number): void {
    if (depth === r) {
      combinations.push([...current]);
      return;
    }

    const needed = r - depth;
    const available = items.length - startIdx;
    if (available < needed) {
      return; // Prune branch if insufficient remaining elements
    }

    for (let i = startIdx; i <= items.length - needed; i++) {
      const item = items[i];
      if (item !== undefined) {
        current.push(item);
        backtrack(i + 1, depth + 1);
        current.pop();
      }
    }
  }

  backtrack(0, 0);
  return combinations;
}

/**
 * Computes the factorial of a non-negative integer n: n! = n * (n - 1) * ... * 1.
 * Special case: 0! = 1.
 *
 * @param n - Non-negative integer (0 <= n <= 18 to guarantee exact representation within JavaScript Number.MAX_SAFE_INTEGER)
 * @returns The factorial value
 * @throws {TypeError} If n is not an integer
 * @throws {RangeError} If n < 0 or n > 18
 */
export function factorial(n: number): number {
  if (!isInteger(n)) {
    throw new TypeError(`Parameter n must be an integer, received: ${n}`);
  }
  if (n < 0) {
    throw new RangeError(`Factorial parameter n cannot be negative, received: ${n}`);
  }
  if (n > 18) {
    throw new RangeError(
      `Factorial parameter n (${n}) exceeds maximum safe integer calculation limit (18)`
    );
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Generates all n! ordered permutations of a given array of distinct items.
 *
 * @param items - Array of distinct items
 * @returns Array of permutations, each an array of length items.length
 * @throws {RangeError} If items.length > 8 (to avoid memory explosion, e.g. 9! = 362,880)
 */
export function generatePermutations<T>(items: readonly T[]): T[][] {
  if (items.length > 8) {
    throw new RangeError(
      `Permutation generation capped at 8 items to prevent memory exhaustion, received: ${items.length}`
    );
  }
  if (items.length === 0) {
    return [[]];
  }
  if (items.length === 1) {
    return [[items[0]!]];
  }

  const results: T[][] = [];
  const used = new Array(items.length).fill(false);
  const current: T[] = [];

  function permute(depth: number): void {
    if (depth === items.length) {
      results.push([...current]);
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (!used[i]) {
        used[i] = true;
        current.push(items[i]!);
        permute(depth + 1);
        current.pop();
        used[i] = false;
      }
    }
  }

  permute(0);
  return results;
}

/**
 * Returns a detailed step-by-step mathematical breakdown of the C(n, r) calculation.
 *
 * Formula: C(n, r) = n! / (r! * (n - r)!)
 *
 * @param n - Total available items
 * @param r - Chosen items
 * @returns Step-by-step arithmetic data structure with KaTeX strings
 */
export function getCombinationCalculationSteps(
  n: number,
  r: number
): CombinationCalculationStep {
  // calculateCombinations will validate n and r
  const result = calculateCombinations(n, r);

  const formulaLatex = `C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}`;

  if (r === 0) {
    return {
      n,
      r,
      formulaLatex,
      substitutedLatex: `C(${n}, 0) = \\frac{${n}!}{0!(${n} - 0)!} = \\frac{${n}!}{1 \\times ${n}!}`,
      simplifiedLatex: `\\frac{1}{1} = 1`,
      numeratorTerms: [1],
      denominatorTerms: [1],
      numeratorProduct: 1,
      denominatorProduct: 1,
      result: 1,
      isSymmetricApplied: false,
      effectiveR: 0,
    };
  }

  if (r === n) {
    return {
      n,
      r,
      formulaLatex,
      substitutedLatex: `C(${n}, ${n}) = \\frac{${n}!}{${n}!(${n} - ${n})!} = \\frac{${n}!}{${n}! \\times 0!}`,
      simplifiedLatex: `\\frac{1}{1} = 1`,
      numeratorTerms: [1],
      denominatorTerms: [1],
      numeratorProduct: 1,
      denominatorProduct: 1,
      result: 1,
      isSymmetricApplied: false,
      effectiveR: n,
    };
  }

  const isSymmetricApplied = r > n - r;
  const effectiveR = isSymmetricApplied ? n - r : r;

  // Numerator terms: (n), (n - 1), ..., (n - effectiveR + 1)
  const numeratorTerms: number[] = [];
  for (let i = 0; i < effectiveR; i++) {
    numeratorTerms.push(n - i);
  }

  // Denominator terms: (effectiveR), (effectiveR - 1), ..., 1
  const denominatorTerms: number[] = [];
  for (let i = effectiveR; i >= 1; i--) {
    denominatorTerms.push(i);
  }

  const numeratorProduct = numeratorTerms.reduce((acc, val) => acc * val, 1);
  const denominatorProduct = denominatorTerms.reduce((acc, val) => acc * val, 1);

  const substitutedLatex = isSymmetricApplied
    ? `C(${n}, ${r}) = C(${n}, ${effectiveR}) = \\frac{${n}!}{${effectiveR}!(${n} - ${effectiveR})!} = \\frac{${n}!}{${effectiveR}! \\times ${n - effectiveR}!}`
    : `C(${n}, ${r}) = \\frac{${n}!}{${r}!(${n} - ${r})!} = \\frac{${n}!}{${r}! \\times ${n - r}!}`;

  const numStr = numeratorTerms.join(" \\times ");
  const denStr = denominatorTerms.join(" \\times ");
  const simplifiedLatex = `\\frac{${numStr}}{${denStr}} = \\frac{${numeratorProduct}}{${denominatorProduct}} = ${result}`;

  return {
    n,
    r,
    formulaLatex,
    substitutedLatex,
    simplifiedLatex,
    numeratorTerms,
    denominatorTerms,
    numeratorProduct,
    denominatorProduct,
    result,
    isSymmetricApplied,
    effectiveR,
  };
}

```

## File 2: `src/lib/data/combinationAnalytics.ts`

**Description**: Feature Combination Space Enumeration and Empirical Survey Frequency Analysis

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

## File 3: `src/types/math.ts`

**Description**: Mathematical Types for Combinatorics and Analytics Records

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

## File 4: `src/components/combolab/CombinationCalculator.tsx`

**Description**: Interactive nCr Calculator with Real-time Simplification and Presets

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import {
  calculateCombinations,
  getCombinationCalculationSteps,
} from "@/lib/math/combinations";

interface PresetConfig {
  label: string;
  n: number;
  r: number;
  description: string;
}

const PRESETS: PresetConfig[] = [
  {
    label: "PhonePrint Triplet Space",
    n: 7,
    r: 3,
    description: "C(7, 3) = 35 canonical feature combinations",
  },
  {
    label: "Symmetric Pair C(7, 4)",
    n: 7,
    r: 4,
    description: "C(7, 4) = C(7, 3) = 35 by symmetry",
  },
  {
    label: "Pairwise Feature Overlap",
    n: 7,
    r: 2,
    description: "C(7, 2) = 21 pairwise feature interactions",
  },
  {
    label: "Top 5 Features Subspace",
    n: 5,
    r: 3,
    description: "C(5, 3) = 10 feature triplets among top 5 features",
  },
  {
    label: "Boundary: C(n, 0)",
    n: 7,
    r: 0,
    description: "C(7, 0) = 1 (empty selection / null subset)",
  },
  {
    label: "Boundary: C(n, n)",
    n: 7,
    r: 7,
    description: "C(7, 7) = 1 (complete set selection)",
  },
];

export function CombinationCalculator() {
  const [nInput, setNInput] = useState<number>(7);
  const [rInput, setRInput] = useState<number>(3);

  // Validation
  const validationError = useMemo(() => {
    if (!Number.isInteger(nInput) || !Number.isInteger(rInput)) {
      return "Both n and r must be integers.";
    }
    if (nInput < 0) {
      return "Total available items n cannot be negative.";
    }
    if (rInput < 0) {
      return "Chosen items r cannot be negative.";
    }
    if (rInput > nInput) {
      return `Chosen items r (${rInput}) cannot exceed available items n (${nInput}). In combinations without repetition, r ≤ n is required.`;
    }
    if (nInput > 18) {
      return "For exact safe integer precision (Number.MAX_SAFE_INTEGER) and readable factorial expansion, n is capped at 18 in this interactive calculator.";
    }
    return null;
  }, [nInput, rInput]);

  const calculation = useMemo(() => {
    if (validationError) return null;
    try {
      const steps = getCombinationCalculationSteps(nInput, rInput);
      const total = calculateCombinations(nInput, rInput);
      return { steps, total };
    } catch {
      return null;
    }
  }, [nInput, rInput, validationError]);

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Interactive Binomial Coefficient Calculator (nCr)"
        subtitle="Step-by-step factorial simplification and numerical computation"
        badge={<Badge variant="cobalt">Pure Combinatorics</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Preset buttons */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Quick Exploration Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const isActive = nInput === preset.n && rInput === preset.r;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setNInput(preset.n);
                    setRInput(preset.r);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cobalt-600 text-white shadow-sm ring-2 ring-cobalt-400"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="input-n"
                className="text-xs font-bold text-slate-700"
              >
                Available Elements (n)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Canonical features = 7
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 font-bold"
                onClick={() => setNInput((prev) => Math.max(0, prev - 1))}
              >
                -
              </Button>
              <input
                id="input-n"
                type="number"
                min={0}
                max={18}
                value={nInput}
                onChange={(e) => setNInput(parseInt(e.target.value, 10) || 0)}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 font-bold"
                onClick={() => setNInput((prev) => Math.min(18, prev + 1))}
              >
                +
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Total distinct items available to choose from.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="input-r"
                className="text-xs font-bold text-slate-700"
              >
                Chosen Elements (r)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                Selected features = 3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 font-bold"
                onClick={() => setRInput((prev) => Math.max(0, prev - 1))}
              >
                -
              </Button>
              <input
                id="input-r"
                type="number"
                min={0}
                max={nInput}
                value={rInput}
                onChange={(e) => setRInput(parseInt(e.target.value, 10) || 0)}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 font-bold"
                onClick={() => setRInput((prev) => Math.min(nInput, prev + 1))}
              >
                +
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Subset size to select without repetition.
            </p>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800">
            <strong>Input Error:</strong> {validationError}
          </div>
        )}

        {/* Step-by-Step Mathematical Output */}
        {calculation && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Formula & Substitution Card */}
              <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Step-by-Step Derivation
                  </span>
                  {calculation.steps.isSymmetricApplied && (
                    <Badge variant="lime">
                      Symmetry Applied: C({nInput}, {rInput}) = C({nInput},{" "}
                      {calculation.steps.effectiveR})
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      1. General Combinatorial Formula
                    </span>
                    <KaTeXMath
                      math={calculation.steps.formulaLatex}
                      block
                      className="text-slate-800 text-sm font-semibold"
                    />
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      2. Numerical Substitution
                    </span>
                    <KaTeXMath
                      math={calculation.steps.substitutedLatex}
                      block
                      className="text-cobalt-700 text-sm font-semibold"
                    />
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      3. Factorial Cancellation & Arithmetic Simplification
                    </span>
                    <KaTeXMath
                      math={calculation.steps.simplifiedLatex}
                      block
                      className="text-slate-900 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Result Metric Card */}
              <div className="flex flex-col justify-between rounded-xl border border-cobalt-200 bg-cobalt-50/60 p-5 text-center">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cobalt-700">
                    Theoretical Combinations
                  </span>
                  <div className="mt-4 font-mono text-4xl font-extrabold text-cobalt-950">
                    {calculation.total.toLocaleString()}
                  </div>
                  <p className="mt-2 text-xs text-cobalt-800 font-medium">
                    Distinct unordered subsets of size {rInput} from {nInput}{" "}
                    elements
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cobalt-200/80 text-[11px] text-slate-600 font-mono">
                  C({nInput}, {rInput}) = {calculation.total}
                </div>
              </div>
            </div>

            {/* Symmetry and Mathematical Properties Note */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-600 flex items-start gap-2">
              <span className="text-cobalt-600 font-bold">&bull;</span>
              <div>
                <strong>Mathematical Property:</strong> Symmetry states that{" "}
                <KaTeXMath math="C(n, r) = C(n, n - r)" />. Choosing{" "}
                {rInput} elements to include is mathematically identical to
                choosing {nInput - rInput} elements to leave out.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```

## File 5: `src/components/combolab/PermutationVsCombination.tsx`

**Description**: Interactive Permutation vs Combination Explainer Demonstrating Order Invariance

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import {
  SMARTPHONE_FEATURES,
  type SmartphoneFeature,
} from "@/types/survey";
import { generatePermutations } from "@/lib/math/combinations";

export function PermutationVsCombination() {
  const [selectedFeatures, setSelectedFeatures] = useState<
    [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature]
  >([
    "Camera Quality",
    "Battery Life",
    "Processing Performance",
  ]);

  // Generate all 3! = 6 permutations of the 3 selected features
  const permutations = useMemo(() => {
    return generatePermutations(selectedFeatures);
  }, [selectedFeatures]);

  const toggleFeature = (feature: SmartphoneFeature) => {
    if (selectedFeatures.includes(feature)) {
      // Don't deselect below 3
      return;
    }
    // Replace the first feature and shift
    setSelectedFeatures([selectedFeatures[1], selectedFeatures[2], feature]);
  };

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Permutations vs Combinations: Why Order Does Not Matter"
        subtitle="Mathematical comparison using empirical smartphone feature triplets"
        badge={<Badge variant="lime">Core Discrete Concept</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Interactive Feature Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Select 3 Features to Compare:
            </span>
            <span className="text-xs text-slate-500">
              Active Triplet: {selectedFeatures.length} / 3
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SMARTPHONE_FEATURES.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-cobalt-600 text-white shadow-sm ring-2 ring-cobalt-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-side or responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Combinations (Unordered) */}
          <div className="rounded-xl border border-lime-200 bg-lime-50/40 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-lime-200/80 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-lime-800">
                  Combination (Unordered Set)
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Order Does NOT Matter
                </h4>
              </div>
              <Badge variant="lime">C(3, 3) = 1 Outcome</Badge>
            </div>

            <div className="rounded-lg bg-white p-4 border border-lime-200 shadow-sm space-y-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Mathematical Set Notation:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded bg-slate-50 border border-slate-200 font-mono text-xs">
                <span className="text-slate-400 font-bold text-base">&#123;</span>
                {selectedFeatures.map((f, i) => (
                  <React.Fragment key={f}>
                    <span className="font-semibold text-cobalt-700 bg-white px-2 py-1 rounded border border-slate-200 shadow-2xs">
                      {f}
                    </span>
                    {i < selectedFeatures.length - 1 && (
                      <span className="text-slate-400">,</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-slate-400 font-bold text-base">&#125;</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                In set theory, elements within braces have no intrinsic ordering:
                <br />
                <code className="text-xs font-mono font-bold text-slate-800">
                  &#123;A, B, C&#125; = &#123;B, A, C&#125; = &#123;C, B, A&#125;
                </code>
              </p>
            </div>

            <div className="rounded-lg bg-white/80 p-3.5 border border-lime-200 text-xs text-slate-700 space-y-1.5">
              <span className="font-bold text-lime-900 block">
                PhonePrint Application Context:
              </span>
              <p className="text-slate-600 leading-relaxed">
                The PhonePrint survey asks students:{" "}
                <em>&quot;Choose your top three priority smartphone features.&quot;</em>{" "}
                Whether a respondent clicks &quot;Battery Life&quot; first or
                &quot;Camera Quality&quot; first, their smartphone preference
                bundle is identical. They form <strong>1 single combination</strong>.
              </p>
            </div>
          </div>

          {/* Permutations (Ordered) */}
          <div className="rounded-xl border border-cobalt-200 bg-cobalt-50/40 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-cobalt-200/80 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cobalt-800">
                  Permutations (Ordered Sequences)
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Order Matters (Ranked)
                </h4>
              </div>
              <Badge variant="cobalt">P(3, 3) = 3! = 6 Outcomes</Badge>
            </div>

            <div className="rounded-lg bg-white p-4 border border-cobalt-200 shadow-sm space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                All 3! = 6 Distinct Ordered Sequences:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {permutations.map((perm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[11px]"
                  >
                    <span className="font-bold text-cobalt-600 w-5">
                      #{idx + 1}
                    </span>
                    <span className="text-slate-400">(</span>
                    <span className="truncate text-slate-800 font-medium">
                      {perm.map((f) => f.split(" ")[0]).join(", ")}
                    </span>
                    <span className="text-slate-400">)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white/80 p-3.5 border border-cobalt-200 text-xs text-slate-700 space-y-1.5">
              <span className="font-bold text-cobalt-900 block">
                Combinatorial Relationship:
              </span>
              <p className="text-slate-600 leading-relaxed">
                To count combinations without overcounting, we divide permutations by{" "}
                <KaTeXMath math="r!" />:
              </p>
              <div className="pt-1">
                <KaTeXMath
                  math="C(n, r) = \frac{P(n, r)}{r!} = \frac{6}{3!} = \frac{6}{6} = 1"
                  block
                  className="text-xs font-semibold text-cobalt-950"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

```

## File 6: `src/components/combolab/FeatureCombinationExplorer.tsx`

**Description**: Dynamic 35-Triplet Space Explorer with Multi-Criteria Filtering

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  SMARTPHONE_FEATURES,
  type SmartphoneFeature,
} from "@/types/survey";
import type { FeatureCombinationRecord } from "@/types/math";

export interface FeatureCombinationExplorerProps {
  combinations: readonly FeatureCombinationRecord[];
  totalRespondents: number;
  onSelectCombination?: (combination: FeatureCombinationRecord) => void;
  selectedCombinationId?: string | null;
}

type FilterStatus = "all" | "observed" | "unobserved";

export function FeatureCombinationExplorer({
  combinations,
  totalRespondents,
  onSelectCombination,
  selectedCombinationId,
}: FeatureCombinationExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [featureFilter, setFeatureFilter] = useState<string>("all");

  const filteredCombinations = useMemo(() => {
    return combinations.filter((combo) => {
      // 1. Status Filter
      if (statusFilter === "observed" && !combo.isObserved) return false;
      if (statusFilter === "unobserved" && combo.isObserved) return false;

      // 2. Feature Filter
      if (
        featureFilter !== "all" &&
        !combo.features.includes(featureFilter as SmartphoneFeature)
      ) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = combo.id.toLowerCase().includes(q);
        const matchesFeature = combo.features.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesFeature) return false;
      }

      return true;
    });
  }, [combinations, statusFilter, featureFilter, searchQuery]);

  const observedCount = combinations.filter((c) => c.isObserved).length;
  const unobservedCount = combinations.length - observedCount;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Combinatorial Triplet Space Explorer (All 35 Triplets)"
        subtitle={`Dynamic enumeration of C(7, 3) = 35 combinations mapped against ${totalRespondents} survey observations`}
        badge={
          <Badge variant="cobalt">
            {filteredCombinations.length} / {combinations.length} Displayed
          </Badge>
        }
      />
      <CardContent className="space-y-5">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-cobalt-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Triplets ({combinations.length})
            </button>
            <button
              onClick={() => setStatusFilter("observed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === "observed"
                  ? "bg-lime-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Observed ({observedCount})
            </button>
            <button
              onClick={() => setStatusFilter("unobserved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === "unobserved"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Unobserved Voids ({unobservedCount})
            </button>
          </div>

          {/* Search & Feature Filter Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="h-9 w-full sm:w-auto rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:border-cobalt-500 focus:outline-none"
            >
              <option value="all">Contains Any Feature</option>
              {SMARTPHONE_FEATURES.map((feature) => (
                <option key={feature} value={feature}>
                  Contains: {feature}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by ID or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full sm:w-48 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 placeholder-slate-400 focus:border-cobalt-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Combinations Grid */}
        {filteredCombinations.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">
              No combinations match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setFeatureFilter("all");
              }}
              className="mt-3 text-xs text-cobalt-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredCombinations.map((combo) => {
              const isSelected = selectedCombinationId === combo.id;
              return (
                <div
                  key={combo.id}
                  onClick={() => onSelectCombination?.(combo)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-cobalt-500 bg-cobalt-50/40 ring-2 ring-cobalt-300 shadow-sm"
                      : combo.isObserved
                      ? "border-slate-200 bg-white hover:border-cobalt-300 hover:shadow-2xs"
                      : "border-slate-200/60 bg-slate-50/60 hover:bg-slate-100/60 opacity-85"
                  }`}
                >
                  {/* Top Bar: ID and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {combo.id}
                    </span>
                    {combo.isObserved ? (
                      <Badge variant="lime" className="text-[11px] font-semibold">
                        {combo.observedCount} resp. ({combo.observedPercentage}%)
                      </Badge>
                    ) : (
                      <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                        0 resp. (Void)
                      </span>
                    )}
                  </div>

                  {/* Feature Badges */}
                  <div className="space-y-1 my-2">
                    {combo.features.map((feature) => (
                      <div
                        key={feature}
                        className="text-xs font-medium text-slate-800 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/70 truncate"
                        title={feature}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Footer info */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {combo.isObserved
                        ? `${combo.matchingRespondentIds.length} student${
                            combo.matchingRespondentIds.length > 1 ? "s" : ""
                          }`
                        : "Theoretical void"}
                    </span>
                    <span className="text-cobalt-600 font-semibold hover:underline">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```

## File 7: `src/components/combolab/CombinationFrequencyAnalysis.tsx`

**Description**: Empirical Frequency Ranking, Recharts Distribution, and Void Analysis

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CombinationAnalyticsSummary, FeatureCombinationRecord } from "@/types/math";

export interface CombinationFrequencyAnalysisProps {
  analytics: CombinationAnalyticsSummary;
  onSelectCombination?: (combination: FeatureCombinationRecord) => void;
}

export function CombinationFrequencyAnalysis({
  analytics,
  onSelectCombination,
}: CombinationFrequencyAnalysisProps) {
  const {
    totalTheoreticalCombinations,
    totalObservedCombinations,
    totalUnobservedCombinations,
    totalRespondents,
    observedCombinations,
    mostCommonCombinations,
    leastCommonObservedCombinations,
  } = analytics;

  // Space coverage percentage
  const spaceCoveragePct = Number(
    ((totalObservedCombinations / totalTheoreticalCombinations) * 100).toFixed(1)
  );

  // Prepare chart data for observed combinations
  const chartData = observedCombinations.map((combo) => {
    // Short label for y-axis
    const shortNames = combo.features
      .map((f) => f.split(" ")[0])
      .join(" + ");
    return {
      id: combo.id,
      label: `${combo.id}: ${shortNames}`,
      fullLabel: combo.features.join(" • "),
      count: combo.observedCount,
      percentage: combo.observedPercentage,
      raw: combo,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Theoretical Space
          </span>
          <div className="mt-1 font-mono text-2xl font-extrabold text-slate-900">
            {totalTheoreticalCombinations}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            C(7, 3) possible triplets
          </span>
        </div>

        <div className="rounded-xl border border-lime-200 bg-lime-50/40 p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-lime-800 block">
            Observed in Survey
          </span>
          <div className="mt-1 font-mono text-2xl font-extrabold text-lime-950">
            {totalObservedCombinations}
          </div>
          <span className="text-[11px] text-lime-700 font-medium">
            {spaceCoveragePct}% space coverage
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Unobserved Voids
          </span>
          <div className="mt-1 font-mono text-2xl font-extrabold text-slate-700">
            {totalUnobservedCombinations}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {(100 - spaceCoveragePct).toFixed(1)}% unchosen in cohort
          </span>
        </div>

        <div className="rounded-xl border border-cobalt-200 bg-cobalt-50/40 p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cobalt-800 block">
            Survey Cohort Size
          </span>
          <div className="mt-1 font-mono text-2xl font-extrabold text-cobalt-950">
            {totalRespondents}
          </div>
          <span className="text-[11px] text-cobalt-700 font-medium">
            Valid survey respondents
          </span>
        </div>
      </div>

      {/* Frequency Distribution Chart Card */}
      <Card className="border-slate-200/90 shadow-card">
        <CardHeader
          title="Empirical Feature Triplet Frequency Ranking"
          subtitle="Observed respondent frequency distribution across the 10 populated combinations"
          badge={<Badge variant="lime">Distribution & Ties</Badge>}
        />
        <CardContent className="space-y-6">
          {/* Recharts Bar Chart */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  type="number"
                  domain={[0, 3]}
                  ticks={[0, 1, 2, 3]}
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
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]!.payload;
                      return (
                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                          <div className="font-mono font-bold text-slate-800">
                            {item.id}
                          </div>
                          <div className="text-slate-600 font-medium">
                            {item.fullLabel}
                          </div>
                          <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-4 font-mono">
                            <span className="text-slate-500">Frequency:</span>
                            <span className="font-bold text-cobalt-600">
                              {item.count} respondents ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 4, 4, 0]}
                  onClick={(entry) => onSelectCombination?.(entry.raw)}
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count >= 2 ? "#84cc16" : "#2563eb"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking Details & Tied Frequency Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Most Common Combinations */}
            <div className="rounded-xl border border-lime-200 bg-lime-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-900">
                  Most Frequent Triplet(s)
                </span>
                <Badge variant="lime">
                  {mostCommonCombinations.length > 1
                    ? `${mostCommonCombinations.length}-Way Tie`
                    : "Top Preference"}
                </Badge>
              </div>

              <div className="space-y-2">
                {mostCommonCombinations.map((combo) => (
                  <div
                    key={combo.id}
                    onClick={() => onSelectCombination?.(combo)}
                    className="p-2.5 rounded-lg bg-white border border-lime-200 text-xs cursor-pointer hover:border-lime-400 transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-700 block">
                        {combo.id}
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        {combo.features.join(", ")}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-lime-700 bg-lime-100 px-2 py-0.5 rounded text-[11px]">
                      {combo.observedCount} ({combo.observedPercentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Least Common Observed Combinations */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Single-Response Triplets
                </span>
                <Badge variant="default">
                  {leastCommonObservedCombinations.length} Combinations Tied
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {leastCommonObservedCombinations.length} distinct feature triplets
                were selected by exactly 1 respondent each (8.33% of cohort).
                These reflect diverse individual smartphone priorities across
                gaming, photography, and general use.
              </p>

              <div className="text-[11px] font-mono text-slate-500">
                IDs:{" "}
                {leastCommonObservedCombinations.map((c) => c.id).join(", ")}
              </div>
            </div>
          </div>

          {/* Academic & Methodological Disclaimer */}
          <Callout variant="info" title="Academic Note on Statistical Generalizability">
            In this university discrete mathematics study using a 12-respondent
            demo dataset, observed frequencies are presented strictly to
            demonstrate combinatorial frequency distributions. With N = 12,
            individual percentages represent discrete fractions (1/12 = 8.33%, 2/12
            = 16.67%). Unobserved combinations (25 of 35) represent unchosen
            triplets in this sample rather than mathematically impossible feature
            pairings.
          </Callout>
        </CardContent>
      </Card>
    </div>
  );
}

```

## File 8: `src/components/combolab/BudgetCombinationAnalysis.tsx`

**Description**: Price-Stratified Combinatorial Analysis with Strict Denominator Integrity

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import {
  BUDGET_RANGES,
  type BudgetRange,
} from "@/types/survey";
import type { CombinationAnalyticsSummary, FeatureCombinationRecord } from "@/types/math";

export interface BudgetCombinationAnalysisProps {
  analytics: CombinationAnalyticsSummary;
  onSelectCombination?: (combination: FeatureCombinationRecord) => void;
}

export function BudgetCombinationAnalysis({
  analytics,
  onSelectCombination,
}: BudgetCombinationAnalysisProps) {
  const [activeBudget, setActiveBudget] = useState<BudgetRange>("$400 - $700");

  const tierCohortSize = analytics.budgetCohortSizes[activeBudget] ?? 0;

  // Combinations observed in this budget tier
  const tierCombinations = useMemo(() => {
    return analytics.combinations
      .filter((combo) => combo.budgetBreakdown[activeBudget].count > 0)
      .sort(
        (a, b) =>
          b.budgetBreakdown[activeBudget].count -
          a.budgetBreakdown[activeBudget].count
      );
  }, [analytics.combinations, activeBudget]);

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Budget-Segmented Feature Combination Analysis"
        subtitle="Comparing feature bundle choices across price sensitivity cohorts with rigorous denominator integrity"
        badge={<Badge variant="cobalt">Stratified Combinatorics</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Budget Tier Selector Tabs */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Select Budget Segment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BUDGET_RANGES.map((range) => {
              const count = analytics.budgetCohortSizes[range];
              const isActive = activeBudget === range;
              return (
                <button
                  key={range}
                  onClick={() => setActiveBudget(range)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? "border-cobalt-600 bg-cobalt-50/60 ring-2 ring-cobalt-300 shadow-2xs"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold block text-slate-900">
                    {range}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-slate-500">Cohort Size:</span>
                    <span
                      className={`font-mono font-bold ${
                        count > 0 ? "text-cobalt-700" : "text-slate-400"
                      }`}
                    >
                      {count} {count === 1 ? "resp." : "resps."}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Segment Sample Size (N_tier)
            </span>
            <div className="mt-1 font-mono text-2xl font-extrabold text-slate-900">
              {tierCohortSize}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Strict denominator for within-budget percentages
            </p>
          </div>

          <div className="rounded-xl border border-cobalt-200 bg-cobalt-50/40 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cobalt-800 block">
              Distinct Combinations Observed
            </span>
            <div className="mt-1 font-mono text-2xl font-extrabold text-cobalt-950">
              {tierCombinations.length}
            </div>
            <p className="text-[11px] text-cobalt-700 mt-0.5">
              Unique feature triplets in this price bracket
            </p>
          </div>

          <div className="rounded-xl border border-lime-200 bg-lime-50/40 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lime-800 block">
              Full Cohort Share
            </span>
            <div className="mt-1 font-mono text-2xl font-extrabold text-lime-950">
              {analytics.totalRespondents > 0
                ? (
                    (tierCohortSize / analytics.totalRespondents) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-[11px] text-lime-700 mt-0.5">
              {tierCohortSize} of {analytics.totalRespondents} total study participants
            </p>
          </div>
        </div>

        {/* Combinations Breakdown in Selected Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Feature Combinations in {activeBudget}
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              Denominator = {tierCohortSize}
            </span>
          </div>

          {tierCohortSize === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-sm text-slate-500 font-medium">
                No respondents in the current survey dataset belong to the {activeBudget} tier.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Within-tier percentage defaults to 0% with division-by-zero protection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tierCombinations.map((combo) => {
                const tierMetrics = combo.budgetBreakdown[activeBudget];
                return (
                  <div
                    key={combo.id}
                    onClick={() => onSelectCombination?.(combo)}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cobalt-400 cursor-pointer transition-all shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          {combo.id}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {combo.features.map((f) => (
                            <span
                              key={f}
                              className="text-[11px] font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="lime" className="font-mono">
                          {tierMetrics.percentageWithinBudget}% of Tier
                        </Badge>
                        <Badge variant="outline" className="font-mono text-slate-600">
                          {combo.observedPercentage}% Overall
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-700">
                          Within-Tier Calculation:
                        </span>{" "}
                        <span className="font-mono text-cobalt-700 font-bold">
                          {tierMetrics.count} / {tierCohortSize} respondents ={" "}
                          {tierMetrics.percentageWithinBudget}%
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">
                          Full-Cohort Calculation:
                        </span>{" "}
                        <span className="font-mono text-slate-600">
                          {tierMetrics.count} / {analytics.totalRespondents} respondents ={" "}
                          {(
                            (tierMetrics.count / analytics.totalRespondents) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Methodological Alert on Subgroup Denominators */}
        <Callout variant="warning" title="Methodological Safeguard: Denominator Integrity">
          When analyzing sub-populations (such as budget tiers), reporting
          percentages requires using the specific stratum size (
          <KaTeXMath math="N_{\text{tier}}" />
          ) as the denominator. For instance, in the &quot;{activeBudget}&quot;
          segment, frequencies are divided by <KaTeXMath math={`N = ${tierCohortSize}`} />
          . With small subgroup samples, individual preferences produce larger percentage
          swings (e.g., 1 respondent ={" "}
          {tierCohortSize > 0
            ? ((1 / tierCohortSize) * 100).toFixed(1)
            : "0.0"}
          %). Subgroup percentages must never be confused with overall cohort
          proportions.
        </Callout>
      </CardContent>
    </Card>
  );
}

```

## File 9: `src/components/combolab/CombinatoricsLearningPanel.tsx`

**Description**: Undergraduate Discrete Mathematics Reference with KaTeX Formulations

```tsx
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KaTeXMath } from "@/components/ui/KaTeXMath";

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  formula: string;
  explanation: string;
  phoneprintApplication: string;
  properties: string[];
}

const TOPICS: Topic[] = [
  {
    id: "combinations",
    title: "Combinations (Unordered Subsets)",
    subtitle: "Choosing r items from n without replacement where order does not matter",
    badge: "C(n, r)",
    formula: "C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}",
    explanation:
      "A combination is a selection of elements from a collection such that the order of selection does not matter. To compute C(n, r), we count all possible ordered arrangements (permutations) and divide by r! to remove redundancy caused by the r! permutations of each chosen subset.",
    phoneprintApplication:
      "The PhonePrint survey asks respondents to select their top 3 priority features from 7 available canonical features. Selecting Camera, Battery, and Display is identical to selecting Display, Battery, and Camera. There are exactly C(7, 3) = 35 theoretical combinations.",
    properties: [
      "Symmetry: C(n, r) = C(n, n - r)",
      "Boundary Cases: C(n, 0) = 1 and C(n, n) = 1",
      "Linear Identity: C(n, 1) = n",
    ],
  },
  {
    id: "permutations",
    title: "Permutations (Ordered Arrangements)",
    subtitle: "Arranging r items from n where position and order matter",
    badge: "P(n, r)",
    formula: "P(n, r) = \\frac{n!}{(n - r)!} = n \\times (n - 1) \\times \\dots \\times (n - r + 1)",
    explanation:
      "A permutation is an ordered sequence of elements. If the survey had asked respondents to strictly rank their features as 1st (Gold), 2nd (Silver), and 3rd (Bronze), order would matter, resulting in P(7, 3) = 210 possible podium outcomes.",
    phoneprintApplication:
      "For any 3 selected features, there are 3! = 6 possible ordered permutations. In PhonePrint, we treat all 6 orders as equivalent to avoid artificial preference fragmentation.",
    properties: [
      "Complete Permutations: P(n, n) = n!",
      "Zero Selection: P(n, 0) = 1",
      "Relation to Combinations: P(n, r) = r! * C(n, r)",
    ],
  },
  {
    id: "factorial",
    title: "Factorial Notation (n!)",
    subtitle: "The product of all positive integers less than or equal to n",
    badge: "n!",
    formula: "n! = \\prod_{k=1}^{n} k = n \\times (n - 1) \\times (n - 2) \\times \\dots \\times 2 \\times 1",
    explanation:
      "The factorial function represents the number of ways to arrange n distinct objects in a straight line. By convention, 0! = 1, representing the single way to arrange zero objects (the empty arrangement).",
    phoneprintApplication:
      "Factorials are foundational for combinatorial calculations. 7! = 5,040 total permutations of all canonical features; 3! = 6 ways to arrange 3 selected features; 4! = 24 ways to arrange unselected features.",
    properties: [
      "Empty Product Convention: 0! = 1",
      "Recurrence: n! = n * (n - 1)!",
      "Rapid Growth: 7! = 5,040, 10! = 3,628,800",
    ],
  },
  {
    id: "multiplication_principle",
    title: "The Multiplication Principle (Rule of Product)",
    subtitle: "Fundamental counting principle for sequential, independent choices",
    badge: "Rule of Product",
    formula: "|S_1 \\times S_2 \\times \\dots \\times S_k| = |S_1| \\times |S_2| \\times \\dots \\times |S_k|",
    explanation:
      "If a decision can be made in n_1 ways, and for each way a second decision can be made in n_2 ways, the total number of ways to make the sequential decisions is n_1 * n_2.",
    phoneprintApplication:
      "When picking 3 distinct features without replacement: 1st choice has 7 options, 2nd choice has 6 options, 3rd choice has 5 options. By the multiplication principle, there are 7 * 6 * 5 = 210 ordered ways (P(7, 3)). Dividing by 3! = 6 gives the 35 unordered combinations.",
    properties: [
      "Applies to Cartesian Products: |A × B| = |A| * |B|",
      "Independent Choices: Outcomes of each stage must not limit the count of next choices",
      "Contrast with Rule of Sum: Rule of sum applies to disjoint alternative choices (A ∪ B)",
    ],
  },
  {
    id: "pascal",
    title: "Pascal's Identity & Binomial Theorem",
    subtitle: "Recursive relationship between combinations and algebraic polynomial expansions",
    badge: "Pascal's Identity",
    formula: "\\binom{n}{r} = \\binom{n - 1}{r - 1} + \\binom{n - 1}{r}",
    explanation:
      "Pascal's Identity states that to choose r items from n, we can either choose a specific element (and then pick r - 1 from the remaining n - 1), or reject that specific element (and pick all r from the remaining n - 1).",
    phoneprintApplication:
      "In PhonePrint: C(7, 3) = C(6, 2) + C(6, 3) = 15 + 20 = 35. Combinations containing Camera Quality: C(6, 2) = 15. Combinations excluding Camera Quality: C(6, 3) = 20. Total: 15 + 20 = 35.",
    properties: [
      "Geometric Representation: Pascal's Triangle row n, entry r",
      "Binomial Theorem: (x + y)^n = ∑ C(n, k) * x^(n-k) * y^k",
      "Sum of Row: ∑_{k=0}^n C(n, k) = 2^n (size of the power set)",
    ],
  },
];

export function CombinatoricsLearningPanel() {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("combinations");

  const activeTopic = TOPICS.find((t) => t.id === selectedTopicId) ?? TOPICS[0]!;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Discrete Mathematics Learning Foundation"
        subtitle="Undergraduate curriculum reference for counting principles, factorials, and binomial coefficients"
        badge={<Badge variant="cobalt">Educational Reference</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Topic navigation tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {TOPICS.map((topic) => {
            const isActive = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cobalt-600 text-white shadow-sm ring-2 ring-cobalt-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {topic.title.split(" (")[0]}
              </button>
            );
          })}
        </div>

        {/* Active Topic Content */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                {activeTopic.title}
              </h3>
              <p className="text-xs text-slate-500">{activeTopic.subtitle}</p>
            </div>
            <Badge variant="lime" className="font-mono text-xs">
              {activeTopic.badge}
            </Badge>
          </div>

          {/* Mathematical Formula Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Formal Mathematical Definition:
            </span>
            <KaTeXMath
              math={activeTopic.formula}
              block
              className="text-slate-900 text-sm font-semibold"
            />
          </div>

          {/* Conceptual Explanation */}
          <div className="text-xs text-slate-700 leading-relaxed space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Core Concept:
            </h4>
            <p>{activeTopic.explanation}</p>
          </div>

          {/* PhonePrint Application Context */}
          <div className="rounded-xl border border-lime-200 bg-lime-50/50 p-4 text-xs space-y-1.5">
            <span className="font-bold text-lime-950 uppercase tracking-wider text-[11px] block">
              Application to PhonePrint Research:
            </span>
            <p className="text-slate-700 leading-relaxed">
              {activeTopic.phoneprintApplication}
            </p>
          </div>

          {/* Mathematical Properties */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Key Mathematical Properties:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {activeTopic.properties.map((prop, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 shadow-2xs"
                >
                  <span className="text-cobalt-600 font-bold mr-1">&bull;</span>
                  {prop}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

```

## File 10: `src/components/combolab/CombinationDetailModal.tsx`

**Description**: Combination Detail Inspector Modal with Anonymized Respondent Exploration

```tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { FeatureCombinationRecord } from "@/types/math";
import type { SurveyResponse } from "@/types/survey";

export interface CombinationDetailModalProps {
  combination: FeatureCombinationRecord | null;
  onClose: () => void;
  allResponses: readonly SurveyResponse[];
}

export function CombinationDetailModal({
  combination,
  onClose,
  allResponses,
}: CombinationDetailModalProps) {
  if (!combination) return null;

  // Retrieve respondent objects
  const matchingResponses = allResponses.filter((resp) =>
    combination.matchingRespondentIds.includes(resp.response_id)
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
              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {combination.id}
              </span>
              <h3 className="text-lg font-bold text-slate-950">
                Feature Triplet Details
              </h3>
              {combination.isObserved ? (
                <Badge variant="lime">
                  Observed ({combination.observedCount} resp. •{" "}
                  {combination.observedPercentage}%)
                </Badge>
              ) : (
                <Badge variant="default">Theoretical Void (0 resp.)</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Index #{combination.index} of 35 in dynamic lexicographic enumeration
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm font-bold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Feature Triplet Badges */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Canonical Feature Triplet:
          </span>
          <div className="flex flex-wrap gap-2">
            {combination.features.map((feature) => (
              <span
                key={feature}
                className="font-medium text-xs text-cobalt-800 bg-cobalt-50 px-3 py-1.5 rounded-lg border border-cobalt-200 shadow-2xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Empirical Distribution Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Observed Count
            </span>
            <div className="mt-1 font-mono text-xl font-bold text-slate-900">
              {combination.observedCount}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Cohort Share
            </span>
            <div className="mt-1 font-mono text-xl font-bold text-cobalt-600">
              {combination.observedPercentage}%
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Status
            </span>
            <div
              className={`mt-1 font-bold text-xs ${
                combination.isObserved ? "text-lime-700" : "text-slate-500"
              }`}
            >
              {combination.isObserved ? "POPULATED" : "UNOBSERVED"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Permutations
            </span>
            <div className="mt-1 font-mono text-xl font-bold text-slate-700">
              6
            </div>
          </div>
        </div>

        {/* Matching Respondent Records or Empty Set State */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Matching Survey Respondents
            </span>
            <span className="font-mono text-xs text-slate-500">
              {matchingResponses.length} records
            </span>
          </div>

          {!combination.isObserved || matchingResponses.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <div className="text-3xl font-serif text-slate-400 mb-1">∅</div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Empty Set: Unobserved Theoretical Combination
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No participant in the university survey chose this exact
                three-feature combination. In discrete mathematics, its empirical
                frequency is exactly zero.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Respondent ID</th>
                    <th className="px-3 py-2">Preferred Brand</th>
                    <th className="px-3 py-2">Budget Tier</th>
                    <th className="px-3 py-2">Primary Use</th>
                    <th className="px-3 py-2">OS Preference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchingResponses.map((resp) => (
                    <tr key={resp.response_id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2 font-mono font-bold text-cobalt-700">
                        {resp.response_id}
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-800">
                        {resp.preferred_brand}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {resp.budget_range}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {resp.primary_use}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            resp.os_preference === "iOS"
                              ? "bg-slate-100 text-slate-800"
                              : resp.os_preference === "Android"
                              ? "bg-lime-100 text-lime-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {resp.os_preference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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

## File 11: `src/app/combolab/page.tsx`

**Description**: Integrated ComboLab Application Page with Navigation Tabs and Reactive State

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { analyzeFeatureCombinations } from "@/lib/data/combinationAnalytics";
import type { FeatureCombinationRecord } from "@/types/math";

import { CombinationCalculator } from "@/components/combolab/CombinationCalculator";
import { PermutationVsCombination } from "@/components/combolab/PermutationVsCombination";
import { FeatureCombinationExplorer } from "@/components/combolab/FeatureCombinationExplorer";
import { CombinationFrequencyAnalysis } from "@/components/combolab/CombinationFrequencyAnalysis";
import { BudgetCombinationAnalysis } from "@/components/combolab/BudgetCombinationAnalysis";
import { CombinatoricsLearningPanel } from "@/components/combolab/CombinatoricsLearningPanel";
import { CombinationDetailModal } from "@/components/combolab/CombinationDetailModal";

type ActiveTab =
  | "all"
  | "calculator"
  | "permutations"
  | "explorer"
  | "frequency"
  | "budget"
  | "theory";

export default function ComboLabPage() {
  const dataset = useMemo(() => loadDemoSurveyDataset(), []);
  const responses = dataset.responses;
  const analytics = useMemo(
    () => analyzeFeatureCombinations(responses),
    [responses]
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [selectedCombination, setSelectedCombination] =
    useState<FeatureCombinationRecord | null>(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        eyebrow="Discrete Mathematics & Combinatorics"
        title="ComboLab: Combinatorial Feature Space"
        description="Interactive laboratory exploring binomial coefficients C(n, r), permutations P(n, r), and empirical survey frequencies. Analyzes the discrete space of C(7, 3) = 35 theoretical triplets from the 7 canonical smartphone features."
        badge={{ text: "Phase 04 Verified", variant: "lime" }}
        actions={
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-500 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-md">
              [DEMO DATA: N=12]
            </span>
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                &larr; SetLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation / Focus Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-graphite-900 border border-graphite-800">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            All Modules Overview
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "calculator"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            nCr Calculator
          </button>
          <button
            onClick={() => setActiveTab("permutations")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "permutations"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Permutations vs Combinations
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "explorer"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            35-Triplet Space Explorer
          </button>
          <button
            onClick={() => setActiveTab("frequency")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "frequency"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Frequency Ranking & Voids
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "budget"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Budget Stratification
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "theory"
                ? "bg-cobalt-600 text-white shadow-sm"
                : "text-graphite-400 hover:text-white hover:bg-graphite-800"
            }`}
          >
            Curriculum Theory
          </button>
        </div>

        {/* Section 1: nCr Calculator */}
        {(activeTab === "all" || activeTab === "calculator") && (
          <section id="calculator" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                1. Combinations Calculator & Factorial Simplification
              </h2>
              <Badge variant="cobalt">Interactive Math</Badge>
            </div>
            <CombinationCalculator />
          </section>
        )}

        {/* Section 2: Permutation vs Combination Explainer */}
        {(activeTab === "all" || activeTab === "permutations") && (
          <section id="permutations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                2. Permutations vs Combinations
              </h2>
              <Badge variant="lime">Order Invariance</Badge>
            </div>
            <PermutationVsCombination />
          </section>
        )}

        {/* Section 3: Feature Combination Explorer (All 35 Triplets) */}
        {(activeTab === "all" || activeTab === "explorer") && (
          <section id="explorer" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                3. The C(7, 3) = 35 Feature Triplet Space
              </h2>
              <Badge variant="cobalt">Theoretical vs Observed</Badge>
            </div>
            <FeatureCombinationExplorer
              combinations={analytics.combinations}
              totalRespondents={analytics.totalRespondents}
              selectedCombinationId={selectedCombination?.id}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 4: Frequency Analysis & Unobserved Voids */}
        {(activeTab === "all" || activeTab === "frequency") && (
          <section id="frequency" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                4. Empirical Triplet Frequency Ranking
              </h2>
              <Badge variant="lime">Survey Observations</Badge>
            </div>
            <CombinationFrequencyAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 5: Budget-Based Combination Analysis */}
        {(activeTab === "all" || activeTab === "budget") && (
          <section id="budget" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                5. Price Tier Stratification & Denominator Integrity
              </h2>
              <Badge variant="cobalt">Subgroup Analysis</Badge>
            </div>
            <BudgetCombinationAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 6: Curriculum Learning Foundation */}
        {(activeTab === "all" || activeTab === "theory") && (
          <section id="theory" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                6. Undergraduate Curriculum Learning Reference
              </h2>
              <Badge variant="outline">Formal Mathematics</Badge>
            </div>
            <CombinatoricsLearningPanel />
          </section>
        )}

        {/* Global Academic Callout */}
        <Callout
          variant="highlight"
          title="PhonePrint Combinatorial Architecture Summary"
        >
          PhonePrint grounds smartphone preference research in discrete
          mathematics. Selecting 3 features from 7 canonical options establishes a
          finite parameter space of exactly 35 unordered combinations. In this
          initial 12-respondent cohort, 10 combinations are populated while 25
          remain unobserved voids, demonstrating how finite sampling interacts
          with multi-attribute combinatorial spaces.
        </Callout>
      </div>

      {/* Modal / Inspector for selected combination */}
      <CombinationDetailModal
        combination={selectedCombination}
        onClose={() => setSelectedCombination(null)}
        allResponses={responses}
      />
    </div>
  );
}

```

## File 12: `src/__tests__/combinations.test.ts`

**Description**: Unit Test Suite for Core Combinatorial Mathematical Logic

```typescript
import { describe, it, expect } from "vitest";
import {
  calculateCombinations,
  calculatePermutations,
  enumerateCombinations,
  factorial,
  generatePermutations,
  getCombinationCalculationSteps,
} from "@/lib/math/combinations";
import { SMARTPHONE_FEATURES } from "@/types/survey";

describe("Combinatorics Mathematical Utilities", () => {
  describe("calculateCombinations (nCr)", () => {
    it("computes standard combinations correctly", () => {
      // C(5, 0) = 1
      expect(calculateCombinations(5, 0)).toBe(1);
      // C(5, 1) = 5
      expect(calculateCombinations(5, 1)).toBe(5);
      // C(5, 2) = 10
      expect(calculateCombinations(5, 2)).toBe(10);
      // C(5, 3) = 10
      expect(calculateCombinations(5, 3)).toBe(10);
      // C(5, 5) = 1
      expect(calculateCombinations(5, 5)).toBe(1);
      // C(7, 3) = 35 (Choosing 3 features out of 7 canonical smartphone features)
      expect(calculateCombinations(7, 3)).toBe(35);
      // C(9, 3) = 84 (Generic verification)
      expect(calculateCombinations(9, 3)).toBe(84);
      // C(10, 4) = 210
      expect(calculateCombinations(10, 4)).toBe(210);
      // C(0, 0) = 1
      expect(calculateCombinations(0, 0)).toBe(1);
    });

    it("handles large values without overflow", () => {
      // C(30, 4) = 27,405
      expect(calculateCombinations(30, 4)).toBe(27405);
      // C(20, 10) = 184,756
      expect(calculateCombinations(20, 10)).toBe(184756);
    });

    it("throws RangeError when r > n", () => {
      expect(() => calculateCombinations(3, 5)).toThrowError(RangeError);
      expect(() => calculateCombinations(0, 1)).toThrowError(RangeError);
    });

    it("throws RangeError when n or r is negative", () => {
      expect(() => calculateCombinations(-5, 2)).toThrowError(RangeError);
      expect(() => calculateCombinations(5, -2)).toThrowError(RangeError);
      expect(() => calculateCombinations(-3, -1)).toThrowError(RangeError);
    });

    it("throws TypeError when n or r is not an integer", () => {
      expect(() => calculateCombinations(5.5, 2)).toThrowError(TypeError);
      expect(() => calculateCombinations(5, 2.3)).toThrowError(TypeError);
      expect(() => calculateCombinations(NaN, 2)).toThrowError(TypeError);
      expect(() => calculateCombinations(5, Infinity)).toThrowError(TypeError);
    });
  });

  describe("calculatePermutations (nPr)", () => {
    it("computes permutations correctly", () => {
      expect(calculatePermutations(5, 2)).toBe(20);
      expect(calculatePermutations(5, 5)).toBe(120);
      expect(calculatePermutations(5, 0)).toBe(1);
      expect(calculatePermutations(9, 3)).toBe(504);
    });

    it("throws RangeError when r > n or parameters are negative", () => {
      expect(() => calculatePermutations(3, 4)).toThrowError(RangeError);
      expect(() => calculatePermutations(-1, 2)).toThrowError(RangeError);
    });
  });

  describe("enumerateCombinations", () => {
    const sampleFeatures = ["Camera", "Battery", "Display", "Processor"];

    it("enumerates all C(4, 2) = 6 combinations", () => {
      const combos = enumerateCombinations(sampleFeatures, 2);
      expect(combos.length).toBe(6);
      expect(combos).toEqual([
        ["Camera", "Battery"],
        ["Camera", "Display"],
        ["Camera", "Processor"],
        ["Battery", "Display"],
        ["Battery", "Processor"],
        ["Display", "Processor"],
      ]);
    });

    it("returns [[]] for r = 0", () => {
      const combos = enumerateCombinations(sampleFeatures, 0);
      expect(combos).toEqual([[]]);
    });

    it("returns original array as single combination for r = n", () => {
      const combos = enumerateCombinations(sampleFeatures, 4);
      expect(combos).toEqual([[...sampleFeatures]]);
    });

    it("enumerates exactly C(7, 3) = 35 feature triplets from canonical survey features", () => {
      expect(SMARTPHONE_FEATURES.length).toBe(7);
      expect(calculateCombinations(SMARTPHONE_FEATURES.length, 3)).toBe(35);

      const allTriplets = enumerateCombinations(SMARTPHONE_FEATURES, 3);
      expect(allTriplets.length).toBe(35);

      // Verify that every generated triplet has 3 distinct features
      for (const triplet of allTriplets) {
        expect(triplet.length).toBe(3);
        expect(new Set(triplet).size).toBe(3);
      }

      // Verify all 35 triplets are unique (no duplicates exist)
      const stringifiedTriplets = new Set(allTriplets.map((t) => [...t].sort().join("::")));
      expect(stringifiedTriplets.size).toBe(35);
    });

    it("throws RangeError when r > items.length or r < 0", () => {
      expect(() => enumerateCombinations(sampleFeatures, 5)).toThrowError(RangeError);
      expect(() => enumerateCombinations(sampleFeatures, -1)).toThrowError(RangeError);
    });

    it("throws TypeError when r is not an integer", () => {
      expect(() => enumerateCombinations(sampleFeatures, 1.5)).toThrowError(TypeError);
    });
  });

  describe("Symmetry and Pascal Recurrence Properties", () => {
    it("satisfies symmetry C(n, r) = C(n, n - r)", () => {
      expect(calculateCombinations(7, 3)).toBe(calculateCombinations(7, 4));
      expect(calculateCombinations(10, 2)).toBe(calculateCombinations(10, 8));
      expect(calculateCombinations(12, 5)).toBe(calculateCombinations(12, 7));
      expect(calculateCombinations(6, 0)).toBe(calculateCombinations(6, 6));
    });

    it("satisfies Pascal's identity C(n, r) = C(n - 1, r - 1) + C(n - 1, r)", () => {
      // C(7, 3) = C(6, 2) + C(6, 3) = 15 + 20 = 35
      expect(calculateCombinations(7, 3)).toBe(
        calculateCombinations(6, 2) + calculateCombinations(6, 3)
      );
      // C(8, 4) = C(7, 3) + C(7, 4) = 35 + 35 = 70
      expect(calculateCombinations(8, 4)).toBe(
        calculateCombinations(7, 3) + calculateCombinations(7, 4)
      );
    });
  });

  describe("factorial", () => {
    it("computes standard factorials accurately up to safe integer limit n = 18", () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(2)).toBe(2);
      expect(factorial(3)).toBe(6);
      expect(factorial(4)).toBe(24);
      expect(factorial(5)).toBe(120);
      expect(factorial(7)).toBe(5040);
      expect(factorial(10)).toBe(3628800);
      // 18! = 6,402,373,705,728,000, exactly within Number.MAX_SAFE_INTEGER (9,007,199,254,740,991)
      expect(factorial(18)).toBe(6402373705728000);
      expect(factorial(18)).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });

    it("throws RangeError for negative numbers and numbers > 18", () => {
      expect(() => factorial(-1)).toThrowError(RangeError);
      expect(() => factorial(19)).toThrowError(RangeError);
      expect(() => factorial(20)).toThrowError(RangeError);
      expect(() => factorial(25)).toThrowError(RangeError);
    });

    it("throws TypeError for non-integers", () => {
      expect(() => factorial(3.5)).toThrowError(TypeError);
      expect(() => factorial(NaN)).toThrowError(TypeError);
    });
  });

  describe("generatePermutations", () => {
    it("generates 3! = 6 permutations for 3 distinct items", () => {
      const items = ["A", "B", "C"];
      const perms = generatePermutations(items);
      expect(perms.length).toBe(6);
      expect(perms).toEqual([
        ["A", "B", "C"],
        ["A", "C", "B"],
        ["B", "A", "C"],
        ["B", "C", "A"],
        ["C", "A", "B"],
        ["C", "B", "A"],
      ]);
    });

    it("returns [[]] for empty array and 1 permutation for 1 item", () => {
      expect(generatePermutations([])).toEqual([[]]);
      expect(generatePermutations(["Camera"])).toEqual([["Camera"]]);
    });

    it("throws RangeError if items length exceeds 8", () => {
      const nineItems = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(() => generatePermutations(nineItems)).toThrowError(RangeError);
    });
  });

  describe("getCombinationCalculationSteps", () => {
    it("generates correct step breakdown for C(7, 3)", () => {
      const steps = getCombinationCalculationSteps(7, 3);
      expect(steps.n).toBe(7);
      expect(steps.r).toBe(3);
      expect(steps.result).toBe(35);
      expect(steps.numeratorTerms).toEqual([7, 6, 5]);
      expect(steps.denominatorTerms).toEqual([3, 2, 1]);
      expect(steps.numeratorProduct).toBe(210);
      expect(steps.denominatorProduct).toBe(6);
      expect(steps.isSymmetricApplied).toBe(false);
      expect(steps.simplifiedLatex).toContain("210");
      expect(steps.simplifiedLatex).toContain("6");
      expect(steps.simplifiedLatex).toContain("35");
    });

    it("applies symmetry when r > n - r for C(7, 4)", () => {
      const steps = getCombinationCalculationSteps(7, 4);
      expect(steps.isSymmetricApplied).toBe(true);
      expect(steps.effectiveR).toBe(3);
      expect(steps.result).toBe(35);
    });

    it("handles boundary case r = 0", () => {
      const steps = getCombinationCalculationSteps(7, 0);
      expect(steps.result).toBe(1);
      expect(steps.numeratorTerms).toEqual([1]);
      expect(steps.denominatorTerms).toEqual([1]);
    });

    it("handles boundary case r = n", () => {
      const steps = getCombinationCalculationSteps(7, 7);
      expect(steps.result).toBe(1);
    });

    it("computes exact integer steps at calculator maximum n = 18", () => {
      // For n = 18, r = 9 (maximum intermediate product size with symmetry)
      const steps = getCombinationCalculationSteps(18, 9);
      expect(steps.n).toBe(18);
      expect(steps.r).toBe(9);
      expect(steps.result).toBe(48620);
      expect(steps.numeratorProduct).toBe(17643225600);
      expect(steps.denominatorProduct).toBe(362880);
      expect(Number.isSafeInteger(steps.numeratorProduct)).toBe(true);
      expect(Number.isSafeInteger(steps.denominatorProduct)).toBe(true);
      expect(Number.isSafeInteger(steps.result)).toBe(true);
      expect(steps.numeratorProduct).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });
  });
});

```

## File 13: `src/__tests__/combination_analytics.test.ts`

**Description**: Integration Test Suite for 35 Triplets, Empirical Frequencies, and Denominators

```typescript
import { describe, it, expect } from "vitest";
import {
  analyzeFeatureCombinations,
  canonicalizeFeatureTriplet,
  getCombinationKey,
} from "@/lib/data/combinationAnalytics";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { SMARTPHONE_FEATURES, type SurveyResponse } from "@/types/survey";

describe("Combinatorial Space and Empirical Frequency Analytics", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses;
  const analysis = analyzeFeatureCombinations(responses);

  describe("Theoretical Combinatorial Space Properties", () => {
    it("dynamically enumerates exactly C(7, 3) = 35 theoretical combinations", () => {
      expect(analysis.totalTheoreticalCombinations).toBe(35);
      expect(analysis.combinations.length).toBe(35);
    });

    it("guarantees every theoretical combination contains exactly 3 distinct features", () => {
      for (const record of analysis.combinations) {
        expect(record.features.length).toBe(3);
        const uniqueFeatures = new Set(record.features);
        expect(uniqueFeatures.size).toBe(3);
        // All features belong to canonical features
        for (const feature of record.features) {
          expect(SMARTPHONE_FEATURES).toContain(feature);
        }
      }
    });

    it("guarantees all 35 combinations are distinct and have unique keys", () => {
      const keys = new Set(analysis.combinations.map((c) => c.key));
      expect(keys.size).toBe(35);

      const ids = new Set(analysis.combinations.map((c) => c.id));
      expect(ids.size).toBe(35);
    });

    it("verifies canonicalization sorts features according to canonical order", () => {
      const triplet = canonicalizeFeatureTriplet([
        "Software & OS Experience",
        "Camera Quality",
        "Battery Life",
      ]);
      expect(triplet).toEqual([
        "Camera Quality",
        "Battery Life",
        "Software & OS Experience",
      ]);
      expect(getCombinationKey(triplet)).toBe(
        "Camera Quality|Battery Life|Software & OS Experience"
      );
    });
  });

  describe("Empirical Survey Observation & Frequencies", () => {
    it("partitions the 35 combinations into observed and unobserved voids", () => {
      expect(
        analysis.totalObservedCombinations + analysis.totalUnobservedCombinations
      ).toBe(35);
      expect(analysis.observedCombinations.length).toBe(
        analysis.totalObservedCombinations
      );
      expect(analysis.unobservedCombinations.length).toBe(
        analysis.totalUnobservedCombinations
      );
    });

    it("accurately detects observed combinations and assigns zero frequency to unobserved voids", () => {
      for (const record of analysis.unobservedCombinations) {
        expect(record.observedCount).toBe(0);
        expect(record.observedPercentage).toBe(0);
        expect(record.isObserved).toBe(false);
        expect(record.matchingRespondentIds).toEqual([]);
      }

      for (const record of analysis.observedCombinations) {
        expect(record.observedCount).toBeGreaterThan(0);
        expect(record.observedPercentage).toBeGreaterThan(0);
        expect(record.isObserved).toBe(true);
        expect(record.matchingRespondentIds.length).toBe(record.observedCount);
      }
    });

    it("calculates exact cohort percentages with total cohort as denominator", () => {
      const totalRespondents = 12;
      expect(analysis.totalRespondents).toBe(totalRespondents);

      // Verify sum of observed respondent counts equals total valid respondents
      const sumObservedCounts = analysis.observedCombinations.reduce(
        (sum, c) => sum + c.observedCount,
        0
      );
      expect(sumObservedCounts).toBe(totalRespondents);

      // For combination with 2 respondents: 2 / 12 * 100 = 16.67%
      const comboWithTwo = analysis.observedCombinations.find(
        (c) => c.observedCount === 2
      );
      expect(comboWithTwo).toBeDefined();
      expect(comboWithTwo?.observedPercentage).toBeCloseTo(16.67, 1);
    });

    it("correctly handles tied combination frequencies for most and least common", () => {
      // In the 12-response demo dataset, two combinations tie for highest frequency (count = 2)
      expect(analysis.mostCommonCombinations.length).toBe(2);
      expect(analysis.mostCommonCombinations[0]?.observedCount).toBe(2);
      expect(analysis.mostCommonCombinations[1]?.observedCount).toBe(2);

      // 8 combinations have count = 1
      expect(analysis.leastCommonObservedCombinations.length).toBe(8);
      for (const combo of analysis.leastCommonObservedCombinations) {
        expect(combo.observedCount).toBe(1);
      }
    });
  });

  describe("Budget-Based Segmentation and Denominator Integrity", () => {
    it("calculates within-budget percentages using budget cohort as denominator", () => {
      // Under $400 has 2 respondents: DEMO_RESP_007 and DEMO_RESP_010
      expect(analysis.budgetCohortSizes["Under $400"]).toBe(2);
      // $400 - $700 has 4 respondents: 003, 005, 011, 012
      expect(analysis.budgetCohortSizes["$400 - $700"]).toBe(4);
      // $700 - $1,000 has 3 respondents: 002, 004, 008
      expect(analysis.budgetCohortSizes["$700 - $1,000"]).toBe(3);
      // Over $1,000 has 3 respondents: 001, 006, 009
      expect(analysis.budgetCohortSizes["Over $1,000"]).toBe(3);

      // For DEMO_RESP_007 & 011: {Battery Life, Processing Performance, Storage Capacity}
      // In "Under $400": 1 respondent out of 2 => 50.0%
      // In "$400 - $700": 1 respondent out of 4 => 25.0%
      const key = getCombinationKey([
        "Battery Life",
        "Processing Performance",
        "Storage Capacity",
      ]);
      const record = analysis.combinations.find((c) => c.key === key);
      expect(record).toBeDefined();
      expect(record?.budgetBreakdown["Under $400"].count).toBe(1);
      expect(record?.budgetBreakdown["Under $400"].percentageWithinBudget).toBe(
        50.0
      );
      expect(record?.budgetBreakdown["$400 - $700"].count).toBe(1);
      expect(record?.budgetBreakdown["$400 - $700"].percentageWithinBudget).toBe(
        25.0
      );
      expect(record?.budgetBreakdown["$700 - $1,000"].count).toBe(0);
      expect(record?.budgetBreakdown["$700 - $1,000"].percentageWithinBudget).toBe(
        0
      );
    });

    it("handles empty budget segment without division-by-zero errors", () => {
      // Create artificial responses with only 1 budget tier
      const singleBudgetResponses: SurveyResponse[] = [
        {
          response_id: "TEST_01",
          preferred_brand: "Apple",
          budget_range: "Over $1,000",
          preferred_features: [
            "Camera Quality",
            "Battery Life",
            "Processing Performance",
          ],
          primary_use: "Everyday General Use",
          os_preference: "iOS",
        },
      ];

      const singleTierAnalysis = analyzeFeatureCombinations(singleBudgetResponses);
      expect(singleTierAnalysis.budgetCohortSizes["Under $400"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["$400 - $700"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["$700 - $1,000"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["Over $1,000"]).toBe(1);

      // Check that empty tiers report 0 count and 0% without NaN
      for (const record of singleTierAnalysis.combinations) {
        expect(record.budgetBreakdown["Under $400"].percentageWithinBudget).toBe(
          0
        );
        expect(
          Number.isNaN(record.budgetBreakdown["Under $400"].percentageWithinBudget)
        ).toBe(false);
      }
    });

    it("handles empty survey response cohort gracefully", () => {
      const emptyAnalysis = analyzeFeatureCombinations([]);
      expect(emptyAnalysis.totalTheoreticalCombinations).toBe(35);
      expect(emptyAnalysis.totalObservedCombinations).toBe(0);
      expect(emptyAnalysis.totalUnobservedCombinations).toBe(35);
      expect(emptyAnalysis.totalRespondents).toBe(0);
      expect(emptyAnalysis.mostCommonCombinations).toEqual([]);
      expect(emptyAnalysis.leastCommonObservedCombinations).toEqual([]);
    });
  });
});

```
