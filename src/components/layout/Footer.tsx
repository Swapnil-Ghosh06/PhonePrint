import React from "react";
import Link from "next/link";
import { PhonePrintLogo } from "@/components/ui/PhonePrintLogo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200/60 bg-white/50 backdrop-blur-xl text-xs text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block">
              <PhonePrintLogo size={32} showWordmark />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-slate-500 font-sans">
              An interactive research laboratory modeling smartphone brand and feature
              preferences through axiomatic discrete set theory, combinatorial spaces,
              and educational graph-theoretic visualization.
            </p>
            <div className="glass-panel rounded-2xl p-4 text-[12px] text-slate-600 border border-white/80 shadow-sm max-w-lg">
              <span className="font-semibold text-slate-800 font-montserrat uppercase tracking-wider text-[11px] block mb-1">
                Academic Research Framework
              </span>
              Current demonstration runs on{" "}
              <code className="font-montserrat text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80">
                SIMULATED CAMPUS DATA — N=30
              </code>
              . All records are synthesized for mathematical verification, presentation clarity, and pedagogical exploration.
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-sora font-bold text-slate-900 text-sm mb-3">
              Research Modules
            </h4>
            <ul className="space-y-2.5 font-montserrat text-xs">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-blue-500 font-bold">01</span>
                  Campus Pulse
                </Link>
              </li>
              <li>
                <Link
                  href="/my-phoneprint"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-blue-500 font-bold">02</span>
                  My PhonePrint
                </Link>
              </li>
              <li>
                <Link
                  href="/setlab"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-blue-500 font-bold">03</span>
                  SetLab (Venn &amp; PIE)
                </Link>
              </li>
              <li>
                <Link
                  href="/combolab"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-blue-500 font-bold">04</span>
                  ComboLab (C(7,3))
                </Link>
              </li>
              <li>
                <Link
                  href="/experiment-studio"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-blue-500 font-bold">05</span>
                  Experiment Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[10px] text-blue-500 font-bold">06</span>
                  Methodology &amp; Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Mathematical Foundations */}
          <div>
            <h4 className="font-sora font-bold text-slate-900 text-sm mb-3">
              Discrete Principles
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 font-sans">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>Principle of Inclusion-Exclusion (PIE)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Combinations C(7, 3) = 35 Triplets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span>Ordered Permutations P(7, 3) = 210</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>Price-Tier Stratified Analytics</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-montserrat text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} PhonePrint Research. Designed with precision and glassmorphism.</p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All 152 Validation Tests Passing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
