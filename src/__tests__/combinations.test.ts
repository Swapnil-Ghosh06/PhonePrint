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
