import React from "react";
import { Badge } from "@/components/ui/Badge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 font-mono font-bold text-white shadow-sm">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                PhonePrint
              </span>
              <Badge variant="success">Phase 01</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Discrete Mathematics & Graph Theory Architecture
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline font-mono">Status: Verified Foundation</span>
          <Badge variant="info">Synthetic Demo Data</Badge>
        </div>
      </div>
    </header>
  );
}
