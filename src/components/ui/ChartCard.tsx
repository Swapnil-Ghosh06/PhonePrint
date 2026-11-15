import React from "react";
import { Badge, type BadgeVariant } from "./Badge";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: BadgeVariant;
  };
  takeaway?: string;
  takeawayAccent?: "cobalt" | "lime";
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  badge,
  takeaway,
  takeawayAccent = "cobalt",
  action,
  children,
  className = "",
}: ChartCardProps) {
  const accentBar = {
    cobalt: "bg-cobalt-600",
    lime: "bg-lime-600",
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-xs border border-stone-300/80 bg-white shadow-none text-stone-900 ${className}`}
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200/80 bg-stone-50/30 px-5 py-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-semibold tracking-tight text-stone-900 font-sans">
                {title}
              </h3>
              {badge && (
                <Badge variant={badge.variant || "default"} size="sm">
                  {badge.text}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-stone-500 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>

        <div className="p-5">{children}</div>
      </div>

      {takeaway && (
        <div className="border-t border-stone-200/80 bg-[#FAF9F5] px-5 py-3 text-xs leading-relaxed text-stone-700 rounded-b-xs flex items-start gap-2.5">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-xs ${accentBar[takeawayAccent]}`}
            aria-hidden="true"
          />
          <p>
            <span className="font-mono text-[10px] uppercase font-bold text-stone-900 mr-2">
              [OBSERVATION]
            </span>
            {takeaway}
          </p>
        </div>
      )}
    </div>
  );
}
