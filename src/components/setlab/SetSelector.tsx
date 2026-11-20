"use client";

import React from "react";
import type { SetOption } from "@/lib/data/setDescriptors";
import { Badge } from "@/components/ui/Badge";

export interface SetSelectorProps {
  mode: "2-set" | "3-set";
  onModeChange: (mode: "2-set" | "3-set") => void;
  availableOptions: SetOption[];
  setAId: string;
  setBId: string;
  setCId: string;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
  onSelectC: (id: string) => void;
  setASize: number;
  setBSize: number;
  setCSize: number;
  totalUniverseSize: number;
}

export function SetSelector({
  mode,
  onModeChange,
  availableOptions,
  setAId,
  setBId,
  setCId,
  onSelectA,
  onSelectB,
  onSelectC,
  setASize,
  setBSize,
  setCSize,
  totalUniverseSize,
}: SetSelectorProps) {
  const brandOptions = availableOptions.filter((o) => o.category === "brand");
  const featureOptions = availableOptions.filter((o) => o.category === "feature");

  return (
    <div className="glass-panel rounded-2xl border border-white/80 p-6 shadow-sm text-slate-800 space-y-5">
      {/* Header and Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-sora font-semibold tracking-tight text-slate-900">
              Set Definition Workspace
            </h3>
            <Badge variant="cobalt">Discrete Partitions</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Select {mode === "2-set" ? "two" : "three"} distinct brand or feature cohorts from the universe (U = {totalUniverseSize} respondents)
          </p>
        </div>

        {/* 2-Set vs 3-Set Mode Switch */}
        <div className="inline-flex rounded-xl border border-slate-200/80 bg-slate-100/70 p-1 text-xs">
          <button
            type="button"
            onClick={() => onModeChange("2-set")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-montserrat transition-all duration-200 ${
              mode === "2-set"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Two Sets (A, B)
          </button>
          <button
            type="button"
            onClick={() => onModeChange("3-set")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-montserrat transition-all duration-200 ${
              mode === "3-set"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 font-medium"
            }`}
          >
            Three Sets (A, B, C)
          </button>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className={`grid grid-cols-1 gap-4 ${mode === "2-set" ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {/* Set A */}
        <div className="glass-panel rounded-xl p-4 border border-blue-200/60 bg-blue-50/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-montserrat uppercase tracking-wider font-bold text-blue-700">
              Set A
            </span>
            <span className="text-xs font-montserrat font-semibold text-blue-800 bg-white/80 px-2 py-0.5 rounded-full border border-blue-200/80">
              |A| = {setASize}
            </span>
          </div>
          <select
            value={setAId}
            onChange={(e) => onSelectA(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-montserrat text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <optgroup label="Brands">
              {brandOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Features">
              {featureOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Set B */}
        <div className="glass-panel rounded-xl p-4 border border-emerald-200/60 bg-emerald-50/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-montserrat uppercase tracking-wider font-bold text-emerald-700">
              Set B
            </span>
            <span className="text-xs font-montserrat font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200/80">
              |B| = {setBSize}
            </span>
          </div>
          <select
            value={setBId}
            onChange={(e) => onSelectB(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-montserrat text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <optgroup label="Brands">
              {brandOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Features">
              {featureOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Set C (3-Set Mode Only) */}
        {mode === "3-set" && (
          <div className="glass-panel rounded-xl p-4 border border-purple-200/60 bg-purple-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-montserrat uppercase tracking-wider font-bold text-purple-700">
                Set C
              </span>
              <span className="text-xs font-montserrat font-semibold text-purple-800 bg-white/80 px-2 py-0.5 rounded-full border border-purple-200/80">
                |C| = {setCSize}
              </span>
            </div>
            <select
              value={setCId}
              onChange={(e) => onSelectC(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-montserrat text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            >
              <optgroup label="Brands">
                {brandOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Features">
                {featureOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
