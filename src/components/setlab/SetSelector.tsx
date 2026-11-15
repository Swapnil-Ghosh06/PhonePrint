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

  const optionA = availableOptions.find((o) => o.id === setAId);
  const optionB = availableOptions.find((o) => o.id === setBId);
  const optionC = availableOptions.find((o) => o.id === setCId);

  return (
    <div className="rounded-xs border border-stone-300/80 bg-white p-5 shadow-none text-stone-900 space-y-4">
      {/* Header and Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-300/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-stone-900 font-sans">
              Set Definition Workspace
            </h3>
            <Badge variant="cobalt">Discrete Partitions</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            Select {mode === "2-set" ? "two" : "three"} distinct brand or feature cohorts from the universe (U = {totalUniverseSize} respondents)
          </p>
        </div>

        {/* 2-Set vs 3-Set Mode Switch */}
        <div className="inline-flex rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-1 text-xs">
          <button
            type="button"
            onClick={() => onModeChange("2-set")}
            className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
              mode === "2-set"
                ? "bg-white text-stone-900 font-semibold border border-stone-300/80 shadow-none"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Two Sets (A, B)
          </button>
          <button
            type="button"
            onClick={() => onModeChange("3-set")}
            className={`px-3 py-1 rounded-xs text-xs font-medium transition-colors ${
              mode === "3-set"
                ? "bg-white text-stone-900 font-semibold border border-stone-300/80 shadow-none"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Three Sets (A, B, C)
          </button>
        </div>
      </div>

      {/* Set Pickers Grid */}
      <div className={`grid grid-cols-1 gap-4 ${mode === "3-set" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {/* SET A */}
        <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-cobalt-600 text-white font-mono font-bold text-xs">
                A
              </span>
              <span className="font-semibold text-stone-900 text-xs">Set A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-medium text-cobalt-800 bg-white border border-stone-300/80 px-2 py-0.5 rounded-xs">
                |A| = {setASize}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                ({Math.round((setASize / totalUniverseSize) * 100)}%)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="set-a-select" className="sr-only">
              Choose Set A
            </label>
            <select
              id="set-a-select"
              value={setAId}
              onChange={(e) => onSelectA(e.target.value)}
              className="w-full rounded-xs border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 shadow-none focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              <optgroup label="Smartphone Brands">
                {brandOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setBId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Canonical Features">
                {featureOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setBId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed border-t border-stone-300/80 pt-2 font-sans">
            {optionA?.description}
          </p>
        </div>

        {/* SET B */}
        <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-lime-600 text-white font-mono font-bold text-xs">
                B
              </span>
              <span className="font-semibold text-stone-900 text-xs">Set B</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-medium text-lime-800 bg-white border border-stone-300/80 px-2 py-0.5 rounded-xs">
                |B| = {setBSize}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                ({Math.round((setBSize / totalUniverseSize) * 100)}%)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="set-b-select" className="sr-only">
              Choose Set B
            </label>
            <select
              id="set-b-select"
              value={setBId}
              onChange={(e) => onSelectB(e.target.value)}
              className="w-full rounded-xs border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 shadow-none focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              <optgroup label="Smartphone Brands">
                {brandOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setAId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Canonical Features">
                {featureOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setAId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <p className="text-[11px] text-stone-600 leading-relaxed border-t border-stone-300/80 pt-2 font-sans">
            {optionB?.description}
          </p>
        </div>

        {/* SET C (Only in 3-set mode) */}
        {mode === "3-set" && (
          <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-stone-800 text-white font-mono font-bold text-xs">
                  C
                </span>
                <span className="font-semibold text-stone-900 text-xs">Set C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-medium text-stone-800 bg-white border border-stone-300/80 px-2 py-0.5 rounded-xs">
                  |C| = {setCSize}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  ({Math.round((setCSize / totalUniverseSize) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="set-c-select" className="sr-only">
                Choose Set C
              </label>
              <select
                id="set-c-select"
                value={setCId}
                onChange={(e) => onSelectC(e.target.value)}
                className="w-full rounded-xs border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 shadow-none focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              >
                <optgroup label="Smartphone Brands">
                  {brandOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.id === setAId || opt.id === setBId}
                    >
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Canonical Features">
                  {featureOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.id === setAId || opt.id === setBId}
                    >
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed border-t border-stone-300/80 pt-2 font-sans">
              {optionC?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
