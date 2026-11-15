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
  height = 280,
}: BudgetDistributionChartProps) {
  // Ascending monochromatic cobalt progression mapping price tiers
  const tierColors = [
    "#93c5fd", // Under ₹15,000 (Entry) - Soft Cobalt
    "#60a5fa", // ₹15,000 - ₹30,000 (Mid) - Cobalt
    "#2563eb", // ₹30,000 - ₹60,000 (Premium) - Primary Cobalt
    "#1d4ed8", // Above ₹60,000 (Flagship) - Deep Cobalt
  ];

  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="budget"
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
            {data.map((_, index) => (
              <Cell
                key={`budget-cell-${index}`}
                fill={tierColors[index % tierColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
