# PhonePrint — Phase 01 Source Code Audit Bundle

> **Notice for Technical Reviewer (Gemini)**
> This document contains the verbatim, complete plaintext source code of the nine critical foundation files
> for Phase 01 of the PhonePrint Discrete Mathematics and Graph Theory platform (reflecting canonical 7-feature domain).
> No code has been truncated, summarized, or modified.

---

## Table of Contents

- [File 1: src/lib/math/sets.ts](#file-1-srclibmathsetsts) — *Mathematical Logic and Data*
- [File 2: src/lib/math/combinations.ts](#file-2-srclibmathcombinationsts) — *Mathematical Logic and Data*
- [File 3: src/lib/data/loader.ts](#file-3-srclibdataloaderts) — *Mathematical Logic and Data*
- [File 4: src/schemas/survey.schema.ts](#file-4-srcschemassurveyschemats) — *Data Validation and Schemas*
- [File 5: src/types/survey.ts](#file-5-srctypessurveyts) — *Data Validation and Schemas*
- [File 6: pipeline/process_survey.py](#file-6-pipelineprocesssurveypy) — *Python Pipeline*
- [File 7: pipeline/test_pipeline.py](#file-7-pipelinetestpipelinepy) — *Python Pipeline Testing*
- [File 8: src/__tests__/inclusion_exclusion.test.ts](#file-8-srctestsinclusionexclusiontestts) — *Testing*
- [File 9: src/__tests__/combinations.test.ts](#file-9-srctestscombinationstestts) — *Testing*

---

## File 1: src/lib/math/sets.ts

**Category**: Mathematical Logic and Data  
**Path**: `src/lib/math/sets.ts`  
**Total Lines**: 221  
**Total Characters**: 4908  

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

---

## File 2: src/lib/math/combinations.ts

**Category**: Mathematical Logic and Data  
**Path**: `src/lib/math/combinations.ts`  
**Total Lines**: 146  
**Total Characters**: 3922  

```typescript
/**
 * PhonePrint - Discrete Mathematics Foundation
 * Combinatorics & Combinations Utilities
 *
 * Implements pure functions for calculating nCr (binomial coefficients)
 * and enumerating combinations of feature subsets.
 */

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
```

---

## File 3: src/lib/data/loader.ts

**Category**: Mathematical Logic and Data  
**Path**: `src/lib/data/loader.ts`  
**Total Lines**: 123  
**Total Characters**: 3275  

```typescript
/**
 * PhonePrint - Data Ingestion and Set Extraction Utilities
 * Transforms survey records into discrete sets of respondent IDs for mathematical processing.
 */

import demoDataJson from "@/data/survey_demo_data.json";
import { surveyDatasetSchema } from "@/schemas/survey.schema";
import type {
  SurveyDataset,
  SurveyResponse,
  SmartphoneBrand,
  SmartphoneFeature,
  OSPreference,
  BudgetRange,
  PrimaryUse,
} from "@/types/survey";

/**
 * Loads and validates the demo survey dataset using the Zod schema.
 */
export function loadDemoSurveyDataset(): SurveyDataset {
  const result = surveyDatasetSchema.safeParse(demoDataJson);
  if (!result.success) {
    throw new Error(
      `Demo dataset validation failed: ${result.error.issues.map((i) => i.message).join(", ")}`
    );
  }
  return result.data as unknown as SurveyDataset;
}

/**
 * Returns a discrete set of respondent IDs preferring a specific smartphone brand:
 * S_brand = { id ∈ U | response(id).brand = brand }
 */
export function getRespondentIdsByBrand(
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
 * Returns a discrete set of respondent IDs selecting a given feature:
 * S_feature = { id ∈ U | feature ∈ response(id).preferred_features }
 */
export function getRespondentIdsByFeature(
  responses: readonly SurveyResponse[],
  feature: SmartphoneFeature
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_features.includes(feature)) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs with a given OS preference:
 * S_os = { id ∈ U | response(id).os = os }
 */
export function getRespondentIdsByOS(
  responses: readonly SurveyResponse[],
  os: OSPreference
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.os_preference === os) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs within a budget range:
 * S_budget = { id ∈ U | response(id).budget = budget }
 */
export function getRespondentIdsByBudget(
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
 * Returns a discrete set of respondent IDs with a given primary use:
 * S_use = { id ∈ U | response(id).primary_use = use }
 */
export function getRespondentIdsByPrimaryUse(
  responses: readonly SurveyResponse[],
  use: PrimaryUse
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.primary_use === use) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns the entire universe of respondent IDs: U = { id | response(id) ∈ responses }
 */
export function getUniverseRespondentIds(
  responses: readonly SurveyResponse[]
): Set<string> {
  return new Set(responses.map((r) => r.response_id));
}
```

---

## File 4: src/schemas/survey.schema.ts

**Category**: Data Validation and Schemas  
**Path**: `src/schemas/survey.schema.ts`  
**Total Lines**: 101  
**Total Characters**: 2988  

```typescript
import { z } from "zod";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
  type SmartphoneFeature,
} from "@/types/survey";

/**
 * Zod schema for individual smartphone brand enum.
 */
export const smartphoneBrandSchema = z.enum(SMARTPHONE_BRANDS);

/**
 * Zod schema for budget range categories.
 */
export const budgetRangeSchema = z.enum(BUDGET_RANGES);

/**
 * Zod schema for individual smartphone features.
 */
export const smartphoneFeatureSchema = z.enum(SMARTPHONE_FEATURES);

/**
 * Zod schema for primary usage classification.
 */
export const primaryUseSchema = z.enum(PRIMARY_USES);

/**
 * Zod schema for operating system preference.
 */
export const osPreferenceSchema = z.enum(OS_PREFERENCES);

/**
 * Zod schema for a single anonymous survey response.
 * Enforces exactly three distinct feature selections.
 */
export const surveyResponseSchema = z.object({
  response_id: z
    .string()
    .min(1, "Respondent ID cannot be empty")
    .regex(/^[A-Za-z0-9_-]+$/, "Respondent ID must contain only alphanumeric characters, dashes, or underscores"),
  preferred_brand: smartphoneBrandSchema,
  budget_range: budgetRangeSchema,
  preferred_features: z
    .array(smartphoneFeatureSchema)
    .length(3, "Respondent must select exactly 3 preferred features")
    .refine(
      (features) => new Set(features).size === 3,
      "Feature selections must contain exactly 3 distinct features"
    )
    .transform((features) => features as unknown as [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature]),
  primary_use: primaryUseSchema,
  os_preference: osPreferenceSchema,
});

/**
 * Zod schema for an array of survey responses.
 * Enforces global uniqueness of respondent IDs across the entire dataset.
 */
export const surveyResponseListSchema = z
  .array(surveyResponseSchema)
  .superRefine((responses, ctx) => {
    const seenIds = new Set<string>();
    const duplicateIds = new Set<string>();

    responses.forEach((resp, index) => {
      if (seenIds.has(resp.response_id)) {
        duplicateIds.add(resp.response_id);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate respondent ID detected: "${resp.response_id}" at index ${index}`,
          path: [index, "response_id"],
        });
      } else {
        seenIds.add(resp.response_id);
      }
    });
  });

/**
 * Complete Survey Dataset container schema with metadata validation.
 */
export const surveyDatasetSchema = z.object({
  metadata: z.object({
    version: z.string().min(1),
    generated_at: z.string().min(1),
    total_responses: z.number().int().nonnegative(),
    is_demo: z.boolean(),
    description: z.string(),
  }),
  responses: surveyResponseListSchema,
}).refine(
  (data) => data.metadata.total_responses === data.responses.length,
  {
    message: "Metadata total_responses count does not match the actual number of responses",
    path: ["metadata", "total_responses"],
  }
);
```

---

## File 5: src/types/survey.ts

**Category**: Data Validation and Schemas  
**Path**: `src/types/survey.ts`  
**Total Lines**: 91  
**Total Characters**: 2077  

```typescript
/**
 * PhonePrint - Anonymous Smartphone Survey Data Models
 * Developed for University Discrete Mathematics & Graph Theory Experiential Learning.
 */

export const SMARTPHONE_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Motorola",
  "Other",
] as const;

export type SmartphoneBrand = (typeof SMARTPHONE_BRANDS)[number];

export const BUDGET_RANGES = [
  "Under $400",
  "$400 - $700",
  "$700 - $1,000",
  "Over $1,000",
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const SMARTPHONE_FEATURES = [
  "Camera Quality",
  "Battery Life",
  "Processing Performance",
  "Display Quality",
  "Storage Capacity",
  "Build & Design Quality",
  "Software & OS Experience",
] as const;

export type SmartphoneFeature = (typeof SMARTPHONE_FEATURES)[number];

export const PRIMARY_USES = [
  "Photography & Videography",
  "Gaming",
  "Business & Productivity",
  "Social Media & Content Consumption",
  "Everyday General Use",
] as const;

export type PrimaryUse = (typeof PRIMARY_USES)[number];

export const OS_PREFERENCES = [
  "Android",
  "iOS",
  "No Preference",
] as const;

export type OSPreference = (typeof OS_PREFERENCES)[number];

/**
 * Anonymous survey response record.
 * Represents a single respondent's preferences.
 */
export interface SurveyResponse {
  readonly response_id: string;
  readonly preferred_brand: SmartphoneBrand;
  readonly budget_range: BudgetRange;
  /**
   * Exactly three distinct feature preferences.
   */
  readonly preferred_features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  readonly primary_use: PrimaryUse;
  readonly os_preference: OSPreference;
}

/**
 * Survey Dataset container with metadata.
 */
export interface SurveyDatasetMetadata {
  readonly version: string;
  readonly generated_at: string;
  readonly total_responses: number;
  readonly is_demo: boolean;
  readonly description: string;
}

export interface SurveyDataset {
  readonly metadata: SurveyDatasetMetadata;
  readonly responses: readonly SurveyResponse[];
}
```

---

## File 6: pipeline/process_survey.py

**Category**: Python Pipeline  
**Path**: `pipeline/process_survey.py`  
**Total Lines**: 330  
**Total Characters**: 11314  

```python
"""
PhonePrint - Offline Survey Data Processing Pipeline
Academic Project: Discrete Mathematics & Graph Theory Experiential Learning

Processes raw survey CSV files, validates integrity, normalizes values,
enforces 3-feature distinctness and respondent ID uniqueness,
and exports structured JSON datasets.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple

import pandas as pd

# Canonical domain enumerations for strict validation and normalization
CANONICAL_BRANDS = {
    "apple": "Apple",
    "samsung": "Samsung",
    "google": "Google",
    "oneplus": "OnePlus",
    "xiaomi": "Xiaomi",
    "motorola": "Motorola",
    "other": "Other",
}

CANONICAL_BUDGETS = {
    "under $400": "Under $400",
    "<$400": "Under $400",
    "$400 - $700": "$400 - $700",
    "$400-$700": "$400 - $700",
    "$700 - $1,000": "$700 - $1,000",
    "$700-$1000": "$700 - $1,000",
    "$700 - $1000": "$700 - $1,000",
    "over $1,000": "Over $1,000",
    "over $1000": "Over $1,000",
    ">$1000": "Over $1,000",
}

CANONICAL_FEATURES = {
    "camera quality": "Camera Quality",
    "camera": "Camera Quality",
    "battery life": "Battery Life",
    "battery": "Battery Life",
    "processing performance": "Processing Performance",
    "processing speed": "Processing Performance",
    "processor": "Processing Performance",
    "performance": "Processing Performance",
    "display quality": "Display Quality",
    "display": "Display Quality",
    "storage capacity": "Storage Capacity",
    "storage": "Storage Capacity",
    "build & design quality": "Build & Design Quality",
    "build & design": "Build & Design Quality",
    "build quality": "Build & Design Quality",
    "build": "Build & Design Quality",
    "design": "Build & Design Quality",
    "software & os experience": "Software & OS Experience",
    "software": "Software & OS Experience",
    "os experience": "Software & OS Experience",
}

CANONICAL_PRIMARY_USES = {
    "photography & videography": "Photography & Videography",
    "photography": "Photography & Videography",
    "gaming": "Gaming",
    "business & productivity": "Business & Productivity",
    "productivity": "Business & Productivity",
    "social media & content consumption": "Social Media & Content Consumption",
    "social media": "Social Media & Content Consumption",
    "everyday general use": "Everyday General Use",
    "general": "Everyday General Use",
}

CANONICAL_OS = {
    "android": "Android",
    "ios": "iOS",
    "no preference": "No Preference",
    "none": "No Preference",
}

REQUIRED_COLUMNS = [
    "response_id",
    "preferred_brand",
    "budget_range",
    "preferred_features",
    "primary_use",
    "os_preference",
]


class ValidationError(Exception):
    """Raised when survey data fails structural or mathematical validity requirements."""

    def __init__(self, message: str, errors: List[str] | None = None) -> None:
        super().__init__(message)
        self.errors = errors or [message]


def normalize_text(text: Any) -> str:
    """Trim whitespace and collapse internal duplicate spaces."""
    if pd.isna(text):
        return ""
    return " ".join(str(text).strip().split())


def parse_and_validate_features(
    raw_features: str, row_idx: int
) -> Tuple[str, str, str]:
    """
    Parses delimited features (separated by semicolon, comma, or pipe)
    and verifies that exactly three distinct canonical features are provided.
    """
    raw_str = normalize_text(raw_features)
    if not raw_str:
        raise ValidationError(f"Row {row_idx}: 'preferred_features' cannot be empty")

    # Support semicolon, comma, or pipe delimiters
    delimiter = ";" if ";" in raw_str else ("," if "," in raw_str else "|")
    tokens = [normalize_text(t) for t in raw_str.split(delimiter) if normalize_text(t)]

    normalized_features: List[str] = []
    seen: Set[str] = set()

    for token in tokens:
        canonical = CANONICAL_FEATURES.get(token.lower())
        if not canonical:
            valid_list = ", ".join(sorted(set(CANONICAL_FEATURES.values())))
            raise ValidationError(
                f"Row {row_idx}: Unrecognized feature '{token}'. Valid options: {valid_list}"
            )
        if canonical in seen:
            raise ValidationError(
                f"Row {row_idx}: Duplicate feature '{canonical}' specified in selection"
            )
        seen.add(canonical)
        normalized_features.append(canonical)

    if len(normalized_features) != 3:
        raise ValidationError(
            f"Row {row_idx}: Exactly 3 distinct features must be selected; received {len(normalized_features)} ({normalized_features})"
        )

    return (normalized_features[0], normalized_features[1], normalized_features[2])


def process_survey_csv(
    csv_path: str | Path,
    output_json_path: str | Path | None = None,
    is_demo: bool = True,
) -> Dict[str, Any]:
    """
    Reads a survey CSV, validates integrity, normalizes values,
    detects duplicate respondent IDs, and produces a structured dataset dictionary.
    """
    csv_file = Path(csv_path)
    if not csv_file.exists():
        raise FileNotFoundError(f"Survey CSV file not found: {csv_file}")

    # Read CSV, ignoring lines starting with '#'
    df = pd.read_csv(csv_file, comment="#", dtype=str)

    # 1. Validate required columns
    missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing_cols:
        raise ValidationError(
            f"CSV file is missing required columns: {missing_cols}. Expected: {REQUIRED_COLUMNS}"
        )

    errors: List[str] = []
    cleaned_responses: List[Dict[str, Any]] = []
    seen_response_ids: Set[str] = set()

    for idx, (_, row) in enumerate(df.iterrows(), start=2):
        row_num = idx  # 1-based index plus header

        # 2. Respondent ID validation & duplicate detection
        resp_id = normalize_text(row["response_id"])
        if not resp_id:
            errors.append(f"Row {row_num}: Missing 'response_id'")
            continue

        if resp_id in seen_response_ids:
            errors.append(f"Row {row_num}: Duplicate respondent ID detected '{resp_id}'")
        else:
            seen_response_ids.add(resp_id)

        # 3. Brand normalization
        brand_raw = normalize_text(row["preferred_brand"]).lower()
        brand = CANONICAL_BRANDS.get(brand_raw)
        if not brand:
            errors.append(
                f"Row {row_num}: Invalid brand '{row['preferred_brand']}'. Allowed: {list(CANONICAL_BRANDS.values())}"
            )

        # 4. Budget range normalization
        budget_raw = normalize_text(row["budget_range"]).lower()
        budget = CANONICAL_BUDGETS.get(budget_raw)
        if not budget:
            errors.append(
                f"Row {row_num}: Invalid budget range '{row['budget_range']}'"
            )

        # 5. Preferred features validation (exactly 3 distinct)
        features_tuple: Tuple[str, str, str] | None = None
        try:
            features_tuple = parse_and_validate_features(row["preferred_features"], row_num)
        except ValidationError as e:
            errors.append(str(e))

        # 6. Primary use normalization
        use_raw = normalize_text(row["primary_use"]).lower()
        primary_use = CANONICAL_PRIMARY_USES.get(use_raw)
        if not primary_use:
            errors.append(
                f"Row {row_num}: Invalid primary use '{row['primary_use']}'"
            )

        # 7. OS preference normalization
        os_raw = normalize_text(row["os_preference"]).lower()
        os_pref = CANONICAL_OS.get(os_raw)
        if not os_pref:
            errors.append(
                f"Row {row_num}: Invalid OS preference '{row['os_preference']}'"
            )

        if brand and budget and features_tuple and primary_use and os_pref:
            cleaned_responses.append({
                "response_id": resp_id,
                "preferred_brand": brand,
                "budget_range": budget,
                "preferred_features": list(features_tuple),
                "primary_use": primary_use,
                "os_preference": os_pref,
            })

    if errors:
        raise ValidationError(
            f"Encountered {len(errors)} validation error(s) during CSV processing",
            errors=errors,
        )

    output_dataset: Dict[str, Any] = {
        "metadata": {
            "version": "1.0.0",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_responses": len(cleaned_responses),
            "is_demo": is_demo,
            "description": (
                "DEMO BENCHMARK DATASET - Academic Discrete Mathematics and Graph Theory project. "
                "Synthetic data for architecture testing only."
                if is_demo
                else "Empirical Survey Responses - PhonePrint Research Study"
            ),
        },
        "responses": cleaned_responses,
    }

    if output_json_path:
        out_file = Path(output_json_path)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(output_dataset, f, indent=2, ensure_ascii=False)
            f.write("\n")

    return output_dataset


def main() -> None:
    parser = argparse.ArgumentParser(
        description="PhonePrint Survey CSV Cleaning and Normalization Pipeline"
    )
    parser.add_argument(
        "--input",
        "-i",
        default="pipeline/data/survey_demo_data.csv",
        help="Path to raw CSV survey file",
    )
    parser.add_argument(
        "--output",
        "-o",
        default="pipeline/data/survey_demo_data.json",
        help="Path to save cleaned JSON dataset",
    )
    parser.add_argument(
        "--sync-web-data",
        action="store_true",
        help="Also write to src/data/survey_demo_data.json for Next.js app",
    )
    parser.add_argument(
        "--demo",
        action="store_true",
        default=True,
        help="Mark dataset as synthetic demo data",
    )

    args = parser.parse_args()

    print(f"[PhonePrint Pipeline] Reading CSV: {args.input}")
    try:
        dataset = process_survey_csv(args.input, args.output, is_demo=args.demo)
        print(f"[PhonePrint Pipeline] Success: Processed {dataset['metadata']['total_responses']} responses.")
        print(f"[PhonePrint Pipeline] Output written to: {args.output}")

        if args.sync_web_data:
            web_output = Path("src/data/survey_demo_data.json")
            web_output.parent.mkdir(parents=True, exist_ok=True)
            with open(web_output, "w", encoding="utf-8") as f:
                json.dump(dataset, f, indent=2, ensure_ascii=False)
                f.write("\n")
            print(f"[PhonePrint Pipeline] Synced to web data: {web_output}")

    except ValidationError as ve:
        print(f"[PhonePrint Pipeline] Validation Failed: {ve}", file=sys.stderr)
        for err in ve.errors:
            print(f"  - {err}", file=sys.stderr)
        sys.exit(1)
    except Exception as exc:
        print(f"[PhonePrint Pipeline] Unexpected Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
```

---

## File 7: pipeline/test_pipeline.py

**Category**: Python Pipeline Testing  
**Path**: `pipeline/test_pipeline.py`  
**Total Lines**: 110  
**Total Characters**: 4945  

```python
"""
Unit and integration tests for the PhonePrint Python pipeline.
Verifies data ingestion, validation rules, normalization, and error handling.
"""

import tempfile
import unittest
from pathlib import Path
from pipeline.process_survey import (
    process_survey_csv,
    ValidationError,
    parse_and_validate_features,
)


class TestPhonePrintPipeline(unittest.TestCase):

    def test_process_valid_demo_data(self):
        """Verifies ingestion, normalization, and JSON output of valid demo CSV data."""
        csv_path = Path("pipeline/data/survey_demo_data.csv")
        self.assertTrue(csv_path.exists(), "Demo CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(csv_path, tmp_path, is_demo=True)
            self.assertTrue(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 12)
            self.assertEqual(len(dataset["responses"]), 12)

            first = dataset["responses"][0]
            self.assertEqual(first["response_id"], "DEMO_RESP_001")
            self.assertEqual(first["preferred_brand"], "Apple")
            self.assertEqual(first["budget_range"], "Over $1,000")
            self.assertEqual(len(first["preferred_features"]), 3)
            self.assertIn("Camera Quality", first["preferred_features"])
            self.assertEqual(first["os_preference"], "iOS")
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_rejects_duplicate_respondent_ids(self):
        """Verifies that duplicate respondent IDs in the CSV are detected and rejected."""
        duplicate_csv = '''response_id,preferred_brand,budget_range,preferred_features,primary_use,os_preference
RESP_001,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
RESP_001,Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(duplicate_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("Duplicate respondent ID detected 'RESP_001'", str(ctx.exception.errors))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_rejects_fewer_than_three_features(self):
        """Verifies that selections with fewer than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features("Camera Quality; Battery Life", row_idx=1)
        self.assertIn("Exactly 3 distinct features must be selected; received 2", str(ctx.exception))

    def test_rejects_more_than_three_features(self):
        """Verifies that selections with more than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Processing Performance; Display Quality", row_idx=1
            )
        self.assertIn("Exactly 3 distinct features must be selected; received 4", str(ctx.exception))

    def test_rejects_duplicate_features_in_selection(self):
        """Verifies that duplicate features within the same respondent selection are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Camera Quality", row_idx=2
            )
        self.assertIn("Duplicate feature 'Camera Quality'", str(ctx.exception))

    def test_rejects_unrecognized_features(self):
        """Verifies that removed or unrecognized features (e.g. 5G, Fast Charging) are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; 5G Connectivity", row_idx=3
            )
        self.assertIn("Unrecognized feature '5G Connectivity'", str(ctx.exception))

    def test_rejects_missing_required_columns(self):
        """Verifies that CSV files missing required header columns are rejected."""
        incomplete_csv = """response_id,preferred_brand,budget_range
RESP_001,Apple,Over $1,000
"""
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(incomplete_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("missing required columns", str(ctx.exception))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()


if __name__ == "__main__":
    unittest.main()
```

---

## File 8: src/__tests__/inclusion_exclusion.test.ts

**Category**: Testing  
**Path**: `src/__tests__/inclusion_exclusion.test.ts`  
**Total Lines**: 117  
**Total Characters**: 4347  

```typescript
import { describe, it, expect } from "vitest";
import {
  setIntersection,
  setUnion,
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  loadDemoSurveyDataset,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByOS,
} from "@/lib/data/loader";

describe("Principle of Inclusion-Exclusion (PIE) Formal Verification", () => {
  it("satisfies |A ∪ B| = |A| + |B| - |A ∩ B| for synthetic overlapping sets", () => {
    const setA = new Set(["RESP_001", "RESP_002", "RESP_003", "RESP_004"]);
    const setB = new Set(["RESP_003", "RESP_004", "RESP_005", "RESP_006", "RESP_007"]);

    const verification = verifyInclusionExclusionPrinciple(setA, setB);

    expect(verification.isValid).toBe(true);
    expect(verification.unionCardinality).toBe(7);
    expect(verification.individualCardinalitiesSum).toBe(4 + 5); // 9
    expect(verification.intersectionCardinality).toBe(2);
    expect(verification.calculatedRhs).toBe(9 - 2); // 7
    expect(verification.unionCardinality).toBe(verification.calculatedRhs);
  });

  it("satisfies PIE for mutually disjoint sets (intersection is empty)", () => {
    const setA = new Set(["RESP_A1", "RESP_A2", "RESP_A3"]);
    const setB = new Set(["RESP_B1", "RESP_B2"]);

    const verification = verifyInclusionExclusionPrinciple(setA, setB);

    expect(verification.isValid).toBe(true);
    expect(verification.intersectionCardinality).toBe(0);
    expect(verification.unionCardinality).toBe(5);
    expect(verification.calculatedRhs).toBe(3 + 2 - 0);
  });

  it("satisfies PIE when one set is a subset of another (A ⊆ B)", () => {
    const setA = new Set(["RESP_001", "RESP_002"]);
    const setB = new Set(["RESP_001", "RESP_002", "RESP_003", "RESP_004"]);

    const verification = verifyInclusionExclusionPrinciple(setA, setB);

    expect(verification.isValid).toBe(true);
    expect(verification.intersectionCardinality).toBe(2);
    expect(verification.unionCardinality).toBe(4);
    expect(verification.calculatedRhs).toBe(2 + 4 - 2);
  });

  it("satisfies PIE with empty sets", () => {
    const empty = new Set<string>();
    const nonNull = new Set(["RESP_001"]);

    const v1 = verifyInclusionExclusionPrinciple(empty, nonNull);
    expect(v1.isValid).toBe(true);
    expect(v1.unionCardinality).toBe(1);

    const v2 = verifyInclusionExclusionPrinciple(empty, empty);
    expect(v2.isValid).toBe(true);
    expect(v2.unionCardinality).toBe(0);
  });

  it("verifies PIE across real survey respondent sets from demo data", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;

    // Set A: Respondents who prefer Apple
    const appleRespondents = getRespondentIdsByBrand(responses, "Apple");
    // Set B: Respondents who selected 'Camera Quality'
    const cameraRespondents = getRespondentIdsByFeature(responses, "Camera Quality");

    const verification = verifyInclusionExclusionPrinciple(
      appleRespondents,
      cameraRespondents
    );

    expect(verification.isValid).toBe(true);
    expect(verification.unionCardinality).toBe(
      appleRespondents.size + cameraRespondents.size - verification.intersectionCardinality
    );

    // Verify set operations operated on authentic respondent IDs rather than scalar counts
    for (const id of verification.intersectionSet) {
      expect(appleRespondents.has(id)).toBe(true);
      expect(cameraRespondents.has(id)).toBe(true);
    }
  });

  it("verifies 3-set Inclusion-Exclusion Principle: |A ∪ B ∪ C|", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;

    const setA = getRespondentIdsByBrand(responses, "Samsung");
    const setB = getRespondentIdsByFeature(responses, "Battery Life");
    const setC = getRespondentIdsByOS(responses, "Android");

    const unionABC = setUnion(setUnion(setA, setB), setC);
    const cardUnion = unionABC.size;

    const cardA = setA.size;
    const cardB = setB.size;
    const cardC = setC.size;

    const intAB = setIntersection(setA, setB).size;
    const intAC = setIntersection(setA, setC).size;
    const intBC = setIntersection(setB, setC).size;

    const intABC = setIntersection(setIntersection(setA, setB), setC).size;

    const rhs = (cardA + cardB + cardC) - (intAB + intAC + intBC) + intABC;

    expect(cardUnion).toBe(rhs);
  });
});
```

---

## File 9: src/__tests__/combinations.test.ts

**Category**: Testing  
**Path**: `src/__tests__/combinations.test.ts`  
**Total Lines**: 125  
**Total Characters**: 4869  

```typescript
import { describe, it, expect } from "vitest";
import {
  calculateCombinations,
  calculatePermutations,
  enumerateCombinations,
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
});
```

---
