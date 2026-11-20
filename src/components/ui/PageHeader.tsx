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
    <div className={`px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.04)] relative overflow-hidden">
          {/* Ambient soft glow background corner */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Module tag & category line */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200/50 font-montserrat text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              {sectionCode && (
                <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full text-[11px]">
                  MODULE {sectionCode}
                </span>
              )}
              <span className="font-medium tracking-wide text-slate-500">
                DISCRETE MATHEMATICS &times; PREFERENCE DYNAMICS
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>ACADEMIC RESEARCH MONOGRAPH</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between relative z-10">
            <div className="space-y-3 max-w-3xl">
              {/* Eyebrow and badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {eyebrow && (
                  <span className="font-montserrat text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {eyebrow}
                  </span>
                )}
                {badge && (
                  <Badge variant={badge.variant || "default"} size="sm">
                    {badge.text}
                  </Badge>
                )}
              </div>

              {/* Title in Sora */}
              <h1 className="text-3xl font-sora font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
                {title}
              </h1>

              {/* Description in DM Sans */}
              {description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-sans pt-1">
                  {description}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex flex-wrap items-center gap-3 md:self-end shrink-0 pt-2 md:pt-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
  index,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 pb-2 mb-4 border-b border-slate-200/50 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5">
          {index && (
            <span className="text-xs font-montserrat font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {index}
            </span>
          )}
          <h2 className="text-xl font-sora font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-sans mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
