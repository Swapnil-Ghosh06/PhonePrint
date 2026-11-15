"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
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
          <label className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-2">
            Select Budget Segment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BUDGET_RANGES.map((range) => {
              const count = analytics.budgetCohortSizes[range];
              const isActive = activeBudget === range;
              return (
                <button
                  key={range}
                  onClick={() => setActiveBudget(range)}
                  className={`p-3 rounded-xs border text-left transition-all ${
                    isActive
                      ? "border-cobalt-600 bg-cobalt-50/50 shadow-none"
                      : "border-stone-200 bg-white hover:bg-[#FAF9F5] text-stone-700"
                  }`}
                >
                  <span className="text-xs font-serif font-bold block text-stone-900">
                    {range}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-stone-500">Cohort Size:</span>
                    <span
                      className={`font-mono font-bold ${
                        count > 0 ? "text-cobalt-700" : "text-stone-400"
                      }`}
                    >
                      {count} {count === 1 ? "resp." : "resps."}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xs border border-stone-200 bg-white p-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
              Segment Sample Size (N_tier)
            </span>
            <div className="mt-1 font-serif text-3xl font-bold text-stone-900">
              {tierCohortSize}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Strict denominator for within-budget percentages
            </p>
          </div>

          <div className="rounded-xs border border-stone-200 bg-white p-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cobalt-800 block">
              Distinct Combinations Observed
            </span>
            <div className="mt-1 font-serif text-3xl font-bold text-cobalt-700">
              {tierCombinations.length}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Unique feature triplets in this price bracket
            </p>
          </div>

          <div className="rounded-xs border border-stone-200 bg-white p-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-lime-800 block">
              Full Cohort Share
            </span>
            <div className="mt-1 font-serif text-3xl font-bold text-stone-900">
              {analytics.totalRespondents > 0
                ? (
                    (tierCohortSize / analytics.totalRespondents) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {tierCohortSize} of {analytics.totalRespondents} total study participants
            </p>
          </div>
        </div>

        {/* Combinations Breakdown in Selected Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-700">
              Feature Combinations in {activeBudget}
            </h4>
            <span className="text-xs text-stone-500 font-mono">
              Denominator = {tierCohortSize}
            </span>
          </div>

          {tierCohortSize === 0 ? (
            <div className="p-8 text-center rounded-xs border border-dashed border-stone-200 bg-[#FAF9F5]">
              <p className="text-sm text-stone-600 font-medium">
                No respondents in the current survey dataset belong to the {activeBudget} tier.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Within-tier percentage defaults to 0% with division-by-zero protection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tierCombinations.map((combo) => {
                const tierMetrics = combo.budgetBreakdown[activeBudget];
                return (
                  <div
                    key={combo.id}
                    onClick={() => onSelectCombination?.(combo)}
                    className="p-4 rounded-xs border border-stone-200 bg-white hover:border-cobalt-400 cursor-pointer transition-all shadow-none space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-700">
                          {combo.id}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {combo.features.map((f) => (
                            <span
                              key={f}
                              className="text-[11px] font-medium text-stone-800 bg-[#FAF9F5] px-2 py-0.5 rounded border border-stone-200"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="lime" className="font-mono">
                          {tierMetrics.percentageWithinBudget}% of Tier
                        </Badge>
                        <Badge variant="outline" className="font-mono text-stone-600">
                          {combo.observedPercentage}% Overall
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                      <div>
                        <span className="font-medium text-stone-700">
                          Within-Tier Calculation:
                        </span>{" "}
                        <span className="font-mono text-cobalt-700 font-bold">
                          {tierMetrics.count} / {tierCohortSize} respondents ={" "}
                          {tierMetrics.percentageWithinBudget}%
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-stone-700">
                          Full-Cohort Calculation:
                        </span>{" "}
                        <span className="font-mono text-stone-600">
                          {tierMetrics.count} / {analytics.totalRespondents} respondents ={" "}
                          {(
                            (tierMetrics.count / analytics.totalRespondents) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Methodological Alert on Subgroup Denominators */}
        <Callout variant="warning" title="Methodological Safeguard: Denominator Integrity">
          When analyzing sub-populations (such as budget tiers), reporting
          percentages requires using the specific stratum size (
          <KaTeXMath math="N_{\text{tier}}" />
          ) as the denominator. For instance, in the &quot;{activeBudget}&quot;
          segment, frequencies are divided by <KaTeXMath math={`N = ${tierCohortSize}`} />
          . With small subgroup samples, individual preferences produce larger percentage
          swings (e.g., 1 respondent ={" "}
          {tierCohortSize > 0
            ? ((1 / tierCohortSize) * 100).toFixed(1)
            : "0.0"}
          %). Subgroup percentages must never be confused with overall cohort
          proportions.
        </Callout>
      </CardContent>
    </Card>
  );
}
