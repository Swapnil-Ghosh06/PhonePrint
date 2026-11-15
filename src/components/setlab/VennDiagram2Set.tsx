"use client";

import React, { useState } from "react";
import type { TwoSetVennRegions } from "@/types/math";
import type { Operation2Set, ActiveOperation } from "./SetOperationsToolbar";

export interface VennDiagram2SetProps {
  setAName: string;
  setBName: string;
  regions: TwoSetVennRegions<string>;
  activeOperation: ActiveOperation;
  onSelectRegion: (op: Operation2Set) => void;
}

export function VennDiagram2Set({
  setAName,
  setBName,
  regions,
  activeOperation,
  onSelectRegion,
}: VennDiagram2SetProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region active checks based on algebraic operation
  const isOnlyAActive =
    activeOperation === "diff_ab" ||
    activeOperation === "union" ||
    activeOperation === "sym_diff" ||
    activeOperation === "comp_b";

  const isBothActive =
    activeOperation === "intersection" ||
    activeOperation === "union" ||
    activeOperation === "disjoint_ab";

  const isOnlyBActive =
    activeOperation === "diff_ba" ||
    activeOperation === "union" ||
    activeOperation === "sym_diff" ||
    activeOperation === "comp_a";

  const isNeitherActive =
    activeOperation === "neither" ||
    activeOperation === "comp_a" ||
    activeOperation === "comp_b";

  return (
    <div className="relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-none text-slate-900 overflow-hidden">
      {/* Top Banner with Set Labels */}
      <div className="w-full flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cobalt-600" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={setAName}>
            Set A: {setAName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={setBName}>
            Set B: {setBName}
          </span>
          <span className="h-3 w-3 rounded-full bg-lime-500" />
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full max-w-[540px] aspect-[540/320] relative">
        <svg
          viewBox="0 0 540 320"
          className="w-full h-full select-none"
          role="img"
          aria-label="Two-set Venn diagram representing Set A and Set B"
        >
          <defs>
            {/* Subtle drop shadows for interactive hover */}
            <filter id="venn-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.3" />
            </filter>
            <filter id="lime-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#84cc16" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Universal Set Bounding Rectangle */}
          <rect
            x="8"
            y="8"
            width="524"
            height="304"
            rx="12"
            fill={isNeitherActive ? "#f1f5f9" : "#fafafa"}
            stroke={isNeitherActive ? "#2563eb" : "#e2e8f0"}
            strokeWidth={isNeitherActive ? "2" : "1.5"}
            strokeDasharray={isNeitherActive ? "none" : "4 4"}
            className="transition-colors cursor-pointer"
            onClick={() => onSelectRegion("neither")}
            onMouseEnter={() => setHoveredRegion("neither")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Universe Label */}
          <text
            x="24"
            y="32"
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="600"
          >
            Universal Set U (n={regions.universeSet.size})
          </text>

          {/* Outside Region (Neither) Button Indicator */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectRegion("neither")}
            onMouseEnter={() => setHoveredRegion("neither")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="380"
              y="18"
              width="140"
              height="26"
              rx="6"
              fill={isNeitherActive ? "#2563eb" : "#ffffff"}
              stroke={isNeitherActive ? "#1d4ed8" : "#cbd5e1"}
              strokeWidth="1"
            />
            <text
              x="450"
              y="35"
              textAnchor="middle"
              fill={isNeitherActive ? "#ffffff" : "#475569"}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              (A ∪ B)ᶜ : n={regions.neither.size}
            </text>
          </g>

          {/* ============================================================== */}
          {/* Region 1: Only A (A \ B)                                       */}
          {/* Center (200, 160), R=105, intersection pts: (270, 81.74) to (270, 238.26) */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 1,0 270,238.26 A 105,105 0 0,0 270,81.74 Z"
            fill={
              isOnlyAActive
                ? "#2563eb"
                : hoveredRegion === "onlyA"
                ? "#93c5fd"
                : "#dbeafe"
            }
            fillOpacity={isOnlyAActive ? 0.85 : 0.45}
            stroke={isOnlyAActive ? "#1d4ed8" : "#3b82f6"}
            strokeWidth={isOnlyAActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("diff_ab")}
            onMouseEnter={() => setHoveredRegion("onlyA")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* ============================================================== */}
          {/* Region 2: Only B (B \ A)                                       */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 1,1 270,238.26 A 105,105 0 0,0 270,81.74 Z"
            fill={
              isOnlyBActive
                ? "#84cc16"
                : hoveredRegion === "onlyB"
                ? "#bef264"
                : "#d9f99d"
            }
            fillOpacity={isOnlyBActive ? 0.85 : 0.45}
            stroke={isOnlyBActive ? "#4d7c0f" : "#65a30d"}
            strokeWidth={isOnlyBActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("diff_ba")}
            onMouseEnter={() => setHoveredRegion("onlyB")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* ============================================================== */}
          {/* Region 3: Intersection (A ∩ B)                                  */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 0,1 270,238.26 A 105,105 0 0,1 270,81.74 Z"
            fill={
              isBothActive
                ? "#3b82f6"
                : hoveredRegion === "both"
                ? "#a7f3d0"
                : "#bfdbfe"
            }
            fillOpacity={isBothActive ? 0.95 : 0.65}
            stroke={isBothActive ? "#1e40af" : "#2563eb"}
            strokeWidth={isBothActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("intersection")}
            onMouseEnter={() => setHoveredRegion("both")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Labels & Dynamic Cardinality Badges */}

          {/* Region A Only Text */}
          <g
            className="pointer-events-none"
            transform="translate(180, 160)"
          >
            <text
              textAnchor="middle"
              y="-10"
              fontSize="12"
              fontWeight="bold"
              fill={isOnlyAActive ? "#ffffff" : "#1e40af"}
            >
              A only
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyAActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyA.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isOnlyAActive ? "#eff6ff" : "#475569"}
            >
              A \ B
            </text>
          </g>

          {/* Intersection A ∩ B Text */}
          <g
            className="pointer-events-none"
            transform="translate(270, 160)"
          >
            <text
              textAnchor="middle"
              y="-12"
              fontSize="11"
              fontWeight="bold"
              fill={isBothActive ? "#ffffff" : "#1e3a8a"}
            >
              Both
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="20"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isBothActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.both.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isBothActive ? "#eff6ff" : "#1e40af"}
            >
              A ∩ B
            </text>
          </g>

          {/* Region B Only Text */}
          <g
            className="pointer-events-none"
            transform="translate(360, 160)"
          >
            <text
              textAnchor="middle"
              y="-10"
              fontSize="12"
              fontWeight="bold"
              fill={isOnlyBActive ? "#ffffff" : "#365314"}
            >
              B only
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyB.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isOnlyBActive ? "#eff6ff" : "#3f6212"}
            >
              B \ A
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <span>Click any Venn region to inspect its matching respondent IDs</span>
        <span className="font-mono text-slate-600">
          |A ∪ B| = {regions.unionSet.size} of {regions.universeSet.size}
        </span>
      </div>
    </div>
  );
}
