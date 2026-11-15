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
