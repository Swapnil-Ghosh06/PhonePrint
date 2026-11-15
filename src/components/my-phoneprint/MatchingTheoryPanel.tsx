"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { KaTeXMath } from "@/components/ui/KaTeXMath";

interface TheorySection {
  id: string;
  title: string;
  subtitle: string;
  formula: string;
  explanation: string;
  keyPoints: string[];
}

const THEORY_SECTIONS: TheorySection[] = [
  {
    id: "exact_intersection",
    title: "Exact Matching via Set Intersection (B ∩ P ∩ F)",
    subtitle: "Why set intersection must be used instead of adding scalar counts",
    formula: "\\text{ExactMatches} = B \\cap P \\cap F = \\{ x \\in U \\mid x \\in B \\land x \\in P \\land x \\in F \\}",
    explanation:
      "To find respondents who share your exact smartphone preference vector, we must find individuals who satisfy all three conditions simultaneously. In set theory, the logical conjunction (AND) across multiple predicates corresponds to set intersection. Calculating exact matches by adding individual counts (|B| + |P| + |F|) would erroneously sum disjoint cohorts and double-count overlaps without identifying individuals possessing all three attributes.",
    keyPoints: [
      "B = { id ∈ U | preferred_brand = brand }",
      "P = { id ∈ U | budget_range = budget }",
      "F = { id ∈ U | {f1, f2, f3} ⊆ preferred_features }",
      "ExactMatches = B ∩ P ∩ F guarantees all 3 conditions hold.",
    ],
  },
  {
    id: "mutually_exclusive",
    title: "Mutually Exclusive 4-Way Partition (8 Regions)",
    subtitle: "Decomposing the Venn universe into non-overlapping distance bands",
    formula: "U = \\text{Cat}_3 \\cup \\text{Cat}_2 \\cup \\text{Cat}_1 \\cup \\text{Cat}_0, \\quad \\sum_{k=0}^{3} |\\text{Cat}_k| = |U|",
    explanation:
      "Three arbitrary sets B, P, and F partition the universal set U into exactly 2^3 = 8 mutually exclusive regions. We group these 8 regions according to the number of satisfied conditions k ∈ {0, 1, 2, 3}, producing a conservation law where every respondent is classified into exactly one category without omission or duplicate counting.",
    keyPoints: [
      "Category 3 (C(3,3) = 1 region): B ∩ P ∩ F (Exact Match)",
      "Category 2 (C(3,2) = 3 regions): (B ∩ P) \\ F, (B ∩ F) \\ P, (P ∩ F) \\ B",
      "Category 1 (C(3,1) = 3 regions): B \\ (P ∪ F), P \\ (B ∪ F), F \\ (B ∪ P)",
      "Category 0 (C(3,0) = 1 region): U \\ (B ∪ P ∪ F)",
    ],
  },
  {
    id: "denominator_integrity",
    title: "Denominator & Percentage Integrity",
    subtitle: "Grounding all proportions in the full survey cohort N",
    formula: "\\text{Percentage}(\\text{Cat}_k) = \\frac{|\\text{Cat}_k|}{|U|} \\times 100\\%, \\quad \\sum_{k=0}^{3} \\text{Percentage}(\\text{Cat}_k) = 100\\%",
    explanation:
      "In discrete survey analytics, exact and partial match proportions must always use the full cohort size |U| (N = 30) as their denominator. Dividing by intermediate subsets (like |B| or |P|) would represent conditional probabilities rather than full-cohort preference prevalence.",
    keyPoints: [
      "Strict cohort denominator N = |U| = 30.",
      "Exact match share: |B ∩ P ∩ F| / N * 100%.",
      "Conservation property guarantees percentages sum to 100%.",
      "Division-by-zero protection ensures graceful handling of empty cohorts.",
    ],
  },
];

export function MatchingTheoryPanel() {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    "exact_intersection"
  );

  const activeSection =
    THEORY_SECTIONS.find((s) => s.id === activeSectionId) ??
    THEORY_SECTIONS[0]!;

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Discrete Mathematics Matching Foundation"
        subtitle="Mathematical justification for set intersections, 8-region partitions, and denominator integrity"
        badge={<Badge variant="cobalt">Formal Theory</Badge>}
      />
      <CardContent className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-stone-200/80 pb-3">
          {THEORY_SECTIONS.map((section) => {
            const isActive = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white shadow-none"
                    : "bg-white hover:bg-stone-100 text-stone-800 border border-stone-300/80"
                }`}
              >
                {section.title.split(" (")[0]}
              </button>
            );
          })}
        </div>

        {/* Active Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 font-sans">
              {activeSection.title}
            </h3>
            <p className="text-xs text-stone-500 font-sans">{activeSection.subtitle}</p>
          </div>

          {/* Formula Display */}
          <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1 font-bold">
              [ SET-THEORETIC FORMULATION ]
            </span>
            <KaTeXMath
              math={activeSection.formula}
              block
              className="text-stone-900 text-sm font-medium"
            />
          </div>

          {/* Explanation */}
          <div className="text-xs text-stone-700 leading-relaxed space-y-1 font-sans">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] font-mono">
              {"//"} Mathematical Reasoning:
            </h4>
            <p>{activeSection.explanation}</p>
          </div>

          {/* Key Invariants */}
          <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block font-bold">
              [ CORE INVARIANT PROPERTIES ]
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700 font-sans">
              {activeSection.keyPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="rounded-xs bg-white p-2.5 border border-stone-300/80 shadow-none flex items-start gap-1.5 font-medium"
                >
                  <span className="text-stone-400 font-bold mr-1">&bull;</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
