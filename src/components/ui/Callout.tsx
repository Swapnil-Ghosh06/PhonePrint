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
    { container: string; title: string; text: string; iconColor: string; accentBorder: string; tag: string }
  > = {
    info: {
      container: "border-stone-300/80 bg-[#FAF9F5] text-stone-900",
      accentBorder: "border-l-2 border-l-cobalt-600",
      title: "text-stone-900 font-semibold font-sans",
      text: "text-stone-700",
      iconColor: "text-cobalt-600",
      tag: "INFO",
    },
    highlight: {
      container: "border-stone-300/80 bg-[#FAF9F5] text-stone-900",
      accentBorder: "border-l-2 border-l-lime-600",
      title: "text-stone-900 font-semibold font-sans",
      text: "text-stone-700",
      iconColor: "text-lime-700",
      tag: "DISCLOSURE",
    },
    warning: {
      container: "border-amber-300 bg-amber-50/40 text-stone-900",
      accentBorder: "border-l-2 border-l-amber-600",
      title: "text-amber-950 font-semibold font-sans",
      text: "text-stone-800",
      iconColor: "text-amber-600",
      tag: "ATTENTION",
    },
    neutral: {
      container: "border-stone-300/80 bg-[#FAF9F5] text-stone-900",
      accentBorder: "border-l-2 border-l-stone-900",
      title: "text-stone-900 font-semibold font-sans",
      text: "text-stone-700",
      iconColor: "text-stone-700",
      tag: "NOTE",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`flex items-start gap-3.5 rounded-xs border px-4 py-3.5 text-xs leading-relaxed shadow-none ${style.container} ${style.accentBorder} ${className}`}
    >
      {icon && <div className={`flex-shrink-0 mt-0.5 ${style.iconColor}`}>{icon}</div>}
      <div className="space-y-1 w-full">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">
            [{style.tag}]
          </span>
          {title && <h4 className={`text-xs ${style.title}`}>{title}</h4>}
        </div>
        <div className={`text-xs ${style.text} font-sans`}>{children}</div>
      </div>
    </div>
  );
}
