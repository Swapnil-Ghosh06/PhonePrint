import React from "react";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    dataKey?: string;
    color?: string;
    payload?: {
      percentage?: number;
      [key: string]: unknown;
    };
  }>;
  label?: string;
  unit?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  unit = "Respondents",
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const primaryItem = payload[0];
  const percentage = primaryItem?.payload?.percentage;

  return (
    <div className="rounded-xl border border-stone-200 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs text-stone-900 min-w-[160px] z-50">
      {label && (
        <p className="font-serif font-bold text-stone-900 border-b border-stone-100 pb-1.5 mb-2 tracking-tight">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div
            key={`tooltip-${index}`}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color || "#2563eb" }}
              />
              <span className="text-stone-500 capitalize text-[11px]">
                {entry.name || "Count"}
              </span>
            </div>
            <span className="font-mono font-bold text-stone-900 text-[11px]">
              {entry.value} {unit}
            </span>
          </div>
        ))}

        {percentage !== undefined && (
          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-stone-100 text-[10px]">
            <span className="text-stone-500">Cohort Share</span>
            <span className="font-mono font-semibold text-cobalt-700">
              {percentage}% of cohort
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
