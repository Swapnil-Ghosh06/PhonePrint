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
  const dotColor = {
    cobalt: "bg-blue-600",
    lime: "bg-emerald-600",
  };

  return (
    <div
      className={`glass-panel rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_rgb(0,0,0,0.06)] ${className}`}
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/50 bg-white/40 px-6 py-4 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm sm:text-base font-sora font-bold tracking-tight text-slate-900">
                {title}
              </h3>
              {badge && (
                <Badge variant={badge.variant || "default"} size="sm">
                  {badge.text}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-500 font-sans">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>

        <div className="p-6">{children}</div>
      </div>

      {takeaway && (
        <div className="border-t border-slate-200/50 bg-slate-50/60 px-6 py-3.5 text-xs leading-relaxed text-slate-700 rounded-b-2xl flex items-start gap-3">
          <span
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor[takeawayAccent]}`}
            aria-hidden="true"
          />
          <p className="font-sans">
            <span className="font-montserrat text-[11px] uppercase font-bold text-slate-900 mr-2 tracking-wide">
              Key Insight
            </span>
            {takeaway}
          </p>
        </div>
      )}
    </div>
  );
}
