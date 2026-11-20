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
      className={`glass-panel rounded-2xl border border-white/80 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ${
        hoverable ? "glass-panel-hover" : ""
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
      className={`flex items-start justify-between gap-4 border-b border-slate-200/50 px-6 py-4.5 bg-white/40 rounded-t-2xl ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-sora font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
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
  return <div className={`p-6 text-slate-700 ${className}`}>{children}</div>;
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
      className={`border-t border-slate-200/50 bg-slate-50/50 px-6 py-3.5 text-xs text-slate-600 rounded-b-2xl ${className}`}
    >
      {children}
    </div>
  );
}
