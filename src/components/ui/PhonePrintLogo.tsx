import React from "react";

export interface PhonePrintLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * Modern PhonePrint Identity Symbol:
 * Sleek smartphone silhouette with subtle biometric focal contours,
 * soft gradient fill, and crisp geometry.
 */
export function PhonePrintLogo({
  size = 32,
  className = "",
  showWordmark = false,
  wordmarkClassName = "",
}: PhonePrintLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="logoInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Rounded smartphone frame with vibrant soft gradient */}
          <rect
            x="3"
            y="2"
            width="34"
            height="36"
            rx="11"
            fill="url(#logoBg)"
          />

          {/* Inner subtle glow rim */}
          <rect
            x="4"
            y="3"
            width="32"
            height="34"
            rx="10"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />

          {/* Speaker bar */}
          <line
            x1="17"
            y1="6.5"
            x2="23"
            y2="6.5"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Outer biometric loop */}
          <path
            d="M11 27C11 20 15 13 20 13C25 13 29 20 29 27"
            stroke="url(#logoInner)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Middle biometric loop */}
          <path
            d="M15 28C15 23 17 17.5 20 17.5C23 17.5 25 23 25 28"
            stroke="url(#logoInner)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center preference node / core biometric origin */}
          <circle
            cx="20"
            cy="24"
            r="2"
            fill="#ffffff"
          />
        </svg>
      </div>

      {showWordmark && (
        <div className={`flex flex-col text-left leading-none ${wordmarkClassName}`}>
          <div className="flex items-center gap-1.5">
            <span className="font-sora text-base font-extrabold tracking-tight text-slate-900">
              Phone<span className="text-blue-600">Print</span>
            </span>
            <span className="rounded-full bg-blue-50 border border-blue-200/80 px-1.5 py-0.5 text-[9px] font-montserrat font-bold uppercase tracking-wider text-blue-700">
              Lab
            </span>
          </div>
          <span className="text-[10px] font-montserrat font-medium text-slate-600 tracking-wide mt-0.5">
            Discrete Preference Analytics
          </span>
        </div>
      )}
    </div>
  );
}
