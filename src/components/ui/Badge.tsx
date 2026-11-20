import React from "react";

export type BadgeVariant =
  | "default"
  | "cobalt"
  | "lime"
  | "success"
  | "warning"
  | "info"
  | "outline";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100/90 text-slate-700 border-slate-200/80 shadow-xs",
    cobalt: "bg-blue-50/90 text-blue-700 border-blue-200/80 shadow-xs",
    lime: "bg-emerald-50/90 text-emerald-800 border-emerald-200/80 shadow-xs",
    success: "bg-emerald-50/90 text-emerald-800 border-emerald-200/80 shadow-xs",
    warning: "bg-amber-50/90 text-amber-800 border-amber-200/80 shadow-xs",
    info: "bg-sky-50/90 text-sky-700 border-sky-200/80 shadow-xs",
    outline: "bg-white/60 backdrop-blur-md text-slate-700 border-slate-300/80",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-slate-400",
    cobalt: "bg-blue-500",
    lime: "bg-emerald-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    info: "bg-sky-500",
    outline: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px] font-montserrat font-medium tracking-wide",
    md: "px-3 py-1 text-xs font-montserrat font-semibold tracking-wide",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
