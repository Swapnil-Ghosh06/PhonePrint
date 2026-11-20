"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BUDGET_RANGES,
  type BudgetRange,
} from "@/types/survey";
import type { CombinationAnalyticsSummary, FeatureCombinationRecord } from "@/types/math";

export interface BudgetCombinationAnalysisProps {
  analytics: CombinationAnalyticsSummary;
  onSelectCombination?: (combination: FeatureCombinationRecord) => void;
}

export function BudgetCombinationAnalysis({
  analytics,
  onSelectCombination,
}: BudgetCombinationAnalysisProps) {
  const [activeBudget, setActiveBudget] = useState<BudgetRange>("₹15,000 - ₹30,000");

  const tierCohortSize = analytics.budgetCohortSizes[activeBudget] ?? 0;

  // Combinations observed in this budget tier
  const tierCombinations = useMemo(() => {
    return analytics.combinations
      .filter((combo) => combo.budgetBreakdown[activeBudget].count > 0)
      .sort(
        (a, b) =>
          b.budgetBreakdown[activeBudget].count -
          a.budgetBreakdown[activeBudget].count
      );
  }, [analytics.combinations, activeBudget]);

  return (
    <Card>
      <CardHeader
        title="Budget-Segmented Feature Combination Analysis"
        subtitle="Comparing feature bundle choices across price sensitivity cohorts with rigorous denominator integrity"
        badge={<Badge variant="cobalt">Stratified Combinatorics</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Budget Tier Selector Tabs */}
        <div>
          <label className="text-xs font-montserrat uppercase tracking-wider text-slate-500 font-semibold block mb-2.5">
            Select Budget Segment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BUDGET_RANGES.map((range) => {
              const count = analytics.budgetCohortSizes[range];
              const isActive = activeBudget === range;
              return (
                <button
                  key={range}
                  onClick={() => setActiveBudget(range)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    isActive
                      ? "border-blue-500 bg-blue-50/70 shadow-sm"
                      : "border-slate-200/80 glass-panel hover:bg-white text-slate-700"
                  }`}
                >
                  <span className="text-xs font-sora font-bold block text-slate-900">
                    {range}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px] font-montserrat">
                    <span className="text-slate-500">Cohort Size:</span>
                    <span
                      className={`font-bold ${
                        count > 0 ? "text-blue-700" : "text-slate-400"
                      }`}
                    >
                      {count} {count === 1 ? "student" : "students"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl border border-white/80 p-5">
            <span className="text-xs font-montserrat uppercase tracking-wider text-slate-500 font-semibold block">
              Segment Sample Size
            </span>
            <div className="mt-1 font-sora text-3xl font-extrabold text-slate-900">
              {tierCohortSize}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Strict denominator for within-budget percentages
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-white/80 p-5">
            <span className="text-xs font-montserrat uppercase tracking-wider text-blue-700 font-semibold block">
              Distinct Bundles Observed
            </span>
            <div className="mt-1 font-sora text-3xl font-extrabold text-blue-600">
              {tierCombinations.length}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Unique feature triplets in this price bracket
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-white/80 p-5">
            <span className="text-xs font-montserrat uppercase tracking-wider text-emerald-700 font-semibold block">
              Full Cohort Share
            </span>
            <div className="mt-1 font-sora text-3xl font-extrabold text-emerald-600">
              {analytics.totalRespondents > 0
                ? (
                    (tierCohortSize / analytics.totalRespondents) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              {tierCohortSize} of {analytics.totalRespondents} total survey participants
            </p>
          </div>
        </div>

        {/* Combinations Breakdown in Selected Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-sora font-bold text-slate-900">
              Observed Feature Bundles in {activeBudget}
            </h4>
            <span className="text-xs font-montserrat text-slate-500">
              {tierCombinations.length} combinations active
            </span>
          </div>

          {tierCombinations.length === 0 ? (
            <div className="p-8 text-center rounded-2xl glass-panel border border-dashed border-slate-300 text-slate-500 text-xs font-sans">
              No respondents in this budget tier have selected an active feature combination.
            </div>
          ) : (
            <div className="space-y-2.5">
              {tierCombinations.map((combo) => {
                const breakdown = combo.budgetBreakdown[activeBudget];
                return (
                  <div
                    key={combo.key || combo.id}
                    onClick={() => onSelectCombination?.(combo)}
                    className="p-4 rounded-2xl glass-panel border border-white/80 hover:bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      {combo.features.map((f) => (
                        <span
                          key={f}
                          className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-montserrat font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-montserrat">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block">
                          {breakdown.count} {breakdown.count === 1 ? "student" : "students"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {breakdown.percentageWithinBudget.toFixed(1)}% of tier
                        </span>
                      </div>
                      <span className="text-slate-400">&rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
