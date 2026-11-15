"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CombinationAnalyticsSummary, FeatureCombinationRecord } from "@/types/math";

export interface CombinationFrequencyAnalysisProps {
  analytics: CombinationAnalyticsSummary;
  onSelectCombination?: (combination: FeatureCombinationRecord) => void;
}

export function CombinationFrequencyAnalysis({
  analytics,
  onSelectCombination,
}: CombinationFrequencyAnalysisProps) {
  const {
    totalTheoreticalCombinations,
    totalObservedCombinations,
    totalUnobservedCombinations,
    totalRespondents,
    observedCombinations,
    mostCommonCombinations,
    leastCommonObservedCombinations,
  } = analytics;

  // Space coverage percentage
  const spaceCoveragePct = Number(
    ((totalObservedCombinations / totalTheoreticalCombinations) * 100).toFixed(1)
  );

  // Prepare chart data for observed combinations
  const chartData = observedCombinations.map((combo) => {
    // Short label for y-axis
    const shortNames = combo.features
      .map((f) => f.split(" ")[0])
      .join(" + ");
    return {
      id: combo.id,
      label: `${combo.id}: ${shortNames}`,
      fullLabel: combo.features.join(" • "),
      count: combo.observedCount,
      percentage: combo.observedPercentage,
      raw: combo,
    };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count), 5);
  const xDomainMax = Math.ceil(maxCount * 1.15);

  return (
    <div className="space-y-6">
      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xs border border-stone-200 bg-white p-4 shadow-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
            Theoretical Space
          </span>
          <div className="mt-1 font-serif text-2xl font-bold text-stone-900">
            {totalTheoreticalCombinations}
          </div>
          <span className="text-[11px] text-stone-500 font-sans">
            C(7, 3) possible triplets
          </span>
        </div>

        <div className="rounded-xs border border-lime-200/80 bg-lime-50/20 p-4 shadow-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
            Observed in Survey
          </span>
          <div className="mt-1 font-serif text-2xl font-bold text-stone-900">
            {totalObservedCombinations}
          </div>
          <span className="text-[11px] text-lime-800 font-medium font-sans">
            {spaceCoveragePct}% space coverage
          </span>
        </div>

        <div className="rounded-xs border border-stone-200 bg-stone-50/50 p-4 shadow-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
            Unobserved Voids
          </span>
          <div className="mt-1 font-serif text-2xl font-bold text-stone-700">
            {totalUnobservedCombinations}
          </div>
          <span className="text-[11px] text-stone-500 font-sans">
            {(100 - spaceCoveragePct).toFixed(1)}% unchosen in cohort
          </span>
        </div>

        <div className="rounded-xs border border-stone-200 bg-white p-4 shadow-none">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
            Survey Cohort Size
          </span>
          <div className="mt-1 font-serif text-2xl font-bold text-stone-900">
            {totalRespondents}
          </div>
          <span className="text-[11px] text-stone-500 font-sans">
            Valid survey respondents
          </span>
        </div>
      </div>

      {/* Frequency Distribution Chart Card */}
      <Card className="border-stone-300/80 shadow-none">
        <CardHeader
          title="Empirical Feature Triplet Frequency Ranking"
          subtitle={`Observed respondent frequency distribution across the ${totalObservedCombinations} populated combinations`}
          badge={<Badge variant="lime">Distribution &amp; Ties</Badge>}
        />
        <CardContent className="space-y-6">
          {/* Recharts Bar Chart */}
          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#E8E6DF"
                />
                <XAxis
                  type="number"
                  domain={[0, xDomainMax]}
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#78716C" }}
                  axisLine={{ stroke: "#E8E6DF" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={190}
                  tick={{ fontSize: 10, fill: "#292524" }}
                  axisLine={{ stroke: "#E8E6DF" }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0]!.payload;
                      return (
                        <div className="rounded-md border border-stone-200 bg-white p-3 shadow-none text-xs space-y-1 font-sans">
                          <div className="font-mono font-bold text-stone-900">
                            {item.id}
                          </div>
                          <div className="text-stone-600 font-medium">
                            {item.fullLabel}
                          </div>
                          <div className="pt-1 border-t border-stone-200/80 flex items-center justify-between gap-4 font-mono">
                            <span className="text-stone-500">Frequency:</span>
                            <span className="font-bold text-stone-900">
                              {item.count} respondents ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 3, 3, 0]}
                  onClick={(entry) => onSelectCombination?.(entry.raw)}
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.count >= 2 ? "#84cc16" : "#2563eb"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking Details & Tied Frequency Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Most Common Combinations */}
            <div className="rounded-xs border border-lime-200/80 bg-lime-50/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-sans">
                  Most Frequent Triplet(s)
                </span>
                <Badge variant="lime">
                  {mostCommonCombinations.length > 1
                    ? `${mostCommonCombinations.length}-Way Tie`
                    : "Top Preference"}
                </Badge>
              </div>

              <div className="space-y-1.5">
                {mostCommonCombinations.map((combo) => (
                  <div
                    key={combo.id}
                    onClick={() => onSelectCombination?.(combo)}
                    className="p-2.5 rounded-md bg-white border border-stone-200 text-xs cursor-pointer hover:border-stone-300 transition-colors flex items-center justify-between font-sans shadow-none"
                  >
                    <div>
                      <span className="font-mono font-semibold text-stone-800 block">
                        {combo.id}
                      </span>
                      <span className="text-stone-600 text-[11px]">
                        {combo.features.join(", ")}
                      </span>
                    </div>
                    <span className="font-mono font-medium text-lime-900 bg-lime-50 border border-lime-200 px-2 py-0.5 rounded text-[11px]">
                      {combo.observedCount} ({combo.observedPercentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Least Common Observed Combinations */}
            <div className="rounded-xs border border-stone-200 bg-stone-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-sans">
                  Infrequent Combinations
                </span>
                <Badge variant="default">
                  {leastCommonObservedCombinations.length} Combinations Tied
                </Badge>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {leastCommonObservedCombinations.length} distinct feature triplets
                were selected by minority respondents in the cohort.
                These reflect diverse individual smartphone priorities across
                gaming, photography, and general use.
              </p>

              <div className="text-[11px] font-mono text-stone-500">
                IDs:{" "}
                {leastCommonObservedCombinations.map((c) => c.id).slice(0, 10).join(", ")}
                {leastCommonObservedCombinations.length > 10 ? "..." : ""}
              </div>
            </div>
          </div>

          {/* Academic & Methodological Disclaimer */}
          <Callout variant="info" title="Academic Note on Statistical Generalizability">
            In this university discrete mathematics study using a {totalRespondents}-respondent
            cohort, observed frequencies demonstrate combinatorial frequency distributions across the C(7, 3) = 35 parameter space.
            Unobserved combinations ({totalUnobservedCombinations} of {totalTheoreticalCombinations}) represent unchosen
            triplets in this sample rather than mathematically impossible feature pairings.
          </Callout>
        </CardContent>
      </Card>
    </div>
  );
}
