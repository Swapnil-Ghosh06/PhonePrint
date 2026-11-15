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
    <div className="rounded-xs border border-stone-300/80 bg-white p-5 shadow-none text-stone-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-stone-900 font-sans">
              Set Theoretic Operations
            </h3>
            <Badge variant="lime">Live Calculation</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            Select an algebraic expression to compute the resulting respondent subset and inspect its Venn partition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-sans">Result Cardinality:</span>
          <span className="font-mono text-xs font-semibold text-stone-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
            |Result| = {resultCardinality}
          </span>
          <span className="text-xs text-stone-400 font-mono">
            ({Math.round((resultCardinality / totalUniverse) * 100)}%)
          </span>
        </div>
      </div>

      {/* Button Grid */}
      <div className="flex flex-wrap items-center gap-1.5">
        {operations.map((op) => {
          const isActive = activeOperation === op.id;
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => onSelectOperation(op.id)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                isActive
                  ? "bg-stone-900 text-white shadow-none"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 border border-stone-200"
              }`}
            >
              <span className={`font-mono text-xs font-semibold ${isActive ? "text-stone-100" : "text-stone-900"}`}>
                {op.symbol}
              </span>
              <span className="text-[10px] text-stone-400 hidden sm:inline font-sans">{op.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
