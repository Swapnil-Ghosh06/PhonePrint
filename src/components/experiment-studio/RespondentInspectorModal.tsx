"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SurveyResponse } from "@/types/survey";

export interface RespondentInspectorModalProps {
  title: string;
  subtitle: string;
  matchingIds: readonly string[];
  allResponses: readonly SurveyResponse[];
  onClose: () => void;
}

export function RespondentInspectorModal({
  title,
  subtitle,
  matchingIds,
  allResponses,
  onClose,
}: RespondentInspectorModalProps) {
  const matchingRecords = allResponses.filter((r) =>
    matchingIds.includes(r.response_id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xs border border-stone-200 bg-[#FAF9F5] p-6 shadow-xl text-stone-900 space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-serif font-bold text-stone-900">{title}</h3>
              <Badge variant="cobalt" className="font-mono">
                {matchingIds.length} {matchingIds.length === 1 ? "Respondent" : "Respondents"}
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-all text-sm font-bold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content Table or Empty State */}
        {matchingRecords.length === 0 ? (
          <div className="p-8 text-center rounded-xs border border-dashed border-stone-200 bg-white">
            <div className="text-3xl font-serif text-stone-400 mb-1">∅</div>
            <h4 className="text-xs font-serif font-bold text-stone-800 uppercase tracking-wider">
              Empty Intersection (0 Respondents)
            </h4>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              No survey respondents match this exact brand-feature or budget-combination conjunction in the validated dataset.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xs border border-stone-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-[11px] font-mono uppercase tracking-wider text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="px-3.5 py-2.5">Response ID</th>
                  <th className="px-3.5 py-2.5">Brand</th>
                  <th className="px-3.5 py-2.5">Budget</th>
                  <th className="px-3.5 py-2.5">Preferred Features</th>
                  <th className="px-3.5 py-2.5">Primary Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {matchingRecords.map((r) => (
                  <tr key={r.response_id} className="hover:bg-stone-50">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-cobalt-700">
                      {r.response_id}
                    </td>
                    <td className="px-3.5 py-2.5 font-medium text-stone-800">
                      {r.preferred_brand}
                    </td>
                    <td className="px-3.5 py-2.5 text-stone-600">
                      {r.budget_range}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {r.preferred_features.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-700"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-stone-500 text-[11px]">
                      {r.primary_use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
