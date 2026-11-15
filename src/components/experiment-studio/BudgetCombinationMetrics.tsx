"use client";

import React from "react";
import type { BudgetCombinationAnalysisResult } from "@/types/experiment";

export interface BudgetCombinationMetricsProps {
  result: BudgetCombinationAnalysisResult;
}

export function BudgetCombinationMetrics({
  result,
}: BudgetCombinationMetricsProps) {
  const {
    totalTheoreticalCombinations,
    totalObservedInDataset,
    totalUnobservedInDataset,
    selectedBudgets,
    budgetTotals,
  } = result;

  const totalRespondentsInSelected = selectedBudgets.reduce(
    (acc, b) => acc + (budgetTotals[b] ?? 0),
    0
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Theoretical Space */}
      <div className="rounded-xs border border-stone-200 bg-white p-4 shadow-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
          Theoretical Triplet Space
        </span>
        <div className="mt-1 font-serif text-3xl font-bold text-stone-900">
          {totalTheoreticalCombinations}
        </div>
        <span className="text-[11px] text-stone-500 font-medium">
          C(7, 3) mathematical subsets
        </span>
      </div>

      {/* Observed Triplets */}
      <div className="rounded-xs border border-stone-200 bg-white p-4 shadow-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-lime-800 block">
          Observed in Dataset
        </span>
        <div className="mt-1 font-serif text-3xl font-bold text-lime-700">
          {totalObservedInDataset}
        </div>
        <span className="text-[11px] text-stone-500 font-medium">
          {((totalObservedInDataset / totalTheoreticalCombinations) * 100).toFixed(1)}% space coverage
        </span>
      </div>

      {/* Unobserved Voids */}
      <div className="rounded-xs border border-stone-200 bg-white p-4 shadow-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
          Theoretical Voids
        </span>
        <div className="mt-1 font-serif text-3xl font-bold text-stone-500">
          {totalUnobservedInDataset}
        </div>
        <span className="text-[11px] text-stone-500 font-medium">
          {((totalUnobservedInDataset / totalTheoreticalCombinations) * 100).toFixed(1)}% unchosen in cohort
        </span>
      </div>

      {/* Selected Segments Sample */}
      <div className="rounded-xs border border-stone-200 bg-white p-4 shadow-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cobalt-800 block">
          Selected Segments Sample
        </span>
        <div className="mt-1 font-serif text-3xl font-bold text-cobalt-700">
          {totalRespondentsInSelected}
        </div>
        <span className="text-[11px] text-stone-500 font-medium">
          Across {selectedBudgets.length} budget tier{selectedBudgets.length > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
