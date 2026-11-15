"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  SMARTPHONE_FEATURES,
  type SmartphoneFeature,
} from "@/types/survey";
import type { FeatureCombinationRecord } from "@/types/math";

export interface FeatureCombinationExplorerProps {
  combinations: readonly FeatureCombinationRecord[];
  totalRespondents: number;
  onSelectCombination?: (combination: FeatureCombinationRecord) => void;
  selectedCombinationId?: string | null;
}

type FilterStatus = "all" | "observed" | "unobserved";

export function FeatureCombinationExplorer({
  combinations,
  totalRespondents,
  onSelectCombination,
  selectedCombinationId,
}: FeatureCombinationExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [featureFilter, setFeatureFilter] = useState<string>("all");

  const filteredCombinations = useMemo(() => {
    return combinations.filter((combo) => {
      // 1. Status Filter
      if (statusFilter === "observed" && !combo.isObserved) return false;
      if (statusFilter === "unobserved" && combo.isObserved) return false;

      // 2. Feature Filter
      if (
        featureFilter !== "all" &&
        !combo.features.includes(featureFilter as SmartphoneFeature)
      ) {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = combo.id.toLowerCase().includes(q);
        const matchesFeature = combo.features.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesFeature) return false;
      }

      return true;
    });
  }, [combinations, statusFilter, featureFilter, searchQuery]);

  const observedCount = combinations.filter((c) => c.isObserved).length;
  const unobservedCount = combinations.length - observedCount;

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Combinatorial Triplet Space Explorer (All 35 Triplets)"
        subtitle={`Dynamic enumeration of C(7, 3) = 35 combinations mapped against ${totalRespondents} survey observations`}
        badge={
          <Badge variant="cobalt">
            {filteredCombinations.length} / {combinations.length} Displayed
          </Badge>
        }
      />
      <CardContent className="space-y-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-xs bg-[#FAF9F5] border border-stone-200">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-stone-900 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              All Triplets ({combinations.length})
            </button>
            <button
              onClick={() => setStatusFilter("observed")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "observed"
                  ? "bg-lime-700 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              Observed ({observedCount})
            </button>
            <button
              onClick={() => setStatusFilter("unobserved")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === "unobserved"
                  ? "bg-stone-700 text-white shadow-none"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              Unobserved Voids ({unobservedCount})
            </button>
          </div>

          {/* Search & Feature Filter Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              className="h-8.5 w-full sm:w-auto rounded-md border border-stone-200 bg-white px-2.5 text-xs text-stone-800 focus:border-stone-400 focus:outline-none shadow-none"
            >
              <option value="all">Contains Any Feature</option>
              {SMARTPHONE_FEATURES.map((feature) => (
                <option key={feature} value={feature}>
                  Contains: {feature}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by ID or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full sm:w-48 rounded-md border border-stone-200 bg-white px-3 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:outline-none shadow-none"
            />
          </div>
        </div>

        {/* Combinations Grid */}
        {filteredCombinations.length === 0 ? (
          <div className="p-8 text-center rounded-xs border border-dashed border-stone-300 bg-[#FAF9F5]/50">
            <p className="text-xs text-stone-500 font-sans">
              No combinations match your current search and filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setFeatureFilter("all");
              }}
              className="mt-2 text-xs text-cobalt-700 hover:underline font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredCombinations.map((combo) => {
              const isSelected = selectedCombinationId === combo.id;
              return (
                <div
                  key={combo.id}
                  onClick={() => onSelectCombination?.(combo)}
                  className={`p-3.5 rounded-xs border text-left cursor-pointer transition-colors ${
                    isSelected
                      ? "border-cobalt-600 bg-cobalt-50/50 shadow-none"
                      : combo.isObserved
                      ? "border-stone-200 bg-white hover:border-stone-300 hover:shadow-none"
                      : "border-stone-200/70 bg-[#FAF9F5]/70 hover:bg-stone-100/60"
                  }`}
                >
                  {/* Top Bar: ID and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold text-stone-700">
                      {combo.id}
                    </span>
                    {combo.isObserved ? (
                      <Badge variant="lime" className="text-[10px] font-medium">
                        {combo.observedCount} resp. ({combo.observedPercentage}%)
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-mono font-medium text-stone-400 bg-stone-100 border border-stone-200 px-1.5 py-0.2 rounded">
                        0 resp. (Void)
                      </span>
                    )}
                  </div>

                  {/* Feature Badges */}
                  <div className="space-y-1 my-2">
                    {combo.features.map((feature) => (
                      <div
                        key={feature}
                        className="text-xs text-stone-800 bg-[#FAF9F5] px-2 py-0.5 rounded border border-stone-200 truncate font-sans"
                        title={feature}
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Footer info */}
                  <div className="pt-2 mt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500 font-sans">
                    <span>
                      {combo.isObserved
                        ? `${combo.matchingRespondentIds.length} student${
                            combo.matchingRespondentIds.length > 1 ? "s" : ""
                          }`
                        : "Theoretical void"}
                    </span>
                    <span className="text-stone-900 font-medium hover:underline text-xs">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
