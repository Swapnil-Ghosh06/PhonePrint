import React from "react";
import { Badge, type BadgeVariant } from "./Badge";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    variant?: BadgeVariant;
  };
  accentColor?: "cobalt" | "lime" | "graphite";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  badge,
  accentColor = "cobalt",
  icon,
  className = "",
}: MetricCardProps) {
  const accentGlow = {
    cobalt: "from-blue-500/10 to-indigo-500/5 border-blue-200/50",
    lime: "from-emerald-500/10 to-teal-500/5 border-emerald-200/50",
    graphite: "from-slate-500/10 to-stone-500/5 border-slate-200/50",
  };

  const accentPillBg = {
    cobalt: "bg-blue-50 text-blue-600 border-blue-200/60",
    lime: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    graphite: "bg-slate-100 text-slate-700 border-slate-200/60",
  };

  return (
    <div
      className={`glass-panel glass-panel-hover relative overflow-hidden rounded-2xl border p-6 bg-gradient-to-br ${accentGlow[accentColor]} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-montserrat text-xs uppercase tracking-wider font-semibold text-slate-500">
          {label}
        </span>
        {icon && (
          <div className={`p-2 rounded-xl border ${accentPillBg[accentColor]} shadow-xs`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="font-sora text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {value}
        </div>
        {badge && (
          <Badge variant={badge.variant || "default"} size="sm">
            {badge.text}
          </Badge>
        )}
      </div>

      {subtext && (
        <p className="mt-3.5 border-t border-slate-200/40 pt-3 text-xs text-slate-600 font-sans leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
