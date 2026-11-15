"use client";

import React from "react";
import { BUDGET_RANGES, type BudgetRange } from "@/types/survey";

export interface BudgetCombinationControlsProps {
  selectedBudgets: readonly BudgetRange[];
  setSelectedBudgets: (budgets: BudgetRange[]) => void;
}

export function BudgetCombinationControls({
  selectedBudgets,
  setSelectedBudgets,
}: BudgetCombinationControlsProps) {
  const toggleBudget = (b: BudgetRange) => {
    if (selectedBudgets.includes(b)) {
      if (selectedBudgets.length > 1) {
        setSelectedBudgets(selectedBudgets.filter((budget) => budget !== b));
      }
    } else {
      setSelectedBudgets([...selectedBudgets, b]);
    }
  };

  return (
    <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-4 space-y-3 shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200 pb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-700">
          Select Budget Segments to Compare ({selectedBudgets.length} / {BUDGET_RANGES.length})
        </span>
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedBudgets([...BUDGET_RANGES])}
            className="text-cobalt-700 hover:underline font-medium"
          >
            All Segments
          </button>
          <span className="text-stone-300">|</span>
          <button
            onClick={() => setSelectedBudgets(["Under ₹15,000", "Above ₹60,000"])}
            className="text-cobalt-700 hover:underline font-medium"
          >
            Extreme Tiers
          </button>
          <span className="text-stone-300">|</span>
          <button
            onClick={() => setSelectedBudgets(["₹15,000 - ₹30,000", "₹30,000 - ₹60,000"])}
            className="text-cobalt-700 hover:underline font-medium"
          >
            Mid-Range Tiers
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {BUDGET_RANGES.map((b) => {
          const isSelected = selectedBudgets.includes(b);
          return (
            <button
              key={b}
              onClick={() => toggleBudget(b)}
              className={`p-3 rounded-md border text-center text-xs font-medium transition-all ${
                isSelected
                  ? "border-cobalt-600 bg-cobalt-50 text-cobalt-950 font-semibold shadow-none"
                  : "border-stone-200 bg-white hover:bg-stone-100 text-stone-700"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}
