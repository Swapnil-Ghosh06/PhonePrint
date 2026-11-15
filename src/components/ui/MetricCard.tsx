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
  const topAccentStyles = {
    cobalt: "border-t-2 border-t-cobalt-600",
    lime: "border-t-2 border-t-lime-600",
    graphite: "border-t-2 border-t-stone-900",
  };

  return (
    <div
      className={`relative rounded-xs border border-stone-300/80 bg-white p-5 shadow-none transition-colors ${topAccentStyles[accentColor]} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          [ {label} ]
        </span>
        {icon && (
          <span className="text-stone-400">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {value}
        </div>
        {badge && (
          <Badge variant={badge.variant || "default"} size="sm">
            {badge.text}
          </Badge>
        )}
      </div>

      {subtext && (
        <p className="mt-3 border-t border-stone-200/80 pt-2 text-xs text-stone-600 font-sans leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
