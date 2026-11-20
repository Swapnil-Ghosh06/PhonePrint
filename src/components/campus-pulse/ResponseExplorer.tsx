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
        <span className="font-montserrat font-semibold text-slate-900 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60 text-xs">
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
        <span className="font-montserrat text-xs text-slate-600 font-medium">
          {r.budget_range}
        </span>
      ),
    },
    {
      key: "preferred_features",
      header: "Selected Features (3 Distinct)",
      render: (r) => (
        <div className="flex flex-wrap gap-1.5">
          {r.preferred_features.map((f, i) => (
            <span
              key={i}
              className="inline-block rounded-full bg-blue-50/80 border border-blue-200/60 px-2.5 py-0.5 text-[11px] text-blue-700 font-medium font-sans"
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
        <span className="text-slate-600 text-xs font-sans">
          {r.primary_use}
        </span>
      ),
    },
    {
      key: "os_preference",
      header: "OS Preference",
      render: (r) => (
        <Badge variant={r.os_preference === "iOS" ? "cobalt" : "lime"}>
          {r.os_preference}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters and search in a glass bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs
          items={brandTabs}
          activeId={activeBrandFilter}
          onChange={setActiveBrandFilter}
          size="sm"
        />

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search respondents or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-panel rounded-xl px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 border border-slate-200/80 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Responses Data Table */}
      <DataTable
        columns={columns}
        data={filteredResponses}
        keyExtractor={(r) => r.response_id}
        emptyMessage="No respondents matched the current filters."
      />
    </div>
  );
}
