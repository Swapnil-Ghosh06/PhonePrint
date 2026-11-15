import React from "react";
import { Badge } from "./Badge";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "cobalt" | "lime" | "warning";
  };
  actions?: React.ReactNode;
  className?: string;
  sectionCode?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className = "",
  sectionCode,
}: PageHeaderProps) {
  return (
    <div
      className={`border-b border-stone-300/80 bg-[#FBFBF9] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 relative ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Subtle top metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-200/60 font-mono text-[10px] text-stone-500 uppercase tracking-widest">
          <div className="flex items-center gap-3">
            {sectionCode && (
              <span className="font-bold text-stone-900 bg-stone-200/80 px-2 py-0.5 rounded-xs">
                MODULE {sectionCode}
              </span>
            )}
            <span>PHONEPRINT ACADEMIC RESEARCH MONOGRAPH</span>
          </div>
          <div className="flex items-center gap-3">
            <span>DISCRETE MATHEMATICS &times; PREFERENCE DYNAMICS</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-3xl">
            {/* Eyebrow and badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {eyebrow && (
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-600">
                  {"//"} {eyebrow}
                </span>
              )}
              {badge && (
                <Badge variant={badge.variant || "default"} size="sm">
                  {badge.text}
                </Badge>
              )}
            </div>

            {/* Editorial title */}
            <h1 className="text-3xl font-serif font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl leading-tight">
              {title}
            </h1>

            {/* Editorial description */}
            {description && (
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl font-sans pt-1">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2.5 md:self-end shrink-0 pt-2 md:pt-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  className?: string;
  index?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  className = "",
  index,
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pb-3 border-b border-stone-300/80 ${className}`}>
      <div className="space-y-0.5">
        <div className="flex items-baseline gap-2.5">
          {index && (
            <span className="font-mono text-xs font-bold text-stone-500">
              [{index}]
            </span>
          )}
          <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && <p className="text-xs text-stone-500 font-sans">{subtitle}</p>}
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
}
