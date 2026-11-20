"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { analyzeFeatureCombinations } from "@/lib/data/combinationAnalytics";
import type { FeatureCombinationRecord } from "@/types/math";

import { CombinationCalculator } from "@/components/combolab/CombinationCalculator";
import { PermutationVsCombination } from "@/components/combolab/PermutationVsCombination";
import { FeatureCombinationExplorer } from "@/components/combolab/FeatureCombinationExplorer";
import { CombinationFrequencyAnalysis } from "@/components/combolab/CombinationFrequencyAnalysis";
import { BudgetCombinationAnalysis } from "@/components/combolab/BudgetCombinationAnalysis";
import { CombinatoricsLearningPanel } from "@/components/combolab/CombinatoricsLearningPanel";
import { CombinationDetailModal } from "@/components/combolab/CombinationDetailModal";

type ActiveTab =
  | "all"
  | "calculator"
  | "permutations"
  | "explorer"
  | "frequency"
  | "budget"
  | "theory";

export default function ComboLabPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;
  const analytics = useMemo(
    () => analyzeFeatureCombinations(responses),
    [responses]
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [selectedCombination, setSelectedCombination] =
    useState<FeatureCombinationRecord | null>(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        sectionCode="04"
        eyebrow="Discrete Mathematics & Combinatorics"
        title="ComboLab: Combinatorial Feature Space"
        description="Interactive laboratory exploring binomial coefficients C(n, r), permutations P(n, r), and empirical survey frequencies. Analyzes the discrete space of C(7, 3) = 35 theoretical triplets from the 7 canonical smartphone features."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                &larr; SetLab
              </Button>
            </Link>
            <Link href="/experiment-studio">
              <Button variant="primary" size="sm">
                Experiment Studio &rarr;
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Presentation Infographic Spotlight */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/90 shadow-[0_12px_36px_rgb(0,0,0,0.05)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                PRESENTATION ESSENTIAL · FEATURE COMBINATORICS
              </span>
              <h2 className="text-xl sm:text-2xl font-sora font-extrabold text-slate-900 tracking-tight">
                Why Order Does Not Matter: C(7,3) vs P(7,3)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                When consumers choose mobile phone features, selecting (Battery, Camera, Display) represents the exact same preference profile as (Display, Camera, Battery). Thus, we model the market using <strong>Combinations C(7,3) = 35</strong> rather than <strong>Permutations P(7,3) = 210</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="glass-panel rounded-2xl p-4 border border-white/90 text-center min-w-[120px]">
                <span className="text-[11px] font-montserrat uppercase text-slate-500 font-semibold">
                  Triplets
                </span>
                <span className="font-sora text-3xl font-extrabold text-blue-600 mt-1 block">
                  35
                </span>
                <span className="text-[10px] font-montserrat text-slate-400">
                  Feature Bundles
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-4 border border-white/90 text-center min-w-[120px]">
                <span className="text-[11px] font-montserrat uppercase text-slate-500 font-semibold">
                  Observed
                </span>
                <span className="font-sora text-3xl font-extrabold text-emerald-600 mt-1 block">
                  {analytics.totalObservedCombinations}
                </span>
                <span className="text-[10px] font-montserrat text-slate-400">
                  Active in Survey
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation / Focus Tabs */}
        <div className="glass-panel rounded-2xl p-1.5 border border-white/80 shadow-sm flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "all"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            All Modules Overview
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "calculator"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            nCr Calculator
          </button>
          <button
            onClick={() => setActiveTab("permutations")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "permutations"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            Permutations vs Combinations
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "explorer"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            35-Triplet Space Explorer
          </button>
          <button
            onClick={() => setActiveTab("frequency")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "frequency"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            Frequency Ranking &amp; Voids
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "budget"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            Budget Stratification
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-montserrat transition-all duration-200 ${
              activeTab === "theory"
                ? "bg-white text-blue-600 font-semibold shadow-sm border border-blue-100/60"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
            }`}
          >
            Pedagogical Theory
          </button>
        </div>

        {/* Content based on selected tab */}
        {(activeTab === "all" || activeTab === "calculator") && (
          <section className="space-y-4">
            <CombinationCalculator />
          </section>
        )}

        {(activeTab === "all" || activeTab === "permutations") && (
          <section className="space-y-4">
            <PermutationVsCombination />
          </section>
        )}

        {(activeTab === "all" || activeTab === "explorer") && (
          <section className="space-y-4">
            <FeatureCombinationExplorer
              combinations={analytics.combinations}
              totalRespondents={responses.length}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {(activeTab === "all" || activeTab === "frequency") && (
          <section className="space-y-4">
            <CombinationFrequencyAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {(activeTab === "all" || activeTab === "budget") && (
          <section className="space-y-4">
            <BudgetCombinationAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {(activeTab === "all" || activeTab === "theory") && (
          <section className="space-y-4">
            <CombinatoricsLearningPanel />
          </section>
        )}

        {/* Detail Modal for Selected Combination */}
        {selectedCombination && (
          <CombinationDetailModal
            combination={selectedCombination}
            allResponses={responses}
            onClose={() => setSelectedCombination(null)}
          />
        )}
      </div>
    </div>
  );
}
