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
    default: "bg-stone-100/90 text-stone-800 border-stone-300/80",
    cobalt: "bg-blue-50 text-blue-900 border-blue-200/90",
    lime: "bg-lime-50 text-lime-950 border-lime-300",
    success: "bg-emerald-50 text-emerald-950 border-emerald-300",
    warning: "bg-amber-50 text-amber-950 border-amber-300",
    info: "bg-blue-50 text-blue-900 border-blue-200/90",
    outline: "bg-transparent text-stone-700 border-stone-300",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-stone-500",
    cobalt: "bg-blue-600",
    lime: "bg-lime-600",
    success: "bg-emerald-600",
    warning: "bg-amber-600",
    info: "bg-blue-600",
    outline: "bg-stone-500",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] tracking-wide",
    md: "px-2.5 py-0.5 text-[11px] tracking-wide",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xs border font-mono font-medium uppercase leading-none shadow-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
