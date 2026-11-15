import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xs border border-stone-300/80 bg-white text-stone-900 shadow-none transition-colors ${
        hoverable ? "hover:border-stone-400" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b border-stone-200/80 px-5 py-3.5 bg-stone-50/30 ${className}`}
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold tracking-tight text-stone-900 font-sans">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-stone-500 font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 text-stone-800 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-t border-stone-200/80 bg-stone-50/60 px-5 py-2.5 text-xs text-stone-600 rounded-b-xs ${className}`}
    >
      {children}
    </div>
  );
}
