"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import {
  calculateCombinations,
  getCombinationCalculationSteps,
} from "@/lib/math/combinations";

interface PresetConfig {
  label: string;
  n: number;
  r: number;
  description: string;
}

const PRESETS: PresetConfig[] = [
  {
    label: "PhonePrint Triplet Space",
    n: 7,
    r: 3,
    description: "C(7, 3) = 35 canonical feature combinations",
  },
  {
    label: "Symmetric Pair C(7, 4)",
    n: 7,
    r: 4,
    description: "C(7, 4) = C(7, 3) = 35 by symmetry",
  },
  {
    label: "Pairwise Feature Overlap",
    n: 7,
    r: 2,
    description: "C(7, 2) = 21 pairwise feature interactions",
  },
  {
    label: "Top 5 Features Subspace",
    n: 5,
    r: 3,
    description: "C(5, 3) = 10 feature triplets among top 5 features",
  },
  {
    label: "Boundary: C(n, 0)",
    n: 7,
    r: 0,
    description: "C(7, 0) = 1 (empty selection / null subset)",
  },
  {
    label: "Boundary: C(n, n)",
    n: 7,
    r: 7,
    description: "C(7, 7) = 1 (complete set selection)",
  },
];

export function CombinationCalculator() {
  const [nInput, setNInput] = useState<number>(7);
  const [rInput, setRInput] = useState<number>(3);

  // Validation
  const validationError = useMemo(() => {
    if (!Number.isInteger(nInput) || !Number.isInteger(rInput)) {
      return "Both n and r must be integers.";
    }
    if (nInput < 0) {
      return "Total available items n cannot be negative.";
    }
    if (rInput < 0) {
      return "Chosen items r cannot be negative.";
    }
    if (rInput > nInput) {
      return `Chosen items r (${rInput}) cannot exceed available items n (${nInput}). In combinations without repetition, r ≤ n is required.`;
    }
    if (nInput > 18) {
      return "For exact safe integer precision (Number.MAX_SAFE_INTEGER) and readable factorial expansion, n is capped at 18 in this interactive calculator.";
    }
    return null;
  }, [nInput, rInput]);

  const calculation = useMemo(() => {
    if (validationError) return null;
    try {
      const steps = getCombinationCalculationSteps(nInput, rInput);
      const total = calculateCombinations(nInput, rInput);
      return { steps, total };
    } catch {
      return null;
    }
  }, [nInput, rInput, validationError]);

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Interactive Binomial Coefficient Calculator (nCr)"
        subtitle="Step-by-step factorial simplification and numerical computation"
        badge={<Badge variant="cobalt">Pure Combinatorics</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Preset buttons */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-2">
            Quick Exploration Presets
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => {
              const isActive = nInput === preset.n && rInput === preset.r;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setNInput(preset.n);
                    setRInput(preset.r);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-stone-900 text-white shadow-none"
                      : "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xs bg-[#FAF9F5] p-4 border border-stone-200">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="input-n"
                className="text-xs font-semibold text-stone-900 font-sans"
              >
                Available Elements (n)
              </label>
              <span className="text-[11px] text-stone-500 font-mono">
                Canonical features = 7
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 w-8.5 p-0 font-bold"
                onClick={() => setNInput((prev) => Math.max(0, prev - 1))}
              >
                -
              </Button>
              <input
                id="input-n"
                type="number"
                min={0}
                max={18}
                value={nInput}
                onChange={(e) => setNInput(parseInt(e.target.value, 10) || 0)}
                className="h-8.5 w-full rounded-md border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 shadow-none"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 w-8.5 p-0 font-bold"
                onClick={() => setNInput((prev) => Math.min(18, prev + 1))}
              >
                +
              </Button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-sans">
              Total distinct items available to choose from.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="input-r"
                className="text-xs font-semibold text-stone-900 font-sans"
              >
                Chosen Elements (r)
              </label>
              <span className="text-[11px] text-stone-500 font-mono">
                Selected features = 3
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 w-8.5 p-0 font-bold"
                onClick={() => setRInput((prev) => Math.max(0, prev - 1))}
              >
                -
              </Button>
              <input
                id="input-r"
                type="number"
                min={0}
                max={nInput}
                value={rInput}
                onChange={(e) => setRInput(parseInt(e.target.value, 10) || 0)}
                className="h-8.5 w-full rounded-md border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 shadow-none"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8.5 w-8.5 p-0 font-bold"
                onClick={() => setRInput((prev) => Math.min(nInput, prev + 1))}
              >
                +
              </Button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-sans">
              Subset size to select without repetition.
            </p>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="rounded-xs border border-red-200 bg-red-50/70 p-3 text-xs font-medium text-red-800 font-sans">
            <strong>Input Error:</strong> {validationError}
          </div>
        )}

        {/* Step-by-Step Mathematical Output */}
        {calculation && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Formula & Substitution Card */}
              <div className="md:col-span-3 rounded-xs border border-stone-200 bg-white p-4 space-y-3 shadow-none">
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                    Step-by-Step Derivation
                  </span>
                  {calculation.steps.isSymmetricApplied && (
                    <Badge variant="lime">
                      Symmetry: C({nInput}, {rInput}) = C({nInput}, {calculation.steps.effectiveR})
                    </Badge>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-md bg-[#FAF9F5] p-3 border border-stone-200">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
                      1. General Combinatorial Formula
                    </span>
                    <KaTeXMath
                      math={calculation.steps.formulaLatex}
                      block
                      className="text-stone-900 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="rounded-md bg-[#FAF9F5] p-3 border border-stone-200">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
                      2. Numerical Substitution
                    </span>
                    <KaTeXMath
                      math={calculation.steps.substitutedLatex}
                      block
                      className="text-stone-900 text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="rounded-md bg-[#FAF9F5] p-3 border border-stone-200">
                    <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
                      3. Factorial Cancellation & Arithmetic Simplification
                    </span>
                    <KaTeXMath
                      math={calculation.steps.simplifiedLatex}
                      block
                      className="text-stone-900 text-xs sm:text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Result Metric Card */}
              <div className="flex flex-col justify-between rounded-xs border border-stone-200 bg-[#FAF9F5] p-5 text-center shadow-none">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    Theoretical Combinations
                  </span>
                  <div className="mt-3 font-serif text-4xl font-bold text-stone-900">
                    {calculation.total.toLocaleString()}
                  </div>
                  <p className="mt-2 text-xs text-stone-600 font-sans">
                    Distinct unordered subsets of size {rInput} from {nInput} elements
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500 font-mono">
                  C({nInput}, {rInput}) = {calculation.total}
                </div>
              </div>
            </div>

            {/* Symmetry and Mathematical Properties Note */}
            <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-3 text-xs text-stone-600 flex items-start gap-2 font-sans">
              <span className="text-stone-400 font-bold">&bull;</span>
              <div>
                <strong>Mathematical Property:</strong> Symmetry states that{" "}
                <KaTeXMath math="C(n, r) = C(n, n - r)" />. Choosing{" "}
                {rInput} elements to include is mathematically identical to
                choosing {nInput - rInput} elements to leave out.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
