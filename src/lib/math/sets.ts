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
