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
  height = 310,
}: FeaturePreferenceChartProps) {
  // Sort descending by count for hierarchical readability
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Modern 3-tier visual hierarchy
  const getFeatureColor = (index: number) => {
    if (index < 2) return "#10b981"; // Emerald green for top dominant priorities
    if (index < 5) return "#2563eb"; // Blue for middle performance tier
    return "#64748b"; // Slate for supporting tier
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
            stroke="rgba(241, 245, 249, 0.9)"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b", fontFamily: "var(--font-montserrat)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fontSize: 11, fill: "#1e293b", fontWeight: 500, fontFamily: "var(--font-montserrat)" }}
            width={170}
            tickLine={false}
            axisLine={{ stroke: "rgba(226, 232, 240, 0.8)" }}
          />
          <Tooltip
            content={<ChartTooltip unit="Selections" />}
            cursor={{ fill: "rgba(16, 185, 129, 0.04)", radius: 6 }}
          />
          <Bar
            dataKey="count"
            name="Selections"
            radius={[0, 8, 8, 0]}
            maxBarSize={22}
            barSize={18}
          >
            {sortedData.map((_, index) => (
              <Cell
                key={`feature-cell-${index}`}
                fill={getFeatureColor(index)}
                className="transition-all duration-300 hover:opacity-85"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
