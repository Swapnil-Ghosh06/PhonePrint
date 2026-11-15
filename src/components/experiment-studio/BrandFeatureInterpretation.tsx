"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import type { BrandFeatureAssociationResult } from "@/types/experiment";

export interface BrandFeatureInterpretationProps {
  result: BrandFeatureAssociationResult;
}

export function BrandFeatureInterpretation({
  result,
}: BrandFeatureInterpretationProps) {
  const { descriptiveNotes, selectedBrands } = result;

  return (
    <Card>
      <CardHeader
        title="Experiment 1: Scientific Methodology & Descriptive Interpretation"
        subtitle="Hypothesis framing, discrete intersection formulations, and non-causal observational synthesis"
        badge={<Badge variant="cobalt">Academic Analysis</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Hypothesis Framing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xs border border-stone-200 bg-[#FAF9F5] space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block">
              Descriptive Null Hypothesis (H₀)
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              Feature preference distributions are identical across the selected brand groups:
            </p>
            <KaTeXMath
              math="H_0: P(f \mid b_i) = P(f \mid b_j) \quad \forall f \in \text{Features}, \quad \forall i, j"
              block
              className="text-xs text-stone-900 font-semibold"
            />
          </div>

          <div className="p-4 rounded-xs border border-stone-200 bg-white space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-cobalt-800 block">
              Descriptive Alternative Hypothesis (H₁)
            </span>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              Feature preference distributions differ across the selected brand groups:
            </p>
            <KaTeXMath
              math="H_1: \exists f \in \text{Features}, \exists i, j \text{ such that } P(f \mid b_i) \neq P(f \mid b_j)"
              block
              className="text-xs text-cobalt-950 font-semibold"
            />
          </div>
        </div>

        {/* Dynamically Generated Descriptive Findings */}
        <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-800 block">
              Observed Descriptive Associations
            </span>
            <Badge variant="lime">
              {selectedBrands.length} Brand{selectedBrands.length > 1 ? "s" : ""} Compared
            </Badge>
          </div>

          {descriptiveNotes.length > 0 ? (
            <ul className="space-y-2 text-xs text-stone-700">
              {descriptiveNotes.map((note, index) => (
                <li
                  key={index}
                  className="rounded-md bg-white p-2.5 border border-stone-200 shadow-none flex items-start gap-2"
                >
                  <span className="text-cobalt-600 font-bold mr-0.5">&bull;</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-stone-500 italic">
              No brand data available for the current selection.
            </p>
          )}
        </div>

        {/* Methodological Guidance & Causality Guardrails */}
        <Callout
          variant="warning"
          title="Methodological Guardrail: Association vs. Causation"
        >
          These findings describe observed co-occurrences in survey responses. They do <strong>not</strong> demonstrate causal relationships (e.g. that preferring Apple causes a desire for Camera Quality, or vice versa). Furthermore, given the finite cohort sample ({result.totalCohortSize} respondents), these observational distributions illustrate discrete mathematical cross-tabulations and must <strong>not</strong> be cited as statistically significant market conclusions.
        </Callout>
      </CardContent>
    </Card>
  );
}
