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
      "bg-stone-900 text-white hover:bg-stone-800 active:bg-black border border-stone-900 shadow-none disabled:bg-stone-300 disabled:border-stone-300",
    secondary:
      "bg-white text-stone-900 hover:bg-stone-100/80 active:bg-stone-200 border border-stone-300 shadow-none",
    lime:
      "bg-lime-700 text-white hover:bg-lime-800 active:bg-lime-900 border border-lime-700 shadow-none disabled:opacity-50",
    outline:
      "bg-transparent text-stone-800 border border-stone-300/90 hover:bg-white hover:border-stone-900 active:bg-stone-100",
    ghost:
      "bg-transparent text-stone-700 hover:bg-stone-200/60 hover:text-stone-950 active:bg-stone-200",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-sm gap-2",
    lg: "px-4.5 py-2 text-base gap-2.5",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
