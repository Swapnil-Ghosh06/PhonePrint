import { describe, it, expect } from "vitest";
import {
  setIntersection,
  setUnion,
  setDifference,
  setCardinality,
  multiSetIntersection,
  multiSetUnion,
  symmetricDifference,
  isSubset,
  areDisjoint,
} from "@/lib/math/sets";

describe("Pure Set-Theoretic Mathematical Utilities", () => {
  const setA = new Set(["RESP_001", "RESP_002", "RESP_003"]);
  const setB = new Set(["RESP_002", "RESP_003", "RESP_004"]);
  const setC = new Set(["RESP_003", "RESP_005"]);
  const disjointSet = new Set(["RESP_099", "RESP_100"]);
  const emptySet = new Set<string>();

  describe("setCardinality", () => {
    it("correctly computes cardinality |A| for Sets and Arrays", () => {
      expect(setCardinality(setA)).toBe(3);
      expect(setCardinality(emptySet)).toBe(0);
      expect(setCardinality(["A", "B", "A", "C"])).toBe(3); // Deduplication
    });
  });

  describe("setIntersection", () => {
    it("computes intersection between overlapping sets: A ∩ B", () => {
      const intersection = setIntersection(setA, setB);
      expect(intersection.size).toBe(2);
      expect(intersection.has("RESP_002")).toBe(true);
      expect(intersection.has("RESP_003")).toBe(true);
      expect(intersection.has("RESP_001")).toBe(false);
      expect(intersection.has("RESP_004")).toBe(false);
    });

    it("returns empty set for disjoint sets", () => {
      const intersection = setIntersection(setA, disjointSet);
      expect(intersection.size).toBe(0);
    });

    it("returns empty set when intersecting with empty set", () => {
      expect(setIntersection(setA, emptySet).size).toBe(0);
      expect(setIntersection(emptySet, setA).size).toBe(0);
    });

    it("supports arrays as input collections", () => {
      const arrA = ["RESP_001", "RESP_002"];
      const arrB = ["RESP_002", "RESP_003"];
      const intersection = setIntersection(arrA, arrB);
      expect(Array.from(intersection)).toEqual(["RESP_002"]);
    });
  });

  describe("multiSetIntersection", () => {
    it("computes intersection across three sets: A ∩ B ∩ C", () => {
      const result = multiSetIntersection(setA, setB, setC);
      expect(Array.from(result)).toEqual(["RESP_003"]);
    });

    it("returns empty set when given no sets", () => {
      expect(multiSetIntersection().size).toBe(0);
    });
  });

  describe("setUnion", () => {
    it("computes union of two sets: A ∪ B", () => {
      const union = setUnion(setA, setB);
      expect(union.size).toBe(4);
      expect(Array.from(union).sort()).toEqual([
        "RESP_001",
        "RESP_002",
        "RESP_003",
        "RESP_004",
      ]);
    });

    it("returns original set elements when unioned with empty set", () => {
      const union = setUnion(setA, emptySet);
      expect(union.size).toBe(setA.size);
    });
  });

  describe("multiSetUnion", () => {
    it("computes union across multiple sets: ⋃ S_i", () => {
      const union = multiSetUnion(setA, setB, setC);
      expect(union.size).toBe(5);
      expect(Array.from(union).sort()).toEqual([
        "RESP_001",
        "RESP_002",
        "RESP_003",
        "RESP_004",
        "RESP_005",
      ]);
    });
  });

  describe("setDifference", () => {
    it("computes relative complement A \\ B", () => {
      const diff = setDifference(setA, setB);
      expect(Array.from(diff)).toEqual(["RESP_001"]);
    });

    it("computes relative complement B \\ A", () => {
      const diff = setDifference(setB, setA);
      expect(Array.from(diff)).toEqual(["RESP_004"]);
    });

    it("returns A when subtracting empty set", () => {
      expect(setDifference(setA, emptySet).size).toBe(3);
    });

    it("returns empty set when subtracting set from itself: A \\ A = ∅", () => {
      expect(setDifference(setA, setA).size).toBe(0);
    });
  });

  describe("symmetricDifference", () => {
    it("computes symmetric difference A Δ B = (A \\ B) ∪ (B \\ A)", () => {
      const symDiff = symmetricDifference(setA, setB);
      expect(Array.from(symDiff).sort()).toEqual(["RESP_001", "RESP_004"]);
    });
  });

  describe("isSubset & areDisjoint", () => {
    it("identifies proper subsets", () => {
      const sub = new Set(["RESP_001", "RESP_002"]);
      expect(isSubset(sub, setA)).toBe(true);
      expect(isSubset(setA, sub)).toBe(false);
    });

    it("identifies disjoint sets", () => {
      expect(areDisjoint(setA, disjointSet)).toBe(true);
      expect(areDisjoint(setA, setB)).toBe(false);
    });
  });
});
