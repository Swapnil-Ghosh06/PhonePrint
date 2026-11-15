# PhonePrint — Phase 03 Source Code Audit Bundle

This document contains the complete, unabridged plaintext source code of all mathematical functions, types, components, tests, and pages created for **PhonePrint Phase 03: Interactive Set Theory Laboratory (SetLab)**.

All code is provided for independent technical review.

---

## File 1: `src/lib/math/venn.ts`

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

---

## File 2: `src/types/math.ts`

```typescript
/**
 * PhonePrint - Discrete Mathematics & Graph Theory Foundations
 * Type definitions for pure set theory, combinatorics, and Venn diagrams.
 */

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
```

---

## File 3: `src/lib/data/setDescriptors.ts`

```typescript
/**
 * PhonePrint - SetLab Available Set Definitions
 * Defines the discrete sets available for user selection in the laboratory.
 * Maps human-readable domain concepts to pure Set<string> of respondent IDs.
 */

import type { SurveyResponse } from "@/types/survey";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SmartphoneBrand,
  type SmartphoneFeature,
} from "@/types/survey";
import {
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
} from "./loader";

export type SetCategory = "brand" | "feature";

export interface SetOption {
  id: string;
  name: string;
  category: SetCategory;
  description: string;
  getIds: (responses: readonly SurveyResponse[]) => Set<string>;
}

/**
 * Builds the complete list of available sets for SetLab:
 * - All smartphone brands present in the domain
 * - All 7 canonical features
 */
export function getAvailableSetOptions(): SetOption[] {
  const options: SetOption[] = [];

  // 1. Brand Sets
  for (const brand of SMARTPHONE_BRANDS) {
    options.push({
      id: `brand_${brand.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      name: `Brand: ${brand}`,
      category: "brand",
      description: `Respondents who selected ${brand} as their preferred smartphone brand`,
      getIds: (responses) => getRespondentIdsByBrand(responses, brand as SmartphoneBrand),
    });
  }

  // 2. Canonical Feature Sets
  for (const feature of SMARTPHONE_FEATURES) {
    options.push({
      id: `feature_${feature.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      name: `Feature: ${feature}`,
      category: "feature",
      description: `Respondents who selected ${feature} in their 3 distinct preferred features`,
      getIds: (responses) => getRespondentIdsByFeature(responses, feature as SmartphoneFeature),
    });
  }

  return options;
}
```

---

## File 4: `src/components/setlab/SetSelector.tsx`

```typescript
"use client";

import React from "react";
import type { SetOption } from "@/lib/data/setDescriptors";
import { Badge } from "@/components/ui/Badge";

export interface SetSelectorProps {
  mode: "2-set" | "3-set";
  onModeChange: (mode: "2-set" | "3-set") => void;
  availableOptions: SetOption[];
  setAId: string;
  setBId: string;
  setCId: string;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
  onSelectC: (id: string) => void;
  setASize: number;
  setBSize: number;
  setCSize: number;
  totalUniverseSize: number;
}

export function SetSelector({
  mode,
  onModeChange,
  availableOptions,
  setAId,
  setBId,
  setCId,
  onSelectA,
  onSelectB,
  onSelectC,
  setASize,
  setBSize,
  setCSize,
  totalUniverseSize,
}: SetSelectorProps) {
  const brandOptions = availableOptions.filter((o) => o.category === "brand");
  const featureOptions = availableOptions.filter((o) => o.category === "feature");

  const optionA = availableOptions.find((o) => o.id === setAId);
  const optionB = availableOptions.find((o) => o.id === setBId);
  const optionC = availableOptions.find((o) => o.id === setCId);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 space-y-5">
      {/* Header and Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-950">
              Set Definition Workspace
            </h3>
            <Badge variant="cobalt">Discrete Partitions</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select {mode === "2-set" ? "two" : "three"} distinct brand or feature cohorts from the universe (U = {totalUniverseSize} respondents)
          </p>
        </div>

        {/* 2-Set vs 3-Set Mode Switch */}
        <div className="inline-flex rounded-lg border border-[#182030] bg-[#101623] p-1 text-xs">
          <button
            type="button"
            onClick={() => onModeChange("2-set")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              mode === "2-set"
                ? "bg-cobalt-600 text-white font-semibold shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Two Sets (A, B)
          </button>
          <button
            type="button"
            onClick={() => onModeChange("3-set")}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              mode === "3-set"
                ? "bg-cobalt-600 text-white font-semibold shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Three Sets (A, B, C)
          </button>
        </div>
      </div>

      {/* Set Pickers Grid */}
      <div className={`grid grid-cols-1 gap-4 ${mode === "3-set" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {/* SET A */}
        <div className="rounded-lg border-2 border-cobalt-500/30 bg-[#f8fafc] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-cobalt-600 text-white font-mono font-bold text-xs shadow-sm">
                A
              </span>
              <span className="font-semibold text-slate-900 text-sm">Set A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-cobalt-700 bg-cobalt-50 border border-cobalt-200 px-2 py-0.5 rounded">
                |A| = {setASize}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({Math.round((setASize / totalUniverseSize) * 100)}%)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="set-a-select" className="sr-only">
              Choose Set A
            </label>
            <select
              id="set-a-select"
              value={setAId}
              onChange={(e) => onSelectA(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            >
              <optgroup label="Smartphone Brands">
                {brandOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setBId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Canonical Features">
                {featureOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setBId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2">
            {optionA?.description}
          </p>
        </div>

        {/* SET B */}
        <div className="rounded-lg border-2 border-lime-500/40 bg-[#f8fafc] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-lime-500 text-slate-950 font-mono font-bold text-xs shadow-sm">
                B
              </span>
              <span className="font-semibold text-slate-900 text-sm">Set B</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-lime-800 bg-lime-50 border border-lime-300 px-2 py-0.5 rounded">
                |B| = {setBSize}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({Math.round((setBSize / totalUniverseSize) * 100)}%)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="set-b-select" className="sr-only">
              Choose Set B
            </label>
            <select
              id="set-b-select"
              value={setBId}
              onChange={(e) => onSelectB(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
            >
              <optgroup label="Smartphone Brands">
                {brandOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setAId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Canonical Features">
                {featureOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setAId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2">
            {optionB?.description}
          </p>
        </div>

        {/* SET C (Only in 3-set mode) */}
        {mode === "3-set" && (
          <div className="rounded-lg border-2 border-purple-500/30 bg-[#f8fafc] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-600 text-white font-mono font-bold text-xs shadow-sm">
                  C
                </span>
                <span className="font-semibold text-slate-900 text-sm">Set C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  |C| = {setCSize}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ({Math.round((setCSize / totalUniverseSize) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="set-c-select" className="sr-only">
                Choose Set C
              </label>
              <select
                id="set-c-select"
                value={setCId}
                onChange={(e) => onSelectC(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <optgroup label="Smartphone Brands">
                  {brandOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.id === setAId || opt.id === setBId}
                    >
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Canonical Features">
                  {featureOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.id === setAId || opt.id === setBId}
                    >
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2">
              {optionC?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## File 5: `src/components/setlab/VennDiagram2Set.tsx`

```typescript
"use client";

import React, { useState } from "react";
import type { TwoSetVennRegions } from "@/types/math";
import type { Operation2Set, ActiveOperation } from "./SetOperationsToolbar";

export interface VennDiagram2SetProps {
  setAName: string;
  setBName: string;
  regions: TwoSetVennRegions<string>;
  activeOperation: ActiveOperation;
  onSelectRegion: (op: Operation2Set) => void;
}

export function VennDiagram2Set({
  setAName,
  setBName,
  regions,
  activeOperation,
  onSelectRegion,
}: VennDiagram2SetProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region active checks based on algebraic operation
  const isOnlyAActive =
    activeOperation === "diff_ab" ||
    activeOperation === "union" ||
    activeOperation === "sym_diff" ||
    activeOperation === "comp_b";

  const isBothActive =
    activeOperation === "intersection" ||
    activeOperation === "union" ||
    activeOperation === "disjoint_ab";

  const isOnlyBActive =
    activeOperation === "diff_ba" ||
    activeOperation === "union" ||
    activeOperation === "sym_diff" ||
    activeOperation === "comp_a";

  const isNeitherActive =
    activeOperation === "neither" ||
    activeOperation === "comp_a" ||
    activeOperation === "comp_b";

  return (
    <div className="relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 overflow-hidden">
      {/* Top Banner with Set Labels */}
      <div className="w-full flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cobalt-600" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={setAName}>
            Set A: {setAName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={setBName}>
            Set B: {setBName}
          </span>
          <span className="h-3 w-3 rounded-full bg-lime-500" />
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full max-w-[540px] aspect-[540/320] relative">
        <svg
          viewBox="0 0 540 320"
          className="w-full h-full select-none"
          role="img"
          aria-label="Two-set Venn diagram representing Set A and Set B"
        >
          <defs>
            {/* Subtle drop shadows for interactive hover */}
            <filter id="venn-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.3" />
            </filter>
            <filter id="lime-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#84cc16" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Universal Set Bounding Rectangle */}
          <rect
            x="8"
            y="8"
            width="524"
            height="304"
            rx="12"
            fill={isNeitherActive ? "#f1f5f9" : "#fafafa"}
            stroke={isNeitherActive ? "#2563eb" : "#e2e8f0"}
            strokeWidth={isNeitherActive ? "2" : "1.5"}
            strokeDasharray={isNeitherActive ? "none" : "4 4"}
            className="transition-colors cursor-pointer"
            onClick={() => onSelectRegion("neither")}
            onMouseEnter={() => setHoveredRegion("neither")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Universe Label */}
          <text
            x="24"
            y="32"
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="600"
          >
            Universal Set U (n={regions.universeSet.size})
          </text>

          {/* Outside Region (Neither) Button Indicator */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectRegion("neither")}
            onMouseEnter={() => setHoveredRegion("neither")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="380"
              y="18"
              width="140"
              height="26"
              rx="6"
              fill={isNeitherActive ? "#2563eb" : "#ffffff"}
              stroke={isNeitherActive ? "#1d4ed8" : "#cbd5e1"}
              strokeWidth="1"
            />
            <text
              x="450"
              y="35"
              textAnchor="middle"
              fill={isNeitherActive ? "#ffffff" : "#475569"}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              (A ∪ B)ᶜ : n={regions.neither.size}
            </text>
          </g>

          {/* ============================================================== */}
          {/* Region 1: Only A (A \ B)                                       */}
          {/* Center (200, 160), R=105, intersection pts: (270, 81.74) to (270, 238.26) */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 1,0 270,238.26 A 105,105 0 0,0 270,81.74 Z"
            fill={
              isOnlyAActive
                ? "#2563eb"
                : hoveredRegion === "onlyA"
                ? "#93c5fd"
                : "#dbeafe"
            }
            fillOpacity={isOnlyAActive ? 0.85 : 0.45}
            stroke={isOnlyAActive ? "#1d4ed8" : "#3b82f6"}
            strokeWidth={isOnlyAActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("diff_ab")}
            onMouseEnter={() => setHoveredRegion("onlyA")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* ============================================================== */}
          {/* Region 2: Only B (B \ A)                                       */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 1,1 270,238.26 A 105,105 0 0,0 270,81.74 Z"
            fill={
              isOnlyBActive
                ? "#84cc16"
                : hoveredRegion === "onlyB"
                ? "#bef264"
                : "#d9f99d"
            }
            fillOpacity={isOnlyBActive ? 0.85 : 0.45}
            stroke={isOnlyBActive ? "#4d7c0f" : "#65a30d"}
            strokeWidth={isOnlyBActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("diff_ba")}
            onMouseEnter={() => setHoveredRegion("onlyB")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* ============================================================== */}
          {/* Region 3: Intersection (A ∩ B)                                  */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 0,1 270,238.26 A 105,105 0 0,1 270,81.74 Z"
            fill={
              isBothActive
                ? "#3b82f6"
                : hoveredRegion === "both"
                ? "#a7f3d0"
                : "#bfdbfe"
            }
            fillOpacity={isBothActive ? 0.95 : 0.65}
            stroke={isBothActive ? "#1e40af" : "#2563eb"}
            strokeWidth={isBothActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("intersection")}
            onMouseEnter={() => setHoveredRegion("both")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Labels & Dynamic Cardinality Badges */}

          {/* Region A Only Text */}
          <g
            className="pointer-events-none"
            transform="translate(180, 160)"
          >
            <text
              textAnchor="middle"
              y="-10"
              fontSize="12"
              fontWeight="bold"
              fill={isOnlyAActive ? "#ffffff" : "#1e40af"}
            >
              A only
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyAActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyA.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isOnlyAActive ? "#eff6ff" : "#475569"}
            >
              A \ B
            </text>
          </g>

          {/* Intersection A ∩ B Text */}
          <g
            className="pointer-events-none"
            transform="translate(270, 160)"
          >
            <text
              textAnchor="middle"
              y="-12"
              fontSize="11"
              fontWeight="bold"
              fill={isBothActive ? "#ffffff" : "#1e3a8a"}
            >
              Both
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="20"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isBothActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.both.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isBothActive ? "#eff6ff" : "#1e40af"}
            >
              A ∩ B
            </text>
          </g>

          {/* Region B Only Text */}
          <g
            className="pointer-events-none"
            transform="translate(360, 160)"
          >
            <text
              textAnchor="middle"
              y="-10"
              fontSize="12"
              fontWeight="bold"
              fill={isOnlyBActive ? "#ffffff" : "#365314"}
            >
              B only
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyB.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isOnlyBActive ? "#eff6ff" : "#3f6212"}
            >
              B \ A
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <span>Click any Venn region to inspect its matching respondent IDs</span>
        <span className="font-mono text-slate-600">
          |A ∪ B| = {regions.unionSet.size} of {regions.universeSet.size}
        </span>
      </div>
    </div>
  );
}
```

---

## File 6: `src/components/setlab/VennDiagram3Set.tsx`

```typescript
"use client";

import React, { useState } from "react";
import type { ThreeSetVennRegions } from "@/types/math";
import type { Operation3Set, ActiveOperation } from "./SetOperationsToolbar";

export interface VennDiagram3SetProps {
  setAName: string;
  setBName: string;
  setCName: string;
  regions: ThreeSetVennRegions<string>;
  activeOperation: ActiveOperation;
  onSelectRegion: (op: Operation3Set) => void;
}

export function VennDiagram3Set({
  setAName,
  setBName,
  setCName,
  regions,
  activeOperation,
  onSelectRegion,
}: VennDiagram3SetProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region active checks based on 3-set algebraic operation
  const isOnlyAActive = activeOperation === "only_a" || activeOperation === "union_abc";
  const isOnlyBActive = activeOperation === "only_b" || activeOperation === "union_abc";
  const isOnlyCActive = activeOperation === "only_c" || activeOperation === "union_abc";

  const isOnlyABActive =
    activeOperation === "only_ab" ||
    activeOperation === "inter_ab" ||
    activeOperation === "union_abc";

  const isOnlyACActive =
    activeOperation === "only_ac" ||
    activeOperation === "inter_ac" ||
    activeOperation === "union_abc";

  const isOnlyBCActive =
    activeOperation === "only_bc" ||
    activeOperation === "inter_bc" ||
    activeOperation === "union_abc";

  const isAllThreeActive =
    activeOperation === "inter_abc" ||
    activeOperation === "inter_ab" ||
    activeOperation === "inter_ac" ||
    activeOperation === "inter_bc" ||
    activeOperation === "union_abc";

  const isOutsideActive = activeOperation === "outside_abc";

  return (
    <div className="relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 overflow-hidden">
      {/* Top Banner with 3 Set Labels */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-cobalt-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setAName}>
            Set A: {setAName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-start sm:justify-center">
          <span className="h-3 w-3 rounded-full bg-lime-500 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setBName}>
            Set B: {setBName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-start sm:justify-end">
          <span className="h-3 w-3 rounded-full bg-purple-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setCName}>
            Set C: {setCName}
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full max-w-[560px] aspect-[560/460] relative">
        <svg
          viewBox="0 0 560 460"
          className="w-full h-full select-none"
          role="img"
          aria-label="Three-set Venn diagram representing Sets A, B, and C"
        >
          {/* Universal Set Bounding Rectangle */}
          <rect
            x="8"
            y="8"
            width="544"
            height="444"
            rx="12"
            fill={isOutsideActive ? "#f1f5f9" : "#fafafa"}
            stroke={isOutsideActive ? "#2563eb" : "#e2e8f0"}
            strokeWidth={isOutsideActive ? "2" : "1.5"}
            strokeDasharray={isOutsideActive ? "none" : "4 4"}
            className="transition-colors cursor-pointer"
            onClick={() => onSelectRegion("outside_abc")}
            onMouseEnter={() => setHoveredRegion("outside")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Universe Label */}
          <text
            x="24"
            y="32"
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="600"
          >
            Universal Set U (n={regions.universeSet.size})
          </text>

          {/* Outside Region Button */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectRegion("outside_abc")}
            onMouseEnter={() => setHoveredRegion("outside")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="390"
              y="18"
              width="150"
              height="26"
              rx="6"
              fill={isOutsideActive ? "#2563eb" : "#ffffff"}
              stroke={isOutsideActive ? "#1d4ed8" : hoveredRegion === "outside" ? "#3b82f6" : "#cbd5e1"}
              strokeWidth="1"
            />
            <text
              x="465"
              y="35"
              textAnchor="middle"
              fill={isOutsideActive ? "#ffffff" : "#475569"}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              (A ∪ B ∪ C)ᶜ : n={regions.outside.size}
            </text>
          </g>

          {/* 3 Translucent Circles Background */}
          {/* Circle A (Top): (280, 170), R=115 */}
          <circle
            cx="280"
            cy="170"
            r="115"
            fill="#2563eb"
            fillOpacity={0.15}
            stroke="#2563eb"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Circle B (Bottom-Left): (215, 275), R=115 */}
          <circle
            cx="215"
            cy="275"
            r="115"
            fill="#84cc16"
            fillOpacity={0.15}
            stroke="#65a30d"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Circle C (Bottom-Right): (345, 275), R=115 */}
          <circle
            cx="345"
            cy="275"
            r="115"
            fill="#a855f7"
            fillOpacity={0.15}
            stroke="#9333ea"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* ========================================================== */}
          {/* 7 Interactive Region Badges with Exact Dynamic Counts       */}
          {/* ========================================================== */}

          {/* 1. Only A: Top (280, 110) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(280, 110)"
            onClick={() => onSelectRegion("only_a")}
            onMouseEnter={() => setHoveredRegion("onlyA")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyAActive ? "#2563eb" : "#ffffff"}
              stroke={isOnlyAActive ? "#1d4ed8" : "#93c5fd"}
              strokeWidth={isOnlyAActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyAActive ? "#eff6ff" : "#1e40af"}
            >
              A only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyAActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyA.size}
            </text>
          </g>

          {/* 2. Only B: Bottom-Left (150, 320) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(150, 320)"
            onClick={() => onSelectRegion("only_b")}
            onMouseEnter={() => setHoveredRegion("onlyB")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyBActive ? "#84cc16" : "#ffffff"}
              stroke={isOnlyBActive ? "#4d7c0f" : "#bef264"}
              strokeWidth={isOnlyBActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyBActive ? "#1a2e05" : "#3f6212"}
            >
              B only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBActive ? "#0f172a" : "#0f172a"}
            >
              n = {regions.onlyB.size}
            </text>
          </g>

          {/* 3. Only C: Bottom-Right (410, 320) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(410, 320)"
            onClick={() => onSelectRegion("only_c")}
            onMouseEnter={() => setHoveredRegion("onlyC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyCActive ? "#a855f7" : "#ffffff"}
              stroke={isOnlyCActive ? "#7e22ce" : "#d8b4fe"}
              strokeWidth={isOnlyCActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyCActive ? "#ffffff" : "#6b21a8"}
            >
              C only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyCActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyC.size}
            </text>
          </g>

          {/* 4. Only AB: (A ∩ B) \ C (210, 200) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(210, 200)"
            onClick={() => onSelectRegion("only_ab")}
            onMouseEnter={() => setHoveredRegion("onlyAB")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyABActive ? "#0284c7" : "#ffffff"}
              stroke={isOnlyABActive ? "#0369a1" : "#7dd3fc"}
              strokeWidth={isOnlyABActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyABActive ? "#ffffff" : "#0369a1"}
            >
              (A ∩ B) \ C
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyABActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyAB.size}
            </text>
          </g>

          {/* 5. Only AC: (A ∩ C) \ B (350, 200) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(350, 200)"
            onClick={() => onSelectRegion("only_ac")}
            onMouseEnter={() => setHoveredRegion("onlyAC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyACActive ? "#6366f1" : "#ffffff"}
              stroke={isOnlyACActive ? "#4338ca" : "#a5b4fc"}
              strokeWidth={isOnlyACActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyACActive ? "#ffffff" : "#4338ca"}
            >
              (A ∩ C) \ B
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyACActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyAC.size}
            </text>
          </g>

          {/* 6. Only BC: (B ∩ C) \ A (280, 345) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(280, 345)"
            onClick={() => onSelectRegion("only_bc")}
            onMouseEnter={() => setHoveredRegion("onlyBC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyBCActive ? "#10b981" : "#ffffff"}
              stroke={isOnlyBCActive ? "#047857" : "#6ee7b7"}
              strokeWidth={isOnlyBCActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyBCActive ? "#ffffff" : "#047857"}
            >
              (B ∩ C) \ A
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBCActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyBC.size}
            </text>
          </g>

          {/* 7. Triple Intersection: A ∩ B ∩ C Center (280, 240) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            transform="translate(280, 240)"
            onClick={() => onSelectRegion("inter_abc")}
            onMouseEnter={() => setHoveredRegion("allThree")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-20"
              width="96"
              height="40"
              rx="8"
              fill={isAllThreeActive ? "#1e3a8a" : "#1e293b"}
              stroke={isAllThreeActive ? "#60a5fa" : "#334155"}
              strokeWidth={isAllThreeActive ? "3" : "2"}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            />
            <text
              y="-4"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#93c5fd"
            >
              A ∩ B ∩ C
            </text>
            <text
              y="13"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
              fill="#ffffff"
            >
              n = {regions.allThree.size}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <span>Click any region to inspect its exact respondent membership</span>
        <span className="font-mono text-slate-600">
          |A ∪ B ∪ C| = {regions.unionSet.size} (Sum of 7 regions = {regions.onlyA.size + regions.onlyB.size + regions.onlyC.size + regions.onlyAB.size + regions.onlyAC.size + regions.onlyBC.size + regions.allThree.size})
        </span>
      </div>
    </div>
  );
}
```

---

## File 7: `src/components/setlab/SetOperationsToolbar.tsx`

```typescript
"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";

export type Operation2Set =
  | "union"
  | "intersection"
  | "diff_ab"
  | "diff_ba"
  | "sym_diff"
  | "comp_a"
  | "comp_b"
  | "neither"
  | "subset_ab"
  | "disjoint_ab";

export type Operation3Set =
  | "union_abc"
  | "inter_abc"
  | "inter_ab"
  | "inter_ac"
  | "inter_bc"
  | "only_a"
  | "only_b"
  | "only_c"
  | "only_ab"
  | "only_ac"
  | "only_bc"
  | "outside_abc";

export type ActiveOperation = Operation2Set | Operation3Set;

export interface SetOperationsToolbarProps {
  mode: "2-set" | "3-set";
  activeOperation: ActiveOperation;
  onSelectOperation: (op: ActiveOperation) => void;
  resultCardinality: number;
  totalUniverse: number;
}

interface OperationButtonDef {
  id: ActiveOperation;
  label: string;
  symbol: string;
  category: "core" | "relative" | "complement" | "predicate";
}

const OPERATIONS_2SET: OperationButtonDef[] = [
  { id: "union", label: "Union", symbol: "A ∪ B", category: "core" },
  { id: "intersection", label: "Intersection", symbol: "A ∩ B", category: "core" },
  { id: "diff_ab", label: "Difference", symbol: "A \\ B", category: "relative" },
  { id: "diff_ba", label: "Difference", symbol: "B \\ A", category: "relative" },
  { id: "sym_diff", label: "Symmetric Diff", symbol: "A Δ B", category: "relative" },
  { id: "comp_a", label: "Complement of A", symbol: "Aᶜ", category: "complement" },
  { id: "comp_b", label: "Complement of B", symbol: "Bᶜ", category: "complement" },
  { id: "neither", label: "Neither Set", symbol: "(A ∪ B)ᶜ", category: "complement" },
  { id: "subset_ab", label: "Subset Test", symbol: "A ⊆ B?", category: "predicate" },
  { id: "disjoint_ab", label: "Disjointness", symbol: "A ∩ B = ∅?", category: "predicate" },
];

const OPERATIONS_3SET: OperationButtonDef[] = [
  { id: "union_abc", label: "Triple Union", symbol: "A ∪ B ∪ C", category: "core" },
  { id: "inter_abc", label: "Triple Intersect", symbol: "A ∩ B ∩ C", category: "core" },
  { id: "inter_ab", label: "Overlap A ∩ B", symbol: "A ∩ B", category: "core" },
  { id: "inter_ac", label: "Overlap A ∩ C", symbol: "A ∩ C", category: "core" },
  { id: "inter_bc", label: "Overlap B ∩ C", symbol: "B ∩ C", category: "core" },
  { id: "only_a", label: "A Only", symbol: "A \\ (B ∪ C)", category: "relative" },
  { id: "only_b", label: "B Only", symbol: "B \\ (A ∪ C)", category: "relative" },
  { id: "only_c", label: "C Only", symbol: "C \\ (A ∪ B)", category: "relative" },
  { id: "only_ab", label: "AB Only", symbol: "(A ∩ B) \\ C", category: "relative" },
  { id: "only_ac", label: "AC Only", symbol: "(A ∩ C) \\ B", category: "relative" },
  { id: "only_bc", label: "BC Only", symbol: "(B ∩ C) \\ A", category: "relative" },
  { id: "outside_abc", label: "Outside / None", symbol: "(A ∪ B ∪ C)ᶜ", category: "complement" },
];

export function SetOperationsToolbar({
  mode,
  activeOperation,
  onSelectOperation,
  resultCardinality,
  totalUniverse,
}: SetOperationsToolbarProps) {
  const operations = mode === "2-set" ? OPERATIONS_2SET : OPERATIONS_3SET;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-950">
              Set Theoretic Operations
            </h3>
            <Badge variant="lime">Live Calculation</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an algebraic expression to compute the resulting respondent subset and inspect its Venn partition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Result Cardinality:</span>
          <span className="font-mono text-sm font-bold text-cobalt-700 bg-cobalt-50 border border-cobalt-200 px-2.5 py-0.5 rounded-md">
            |Result| = {resultCardinality}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({Math.round((resultCardinality / totalUniverse) * 100)}%)
          </span>
        </div>
      </div>

      {/* Button Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {operations.map((op) => {
          const isActive = activeOperation === op.id;
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => onSelectOperation(op.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                isActive
                  ? "bg-cobalt-600 text-white shadow-sm ring-1 ring-cobalt-500"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200"
              }`}
            >
              <span className={`font-mono font-semibold ${isActive ? "text-lime-300" : "text-cobalt-600"}`}>
                {op.symbol}
              </span>
              <span className="text-[11px] opacity-90 hidden sm:inline">{op.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## File 8: `src/components/setlab/InclusionExclusionCalculator.tsx`

```typescript
"use client";

import React from "react";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Badge } from "@/components/ui/Badge";
import type {
  InclusionExclusionVerification,
  ThreeSetInclusionExclusionVerification,
} from "@/types/math";

export interface InclusionExclusionCalculatorProps {
  mode: "2-set" | "3-set";
  pie2Set: InclusionExclusionVerification<string>;
  pie3Set: ThreeSetInclusionExclusionVerification<string>;
  setAName: string;
  setBName: string;
  setCName: string;
  setASize: number;
  setBSize: number;
  setCSize?: number;
}

export function InclusionExclusionCalculator({
  mode,
  pie2Set,
  pie3Set,
  setAName,
  setBName,
  setCName,
  setASize,
  setBSize,
  setCSize,
}: InclusionExclusionCalculatorProps) {
  const is2Set = mode === "2-set";

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-950">
              Principle of Inclusion-Exclusion (PIE)
            </h3>
            <Badge variant="lime">Theorem Verification</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step arithmetic proof verifying algebraic cardinality against direct set union
          </p>
        </div>

        <div>
          {(is2Set ? pie2Set.isValid : pie3Set.isValid) ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 font-mono text-xs font-bold text-lime-900 border border-lime-300">
              <span className="h-2 w-2 rounded-full bg-lime-500 animate-pulse" />
              VERIFIED: PASS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 font-mono text-xs font-bold text-red-900 border border-red-300">
              FAILED
            </span>
          )}
        </div>
      </div>

      {is2Set ? (
        /* TWO-SET PIE CALCULATOR */
        <div className="space-y-4 text-xs">
          {/* Formula */}
          <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-4 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              1. Mathematical Identity (Two Sets)
            </span>
            <KaTeXMath
              math="|A \cup B| = |A| + |B| - |A \cap B|"
              block
              className="text-cobalt-700 font-bold text-sm sm:text-base py-1"
            />
          </div>

          {/* Substituted Numerical Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block" title={setAName}>
                |A| ({setAName})
              </span>
              <div className="font-mono text-lg font-bold text-cobalt-600 mt-1">
                {setASize}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block" title={setBName}>
                |B| ({setBName})
              </span>
              <div className="font-mono text-lg font-bold text-lime-600 mt-1">
                {setBSize}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block">
                Intersection |A ∩ B|
              </span>
              <div className="font-mono text-lg font-bold text-cobalt-700 mt-1">
                {pie2Set.intersectionCardinality}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block">
                Direct Union |A ∪ B|
              </span>
              <div className="font-mono text-lg font-bold text-slate-900 mt-1">
                {pie2Set.unionCardinality}
              </div>
            </div>
          </div>

          {/* Step by Step Breakdown */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              2. Substituted Arithmetic Step-by-Step
            </span>

            <div className="font-mono text-xs sm:text-sm bg-[#f8fafc] p-3 rounded-md border border-slate-200 space-y-1.5 text-slate-800">
              <p>
                <span className="text-slate-500">Identity:</span> |A ∪ B| = |A| + |B| - |A ∩ B|
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">Step 1 (Singletons Sum):</span> {setASize} + {setBSize} ={" "}
                <span className="font-bold text-slate-900">{pie2Set.individualCardinalitiesSum}</span>
              </p>
              <p className="text-slate-700">
                <span className="text-slate-500">Step 2 (Subtract Shared Overlap):</span> - |A ∩ B| = -{" "}
                <span className="font-bold text-cobalt-600">{pie2Set.intersectionCardinality}</span>
              </p>
              <p className="pt-1.5 border-t border-slate-200 text-slate-900">
                <span className="text-slate-500">Step 3 (Calculated RHS):</span> {pie2Set.individualCardinalitiesSum} - {pie2Set.intersectionCardinality} ={" "}
                <span className="font-bold text-lime-700">{pie2Set.calculatedRhs}</span>
              </p>
            </div>
          </div>

          {/* Verification comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3.5 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-500">
                Method 1: Algebraic PIE Formula
              </span>
              <div className="font-mono text-xl font-bold text-cobalt-600">
                |A ∪ B| = {pie2Set.calculatedRhs}
              </div>
              <p className="text-[11px] text-slate-500">
                Computed via arithmetic subtraction of shared elements
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3.5 space-y-1">
              <span className="text-[10px] font-semibold uppercase text-slate-500">
                Method 2: Direct Set Union
              </span>
              <div className="font-mono text-xl font-bold text-lime-600">
                |A ∪ B| = {pie2Set.unionCardinality}
              </div>
              <p className="text-[11px] text-slate-500">
                Computed by counting unique IDs in Set(A) ∪ Set(B)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* THREE-SET PIE CALCULATOR */
        <div className="space-y-4 text-xs">
          {/* Formula */}
          <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-4 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              1. Mathematical Identity (Three Sets)
            </span>
            <KaTeXMath
              math="|A \cup B \cup C| = |A| + |B| + |C| - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|"
              block
              className="text-cobalt-700 font-bold text-xs sm:text-sm py-1 overflow-x-auto"
            />
          </div>

          {/* Cardinality components breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block" title={setAName}>
                |A| ({setAName})
              </span>
              <div className="font-mono text-lg font-bold text-cobalt-600 mt-1">
                {setASize}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block" title={setBName}>
                |B| ({setBName})
              </span>
              <div className="font-mono text-lg font-bold text-lime-600 mt-1">
                {setBSize}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block" title={setCName}>
                |C| ({setCName})
              </span>
              <div className="font-mono text-lg font-bold text-purple-600 mt-1">
                {setCSize ?? pie3Set.cardC}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
              <span className="text-[10px] font-semibold uppercase text-slate-500 truncate block">
                Direct Union |A∪B∪C|
              </span>
              <div className="font-mono text-lg font-bold text-slate-900 mt-1">
                {pie3Set.unionCardinality}
              </div>
            </div>
          </div>

          {/* Substituted Step-by-Step Arithmetic */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              2. Substituted Arithmetic Step-by-Step
            </span>

            <div className="font-mono text-xs sm:text-sm bg-[#f8fafc] p-3 rounded-md border border-slate-200 space-y-2 text-slate-800">
              <p>
                <span className="text-slate-500">Substituted Formula:</span>{" "}
                |A ∪ B ∪ C| = ({setASize} + {setBSize} + {setCSize ?? pie3Set.cardC}) - ({pie3Set.cardAB} + {pie3Set.cardAC} + {pie3Set.cardBC}) + ({pie3Set.cardABC})
              </p>
              <div className="space-y-1 text-xs pt-1 border-t border-slate-200 text-slate-700">
                <p>
                  &bull; <span className="font-semibold text-slate-900">Step 1 (Singletons Sum):</span>{" "}
                  {setASize} + {setBSize} + {setCSize ?? pie3Set.cardC} = <span className="font-bold text-slate-900">{pie3Set.singletonsSum}</span>
                </p>
                <p>
                  &bull; <span className="font-semibold text-slate-900">Step 2 (Subtract Pairwise Overlaps):</span>{" "}
                  - ({pie3Set.cardAB} + {pie3Set.cardAC} + {pie3Set.cardBC}) = - <span className="font-bold text-cobalt-700">{pie3Set.pairwiseIntersectionsSum}</span>
                </p>
                <p>
                  &bull; <span className="font-semibold text-slate-900">Step 3 (Add Back Triple Intersection):</span>{" "}
                  + {pie3Set.tripleIntersection} ={" "}
                  <span className="font-bold text-lime-700">+{pie3Set.tripleIntersection}</span>
                </p>
              </div>
              <p className="pt-2 border-t border-slate-200 text-slate-900 font-semibold">
                Resulting Calculated RHS = {pie3Set.calculatedRhs} &equiv; Direct Union = {pie3Set.unionCardinality} (Identity Confirmed)
              </p>
            </div>
          </div>

          {/* Academic Commentary Note */}
          <div className="rounded-lg bg-cobalt-50/70 border border-cobalt-200 p-3 text-[11px] text-slate-700 leading-relaxed">
            <span className="font-semibold text-cobalt-900">Academic Note on Alternating Signs:</span> In Step 1, elements in the triple intersection A ∩ B ∩ C are counted 3 times (+3). In Step 2, they are subtracted in all 3 pairwise intersections (-3), leaving them counted 0 times. Therefore, Step 3 must add them back (+1) so every element in A ∪ B ∪ C is counted exactly once.
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## File 9: `src/components/setlab/EducationalCard.tsx`

```typescript
"use client";

import React from "react";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Badge } from "@/components/ui/Badge";
import type { ActiveOperation } from "./SetOperationsToolbar";

export interface EducationalCardProps {
  operation: ActiveOperation;
  setAName: string;
  setBName: string;
  setCName?: string;
  resultCount: number;
  totalUniverse: number;
}

interface DefinitionMeta {
  title: string;
  math: string;
  plainEnglish: string;
  properties: string[];
}

const DEFINITIONS: Record<ActiveOperation, (a: string, b: string, c?: string) => DefinitionMeta> = {
  union: (a, b) => ({
    title: "Set Union (A ∪ B)",
    math: "A \\cup B = \\{ x \\in U \\mid x \\in A \\lor x \\in B \\}",
    plainEnglish: `Contains every respondent who chose ${a}, or chose ${b}, or chose both. Elements belonging to both cohorts are listed without duplicate counting.`,
    properties: ["Commutative: A ∪ B = B ∪ A", "Associative: (A ∪ B) ∪ C = A ∪ (B ∪ C)", "Identity: A ∪ ∅ = A"],
  }),
  intersection: (a, b) => ({
    title: "Set Intersection (A ∩ B)",
    math: "A \\cap B = \\{ x \\in U \\mid x \\in A \\land x \\in B \\}",
    plainEnglish: `Contains strictly the respondents who simultaneously selected ${a} AND selected ${b}. If no student matches both criteria, the intersection is the empty set (∅).`,
    properties: ["Commutative: A ∩ B = B ∩ A", "Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)", "Domination: A ∩ ∅ = ∅"],
  }),
  diff_ab: (a, b) => ({
    title: "Relative Complement / Difference (A \\ B)",
    math: "A \\setminus B = \\{ x \\in U \\mid x \\in A \\land x \\notin B \\}",
    plainEnglish: `Contains respondents who chose ${a}, but did NOT choose ${b}. This isolates preferences specific to cohort A without influence from cohort B.`,
    properties: ["Non-commutative: A \\ B ≠ B \\ A (in general)", "A \\ B = A ∩ Bᶜ", "A \\ ∅ = A, A \\ A = ∅"],
  }),
  diff_ba: (a, b) => ({
    title: "Relative Complement / Difference (B \\ A)",
    math: "B \\setminus A = \\{ x \\in U \\mid x \\in B \\land x \\notin A \\}",
    plainEnglish: `Contains respondents who chose ${b}, but did NOT choose ${a}. This isolates preferences unique to cohort B.`,
    properties: ["Non-commutative: B \\ A ≠ A \\ B", "B \\ A = B ∩ Aᶜ", "Disjoint from A \\ B"],
  }),
  sym_diff: (a, b) => ({
    title: "Symmetric Difference (A Δ B)",
    math: "A \\mathbin{\\Delta} B = (A \\setminus B) \\cup (B \\setminus A) = \\{ x \\in U \\mid (x \\in A \\oplus x \\in B) \\}",
    plainEnglish: `Contains respondents who belong to either ${a} or ${b}, but NOT both. This is the exact set-theoretic equivalent of the XOR (exclusive-OR) logical operator.`,
    properties: ["Commutative: A Δ B = B Δ A", "A Δ B = (A ∪ B) \\ (A ∩ B)", "Self-inverse: A Δ A = ∅"],
  }),
  comp_a: (a) => ({
    title: "Absolute Complement (Aᶜ)",
    math: "A^c = U \\setminus A = \\{ x \\in U \\mid x \\notin A \\}",
    plainEnglish: `Contains all respondents in the university cohort who did NOT select ${a}. The complement is always defined relative to the universal set U.`,
    properties: ["Double Complement: (Aᶜ)ᶜ = A", "Complementarity: A ∪ Aᶜ = U and A ∩ Aᶜ = ∅", "De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ"],
  }),
  comp_b: (_, b) => ({
    title: "Absolute Complement (Bᶜ)",
    math: "B^c = U \\setminus B = \\{ x \\in U \\mid x \\notin B \\}",
    plainEnglish: `Contains all respondents in the university cohort who did NOT select ${b}.`,
    properties: ["(Bᶜ)ᶜ = B", "B ∪ Bᶜ = U", "B ∩ Bᶜ = ∅"],
  }),
  neither: (a, b) => ({
    title: "Neither Set: Complement of Union ((A ∪ B)ᶜ)",
    math: "(A \\cup B)^c = A^c \\cap B^c = \\{ x \\in U \\mid x \\notin A \\land x \\notin B \\}",
    plainEnglish: `Contains respondents who selected NEITHER ${a} NOR ${b}. According to De Morgan's Law, this is mathematically identical to the intersection of their individual complements.`,
    properties: ["De Morgan's First Law: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ", "Cardinality: |(A ∪ B)ᶜ| = |U| - |A ∪ B|"],
  }),
  subset_ab: (a, b) => ({
    title: "Subset Inclusion Predicate (A ⊆ B)",
    math: "A \\subseteq B \\iff \\forall x \\in U, \\, (x \\in A \\implies x \\in B)",
    plainEnglish: `Tests whether every respondent who selected ${a} also selected ${b}. If A ⊆ B, then A \\ B = ∅ and A ∩ B = A.`,
    properties: ["Reflexive: A ⊆ A", "Antisymmetric: (A ⊆ B and B ⊆ A) ⟹ A = B", "Transitive: (A ⊆ B and B ⊆ C) ⟹ A ⊆ C"],
  }),
  disjoint_ab: (a, b) => ({
    title: "Disjointness Predicate (A ∩ B = ∅)",
    math: "A \\cap B = \\emptyset \\iff \\neg \\exists x \\in U, \\, (x \\in A \\land x \\in B)",
    plainEnglish: `Tests whether cohorts ${a} and ${b} have zero shared respondents. Mutually exclusive cohorts produce |A ∪ B| = |A| + |B|.`,
    properties: ["Symmetric: (A ∩ B = ∅) ⟺ (B ∩ A = ∅)", "When disjoint: |A ∪ B| = |A| + |B|", "A \\ B = A when disjoint"],
  }),

  // Three-Set Operations
  union_abc: (a, b, c) => ({
    title: "Triple Set Union (A ∪ B ∪ C)",
    math: "A \\cup B \\cup C = \\{ x \\in U \\mid x \\in A \\lor x \\in B \\lor x \\in C \\}",
    plainEnglish: `Contains every respondent who selected at least one of ${a}, ${b}, or ${c || "Set C"}.`,
    properties: ["Associative & Commutative", "Sum of all 7 mutually exclusive Venn regions"],
  }),
  inter_abc: (a, b, c) => ({
    title: "Triple Set Intersection (A ∩ B ∩ C)",
    math: "A \\cap B \\cap C = \\{ x \\in U \\mid x \\in A \\land x \\in B \\land x \\in C \\}",
    plainEnglish: `Contains strictly the respondents who satisfy ALL THREE criteria simultaneously: ${a}, ${b}, AND ${c || "Set C"}. This is the central heart of the 3-set Venn diagram.`,
    properties: ["A ∩ B ∩ C ⊆ (A ∩ B)", "A ∩ B ∩ C ⊆ (A ∩ C)", "A ∩ B ∩ C ⊆ (B ∩ C)"],
  }),
  inter_ab: (a, b) => ({
    title: "Pairwise Overlap (A ∩ B)",
    math: "A \\cap B = \\{ x \\in U \\mid x \\in A \\land x \\in B \\}",
    plainEnglish: `Contains all respondents belonging to both ${a} and ${b}, regardless of whether they also belong to Set C.`,
    properties: ["A ∩ B = ((A ∩ B) \\ C) ∪ (A ∩ B ∩ C)"],
  }),
  inter_ac: (a, _, c) => ({
    title: "Pairwise Overlap (A ∩ C)",
    math: "A \\cap C = \\{ x \\in U \\mid x \\in A \\land x \\in C \\}",
    plainEnglish: `Contains all respondents belonging to both ${a} and ${c || "Set C"}.`,
    properties: ["A ∩ C = ((A ∩ C) \\ B) ∪ (A ∩ B ∩ C)"],
  }),
  inter_bc: (_, b, c) => ({
    title: "Pairwise Overlap (B ∩ C)",
    math: "B \\cap C = \\{ x \\in U \\mid x \\in B \\land x \\in C \\}",
    plainEnglish: `Contains all respondents belonging to both ${b} and ${c || "Set C"}.`,
    properties: ["B ∩ C = ((B ∩ C) \\ A) ∪ (A ∩ B ∩ C)"],
  }),
  only_a: (a, b, c) => ({
    title: "Exclusive to Set A (A \\ (B ∪ C))",
    math: "A \\setminus (B \\cup C) = \\{ x \\in A \\mid x \\notin B \\land x \\notin C \\}",
    plainEnglish: `Contains respondents who chose ${a}, but neither ${b} nor ${c || "Set C"}.`,
    properties: ["Mutually disjoint from all other 6 internal Venn regions"],
  }),
  only_b: (a, b, c) => ({
    title: "Exclusive to Set B (B \\ (A ∪ C))",
    math: "B \\setminus (A \\cup C) = \\{ x \\in B \\mid x \\notin A \\land x \\notin C \\}",
    plainEnglish: `Contains respondents who chose ${b}, but neither ${a} nor ${c || "Set C"}.`,
    properties: ["Mutually disjoint from all other 6 internal Venn regions"],
  }),
  only_c: (a, b, c) => ({
    title: "Exclusive to Set C (C \\ (A ∪ B))",
    math: "C \\setminus (A \\cup B) = \\{ x \\in C \\mid x \\notin A \\land x \\notin B \\}",
    plainEnglish: `Contains respondents who chose ${c || "Set C"}, but neither ${a} nor ${b}.`,
    properties: ["Mutually disjoint from all other 6 internal Venn regions"],
  }),
  only_ab: (a, b, c) => ({
    title: "Exclusive to A and B Only ((A ∩ B) \\ C)",
    math: "(A \\cap B) \\setminus C = \\{ x \\in U \\mid x \\in A \\land x \\in B \\land x \\notin C \\}",
    plainEnglish: `Contains respondents who chose both ${a} and ${b}, but explicitly omitted ${c || "Set C"}.`,
    properties: ["Pairwise exclusive lens region"],
  }),
  only_ac: (a, b, c) => ({
    title: "Exclusive to A and C Only ((A ∩ C) \\ B)",
    math: "(A \\cap C) \\setminus B = \\{ x \\in U \\mid x \\in A \\land x \\in C \\land x \\notin B \\}",
    plainEnglish: `Contains respondents who chose both ${a} and ${c || "Set C"}, but explicitly omitted ${b}.`,
    properties: ["Pairwise exclusive lens region"],
  }),
  only_bc: (a, b, c) => ({
    title: "Exclusive to B and C Only ((B ∩ C) \\ A)",
    math: "(B \\cap C) \\setminus A = \\{ x \\in U \\mid x \\in B \\land x \\in C \\land x \\notin A \\}",
    plainEnglish: `Contains respondents who chose both ${b} and ${c || "Set C"}, but explicitly omitted ${a}.`,
    properties: ["Pairwise exclusive lens region"],
  }),
  outside_abc: (a, b, c) => ({
    title: "Outside All Three ((A ∪ B ∪ C)ᶜ)",
    math: "(A \\cup B \\cup C)^c = U \\setminus (A \\cup B \\cup C)",
    plainEnglish: `Contains respondents who selected none of ${a}, ${b}, or ${c || "Set C"}.`,
    properties: ["De Morgan generalized: Aᶜ ∩ Bᶜ ∩ Cᶜ"],
  }),
};

export function EducationalCard({
  operation,
  setAName,
  setBName,
  setCName,
  resultCount,
  totalUniverse,
}: EducationalCardProps) {
  const getDef = DEFINITIONS[operation] || DEFINITIONS.intersection;
  const def = getDef(setAName, setBName, setCName);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Set Theoretic Definition &amp; Theory
          </span>
          <h3 className="text-base font-semibold tracking-tight text-slate-950 mt-0.5">
            {def.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cobalt">Formal Identity</Badge>
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            n = {resultCount} / {totalUniverse}
          </span>
        </div>
      </div>

      {/* KaTeX Mathematical Notation */}
      <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-4 text-center">
        <KaTeXMath math={def.math} block className="text-cobalt-700 font-bold text-sm sm:text-base" />
      </div>

      {/* Plain-English Explanation */}
      <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
        <span className="font-semibold text-slate-900 uppercase text-[10px] tracking-wider block">
          Intuitive Explanation:
        </span>
        <p>{def.plainEnglish}</p>
      </div>

      {/* Mathematical Properties */}
      <div className="border-t border-slate-100 pt-3">
        <span className="font-semibold text-slate-900 uppercase text-[10px] tracking-wider block mb-2">
          Discrete Mathematical Properties:
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-mono">
          {def.properties.map((prop, i) => (
            <li key={i} className="flex items-center gap-1.5 bg-[#f8fafc] p-2 rounded border border-slate-200/70">
              <span className="h-1.5 w-1.5 rounded-full bg-cobalt-500 flex-shrink-0" />
              <span>{prop}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## File 10: `src/components/setlab/SetRespondentExplorer.tsx`

```typescript
"use client";

import React, { useState, useMemo } from "react";
import type { SurveyResponse } from "@/types/survey";
import { Badge } from "@/components/ui/Badge";

export interface SetRespondentExplorerProps {
  matchingIds: Set<string>;
  allResponses: readonly SurveyResponse[];
  operationName: string;
  setExplanation: string;
}

export function SetRespondentExplorer({
  matchingIds,
  allResponses,
  operationName,
  setExplanation,
}: SetRespondentExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter full survey records belonging to the matching ID set
  const matchingResponses = useMemo(() => {
    return allResponses.filter((resp) => matchingIds.has(resp.response_id));
  }, [allResponses, matchingIds]);

  // Apply user's search query across IDs, brands, features, and primary use
  const filteredResponses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchingResponses;

    return matchingResponses.filter((r) => {
      return (
        r.response_id.toLowerCase().includes(q) ||
        r.preferred_brand.toLowerCase().includes(q) ||
        r.primary_use.toLowerCase().includes(q) ||
        r.preferred_features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [matchingResponses, searchQuery]);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 space-y-4">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-950">
              Matching Respondent Cohort
            </h3>
            <span className="font-mono text-xs font-bold text-cobalt-700 bg-cobalt-50 border border-cobalt-200 px-2 py-0.5 rounded">
              {matchingIds.size} {matchingIds.size === 1 ? "Respondent" : "Respondents"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {operationName} &bull; {setExplanation}
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search matching IDs or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={matchingIds.size === 0}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500 disabled:opacity-50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Results View */}
      {matchingIds.size === 0 ? (
        /* Empty Set State */
        <div className="rounded-lg border border-dashed border-slate-300 bg-[#f8fafc] p-8 text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-mono text-xl font-bold">
            &empty;
          </div>
          <h4 className="font-semibold text-slate-900 text-sm">Empty Set (&empty;)</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            No students in the active benchmark dataset ({allResponses.length} respondents) satisfy this set expression. In discrete mathematics, the cardinality of this subset is exactly |S| = 0.
          </p>
        </div>
      ) : filteredResponses.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-lg bg-[#f8fafc] p-6 text-center text-xs text-slate-500">
          No respondents match your search query &ldquo;{searchQuery}&rdquo; within this cohort of {matchingIds.size} respondents.
        </div>
      ) : (
        /* Responsive Table of Anonymized Records */
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#f8fafc] text-slate-600 font-semibold uppercase text-[11px]">
                <th className="px-3.5 py-2.5">Respondent ID</th>
                <th className="px-3.5 py-2.5">Brand</th>
                <th className="px-3.5 py-2.5">Budget Tier</th>
                <th className="px-3.5 py-2.5">Selected Features (Exactly 3)</th>
                <th className="px-3.5 py-2.5">Primary Use</th>
                <th className="px-3.5 py-2.5">OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResponses.map((r, idx) => (
                <tr
                  key={r.response_id}
                  className={`hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? "bg-[#f8fafc]/50" : "bg-white"}`}
                >
                  <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-900">
                    {r.response_id}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <Badge variant={r.preferred_brand === "Apple" ? "cobalt" : "default"}>
                      {r.preferred_brand}
                    </Badge>
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-600">
                    {r.budget_range}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {r.preferred_features.map((f, i) => (
                        <span
                          key={i}
                          className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700 font-medium border border-slate-200/80"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600 text-xs">
                    {r.primary_use}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[11px] text-slate-500">
                    {r.os_preference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>
          Showing {filteredResponses.length} of {matchingIds.size} matching student records
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          Strictly anonymized IDs &bull; Demo benchmark cohort (n={allResponses.length})
        </span>
      </div>
    </div>
  );
}
```

---

## File 11: `src/app/setlab/page.tsx`

```typescript
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { loadDemoSurveyDataset, getUniverseRespondentIds } from "@/lib/data/loader";
import { getAvailableSetOptions } from "@/lib/data/setDescriptors";
import {
  setIntersection,
  setUnion,
  setDifference,
  symmetricDifference,
  setComplement,
  isSubset,
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "@/lib/math/venn";

import { SetSelector } from "@/components/setlab/SetSelector";
import {
  SetOperationsToolbar,
  type ActiveOperation,
  type Operation2Set,
  type Operation3Set,
} from "@/components/setlab/SetOperationsToolbar";
import { VennDiagram2Set } from "@/components/setlab/VennDiagram2Set";
import { VennDiagram3Set } from "@/components/setlab/VennDiagram3Set";
import { InclusionExclusionCalculator } from "@/components/setlab/InclusionExclusionCalculator";
import { EducationalCard } from "@/components/setlab/EducationalCard";
import { SetRespondentExplorer } from "@/components/setlab/SetRespondentExplorer";

export default function SetLabPage() {
  const dataset = useMemo(() => loadDemoSurveyDataset(), []);
  const responses = dataset.responses;
  const universe = useMemo(() => getUniverseRespondentIds(responses), [responses]);
  const availableOptions = useMemo(() => getAvailableSetOptions(), []);

  // UI Mode: "2-set" or "3-set"
  const [mode, setMode] = useState<"2-set" | "3-set">("2-set");

  // Selected Set IDs
  const [setAId, setSetAId] = useState<string>("brand_apple");
  const [setBId, setSetBId] = useState<string>("feature_camera_quality");
  const [setCId, setSetCId] = useState<string>("feature_battery_life");

  // Active Algebraic Operation
  const [activeOperation, setActiveOperation] = useState<ActiveOperation>("intersection");

  // Resolve Set Option Descriptors
  const optionA = availableOptions.find((o) => o.id === setAId) || availableOptions[0]!;
  const optionB = availableOptions.find((o) => o.id === setBId) || availableOptions[1]!;
  const optionC = availableOptions.find((o) => o.id === setCId) || availableOptions[2]!;

  // Compute Discrete Sets of Respondent IDs
  const setA = useMemo(() => optionA.getIds(responses), [optionA, responses]);
  const setB = useMemo(() => optionB.getIds(responses), [optionB, responses]);
  const setC = useMemo(() => optionC.getIds(responses), [optionC, responses]);

  // Compute 2-Set Venn & PIE
  const regions2Set = useMemo(
    () => computeTwoSetVennRegions(universe, setA, setB),
    [universe, setA, setB]
  );
  const pie2Set = useMemo(
    () => verifyInclusionExclusionPrinciple(setA, setB),
    [setA, setB]
  );

  // Compute 3-Set Venn & PIE
  const regions3Set = useMemo(
    () => computeThreeSetVennRegions(universe, setA, setB, setC),
    [universe, setA, setB, setC]
  );
  const pie3Set = useMemo(
    () => verifyThreeSetInclusionExclusion(setA, setB, setC),
    [setA, setB, setC]
  );

  // Handle Mode Change
  const handleModeChange = (newMode: "2-set" | "3-set") => {
    setMode(newMode);
    setActiveOperation(newMode === "2-set" ? "intersection" : "inter_abc");
  };

  // Determine Current Matching Respondent IDs based on Active Operation
  const matchingIds: Set<string> = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return setUnion(setA, setB);
        case "intersection":
          return setIntersection(setA, setB);
        case "diff_ab":
          return setDifference(setA, setB);
        case "diff_ba":
          return setDifference(setB, setA);
        case "sym_diff":
          return symmetricDifference(setA, setB);
        case "comp_a":
          return setComplement(universe, setA);
        case "comp_b":
          return setComplement(universe, setB);
        case "neither":
          return regions2Set.neither;
        case "subset_ab":
          return isSubset(setA, setB) ? setA : setDifference(setA, setB);
        case "disjoint_ab":
          return setIntersection(setA, setB);
        default:
          return setIntersection(setA, setB);
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return regions3Set.unionSet;
        case "inter_abc":
          return regions3Set.allThree;
        case "inter_ab":
          return setIntersection(setA, setB);
        case "inter_ac":
          return setIntersection(setA, setC);
        case "inter_bc":
          return setIntersection(setB, setC);
        case "only_a":
          return regions3Set.onlyA;
        case "only_b":
          return regions3Set.onlyB;
        case "only_c":
          return regions3Set.onlyC;
        case "only_ab":
          return regions3Set.onlyAB;
        case "only_ac":
          return regions3Set.onlyAC;
        case "only_bc":
          return regions3Set.onlyBC;
        case "outside_abc":
          return regions3Set.outside;
        default:
          return regions3Set.allThree;
      }
    }
  }, [mode, activeOperation, setA, setB, setC, universe, regions2Set, regions3Set]);

  // Human-readable operation explanation for explorer
  const operationLabel = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return "Union: A ∪ B";
        case "intersection":
          return "Intersection: A ∩ B";
        case "diff_ab":
          return "Difference: A \\ B (A only)";
        case "diff_ba":
          return "Difference: B \\ A (B only)";
        case "sym_diff":
          return "Symmetric Difference: A Δ B";
        case "comp_a":
          return "Complement: Aᶜ (U \\ A)";
        case "comp_b":
          return "Complement: Bᶜ (U \\ B)";
        case "neither":
          return "Neither: (A ∪ B)ᶜ";
        case "subset_ab":
          return isSubset(setA, setB)
            ? "Subset Test: True (A ⊆ B)"
            : "Subset Test: False (Counterexample Elements in A \\ B)";
        case "disjoint_ab":
          return setIntersection(setA, setB).size === 0
            ? "Disjointness: True (A ∩ B = ∅)"
            : "Disjointness: False (Shared Elements Exist)";
        default:
          return "Active Selection";
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return "Triple Union: A ∪ B ∪ C";
        case "inter_abc":
          return "Triple Intersection: A ∩ B ∩ C";
        case "inter_ab":
          return "Pairwise Overlap: A ∩ B";
        case "inter_ac":
          return "Pairwise Overlap: A ∩ C";
        case "inter_bc":
          return "Pairwise Overlap: B ∩ C";
        case "only_a":
          return "Region 1: A Only (A \\ (B ∪ C))";
        case "only_b":
          return "Region 2: B Only (B \\ (A ∪ C))";
        case "only_c":
          return "Region 3: C Only (C \\ (A ∪ B))";
        case "only_ab":
          return "Region 4: AB Only ((A ∩ B) \\ C)";
        case "only_ac":
          return "Region 5: AC Only ((A ∩ C) \\ B)";
        case "only_bc":
          return "Region 6: BC Only ((B ∩ C) \\ A)";
        case "outside_abc":
          return "Region 8: Outside All Three ((A ∪ B ∪ C)ᶜ)";
        default:
          return "Active 3-Set Selection";
      }
    }
  }, [mode, activeOperation, setA, setB]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Interactive Mathematics Laboratory"
        title="SetLab"
        description="Formal set theory laboratory evaluating union, intersection, symmetric difference, relative complements, and the Principle of Inclusion-Exclusion on empirical student cohorts."
        badge={{ text: "DEMO DATA (n=12)", variant: "lime" }}
        actions={
          <>
            <Link href="/">
              <Button variant="outline" size="sm">
                &larr; Campus Pulse
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="primary" size="sm">
                Methodology
              </Button>
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Academic Dataset Status Banner */}
        <Callout
          variant="highlight"
          title="Active Laboratory Cohort (U = 12 Respondents)"
        >
          All operations below evaluate pure mathematical expressions on discrete sets of unique student IDs. Intersections and cardinalities are calculated dynamically from verified survey records rather than estimated from aggregate totals.
        </Callout>

        {/* 1. Set Definition Workspace */}
        <SetSelector
          mode={mode}
          onModeChange={handleModeChange}
          availableOptions={availableOptions}
          setAId={setAId}
          setBId={setBId}
          setCId={setCId}
          onSelectA={setSetAId}
          onSelectB={setSetBId}
          onSelectC={setSetCId}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
          totalUniverseSize={universe.size}
        />

        {/* 2. Set Operations Toolbar */}
        <SetOperationsToolbar
          mode={mode}
          activeOperation={activeOperation}
          onSelectOperation={setActiveOperation}
          resultCardinality={matchingIds.size}
          totalUniverse={universe.size}
        />

        {/* 3. Interactive Venn Diagram & Educational Theory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Venn Diagram */}
          <div className="lg:col-span-7">
            {mode === "2-set" ? (
              <VennDiagram2Set
                setAName={optionA.name}
                setBName={optionB.name}
                regions={regions2Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation2Set) => setActiveOperation(op)}
              />
            ) : (
              <VennDiagram3Set
                setAName={optionA.name}
                setBName={optionB.name}
                setCName={optionC.name}
                regions={regions3Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation3Set) => setActiveOperation(op)}
              />
            )}
          </div>

          {/* Educational Theory Card */}
          <div className="lg:col-span-5">
            <EducationalCard
              operation={activeOperation}
              setAName={optionA.name}
              setBName={optionB.name}
              setCName={mode === "3-set" ? optionC.name : undefined}
              resultCount={matchingIds.size}
              totalUniverse={universe.size}
            />
          </div>
        </div>

        {/* 4. Inclusion-Exclusion Calculator & Step-by-Step Proof */}
        <InclusionExclusionCalculator
          mode={mode}
          pie2Set={pie2Set}
          pie3Set={pie3Set}
          setAName={optionA.name}
          setBName={optionB.name}
          setCName={optionC.name}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
        />

        {/* 5. Matching Respondent Explorer */}
        <SetRespondentExplorer
          matchingIds={matchingIds}
          allResponses={responses}
          operationName={operationLabel}
          setExplanation={
            mode === "2-set"
              ? `Filtered against Set A (${optionA.name}) and Set B (${optionB.name})`
              : `Filtered against Sets A, B, and C (${optionA.name}, ${optionB.name}, ${optionC.name})`
          }
        />
      </div>
    </div>
  );
}
```

---

## File 12: `src/__tests__/venn.test.ts`

```typescript
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
  const setA = new Set(["1", "2", "4", "5"]);
  const setB = new Set(["2", "3", "5", "6"]);
  const setC = new Set(["4", "5", "6", "7"]);

  it("partitions 3 overlapping sets into 7 mutually disjoint internal regions + outside", () => {
    const r = computeThreeSetVennRegions(universe, setA, setB, setC);

    expect(Array.from(r.onlyA)).toEqual(["1"]);
    expect(Array.from(r.onlyB)).toEqual(["3"]);
    expect(Array.from(r.onlyC)).toEqual(["7"]);
    expect(Array.from(r.onlyAB)).toEqual(["2"]);
    expect(Array.from(r.onlyAC)).toEqual(["4"]);
    expect(Array.from(r.onlyBC)).toEqual(["6"]);
    expect(Array.from(r.allThree)).toEqual(["5"]);
    expect(Array.from(r.outside).sort()).toEqual(["10", "8", "9"]);

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

    expect(pie.singletonsSum).toBe(12);
    expect(pie.pairwiseIntersectionsSum).toBe(6);
    expect(pie.calculatedRhs).toBe(7);
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
```
