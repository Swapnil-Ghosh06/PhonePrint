"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhonePrintLogo } from "@/components/ui/PhonePrintLogo";
import { StatusDot } from "@/components/ui/StatusDot";
import { getActiveDatasetInfo } from "@/lib/data/loader";

interface NavLink {
  name: string;
  href: string;
  code: string;
  tag?: string;
}

const NAV_LINKS: NavLink[] = [
  { name: "Campus Pulse", href: "/", code: "01" },
  { name: "My PhonePrint", href: "/my-phoneprint", code: "02", tag: "Interactive" },
  { name: "SetLab", href: "/setlab", code: "03", tag: "Set Theory" },
  { name: "ComboLab", href: "/combolab", code: "04", tag: "C(7,3)" },
  { name: "Experiment Studio", href: "/experiment-studio", code: "05", tag: "Hypothesis" },
  { name: "Methodology", href: "/methodology", code: "06" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const datasetInfo = getActiveDatasetInfo();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-300/80 bg-[#FBFBF9]/95 backdrop-blur-md text-stone-900 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-xs"
          >
            <PhonePrintLogo size={28} showWordmark />
            <span className="hidden md:inline-block font-mono text-[9px] text-stone-400 uppercase tracking-widest pl-2 border-l border-stone-300">
              Lab &times; Monograph
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                  isActive
                    ? "bg-stone-900 text-white font-semibold"
                    : "text-stone-700 hover:text-stone-950 hover:bg-stone-200/60"
                }`}
              >
                <span className={`font-mono text-[10px] mr-1.5 font-normal ${isActive ? "text-stone-300" : "text-stone-400"}`}>
                  {link.code}
                </span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section / Dataset Status */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xs border border-stone-300/80 bg-white px-2.5 py-1 text-xs shadow-none">
            <StatusDot variant={datasetInfo.isDemo ? "lime" : "cobalt"} pulse size="sm" />
            <span className="font-mono text-[10px] font-medium tracking-wide uppercase text-stone-800">
              {datasetInfo.badgeText}
            </span>
          </div>

          <span className="font-mono text-[10px] text-stone-500 bg-stone-100 border border-stone-300/80 px-2 py-0.5 rounded-xs">
            v2.5
          </span>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xs p-1.5 text-stone-700 hover:bg-stone-200/60 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-300/80 bg-[#FBFBF9] px-4 py-3 lg:hidden shadow-sm">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xs px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-stone-900 text-white font-semibold"
                      : "text-stone-700 hover:bg-stone-200/60 hover:text-stone-950"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] ${isActive ? "text-stone-300" : "text-stone-400"}`}>
                      {link.code}
                    </span>
                    <span>{link.name}</span>
                  </div>
                  {link.tag && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-xs border ${
                      isActive ? "bg-stone-800 text-stone-200 border-stone-700" : "bg-stone-100 text-stone-600 border-stone-300"
                    }`}>
                      {link.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 border-t border-stone-300/80 pt-2.5 flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <StatusDot variant={datasetInfo.isDemo ? "lime" : "cobalt"} pulse size="sm" />
              <span className="font-mono text-[10px] uppercase tracking-wide text-stone-800">
                {datasetInfo.badgeText}
              </span>
            </div>
            <span className="font-mono text-[10px] text-stone-500">v2.5</span>
          </div>
        </div>
      )}
    </header>
  );
}
