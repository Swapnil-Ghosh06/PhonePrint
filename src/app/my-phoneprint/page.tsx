"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { executeMatchingEngine } from "@/lib/math/matchingEngine";
import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

import { PreferenceBuilder } from "@/components/my-phoneprint/PreferenceBuilder";
import { ExactMatchCard } from "@/components/my-phoneprint/ExactMatchCard";
import { PartialMatchBreakdown } from "@/components/my-phoneprint/PartialMatchBreakdown";
import { FeatureOverlapCard } from "@/components/my-phoneprint/FeatureOverlapCard";
import { RespondentExplorerTable } from "@/components/my-phoneprint/RespondentExplorerTable";
import { MatchingTheoryPanel } from "@/components/my-phoneprint/MatchingTheoryPanel";

export default function MyPhonePrintPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;

  // Initial default: Apple, Above ₹60,000, Camera + Battery + Build
  const [brand, setBrand] = useState<SmartphoneBrand>("Apple");
  const [budget, setBudget] = useState<BudgetRange>("Above ₹60,000");
  const [features, setFeatures] = useState<SmartphoneFeature[]>([
    "Camera Quality",
    "Battery Life",
    "Build & Design Quality",
  ]);

  const toggleFeature = (feature: SmartphoneFeature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      if (features.length < 3) {
        setFeatures([...features, feature]);
      }
    }
  };

  const resetPreferences = () => {
    setBrand("Apple");
    setBudget("Above ₹60,000");
    setFeatures([]);
  };

  const applyPreset = (preset: UserProfileInput) => {
    setBrand(preset.brand);
    setBudget(preset.budget);
    setFeatures([...preset.features]);
  };

  // Run the matching engine only when exactly 3 features are selected
  const isProfileComplete = features.length === 3;

  const matchResult = useMemo(() => {
    if (!isProfileComplete) return null;

    const profile: UserProfileInput = {
      brand,
      budget,
      features: [features[0]!, features[1]!, features[2]!],
    };

    return executeMatchingEngine(responses, profile);
  }, [responses, brand, budget, features, isProfileComplete]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        sectionCode="02"
        eyebrow="Interactive Preference Profiling"
        title="My PhonePrint: Preference Matcher"
        description="Select your target brand, budget tier, and exactly three canonical features to construct your personal PhonePrint vector. Computes exact set intersections and mutually exclusive partial matches against the student cohort."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-medium px-2.5 py-1 rounded border ${
              datasetInfo.isDemo
                ? "text-stone-700 bg-stone-100 border-stone-200"
                : "text-cobalt-800 bg-blue-50 border-blue-200"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section 1: Preference Builder */}
        <section id="builder" className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-200">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
              1. Preference Vector Formulation
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              3 Dimensions: Brand • Budget • 3 Features
            </span>
          </div>
          <PreferenceBuilder
            brand={brand}
            setBrand={setBrand}
            budget={budget}
            setBudget={setBudget}
            features={features}
            toggleFeature={toggleFeature}
            resetPreferences={resetPreferences}
            onApplyPreset={applyPreset}
          />
        </section>

        {/* Section 2: Results Dashboard (Conditioned on complete profile) */}
        {matchResult ? (
          <>
            {/* Exact Matches */}
            <section id="exact-matches" className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  2. Exact Profile Matching
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  Intersection: B ∩ P ∩ F
                </span>
              </div>
              <ExactMatchCard result={matchResult} />
            </section>

            {/* Mutually Exclusive Partial Match Breakdown */}
            <section id="partial-matches" className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  3. Mutually Exclusive Match Classification
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  Conservation: N₃ + N₂ + N₁ + N₀ = N
                </span>
              </div>
              <PartialMatchBreakdown result={matchResult} />
            </section>

            {/* Independent Feature Overlap */}
            <section id="feature-overlap" className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  4. Feature Triplet Overlap Analysis
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  Subset Size: |F* ∩ F_i| ∈ &#123;0, 1, 2, 3&#125;
                </span>
              </div>
              <FeatureOverlapCard
                featureOverlap={matchResult.featureOverlap}
                selectedFeatures={matchResult.profile.features}
                totalCohort={matchResult.totalCohort}
              />
            </section>

            {/* Respondent Explorer Table */}
            <section id="explorer" className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  5. Anonymous Respondent Explorer
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  Individual Record Evaluation
                </span>
              </div>
              <RespondentExplorerTable respondents={matchResult.respondents} />
            </section>

            {/* Discrete Mathematics Learning Foundation */}
            <section id="theory" className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-500">
                  6. Discrete Mathematics Matching Foundation
                </h2>
                <span className="text-xs text-stone-400 font-mono">
                  Formal Set Theory &amp; Partitions
                </span>
              </div>
              <MatchingTheoryPanel />
            </section>
          </>
        ) : (
          <Callout
            variant="warning"
            title="Incomplete Preference Vector"
          >
            Please select exactly three distinct features in the builder above to
            compute your PhonePrint vector and evaluate set intersections across
            the student cohort.
          </Callout>
        )}

        {/* Academic Synthesis Summary */}
        <Callout
          variant="highlight"
          title="PhonePrint Preference Analytics Summary"
        >
          My PhonePrint models user smartphone affinity as a discrete set
          intersection problem over $U$. By evaluating Brand ($B$), Budget ($P$),
          and Feature Triplet ($F$), the system demonstrates how multi-dimensional
          conjunctions partition a population into non-overlapping distance bands,
          providing mathematically rigorous insights without aggregate scalar
          approximations.
        </Callout>
      </div>
    </div>
  );
}
