"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type {
  BudgetCombinationAnalysisResult,
  BudgetCombinationRow,
} from "@/types/experiment";

export interface BudgetCombinationTableProps {
  result: BudgetCombinationAnalysisResult;
  onSelectRow?: (row: BudgetCombinationRow) => void;
}

type TableFilter = "observed" | "all" | "voids";

export function BudgetCombinationTable({
  result,
  onSelectRow,
}: BudgetCombinationTableProps) {
  const { all35Rows, selectedBudgets, budgetTotals } = result;

  const [activeFilter, setActiveFilter] = useState<TableFilter>("observed");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(() => {
    return all35Rows.filter((row) => {
      // 1. Status Filter
      if (activeFilter === "observed" && !row.isObservedOverall) return false;
      if (activeFilter === "voids" && row.isObservedOverall) return false;

      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = row.combinationId.toLowerCase().includes(q);
        const matchesFeature = row.features.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesFeature) return false;
      }

      return true;
    });
  }, [all35Rows, activeFilter, searchQuery]);

  const countObserved = all35Rows.filter((r) => r.isObservedOverall).length;
  const countVoids = all35Rows.length - countObserved;

  return (
    <Card>
      <CardHeader
        title="Theoretical Space vs. Empirical Observations"
        subtitle="Full enumeration of all C(7, 3) = 35 combinations mapped against selected budget tiers"
        badge={
          <Badge variant="cobalt">
            {filteredRows.length} / {all35Rows.length} Triplets Displayed
          </Badge>
        }
      />
      <CardContent className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xs bg-[#FAF9F5] border border-stone-200">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFilter("observed")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeFilter === "observed"
                  ? "bg-lime-600 text-white shadow-none font-semibold"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              Observed in Dataset ({countObserved})
            </button>
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeFilter === "all"
                  ? "bg-stone-900 text-white shadow-none font-semibold"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              All 35 Theoretical Space ({all35Rows.length})
            </button>
            <button
              onClick={() => setActiveFilter("voids")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeFilter === "voids"
                  ? "bg-stone-600 text-white shadow-none font-semibold"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              Theoretical Voids ({countVoids})
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-60">
            <input
              type="text"
              placeholder="Search by ID or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-stone-300 bg-white px-3 text-xs text-stone-800 placeholder-stone-400 focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            />
          </div>
        </div>

        {/* Results Table */}
        {filteredRows.length === 0 ? (
          <div className="p-8 text-center rounded-xs border border-dashed border-stone-200 bg-[#FAF9F5]">
            <p className="text-sm text-stone-500 font-medium">
              No combinations match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-semibold text-cobalt-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xs border border-stone-200 bg-white max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-[11px] font-mono uppercase tracking-wider text-stone-700 border-b border-stone-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3.5 py-3 w-24">Triplet ID</th>
                  <th className="px-3.5 py-3 min-w-56">Canonical Feature Triplet</th>
                  <th className="px-3.5 py-3 text-center w-28">Status</th>
                  {selectedBudgets.map((b) => (
                    <th key={b} className="px-3 py-3 text-center min-w-28">
                      <span className="block truncate">{b}</span>
                      <span className="text-[10px] text-stone-500 font-normal block font-sans">
                        N = {budgetTotals[b] ?? 0}
                      </span>
                    </th>
                  ))}
                  <th className="px-3.5 py-3 text-center w-28 bg-stone-100/70 border-l border-stone-200">
                    Total Cohort
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredRows.map((row) => (
                  <tr
                    key={row.combinationId}
                    onClick={() => onSelectRow?.(row)}
                    className={`hover:bg-stone-50 cursor-pointer transition-colors ${
                      row.isObservedOverall ? "" : "opacity-75 bg-[#FAF9F5]/40"
                    }`}
                  >
                    {/* ID */}
                    <td className="px-3.5 py-3 font-mono font-bold text-stone-900">
                      {row.combinationId}
                    </td>

                    {/* Features */}
                    <td className="px-3.5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.features.map((f) => (
                          <span
                            key={f}
                            className="text-[11px] font-medium text-stone-800 bg-[#FAF9F5] px-2 py-0.5 rounded border border-stone-200"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-3.5 py-3 text-center">
                      {row.isObservedOverall ? (
                        <Badge variant="lime" className="font-mono text-[10px]">
                          Observed
                        </Badge>
                      ) : (
                        <span className="font-mono text-[10px] text-stone-400 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                          Void
                        </span>
                      )}
                    </td>

                    {/* Frequencies by Selected Budget */}
                    {selectedBudgets.map((b) => {
                      const count = row.frequenciesByBudget[b] ?? 0;
                      const pct = row.percentagesByBudget[b] ?? 0;

                      return (
                        <td key={b} className="px-3 py-3 text-center">
                          {count > 0 ? (
                            <div className="font-mono">
                              <span className="font-bold text-stone-900">
                                {count} resp.
                              </span>
                              <span className="text-[10px] text-lime-700 block font-semibold">
                                {pct}% of tier
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-300 font-mono text-xs">
                              0
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Cohort Frequency */}
                    <td className="px-3.5 py-3 text-center font-mono font-bold text-stone-800 bg-[#FAF9F5] border-l border-stone-200">
                      {row.totalObservedOverall > 0 ? (
                        <div>
                          <span>{row.totalObservedOverall}</span>
                          <span className="text-[10px] text-stone-500 block font-sans font-normal">
                            {((row.totalObservedOverall / result.totalCohortSize) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-stone-400">0</span>
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
