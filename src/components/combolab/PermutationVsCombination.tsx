"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import {
  SMARTPHONE_FEATURES,
  type SmartphoneFeature,
} from "@/types/survey";
import { generatePermutations } from "@/lib/math/combinations";

export function PermutationVsCombination() {
  const [selectedFeatures, setSelectedFeatures] = useState<
    [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature]
  >([
    "Camera Quality",
    "Battery Life",
    "Processing Performance",
  ]);

  // Generate all 3! = 6 permutations of the 3 selected features
  const permutations = useMemo(() => {
    return generatePermutations(selectedFeatures);
  }, [selectedFeatures]);

  const toggleFeature = (feature: SmartphoneFeature) => {
    if (selectedFeatures.includes(feature)) {
      return;
    }
    // Replace the first feature and shift
    setSelectedFeatures([selectedFeatures[1], selectedFeatures[2], feature]);
  };

  return (
    <Card>
      <CardHeader
        title="Permutations vs Combinations: Why Order Does Not Matter"
        subtitle="Mathematical comparison using empirical smartphone feature triplets"
        badge={<Badge variant="lime">Core Discrete Concept</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Interactive Feature Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-montserrat uppercase tracking-wider text-slate-500 font-semibold">
              Select 3 Features to Compare:
            </span>
            <span className="text-xs font-montserrat text-blue-600 font-medium">
              Active Triplet: {selectedFeatures.length} / 3
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SMARTPHONE_FEATURES.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-montserrat font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "glass-panel hover:bg-white text-slate-700 border border-slate-200/80"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Combinations (Unordered) */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border border-white/80">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
              <div>
                <span className="text-[11px] font-montserrat uppercase tracking-wider text-emerald-700 font-bold">
                  Combination (Unordered Set)
                </span>
                <h4 className="text-base font-sora font-bold text-slate-900 mt-0.5">
                  Order Does NOT Matter
                </h4>
              </div>
              <Badge variant="lime">C(3, 3) = 1 Outcome</Badge>
            </div>

            <div className="glass-panel rounded-xl bg-white/70 p-4 border border-slate-200/60 shadow-xs space-y-3">
              <span className="text-xs font-montserrat text-slate-500 uppercase tracking-wider font-semibold block">
                Mathematical Set Notation:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/60 font-montserrat text-xs">
                <span className="text-slate-400 font-bold text-base">&#123;</span>
                {selectedFeatures.map((f, i) => (
                  <React.Fragment key={f}>
                    <span className="font-semibold text-blue-700 bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-xs">
                      {f}
                    </span>
                    {i < selectedFeatures.length - 1 && (
                      <span className="text-slate-400 font-bold">,</span>
                    )}
                  </React.Fragment>
                ))}
                <span className="text-slate-400 font-bold text-base">&#125;</span>
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Represents a single unique bundle of user priorities. Reordering the elements inside braces yields the exact same set:
              </p>
              <div className="text-xs font-montserrat text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                &#123;A, B, C&#125; = &#123;B, A, C&#125; = &#123;C, B, A&#125; (Cardinality = 1)
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-950 font-sans leading-relaxed">
              <strong>PhonePrint Modeling Principle:</strong> Because consumers evaluate holistic hardware-software utility, checkbox selection order in the survey introduces zero product differentiation.
            </div>
          </div>

          {/* Permutations (Ordered) */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 border border-white/80">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
              <div>
                <span className="text-[11px] font-montserrat uppercase tracking-wider text-purple-700 font-bold">
                  Permutations (Ordered Sequences)
                </span>
                <h4 className="text-base font-sora font-bold text-slate-900 mt-0.5">
                  Order DOES Matter
                </h4>
              </div>
              <Badge variant="cobalt">3! = {permutations.length} Sequences</Badge>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-montserrat text-slate-500 uppercase tracking-wider font-semibold block">
                All 6 Distinct Sequences (P(3, 3) = 6):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {permutations.map((perm, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-200/70 bg-white/70 font-montserrat text-xs flex items-center justify-between"
                  >
                    <span className="font-bold text-purple-700 text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="text-slate-700 truncate ml-2">
                      ({perm[0]?.split(" ")[0]}, {perm[1]?.split(" ")[0]}, {perm[2]?.split(" ")[0]})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3.5 text-xs text-purple-950 font-sans leading-relaxed">
              If survey responses were ordered sequences (e.g. ranked ballots), the choice space would explode by a factor of 3! = 6 to <strong>P(7, 3) = 210</strong>, creating artificial data sparsity.
            </div>
          </div>
        </div>

        {/* Formal Binomial Coefficient Identity */}
        <div className="glass-panel rounded-2xl p-5 border border-white/80">
          <span className="text-xs font-montserrat font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Formal Algebraic Connection
          </span>
          <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60 my-2">
            <KaTeXMath
              math="C(n, r) = \frac{P(n, r)}{r!} = \frac{n!}{r!(n - r)!}"
              block
              className="text-slate-900 font-bold"
            />
          </div>
          <p className="text-xs text-slate-600 font-sans leading-relaxed mt-2">
            Dividing by <KaTeXMath math="r! = 3! = 6" /> collapses the 6 distinct ordering permutations into exactly 1 unique customer preference bundle.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
