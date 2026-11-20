import React from "react";

export type ButtonVariant = "primary" | "secondary" | "lime" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-md shadow-blue-500/20 border border-blue-500/40",
    secondary:
      "glass-panel text-slate-800 hover:bg-white active:scale-[0.98] shadow-sm hover:shadow",
    lime:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] shadow-md shadow-emerald-500/20 border border-emerald-500/40",
    outline:
      "bg-white/60 backdrop-blur-md text-slate-700 border border-slate-300/80 hover:bg-white hover:border-slate-400 hover:text-slate-900 active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 active:bg-slate-200/60",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-xl font-montserrat font-medium",
    md: "px-4 py-2 text-xs sm:text-sm gap-2 rounded-xl font-montserrat font-semibold",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5 rounded-2xl font-montserrat font-semibold",
  };

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
