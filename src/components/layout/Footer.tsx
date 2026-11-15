import React from "react";
import Link from "next/link";
import { PhonePrintLogo } from "@/components/ui/PhonePrintLogo";

export function Footer() {
  return (
    <footer className="border-t border-stone-300/80 bg-[#F4F3EE] text-xs text-stone-600 mt-28">
      {/* Editorial top accent double rule */}
      <div className="editorial-double-line w-full" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block">
              <PhonePrintLogo size={32} showWordmark />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-stone-600 font-sans">
              An interactive research laboratory modeling smartphone brand and feature
              preferences through axiomatic discrete set theory, combinatorial spaces,
              and educational graph-theoretic visualization.
            </p>
            <div className="rounded-xs border border-stone-300/80 bg-white p-3.5 text-[11px] text-stone-700 shadow-none">
              <span className="font-semibold text-stone-900 font-mono uppercase tracking-wide text-[10px] block mb-1">
                {"//"} Academic Research Disclosure
              </span>
              Current demonstration runs on <code className="font-mono text-cobalt-800 font-semibold bg-cobalt-50 px-1 py-0.5 rounded-xs border border-cobalt-200/80">SIMULATED CAMPUS DATA — N=30</code>. All records are synthesized for software architecture validation and pedagogical exploration.
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Laboratory Modules
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li>
                <Link
                  href="/"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  [01] Campus Pulse
                </Link>
              </li>
              <li>
                <Link
                  href="/my-phoneprint"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  [02] My PhonePrint
                </Link>
              </li>
              <li>
                <Link
                  href="/setlab"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  [03] SetLab (Venn &amp; PIE)
                </Link>
              </li>
              <li>
                <Link
                  href="/combolab"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  [04] ComboLab (C(7,3))
                </Link>
              </li>
              <li>
                <Link
                  href="/experiment-studio"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  [05] Experiment Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  [06] Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Foundation */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Discrete Mathematics
            </h4>
            <ul className="space-y-2 text-[11px] text-stone-600">
              <li>&bull; Principle of Inclusion-Exclusion</li>
              <li>&bull; Binomial Coefficients &amp; Permutations</li>
              <li>&bull; Partition Conservation ($N_3+N_2+N_1+N_0=N$)</li>
              <li>&bull; Dynamic 300% Feature-Sum Invariant</li>
              <li className="pt-2">
                <Link
                  href="/methodology"
                  className="font-mono text-stone-900 underline hover:text-cobalt-600 transition-colors"
                >
                  Read Mathematical Proofs &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <p>&copy; 2026 PhonePrint Research Group. Discrete Mathematics Academic Platform.</p>
          <p>Indian Rupee (INR ₹) Locale // Verified Invariant Engine</p>
        </div>
      </div>
    </footer>
  );
}
