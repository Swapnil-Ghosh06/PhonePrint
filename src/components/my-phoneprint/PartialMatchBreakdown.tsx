"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import type { MatchEngineResult } from "@/types/matcher";

export interface PartialMatchBreakdownProps {
  result: MatchEngineResult;
}

export function PartialMatchBreakdown({ result }: PartialMatchBreakdownProps) {
  const {
    category3Exact,
    category2Partial,
    category1Partial,
    category0None,
    totalCohort,
  } = result;

  // Category counts and percentages
  const n3 = category3Exact.count;
  const p3 = category3Exact.percentage;

  const n2 = category2Partial.total.count;
  const p2 = category2Partial.total.percentage;

  const n1 = category1Partial.total.count;
  const p1 = category1Partial.total.percentage;

  const n0 = category0None.count;
  const p0 = category0None.percentage;

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Mutually Exclusive Match Classification"
        subtitle="Partition of the respondent cohort across 3, 2, 1, or 0 satisfied criteria"
        badge={<Badge variant="cobalt">Discrete Classification</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Visual Partition Distribution Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-stone-700">
            <span>Cohort Distribution (N = {totalCohort})</span>
            <span className="font-mono text-stone-500">
              {n3 + n2 + n1 + n0} / {totalCohort} Respondents (100%)
            </span>
          </div>

          <div className="flex h-4 w-full overflow-hidden rounded-xs border border-stone-300/80 bg-stone-100">
            {n3 > 0 && (
              <div
                style={{ width: `${p3}%` }}
                className="bg-lime-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`Exact 3/3: ${n3} (${p3}%)`}
              >
                {p3 >= 15 ? `${p3}%` : ""}
              </div>
            )}
            {n2 > 0 && (
              <div
                style={{ width: `${p2}%` }}
                className="bg-cobalt-600 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`2 of 3: ${n2} (${p2}%)`}
              >
                {p2 >= 15 ? `${p2}%` : ""}
              </div>
            )}
            {n1 > 0 && (
              <div
                style={{ width: `${p1}%` }}
                className="bg-stone-400 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                title={`1 of 3: ${n1} (${p1}%)`}
              >
                {p1 >= 15 ? `${p1}%` : ""}
              </div>
            )}
            {n0 > 0 && (
              <div
                style={{ width: `${p0}%` }}
                className="bg-stone-200 transition-all flex items-center justify-center text-[10px] font-medium text-stone-600"
                title={`0 of 3: ${n0} (${p0}%)`}
              >
                {p0 >= 15 ? `${p0}%` : ""}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-stone-600 font-sans">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-lime-600" />
              <span>3/3 Criteria (Exact): {n3}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-cobalt-600" />
              <span>2/3 Criteria: {n2}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-stone-400" />
              <span>1/3 Criteria: {n1}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-stone-200" />
              <span>0/3 Criteria: {n0}</span>
            </div>
          </div>
        </div>

        {/* 4 Category Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category 3: 3 of 3 (Exact) */}
          <div className="rounded-xs border border-lime-300 bg-lime-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 block">
                  1. All 3 Conditions Matched
                </span>
                <span className="text-xs text-stone-500 font-sans">Exact Phenotype Intersection</span>
              </div>
              <Badge variant="lime" className="font-mono">
                {n3} resp. ({p3}%)
              </Badge>
            </div>

            <div className="p-3 rounded-xs bg-white border border-stone-300/80 text-xs text-stone-700 space-y-1">
              <div className="font-medium text-stone-900">
                Brand + Budget + Features Triplet
              </div>
              <p className="text-[11px] font-mono text-stone-500">
                Formula: B ∩ P ∩ F
              </p>
              {n3 > 0 ? (
                <div className="font-mono text-[11px] text-stone-800 font-medium pt-1 max-h-16 overflow-y-auto">
                  IDs: {Array.from(category3Exact.ids).join(", ")}
                </div>
              ) : (
                <div className="text-[11px] text-stone-400 italic pt-1 font-sans">
                  No respondents in this exact category.
                </div>
              )}
            </div>
          </div>

          {/* Category 2: Exactly 2 of 3 */}
          <div className="rounded-xs border border-cobalt-300 bg-blue-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 block">
                  2. Exactly 2 Conditions Matched
                </span>
                <span className="text-xs text-stone-500 font-sans">Close Partial Phenotypes</span>
              </div>
              <Badge variant="cobalt" className="font-mono">
                {n2} resp. ({p2}%)
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs font-sans">
              {/* Brand + Budget */}
              <div className="p-2.5 rounded-xs bg-white border border-stone-300/80 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-800 block">
                    Brand &amp; Budget (Different Features)
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    (B ∩ P) \ F
                  </span>
                </div>
                <span className="font-mono font-medium text-stone-800 bg-stone-100 px-2 py-0.5 rounded-xs text-[11px]">
                  {category2Partial.brandAndBudget.count} resp.
                </span>
              </div>

              {/* Brand + Features */}
              <div className="p-2.5 rounded-xs bg-white border border-stone-300/80 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-800 block">
                    Brand &amp; Features (Different Budget)
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    (B ∩ F) \ P
                  </span>
                </div>
                <span className="font-mono font-medium text-stone-800 bg-stone-100 px-2 py-0.5 rounded-xs text-[11px]">
                  {category2Partial.brandAndFeature.count} resp.
                </span>
              </div>

              {/* Budget + Features */}
              <div className="p-2.5 rounded-xs bg-white border border-stone-300/80 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-800 block">
                    Budget &amp; Features (Different Brand)
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    (P ∩ F) \ B
                  </span>
                </div>
                <span className="font-mono font-medium text-stone-800 bg-stone-100 px-2 py-0.5 rounded-xs text-[11px]">
                  {category2Partial.budgetAndFeature.count} resp.
                </span>
              </div>
            </div>
          </div>

          {/* Category 1: Exactly 1 of 3 */}
          <div className="rounded-xs border border-stone-300/80 bg-stone-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 block">
                  3. Exactly 1 Condition Matched
                </span>
                <span className="text-xs text-stone-500 font-sans">Single Dimension Overlap</span>
              </div>
              <Badge variant="outline" className="font-mono">
                {n1} resp. ({p1}%)
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs font-sans">
              <div className="p-2.5 rounded-xs bg-white border border-stone-300/80 flex items-center justify-between">
                <span className="font-medium text-stone-700">
                  Only Brand Matched [B \ (P ∪ F)]
                </span>
                <span className="font-mono font-medium text-stone-800">
                  {category1Partial.onlyBrand.count} resp.
                </span>
              </div>
              <div className="p-2.5 rounded-xs bg-white border border-stone-300/80 flex items-center justify-between">
                <span className="font-medium text-stone-700">
                  Only Budget Matched [P \ (B ∪ F)]
                </span>
                <span className="font-mono font-medium text-stone-800">
                  {category1Partial.onlyBudget.count} resp.
                </span>
              </div>
              <div className="p-2.5 rounded-xs bg-white border border-stone-300/80 flex items-center justify-between">
                <span className="font-medium text-stone-700">
                  Only Feature Triplet Matched [F \ (B ∪ P)]
                </span>
                <span className="font-mono font-medium text-stone-800">
                  {category1Partial.onlyFeature.count} resp.
                </span>
              </div>
            </div>
          </div>

          {/* Category 0: 0 of 3 */}
          <div className="rounded-xs border border-stone-300/80 bg-stone-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 block">
                  4. Zero Conditions Matched
                </span>
                <span className="text-xs text-stone-500 font-sans">Completely Disjoint Phenotypes</span>
              </div>
              <Badge variant="default" className="font-mono">
                {n0} resp. ({p0}%)
              </Badge>
            </div>

            <div className="p-3 rounded-xs bg-white border border-stone-300/80 text-xs text-stone-600 space-y-2 font-sans">
              <p>
                Respondents where preferred brand ≠ {result.profile.brand}, budget ≠ {result.profile.budget}, and feature selection differs from the chosen triplet.
              </p>
              <div className="font-mono text-[11px] text-stone-600">
                Formula: U \ (B ∪ P ∪ F) = {n0} respondents
              </div>
            </div>
          </div>
        </div>

        {/* Methodological Guidance Callout */}
        <Callout variant="info" title="Methodological Distinction: Partial Matches vs. Recommendations">
          Partial match counts (2/3, 1/3, 0/3) reflect discrete set-theoretic distances across the survey parameter space. They are intended strictly for combinatorial analysis of student preference overlap and must <strong>not</strong> be interpreted as algorithmic product recommendations.
        </Callout>
      </CardContent>
    </Card>
  );
}
