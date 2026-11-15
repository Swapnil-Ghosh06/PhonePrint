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
    <div className="rounded-xs border border-stone-300/80 bg-white p-5 shadow-none text-stone-900 space-y-4">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-stone-900 font-sans">
              Matching Respondent Cohort
            </h3>
            <span className="font-mono text-xs font-semibold text-stone-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
              {matchingIds.size} {matchingIds.size === 1 ? "Respondent" : "Respondents"}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
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
            className="w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 shadow-none focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 disabled:opacity-50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Results View */}
      {matchingIds.size === 0 ? (
        /* Empty Set State */
        <div className="rounded-xs border border-dashed border-stone-300 bg-[#FAF9F5]/60 p-8 text-center space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-stone-700 font-mono text-lg font-bold">
            &empty;
          </div>
          <h4 className="font-semibold text-stone-900 text-xs">Empty Set (&empty;)</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed font-sans">
            No students in the active benchmark dataset ({allResponses.length} respondents) satisfy this set expression. In discrete mathematics, the cardinality of this subset is exactly |S| = 0.
          </p>
        </div>
      ) : filteredResponses.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-xs bg-[#FAF9F5] p-6 text-center text-xs text-stone-500 font-sans">
          No respondents match your search query &ldquo;{searchQuery}&rdquo; within this cohort of {matchingIds.size} respondents.
        </div>
      ) : (
        /* Responsive Table of Anonymized Records */
        <div className="overflow-x-auto rounded-xs border border-stone-300/80 bg-white">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-stone-200 bg-[#FAF9F5] text-stone-500 font-mono uppercase text-[10px] tracking-wider">
                <th className="px-3.5 py-2.5">Respondent ID</th>
                <th className="px-3.5 py-2.5">Brand</th>
                <th className="px-3.5 py-2.5">Budget Tier</th>
                <th className="px-3.5 py-2.5">Selected Features (Exactly 3)</th>
                <th className="px-3.5 py-2.5">Primary Use</th>
                <th className="px-3.5 py-2.5">OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredResponses.map((r, idx) => (
                <tr
                  key={r.response_id}
                  className={`hover:bg-stone-50/70 transition-colors ${idx % 2 === 1 ? "bg-[#FCFCFA]/60" : "bg-white"}`}
                >
                  <td className="px-3.5 py-2.5 font-mono font-semibold text-stone-900">
                    {r.response_id}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <Badge variant={r.preferred_brand === "Apple" ? "cobalt" : "default"}>
                      {r.preferred_brand}
                    </Badge>
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[11px] text-stone-600">
                    {r.budget_range}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {r.preferred_features.map((f, i) => (
                        <span
                          key={i}
                          className="inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-700 font-medium border border-stone-200"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-stone-600 text-xs">
                    {r.primary_use}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-[11px] text-stone-500">
                    {r.os_preference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 font-sans">
        <span>
          Showing {filteredResponses.length} of {matchingIds.size} matching student records
        </span>
        <span className="font-mono text-[10px] text-stone-400">
          Strictly anonymized IDs &bull; Active cohort (n={allResponses.length})
        </span>
      </div>
    </div>
  );
}
