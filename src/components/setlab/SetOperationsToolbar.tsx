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
    <div className="glass-panel rounded-2xl border border-white/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 pb-3">
        <div>
          <span className="text-xs font-montserrat uppercase tracking-wider text-slate-500 font-semibold block">
            Algebraic Operations
          </span>
          <span className="text-xs text-slate-500 font-sans">
            Click any set operation to highlight its Venn region and filter matching respondents
          </span>
        </div>

        {/* Live Cardinality Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-montserrat text-slate-500">Result Size:</span>
          <Badge variant="cobalt" size="md">
            |Result| = {resultCardinality} ({((resultCardinality / totalUniverse) * 100).toFixed(1)}%)
          </Badge>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="flex flex-wrap gap-2">
        {operations.map((op) => {
          const isActive = activeOperation === op.id;
          return (
            <button
              key={op.id}
              onClick={() => onSelectOperation(op.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-montserrat transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20"
                  : "glass-panel hover:bg-white text-slate-700 border border-slate-200/70"
              }`}
            >
              <span className={isActive ? "text-blue-100 font-bold" : "text-blue-600 font-semibold"}>
                {op.symbol}
              </span>
              <span>{op.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
