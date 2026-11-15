"use client";

import React, { useState, useMemo } from "react";
import type { SurveyResponse } from "@/types/survey";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

interface ResponseExplorerProps {
  responses: readonly SurveyResponse[];
}

export function ResponseExplorer({ responses }: ResponseExplorerProps) {
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const brandTabs = useMemo(() => {
    const brands = Array.from(new Set(responses.map((r) => r.preferred_brand))).sort();
    return [
      { id: "all", label: "All Brands", badge: responses.length },
      ...brands.map((b) => ({
        id: b,
        label: b,
        badge: responses.filter((r) => r.preferred_brand === b).length,
      })),
    ];
  }, [responses]);

  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      const matchesBrand =
        activeBrandFilter === "all" || r.preferred_brand === activeBrandFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.response_id.toLowerCase().includes(q) ||
        r.preferred_brand.toLowerCase().includes(q) ||
        r.primary_use.toLowerCase().includes(q) ||
        r.preferred_features.some((f) => f.toLowerCase().includes(q));

      return matchesBrand && matchesSearch;
    });
  }, [responses, activeBrandFilter, searchQuery]);

  const columns: Column<SurveyResponse>[] = [
    {
      key: "response_id",
      header: "Respondent ID",
      render: (r) => (
        <span className="font-mono font-semibold text-stone-900">
          {r.response_id}
        </span>
      ),
    },
    {
      key: "preferred_brand",
      header: "Brand",
      render: (r) => (
        <Badge variant={r.preferred_brand === "Apple" ? "cobalt" : "default"}>
          {r.preferred_brand}
        </Badge>
      ),
    },
    {
      key: "budget_range",
      header: "Budget Tier",
      render: (r) => (
        <span className="font-mono text-[11px] text-stone-600">
          {r.budget_range}
        </span>
      ),
    },
    {
      key: "preferred_features",
      header: "Selected Features (Exactly 3 Distinct)",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.preferred_features.map((f, i) => (
            <span
              key={i}
              className="inline-block rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-700 font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "primary_use",
      header: "Primary Use",
      render: (r) => (
        <span className="text-stone-600 text-xs font-sans">
          {r.primary_use}
        </span>
      ),
    },
    {
      key: "os_preference",
      header: "OS",
      render: (r) => (
        <span className="font-mono text-[11px] text-stone-500">
          {r.os_preference}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          items={brandTabs}
          activeId={activeBrandFilter}
          onChange={setActiveBrandFilter}
          size="sm"
        />

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search respondent or feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 shadow-2xs focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
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

      <DataTable
        columns={columns}
        data={filteredResponses}
        keyExtractor={(r) => r.response_id}
        emptyMessage="No respondents match the active filter criteria"
      />

      <div className="flex items-center justify-between text-[11px] text-stone-400 px-1 font-sans">
        <span>
          Showing {filteredResponses.length} of {responses.length} respondent records
        </span>
        <span className="font-mono text-[10px] text-stone-400">
          Validated via Zod SurveyResponseSchema
        </span>
      </div>
    </div>
  );
}
