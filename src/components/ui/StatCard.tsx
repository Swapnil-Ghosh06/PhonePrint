import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  meta?: string;
  className?: string;
}

export function StatCard({ label, value, description, meta, className = "" }: StatCardProps) {
  return (
    <Card hoverable className={`p-6 flex flex-col justify-between ${className}`}>
      <div>
        <p className="text-xs font-montserrat font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div className="mt-2.5 font-sora text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
      </div>
      {(description || meta) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 pt-3 text-xs text-slate-500 font-sans">
          {description && <span>{description}</span>}
          {meta && <span className="font-montserrat text-blue-600 font-semibold">{meta}</span>}
        </div>
      )}
    </Card>
  );
}
