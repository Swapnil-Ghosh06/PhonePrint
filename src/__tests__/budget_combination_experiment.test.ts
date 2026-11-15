import { describe, it, expect } from "vitest";
import { computeBudgetCombinationAnalysis } from "@/lib/math/budgetCombinationExperiment";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import { BUDGET_RANGES, type SurveyResponse } from "@/types/survey";

describe("Experiment 2: Feature Combinations by Budget Analytics", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses; // 12 respondents

  it("dynamically maintains exactly C(7, 3) = 35 theoretical combinations", () => {
    const result = computeBudgetCombinationAnalysis(responses);
    expect(result.totalTheoreticalCombinations).toBe(35);
    expect(result.all35Rows.length).toBe(35);
  });

  it("correctly identifies observed combinations and theoretical voids", () => {
    const result = computeBudgetCombinationAnalysis(responses);

    expect(result.totalObservedInDataset).toBe(result.observedRows.length);
    expect(result.totalTheoreticalCombinations).toBe(35);
    expect(result.totalObservedInDataset + result.totalUnobservedInDataset).toBe(35);

    for (const row of result.observedRows) {
      expect(row.isObservedOverall).toBe(true);
      expect(row.totalObservedOverall).toBeGreaterThan(0);
    }
  });

  it("uses the budget-specific cohort size as denominator and sums to 100% per populated segment", () => {
    const result = computeBudgetCombinationAnalysis(responses);

    for (const budget of BUDGET_RANGES) {
      const expectedBudgetTotal = responses.filter((r) => r.budget_range === budget).length;
      expect(result.budgetTotals[budget]).toBe(expectedBudgetTotal);
    }

    for (const budget of BUDGET_RANGES) {
      const n_p = result.budgetTotals[budget];
      const sumCounts = result.observedRows.reduce(
        (acc, r) => acc + r.frequenciesByBudget[budget],
        0
      );
      expect(sumCounts).toBe(n_p);

      if (n_p > 0) {
        const sumPercentages = result.observedRows.reduce(
          (acc, r) => acc + r.percentagesByBudget[budget],
          0
        );
        // Subject only to minor floating-point decimal rounding (100.0 ± 0.2 across 35 rows)
        expect(Math.abs(sumPercentages - 100.0)).toBeLessThan(0.2);
      }
    }
  });

  it("matches combinations by exact unordered set equality without regard to feature order", () => {
    const result = computeBudgetCombinationAnalysis(responses);
    const firstObserved = result.observedRows[0]!;
    expect(firstObserved).toBeDefined();

    const expectedTotal = responses.filter((r) => {
      const s = new Set(r.preferred_features);
      return firstObserved.features.every((f) => s.has(f));
    }).length;
    expect(firstObserved.totalObservedOverall).toBe(expectedTotal);

    for (const budget of BUDGET_RANGES) {
      const countInBudget = responses.filter((r) => {
        const s = new Set(r.preferred_features);
        return r.budget_range === budget && firstObserved.features.every((f) => s.has(f));
      }).length;
      expect(firstObserved.frequenciesByBudget[budget]).toBe(countInBudget);
    }
  });

  it("handles empty budget segments safely without NaN or division by zero", () => {
    // Artificial cohort with only Above ₹60,000 responses
    const singleTierCohort: SurveyResponse[] = [
      {
        response_id: "T1",
        preferred_brand: "Apple",
        budget_range: "Above ₹60,000",
        preferred_features: [
          "Camera Quality",
          "Battery Life",
          "Build & Design Quality",
        ],
        primary_use: "Everyday General Use",
        os_preference: "iOS",
      },
    ];

    const result = computeBudgetCombinationAnalysis(singleTierCohort);

    expect(result.budgetTotals["Under ₹15,000"]).toBe(0);
    expect(result.distinctCombinationsCountByBudget["Under ₹15,000"]).toBe(0);

    for (const row of result.all35Rows) {
      expect(row.frequenciesByBudget["Under ₹15,000"]).toBe(0);
      expect(row.percentagesByBudget["Under ₹15,000"]).toBe(0);
      expect(Number.isNaN(row.percentagesByBudget["Under ₹15,000"])).toBe(false);
      expect(Number.isFinite(row.percentagesByBudget["Under ₹15,000"])).toBe(true);
    }
  });

  it("correctly identifies distinct combinations count per budget tier", () => {
    const result = computeBudgetCombinationAnalysis(responses);

    for (const budget of BUDGET_RANGES) {
      const expectedDistinct = result.observedRows.filter(
        (r) => r.frequenciesByBudget[budget] > 0
      ).length;
      expect(result.distinctCombinationsCountByBudget[budget]).toBe(expectedDistinct);
    }
  });
});
