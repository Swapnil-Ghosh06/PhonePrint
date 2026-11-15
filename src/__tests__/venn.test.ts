import { describe, it, expect } from "vitest";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "../lib/math/venn";
import {
  setIntersection,
  setUnion,
  setComplement,
} from "../lib/math/sets";
import {
  loadDemoSurveyDataset,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getUniverseRespondentIds,
} from "../lib/data/loader";

describe("Two-Set Venn Region Partitioning", () => {
  const universe = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  const setA = new Set(["1", "2", "3", "4"]);
  const setB = new Set(["3", "4", "5", "6"]);

  it("partitions sets into mutually disjoint subsets", () => {
    const regions = computeTwoSetVennRegions(universe, setA, setB);

    expect(Array.from(regions.onlyA).sort()).toEqual(["1", "2"]);
    expect(Array.from(regions.onlyB).sort()).toEqual(["5", "6"]);
    expect(Array.from(regions.both).sort()).toEqual(["3", "4"]);
    expect(Array.from(regions.neither).sort()).toEqual(["10", "7", "8", "9"]);

    // Disjointness checks
    expect(setIntersection(regions.onlyA, regions.onlyB).size).toBe(0);
    expect(setIntersection(regions.onlyA, regions.both).size).toBe(0);
    expect(setIntersection(regions.onlyB, regions.both).size).toBe(0);
    expect(setIntersection(regions.unionSet, regions.neither).size).toBe(0);
  });

  it("satisfies the partition cardinality sum: |onlyA| + |onlyB| + |both| = |A ∪ B|", () => {
    const regions = computeTwoSetVennRegions(universe, setA, setB);
    const sumInternal = regions.onlyA.size + regions.onlyB.size + regions.both.size;

    expect(sumInternal).toBe(regions.unionSet.size);
    expect(sumInternal + regions.neither.size).toBe(universe.size);
  });

  it("handles disjoint sets (A ∩ B = ∅)", () => {
    const a = new Set(["1", "2"]);
    const b = new Set(["3", "4"]);
    const regions = computeTwoSetVennRegions(universe, a, b);

    expect(regions.both.size).toBe(0);
    expect(regions.onlyA.size).toBe(2);
    expect(regions.onlyB.size).toBe(2);
    expect(regions.unionSet.size).toBe(4);
  });

  it("handles identical sets (A = B)", () => {
    const a = new Set(["1", "2", "3"]);
    const regions = computeTwoSetVennRegions(universe, a, a);

    expect(regions.onlyA.size).toBe(0);
    expect(regions.onlyB.size).toBe(0);
    expect(regions.both.size).toBe(3);
    expect(regions.unionSet.size).toBe(3);
  });

  it("handles empty sets", () => {
    const a = new Set<string>();
    const b = new Set(["1", "2"]);
    const regions = computeTwoSetVennRegions(universe, a, b);

    expect(regions.onlyA.size).toBe(0);
    expect(regions.both.size).toBe(0);
    expect(regions.onlyB.size).toBe(2);
    expect(regions.neither.size).toBe(universe.size - 2);
  });
});

describe("Three-Set Venn Region Partitioning", () => {
  const universe = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  // A = {1, 2, 4, 5}
  // B = {2, 3, 5, 6}
  // C = {4, 5, 6, 7}
  const setA = new Set(["1", "2", "4", "5"]);
  const setB = new Set(["2", "3", "5", "6"]);
  const setC = new Set(["4", "5", "6", "7"]);

  it("partitions 3 overlapping sets into 7 mutually disjoint internal regions + outside", () => {
    const r = computeThreeSetVennRegions(universe, setA, setB, setC);

    // onlyA = A \ (B ∪ C) = {1}
    expect(Array.from(r.onlyA)).toEqual(["1"]);
    // onlyB = B \ (A ∪ C) = {3}
    expect(Array.from(r.onlyB)).toEqual(["3"]);
    // onlyC = C \ (A ∪ B) = {7}
    expect(Array.from(r.onlyC)).toEqual(["7"]);
    // onlyAB = (A ∩ B) \ C = {2}
    expect(Array.from(r.onlyAB)).toEqual(["2"]);
    // onlyAC = (A ∩ C) \ B = {4}
    expect(Array.from(r.onlyAC)).toEqual(["4"]);
    // onlyBC = (B ∩ C) \ A = {6}
    expect(Array.from(r.onlyBC)).toEqual(["6"]);
    // allThree = A ∩ B ∩ C = {5}
    expect(Array.from(r.allThree)).toEqual(["5"]);
    // outside = U \ (A ∪ B ∪ C) = {8, 9, 10}
    expect(Array.from(r.outside).sort()).toEqual(["10", "8", "9"]);

    // Verify all 7 internal regions are pairwise disjoint
    const internalRegions = [r.onlyA, r.onlyB, r.onlyC, r.onlyAB, r.onlyAC, r.onlyBC, r.allThree];
    for (let i = 0; i < internalRegions.length; i++) {
      for (let j = i + 1; j < internalRegions.length; j++) {
        expect(setIntersection(internalRegions[i]!, internalRegions[j]!).size).toBe(0);
      }
    }
  });

  it("satisfies the 7-region collective exhaustiveness: sum of 7 regions = |A ∪ B ∪ C|", () => {
    const r = computeThreeSetVennRegions(universe, setA, setB, setC);
    const sum7Regions =
      r.onlyA.size +
      r.onlyB.size +
      r.onlyC.size +
      r.onlyAB.size +
      r.onlyAC.size +
      r.onlyBC.size +
      r.allThree.size;

    expect(sum7Regions).toBe(r.unionSet.size);
    expect(sum7Regions + r.outside.size).toBe(universe.size);
  });

  it("handles real respondent ID sets from demo dataset", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;
    const u = getUniverseRespondentIds(responses);
    const apple = getRespondentIdsByBrand(responses, "Apple");
    const camera = getRespondentIdsByFeature(responses, "Camera Quality");
    const battery = getRespondentIdsByFeature(responses, "Battery Life");

    const r = computeThreeSetVennRegions(u, apple, camera, battery);
    const sum7 =
      r.onlyA.size +
      r.onlyB.size +
      r.onlyC.size +
      r.onlyAB.size +
      r.onlyAC.size +
      r.onlyBC.size +
      r.allThree.size;

    expect(sum7).toBe(r.unionSet.size);
    expect(sum7 + r.outside.size).toBe(responses.length);
    expect(r.allThree.size).toBeGreaterThanOrEqual(0);
  });
});

describe("Three-Set Principle of Inclusion-Exclusion (PIE)", () => {
  it("formally verifies |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|", () => {
    const setA = new Set(["1", "2", "4", "5"]);
    const setB = new Set(["2", "3", "5", "6"]);
    const setC = new Set(["4", "5", "6", "7"]);

    const pie = verifyThreeSetInclusionExclusion(setA, setB, setC);

    expect(pie.cardA).toBe(4);
    expect(pie.cardB).toBe(4);
    expect(pie.cardC).toBe(4);
    expect(pie.cardAB).toBe(2);
    expect(pie.cardAC).toBe(2);
    expect(pie.cardBC).toBe(2);
    expect(pie.cardABC).toBe(1);

    // Singletons sum = 4 + 4 + 4 = 12
    expect(pie.singletonsSum).toBe(12);
    // Pairwise sum = 2 + 2 + 2 = 6
    expect(pie.pairwiseIntersectionsSum).toBe(6);
    // Calculated RHS = 12 - 6 + 1 = 7
    expect(pie.calculatedRhs).toBe(7);
    // Direct union size = 7 ({1, 2, 3, 4, 5, 6, 7})
    expect(pie.unionCardinality).toBe(7);
    expect(pie.isValid).toBe(true);
  });

  it("verifies on empirical survey partitions (Apple, Camera, Battery)", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;
    const apple = getRespondentIdsByBrand(responses, "Apple");
    const camera = getRespondentIdsByFeature(responses, "Camera Quality");
    const battery = getRespondentIdsByFeature(responses, "Battery Life");

    const pie = verifyThreeSetInclusionExclusion(apple, camera, battery);

    expect(pie.isValid).toBe(true);
    expect(pie.calculatedRhs).toBe(pie.unionCardinality);
  });

  it("handles completely disjoint 3 sets", () => {
    const a = new Set(["1"]);
    const b = new Set(["2"]);
    const c = new Set(["3"]);

    const pie = verifyThreeSetInclusionExclusion(a, b, c);

    expect(pie.cardAB).toBe(0);
    expect(pie.cardAC).toBe(0);
    expect(pie.cardBC).toBe(0);
    expect(pie.cardABC).toBe(0);
    expect(pie.singletonsSum).toBe(3);
    expect(pie.calculatedRhs).toBe(3);
    expect(pie.unionCardinality).toBe(3);
    expect(pie.isValid).toBe(true);
  });

  it("handles identical 3 sets (A = B = C)", () => {
    const a = new Set(["1", "2", "3"]);

    const pie = verifyThreeSetInclusionExclusion(a, a, a);

    // Singletons = 3 + 3 + 3 = 9
    // Pairwise = 3 + 3 + 3 = 9
    // Triple = 3
    // RHS = 9 - 9 + 3 = 3
    expect(pie.calculatedRhs).toBe(3);
    expect(pie.unionCardinality).toBe(3);
    expect(pie.isValid).toBe(true);
  });
});

describe("Set Complement Operations", () => {
  const universe = new Set(["1", "2", "3", "4", "5"]);
  const a = new Set(["1", "2"]);

  it("computes Aᶜ = U \\ A", () => {
    const compA = setComplement(universe, a);
    expect(Array.from(compA).sort()).toEqual(["3", "4", "5"]);
  });

  it("satisfies A ∩ Aᶜ = ∅ and A ∪ Aᶜ = U", () => {
    const compA = setComplement(universe, a);
    expect(setIntersection(a, compA).size).toBe(0);
    expect(setUnion(a, compA).size).toBe(universe.size);
  });

  it("satisfies double complement (Aᶜ)ᶜ = A", () => {
    const compA = setComplement(universe, a);
    const doubleComp = setComplement(universe, compA);
    expect(Array.from(doubleComp).sort()).toEqual(Array.from(a).sort());
  });
});
