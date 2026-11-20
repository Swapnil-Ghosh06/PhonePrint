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
  height = 290,
}: BrandPreferenceChartProps) {
  // Sort descending to establish clear hierarchy
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Modern vibrant designer palette
  const getBrandColor = (index: number) => {
    if (index === 0) return "#2563eb"; // Top Leader - Royal Blue
    if (index === 1) return "#3b82f6"; // Second - Primary Blue
    if (index === 2) return "#60a5fa"; // Third - Bright Sky
    if (index === 3) return "#818cf8"; // Fourth - Indigo
    return "#94a3b8"; // Long tail - Slate
  };

  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 15, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(226, 232, 240, 0.7)"
          />
          <XAxis
            dataKey="brand"
            tick={{ fontSize: 11, fill: "#475569", fontFamily: "var(--font-montserrat)" }}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "rgba(203, 213, 225, 0.8)" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b", fontFamily: "var(--font-montserrat)" }}
            tickLine={false}
            axisLine={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            content={<ChartTooltip unit="Students" />}
            cursor={{ fill: "rgba(37, 99, 235, 0.04)", radius: 8 }}
          />
          <Bar
            dataKey="count"
            name="Students"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
            barSize={42}
          >
            {sortedData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBrandColor(index)}
                className="transition-all duration-300 hover:opacity-85"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
