"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { MatchEngineResult } from "@/types/matcher";

export interface ExactMatchCardProps {
  result: MatchEngineResult;
}

export function ExactMatchCard({ result }: ExactMatchCardProps) {
  const { exactMatches, profile, totalCohort, brandSet, budgetSet, featureSet } =
    result;
  const hasExactMatches = exactMatches.count > 0;

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Exact Profile Matches (B ∩ P ∩ F)"
        subtitle="Simultaneous three-way intersection of Brand, Budget, and Feature Triplet"
        badge={
          hasExactMatches ? (
            <Badge variant="lime">
              {exactMatches.count} Exact Match
              {exactMatches.count > 1 ? "es" : ""} ({exactMatches.percentage}%)
            </Badge>
          ) : (
            <Badge variant="default">0 Exact Matches (0.0%)</Badge>
          )
        }
      />
      <CardContent className="space-y-6">
        {/* Main Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2 rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block font-bold">
                [ EXACT PHENOTYPE MATCHES ]
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl font-bold text-stone-900">
                  {exactMatches.count}
                </span>
                <span className="text-sm font-medium text-stone-600 font-sans">
                  / {totalCohort} Respondents
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-600 font-sans">
                {exactMatches.percentage}% of the full validated university cohort
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-300/80 text-[11px] font-mono text-stone-800 font-semibold">
              |B ∩ P ∩ F| = {exactMatches.count}
            </div>
          </div>

          {/* Component Set Sizes */}
          <div className="rounded-xs border border-stone-300/80 bg-white p-4 space-y-1 text-center sm:text-left shadow-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block font-bold">
              [ SET CARDINALITIES ]
            </span>
            <div className="pt-2 space-y-1.5 text-xs text-stone-700 font-sans">
              <div className="flex justify-between">
                <span>Brand ({profile.brand}):</span>
                <span className="font-mono font-bold text-stone-900">
                  |B| = {brandSet.size}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Budget ({profile.budget}):</span>
                <span className="font-mono font-bold text-stone-900">
                  |P| = {budgetSet.size}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Exact Feature Triplet:</span>
                <span className="font-mono font-bold text-stone-900">
                  |F| = {featureSet.size}
                </span>
              </div>
            </div>
          </div>

          {/* Matching Respondent IDs */}
          <div className="rounded-xs border border-stone-300/80 bg-white p-4 space-y-2 shadow-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block font-bold">
              [ MATCHED RESPONDENTS ]
            </span>
            {hasExactMatches ? (
              <div className="flex flex-wrap gap-1 pt-1 max-h-24 overflow-y-auto">
                {Array.from(exactMatches.ids).map((id) => (
                  <span
                    key={id}
                    className="font-mono text-xs font-semibold text-stone-800 bg-stone-100 border border-stone-300/80 px-2 py-0.5 rounded-xs"
                  >
                    {id}
                  </span>
                ))}
              </div>
            ) : (
              <div className="pt-2 text-xs text-stone-400 italic font-sans">
                None in current cohort (∅)
              </div>
            )}
          </div>
        </div>

        {/* 3-Condition Requirement Explanation */}
        <div className="rounded-xs border border-stone-300/80 bg-white p-4 space-y-2">
          <span className="text-xs font-semibold text-stone-900 block">
            Three Joint Matching Conditions:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
            <div className="p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80 space-y-1">
              <span className="font-semibold text-stone-900 block">Condition 1: Brand</span>
              <p className="text-stone-600">
                Preferred brand is strictly <strong>{profile.brand}</strong>.
              </p>
            </div>
            <div className="p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80 space-y-1">
              <span className="font-semibold text-stone-900 block">Condition 2: Budget</span>
              <p className="text-stone-600">
                Budget tier is strictly <strong>{profile.budget}</strong>.
              </p>
            </div>
            <div className="p-3 rounded-xs bg-[#FAF9F5] border border-stone-300/80 space-y-1">
              <span className="font-semibold text-stone-900 block">Condition 3: Features</span>
              <p className="text-stone-600">
                Selected all three features: <strong>{profile.features.join(", ")}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Zero-Match State Context */}
        {!hasExactMatches && (
          <div className="rounded-xs border border-dashed border-stone-300 bg-[#FAF9F5]/70 p-4 text-xs text-stone-600 space-y-1 font-sans">
            <span className="font-semibold text-stone-900 block">
              Academic Context for Zero Exact Matches:
            </span>
            <p className="leading-relaxed">
              No participant in the {totalCohort}-respondent cohort satisfied all three
              criteria simultaneously (|B ∩ P ∩ F| = 0). This identifies your profile as an unobserved consumer
              archetype in this dataset. Inspect partial matches below to see
              close consumer profiles.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
