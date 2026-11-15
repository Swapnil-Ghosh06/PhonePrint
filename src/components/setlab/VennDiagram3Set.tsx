"use client";

import React, { useState } from "react";
import type { ThreeSetVennRegions } from "@/types/math";
import type { Operation3Set, ActiveOperation } from "./SetOperationsToolbar";

export interface VennDiagram3SetProps {
  setAName: string;
  setBName: string;
  setCName: string;
  regions: ThreeSetVennRegions<string>;
  activeOperation: ActiveOperation;
  onSelectRegion: (op: Operation3Set) => void;
}

export function VennDiagram3Set({
  setAName,
  setBName,
  setCName,
  regions,
  activeOperation,
  onSelectRegion,
}: VennDiagram3SetProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region active checks based on 3-set algebraic operation
  const isOnlyAActive = activeOperation === "only_a" || activeOperation === "union_abc";
  const isOnlyBActive = activeOperation === "only_b" || activeOperation === "union_abc";
  const isOnlyCActive = activeOperation === "only_c" || activeOperation === "union_abc";

  const isOnlyABActive =
    activeOperation === "only_ab" ||
    activeOperation === "inter_ab" ||
    activeOperation === "union_abc";

  const isOnlyACActive =
    activeOperation === "only_ac" ||
    activeOperation === "inter_ac" ||
    activeOperation === "union_abc";

  const isOnlyBCActive =
    activeOperation === "only_bc" ||
    activeOperation === "inter_bc" ||
    activeOperation === "union_abc";

  const isAllThreeActive =
    activeOperation === "inter_abc" ||
    activeOperation === "inter_ab" ||
    activeOperation === "inter_ac" ||
    activeOperation === "inter_bc" ||
    activeOperation === "union_abc";

  const isOutsideActive = activeOperation === "outside_abc";

  return (
    <div className="relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-none text-slate-900 overflow-hidden">
      {/* Top Banner with 3 Set Labels */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-cobalt-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setAName}>
            Set A: {setAName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-start sm:justify-center">
          <span className="h-3 w-3 rounded-full bg-lime-500 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setBName}>
            Set B: {setBName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-start sm:justify-end">
          <span className="h-3 w-3 rounded-full bg-purple-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setCName}>
            Set C: {setCName}
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full max-w-[560px] aspect-[560/460] relative">
        <svg
          viewBox="0 0 560 460"
          className="w-full h-full select-none"
          role="img"
          aria-label="Three-set Venn diagram representing Sets A, B, and C"
        >
          {/* Universal Set Bounding Rectangle */}
          <rect
            x="8"
            y="8"
            width="544"
            height="444"
            rx="12"
            fill={isOutsideActive ? "#f1f5f9" : "#fafafa"}
            stroke={isOutsideActive ? "#2563eb" : "#e2e8f0"}
            strokeWidth={isOutsideActive ? "2" : "1.5"}
            strokeDasharray={isOutsideActive ? "none" : "4 4"}
            className="transition-colors cursor-pointer"
            onClick={() => onSelectRegion("outside_abc")}
            onMouseEnter={() => setHoveredRegion("outside")}
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

          {/* Outside Region Button */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectRegion("outside_abc")}
            onMouseEnter={() => setHoveredRegion("outside")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="390"
              y="18"
              width="150"
              height="26"
              rx="6"
              fill={isOutsideActive ? "#2563eb" : "#ffffff"}
              stroke={isOutsideActive ? "#1d4ed8" : hoveredRegion === "outside" ? "#3b82f6" : "#cbd5e1"}
              strokeWidth="1"
            />
            <text
              x="465"
              y="35"
              textAnchor="middle"
              fill={isOutsideActive ? "#ffffff" : "#475569"}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              (A ∪ B ∪ C)ᶜ : n={regions.outside.size}
            </text>
          </g>

          {/* 3 Translucent Circles Background */}
          {/* Circle A (Top): (280, 170), R=115 */}
          <circle
            cx="280"
            cy="170"
            r="115"
            fill="#2563eb"
            fillOpacity={0.15}
            stroke="#2563eb"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Circle B (Bottom-Left): (215, 275), R=115 */}
          <circle
            cx="215"
            cy="275"
            r="115"
            fill="#84cc16"
            fillOpacity={0.15}
            stroke="#65a30d"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Circle C (Bottom-Right): (345, 275), R=115 */}
          <circle
            cx="345"
            cy="275"
            r="115"
            fill="#a855f7"
            fillOpacity={0.15}
            stroke="#9333ea"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* ========================================================== */}
          {/* 7 Interactive Region Badges with Exact Dynamic Counts       */}
          {/* ========================================================== */}

          {/* 1. Only A: Top (280, 110) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(280, 110)"
            onClick={() => onSelectRegion("only_a")}
            onMouseEnter={() => setHoveredRegion("onlyA")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyAActive ? "#2563eb" : "#ffffff"}
              stroke={isOnlyAActive ? "#1d4ed8" : "#93c5fd"}
              strokeWidth={isOnlyAActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyAActive ? "#eff6ff" : "#1e40af"}
            >
              A only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyAActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyA.size}
            </text>
          </g>

          {/* 2. Only B: Bottom-Left (150, 320) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(150, 320)"
            onClick={() => onSelectRegion("only_b")}
            onMouseEnter={() => setHoveredRegion("onlyB")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyBActive ? "#84cc16" : "#ffffff"}
              stroke={isOnlyBActive ? "#4d7c0f" : "#bef264"}
              strokeWidth={isOnlyBActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyBActive ? "#1a2e05" : "#3f6212"}
            >
              B only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBActive ? "#0f172a" : "#0f172a"}
            >
              n = {regions.onlyB.size}
            </text>
          </g>

          {/* 3. Only C: Bottom-Right (410, 320) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(410, 320)"
            onClick={() => onSelectRegion("only_c")}
            onMouseEnter={() => setHoveredRegion("onlyC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyCActive ? "#a855f7" : "#ffffff"}
              stroke={isOnlyCActive ? "#7e22ce" : "#d8b4fe"}
              strokeWidth={isOnlyCActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyCActive ? "#ffffff" : "#6b21a8"}
            >
              C only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyCActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyC.size}
            </text>
          </g>

          {/* 4. Only AB: (A ∩ B) \ C (210, 200) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(210, 200)"
            onClick={() => onSelectRegion("only_ab")}
            onMouseEnter={() => setHoveredRegion("onlyAB")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyABActive ? "#0284c7" : "#ffffff"}
              stroke={isOnlyABActive ? "#0369a1" : "#7dd3fc"}
              strokeWidth={isOnlyABActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyABActive ? "#ffffff" : "#0369a1"}
            >
              (A ∩ B) \ C
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyABActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyAB.size}
            </text>
          </g>

          {/* 5. Only AC: (A ∩ C) \ B (350, 200) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(350, 200)"
            onClick={() => onSelectRegion("only_ac")}
            onMouseEnter={() => setHoveredRegion("onlyAC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyACActive ? "#6366f1" : "#ffffff"}
              stroke={isOnlyACActive ? "#4338ca" : "#a5b4fc"}
              strokeWidth={isOnlyACActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyACActive ? "#ffffff" : "#4338ca"}
            >
              (A ∩ C) \ B
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyACActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyAC.size}
            </text>
          </g>

          {/* 6. Only BC: (B ∩ C) \ A (280, 345) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(280, 345)"
            onClick={() => onSelectRegion("only_bc")}
            onMouseEnter={() => setHoveredRegion("onlyBC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyBCActive ? "#10b981" : "#ffffff"}
              stroke={isOnlyBCActive ? "#047857" : "#6ee7b7"}
              strokeWidth={isOnlyBCActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyBCActive ? "#ffffff" : "#047857"}
            >
              (B ∩ C) \ A
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBCActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyBC.size}
            </text>
          </g>

          {/* 7. Triple Intersection: A ∩ B ∩ C Center (280, 240) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            transform="translate(280, 240)"
            onClick={() => onSelectRegion("inter_abc")}
            onMouseEnter={() => setHoveredRegion("allThree")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-20"
              width="96"
              height="40"
              rx="8"
              fill={isAllThreeActive ? "#1e3a8a" : "#1e293b"}
              stroke={isAllThreeActive ? "#60a5fa" : "#334155"}
              strokeWidth={isAllThreeActive ? "3" : "2"}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            />
            <text
              y="-4"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#93c5fd"
            >
              A ∩ B ∩ C
            </text>
            <text
              y="13"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
              fill="#ffffff"
            >
              n = {regions.allThree.size}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <span>Click any region to inspect its exact respondent membership</span>
        <span className="font-mono text-slate-600">
          |A ∪ B ∪ C| = {regions.unionSet.size} (Sum of 7 regions = {regions.onlyA.size + regions.onlyB.size + regions.onlyC.size + regions.onlyAB.size + regions.onlyAC.size + regions.onlyBC.size + regions.allThree.size})
        </span>
      </div>
    </div>
  );
}
