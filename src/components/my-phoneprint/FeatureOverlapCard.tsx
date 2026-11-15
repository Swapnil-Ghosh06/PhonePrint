"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { FeatureOverlapSummary } from "@/types/matcher";
import type { SmartphoneFeature } from "@/types/survey";

export interface FeatureOverlapCardProps {
  featureOverlap: FeatureOverlapSummary;
  selectedFeatures: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  totalCohort: number;
}

export function FeatureOverlapCard({
  featureOverlap,
  selectedFeatures,
  totalCohort,
}: FeatureOverlapCardProps) {
  const { matchAllThree, matchTwo, matchOne, matchNone, atLeastTwo, atLeastOne } =
    featureOverlap;

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Independent Feature Overlap Distribution"
        subtitle={`Evaluating feature overlap with the selected triplet across all ${totalCohort} respondents independently of brand and budget constraints`}
        badge={<Badge variant="cobalt">Feature Subsets</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Selected Features Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80">
          <span className="text-xs font-semibold text-stone-900 font-sans">
            Target Feature Triplet (F*):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedFeatures.map((f) => (
              <span
                key={f}
                className="text-xs font-medium text-stone-800 bg-white border border-stone-300/80 px-2.5 py-1 rounded-xs shadow-none font-sans"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* 4-Tier Disjoint Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Overlap = 3 */}
          <div className="rounded-xs border border-lime-300 bg-lime-50/30 p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              All 3 Features
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {matchAllThree.count}
            </div>
            <span className="text-[11px] text-lime-800 font-medium block font-sans">
              {matchAllThree.percentage}% of cohort
            </span>
            <span className="text-[10px] text-stone-500 font-mono block pt-1 border-t border-stone-300/80">
              |F* ∩ F_i| = 3
            </span>
          </div>

          {/* Overlap = 2 */}
          <div className="rounded-xs border border-blue-300 bg-blue-50/30 p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Exactly 2 Features
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {matchTwo.count}
            </div>
            <span className="text-[11px] text-blue-800 font-medium block font-sans">
              {matchTwo.percentage}% of cohort
            </span>
            <span className="text-[10px] text-stone-500 font-mono block pt-1 border-t border-stone-300/80">
              |F* ∩ F_i| = 2
            </span>
          </div>

          {/* Overlap = 1 */}
          <div className="rounded-xs border border-stone-300/80 bg-stone-50/50 p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Exactly 1 Feature
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {matchOne.count}
            </div>
            <span className="text-[11px] text-stone-600 font-medium block font-sans">
              {matchOne.percentage}% of cohort
            </span>
            <span className="text-[10px] text-stone-500 font-mono block pt-1 border-t border-stone-300/80">
              |F* ∩ F_i| = 1
            </span>
          </div>

          {/* Overlap = 0 */}
          <div className="rounded-xs border border-stone-300/80 bg-stone-50/50 p-4 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              0 Features
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {matchNone.count}
            </div>
            <span className="text-[11px] text-stone-500 font-medium block font-sans">
              {matchNone.percentage}% of cohort
            </span>
            <span className="text-[10px] text-stone-500 font-mono block pt-1 border-t border-stone-300/80">
              |F* ∩ F_i| = 0
            </span>
          </div>
        </div>

        {/* Cumulative Overlap Statistics */}
        <div className="rounded-xs border border-stone-300/80 bg-white p-4 space-y-3 shadow-none font-sans">
          <span className="text-xs font-semibold text-stone-900 block">
            Cumulative Overlap Cardinalities:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-stone-800">
                  At Least 2 Features Overlap:
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {atLeastTwo.count} ({atLeastTwo.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Formula: O₃ ∪ O₂ (Students sharing a strong feature orientation)
              </p>
            </div>

            <div className="p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-stone-800">
                  At Least 1 Feature Overlap:
                </span>
                <span className="font-mono font-bold text-stone-900">
                  {atLeastOne.count} ({atLeastOne.percentage}%)
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Formula: O₃ ∪ O₂ ∪ O₁ (Students sharing any common feature priority)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
