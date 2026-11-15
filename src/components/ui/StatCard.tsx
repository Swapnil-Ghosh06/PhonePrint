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
    <Card className={`p-5 flex flex-col justify-between ${className}`}>
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
          {label}
        </p>
        <div className="mt-2 font-serif text-3xl font-bold tracking-tight text-stone-900">
          {value}
        </div>
      </div>
      {(description || meta) && (
        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-xs text-stone-500 font-sans">
          {description && <span>{description}</span>}
          {meta && <span className="font-mono text-cobalt-700 font-medium">{meta}</span>}
        </div>
      )}
    </Card>
  );
}
