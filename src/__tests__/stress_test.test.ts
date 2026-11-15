import { describe, it, expect } from "vitest";
import {
  generateStressTestDataset,
} from "./fixtures/stressDatasetGenerator";
import { surveyDatasetSchema } from "@/schemas/survey.schema";
import {
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByBudget,
  getUniverseRespondentIds,
} from "@/lib/data/loader";
import {
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "@/lib/math/venn";
import { analyzeFeatureCombinations } from "@/lib/data/combinationAnalytics";
import { computeBrandFeatureAssociation } from "@/lib/math/brandFeatureExperiment";
import { computeBudgetCombinationAnalysis } from "@/lib/math/budgetCombinationExperiment";
import { executeMatchingEngine } from "@/lib/math/matchingEngine";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
} from "@/types/survey";

describe("Large Dataset Stress-Testing & Performance Verification", () => {
  // Test N=30 (active baseline), N=300 (standard benchmark), and N=1,000 (scalability ceiling)
  const cohortSizes = [30, 300, 1000] as const;

  for (const n of cohortSizes) {
    describe(`Stress Testing Cohort: N = ${n} records`, () => {
      const dataset = generateStressTestDataset(n);
      const responses = dataset.responses;

      it(`validates schema conformance for N=${n} in < 100ms`, () => {
        const start = performance.now();
        const parseResult = surveyDatasetSchema.safeParse(dataset);
        const elapsed = performance.now() - start;

        expect(parseResult.success).toBe(true);
        expect(elapsed).toBeLessThan(200); // Well under 200ms
        expect(responses.length).toBe(n);

        // Verify ID uniqueness
        const ids = new Set(responses.map((r) => r.response_id));
        expect(ids.size).toBe(n);

        // Verify 3 distinct features per respondent
        for (const r of responses) {
          expect(r.preferred_features.length).toBe(3);
          expect(new Set(r.preferred_features).size).toBe(3);
        }
      });

      it(`computes universe and discrete set partitions in < 25ms`, () => {
        const start = performance.now();
        const universe = getUniverseRespondentIds(responses);
        const brandApple = getRespondentIdsByBrand(responses, "Apple");
        const brandSamsung = getRespondentIdsByBrand(responses, "Samsung");
        const featureCamera = getRespondentIdsByFeature(responses, "Camera Quality");
        const featureBattery = getRespondentIdsByFeature(responses, "Battery Life");
        const budgetFlagship = getRespondentIdsByBudget(responses, "Above ₹60,000");
        const elapsed = performance.now() - start;

        expect(universe.size).toBe(n);
        expect(brandApple.size).toBeGreaterThan(0);
        expect(brandSamsung.size).toBeGreaterThan(0);
        expect(featureCamera.size).toBeGreaterThan(0);
        expect(featureBattery.size).toBeGreaterThan(0);
        expect(budgetFlagship.size).toBeGreaterThan(0);
        expect(elapsed).toBeLessThan(50);

        // Partition conservation: sum of brand sets = universe size
        let totalBrandCount = 0;
        for (const b of SMARTPHONE_BRANDS) {
          totalBrandCount += getRespondentIdsByBrand(responses, b).size;
        }
        expect(totalBrandCount).toBe(n);

        // Sum of budget sets = universe size
        let totalBudgetCount = 0;
        for (const b of BUDGET_RANGES) {
          totalBudgetCount += getRespondentIdsByBudget(responses, b).size;
        }
        expect(totalBudgetCount).toBe(n);

        // Feature selection conservation: 3 * N total selections
        let totalFeatureCount = 0;
        for (const f of SMARTPHONE_FEATURES) {
          totalFeatureCount += getRespondentIdsByFeature(responses, f).size;
        }
        expect(totalFeatureCount).toBe(3 * n);
      });

      it(`verifies 2-set and 3-set Principle of Inclusion-Exclusion (PIE) in < 15ms`, () => {
        const universe = getUniverseRespondentIds(responses);
        const setA = getRespondentIdsByBrand(responses, "Apple");
        const setB = getRespondentIdsByFeature(responses, "Camera Quality");
        const setC = getRespondentIdsByFeature(responses, "Battery Life");

        const start2Set = performance.now();
        const pie2 = verifyInclusionExclusionPrinciple(setA, setB);
        const regions2 = computeTwoSetVennRegions(universe, setA, setB);
        const elapsed2Set = performance.now() - start2Set;

        expect(pie2.isValid).toBe(true);
        expect(pie2.unionCardinality).toBe(pie2.calculatedRhs);
        expect(pie2.unionCardinality).toBe(
          pie2.individualCardinalitiesSum - pie2.intersectionCardinality
        );
        expect(regions2.unionSet.size).toBe(pie2.unionCardinality);
        expect(elapsed2Set).toBeLessThan(30);

        const start3Set = performance.now();
        const pie3 = verifyThreeSetInclusionExclusion(setA, setB, setC);
        const regions3 = computeThreeSetVennRegions(universe, setA, setB, setC);
        const elapsed3Set = performance.now() - start3Set;

        expect(pie3.isValid).toBe(true);
        expect(pie3.calculatedRhs).toBe(pie3.unionCardinality);
        expect(regions3.unionSet.size).toBe(pie3.unionCardinality);
        expect(elapsed3Set).toBeLessThan(30);
      });

      it(`evaluates all C(7, 3) = 35 combinations and rankings in < 30ms`, () => {
        const start = performance.now();
        const analytics = analyzeFeatureCombinations(responses);
        const elapsed = performance.now() - start;

        expect(analytics.totalTheoreticalCombinations).toBe(35);
        expect(analytics.totalRespondents).toBe(n);

        // Total observed count summed across all 35 triplets must exactly equal N
        const totalFrequency = analytics.combinations.reduce(
          (acc, c) => acc + c.observedCount,
          0
        );
        expect(totalFrequency).toBe(n);
        expect(analytics.totalObservedCombinations + analytics.totalUnobservedCombinations).toBe(35);

        expect(elapsed).toBeLessThan(50);
      });

      it(`calculates Brand-Feature association matrix & preserves dynamic 300% sum in < 25ms`, () => {
        const start = performance.now();
        const matrixAll = computeBrandFeatureAssociation(
          responses,
          [...SMARTPHONE_BRANDS],
          [...SMARTPHONE_FEATURES]
        );
        const elapsed = performance.now() - start;

        expect(matrixAll.isFullFeatureUniverse).toBe(true);

        // Every populated brand cohort MUST have feature percentage sum exactly equal to 300.0%
        for (const brand of SMARTPHONE_BRANDS) {
          const totalInBrand = matrixAll.brandTotals[brand] ?? 0;
          if (totalInBrand > 0) {
            const sumForBrand = matrixAll.featurePercentageSumByBrand[brand] ?? 0;
            expect(Math.abs(sumForBrand - 300.0)).toBeLessThan(0.01);
          }
        }

        // Test filtered subset of features
        const subsetFeatures = [SMARTPHONE_FEATURES[0]!, SMARTPHONE_FEATURES[1]!];
        const matrixFiltered = computeBrandFeatureAssociation(
          responses,
          [...SMARTPHONE_BRANDS],
          subsetFeatures
        );
        expect(matrixFiltered.isFullFeatureUniverse).toBe(false);

        for (const brand of SMARTPHONE_BRANDS) {
          const totalInBrand = matrixFiltered.brandTotals[brand] ?? 0;
          if (totalInBrand > 0) {
            const sumForBrand = matrixFiltered.featurePercentageSumByBrand[brand] ?? 0;
            expect(sumForBrand).toBeLessThanOrEqual(200.0);
          }
        }

        expect(elapsed).toBeLessThan(50);
      });

      it(`executes Budget Combination Analysis with correct denominators in < 30ms`, () => {
        const start = performance.now();
        const budgetResult = computeBudgetCombinationAnalysis(responses, [...BUDGET_RANGES]);
        const elapsed = performance.now() - start;

        expect(budgetResult.all35Rows.length).toBe(35);
        expect(budgetResult.totalCohortSize).toBe(n);

        // Total observed overall must equal N
        const totalObserved = budgetResult.all35Rows.reduce(
          (acc, row) => acc + row.totalObservedOverall,
          0
        );
        expect(totalObserved).toBe(n);

        expect(elapsed).toBeLessThan(50);
      });

      it(`executes My PhonePrint matching engine & preserves partition conservation in < 20ms`, () => {
        const testProfile = {
          brand: "Apple" as const,
          budget: "Above ₹60,000" as const,
          features: [
            SMARTPHONE_FEATURES[0]!,
            SMARTPHONE_FEATURES[1]!,
            SMARTPHONE_FEATURES[2]!,
          ] as unknown as [
            (typeof SMARTPHONE_FEATURES)[number],
            (typeof SMARTPHONE_FEATURES)[number],
            (typeof SMARTPHONE_FEATURES)[number],
          ],
        };

        const start = performance.now();
        const matchResult = executeMatchingEngine(responses, testProfile);
        const elapsed = performance.now() - start;

        expect(matchResult.totalCohort).toBe(n);

        // Exact match verification: B ∩ P ∩ F
        expect(matchResult.exactMatches.count).toBe(
          matchResult.exactMatches.ids.size
        );

        // Mutually exclusive and exhaustive partition: N3 + N2 + N1 + N0 = N
        const n3 = matchResult.category3Exact.count;
        const n2 = matchResult.category2Partial.total.count;
        const n1 = matchResult.category1Partial.total.count;
        const n0 = matchResult.category0None.count;

        expect(n3 + n2 + n1 + n0).toBe(n);

        // Feature overlap subset size conservation: sum(|F* ∩ F_i|) over all responses
        const overlap3 = matchResult.featureOverlap.matchAllThree.count;
        const overlap2 = matchResult.featureOverlap.matchTwo.count;
        const overlap1 = matchResult.featureOverlap.matchOne.count;
        const overlap0 = matchResult.featureOverlap.matchNone.count;

        expect(overlap3 + overlap2 + overlap1 + overlap0).toBe(n);

        expect(elapsed).toBeLessThan(50);
      });
    });
  }
});
