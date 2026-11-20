"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhonePrintLogo } from "@/components/ui/PhonePrintLogo";
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
  { name: "Orbit Showcase", href: "/demo", code: "07", tag: "GSAP Orbit" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const datasetInfo = getActiveDatasetInfo();

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-2.5 sm:px-6 sm:py-3 transition-all">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Main Navigation"
          className="glass-nav rounded-2xl px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between transition-all"
        >
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
            >
              <PhonePrintLogo size={32} showWordmark />
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/60 p-1 rounded-xl border border-white/60">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-montserrat font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? "bg-white text-blue-600 font-semibold shadow-[0_2px_10px_rgba(37,99,235,0.12)] border border-blue-100/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <span
                    className={`text-[10px] font-montserrat transition-colors ${
                      isActive
                        ? "text-blue-500 font-bold"
                        : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  >
                    {link.code}
                  </span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Status Pill & Version */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-montserrat text-[11px] font-semibold tracking-wide uppercase text-emerald-800">
                {datasetInfo.badgeText}
              </span>
            </div>

            <span className="font-montserrat text-[11px] font-medium text-slate-500 bg-slate-100/80 border border-slate-200/60 px-2.5 py-0.5 rounded-full">
              v2.5
            </span>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu with Frosted Glass */}
        {mobileMenuOpen && (
          <div className="mt-2 lg:hidden glass-panel rounded-2xl p-3 border border-white/90 shadow-xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-montserrat font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-md"
                      : "text-slate-700 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={isActive ? "text-blue-100" : "text-slate-400"}>
                      {link.code}
                    </span>
                    <span>{link.name}</span>
                  </div>
                  {link.tag && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-blue-500/80 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {link.tag}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between px-2">
              <span className="text-[11px] font-montserrat font-medium text-slate-500">
                {datasetInfo.badgeText}
              </span>
              <span className="text-[10px] font-montserrat text-slate-400">v2.5</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
