import React from "react";

export type StatusDotVariant = "lime" | "cobalt" | "amber" | "neutral";

export interface StatusDotProps {
  variant?: StatusDotVariant;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusDot({
  variant = "lime",
  pulse = false,
  size = "md",
  className = "",
}: StatusDotProps) {
  const colorStyles: Record<StatusDotVariant, { dot: string; pulse: string }> = {
    lime: {
      dot: "bg-lime-500 dark:bg-lime-400",
      pulse: "bg-lime-400",
    },
    cobalt: {
      dot: "bg-cobalt-600 dark:bg-cobalt-400",
      pulse: "bg-cobalt-400",
    },
    amber: {
      dot: "bg-amber-500 dark:bg-amber-400",
      pulse: "bg-amber-400",
    },
    neutral: {
      dot: "bg-graphite-400 dark:bg-graphite-500",
      pulse: "bg-graphite-300",
    },
  };

  const sizeStyles = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
  };

  const style = colorStyles[variant];

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${style.pulse}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${sizeStyles[size]} ${style.dot}`} />
    </span>
  );
}
