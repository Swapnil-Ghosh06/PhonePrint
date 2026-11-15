import React from "react";

export interface PhonePrintLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * PhonePrint Identity Symbol:
 * Harmonizes the silhouette of a modern smartphone with biometric fingerprint contours
 * and a discrete mathematical focal node (representing individual preference in U).
 */
export function PhonePrintLogo({
  size = 32,
  className = "",
  showWordmark = false,
  wordmarkClassName = "",
}: PhonePrintLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Soft rounded container with subtle border */}
        <rect
          x="3"
          y="2"
          width="34"
          height="36"
          rx="9"
          className="fill-stone-50 stroke-stone-300/80"
          strokeWidth="1.5"
        />

        {/* Top speaker slit (subtle phone detail) */}
        <line
          x1="17"
          y1="6"
          x2="23"
          y2="6"
          className="stroke-stone-400"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outer fingerprint arch / contour */}
        <path
          d="M10 28C10 21.5 14.5 11 20 11C25.5 11 30 21.5 30 28"
          className="stroke-stone-700"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Middle fingerprint arch */}
        <path
          d="M14 29C14 24 16.5 15.5 20 15.5C23.5 15.5 26 24 26 29"
          className="stroke-stone-700"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Inner biometric loop */}
        <path
          d="M17.5 30C17.5 26.5 18.5 20 20 20C21.5 20 22.5 26.5 22.5 30"
          className="stroke-stone-800"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Central preference data node (cobalt focal point) */}
        <circle
          cx="20"
          cy="24"
          r="2.25"
          className="fill-cobalt-600 stroke-white"
          strokeWidth="1.2"
        />
      </svg>

      {showWordmark && (
        <div className={`flex flex-col leading-none ${wordmarkClassName}`}>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-lg tracking-tight text-stone-900">
              PhonePrint
            </span>
            <span className="font-mono text-[10px] uppercase font-semibold text-cobalt-700 bg-cobalt-50 border border-cobalt-200/80 px-1.5 py-0.5 rounded">
              Lab
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-stone-500 mt-0.5">
            Discrete Preference Analytics
          </span>
        </div>
      )}
    </div>
  );
}
