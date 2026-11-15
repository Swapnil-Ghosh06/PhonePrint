"use client";

import React from "react";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { Badge } from "@/components/ui/Badge";
import type { ActiveOperation } from "./SetOperationsToolbar";

export interface EducationalCardProps {
  operation: ActiveOperation;
  setAName: string;
  setBName: string;
  setCName?: string;
  resultCount: number;
  totalUniverse: number;
}

interface DefinitionMeta {
  title: string;
  math: string;
  plainEnglish: string;
  properties: string[];
}

const DEFINITIONS: Record<ActiveOperation, (a: string, b: string, c?: string) => DefinitionMeta> = {
  union: (a, b) => ({
    title: "Set Union (A ∪ B)",
    math: "A \\cup B = \\{ x \\in U \\mid x \\in A \\lor x \\in B \\}",
    plainEnglish: `Contains every respondent who chose ${a}, or chose ${b}, or chose both. Elements belonging to both cohorts are listed without duplicate counting.`,
    properties: ["Commutative: A ∪ B = B ∪ A", "Associative: (A ∪ B) ∪ C = A ∪ (B ∪ C)", "Identity: A ∪ ∅ = A"],
  }),
  intersection: (a, b) => ({
    title: "Set Intersection (A ∩ B)",
    math: "A \\cap B = \\{ x \\in U \\mid x \\in A \\land x \\in B \\}",
    plainEnglish: `Contains strictly the respondents who simultaneously selected ${a} AND selected ${b}. If no student matches both criteria, the intersection is the empty set (∅).`,
    properties: ["Commutative: A ∩ B = B ∩ A", "Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)", "Domination: A ∩ ∅ = ∅"],
  }),
  diff_ab: (a, b) => ({
    title: "Relative Complement / Difference (A \\ B)",
    math: "A \\setminus B = \\{ x \\in U \\mid x \\in A \\land x \\notin B \\}",
    plainEnglish: `Contains respondents who chose ${a}, but did NOT choose ${b}. This isolates preferences specific to cohort A without influence from cohort B.`,
    properties: ["Non-commutative: A \\ B ≠ B \\ A (in general)", "A \\ B = A ∩ Bᶜ", "A \\ ∅ = A, A \\ A = ∅"],
  }),
  diff_ba: (a, b) => ({
    title: "Relative Complement / Difference (B \\ A)",
    math: "B \\setminus A = \\{ x \\in U \\mid x \\in B \\land x \\notin A \\}",
    plainEnglish: `Contains respondents who chose ${b}, but did NOT choose ${a}. This isolates preferences unique to cohort B.`,
    properties: ["Non-commutative: B \\ A ≠ A \\ B", "B \\ A = B ∩ Aᶜ", "Disjoint from A \\ B"],
  }),
  sym_diff: (a, b) => ({
    title: "Symmetric Difference (A Δ B)",
    math: "A \\mathbin{\\Delta} B = (A \\setminus B) \\cup (B \\setminus A) = \\{ x \\in U \\mid (x \\in A \\oplus x \\in B) \\}",
    plainEnglish: `Contains respondents who belong to either ${a} or ${b}, but NOT both. This is the exact set-theoretic equivalent of the XOR (exclusive-OR) logical operator.`,
    properties: ["Commutative: A Δ B = B Δ A", "A Δ B = (A ∪ B) \\ (A ∩ B)", "Self-inverse: A Δ A = ∅"],
  }),
  comp_a: (a) => ({
    title: "Absolute Complement (Aᶜ)",
    math: "A^c = U \\setminus A = \\{ x \\in U \\mid x \\notin A \\}",
    plainEnglish: `Contains all respondents in the university cohort who did NOT select ${a}. The complement is always defined relative to the universal set U.`,
    properties: ["Double Complement: (Aᶜ)ᶜ = A", "Complementarity: A ∪ Aᶜ = U and A ∩ Aᶜ = ∅", "De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ"],
  }),
  comp_b: (_a, b) => ({
    title: "Absolute Complement (Bᶜ)",
    math: "B^c = U \\setminus B = \\{ x \\in U \\mid x \\notin B \\}",
    plainEnglish: `Contains all respondents in the cohort who did NOT select ${b}.`,
    properties: ["Double Complement: (Bᶜ)ᶜ = B", "Complementarity: B ∪ Bᶜ = U and B ∩ Bᶜ = ∅", "De Morgan: (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ"],
  }),
  neither: (a, b) => ({
    title: "Neither Set / Complement of Union",
    math: "(A \\cup B)^c = U \\setminus (A \\cup B) = A^c \\cap B^c",
    plainEnglish: `Contains respondents who chose neither ${a} nor ${b}. By De Morgan's Law, this region is identical to the intersection of their individual complements.`,
    properties: ["De Morgan's First Law: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ", "Cardinality: |(A ∪ B)ᶜ| = |U| - |A ∪ B|", "Exterior Venn region"],
  }),
  subset_ab: (a, b) => ({
    title: "Subset Inclusion Predicate (A ⊆ B)",
    math: "A \\subseteq B \\iff \\forall x \\in U \\, (x \\in A \\implies x \\in B) \\iff A \\setminus B = \\emptyset",
    plainEnglish: `Tests whether every respondent who selected ${a} also selected ${b}. In discrete data, A ⊆ B holds if and only if the difference set A \\ B is empty.`,
    properties: ["Reflexive: A ⊆ A", "Antisymmetric: (A ⊆ B ∧ B ⊆ A) ⟹ A = B", "Transitive: (A ⊆ B ∧ B ⊆ C) ⟹ A ⊆ C"],
  }),
  disjoint_ab: (a, b) => ({
    title: "Set Disjointness Predicate (A ∩ B = ∅)",
    math: "A \\text{ and } B \\text{ disjoint} \\iff A \\cap B = \\emptyset \\iff |A \\cup B| = |A| + |B|",
    plainEnglish: `Tests whether cohorts ${a} and ${b} are completely mutually exclusive. When two sets are disjoint, their union cardinality equals the simple sum of their individual sizes.`,
    properties: ["No shared elements", "Simplified PIE: |A ∪ B| = |A| + |B|", "Empty intersection: |A ∩ B| = 0"],
  }),
  union_abc: (a, b, c) => ({
    title: "Triple Union (A ∪ B ∪ C)",
    math: "A \\cup B \\cup C = \\{ x \\in U \\mid x \\in A \\lor x \\in B \\lor x \\in C \\}",
    plainEnglish: `Contains respondents who selected at least one of ${a}, ${b}, or ${c || "Set C"}.`,
    properties: ["Associative & Commutative", "Evaluated via 3-Set PIE", "Conserves individual set elements"],
  }),
  inter_abc: (a, b, c) => ({
    title: "Triple Intersection (A ∩ B ∩ C)",
    math: "A \\cap B \\cap C = \\{ x \\in U \\mid x \\in A \\land x \\in B \\land x \\in C \\}",
    plainEnglish: `Contains strictly respondents who simultaneously chose all three: ${a}, ${b}, AND ${c || "Set C"}. Represents the central core region in a 3-set Venn diagram.`,
    properties: ["Central Venn region", "Highest constraint specificity", "Subset of all pairwise intersections"],
  }),
  inter_ab: (a, b) => ({
    title: "Pairwise Intersection: A ∩ B",
    math: "A \\cap B = \\{ x \\in U \\mid x \\in A \\land x \\in B \\}",
    plainEnglish: `Contains respondents who selected both ${a} and ${b}, regardless of their choice for Set C.`,
    properties: ["Includes central triple intersection", "Subtracted in 3-set PIE step 2", "Pairwise overlap cohort"],
  }),
  inter_ac: (a, _b, c) => ({
    title: "Pairwise Intersection: A ∩ C",
    math: "A \\cap C = \\{ x \\in U \\mid x \\in A \\land x \\in C \\}",
    plainEnglish: `Contains respondents who selected both ${a} and ${c || "Set C"}, regardless of their choice for Set B.`,
    properties: ["Includes central triple intersection", "Subtracted in 3-set PIE step 2", "Pairwise overlap cohort"],
  }),
  inter_bc: (_a, b, c) => ({
    title: "Pairwise Intersection: B ∩ C",
    math: "B \\cap C = \\{ x \\in U \\mid x \\in B \\land x \\in C \\}",
    plainEnglish: `Contains respondents who selected both ${b} and ${c || "Set C"}, regardless of their choice for Set A.`,
    properties: ["Includes central triple intersection", "Subtracted in 3-set PIE step 2", "Pairwise overlap cohort"],
  }),
  only_a: (a) => ({
    title: "Region 1: A Only",
    math: "A \\setminus (B \\cup C) = A \\cap B^c \\cap C^c",
    plainEnglish: `Contains respondents who chose ${a}, but chose NEITHER Set B NOR Set C.`,
    properties: ["Disjoint from B and C", "1 of the 8 canonical Venn regions", "Pure single-trait cohort"],
  }),
  only_b: (_a, b) => ({
    title: "Region 2: B Only",
    math: "B \\setminus (A \\cup C) = B \\cap A^c \\cap C^c",
    plainEnglish: `Contains respondents who chose ${b}, but chose NEITHER Set A NOR Set C.`,
    properties: ["Disjoint from A and C", "1 of the 8 canonical Venn regions", "Pure single-trait cohort"],
  }),
  only_c: (_a, _b, c) => ({
    title: "Region 3: C Only",
    math: "C \\setminus (A \\cup B) = C \\cap A^c \\cap B^c",
    plainEnglish: `Contains respondents who chose ${c || "Set C"}, but chose NEITHER Set A NOR Set B.`,
    properties: ["Disjoint from A and B", "1 of the 8 canonical Venn regions", "Pure single-trait cohort"],
  }),
  only_ab: (a, b) => ({
    title: "Region 4: AB Only",
    math: "(A \\cap B) \\setminus C = A \\cap B \\cap C^c",
    plainEnglish: `Contains respondents who chose both ${a} and ${b}, but specifically did NOT choose Set C.`,
    properties: ["2-trait specific overlap", "Disjoint from triple intersection", "1 of the 8 canonical Venn regions"],
  }),
  only_ac: (a, _b, c) => ({
    title: "Region 5: AC Only",
    math: "(A \\cap C) \\setminus B = A \\cap C \\cap B^c",
    plainEnglish: `Contains respondents who chose both ${a} and ${c || "Set C"}, but specifically did NOT choose Set B.`,
    properties: ["2-trait specific overlap", "Disjoint from triple intersection", "1 of the 8 canonical Venn regions"],
  }),
  only_bc: (_a, b, c) => ({
    title: "Region 6: BC Only",
    math: "(B \\cap C) \\setminus A = B \\cap C \\cap A^c",
    plainEnglish: `Contains respondents who chose both ${b} and ${c || "Set C"}, but specifically did NOT choose Set A.`,
    properties: ["2-trait specific overlap", "Disjoint from triple intersection", "1 of the 8 canonical Venn regions"],
  }),
  outside_abc: () => ({
    title: "Region 8: Outside All Three",
    math: "(A \\cup B \\cup C)^c = A^c \\cap B^c \\cap C^c",
    plainEnglish: `Contains respondents who chose NONE of the three active sets.`,
    properties: ["Exterior Venn region", "Complement of triple union", "Completes partition of U to 100%"],
  }),
};

export function EducationalCard({
  operation,
  setAName,
  setBName,
  setCName,
  resultCount,
  totalUniverse,
}: EducationalCardProps) {
  const getDef = DEFINITIONS[operation] || DEFINITIONS.intersection;
  const def = getDef(setAName, setBName, setCName);

  return (
    <div className="rounded-xs border border-stone-300/80 bg-white p-5 shadow-none text-stone-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
            Set Theoretic Definition &amp; Theory
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-stone-900 mt-0.5 font-sans">
            {def.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cobalt">Formal Identity</Badge>
          <span className="font-mono text-xs font-semibold text-stone-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
            n = {resultCount} / {totalUniverse}
          </span>
        </div>
      </div>

      {/* KaTeX Mathematical Notation */}
      <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-3 text-center">
        <KaTeXMath math={def.math} block className="text-stone-900 font-bold text-xs sm:text-sm" />
      </div>

      {/* Plain-English Explanation */}
      <div className="space-y-1 text-xs text-stone-700 leading-relaxed font-sans">
        <span className="font-semibold text-stone-900 uppercase text-[10px] tracking-wider block font-mono">
          Intuitive Explanation:
        </span>
        <p>{def.plainEnglish}</p>
      </div>

      {/* Mathematical Properties */}
      <div className="border-t border-stone-200/80 pt-3">
        <span className="font-semibold text-stone-900 uppercase text-[10px] tracking-wider block mb-2 font-mono">
          Discrete Mathematical Properties:
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-700 font-mono">
          {def.properties.map((prop, i) => (
            <li key={i} className="flex items-center gap-1.5 bg-[#FAF9F5] p-2 rounded-md border border-stone-200">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400 flex-shrink-0" />
              <span>{prop}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
