import { describe, it, expect } from "vitest";
import {
  analyzeFeatureCombinations,
  canonicalizeFeatureTriplet,
  getCombinationKey,
} from "@/lib/data/combinationAnalytics";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { SMARTPHONE_FEATURES, BUDGET_RANGES, type SurveyResponse } from "@/types/survey";

describe("Combinatorial Space and Empirical Frequency Analytics", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses;
  const analysis = analyzeFeatureCombinations(responses);

  describe("Theoretical Combinatorial Space Properties", () => {
    it("dynamically enumerates exactly C(7, 3) = 35 theoretical combinations", () => {
      expect(analysis.totalTheoreticalCombinations).toBe(35);
      expect(analysis.combinations.length).toBe(35);
    });

    it("guarantees every theoretical combination contains exactly 3 distinct features", () => {
      for (const record of analysis.combinations) {
        expect(record.features.length).toBe(3);
        const uniqueFeatures = new Set(record.features);
        expect(uniqueFeatures.size).toBe(3);
        // All features belong to canonical features
        for (const feature of record.features) {
          expect(SMARTPHONE_FEATURES).toContain(feature);
        }
      }
    });

    it("guarantees all 35 combinations are distinct and have unique keys", () => {
      const keys = new Set(analysis.combinations.map((c) => c.key));
      expect(keys.size).toBe(35);

      const ids = new Set(analysis.combinations.map((c) => c.id));
      expect(ids.size).toBe(35);
    });

    it("verifies canonicalization sorts features according to canonical order", () => {
      const triplet = canonicalizeFeatureTriplet([
        "Software & OS Experience",
        "Camera Quality",
        "Battery Life",
      ]);
      expect(triplet).toEqual([
        "Camera Quality",
        "Battery Life",
        "Software & OS Experience",
      ]);
      expect(getCombinationKey(triplet)).toBe(
        "Camera Quality|Battery Life|Software & OS Experience"
      );
    });
  });

  describe("Empirical Survey Observation & Frequencies", () => {
    it("partitions the 35 combinations into observed and unobserved voids", () => {
      expect(
        analysis.totalObservedCombinations + analysis.totalUnobservedCombinations
      ).toBe(35);
      expect(analysis.observedCombinations.length).toBe(
        analysis.totalObservedCombinations
      );
      expect(analysis.unobservedCombinations.length).toBe(
        analysis.totalUnobservedCombinations
      );
    });

    it("accurately detects observed combinations and assigns zero frequency to unobserved voids", () => {
      for (const record of analysis.unobservedCombinations) {
        expect(record.observedCount).toBe(0);
        expect(record.observedPercentage).toBe(0);
        expect(record.isObserved).toBe(false);
        expect(record.matchingRespondentIds).toEqual([]);
      }

      for (const record of analysis.observedCombinations) {
        expect(record.observedCount).toBeGreaterThan(0);
        expect(record.observedPercentage).toBeGreaterThan(0);
        expect(record.isObserved).toBe(true);
        expect(record.matchingRespondentIds.length).toBe(record.observedCount);
      }
    });

    it("calculates exact cohort percentages with total cohort as denominator", () => {
      const totalRespondents = responses.length;
      expect(analysis.totalRespondents).toBe(totalRespondents);

      // Verify sum of observed respondent counts equals total valid respondents
      const sumObservedCounts = analysis.observedCombinations.reduce(
        (sum, c) => sum + c.observedCount,
        0
      );
      expect(sumObservedCounts).toBe(totalRespondents);

      for (const combo of analysis.observedCombinations) {
        const expectedPct = (combo.observedCount / totalRespondents) * 100;
        expect(combo.observedPercentage).toBeCloseTo(expectedPct, 1);
      }
    });

    it("correctly handles combination frequencies for most and least common", () => {
      expect(analysis.mostCommonCombinations.length).toBeGreaterThan(0);
      const maxCount = analysis.mostCommonCombinations[0]?.observedCount ?? 0;
      expect(maxCount).toBeGreaterThan(0);
      for (const combo of analysis.mostCommonCombinations) {
        expect(combo.observedCount).toBe(maxCount);
      }

      expect(analysis.leastCommonObservedCombinations.length).toBeGreaterThan(0);
      const minCount = analysis.leastCommonObservedCombinations[0]?.observedCount ?? 0;
      expect(minCount).toBeGreaterThan(0);
      for (const combo of analysis.leastCommonObservedCombinations) {
        expect(combo.observedCount).toBe(minCount);
      }
    });
  });

  describe("Budget-Based Segmentation and Denominator Integrity", () => {
    it("calculates within-budget percentages using budget cohort as denominator", () => {
      const sumSizes = Object.values(analysis.budgetCohortSizes).reduce((a, b) => a + b, 0);
      expect(sumSizes).toBe(responses.length);

      for (const budget of BUDGET_RANGES) {
        const size = analysis.budgetCohortSizes[budget];
        expect(size).toBeGreaterThan(0);

        // Sum of counts across all 35 combinations for this budget must equal budget cohort size
        const sumInBudget = analysis.combinations.reduce(
          (acc, c) => acc + c.budgetBreakdown[budget].count,
          0
        );
        expect(sumInBudget).toBe(size);

        // Each combo percentage within budget must equal (count / size) * 100
        for (const c of analysis.combinations) {
          const expectedPct = Number(((c.budgetBreakdown[budget].count / size) * 100).toFixed(2));
          expect(c.budgetBreakdown[budget].percentageWithinBudget).toBeCloseTo(expectedPct, 1);
        }
      }
    });

    it("handles empty budget segment without division-by-zero errors", () => {
      // Create artificial responses with only 1 budget tier
      const singleBudgetResponses: SurveyResponse[] = [
        {
          response_id: "TEST_01",
          preferred_brand: "Apple",
          budget_range: "Above ₹60,000",
          preferred_features: [
            "Camera Quality",
            "Battery Life",
            "Processing Performance",
          ],
          primary_use: "Everyday General Use",
          os_preference: "iOS",
        },
      ];

      const singleTierAnalysis = analyzeFeatureCombinations(singleBudgetResponses);
      expect(singleTierAnalysis.budgetCohortSizes["Under ₹15,000"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["₹15,000 - ₹30,000"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["₹30,000 - ₹60,000"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["Above ₹60,000"]).toBe(1);

      // Check that empty tiers report 0 count and 0% without NaN
      for (const record of singleTierAnalysis.combinations) {
        expect(record.budgetBreakdown["Under ₹15,000"].percentageWithinBudget).toBe(
          0
        );
        expect(
          Number.isNaN(record.budgetBreakdown["Under ₹15,000"].percentageWithinBudget)
        ).toBe(false);
      }
    });

    it("handles empty survey response cohort gracefully", () => {
      const emptyAnalysis = analyzeFeatureCombinations([]);
      expect(emptyAnalysis.totalTheoreticalCombinations).toBe(35);
      expect(emptyAnalysis.totalObservedCombinations).toBe(0);
      expect(emptyAnalysis.totalUnobservedCombinations).toBe(35);
      expect(emptyAnalysis.totalRespondents).toBe(0);
      expect(emptyAnalysis.mostCommonCombinations).toEqual([]);
      expect(emptyAnalysis.leastCommonObservedCombinations).toEqual([]);
    });
  });
});
