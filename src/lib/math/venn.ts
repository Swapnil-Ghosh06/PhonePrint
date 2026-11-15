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
