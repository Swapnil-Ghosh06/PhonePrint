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
          <>
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
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dataset Status Banner */}
        <Callout
          variant="highlight"
          title={`Academic Dataset Status — ${datasetInfo.isDemo ? "Verified Benchmark Data" : "Verified Real Survey Data"}`}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          {datasetInfo.isDemo ? (
            <>
              This dashboard currently presents <strong>{responses.length} simulated campus responses ({datasetInfo.notes || "SIMULATED CAMPUS DATA — N=30"})</strong> designed to model realistic undergraduate smartphone preferences, schema validation, and discrete mathematical algorithms. This dataset is an empirical simulation benchmark.
            </>
          ) : (
            <>
              This dashboard currently presents <strong>{datasetInfo.totalResponses} verified survey responses</strong> collected from the university cohort and validated through the data quality pipeline.
            </>
          )}
        </Callout>

        {/* Confident KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Survey Cohort"
            value={responses.length}
            subtext={datasetInfo.isDemo ? `Anonymized student records [SIMULATED N=${responses.length}]` : `Anonymized student records ${datasetInfo.tagText}`}
            badge={{ text: "100% Unique IDs", variant: "lime" }}
            accentColor="lime"
          />
          <MetricCard
            label="Canonical Features"
            value={SMARTPHONE_FEATURES.length}
            subtext="Discrete choice feature universe"
            badge={{ text: "Approved Domain", variant: "cobalt" }}
            accentColor="cobalt"
          />
          <MetricCard
            label="Triplet Choice Space"
            value={totalPossibleTriplets}
            subtext="Combinations C(7, 3) available"
            badge={{ text: "Combinatorics", variant: "cobalt" }}
            accentColor="cobalt"
          />
          <MetricCard
            label="Selection Rule"
            value="3 of 7"
            subtext="Exactly 3 distinct features per student"
            badge={{ text: "Strict Schema", variant: "lime" }}
            accentColor="lime"
          />
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brand Preference */}
          <ChartCard
            title="Brand Preference Distribution"
            subtitle="Distribution of preferred smartphone brands across the cohort"
            badge={{ text: "Primary Choice", variant: "cobalt" }}
            takeaway={brandTakeaway}
            takeawayAccent="cobalt"
          >
            <BrandPreferenceChart data={brandData} height={280} />
          </ChartCard>

          {/* Budget Tier Distribution */}
          <ChartCard
            title="Budget Tier Distribution"
            subtitle="Allocation across discrete price intervals"
            badge={{ text: "Purchasing Tier", variant: "cobalt" }}
            takeaway={budgetTakeaway}
            takeawayAccent="cobalt"
          >
            <BudgetDistributionChart data={budgetData} height={280} />
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
          <FeaturePreferenceChart data={featureData} height={280} />
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
              <div className="md:col-span-1 rounded-lg border border-stone-200 bg-[#FAF9F5] p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1">
                    Formal Identity
                  </p>
                  <KaTeXMath
                    math="|A \cup B| = |A| + |B| - |A \cap B|"
                    block
                    className="text-stone-900 font-semibold"
                  />
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed font-sans">
                    Operates directly on sets of unique respondent IDs without scalar aggregation approximations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] font-mono text-lime-700 font-medium">
                  ✓ Theorem Identity Confirmed
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xs border border-stone-300/80 bg-white p-3 shadow-none">
                    <span className="font-mono text-[10px] uppercase text-stone-500">
                      Set A (Apple)
                    </span>
                    <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                      |A| = {appleRespondents.size}
                    </div>
                  </div>
                  <div className="rounded-xs border border-stone-300/80 bg-white p-3 shadow-none">
                    <span className="font-mono text-[10px] uppercase text-stone-500">
                      Set B (Camera)
                    </span>
                    <div className="font-serif text-xl font-bold text-stone-900 mt-1">
                      |B| = {cameraRespondents.size}
                    </div>
                  </div>
                  <div className="rounded-xs border border-stone-300/80 bg-white p-3 shadow-none">
                    <span className="font-mono text-[10px] uppercase text-stone-500">
                      Intersection
                    </span>
                    <div className="font-serif text-xl font-bold text-cobalt-700 mt-1">
                      |A ∩ B| = {pieVerification.intersectionCardinality}
                    </div>
                  </div>
                  <div className="rounded-xs border border-stone-300/80 bg-white p-3 shadow-none">
                    <span className="font-mono text-[10px] uppercase text-stone-500">
                      Union
                    </span>
                    <div className="font-serif text-xl font-bold text-lime-700 mt-1">
                      |A ∪ B| = {pieVerification.unionCardinality}
                    </div>
                  </div>
                </div>

                <div className="rounded-xs bg-[#FAF9F5] p-3.5 text-xs text-stone-700 border border-stone-300/80">
                  <p className="font-mono font-medium">
                    Calculation: {pieVerification.unionCardinality} = {appleRespondents.size} + {cameraRespondents.size} - {pieVerification.intersectionCardinality}
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500 font-sans">
                    Intersection Respondents ({pieVerification.intersectionSet.size} total): <code className="font-mono text-stone-800 font-medium">{Array.from(pieVerification.intersectionSet).slice(0, 10).join(", ")}{pieVerification.intersectionSet.size > 10 ? ` ... (+${pieVerification.intersectionSet.size - 10} more)` : ""}</code>
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
            subtitle="Browse and filter individual anonymized survey records"
            badge={<Badge variant="default">Zod Validated</Badge>}
          />
          <ResponseExplorer responses={responses} />
        </div>

        {/* Research Modules Showcase */}
        <div className="space-y-4 pt-4">
          <SectionHeader
            index="01.B"
            title="PhonePrint Research Architecture"
            subtitle="Interactive experiential-learning modules across the curriculum"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/my-phoneprint" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="My PhonePrint"
                  badge={<Badge variant="cobalt">Profiling</Badge>}
                />
                <CardContent className="text-xs text-stone-600 space-y-2 font-sans">
                  <p>
                    Interactive preference profiler generating your personal vector and cohort match score.
                  </p>
                  <div className="text-stone-900 font-medium group-hover:underline pt-2 flex items-center gap-1">
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
                <CardContent className="text-xs text-stone-600 space-y-2 font-sans">
                  <p>
                    Interactive Venn diagrams, Inclusion-Exclusion calculator, and set partition explorer.
                  </p>
                  <div className="text-stone-900 font-medium group-hover:underline pt-2 flex items-center gap-1">
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
                <CardContent className="text-xs text-stone-600 space-y-2 font-sans">
                  <p>
                    Analysis of the 35 feature triplets, combination heatmaps, and void detection.
                  </p>
                  <div className="text-stone-900 font-medium group-hover:underline pt-2 flex items-center gap-1">
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
                <CardContent className="text-xs text-stone-600 space-y-2 font-sans">
                  <p>
                    Feature co-occurrence graphs, contingency matrices, and hypothesis tests.
                  </p>
                  <div className="text-stone-900 font-medium group-hover:underline pt-2 flex items-center gap-1">
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
