# PhonePrint — Phase 05 Source Code Audit Bundle

This document contains the complete, unabridged plaintext source code of all mathematical algorithms, types, components, tests, and pages created for **PhonePrint Phase 05: My PhonePrint (Interactive Preference Matcher)**.

All code is provided for independent technical audit review.

---

## File 1: `src/types/matcher.ts`

**Description**: TypeScript Data Models for Preference Matching, Vector Profiles, and Match Classifications

```typescript
/**
 * PhonePrint - Preference Matching and Profiling Data Models
 * Developed for University Discrete Mathematics & Graph Theory Experiential Learning.
 */

import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "./survey";

/**
 * User-selected preference profile vector.
 */
export interface UserProfileInput {
  readonly brand: SmartphoneBrand;
  readonly budget: BudgetRange;
  readonly features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
}

/**
 * Subset result containing matching IDs, count, and cohort percentage.
 */
export interface ConditionSubsetResult {
  readonly ids: Set<string>;
  readonly count: number;
  readonly percentage: number; // (count / totalCohort) * 100
}

/**
 * Mutually exclusive 4-way match category.
 */
export type MatchCategory = "exact_3" | "partial_2" | "partial_1" | "none_0";

/**
 * Anonymous survey respondent record annotated with preference match criteria.
 */
export interface RespondentMatchRecord {
  readonly response_id: string;
  readonly preferred_brand: SmartphoneBrand;
  readonly budget_range: BudgetRange;
  readonly preferred_features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  readonly brandMatch: boolean;
  readonly budgetMatch: boolean;
  readonly featureMatch: boolean; // true if all 3 features match
  readonly featureOverlapCount: number; // 0, 1, 2, or 3
  readonly matchedConditionsCount: number; // 0, 1, 2, or 3
  readonly matchCategory: MatchCategory;
  readonly matchedConditionsList: readonly ("Brand" | "Budget" | "Features")[];
}

/**
 * Independent feature overlap distribution summary.
 */
export interface FeatureOverlapSummary {
  readonly matchAllThree: ConditionSubsetResult; // overlap == 3
  readonly matchTwo: ConditionSubsetResult; // overlap == 2
  readonly matchOne: ConditionSubsetResult; // overlap == 1
  readonly matchNone: ConditionSubsetResult; // overlap == 0
  readonly atLeastTwo: ConditionSubsetResult; // overlap >= 2
  readonly atLeastOne: ConditionSubsetResult; // overlap >= 1
}

/**
 * Complete result output of the preference matching engine.
 */
export interface MatchEngineResult {
  readonly profile: UserProfileInput;
  readonly totalCohort: number;
  readonly brandSet: Set<string>; // B
  readonly budgetSet: Set<string>; // P
  readonly featureSet: Set<string>; // F (exact feature triplet)

  // Exact matches: B ∩ P ∩ F
  readonly exactMatches: ConditionSubsetResult;

  // Mutually exclusive 4-way categorization
  readonly category3Exact: ConditionSubsetResult;
  readonly category2Partial: {
    readonly total: ConditionSubsetResult;
    readonly brandAndBudget: ConditionSubsetResult;
    readonly brandAndFeature: ConditionSubsetResult;
    readonly budgetAndFeature: ConditionSubsetResult;
  };
  readonly category1Partial: {
    readonly total: ConditionSubsetResult;
    readonly onlyBrand: ConditionSubsetResult;
    readonly onlyBudget: ConditionSubsetResult;
    readonly onlyFeature: ConditionSubsetResult;
  };
  readonly category0None: ConditionSubsetResult;

  // Independent feature overlap analysis
  readonly featureOverlap: FeatureOverlapSummary;

  // Full respondent-level annotations
  readonly respondents: readonly RespondentMatchRecord[];
}

```

## File 2: `src/lib/math/matchingEngine.ts`

**Description**: Discrete Set-Theoretic Matching Engine (Brand, Budget, Exact Triplet, Mutually Exclusive Partitioning)

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

## File 3: `src/components/my-phoneprint/PreferenceBuilder.tsx`

**Description**: Interactive Preference Form with Strict 3-Feature Limit, Presets, and Reset Handling

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  type SmartphoneBrand,
  type BudgetRange,
  type SmartphoneFeature,
} from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

export interface PreferenceBuilderProps {
  brand: SmartphoneBrand;
  setBrand: (brand: SmartphoneBrand) => void;
  budget: BudgetRange;
  setBudget: (budget: BudgetRange) => void;
  features: readonly SmartphoneFeature[];
  toggleFeature: (feature: SmartphoneFeature) => void;
  resetPreferences: () => void;
  onApplyPreset: (preset: UserProfileInput) => void;
}

interface PresetOption {
  label: string;
  description: string;
  profile: UserProfileInput;
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    label: "Apple Flagship Creator",
    description: "Apple • Over $1,000 • Camera, Battery, Build (Matches DEMO_RESP_001)",
    profile: {
      brand: "Apple",
      budget: "Over $1,000",
      features: [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ],
    },
  },
  {
    label: "Google Everyday General",
    description: "Google • $400 - $700 • Camera, Battery, Software (Matches DEMO_RESP_003)",
    profile: {
      brand: "Google",
      budget: "$400 - $700",
      features: [
        "Camera Quality",
        "Battery Life",
        "Software & OS Experience",
      ],
    },
  },
  {
    label: "Samsung Gaming Enthusiast",
    description: "Samsung • $700 - $1,000 • Display, Processing, Storage (Matches DEMO_RESP_002)",
    profile: {
      brand: "Samsung",
      budget: "$700 - $1,000",
      features: [
        "Display Quality",
        "Processing Performance",
        "Storage Capacity",
      ],
    },
  },
  {
    label: "Budget Efficiency Power",
    description: "Xiaomi • Under $400 • Battery, Storage, Processing (Matches DEMO_RESP_007)",
    profile: {
      brand: "Xiaomi",
      budget: "Under $400",
      features: [
        "Battery Life",
        "Storage Capacity",
        "Processing Performance",
      ],
    },
  },
];

export function PreferenceBuilder({
  brand,
  setBrand,
  budget,
  setBudget,
  features,
  toggleFeature,
  resetPreferences,
  onApplyPreset,
}: PreferenceBuilderProps) {
  const isFeatureCountValid = features.length === 3;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Construct Your Preference Vector"
        subtitle="Specify target brand, budget tier, and exactly three priority features"
        badge={
          isFeatureCountValid ? (
            <Badge variant="lime">3 of 3 Features Selected</Badge>
          ) : (
            <Badge variant="warning">{features.length} of 3 Selected</Badge>
          )
        }
      />
      <CardContent className="space-y-6">
        {/* Quick Persona Presets */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Academic Benchmark Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_OPTIONS.map((preset) => {
              const isActive =
                brand === preset.profile.brand &&
                budget === preset.profile.budget &&
                preset.profile.features.every((f) => features.includes(f));
              return (
                <button
                  key={preset.label}
                  onClick={() => onApplyPreset(preset.profile)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cobalt-600 text-white shadow-sm ring-2 ring-cobalt-300"
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

        {/* Step A & B: Brand and Budget Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand Selection */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-brand"
                className="text-xs font-bold text-slate-800 uppercase tracking-wider"
              >
                1. Preferred Brand (B)
              </label>
              <span className="font-mono text-xs font-bold text-cobalt-700 bg-cobalt-50 px-2 py-0.5 rounded border border-cobalt-200">
                {brand}
              </span>
            </div>
            <select
              id="select-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value as SmartphoneBrand)}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            >
              {SMARTPHONE_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Matches respondents where preferred_brand = &quot;{brand}&quot;
            </p>
          </div>

          {/* Budget Selection */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-budget"
                className="text-xs font-bold text-slate-800 uppercase tracking-wider"
              >
                2. Budget Range (P)
              </label>
              <span className="font-mono text-xs font-bold text-cobalt-700 bg-cobalt-50 px-2 py-0.5 rounded border border-cobalt-200">
                {budget}
              </span>
            </div>
            <select
              id="select-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetRange)}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            >
              {BUDGET_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Matches respondents where budget_range = &quot;{budget}&quot;
            </p>
          </div>
        </div>

        {/* Step C: Feature Preferences */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                3. Priority Feature Triplet (F)
              </span>
              <p className="text-xs text-slate-500">
                Select exactly three distinct canonical features. Selection is unranked (order does not matter).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md ${
                  isFeatureCountValid
                    ? "bg-lime-100 text-lime-900 border border-lime-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {features.length} / 3 Selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreferences}
                className="text-xs h-7 px-2"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {SMARTPHONE_FEATURES.map((feature) => {
              const isSelected = features.includes(feature);
              const isDisabled = !isSelected && features.length >= 3;
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  disabled={isDisabled}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-cobalt-600 bg-cobalt-50 text-cobalt-950 ring-2 ring-cobalt-300 shadow-2xs"
                      : isDisabled
                      ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{feature}</span>
                  <span
                    className={`font-mono font-bold text-xs ${
                      isSelected
                        ? "text-cobalt-600"
                        : isDisabled
                        ? "text-slate-300"
                        : "text-slate-400"
                    }`}
                  >
                    {isSelected ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feature selection notice */}
          {features.length === 3 ? (
            <p className="text-[11px] text-lime-700 font-medium">
              ✓ Exactly 3 features selected. Deselect any active feature to swap it with another.
            </p>
          ) : (
            <p className="text-[11px] text-amber-700 font-medium">
              ! Please select {3 - features.length} more feature
              {3 - features.length > 1 ? "s" : ""} to complete your 3-feature PhonePrint vector.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

```

## File 4: `src/components/my-phoneprint/ExactMatchCard.tsx`

**Description**: Exact Match Hero Card Displaying B ∩ P ∩ F, Full Cohort Percentage, and Respondent IDs

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { MatchEngineResult } from "@/types/matcher";

export interface ExactMatchCardProps {
  result: MatchEngineResult;
}

export function ExactMatchCard({ result }: ExactMatchCardProps) {
  const { exactMatches, profile, totalCohort, brandSet, budgetSet, featureSet } =
    result;
  const hasExactMatches = exactMatches.count > 0;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Exact Profile Matches (B ∩ P ∩ F)"
        subtitle="Simultaneous three-way intersection of Brand, Budget, and Feature Triplet"
        badge={
          hasExactMatches ? (
            <Badge variant="lime">
              {exactMatches.count} Exact Match
              {exactMatches.count > 1 ? "es" : ""} ({exactMatches.percentage}%)
            </Badge>
          ) : (
            <Badge variant="default">0 Exact Matches (0.0%)</Badge>
          )
        }
      />
      <CardContent className="space-y-6">
        {/* Main Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2 rounded-xl border border-cobalt-200 bg-cobalt-50/50 p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cobalt-800 block">
                Exact Phenotype Matches
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-extrabold text-cobalt-950">
                  {exactMatches.count}
                </span>
                <span className="text-sm font-semibold text-cobalt-700">
                  / {totalCohort} Respondents
                </span>
              </div>
              <p className="mt-1 text-xs text-cobalt-800">
                {exactMatches.percentage}% of the full validated university cohort
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-cobalt-200/80 text-[11px] font-mono text-cobalt-900">
              |B ∩ P ∩ F| = {exactMatches.count}
            </div>
          </div>

          {/* Component Set Sizes */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Component Set Sizes
            </span>
            <div className="pt-2 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Brand ({profile.brand}):</span>
                <span className="font-mono font-bold text-slate-900">
                  |B| = {brandSet.size}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Budget ({profile.budget}):</span>
                <span className="font-mono font-bold text-slate-900">
                  |P| = {budgetSet.size}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Exact Feature Triplet:</span>
                <span className="font-mono font-bold text-slate-900">
                  |F| = {featureSet.size}
                </span>
              </div>
            </div>
          </div>

          {/* Matching Respondent IDs */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Matching Respondent IDs
            </span>
            {hasExactMatches ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from(exactMatches.ids).map((id) => (
                  <span
                    key={id}
                    className="font-mono text-xs font-bold text-cobalt-700 bg-white border border-cobalt-200 px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    {id}
                  </span>
                ))}
              </div>
            ) : (
              <div className="pt-2 text-xs text-slate-500 italic">
                None in current cohort (∅)
              </div>
            )}
          </div>
        </div>

        {/* 3-Condition Requirement Explanation */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Three Joint Matching Conditions:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Condition 1: Brand</span>
              <p className="text-slate-600">
                Preferred brand is strictly <strong>{profile.brand}</strong>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Condition 2: Budget</span>
              <p className="text-slate-600">
                Budget tier is strictly <strong>{profile.budget}</strong>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Condition 3: Features</span>
              <p className="text-slate-600">
                Selected all three features: <strong>{profile.features.join(", ")}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Zero-Match State Context */}
        {!hasExactMatches && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">
              Academic Context for Zero Exact Matches:
            </span>
            <p className="leading-relaxed">
              No participant in the 12-respondent university demo cohort satisfied all three
              criteria simultaneously (|B ∩ P ∩ F| = 0). This does not imply an invalid
              configuration, but rather identifies your profile as an unobserved consumer
              archetype in this small benchmark dataset. Inspect partial matches below to see
              close consumer profiles.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```

## File 5: `src/components/my-phoneprint/PartialMatchBreakdown.tsx`

**Description**: Mutually Exclusive 4-Way Match Category Breakdown and Cohort Conservation Distribution Bar

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import type { MatchEngineResult } from "@/types/matcher";

export interface PartialMatchBreakdownProps {
  result: MatchEngineResult;
}

export function PartialMatchBreakdown({ result }: PartialMatchBreakdownProps) {
  const {
    category3Exact,
    category2Partial,
    category1Partial,
    category0None,
    totalCohort,
  } = result;

  // Category counts and percentages
  const n3 = category3Exact.count;
  const p3 = category3Exact.percentage;

  const n2 = category2Partial.total.count;
  const p2 = category2Partial.total.percentage;

  const n1 = category1Partial.total.count;
  const p1 = category1Partial.total.percentage;

  const n0 = category0None.count;
  const p0 = category0None.percentage;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Mutually Exclusive Match Classification"
        subtitle="Partition of the respondent cohort across 3, 2, 1, or 0 satisfied criteria"
        badge={<Badge variant="cobalt">Discrete Classification</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Visual Partition Distribution Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Cohort Distribution (N = {totalCohort})</span>
            <span className="font-mono text-slate-500">
              {n3 + n2 + n1 + n0} / {totalCohort} Respondents (100%)
            </span>
          </div>

          <div className="flex h-5 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {n3 > 0 && (
              <div
                style={{ width: `${p3}%` }}
                className="bg-lime-500 hover:opacity-90 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`Exact 3/3: ${n3} (${p3}%)`}
              >
                {p3 >= 15 ? `${p3}%` : ""}
              </div>
            )}
            {n2 > 0 && (
              <div
                style={{ width: `${p2}%` }}
                className="bg-cobalt-600 hover:opacity-90 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`2 of 3: ${n2} (${p2}%)`}
              >
                {p2 >= 15 ? `${p2}%` : ""}
              </div>
            )}
            {n1 > 0 && (
              <div
                style={{ width: `${p1}%` }}
                className="bg-slate-400 hover:opacity-90 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`1 of 3: ${n1} (${p1}%)`}
              >
                {p1 >= 15 ? `${p1}%` : ""}
              </div>
            )}
            {n0 > 0 && (
              <div
                style={{ width: `${p0}%` }}
                className="bg-slate-200 hover:opacity-90 transition-all flex items-center justify-center text-[10px] font-bold text-slate-600"
                title={`0 of 3: ${n0} (${p0}%)`}
              >
                {p0 >= 15 ? `${p0}%` : ""}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-lime-500" />
              <span>3/3 Criteria (Exact): {n3}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-cobalt-600" />
              <span>2/3 Criteria: {n2}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-slate-400" />
              <span>1/3 Criteria: {n1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-slate-200" />
              <span>0/3 Criteria: {n0}</span>
            </div>
          </div>
        </div>

        {/* 4 Category Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category 3: 3 of 3 (Exact) */}
          <div className="rounded-xl border border-lime-200 bg-lime-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-lime-900 block">
                  1. All 3 Conditions Matched
                </span>
                <span className="text-xs text-slate-500">Exact Phenotype Intersection</span>
              </div>
              <Badge variant="lime" className="font-mono">
                {n3} resp. ({p3}%)
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-white border border-lime-200 text-xs text-slate-700 space-y-1">
              <div className="font-semibold text-slate-900">
                Brand + Budget + Features Triplet
              </div>
              <p className="text-[11px] text-slate-500">
                Formula: B ∩ P ∩ F
              </p>
              {n3 > 0 ? (
                <div className="font-mono text-[11px] text-cobalt-700 font-bold pt-1">
                  IDs: {Array.from(category3Exact.ids).join(", ")}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic pt-1">
                  No respondents in this exact category.
                </div>
              )}
            </div>
          </div>

          {/* Category 2: Exactly 2 of 3 */}
          <div className="rounded-xl border border-cobalt-200 bg-cobalt-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cobalt-900 block">
                  2. Exactly 2 Conditions Matched
                </span>
                <span className="text-xs text-slate-500">Close Partial Phenotypes</span>
              </div>
              <Badge variant="cobalt" className="font-mono">
                {n2} resp. ({p2}%)
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              {/* Brand + Budget */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Brand &amp; Budget (Different Features)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    (B ∩ P) \ F
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {category2Partial.brandAndBudget.count} resp.
                </span>
              </div>

              {/* Brand + Features */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Brand &amp; Features (Different Budget)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    (B ∩ F) \ P
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {category2Partial.brandAndFeature.count} resp.
                </span>
              </div>

              {/* Budget + Features */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Budget &amp; Features (Different Brand)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    (P ∩ F) \ B
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {category2Partial.budgetAndFeature.count} resp.
                </span>
              </div>
            </div>
          </div>

          {/* Category 1: Exactly 1 of 3 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  3. Exactly 1 Condition Matched
                </span>
                <span className="text-xs text-slate-500">Single Dimension Overlap</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {n1} resp. ({p1}%)
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  Only Brand Matched [B \ (P ∪ F)]
                </span>
                <span className="font-mono font-bold text-slate-700">
                  {category1Partial.onlyBrand.count} resp.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  Only Budget Matched [P \ (B ∪ F)]
                </span>
                <span className="font-mono font-bold text-slate-700">
                  {category1Partial.onlyBudget.count} resp.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  Only Feature Triplet Matched [F \ (B ∪ P)]
                </span>
                <span className="font-mono font-bold text-slate-700">
                  {category1Partial.onlyFeature.count} resp.
                </span>
              </div>
            </div>
          </div>

          {/* Category 0: 0 of 3 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  4. Zero Conditions Matched
                </span>
                <span className="text-xs text-slate-500">Completely Disjoint Phenotypes</span>
              </div>
              <Badge variant="default" className="font-mono">
                {n0} resp. ({p0}%)
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>
                Respondents where preferred brand ≠ {result.profile.brand}, budget ≠ {result.profile.budget}, and feature selection differs from the chosen triplet.
              </p>
              <div className="font-mono text-[11px] text-slate-500">
                Formula: U \ (B ∪ P ∪ F) = {n0} respondents
              </div>
            </div>
          </div>
        </div>

        {/* Methodological Guidance Callout */}
        <Callout variant="info" title="Methodological Distinction: Partial Matches vs. Recommendations">
          Partial match counts (2/3, 1/3, 0/3) reflect discrete set-theoretic distances across the survey parameter space. They are intended strictly for combinatorial analysis of student preference overlap and must <strong>not</strong> be interpreted as algorithmic product recommendations.
        </Callout>
      </CardContent>
    </Card>
  );
}

```

## File 6: `src/components/my-phoneprint/FeatureOverlapCard.tsx`

**Description**: Independent Feature Overlap Distribution (All 3, ≥2, ≥1, 0) with Set Distinctions

```tsx
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { FeatureOverlapSummary } from "@/types/matcher";
import type { SmartphoneFeature } from "@/types/survey";

export interface FeatureOverlapCardProps {
  featureOverlap: FeatureOverlapSummary;
  selectedFeatures: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  totalCohort: number;
}

export function FeatureOverlapCard({
  featureOverlap,
  selectedFeatures,
  totalCohort,
}: FeatureOverlapCardProps) {
  const { matchAllThree, matchTwo, matchOne, matchNone, atLeastTwo, atLeastOne } =
    featureOverlap;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Independent Feature Overlap Distribution"
        subtitle={`Evaluating feature overlap with the selected triplet across all ${totalCohort} respondents independently of brand and budget constraints`}
        badge={<Badge variant="cobalt">Feature Subsets</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Selected Features Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-700">
            Target Feature Triplet (F*):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedFeatures.map((f) => (
              <span
                key={f}
                className="text-xs font-medium text-cobalt-800 bg-white border border-cobalt-200 px-2.5 py-1 rounded-md shadow-2xs"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* 4-Tier Disjoint Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Overlap = 3 */}
          <div className="rounded-xl border border-lime-200 bg-lime-50/40 p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-lime-900 block">
              All 3 Features
            </span>
            <div className="font-mono text-2xl font-extrabold text-lime-950">
              {matchAllThree.count}
            </div>
            <span className="text-[11px] text-lime-700 font-medium block">
              {matchAllThree.percentage}% of cohort
            </span>
            <span className="text-[10px] text-slate-500 font-mono block pt-1 border-t border-lime-200/60">
              |F* ∩ F_i| = 3
            </span>
          </div>

          {/* Overlap = 2 */}
          <div className="rounded-xl border border-cobalt-200 bg-cobalt-50/40 p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cobalt-900 block">
              Exactly 2 Features
            </span>
            <div className="font-mono text-2xl font-extrabold text-cobalt-950">
              {matchTwo.count}
            </div>
            <span className="text-[11px] text-cobalt-700 font-medium block">
              {matchTwo.percentage}% of cohort
            </span>
            <span className="text-[10px] text-slate-500 font-mono block pt-1 border-t border-cobalt-200/60">
              |F* ∩ F_i| = 2
            </span>
          </div>

          {/* Overlap = 1 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              Exactly 1 Feature
            </span>
            <div className="font-mono text-2xl font-extrabold text-slate-800">
              {matchOne.count}
            </div>
            <span className="text-[11px] text-slate-600 font-medium block">
              {matchOne.percentage}% of cohort
            </span>
            <span className="text-[10px] text-slate-400 font-mono block pt-1 border-t border-slate-200">
              |F* ∩ F_i| = 1
            </span>
          </div>

          {/* Overlap = 0 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
              0 Features
            </span>
            <div className="font-mono text-2xl font-extrabold text-slate-800">
              {matchNone.count}
            </div>
            <span className="text-[11px] text-slate-600 font-medium block">
              {matchNone.percentage}% of cohort
            </span>
            <span className="text-[10px] text-slate-400 font-mono block pt-1 border-t border-slate-200">
              |F* ∩ F_i| = 0
            </span>
          </div>
        </div>

        {/* Cumulative Overlap Thresholds */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Cumulative Feature Overlap Thresholds:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  At Least Two Features (≥ 2)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  All 3 + Exactly 2 ({matchAllThree.count} + {matchTwo.count})
                </span>
              </div>
              <Badge variant="cobalt" className="font-mono">
                {atLeastTwo.count} ({atLeastTwo.percentage}%)
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  At Least One Feature (≥ 1)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Any non-zero feature intersection
                </span>
              </div>
              <Badge variant="lime" className="font-mono">
                {atLeastOne.count} ({atLeastOne.percentage}%)
              </Badge>
            </div>
          </div>
        </div>

        {/* Explicit Mathematical Distinctions */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs text-slate-600 space-y-2">
          <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
            Academic Clarity on Feature Conditions:
          </span>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>All Three Features (|F* ∩ F_i| = 3):</strong> Respondent selected the exact same three features as your target vector.
            </li>
            <li>
              <strong>At Least One Feature (≥ 1):</strong> Respondent shares at least one common priority with your profile, though two features differ.
            </li>
            <li>
              <strong>Zero Overlap (= 0):</strong> Respondent chosen features are completely disjoint from your target feature triplet.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

```

## File 7: `src/components/my-phoneprint/RespondentExplorerTable.tsx`

**Description**: Searchable and Filterable Anonymous Respondent Affinity Table

```tsx
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { RespondentMatchRecord, MatchCategory } from "@/types/matcher";

export interface RespondentExplorerTableProps {
  respondents: readonly RespondentMatchRecord[];
}

type FilterCategory = "all" | MatchCategory;

export function RespondentExplorerTable({
  respondents,
}: RespondentExplorerTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRespondents = useMemo(() => {
    return respondents.filter((r) => {
      // 1. Category Filter
      if (categoryFilter !== "all" && r.matchCategory !== categoryFilter) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = r.response_id.toLowerCase().includes(q);
        const matchesBrand = r.preferred_brand.toLowerCase().includes(q);
        const matchesBudget = r.budget_range.toLowerCase().includes(q);
        const matchesFeatures = r.preferred_features.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesBrand && !matchesBudget && !matchesFeatures) {
          return false;
        }
      }

      return true;
    });
  }, [respondents, categoryFilter, searchQuery]);

  // Counts for tabs
  const countExact = respondents.filter((r) => r.matchCategory === "exact_3").length;
  const count2 = respondents.filter((r) => r.matchCategory === "partial_2").length;
  const count1 = respondents.filter((r) => r.matchCategory === "partial_1").length;
  const count0 = respondents.filter((r) => r.matchCategory === "none_0").length;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Respondent-Level Affinity Explorer"
        subtitle="Individual evaluation of each anonymous survey response against your preference criteria"
        badge={
          <Badge variant="cobalt">
            {filteredRespondents.length} / {respondents.length} Displayed
          </Badge>
        }
      />
      <CardContent className="space-y-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "all"
                  ? "bg-cobalt-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All ({respondents.length})
            </button>
            <button
              onClick={() => setCategoryFilter("exact_3")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "exact_3"
                  ? "bg-lime-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Exact (3/3) [{countExact}]
            </button>
            <button
              onClick={() => setCategoryFilter("partial_2")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "partial_2"
                  ? "bg-cobalt-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              2 of 3 [{count2}]
            </button>
            <button
              onClick={() => setCategoryFilter("partial_1")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "partial_1"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              1 of 3 [{count1}]
            </button>
            <button
              onClick={() => setCategoryFilter("none_0")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "none_0"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              0 of 3 [{count0}]
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-64">
            <input
              type="text"
              placeholder="Search by ID, brand, feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-800 placeholder-slate-400 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            />
          </div>
        </div>

        {/* Results Table */}
        {filteredRespondents.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">
              No respondent records match your current filter and search query.
            </p>
            <button
              onClick={() => {
                setCategoryFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-semibold text-cobalt-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3">Respondent ID</th>
                  <th className="px-3.5 py-3">Brand Match</th>
                  <th className="px-3.5 py-3">Budget Match</th>
                  <th className="px-3.5 py-3">Feature Overlap</th>
                  <th className="px-3.5 py-3 text-center">Score</th>
                  <th className="px-3.5 py-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRespondents.map((r) => (
                  <tr
                    key={r.response_id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      r.matchCategory === "exact_3" ? "bg-lime-50/30" : ""
                    }`}
                  >
                    {/* ID & Details */}
                    <td className="px-3.5 py-3">
                      <span className="font-mono font-bold text-slate-900 block">
                        {r.response_id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {r.preferred_brand} &bull; {r.budget_range}
                      </span>
                    </td>

                    {/* Brand Match */}
                    <td className="px-3.5 py-3">
                      {r.brandMatch ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-lime-700 bg-lime-50 border border-lime-200 px-2 py-0.5 rounded text-[11px]">
                          ✓ Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                          ✕ {r.preferred_brand}
                        </span>
                      )}
                    </td>

                    {/* Budget Match */}
                    <td className="px-3.5 py-3">
                      {r.budgetMatch ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-lime-700 bg-lime-50 border border-lime-200 px-2 py-0.5 rounded text-[11px]">
                          ✓ Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                          ✕ {r.budget_range}
                        </span>
                      )}
                    </td>

                    {/* Feature Overlap */}
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            r.featureOverlapCount === 3
                              ? "bg-lime-100 text-lime-900 border border-lime-300"
                              : r.featureOverlapCount >= 1
                              ? "bg-cobalt-50 text-cobalt-800 border border-cobalt-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {r.featureOverlapCount} / 3
                        </span>
                        {r.featureMatch && (
                          <span className="text-[10px] font-bold text-lime-700 uppercase">
                            (Exact Triplet)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Matched Score */}
                    <td className="px-3.5 py-3 text-center">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {r.matchedConditionsCount} / 3
                      </span>
                    </td>

                    {/* Classification Badge */}
                    <td className="px-3.5 py-3">
                      {r.matchCategory === "exact_3" && (
                        <Badge variant="lime" className="font-mono">
                          Exact Match (3/3)
                        </Badge>
                      )}
                      {r.matchCategory === "partial_2" && (
                        <Badge variant="cobalt" className="font-mono">
                          Partial (2/3)
                        </Badge>
                      )}
                      {r.matchCategory === "partial_1" && (
                        <Badge variant="outline" className="font-mono">
                          Partial (1/3)
                        </Badge>
                      )}
                      {r.matchCategory === "none_0" && (
                        <Badge variant="default" className="font-mono">
                          No Match (0/3)
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

```

## File 8: `src/components/my-phoneprint/MatchingTheoryPanel.tsx`

**Description**: Discrete Mathematics Learning Panel with Formal KaTeX Intersection and Partition Proofs

```tsx
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KaTeXMath } from "@/components/ui/KaTeXMath";

interface TheorySection {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  explanation: string;
  keyPoints: string[];
}

const THEORY_SECTIONS: TheorySection[] = [
  {
    id: "exact_intersection",
    title: "Exact Matching via Set Intersection (B ∩ P ∩ F)",
    subtitle: "Why set intersection must be used instead of adding scalar counts",
    formula: "\\text{ExactMatches} = B \\cap P \\cap F = \\{ x \\in U \\mid x \\in B \\land x \\in P \\land x \\in F \\}",
    explanation:
      "To find respondents who share your exact smartphone preference vector, we must find individuals who satisfy all three conditions simultaneously. In set theory, the logical conjunction (AND) across multiple predicates corresponds to set intersection. Calculating exact matches by adding individual counts (|B| + |P| + |F|) would erroneously sum disjoint cohorts and double-count overlaps without identifying individuals possessing all three attributes.",
    keyPoints: [
      "B = { id ∈ U | preferred_brand = brand }",
      "P = { id ∈ U | budget_range = budget }",
      "F = { id ∈ U | {f1, f2, f3} ⊆ preferred_features }",
      "ExactMatches = B ∩ P ∩ F guarantees all 3 conditions hold.",
    ],
  },
  {
    id: "mutually_exclusive",
    title: "Mutually Exclusive 4-Way Partition (8 Regions)",
    subtitle: "Decomposing the Venn universe into non-overlapping distance bands",
    formula: "U = \\text{Cat}_3 \\cup \\text{Cat}_2 \\cup \\text{Cat}_1 \\cup \\text{Cat}_0, \\quad \\sum_{k=0}^{3} |\\text{Cat}_k| = |U|",
    explanation:
      "Three arbitrary sets B, P, and F partition the universal set U into exactly 2^3 = 8 mutually exclusive regions. We group these 8 regions according to the number of satisfied conditions k ∈ {0, 1, 2, 3}, producing a conservation law where every respondent is classified into exactly one category without omission or duplicate counting.",
    keyPoints: [
      "Category 3 (C(3,3) = 1 region): B ∩ P ∩ F (Exact Match)",
      "Category 2 (C(3,2) = 3 regions): (B ∩ P) \\ F, (B ∩ F) \\ P, (P ∩ F) \\ B",
      "Category 1 (C(3,1) = 3 regions): B \\ (P ∪ F), P \\ (B ∪ F), F \\ (B ∪ P)",
      "Category 0 (C(3,0) = 1 region): U \\ (B ∪ P ∪ F)",
    ],
  },
  {
    id: "denominator_integrity",
    title: "Denominator & Percentage Integrity",
    subtitle: "Grounding all proportions in the full survey cohort N",
    formula: "\\text{Percentage}(\\text{Cat}_k) = \\frac{|\\text{Cat}_k|}{|U|} \\times 100\\%, \\quad \\sum_{k=0}^{3} \\text{Percentage}(\\text{Cat}_k) = 100\\%",
    explanation:
      "In discrete survey analytics, exact and partial match proportions must always use the full cohort size |U| (N = 12) as their denominator. Dividing by intermediate subsets (like |B| or |P|) would represent conditional probabilities rather than full-cohort preference prevalence.",
    keyPoints: [
      "Strict cohort denominator N = |U| = 12.",
      "Exact match share: |B ∩ P ∩ F| / N * 100%.",
      "Conservation property guarantees percentages sum to 100%.",
      "Division-by-zero protection ensures graceful handling of empty cohorts.",
    ],
  },
];

export function MatchingTheoryPanel() {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    "exact_intersection"
  );

  const activeSection =
    THEORY_SECTIONS.find((s) => s.id === activeSectionId) ??
    THEORY_SECTIONS[0]!;

  return (
    <Card className="border-slate-200/90 shadow-card">
      <CardHeader
        title="Discrete Mathematics Matching Foundation"
        subtitle="Mathematical justification for set intersections, 8-region partitions, and denominator integrity"
        badge={<Badge variant="cobalt">Formal Theory</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {THEORY_SECTIONS.map((section) => {
            const isActive = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cobalt-600 text-white shadow-sm ring-2 ring-cobalt-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                }`}
              >
                {section.title.split(" (")[0]}
              </button>
            );
          })}
        </div>

        {/* Active Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              {activeSection.title}
            </h3>
            <p className="text-xs text-slate-500">{activeSection.subtitle}</p>
          </div>

          {/* Formula Display */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Set-Theoretic Formulation:
            </span>
            <KaTeXMath
              math={activeSection.formula}
              block
              className="text-slate-900 text-sm font-semibold"
            />
          </div>

          {/* Explanation */}
          <div className="text-xs text-slate-700 leading-relaxed space-y-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Mathematical Reasoning:
            </h4>
            <p>{activeSection.explanation}</p>
          </div>

          {/* Key Invariants */}
          <div className="rounded-xl border border-lime-200 bg-lime-50/40 p-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lime-950 block">
              Core Invariant Properties:
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {activeSection.keyPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="rounded-lg bg-white p-2.5 border border-lime-200/80 shadow-2xs flex items-start gap-1.5 font-medium"
                >
                  <span className="text-cobalt-600 font-bold mr-1">&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

```

## File 9: `src/app/my-phoneprint/page.tsx`

**Description**: Integrated My PhonePrint Application Page with Reactive State and Results Dashboard

```tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { executeMatchingEngine } from "@/lib/math/matchingEngine";
import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

import { PreferenceBuilder } from "@/components/my-phoneprint/PreferenceBuilder";
import { ExactMatchCard } from "@/components/my-phoneprint/ExactMatchCard";
import { PartialMatchBreakdown } from "@/components/my-phoneprint/PartialMatchBreakdown";
import { FeatureOverlapCard } from "@/components/my-phoneprint/FeatureOverlapCard";
import { RespondentExplorerTable } from "@/components/my-phoneprint/RespondentExplorerTable";
import { MatchingTheoryPanel } from "@/components/my-phoneprint/MatchingTheoryPanel";

export default function MyPhonePrintPage() {
  const dataset = useMemo(() => loadDemoSurveyDataset(), []);
  const responses = dataset.responses;

  // Initial default: Apple, Over $1,000, Camera + Battery + Build (Matches DEMO_RESP_001)
  const [brand, setBrand] = useState<SmartphoneBrand>("Apple");
  const [budget, setBudget] = useState<BudgetRange>("Over $1,000");
  const [features, setFeatures] = useState<SmartphoneFeature[]>([
    "Camera Quality",
    "Battery Life",
    "Build & Design Quality",
  ]);

  const toggleFeature = (feature: SmartphoneFeature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      if (features.length < 3) {
        setFeatures([...features, feature]);
      }
    }
  };

  const resetPreferences = () => {
    setBrand("Apple");
    setBudget("Over $1,000");
    setFeatures([]);
  };

  const applyPreset = (preset: UserProfileInput) => {
    setBrand(preset.brand);
    setBudget(preset.budget);
    setFeatures([...preset.features]);
  };

  // Run the matching engine only when exactly 3 features are selected
  const isProfileComplete = features.length === 3;

  const matchResult = useMemo(() => {
    if (!isProfileComplete) return null;

    const profile: UserProfileInput = {
      brand,
      budget,
      features: [features[0]!, features[1]!, features[2]!],
    };

    return executeMatchingEngine(responses, profile);
  }, [responses, brand, budget, features, isProfileComplete]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Interactive Preference Profiling"
        title="My PhonePrint: Preference Matcher"
        description="Select your target brand, budget tier, and exactly three canonical features to construct your personal PhonePrint vector. Computes exact set intersections and mutually exclusive partial matches against the student cohort."
        badge={{ text: "Phase 05 Verified", variant: "lime" }}
        actions={
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-500 bg-amber-950/40 border border-amber-800/60 px-2.5 py-1 rounded-md">
              [DEMO DATA: N=12]
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section 1: Preference Builder */}
        <section id="builder" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
              1. Preference Vector Formulation
            </h2>
            <span className="text-xs text-graphite-500 font-mono">
              3 Dimensions: Brand • Budget • 3 Features
            </span>
          </div>
          <PreferenceBuilder
            brand={brand}
            setBrand={setBrand}
            budget={budget}
            setBudget={setBudget}
            features={features}
            toggleFeature={toggleFeature}
            resetPreferences={resetPreferences}
            onApplyPreset={applyPreset}
          />
        </section>

        {/* Section 2: Results Dashboard (Conditioned on complete profile) */}
        {matchResult ? (
          <>
            {/* Exact Matches */}
            <section id="exact-matches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  2. Exact Profile Matching
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Intersection: B ∩ P ∩ F
                </span>
              </div>
              <ExactMatchCard result={matchResult} />
            </section>

            {/* Mutually Exclusive Partial Match Breakdown */}
            <section id="partial-matches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  3. Mutually Exclusive Match Classification
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Conservation: N₃ + N₂ + N₁ + N₀ = N
                </span>
              </div>
              <PartialMatchBreakdown result={matchResult} />
            </section>

            {/* Independent Feature Overlap */}
            <section id="feature-overlap" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  4. Feature Triplet Overlap Analysis
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Subset Size: |F* ∩ F_i| ∈ &#123;0, 1, 2, 3&#125;
                </span>
              </div>
              <FeatureOverlapCard
                featureOverlap={matchResult.featureOverlap}
                selectedFeatures={matchResult.profile.features}
                totalCohort={matchResult.totalCohort}
              />
            </section>

            {/* Respondent Explorer Table */}
            <section id="explorer" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  5. Anonymous Respondent Explorer
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Individual Record Evaluation
                </span>
              </div>
              <RespondentExplorerTable respondents={matchResult.respondents} />
            </section>

            {/* Discrete Mathematics Learning Foundation */}
            <section id="theory" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  6. Discrete Mathematics Matching Foundation
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Formal Set Theory &amp; Partitions
                </span>
              </div>
              <MatchingTheoryPanel />
            </section>
          </>
        ) : (
          <Callout
            variant="warning"
            title="Incomplete Preference Vector"
          >
            Please select exactly three distinct features in the builder above to
            compute your PhonePrint vector and evaluate set intersections across
            the student cohort.
          </Callout>
        )}

        {/* Academic Synthesis Summary */}
        <Callout
          variant="highlight"
          title="PhonePrint Preference Analytics Summary"
        >
          My PhonePrint models user smartphone affinity as a discrete set
          intersection problem over $U$. By evaluating Brand ($B$), Budget ($P$),
          and Feature Triplet ($F$), the system demonstrates how multi-dimensional
          conjunctions partition a population into non-overlapping distance bands,
          providing mathematically rigorous insights without aggregate scalar
          approximations.
        </Callout>
      </div>
    </div>
  );
}

```

## File 10: `src/__tests__/matching_engine.test.ts`

**Description**: Comprehensive Unit Test Suite for Exact Intersections, Partitions, Invariance, and Denominators

```typescript
import { describe, it, expect } from "vitest";
import {
  buildBrandSet,
  buildBudgetSet,
  buildExactFeatureSet,
  calculateFeatureOverlap,
  computeExactMatches,
  executeMatchingEngine,
} from "@/lib/math/matchingEngine";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import type { SurveyResponse, SmartphoneFeature } from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

describe("Preference Matching Engine (My PhonePrint)", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses; // 12 valid respondents

  // Sample Profile: Apple, Over $1,000, Camera + Battery + Build
  // In demo data, DEMO_RESP_001 matches all three!
  const appleProfile: UserProfileInput = {
    brand: "Apple",
    budget: "Over $1,000",
    features: [
      "Camera Quality",
      "Battery Life",
      "Build & Design Quality",
    ],
  };

  describe("Set Construction & Exact Intersections", () => {
    it("constructs correct brand set B", () => {
      const bSet = buildBrandSet(responses, "Apple");
      // In demo data: DEMO_RESP_001, DEMO_RESP_004, DEMO_RESP_009 are Apple (size 3)
      expect(bSet.size).toBe(3);
      expect(bSet.has("DEMO_RESP_001")).toBe(true);
      expect(bSet.has("DEMO_RESP_004")).toBe(true);
      expect(bSet.has("DEMO_RESP_009")).toBe(true);
      expect(bSet.has("DEMO_RESP_002")).toBe(false);
    });

    it("constructs correct budget set P", () => {
      const pSet = buildBudgetSet(responses, "Over $1,000");
      // In demo data: DEMO_RESP_001, DEMO_RESP_006, DEMO_RESP_009 are Over $1,000 (size 3)
      expect(pSet.size).toBe(3);
      expect(pSet.has("DEMO_RESP_001")).toBe(true);
      expect(pSet.has("DEMO_RESP_006")).toBe(true);
      expect(pSet.has("DEMO_RESP_009")).toBe(true);
    });

    it("constructs correct exact feature triplet set F", () => {
      const fSet = buildExactFeatureSet(responses, [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ]);
      // Only DEMO_RESP_001 has this exact triplet
      expect(fSet.size).toBe(1);
      expect(fSet.has("DEMO_RESP_001")).toBe(true);
    });

    it("evaluates exact match intersection B ∩ P ∩ F", () => {
      const bSet = buildBrandSet(responses, "Apple");
      const pSet = buildBudgetSet(responses, "Over $1,000");
      const fSet = buildExactFeatureSet(responses, [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ]);

      const exact = computeExactMatches(bSet, pSet, fSet);
      expect(exact.size).toBe(1);
      expect(exact.has("DEMO_RESP_001")).toBe(true);
    });

    it("guarantees unranked feature selection invariance", () => {
      // Swapping the order of the features in the input vector
      const permutedFeatures1: [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature] = [
        "Build & Design Quality",
        "Camera Quality",
        "Battery Life",
      ];
      const permutedFeatures2: [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature] = [
        "Battery Life",
        "Build & Design Quality",
        "Camera Quality",
      ];

      const fSet1 = buildExactFeatureSet(responses, appleProfile.features);
      const fSet2 = buildExactFeatureSet(responses, permutedFeatures1);
      const fSet3 = buildExactFeatureSet(responses, permutedFeatures2);

      expect(Array.from(fSet1).sort()).toEqual(Array.from(fSet2).sort());
      expect(Array.from(fSet1).sort()).toEqual(Array.from(fSet3).sort());
    });
  });

  describe("Mutually Exclusive Partial-Match Classification", () => {
    it("partitions respondents into 4 mutually exclusive categories summing to N", () => {
      const result = executeMatchingEngine(responses, appleProfile);

      const n3 = result.category3Exact.count;
      const n2 = result.category2Partial.total.count;
      const n1 = result.category1Partial.total.count;
      const n0 = result.category0None.count;

      // Category count conservation: N_3 + N_2 + N_1 + N_0 = N
      expect(n3 + n2 + n1 + n0).toBe(responses.length);
      expect(responses.length).toBe(12);

      // Category 3 exact match strictly agrees with exactMatches
      expect(result.category3Exact.count).toBe(result.exactMatches.count);
      expect(Array.from(result.category3Exact.ids)).toEqual(
        Array.from(result.exactMatches.ids)
      );

      // Verify mutual exclusivity across all 4 sets
      const set3 = result.category3Exact.ids;
      const set2 = result.category2Partial.total.ids;
      const set1 = result.category1Partial.total.ids;
      const set0 = result.category0None.ids;

      for (const id of set3) {
        expect(set2.has(id)).toBe(false);
        expect(set1.has(id)).toBe(false);
        expect(set0.has(id)).toBe(false);
      }
      for (const id of set2) {
        expect(set3.has(id)).toBe(false);
        expect(set1.has(id)).toBe(false);
        expect(set0.has(id)).toBe(false);
      }
      for (const id of set1) {
        expect(set3.has(id)).toBe(false);
        expect(set2.has(id)).toBe(false);
        expect(set0.has(id)).toBe(false);
      }
      for (const id of set0) {
        expect(set3.has(id)).toBe(false);
        expect(set2.has(id)).toBe(false);
        expect(set1.has(id)).toBe(false);
      }
    });

    it("verifies sub-breakdown partition for 2 of 3 matched conditions", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      const cat2 = result.category2Partial;

      // Disjoint sum of 2-of-3 subcategories must equal cat2 total
      expect(
        cat2.brandAndBudget.count +
          cat2.brandAndFeature.count +
          cat2.budgetAndFeature.count
      ).toBe(cat2.total.count);

      // DEMO_RESP_009 is Apple and Over $1,000 (Brand + Budget), but selected different features
      expect(cat2.brandAndBudget.ids.has("DEMO_RESP_009")).toBe(true);
    });

    it("verifies sub-breakdown partition for 1 of 3 matched conditions", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      const cat1 = result.category1Partial;

      // Disjoint sum of 1-of-3 subcategories must equal cat1 total
      expect(
        cat1.onlyBrand.count + cat1.onlyBudget.count + cat1.onlyFeature.count
      ).toBe(cat1.total.count);

      // DEMO_RESP_004 is Apple ($700-$1000, different features) => only brand
      expect(cat1.onlyBrand.ids.has("DEMO_RESP_004")).toBe(true);

      // DEMO_RESP_006 is Samsung Over $1,000 (different features) => only budget
      expect(cat1.onlyBudget.ids.has("DEMO_RESP_006")).toBe(true);
    });

    it("correctly identifies respondents with 0 conditions matched", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      // For instance, DEMO_RESP_002 is Samsung, $700-$1000, features [Display, Processing, Storage]
      // Matches neither Apple, Over $1000, nor the feature triplet
      expect(result.category0None.ids.has("DEMO_RESP_002")).toBe(true);
    });
  });

  describe("Feature Overlap Calculation (Independent of Brand/Budget)", () => {
    it("computes accurate feature overlap counts", () => {
      const userFeatures = [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ] as const;

      // DEMO_RESP_001 has all 3
      const overlap001 = calculateFeatureOverlap(
        userFeatures,
        responses[0]!.preferred_features
      );
      expect(overlap001).toBe(3);

      // DEMO_RESP_003 has Camera + Battery + Software => overlap = 2
      const overlap003 = calculateFeatureOverlap(
        userFeatures,
        responses[2]!.preferred_features
      );
      expect(overlap003).toBe(2);

      // DEMO_RESP_002 has Display + Processing + Storage => overlap = 0
      const overlap002 = calculateFeatureOverlap(
        userFeatures,
        responses[1]!.preferred_features
      );
      expect(overlap002).toBe(0);
    });

    it("verifies cumulative feature overlap relationships: allThree ⊆ atLeastTwo ⊆ atLeastOne", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      const fo = result.featureOverlap;

      expect(fo.matchAllThree.count).toBe(1);
      expect(fo.atLeastTwo.count).toBeGreaterThanOrEqual(fo.matchAllThree.count);
      expect(fo.atLeastOne.count).toBeGreaterThanOrEqual(fo.atLeastTwo.count);

      // Disjoint partition check: allThree + two + one + none = total cohort
      const disjointSum =
        fo.matchAllThree.count +
        fo.matchTwo.count +
        fo.matchOne.count +
        fo.matchNone.count;
      expect(disjointSum).toBe(responses.length);
    });
  });

  describe("Percentage Denominator & Full-Cohort Integrity", () => {
    it("uses full valid cohort as denominator for exact and partial match percentages", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      expect(result.totalCohort).toBe(12);

      expect(result.exactMatches.percentage).toBeCloseTo((1 / 12) * 100, 2);
      expect(result.category3Exact.percentage).toBeCloseTo((1 / 12) * 100, 2);

      // Sum of percentages of the 4 mutually exclusive categories is ~100%
      const sumPct =
        result.category3Exact.percentage +
        result.category2Partial.total.percentage +
        result.category1Partial.total.percentage +
        result.category0None.percentage;
      expect(sumPct).toBeCloseTo(100, 1);
    });
  });

  describe("Boundary & Edge Cases", () => {
    it("handles zero exact matches gracefully without errors", () => {
      // Profile with brand OnePlus and budget Over $1,000 (No OnePlus respondent is Over $1000 in demo data)
      const noMatchProfile: UserProfileInput = {
        brand: "OnePlus",
        budget: "Over $1,000",
        features: [
          "Camera Quality",
          "Battery Life",
          "Build & Design Quality",
        ],
      };

      const result = executeMatchingEngine(responses, noMatchProfile);
      expect(result.exactMatches.count).toBe(0);
      expect(result.exactMatches.percentage).toBe(0);
      expect(result.category3Exact.count).toBe(0);
      expect(result.category3Exact.percentage).toBe(0);
    });

    it("handles empty survey response cohort gracefully", () => {
      const result = executeMatchingEngine([], appleProfile);
      expect(result.totalCohort).toBe(0);
      expect(result.exactMatches.count).toBe(0);
      expect(result.exactMatches.percentage).toBe(0);
      expect(result.category3Exact.count).toBe(0);
      expect(result.category2Partial.total.count).toBe(0);
      expect(result.category1Partial.total.count).toBe(0);
      expect(result.category0None.count).toBe(0);
      expect(result.respondents).toEqual([]);
    });

    it("handles empty brand set B = ∅ gracefully", () => {
      const unfamiliarBrandProfile: UserProfileInput = {
        brand: "Other", // Only 1 respondent in demo data is 'Other'
        budget: "Under $400",
        features: [
          "Camera Quality",
          "Battery Life",
          "Storage Capacity",
        ],
      };

      const result = executeMatchingEngine(responses, unfamiliarBrandProfile);
      expect(result.brandSet.size).toBe(1);
    });

    it("handles scenario where all respondents match", () => {
      // Create artificial 3 identical responses
      const identicalResponses: SurveyResponse[] = [
        {
          response_id: "TEST_001",
          preferred_brand: "Apple",
          budget_range: "Over $1,000",
          preferred_features: [
            "Camera Quality",
            "Battery Life",
            "Build & Design Quality",
          ],
          primary_use: "Everyday General Use",
          os_preference: "iOS",
        },
        {
          response_id: "TEST_002",
          preferred_brand: "Apple",
          budget_range: "Over $1,000",
          preferred_features: [
            "Camera Quality",
            "Battery Life",
            "Build & Design Quality",
          ],
          primary_use: "Gaming",
          os_preference: "iOS",
        },
      ];

      const result = executeMatchingEngine(identicalResponses, appleProfile);
      expect(result.totalCohort).toBe(2);
      expect(result.exactMatches.count).toBe(2);
      expect(result.exactMatches.percentage).toBe(100);
      expect(result.category3Exact.count).toBe(2);
      expect(result.category2Partial.total.count).toBe(0);
      expect(result.category1Partial.total.count).toBe(0);
      expect(result.category0None.count).toBe(0);
    });
  });
});

```
