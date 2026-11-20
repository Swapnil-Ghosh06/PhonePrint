import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { getActiveDatasetInfo } from "@/lib/data/loader";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
} from "@/types/survey";

export default function MethodologyPage() {
  const datasetInfo = getActiveDatasetInfo();

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        sectionCode="06"
        eyebrow="Academic Research Framework"
        title="Methodology & Data Architecture"
        description="Formal documentation of the survey design, discrete mathematical foundations, validation schemas, and offline data pipeline."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "cobalt" : "lime" }}
        actions={
          <Link href="/">
            <Button variant="outline" size="sm">
              &larr; Back to Campus Pulse
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Core Constraints Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Approved 7-Feature Canonical Domain"
              subtitle="Uniform discrete domain for all survey choices"
              badge={<Badge variant="lime">Approved Domain</Badge>}
            />
            <CardContent>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-stone-700 font-sans">
                {SMARTPHONE_FEATURES.map((feature, i) => (
                  <li key={i} className="font-medium">
                    {feature}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[11px] text-stone-500 border-t border-stone-200/80 pt-3 font-sans">
                Each respondent selects <strong>exactly three distinct features</strong>. Non-distinct choices or counts other than three fail Zod schema validation and Python preprocessing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Mathematical Foundations"
              subtitle="Implemented in pure TypeScript modules decoupled from UI"
              badge={<Badge variant="cobalt">Pure Mathematics</Badge>}
            />
            <CardContent className="space-y-3 text-xs text-stone-700">
              <div>
                <p className="font-semibold text-stone-900 font-sans">
                  1. Principle of Inclusion-Exclusion (PIE)
                </p>
                <KaTeXMath
                  math="|A \cup B| = |A| + |B| - |A \cap B|"
                  block
                  className="text-cobalt-700 font-semibold"
                />
              </div>
              <div>
                <p className="font-semibold text-stone-900 font-sans">
                  2. Combinatorial Feature Space
                </p>
                <KaTeXMath
                  math="\binom{n}{r} = \binom{7}{3} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35"
                  block
                  className="text-cobalt-700 font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Survey Data Fields Specification */}
        <Card>
          <CardHeader
            title="Survey Data Model Specification"
            subtitle="Six discrete attributes recorded per participant"
          />
          <CardContent>
            <div className="overflow-x-auto glass-panel rounded-2xl border border-white/80 shadow-sm">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-white/50 border-b border-slate-200/60 text-slate-500 font-montserrat uppercase text-[11px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Field</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Allowed Domain / Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-montserrat font-semibold text-slate-900">response_id</td>
                    <td className="py-3 px-4 font-montserrat text-xs text-blue-600">string</td>
                    <td className="py-3 px-4">Unique alphanumeric identifier (e.g. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-montserrat text-[11px]">RESP_001</code>). Duplicate IDs strictly rejected.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-montserrat font-semibold text-slate-900">preferred_brand</td>
                    <td className="py-3 px-4 font-montserrat text-xs text-blue-600">enum</td>
                    <td className="py-3 px-4">{SMARTPHONE_BRANDS.join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-montserrat font-semibold text-slate-900">budget_range</td>
                    <td className="py-3 px-4 font-montserrat text-xs text-blue-600">enum</td>
                    <td className="py-3 px-4">{BUDGET_RANGES.join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-montserrat font-semibold text-slate-900">preferred_features</td>
                    <td className="py-3 px-4 font-montserrat text-xs text-blue-600">[string, string, string]</td>
                    <td className="py-3 px-4">Exactly 3 distinct items from the 7 approved features.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-montserrat font-semibold text-slate-900">primary_use</td>
                    <td className="py-3 px-4 font-montserrat text-xs text-blue-600">enum</td>
                    <td className="py-3 px-4">{PRIMARY_USES.join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-montserrat font-semibold text-slate-900">os_preference</td>
                    <td className="py-3 px-4 font-montserrat text-xs text-blue-600">enum</td>
                    <td className="py-3 px-4">{OS_PREFERENCES.join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dataset Disclaimer */}
        <Callout
          variant="highlight"
          title={datasetInfo.isDemo ? `Simulated Campus Dataset Notice (N=${datasetInfo.totalResponses})` : "Verified Empirical Survey Dataset Notice"}
        >
          {datasetInfo.isDemo ? (
            <>
              All data files currently loaded represent the calibrated benchmark dataset of {datasetInfo.totalResponses} student responses (<strong>SIMULATED CAMPUS DATA — N={datasetInfo.totalResponses}</strong>) tagged with <code>is_demo: true</code>. The records model realistic undergraduate preferences across all canonical brands, budget ranges, and 3-feature combinations to validate schema integrity, mathematical invariants, and interactive visual analytics.
            </>
          ) : (
            <>
              The application is currently operating on real survey data with <code>is_demo: false</code> ({datasetInfo.totalResponses} verified responses). Raw submissions were validated and cleaned through the Phase 07 offline Python pipeline.
            </>
          )}
        </Callout>
      </div>
    </div>
  );
}
