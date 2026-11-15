"use client";

import React from "react";
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
import { ChartTooltip } from "./ChartTooltip";

export interface FeatureDataPoint {
  feature: string;
  count: number;
  percentage?: number;
}

export interface FeaturePreferenceChartProps {
  data: FeatureDataPoint[];
  height?: number;
}

export function FeaturePreferenceChart({
  data,
  height = 300,
}: FeaturePreferenceChartProps) {
  // Sort descending by count for hierarchical readability
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Subtle 3-tier visual hierarchy
  // Tier 1 (dominant priorities): Acid Lime #84cc16
  // Tier 2 (core performance specs): Cobalt #2563eb
  // Tier 3 (supporting factors): Slate #64748b
  const getFeatureColor = (index: number) => {
    if (index < 2) return "#84cc16"; // Top 2 dominant priorities
    if (index < 5) return "#2563eb"; // Middle performance tier
    return "#64748b"; // Supporting tier
  };

  return (
    <div style={{ width: "100%", height }} className="pt-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#f1f5f9"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fontSize: 11, fill: "#1e293b", fontWeight: 500 }}
            width={165}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip
            content={<ChartTooltip unit="Selections" />}
            cursor={{ fill: "rgba(132, 204, 22, 0.05)" }}
          />
          <Bar
            dataKey="count"
            name="Selections"
            radius={[0, 4, 4, 0]}
            maxBarSize={22}
            barSize={18}
            isAnimationActive={false}
          >
            {sortedData.map((_, index) => (
              <Cell
                key={`feature-cell-${index}`}
                fill={getFeatureColor(index)}
                className="transition-opacity hover:opacity-85"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
