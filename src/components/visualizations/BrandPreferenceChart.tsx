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

export interface BrandDataPoint {
  brand: string;
  count: number;
  percentage?: number;
}

export interface BrandPreferenceChartProps {
  data: BrandDataPoint[];
  height?: number;
}

export function BrandPreferenceChart({
  data,
  height = 280,
}: BrandPreferenceChartProps) {
  // Sort descending to establish clear hierarchy
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Differentiation based on rank in cohort
  const getBrandColor = (index: number) => {
    if (index === 0) return "#1d4ed8"; // Leader - Deep Cobalt
    if (index === 1) return "#2563eb"; // Second - Primary Cobalt
    if (index === 2) return "#3b82f6"; // Third - Bright Cobalt
    if (index === 3) return "#60a5fa"; // Fourth - Soft Cobalt
    return "#64748b"; // Long tail - Muted Slate
  };

  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="brand"
            tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            content={<ChartTooltip unit="Respondents" />}
            cursor={{ fill: "rgba(37, 99, 235, 0.04)" }}
          />
          <Bar
            dataKey="count"
            name="Respondents"
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
            barSize={40}
          >
            {sortedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getBrandColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
