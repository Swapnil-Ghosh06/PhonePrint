# PhonePrint Phase 09 — Complete Mathematical Libraries Bundle

Complete unabridged source code for all discrete mathematical engines, set algebra, and combinatorial analytics.

---


## File: `src/lib/math/sets.ts` (**UNCHANGED**)

> **Notes**: Pure set algebra: setUnion, setIntersection, setDifference, symmetricDifference, setComplement, isSubset, 2-set PIE.

```typescript
/**
 * PhonePrint - Discrete Mathematics Foundation
 * Pure Set-Theoretic Operations
 *
 * All functions operate directly on unique respondent IDs or discrete domain elements.
 * Aggregation approximations are strictly avoided to maintain mathematical fidelity.
 */

import type { ElementCollection, InclusionExclusionVerification } from "@/types/math";

/**
 * Normalizes an ElementCollection (Set or Array) into an immutable-safe Set.
 */
export function toSet<T>(collection: ElementCollection<T>): Set<T> {
  return collection instanceof Set ? new Set(collection) : new Set(collection);
}

/**
 * Calculates the cardinality (size) of a set: |A|.
 */
export function setCardinality<T>(collection: ElementCollection<T>): number {
  if (collection instanceof Set) {
    return collection.size;
  }
  return new Set(collection).size;
}

/**
 * Computes the intersection of two sets: A ∩ B = { x | x ∈ A and x ∈ B }.
 */
export function setIntersection<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>
): Set<T> {
  const setA = toSet(a);
  const setB = toSet(b);
  const result = new Set<T>();

  // Optimize iteration over the smaller set
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];

  for (const item of smaller) {
    if (larger.has(item)) {
      result.add(item);
    }
  }

  return result;
}

/**
 * Computes the intersection across multiple sets: ⋂ S_i.
 */
export function multiSetIntersection<T>(
  ...sets: ElementCollection<T>[]
): Set<T> {
  if (sets.length === 0) {
    return new Set<T>();
  }
  const first = sets[0];
  if (!first) {
    return new Set<T>();
  }

  let accumulator = toSet(first);

  for (let i = 1; i < sets.length; i++) {
    const current = sets[i];
    if (current) {
      accumulator = setIntersection(accumulator, current);
      if (accumulator.size === 0) {
        break; // Early exit if intersection is empty
      }
    }
  }

  return accumulator;
}

/**
 * Computes the union of two sets: A ∪ B = { x | x ∈ A or x ∈ B }.
 */
export function setUnion<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>
): Set<T> {
  const result = toSet(a);
  const setB = toSet(b);

  for (const item of setB) {
    result.add(item);
  }

  return result;
}

/**
 * Computes the union across multiple sets: ⋃ S_i.
 */
export function multiSetUnion<T>(
  ...sets: ElementCollection<T>[]
): Set<T> {
  const result = new Set<T>();

  for (const s of sets) {
    const currentSet = toSet(s);
    for (const item of currentSet) {
      result.add(item);
    }
  }

  return result;
}

/**
 * Computes the set difference (relative complement): A \ B = { x ∈ A | x ∉ B }.
 */
export function setDifference<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>
): Set<T> {
  const setA = toSet(a);
  const setB = toSet(b);
  const result = new Set<T>();

  for (const item of setA) {
    if (!setB.has(item)) {
      result.add(item);
    }
  }

  return result;
}

/**
 * Computes the absolute complement of set A relative to the universal set U:
 * Aᶜ = U \ A = { x ∈ U | x ∉ A }.
 */
export function setComplement<T>(
  universe: ElementCollection<T>,
  a: ElementCollection<T>
): Set<T> {
  return setDifference(universe, a);
}

/**
 * Computes the symmetric difference: A Δ B = (A \ B) ∪ (B \ A).
 */
export function symmetricDifference<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>
): Set<T> {
  const setA = toSet(a);
  const setB = toSet(b);
  const result = new Set<T>();

  for (const item of setA) {
    if (!setB.has(item)) {
      result.add(item);
    }
  }
  for (const item of setB) {
    if (!setA.has(item)) {
      result.add(item);
    }
  }

  return result;
}

/**
 * Verifies whether subsetCandidate ⊆ supersetCandidate.
 */
export function isSubset<T>(
  subsetCandidate: ElementCollection<T>,
  supersetCandidate: ElementCollection<T>
): boolean {
  const sub = toSet(subsetCandidate);
  const superSet = toSet(supersetCandidate);

  if (sub.size > superSet.size) {
    return false;
  }

  for (const item of sub) {
    if (!superSet.has(item)) {
      return false;
    }
  }

  return true;
}

/**
 * Verifies whether two sets are mutually disjoint (A ∩ B = ∅).
 */
export function areDisjoint<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>
): boolean {
  return setIntersection(a, b).size === 0;
}

/**
 * Formally verifies the Principle of Inclusion-Exclusion for two sets:
 * |A ∪ B| = |A| + |B| - |A ∩ B|
 */
export function verifyInclusionExclusionPrinciple<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>
): InclusionExclusionVerification<T> {
  const setA = toSet(a);
  const setB = toSet(b);

  const unionSet = setUnion(setA, setB);
  const intersectionSet = setIntersection(setA, setB);

  const unionCardinality = unionSet.size;
  const individualCardinalitiesSum = setA.size + setB.size;
  const intersectionCardinality = intersectionSet.size;
  const calculatedRhs = individualCardinalitiesSum - intersectionCardinality;

  return {
    unionCardinality,
    individualCardinalitiesSum,
    intersectionCardinality,
    calculatedRhs,
    isValid: unionCardinality === calculatedRhs,
    unionSet,
    intersectionSet,
  };
}

```


## File: `src/lib/math/venn.ts` (**UNCHANGED**)

> **Notes**: Computes mutually exclusive 2-set and 3-set Venn regions (minterms) and verifies 3-set PIE identity.

```typescript
/**
 * PhonePrint - Discrete Mathematics Foundation
 * Venn Diagram Region Partitioning & Three-Set Inclusion-Exclusion
 *
 * Implements mutually exclusive partitioning of sets and theorem verification.
 * Strictly operates on unique discrete element sets without scalar aggregation approximations.
 */

import {
  toSet,
  setIntersection,
  multiSetIntersection,
  setUnion,
  multiSetUnion,
  setDifference,
} from "./sets";
import type {
  ElementCollection,
  TwoSetVennRegions,
  ThreeSetVennRegions,
  ThreeSetInclusionExclusionVerification,
} from "@/types/math";

/**
 * Computes the 4 mutually exclusive partitions of the universal set U for two sets A and B:
 * 1. onlyA = A \ B
 * 2. onlyB = B \ A
 * 3. both = A ∩ B
 * 4. neither = U \ (A ∪ B)
 */
export function computeTwoSetVennRegions<T>(
  universe: ElementCollection<T>,
  a: ElementCollection<T>,
  b: ElementCollection<T>
): TwoSetVennRegions<T> {
  const setU = toSet(universe);
  const setA = toSet(a);
  const setB = toSet(b);

  const both = setIntersection(setA, setB);
  const onlyA = setDifference(setA, setB);
  const onlyB = setDifference(setB, setA);
  const unionSet = setUnion(setA, setB);
  const neither = setDifference(setU, unionSet);

  return {
    onlyA,
    onlyB,
    both,
    neither,
    unionSet,
    universeSet: setU,
  };
}

/**
 * Computes the 8 mutually exclusive partitions of the universal set U for three sets A, B, and C:
 * 1. onlyA   = A \ (B ∪ C)
 * 2. onlyB   = B \ (A ∪ C)
 * 3. onlyC   = C \ (A ∪ B)
 * 4. onlyAB  = (A ∩ B) \ C
 * 5. onlyAC  = (A ∩ C) \ B
 * 6. onlyBC  = (B ∩ C) \ A
 * 7. allThree = A ∩ B ∩ C
 * 8. outside = U \ (A ∪ B ∪ C)
 *
 * Theorem: The 7 internal regions are pairwise disjoint and their sum equals |A ∪ B ∪ C|.
 */
export function computeThreeSetVennRegions<T>(
  universe: ElementCollection<T>,
  a: ElementCollection<T>,
  b: ElementCollection<T>,
  c: ElementCollection<T>
): ThreeSetVennRegions<T> {
  const setU = toSet(universe);
  const setA = toSet(a);
  const setB = toSet(b);
  const setC = toSet(c);

  // Pairwise unions for single-region subtractions
  const unionBC = setUnion(setB, setC);
  const unionAC = setUnion(setA, setC);
  const unionAB = setUnion(setA, setB);

  // Triple union and triple intersection
  const unionSet = multiSetUnion(setA, setB, setC);
  const allThree = multiSetIntersection(setA, setB, setC);

  // Exclusive singletons
  const onlyA = setDifference(setA, unionBC);
  const onlyB = setDifference(setB, unionAC);
  const onlyC = setDifference(setC, unionAB);

  // Exclusive double intersections
  const intersectionAB = setIntersection(setA, setB);
  const intersectionAC = setIntersection(setA, setC);
  const intersectionBC = setIntersection(setB, setC);

  const onlyAB = setDifference(intersectionAB, setC);
  const onlyAC = setDifference(intersectionAC, setB);
  const onlyBC = setDifference(intersectionBC, setA);

  // Universal complement (outside)
  const outside = setDifference(setU, unionSet);

  return {
    onlyA,
    onlyB,
    onlyC,
    onlyAB,
    onlyAC,
    onlyBC,
    allThree,
    outside,
    unionSet,
    universeSet: setU,
  };
}

/**
 * Formally verifies the Principle of Inclusion-Exclusion for three sets:
 * |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|
 */
export function verifyThreeSetInclusionExclusion<T>(
  a: ElementCollection<T>,
  b: ElementCollection<T>,
  c: ElementCollection<T>
): ThreeSetInclusionExclusionVerification<T> {
  const setA = toSet(a);
  const setB = toSet(b);
  const setC = toSet(c);

  const cardA = setA.size;
  const cardB = setB.size;
  const cardC = setC.size;

  const intersectionSetAB = setIntersection(setA, setB);
  const intersectionSetAC = setIntersection(setA, setC);
  const intersectionSetBC = setIntersection(setB, setC);
  const intersectionSetABC = multiSetIntersection(setA, setB, setC);

  const cardAB = intersectionSetAB.size;
  const cardAC = intersectionSetAC.size;
  const cardBC = intersectionSetBC.size;
  const cardABC = intersectionSetABC.size;

  const unionSet = multiSetUnion(setA, setB, setC);
  const unionCardinality = unionSet.size;

  const singletonsSum = cardA + cardB + cardC;
  const pairwiseIntersectionsSum = cardAB + cardAC + cardBC;
  const tripleIntersection = cardABC;

  const calculatedRhs = singletonsSum - pairwiseIntersectionsSum + tripleIntersection;
  const isValid = unionCardinality === calculatedRhs;

  return {
    cardA,
    cardB,
    cardC,
    cardAB,
    cardAC,
    cardBC,
    cardABC,
    singletonsSum,
    pairwiseIntersectionsSum,
    tripleIntersection,
    calculatedRhs,
    unionCardinality,
    isValid,
    unionSet,
    intersectionSetABC,
    intersectionSetAB,
    intersectionSetAC,
    intersectionSetBC,
  };
}

```


## File: `src/lib/math/combinations.ts` (**UNCHANGED**)

> **Notes**: Factorials (with safe integer limit <= 18), calculateCombinations C(n,r), calculatePermutations P(n,r), enumerateCombinations.

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


## File: `src/lib/math/matchingEngine.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Evaluates exact profile intersection B ∩ P ∩ F, 4-way disjoint partition N3+N2+N1+N0=N, and feature overlap.

```typescript
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

```


## File: `src/lib/math/brandFeatureExperiment.ts` (**UNCHANGED**)

> **Notes**: Computes brand-feature cross-tabulation matrix, cell frequencies, within-brand percentages, and feature percentage sums.

```typescript
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

```


## File: `src/lib/math/budgetCombinationExperiment.ts` (**UNCHANGED**)

> **Notes**: Stratifies all 35 triplets across budget tiers, computing frequencies and within-budget percentages.

```typescript
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

```
