"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { FeatureCombinationRecord } from "@/types/math";
import type { SurveyResponse } from "@/types/survey";

export interface CombinationDetailModalProps {
  combination: FeatureCombinationRecord | null;
  onClose: () => void;
  allResponses: readonly SurveyResponse[];
}

export function CombinationDetailModal({
  combination,
  onClose,
  allResponses,
}: CombinationDetailModalProps) {
  if (!combination) return null;

  // Retrieve respondent objects
  const matchingResponses = allResponses.filter((resp) =>
    combination.matchingRespondentIds.includes(resp.response_id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-md">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/90 glass-card p-6 sm:p-7 shadow-2xl text-slate-800 space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                {combination.id}
              </span>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Feature Triplet Details
              </h3>
              {combination.isObserved ? (
                <Badge variant="lime">
                  Observed ({combination.observedCount} resp. •{" "}
                  {combination.observedPercentage}%)
                </Badge>
              ) : (
                <Badge variant="default">Theoretical Void (0 resp.)</Badge>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Index #{combination.index} of 35 in dynamic lexicographic enumeration
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-all text-sm font-bold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Feature Triplet Badges */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-2">
            Canonical Feature Triplet:
          </span>
          <div className="flex flex-wrap gap-2">
            {combination.features.map((feature) => (
              <span
                key={feature}
                className="font-medium text-xs text-cobalt-800 bg-cobalt-50 px-3 py-1.5 rounded-md border border-cobalt-200 shadow-none"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Empirical Distribution Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xs border border-stone-200 bg-white p-3 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Observed Count
            </span>
            <div className="mt-1 font-serif text-2xl font-bold text-stone-900">
              {combination.observedCount}
            </div>
          </div>

          <div className="rounded-xs border border-stone-200 bg-white p-3 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Cohort Share
            </span>
            <div className="mt-1 font-serif text-2xl font-bold text-cobalt-700">
              {combination.observedPercentage}%
            </div>
          </div>

          <div className="rounded-xs border border-stone-200 bg-white p-3 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Status
            </span>
            <div
              className={`mt-1 font-mono font-bold text-xs ${
                combination.isObserved ? "text-lime-700" : "text-stone-500"
              }`}
            >
              {combination.isObserved ? "POPULATED" : "UNOBSERVED"}
            </div>
          </div>

          <div className="rounded-xs border border-stone-200 bg-white p-3 text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Permutations
            </span>
            <div className="mt-1 font-serif text-2xl font-bold text-stone-700">
              6
            </div>
          </div>
        </div>

        {/* Matching Respondent Records or Empty Set State */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-700">
              Matching Survey Respondents
            </span>
            <span className="font-mono text-xs text-stone-500">
              {matchingResponses.length} records
            </span>
          </div>

          {!combination.isObserved || matchingResponses.length === 0 ? (
            <div className="p-6 text-center rounded-xs border border-dashed border-stone-200 bg-white">
              <div className="text-3xl font-serif text-stone-400 mb-1">∅</div>
              <h4 className="text-xs font-serif font-bold text-stone-800 uppercase tracking-wider">
                Empty Set: Unobserved Theoretical Combination
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                No participant in the university survey chose this exact
                three-feature combination. In discrete mathematics, its empirical
                frequency is exactly zero.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xs border border-stone-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] text-[11px] font-mono uppercase tracking-wider text-stone-600 border-b border-stone-200">
                  <tr>
                    <th className="px-3 py-2">Respondent ID</th>
                    <th className="px-3 py-2">Preferred Brand</th>
                    <th className="px-3 py-2">Budget Tier</th>
                    <th className="px-3 py-2">Primary Use</th>
                    <th className="px-3 py-2">OS Preference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {matchingResponses.map((resp) => (
                    <tr key={resp.response_id} className="hover:bg-stone-50">
                      <td className="px-3 py-2 font-mono font-bold text-cobalt-700">
                        {resp.response_id}
                      </td>
                      <td className="px-3 py-2 font-medium text-stone-800">
                        {resp.preferred_brand}
                      </td>
                      <td className="px-3 py-2 text-stone-600">
                        {resp.budget_range}
                      </td>
                      <td className="px-3 py-2 text-stone-600">
                        {resp.primary_use}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            resp.os_preference === "iOS"
                              ? "bg-stone-100 text-stone-800"
                              : resp.os_preference === "Android"
                              ? "bg-lime-100 text-lime-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {resp.os_preference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-stone-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}
