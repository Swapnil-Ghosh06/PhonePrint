"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import {
  loadSurveyDataset,
  getActiveDatasetInfo,
  getUniverseRespondentIds,
} from "@/lib/data/loader";
import { getAvailableSetOptions } from "@/lib/data/setDescriptors";
import {
  setIntersection,
  setUnion,
  setDifference,
  symmetricDifference,
  setComplement,
  isSubset,
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "@/lib/math/venn";

import { SetSelector } from "@/components/setlab/SetSelector";
import {
  SetOperationsToolbar,
  type ActiveOperation,
  type Operation2Set,
  type Operation3Set,
} from "@/components/setlab/SetOperationsToolbar";
import { VennDiagram2Set } from "@/components/setlab/VennDiagram2Set";
import { VennDiagram3Set } from "@/components/setlab/VennDiagram3Set";
import { InclusionExclusionCalculator } from "@/components/setlab/InclusionExclusionCalculator";
import { EducationalCard } from "@/components/setlab/EducationalCard";
import { SetRespondentExplorer } from "@/components/setlab/SetRespondentExplorer";

export default function SetLabPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;
  const universe = useMemo(() => getUniverseRespondentIds(responses), [responses]);
  const availableOptions = useMemo(() => getAvailableSetOptions(), []);

  // UI Mode: "2-set" or "3-set"
  const [mode, setMode] = useState<"2-set" | "3-set">("2-set");

  // Selected Set IDs
  const [setAId, setSetAId] = useState<string>("brand_apple");
  const [setBId, setSetBId] = useState<string>("feature_camera_quality");
  const [setCId, setSetCId] = useState<string>("feature_battery_life");

  // Active Algebraic Operation
  const [activeOperation, setActiveOperation] = useState<ActiveOperation>("intersection");

  // Resolve Set Option Descriptors
  const optionA = availableOptions.find((o) => o.id === setAId) || availableOptions[0]!;
  const optionB = availableOptions.find((o) => o.id === setBId) || availableOptions[1]!;
  const optionC = availableOptions.find((o) => o.id === setCId) || availableOptions[2]!;

  // Compute Discrete Sets of Respondent IDs
  const setA = useMemo(() => optionA.getIds(responses), [optionA, responses]);
  const setB = useMemo(() => optionB.getIds(responses), [optionB, responses]);
  const setC = useMemo(() => optionC.getIds(responses), [optionC, responses]);

  // Compute 2-Set Venn & PIE
  const regions2Set = useMemo(
    () => computeTwoSetVennRegions(universe, setA, setB),
    [universe, setA, setB]
  );
  const pie2Set = useMemo(
    () => verifyInclusionExclusionPrinciple(setA, setB),
    [setA, setB]
  );

  // Compute 3-Set Venn & PIE
  const regions3Set = useMemo(
    () => computeThreeSetVennRegions(universe, setA, setB, setC),
    [universe, setA, setB, setC]
  );
  const pie3Set = useMemo(
    () => verifyThreeSetInclusionExclusion(setA, setB, setC),
    [setA, setB, setC]
  );

  // Handle Mode Change
  const handleModeChange = (newMode: "2-set" | "3-set") => {
    setMode(newMode);
    setActiveOperation(newMode === "2-set" ? "intersection" : "inter_abc");
  };

  // Determine Current Matching Respondent IDs based on Active Operation
  const matchingIds: Set<string> = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return setUnion(setA, setB);
        case "intersection":
          return setIntersection(setA, setB);
        case "diff_ab":
          return setDifference(setA, setB);
        case "diff_ba":
          return setDifference(setB, setA);
        case "sym_diff":
          return symmetricDifference(setA, setB);
        case "comp_a":
          return setComplement(universe, setA);
        case "comp_b":
          return setComplement(universe, setB);
        case "neither":
          return regions2Set.neither;
        case "subset_ab":
          // If subset, return A; if not, return counterexamples (A \ B)
          return isSubset(setA, setB) ? setA : setDifference(setA, setB);
        case "disjoint_ab":
          return setIntersection(setA, setB);
        default:
          return setIntersection(setA, setB);
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return regions3Set.unionSet;
        case "inter_abc":
          return regions3Set.allThree;
        case "inter_ab":
          return setIntersection(setA, setB);
        case "inter_ac":
          return setIntersection(setA, setC);
        case "inter_bc":
          return setIntersection(setB, setC);
        case "only_a":
          return regions3Set.onlyA;
        case "only_b":
          return regions3Set.onlyB;
        case "only_c":
          return regions3Set.onlyC;
        case "only_ab":
          return regions3Set.onlyAB;
        case "only_ac":
          return regions3Set.onlyAC;
        case "only_bc":
          return regions3Set.onlyBC;
        case "outside_abc":
          return regions3Set.outside;
        default:
          return regions3Set.allThree;
      }
    }
  }, [mode, activeOperation, setA, setB, setC, universe, regions2Set, regions3Set]);

  // Human-readable operation explanation for explorer
  const operationLabel = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return "Union: A ∪ B";
        case "intersection":
          return "Intersection: A ∩ B";
        case "diff_ab":
          return "Difference: A \\ B (A only)";
        case "diff_ba":
          return "Difference: B \\ A (B only)";
        case "sym_diff":
          return "Symmetric Difference: A Δ B";
        case "comp_a":
          return "Complement: Aᶜ (U \\ A)";
        case "comp_b":
          return "Complement: Bᶜ (U \\ B)";
        case "neither":
          return "Neither: (A ∪ B)ᶜ";
        case "subset_ab":
          return isSubset(setA, setB)
            ? "Subset Test: True (A ⊆ B)"
            : "Subset Test: False (Counterexample Elements in A \\ B)";
        case "disjoint_ab":
          return setIntersection(setA, setB).size === 0
            ? "Disjointness: True (A ∩ B = ∅)"
            : "Disjointness: False (Shared Elements Exist)";
        default:
          return "Active Selection";
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return "Triple Union: A ∪ B ∪ C";
        case "inter_abc":
          return "Triple Intersection: A ∩ B ∩ C";
        case "inter_ab":
          return "Pairwise Overlap: A ∩ B";
        case "inter_ac":
          return "Pairwise Overlap: A ∩ C";
        case "inter_bc":
          return "Pairwise Overlap: B ∩ C";
        case "only_a":
          return "Region 1: A Only (A \\ (B ∪ C))";
        case "only_b":
          return "Region 2: B Only (B \\ (A ∪ C))";
        case "only_c":
          return "Region 3: C Only (C \\ (A ∪ B))";
        case "only_ab":
          return "Region 4: AB Only ((A ∩ B) \\ C)";
        case "only_ac":
          return "Region 5: AC Only ((A ∩ C) \\ B)";
        case "only_bc":
          return "Region 6: BC Only ((B ∩ C) \\ A)";
        case "outside_abc":
          return "Region 8: Outside All Three ((A ∪ B ∪ C)ᶜ)";
        default:
          return "Active 3-Set Selection";
      }
    }
  }, [mode, activeOperation, setA, setB]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        sectionCode="03"
        eyebrow="Interactive Mathematics Laboratory"
        title="SetLab"
        description="Formal set theory laboratory evaluating union, intersection, symmetric difference, relative complements, and the Principle of Inclusion-Exclusion on empirical student cohorts."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <>
            <Link href="/">
              <Button variant="outline" size="sm">
                &larr; Campus Pulse
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
        {/* Academic Dataset Status Banner */}
        <Callout
          variant="highlight"
          title={`Active Laboratory Cohort (U = ${universe.size} Respondents)`}
        >
          All operations below evaluate pure mathematical expressions on discrete sets of unique student IDs. Intersections and cardinalities are calculated dynamically from verified survey records rather than estimated from aggregate totals.
        </Callout>

        {/* 1. Set Definition Workspace */}
        <SetSelector
          mode={mode}
          onModeChange={handleModeChange}
          availableOptions={availableOptions}
          setAId={setAId}
          setBId={setBId}
          setCId={setCId}
          onSelectA={setSetAId}
          onSelectB={setSetBId}
          onSelectC={setSetCId}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
          totalUniverseSize={universe.size}
        />

        {/* 2. Set Operations Toolbar */}
        <SetOperationsToolbar
          mode={mode}
          activeOperation={activeOperation}
          onSelectOperation={setActiveOperation}
          resultCardinality={matchingIds.size}
          totalUniverse={universe.size}
        />

        {/* 3. Interactive Venn Diagram & Educational Theory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Venn Diagram */}
          <div className="lg:col-span-7">
            {mode === "2-set" ? (
              <VennDiagram2Set
                setAName={optionA.name}
                setBName={optionB.name}
                regions={regions2Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation2Set) => setActiveOperation(op)}
              />
            ) : (
              <VennDiagram3Set
                setAName={optionA.name}
                setBName={optionB.name}
                setCName={optionC.name}
                regions={regions3Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation3Set) => setActiveOperation(op)}
              />
            )}
          </div>

          {/* Educational Theory Card */}
          <div className="lg:col-span-5">
            <EducationalCard
              operation={activeOperation}
              setAName={optionA.name}
              setBName={optionB.name}
              setCName={mode === "3-set" ? optionC.name : undefined}
              resultCount={matchingIds.size}
              totalUniverse={universe.size}
            />
          </div>
        </div>

        {/* 4. Inclusion-Exclusion Calculator & Step-by-Step Proof */}
        <InclusionExclusionCalculator
          mode={mode}
          pie2Set={pie2Set}
          pie3Set={pie3Set}
          setAName={optionA.name}
          setBName={optionB.name}
          setCName={optionC.name}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
        />

        {/* 5. Matching Respondent Explorer */}
        <SetRespondentExplorer
          matchingIds={matchingIds}
          allResponses={responses}
          operationName={operationLabel}
          setExplanation={
            mode === "2-set"
              ? `Filtered against Set A (${optionA.name}) and Set B (${optionB.name})`
              : `Filtered against Sets A, B, and C (${optionA.name}, ${optionB.name}, ${optionC.name})`
          }
        />
      </div>
    </div>
  );
}
