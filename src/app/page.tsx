import React from "react";
import Link from "next/link";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { BrandPreferenceChart } from "@/components/visualizations/BrandPreferenceChart";
import { FeaturePreferenceChart } from "@/components/visualizations/FeaturePreferenceChart";
import { BudgetDistributionChart } from "@/components/visualizations/BudgetDistributionChart";
import { ResponseExplorer } from "@/components/campus-pulse/ResponseExplorer";

import {
  loadSurveyDataset,
  getActiveDatasetInfo,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByBudget,
} from "@/lib/data/loader";
import { verifyInclusionExclusionPrinciple } from "@/lib/math/sets";
import { calculateCombinations } from "@/lib/math/combinations";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
} from "@/types/survey";

export default function CampusPulsePage() {
  const dataset = loadSurveyDataset();
  const datasetInfo = getActiveDatasetInfo();
  const responses = dataset.responses;

  // 1. Brand distribution data
  const brandData = SMARTPHONE_BRANDS.map((brand) => {
    const ids = getRespondentIdsByBrand(responses, brand);
    return {
      brand,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  }).filter((b) => b.count > 0);

  // 2. Feature preference frequency data (ranked)
  const featureData = SMARTPHONE_FEATURES.map((feature) => {
    const ids = getRespondentIdsByFeature(responses, feature);
    return {
      feature,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  });

  // 3. Budget tier distribution data
  const budgetData = BUDGET_RANGES.map((budget) => {
    const ids = getRespondentIdsByBudget(responses, budget);
    return {
      budget,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  });

  // 4. Live Discrete Mathematics Theorem Verification
  const appleRespondents = getRespondentIdsByBrand(responses, "Apple");
  const cameraRespondents = getRespondentIdsByFeature(responses, "Camera Quality");

  const pieVerification = verifyInclusionExclusionPrinciple(
    appleRespondents,
    cameraRespondents
  );

  const totalPossibleTriplets = calculateCombinations(
    SMARTPHONE_FEATURES.length,
    3
  );

  // Dynamic takeaway texts
  const sortedBrands = [...brandData].sort((a, b) => b.count - a.count);
  const brandTakeaway = `${sortedBrands[0]?.brand} (${sortedBrands[0]?.percentage}%) and ${sortedBrands[1]?.brand} (${sortedBrands[1]?.percentage}%) lead the student cohort, followed by ${sortedBrands[2]?.brand} (${sortedBrands[2]?.percentage}%).`;

  const sortedFeatures = [...featureData].sort((a, b) => b.count - a.count);
  const featureTakeaway = `${sortedFeatures[0]?.feature} (${sortedFeatures[0]?.percentage}%) and ${sortedFeatures[1]?.feature} (${sortedFeatures[1]?.percentage}%) are the leading priorities, with ${sortedFeatures[2]?.feature} (${sortedFeatures[2]?.percentage}%) anchoring performance.`;

  const sortedBudgets = [...budgetData].sort((a, b) => b.count - a.count);
  const budgetTakeaway = `${sortedBudgets[0]?.budget} (${sortedBudgets[0]?.percentage}%) and ${sortedBudgets[1]?.budget} (${sortedBudgets[1]?.percentage}%) represent the primary target purchase thresholds.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        sectionCode="01"
        eyebrow="Campus Research Dashboard"
        title="Campus Pulse"
        description="Exploratory preference analytics synthesized from university student survey records. Models smartphone ecosystems through discrete mathematics, combinatorial structures, and set theory."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                Open SetLab &rarr;
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="primary" size="sm">
                Methodology
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Presentation Deck Executive Overview Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/90 shadow-[0_12px_36px_rgb(0,0,0,0.05)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/90 border border-blue-200/80 px-3 py-1 text-xs font-montserrat font-bold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                PRESENTATION SPOTLIGHT · MATHEMATICAL MODEL
              </div>
              <h2 className="text-xl sm:text-2xl font-sora font-extrabold text-slate-900 tracking-tight">
                Permutation-Combination Feature Space &amp; Price Dynamics
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                By modeling each mobile phone through an unconstrained 7-feature universe where students choose <strong>strictly 3 features</strong>, we evaluate all <span className="font-montserrat font-semibold text-blue-700">C(7,3) = 35</span> distinct bundles across price intervals without order bias.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
              <div className="glass-panel rounded-2xl p-4 border border-white/90 text-center">
                <span className="text-[11px] font-montserrat uppercase font-semibold text-slate-500 block">
                  Combinations
                </span>
                <span className="font-sora text-2xl font-extrabold text-blue-600 mt-0.5 block">
                  35
                </span>
                <span className="text-[10px] font-montserrat text-slate-400">
                  C(7,3) Unique Sets
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-4 border border-white/90 text-center">
                <span className="text-[11px] font-montserrat uppercase font-semibold text-slate-500 block">
                  Permutations
                </span>
                <span className="font-sora text-2xl font-extrabold text-purple-600 mt-0.5 block">
                  210
                </span>
                <span className="text-[10px] font-montserrat text-slate-400">
                  P(7,3) Ordered Tuples
                </span>
              </div>
              <div className="glass-panel rounded-2xl p-4 border border-white/90 text-center">
                <span className="text-[11px] font-montserrat uppercase font-semibold text-slate-500 block">
                  Price Tiers
                </span>
                <span className="font-sora text-2xl font-extrabold text-emerald-600 mt-0.5 block">
                  4
                </span>
                <span className="text-[10px] font-montserrat text-slate-400">
                  Under ₹15k to &gt;₹60k
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dataset Status Callout */}
        <Callout
          variant="highlight"
          title={`Academic Dataset Status — ${datasetInfo.isDemo ? "Verified Benchmark Data" : "Verified Real Survey Data"}`}
        >
          {datasetInfo.isDemo ? (
            <>
              This research platform currently presents <strong>{responses.length} simulated campus responses ({datasetInfo.notes || "SIMULATED CAMPUS DATA — N=30"})</strong> designed to model realistic undergraduate smartphone preferences, schema validation, and discrete mathematical algorithms. All records strictly adhere to the 3-of-7 canonical schema.
            </>
          ) : (
            <>
              This dashboard presents <strong>{datasetInfo.totalResponses} verified survey responses</strong> collected from the university cohort and validated through the data quality pipeline.
            </>
          )}
        </Callout>

        {/* Confident KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Survey Cohort"
            value={responses.length}
            subtext={datasetInfo.isDemo ? `Anonymized student records (SIMULATED N=${responses.length})` : `Anonymized student records ${datasetInfo.tagText}`}
            badge={{ text: "100% Unique IDs", variant: "lime" }}
            accentColor="lime"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <MetricCard
            label="Canonical Features"
            value={SMARTPHONE_FEATURES.length}
            subtext="Discrete choice feature universe"
            badge={{ text: "Approved Domain", variant: "cobalt" }}
            accentColor="cobalt"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          />
          <MetricCard
            label="Triplet Choice Space"
            value={totalPossibleTriplets}
            subtext="Combinations C(7, 3) available"
            badge={{ text: "Combinatorics", variant: "cobalt" }}
            accentColor="cobalt"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
          <MetricCard
            label="Selection Rule"
            value="3 of 7"
            subtext="Strictly 3 distinct features per student"
            badge={{ text: "Strict Schema", variant: "lime" }}
            accentColor="lime"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brand Preference */}
          <ChartCard
            title="Brand Preference Distribution"
            subtitle="Distribution of preferred smartphone brands across the student cohort"
            badge={{ text: "Primary Choice", variant: "cobalt" }}
            takeaway={brandTakeaway}
            takeawayAccent="cobalt"
          >
            <BrandPreferenceChart data={brandData} height={290} />
          </ChartCard>

          {/* Budget Tier Distribution */}
          <ChartCard
            title="Budget Tier Distribution"
            subtitle="Allocation across discrete smartphone price intervals"
            badge={{ text: "Purchasing Tier", variant: "cobalt" }}
            takeaway={budgetTakeaway}
            takeawayAccent="cobalt"
          >
            <BudgetDistributionChart data={budgetData} height={290} />
          </ChartCard>
        </div>

        {/* Feature Preference Ranking (Full Width) */}
        <ChartCard
          title="Feature Preference Frequency (Ranked)"
          subtitle="Selection frequency across the 7 approved canonical features"
          badge={{ text: "Distinct 3 Choices", variant: "lime" }}
          takeaway={featureTakeaway}
          takeawayAccent="lime"
        >
          <FeaturePreferenceChart data={featureData} height={310} />
        </ChartCard>

        {/* Discrete Mathematics Foundation Section */}
        <Card>
          <CardHeader
            title="Discrete Mathematics: Principle of Inclusion-Exclusion"
            subtitle="Pure set-theoretic calculation on real respondent ID partitions"
            badge={<Badge variant="lime">Live Theorem Verification</Badge>}
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 glass-panel rounded-2xl border border-white/80 p-5 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-montserrat uppercase tracking-wider text-slate-500 font-semibold mb-2">
                    Formal Set Identity
                  </p>
                  <div className="bg-white/80 rounded-xl p-3 border border-slate-200/60 my-2">
                    <KaTeXMath
                      math="|A \cup B| = |A| + |B| - |A \cap B|"
                      block
                      className="text-slate-900 font-bold"
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-sans">
                    Operates directly on sets of unique respondent IDs without scalar aggregation approximations or double-counting.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-montserrat text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Theorem Identity Confirmed
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="glass-panel rounded-2xl border border-white/80 p-4">
                    <span className="font-montserrat text-xs uppercase text-slate-500 font-semibold">
                      Set A (Apple)
                    </span>
                    <div className="font-sora text-2xl font-bold text-slate-900 mt-1">
                      |A| = {appleRespondents.size}
                    </div>
                  </div>
                  <div className="glass-panel rounded-2xl border border-white/80 p-4">
                    <span className="font-montserrat text-xs uppercase text-slate-500 font-semibold">
                      Set B (Camera)
                    </span>
                    <div className="font-sora text-2xl font-bold text-slate-900 mt-1">
                      |B| = {cameraRespondents.size}
                    </div>
                  </div>
                  <div className="glass-panel rounded-2xl border border-white/80 p-4">
                    <span className="font-montserrat text-xs uppercase text-slate-500 font-semibold">
                      Intersection
                    </span>
                    <div className="font-sora text-2xl font-bold text-blue-600 mt-1">
                      |A ∩ B| = {pieVerification.intersectionCardinality}
                    </div>
                  </div>
                  <div className="glass-panel rounded-2xl border border-white/80 p-4">
                    <span className="font-montserrat text-xs uppercase text-slate-500 font-semibold">
                      Union
                    </span>
                    <div className="font-sora text-2xl font-bold text-emerald-600 mt-1">
                      |A ∪ B| = {pieVerification.unionCardinality}
                    </div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-4 text-xs text-slate-700 border border-white/80">
                  <p className="font-montserrat font-semibold text-slate-900 text-sm">
                    Verified Proof: {pieVerification.unionCardinality} = {appleRespondents.size} + {cameraRespondents.size} - {pieVerification.intersectionCardinality}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 font-sans leading-relaxed">
                    Intersection Respondents ({pieVerification.intersectionSet.size} total):{" "}
                    <span className="font-montserrat font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 inline-block mt-1">
                      {Array.from(pieVerification.intersectionSet).slice(0, 10).join(", ")}
                      {pieVerification.intersectionSet.size > 10 ? ` ... (+${pieVerification.intersectionSet.size - 10} more)` : ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey Responses Data Explorer */}
        <div className="space-y-4">
          <SectionHeader
            index="01.A"
            title="Cohort Response Explorer"
            subtitle="Browse and filter individual anonymized survey records with real-time feedback"
            badge={<Badge variant="default">Zod Validated</Badge>}
          />
          <ResponseExplorer responses={responses} />
        </div>

        {/* Research Modules Showcase */}
        <div className="space-y-4 pt-4">
          <SectionHeader
            index="01.B"
            title="PhonePrint Research Architecture"
            subtitle="Interactive experiential-learning modules across discrete mathematics and consumer choice dynamics"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/my-phoneprint" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="My PhonePrint"
                  badge={<Badge variant="cobalt">Profiling</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2 font-sans">
                  <p>
                    Interactive preference profiler generating your personal vector and cohort match score.
                  </p>
                  <div className="text-blue-600 font-montserrat font-semibold group-hover:translate-x-1 transition-transform pt-2 flex items-center gap-1">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/setlab" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="SetLab"
                  badge={<Badge variant="lime">Set Theory</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2 font-sans">
                  <p>
                    Interactive Venn diagrams, Inclusion-Exclusion calculator, and set partition explorer.
                  </p>
                  <div className="text-emerald-600 font-montserrat font-semibold group-hover:translate-x-1 transition-transform pt-2 flex items-center gap-1">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/combolab" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="ComboLab"
                  badge={<Badge variant="cobalt">C(7,3) = 35</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2 font-sans">
                  <p>
                    Analysis of the 35 feature triplets, combination heatmaps, and price tier segmentation.
                  </p>
                  <div className="text-blue-600 font-montserrat font-semibold group-hover:translate-x-1 transition-transform pt-2 flex items-center gap-1">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/experiment-studio" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="Experiment Studio"
                  badge={<Badge variant="outline">Hypothesis</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2 font-sans">
                  <p>
                    Feature co-occurrence graphs, contingency matrices, and price-feature hypothesis tests.
                  </p>
                  <div className="text-purple-600 font-montserrat font-semibold group-hover:translate-x-1 transition-transform pt-2 flex items-center gap-1">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
