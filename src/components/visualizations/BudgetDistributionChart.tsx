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

export interface BudgetDataPoint {
  budget: string;
  count: number;
  percentage?: number;
}

export interface BudgetDistributionChartProps {
  data: BudgetDataPoint[];
  height?: number;
}

export function BudgetDistributionChart({
  data,
  height = 290,
}: BudgetDistributionChartProps) {
  // Ascending monochromatic vibrant progression mapping price tiers
  const tierColors = [
    "#93c5fd", // Under ₹15,000 (Entry) - Soft Sky
    "#60a5fa", // ₹15,000 - ₹30,000 (Mid) - Cobalt Blue
    "#2563eb", // ₹30,000 - ₹60,000 (Premium) - Primary Blue
    "#1d4ed8", // Above ₹60,000 (Flagship) - Deep Royal Blue
  ];

  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(226, 232, 240, 0.7)"
          />
          <XAxis
            dataKey="budget"
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
            {data.map((_, index) => (
              <Cell
                key={`budget-cell-${index}`}
                fill={tierColors[index % tierColors.length]}
                className="transition-all duration-300 hover:opacity-85"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
