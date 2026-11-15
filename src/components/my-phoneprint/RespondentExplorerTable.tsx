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
    <Card className="border-stone-300/80 shadow-none">
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
                categoryFilter === "all"
                  ? "bg-stone-900 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80"
              }`}
            >
              All ({respondents.length})
            </button>
            <button
              onClick={() => setCategoryFilter("exact_3")}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
                categoryFilter === "exact_3"
                  ? "bg-lime-800 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80"
              }`}
            >
              Exact (3/3) [{countExact}]
            </button>
            <button
              onClick={() => setCategoryFilter("partial_2")}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
                categoryFilter === "partial_2"
                  ? "bg-cobalt-800 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80"
              }`}
            >
              2 of 3 [{count2}]
            </button>
            <button
              onClick={() => setCategoryFilter("partial_1")}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
                categoryFilter === "partial_1"
                  ? "bg-stone-800 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80"
              }`}
            >
              1 of 3 [{count1}]
            </button>
            <button
              onClick={() => setCategoryFilter("none_0")}
              className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
                categoryFilter === "none_0"
                  ? "bg-stone-800 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300/80"
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
              className="h-8.5 w-full rounded-xs border border-stone-300 bg-white px-3 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 shadow-none"
            />
          </div>
        </div>

        {/* Results Table */}
        {filteredRespondents.length === 0 ? (
          <div className="p-8 text-center rounded-xs border border-dashed border-stone-300 bg-[#FAF9F5]/50">
            <p className="text-xs text-stone-500 font-sans">
              No respondent records match your current filter and search query.
            </p>
            <button
              onClick={() => {
                setCategoryFilter("all");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-medium text-cobalt-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xs border border-stone-300/80 bg-white shadow-none">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF9F5] text-[10px] font-mono uppercase tracking-wider text-stone-600 border-b border-stone-300/80 font-semibold">
                <tr>
                  <th className="px-3.5 py-2.5">Respondent ID</th>
                  <th className="px-3.5 py-2.5">Brand Match</th>
                  <th className="px-3.5 py-2.5">Budget Match</th>
                  <th className="px-3.5 py-2.5">Feature Overlap</th>
                  <th className="px-3.5 py-2.5 text-center">Score</th>
                  <th className="px-3.5 py-2.5">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60">
                {filteredRespondents.map((r, idx) => (
                  <tr
                    key={r.response_id}
                    className={`hover:bg-stone-50 transition-colors ${
                      r.matchCategory === "exact_3"
                        ? "bg-lime-50/25"
                        : idx % 2 === 1
                        ? "bg-[#FAF9F5]/40"
                        : "bg-white"
                    }`}
                  >
                    {/* ID & Details */}
                    <td className="px-3.5 py-2.5">
                      <span className="font-mono font-semibold text-stone-900 block">
                        {r.response_id}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {r.preferred_brand} &bull; {r.budget_range}
                      </span>
                    </td>

                    {/* Brand Match */}
                    <td className="px-3.5 py-2.5">
                      {r.brandMatch ? (
                        <span className="inline-flex items-center gap-1 font-medium text-lime-900 bg-lime-50 border border-lime-300 px-2 py-0.5 rounded-xs text-[11px]">
                          ✓ Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-xs text-[11px]">
                          ✕ {r.preferred_brand}
                        </span>
                      )}
                    </td>

                    {/* Budget Match */}
                    <td className="px-3.5 py-2.5">
                      {r.budgetMatch ? (
                        <span className="inline-flex items-center gap-1 font-medium text-lime-900 bg-lime-50 border border-lime-300 px-2 py-0.5 rounded-xs text-[11px]">
                          ✓ Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-stone-500 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-xs text-[11px]">
                          ✕ {r.budget_range}
                        </span>
                      )}
                    </td>

                    {/* Feature Overlap */}
                    <td className="px-3.5 py-2.5">
                      <div className="space-y-1">
                        <span className="font-mono font-medium text-stone-800 block text-xs">
                          {r.featureOverlapCount} of 3 features ({r.featureMatch ? "Exact Triplet" : `${r.featureOverlapCount} shared`})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {r.preferred_features.map((f, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded-xs font-sans bg-[#FAF9F5] text-stone-700 border border-stone-300/80"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="px-3.5 py-2.5 text-center">
                      <span className="font-mono text-xs font-semibold text-stone-900">
                        {r.matchedConditionsCount}/3
                      </span>
                    </td>

                    {/* Classification */}
                    <td className="px-3.5 py-2.5">
                      {r.matchCategory === "exact_3" && (
                        <Badge variant="lime">Exact (3/3)</Badge>
                      )}
                      {r.matchCategory === "partial_2" && (
                        <Badge variant="cobalt">2 of 3 ({r.matchedConditionsList.join(" + ")})</Badge>
                      )}
                      {r.matchCategory === "partial_1" && (
                        <Badge variant="outline">1 of 3 ({r.matchedConditionsList.join("")})</Badge>
                      )}
                      {r.matchCategory === "none_0" && (
                        <Badge variant="default">0 of 3 (Disjoint)</Badge>
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
