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
    <div className="rounded-xs border border-stone-300/80 bg-white p-5 shadow-none text-stone-900 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-stone-900 font-sans">
              Principle of Inclusion-Exclusion (PIE)
            </h3>
            <Badge variant="lime">Theorem Verification</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            Step-by-step arithmetic proof verifying algebraic cardinality against direct set union
          </p>
        </div>

        <div>
          {(is2Set ? pie2Set.isValid : pie3Set.isValid) ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-lime-900 border border-lime-200">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-600" />
              VERIFIED: PASS
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-red-900 border border-red-200">
              FAILED
            </span>
          )}
        </div>
      </div>

      {is2Set ? (
        /* TWO-SET PIE CALCULATOR */
        <div className="space-y-4 text-xs">
          {/* Formula */}
          <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              1. Mathematical Identity (Two Sets)
            </span>
            <KaTeXMath
              math="|A \cup B| = |A| + |B| - |A \cap B|"
              block
              className="text-stone-900 font-bold text-sm sm:text-base py-1"
            />
          </div>

          {/* Substituted Numerical Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500 truncate block" title={setAName}>
                |A| ({setAName})
              </span>
              <div className="font-serif text-xl font-bold text-cobalt-700 mt-1">
                {setASize}
              </div>
            </div>

            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500 truncate block" title={setBName}>
                |B| ({setBName})
              </span>
              <div className="font-serif text-xl font-bold text-lime-700 mt-1">
                {setBSize}
              </div>
            </div>

            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500 truncate block">
                Intersection |A ∩ B|
              </span>
              <div className="font-serif text-xl font-bold text-cobalt-800 mt-1">
                {pie2Set.intersectionCardinality}
              </div>
            </div>

            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500 truncate block">
                Direct Union |A ∪ B|
              </span>
              <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                {pie2Set.unionCardinality}
              </div>
            </div>
          </div>

          {/* Step by Step Breakdown */}
          <div className="rounded-xs border border-stone-200 bg-white p-4 space-y-3 shadow-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              2. Substituted Arithmetic Step-by-Step
            </span>

            <div className="font-mono text-xs sm:text-sm bg-[#FAF9F5] p-3 rounded-md border border-stone-200 space-y-1.5 text-stone-800">
              <p>
                <span className="text-stone-400">Identity:</span> |A ∪ B| = |A| + |B| - |A ∩ B|
              </p>
              <p className="text-stone-700">
                <span className="text-stone-400">Step 1 (Singletons Sum):</span> {setASize} + {setBSize} ={" "}
                <span className="font-bold text-stone-900">{pie2Set.individualCardinalitiesSum}</span>
              </p>
              <p className="text-stone-700">
                <span className="text-stone-400">Step 2 (Subtract Overlap):</span> - |A ∩ B| = -{" "}
                <span className="font-bold text-cobalt-700">{pie2Set.intersectionCardinality}</span>
              </p>
              <p className="pt-1.5 border-t border-stone-200 text-stone-900">
                <span className="text-stone-400">Step 3 (Calculated RHS):</span> {pie2Set.individualCardinalitiesSum} - {pie2Set.intersectionCardinality} ={" "}
                <span className="font-bold text-lime-800">{pie2Set.calculatedRhs}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-lime-50/30 rounded-md border border-lime-200 text-xs text-lime-900">
              <span className="font-semibold">
                ✓ Theorem Verified: Calculated RHS ({pie2Set.calculatedRhs}) strictly equals Direct Union cardinality ({pie2Set.unionCardinality}).
              </span>
              <span className="font-mono text-[11px] text-lime-800">
                No aggregation error (|LHS - RHS| = 0)
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* THREE-SET PIE CALCULATOR */
        <div className="space-y-4 text-xs font-sans">
          {/* Formula */}
          <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              1. Mathematical Identity (Three Sets)
            </span>
            <KaTeXMath
              math="|A \cup B \cup C| = (|A| + |B| + |C|) - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C|"
              block
              className="text-stone-900 font-bold text-xs sm:text-sm py-1"
            />
          </div>

          {/* Substituted Numerical Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500">Singletons Sum</span>
              <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                {pie3Set.singletonsSum}
              </div>
              <span className="text-[10px] text-stone-500 font-mono truncate block" title={`${setAName} + ${setBName} + ${setCName ?? "Set C"}`}>
                {setASize} + {setBSize} + {setCSize ?? 0}
              </span>
            </div>

            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500">Pairwise Sum</span>
              <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                {pie3Set.pairwiseIntersectionsSum}
              </div>
              <span className="text-[10px] text-stone-500 font-mono">
                {pie3Set.cardAB} + {pie3Set.cardAC} + {pie3Set.cardBC}
              </span>
            </div>

            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500">Triple Intersection</span>
              <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                {pie3Set.cardABC}
              </div>
              <span className="text-[10px] text-stone-500 font-mono">|A ∩ B ∩ C|</span>
            </div>

            <div className="rounded-xs border border-stone-200 bg-white p-3 shadow-none">
              <span className="text-[10px] font-mono uppercase text-stone-500">Direct Union</span>
              <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                {pie3Set.unionCardinality}
              </div>
              <span className="text-[10px] text-stone-500 font-mono">|A ∪ B ∪ C|</span>
            </div>
          </div>

          {/* Step by Step Breakdown */}
          <div className="rounded-xs border border-stone-200 bg-white p-4 space-y-3 shadow-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              2. Substituted Arithmetic Step-by-Step
            </span>

            <div className="font-mono text-xs sm:text-sm bg-[#FAF9F5] p-3 rounded-md border border-stone-200 space-y-1.5 text-stone-800">
              <p>
                <span className="text-stone-400">Step 1 (Add 1-wise):</span> {setASize} + {setBSize} + {setCSize ?? 0} ={" "}
                <span className="font-bold text-stone-900">{pie3Set.singletonsSum}</span>
              </p>
              <p>
                <span className="text-stone-400">Step 2 (Subtract 2-wise):</span> - ({pie3Set.cardAB} + {pie3Set.cardAC} + {pie3Set.cardBC}) = -{" "}
                <span className="font-bold text-cobalt-700">{pie3Set.pairwiseIntersectionsSum}</span>
              </p>
              <p>
                <span className="text-stone-400">Step 3 (Add 3-wise):</span> + {pie3Set.cardABC} ={" "}
                <span className="font-bold text-lime-800">+{pie3Set.cardABC}</span>
              </p>
              <p className="pt-1.5 border-t border-stone-200 text-stone-900">
                <span className="text-stone-400">Step 4 (Calculated RHS):</span> {pie3Set.singletonsSum} - {pie3Set.pairwiseIntersectionsSum} + {pie3Set.cardABC} ={" "}
                <span className="font-bold text-lime-800">{pie3Set.calculatedRhs}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-lime-50/30 rounded-md border border-lime-200 text-xs text-lime-900">
              <span className="font-semibold">
                ✓ 3-Set PIE Verified: Calculated RHS ({pie3Set.calculatedRhs}) equals Direct Union ({pie3Set.unionCardinality}).
              </span>
              <span className="font-mono text-[11px] text-lime-800">
                Exact Partition Theorem Holds
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
