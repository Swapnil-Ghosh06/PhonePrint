import React from "react";

export type CalloutVariant = "info" | "highlight" | "warning" | "neutral";

export interface CalloutProps {
  title?: string;
  variant?: CalloutVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  title,
  variant = "info",
  icon,
  children,
  className = "",
}: CalloutProps) {
  const variantStyles: Record<
    CalloutVariant,
    { container: string; title: string; text: string; iconBg: string; tag: string }
  > = {
    info: {
      container: "border-blue-200/80 bg-blue-50/40 text-slate-800",
      title: "text-blue-950 font-sora font-semibold",
      text: "text-slate-700",
      iconBg: "bg-blue-100 text-blue-600",
      tag: "INFO",
    },
    highlight: {
      container: "border-emerald-200/80 bg-emerald-50/40 text-slate-800",
      title: "text-emerald-950 font-sora font-semibold",
      text: "text-slate-700",
      iconBg: "bg-emerald-100 text-emerald-700",
      tag: "DISCLOSURE",
    },
    warning: {
      container: "border-amber-200/80 bg-amber-50/40 text-slate-800",
      title: "text-amber-950 font-sora font-semibold",
      text: "text-slate-800",
      iconBg: "bg-amber-100 text-amber-700",
      tag: "ATTENTION",
    },
    neutral: {
      container: "border-slate-200/80 bg-white/60 text-slate-800",
      title: "text-slate-900 font-sora font-semibold",
      text: "text-slate-700",
      iconBg: "bg-slate-100 text-slate-700",
      tag: "NOTE",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`glass-panel rounded-2xl border p-5 shadow-sm transition-all ${style.container} ${className}`}
      role="region"
      aria-label={title || "Callout notice"}
    >
      <div className="flex items-start gap-3.5">
        <div className={`p-2 rounded-xl shrink-0 ${style.iconBg}`}>
          {icon || (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 space-y-1">
          {title && (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${style.title}`}>{title}</span>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-slate-600 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200/60">
                {style.tag}
              </span>
            </div>
          )}
          <div className={`text-xs leading-relaxed font-sans ${style.text}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
