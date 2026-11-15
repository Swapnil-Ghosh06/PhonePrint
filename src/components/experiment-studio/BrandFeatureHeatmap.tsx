"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type {
  BrandFeatureAssociationResult,
  BrandFeatureCell,
} from "@/types/experiment";

export interface BrandFeatureHeatmapProps {
  result: BrandFeatureAssociationResult;
  onSelectCell?: (cell: BrandFeatureCell) => void;
}

export function BrandFeatureHeatmap({
  result,
  onSelectCell,
}: BrandFeatureHeatmapProps) {
  const {
    selectedBrands,
    selectedFeatures,
    matrix,
    brandTotals,
    featurePercentageSumByBrand,
    isFullFeatureUniverse,
  } = result;

  // Helper to get color intensity based on within-brand percentage P(f | b)
  const getCellBg = (count: number, percentage: number) => {
    if (count === 0) return "bg-[#FAF9F5] text-stone-400 hover:bg-stone-100";
    if (percentage >= 80) return "bg-lime-500 text-white font-bold hover:bg-lime-600";
    if (percentage >= 60) return "bg-cobalt-600 text-white font-semibold hover:bg-cobalt-700";
    if (percentage >= 35) return "bg-cobalt-100 text-cobalt-950 font-medium hover:bg-cobalt-200";
    return "bg-stone-100 text-stone-800 hover:bg-stone-200";
  };

  const hasBrands = selectedBrands.length > 0;
  const hasFeatures = selectedFeatures.length > 0;

  return (
    <Card>
      <CardHeader
        title="Brand–Feature Preference Matrix (Heatmap)"
        subtitle="Cross-tabulation of brand preference S_b and canonical feature selection S_f"
        badge={
          <Badge variant="cobalt">
            {isFullFeatureUniverse
              ? "All 7 Features (Expected Sum: 300%)"
              : `Filtered Subset: ${selectedFeatures.length}/7 Features`}
          </Badge>
        }
      />
      <CardContent className="space-y-4">
        {!hasBrands ? (
          <div className="flex h-48 items-center justify-center rounded-xs border border-dashed border-stone-300 bg-[#FAF9F5] text-stone-500 text-xs">
            No brands selected. Please select one or more brands in the controls above.
          </div>
        ) : !hasFeatures ? (
          <div className="flex h-48 items-center justify-center rounded-xs border border-dashed border-stone-300 bg-[#FAF9F5] text-stone-500 text-xs">
            No features selected. Please select one or more canonical features in the controls above to view intersections.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xs border border-stone-200 bg-white">
            <table className="w-full text-center text-xs">
              <thead className="bg-[#FAF9F5] text-[11px] font-mono uppercase tracking-wider text-stone-700 border-b border-stone-200">
                <tr>
                  <th className="px-3.5 py-3 text-left w-36">Brand / Feature</th>
                  {selectedFeatures.map((f) => (
                    <th key={f} className="px-2 py-3 min-w-28 text-center">
                      <span className="block truncate" title={f}>
                        {f.replace(" Quality", "").replace(" Experience", "").replace(" Performance", "")}
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal block truncate">
                        {f}
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 w-24 text-center bg-stone-100/70 border-l border-stone-200">
                    Cohort N(b)
                  </th>
                  <th className="px-3 py-3 w-32 text-center bg-stone-100/70 border-l border-stone-200">
                    Displayed % Sum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {selectedBrands.map((brand) => {
                  const n_b = brandTotals[brand] ?? 0;
                  const pctSum = featurePercentageSumByBrand[brand] ?? 0;

                  return (
                    <tr key={brand} className="hover:bg-stone-50/70">
                      {/* Row Header: Brand */}
                      <td className="px-3.5 py-3 text-left font-serif font-bold text-stone-900 bg-[#FAF9F5] border-r border-stone-200/80">
                        <span>{brand}</span>
                        <span className="text-[10px] text-stone-500 font-sans font-normal block">
                          N = {n_b} ({n_b > 0 ? ((n_b / result.totalCohortSize) * 100).toFixed(1) : 0}%)
                        </span>
                      </td>

                      {/* Matrix Cells */}
                      {selectedFeatures.map((feature) => {
                        const cell = matrix.find(
                          (c) => c.brand === brand && c.feature === feature
                        );
                        const count = cell?.count ?? 0;
                        const pct = cell?.percentage ?? 0;
                        const cellClass = getCellBg(count, pct);

                        return (
                          <td key={feature} className="p-1">
                            <button
                              onClick={() => cell && onSelectCell?.(cell)}
                              className={`w-full h-12 rounded-md p-1 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${cellClass}`}
                              title={`${brand} ∩ ${feature}: ${count} respondents (${pct}% of ${brand})`}
                            >
                              <span className="font-mono text-xs font-bold leading-tight">
                                {count} {count === 1 ? "resp." : "resps."}
                              </span>
                              <span className="text-[10px] font-mono leading-tight opacity-90">
                                {n_b > 0 ? `${pct}%` : "—"}
                              </span>
                            </button>
                          </td>
                        );
                      })}

                      {/* Row Total N(b) */}
                      <td className="px-3 py-3 font-mono font-bold text-stone-800 bg-[#FAF9F5] border-l border-stone-200">
                        {n_b}
                      </td>

                      {/* Dynamic Displayed % Sum */}
                      <td className="px-3 py-3 font-mono font-bold text-center border-l border-stone-200 bg-stone-50/40">
                        {n_b > 0 ? (
                          <span
                            className={
                              isFullFeatureUniverse
                                ? "text-lime-700 font-bold"
                                : "text-cobalt-700"
                            }
                          >
                            {pctSum.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Explanatory Note & Legend */}
        <div className="space-y-2 pt-2 border-t border-stone-200 text-xs">
          <div className="p-2.5 rounded-md bg-[#FAF9F5] border border-stone-200 text-stone-600 leading-relaxed text-[11px]">
            <strong>Note on Feature Percentage Sums:</strong> When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum.
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-stone-700">Percentage Intensity:</span>
              <span className="px-2 py-0.5 rounded bg-[#FAF9F5] border border-stone-200 text-stone-500">
                0% (Void)
              </span>
              <span className="px-2 py-0.5 rounded bg-cobalt-100 text-cobalt-950 font-medium">
                35% – 59%
              </span>
              <span className="px-2 py-0.5 rounded bg-cobalt-600 text-white font-medium">
                60% – 79%
              </span>
              <span className="px-2 py-0.5 rounded bg-lime-500 text-white font-bold">
                ≥ 80% (Dominant)
              </span>
            </div>

            <div className="text-[11px] text-stone-500 italic">
              *Percentages use the brand&apos;s cohort size N(b) as denominator: P(f | b) = C(b, f) / N(b).
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
