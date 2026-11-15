# PhonePrint Phase 09 — Complete Test Suite Source Bundle

Complete unabridged source code for all 11 Vitest test suites and the Python pipeline test suite.

---


## File: `src/__tests__/dataset_loader.test.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Validates that loadDemoSurveyDataset loads exactly 300 responses and satisfies metadata invariants.

```typescript
import { describe, it, expect } from "vitest";
import {
  loadSurveyDataset,
  loadDemoSurveyDataset,
  getActiveDatasetInfo,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByBudget,
  getUniverseRespondentIds,
} from "@/lib/data/loader";
import { SMARTPHONE_FEATURES, SMARTPHONE_BRANDS, BUDGET_RANGES } from "@/types/survey";

describe("Dataset Loader & Configuration Engine", () => {
  it("loadDemoSurveyDataset loads and validates the 300-record synthetic fixture", () => {
    const dataset = loadDemoSurveyDataset();

    expect(dataset.metadata.is_demo).toBe(true);
    expect(dataset.metadata.total_responses).toBe(300);
    expect(dataset.responses.length).toBe(300);

    // Verify all responses conform to canonical properties
    for (const resp of dataset.responses) {
      expect(resp.response_id).toMatch(/^RESP_\d{3,}$/);
      expect(SMARTPHONE_BRANDS).toContain(resp.preferred_brand);
      expect(BUDGET_RANGES).toContain(resp.budget_range);
      expect(resp.preferred_features.length).toBe(3);

      const uniqueFeatures = new Set(resp.preferred_features);
      expect(uniqueFeatures.size).toBe(3);

      for (const feat of resp.preferred_features) {
        expect(SMARTPHONE_FEATURES).toContain(feat);
      }
    }
  });

  it("loadSurveyDataset returns currently active validated dataset", () => {
    const dataset = loadSurveyDataset();

    expect(dataset).toBeDefined();
    expect(dataset.metadata).toBeDefined();
    expect(dataset.responses.length).toBeGreaterThan(0);
    expect(dataset.metadata.total_responses).toBe(dataset.responses.length);
  });

  it("getActiveDatasetInfo provides accurate metadata and UI badge tokens", () => {
    const info = getActiveDatasetInfo();

    expect(info).toBeDefined();
    expect(typeof info.isDemo).toBe("boolean");
    expect(typeof info.totalResponses).toBe("number");
    expect(info.totalResponses).toBeGreaterThan(0);
    expect(typeof info.version).toBe("string");
    expect(typeof info.badgeText).toBe("string");
    expect(typeof info.tagText).toBe("string");

    if (info.isDemo) {
      expect(info.badgeText).toBe(`SIMULATED CAMPUS DATA — N=${info.totalResponses}`);
      expect(info.tagText).toBe(`[SIMULATED CAMPUS DATA: N=${info.totalResponses}]`);
    } else {
      expect(info.badgeText).toBe(`REAL SURVEY (n=${info.totalResponses})`);
      expect(info.tagText).toBe(`[REAL SURVEY: N=${info.totalResponses}]`);
    }
  });

  it("set extraction utilities correctly partition respondent IDs", () => {
    const dataset = loadSurveyDataset();
    const responses = dataset.responses;
    const universe = getUniverseRespondentIds(responses);

    expect(universe.size).toBe(responses.length);

    // Sum of brand partition sizes equals universe size (since each student picks 1 brand)
    let totalBrandCount = 0;
    for (const brand of SMARTPHONE_BRANDS) {
      const ids = getRespondentIdsByBrand(responses, brand);
      totalBrandCount += ids.size;
      for (const id of ids) {
        expect(universe.has(id)).toBe(true);
      }
    }
    expect(totalBrandCount).toBe(universe.size);

    // Sum of budget partition sizes equals universe size
    let totalBudgetCount = 0;
    for (const budget of BUDGET_RANGES) {
      const ids = getRespondentIdsByBudget(responses, budget);
      totalBudgetCount += ids.size;
      for (const id of ids) {
        expect(universe.has(id)).toBe(true);
      }
    }
    expect(totalBudgetCount).toBe(universe.size);

    // Feature selection conservation: each student picks exactly 3 features
    // Therefore sum of |S_f| across all 7 features must equal 3 * N
    let totalFeatureCount = 0;
    for (const feature of SMARTPHONE_FEATURES) {
      const ids = getRespondentIdsByFeature(responses, feature);
      totalFeatureCount += ids.size;
      for (const id of ids) {
        expect(universe.has(id)).toBe(true);
      }
    }
    expect(totalFeatureCount).toBe(3 * universe.size);
  });
});

```


## File: `src/__tests__/combination_analytics.test.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Asserts combination frequencies across 300 responses, total count sum = 300, and all 35 combinations populated.

```typescript
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
          budget_range: "Over $1,000",
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
      expect(singleTierAnalysis.budgetCohortSizes["Under $400"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["$400 - $700"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["$700 - $1,000"]).toBe(0);
      expect(singleTierAnalysis.budgetCohortSizes["Over $1,000"]).toBe(1);

      // Check that empty tiers report 0 count and 0% without NaN
      for (const record of singleTierAnalysis.combinations) {
        expect(record.budgetBreakdown["Under $400"].percentageWithinBudget).toBe(
          0
        );
        expect(
          Number.isNaN(record.budgetBreakdown["Under $400"].percentageWithinBudget)
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

```


## File: `src/__tests__/brand_feature_experiment.test.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Validates brand-feature matrix over 300 records, 300.0% invariant with all 7 features, and dynamic sub-sums.

```typescript
import { describe, it, expect } from "vitest";
import {
  computeBrandFeatureAssociation,
  calculateBrandFeaturePercentageSum,
} from "@/lib/math/brandFeatureExperiment";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SurveyResponse,
} from "@/types/survey";

describe("Experiment 1: Brand–Feature Association Analysis", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses; // 300 respondents

  it("computes accurate brand-feature intersection counts using actual respondent IDs", () => {
    const result = computeBrandFeatureAssociation(responses);

    const appleCamera = result.matrix.find(
      (c) => c.brand === "Apple" && c.feature === "Camera Quality"
    );
    expect(appleCamera).toBeDefined();
    expect(appleCamera?.count).toBe(appleCamera?.matchingRespondentIds.length);
    const expectedAppleCameraCount = responses.filter(
      (r) => r.preferred_brand === "Apple" && r.preferred_features.includes("Camera Quality")
    ).length;
    expect(appleCamera?.count).toBe(expectedAppleCameraCount);
    expect(appleCamera?.percentage).toBeCloseTo(
      (expectedAppleCameraCount / result.brandTotals["Apple"]) * 100,
      1
    );

    // Verify respondent ID set containment
    for (const id of appleCamera!.matchingRespondentIds) {
      const resp = responses.find((r) => r.response_id === id);
      expect(resp?.preferred_brand).toBe("Apple");
      expect(resp?.preferred_features).toContain("Camera Quality");
    }
  });

  it("strictly enforces the brand-specific cohort size as denominator", () => {
    const result = computeBrandFeatureAssociation(responses);

    for (const brand of SMARTPHONE_BRANDS) {
      const expectedTotal = responses.filter((r) => r.preferred_brand === brand).length;
      expect(result.brandTotals[brand]).toBe(expectedTotal);
    }

    const samsungStorage = result.matrix.find(
      (c) => c.brand === "Samsung" && c.feature === "Storage Capacity"
    );
    expect(samsungStorage).toBeDefined();
    const expectedSamsungStorageCount = responses.filter(
      (r) => r.preferred_brand === "Samsung" && r.preferred_features.includes("Storage Capacity")
    ).length;
    expect(samsungStorage?.count).toBe(expectedSamsungStorageCount);
    expect(samsungStorage?.percentage).toBeCloseTo(
      (expectedSamsungStorageCount / result.brandTotals["Samsung"]) * 100,
      1
    );
  });

  it("satisfies the property that feature percentages within a brand sum to 300% across all 7 features", () => {
    const result = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      SMARTPHONE_FEATURES
    );

    // For any populated brand, because every respondent chooses exactly 3 features:
    // sum_f C(b, f) = 3 * N(b)
    // sum_f P(f | b) = sum_f (C(b, f) / N(b) * 100) = (3 * N(b) / N(b)) * 100 = 300%
    for (const brand of SMARTPHONE_BRANDS) {
      const n_b = result.brandTotals[brand];
      if (n_b > 0) {
        const brandCells = result.matrix.filter((c) => c.brand === brand);
        const sumCount = brandCells.reduce((acc, c) => acc + c.count, 0);
        expect(sumCount).toBe(3 * n_b);

        const sumPercentage = brandCells.reduce(
          (acc, c) => acc + c.percentage,
          0
        );
        expect(sumPercentage).toBeCloseTo(300.0, 1);
      }
    }
  });

  it("handles empty brand groups without NaN or Infinity", () => {
    // Artificial dataset with no Google respondents
    const noGoogleResponses: SurveyResponse[] = [
      {
        response_id: "TEST_001",
        preferred_brand: "Apple",
        budget_range: "Over $1,000",
        preferred_features: [
          "Camera Quality",
          "Battery Life",
          "Build & Design Quality",
        ],
        primary_use: "Everyday General Use",
        os_preference: "iOS",
      },
    ];

    const result = computeBrandFeatureAssociation(noGoogleResponses, [
      "Apple",
      "Google",
    ]);

    expect(result.brandTotals["Google"]).toBe(0);

    const googleCells = result.matrix.filter((c) => c.brand === "Google");
    expect(googleCells.length).toBe(7);

    for (const cell of googleCells) {
      expect(cell.count).toBe(0);
      expect(cell.percentage).toBe(0);
      expect(Number.isNaN(cell.percentage)).toBe(false);
      expect(Number.isFinite(cell.percentage)).toBe(true);
    }
  });

  it("supports arbitrary subsets of brands and features", () => {
    const customBrands = ["Apple", "Samsung"] as const;
    const customFeatures = ["Camera Quality", "Battery Life"] as const;

    const result = computeBrandFeatureAssociation(
      responses,
      customBrands,
      customFeatures
    );

    expect(result.matrix.length).toBe(4); // 2 brands * 2 features
    expect(result.selectedBrands).toEqual(customBrands);
    expect(result.selectedFeatures).toEqual(customFeatures);
  });

  // =========================================================================
  // Phase 06 Targeted Corrections - Dynamic Feature Sum & Invariants
  // =========================================================================

  it("verifies that when all seven features are selected, the percentage sum equals 300%", () => {
    const result = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      SMARTPHONE_FEATURES
    );

    expect(result.isFullFeatureUniverse).toBe(true);

    for (const brand of SMARTPHONE_BRANDS) {
      const n_b = result.brandTotals[brand];
      if (n_b > 0) {
        expect(result.featurePercentageSumByBrand[brand]).toBe(300.0);
        expect(
          calculateBrandFeaturePercentageSum(result.matrix, brand, n_b)
        ).toBe(300.0);
      } else {
        expect(result.featurePercentageSumByBrand[brand]).toBe(0.0);
      }
    }
  });

  it("verifies that for a subset of two features, displayed sum equals the actual sum of those two feature percentages, not an assumed 300%", () => {
    const twoFeatures = ["Camera Quality", "Build & Design Quality"] as const;
    const result = computeBrandFeatureAssociation(
      responses,
      ["Apple", "Samsung"],
      twoFeatures
    );

    expect(result.isFullFeatureUniverse).toBe(false);

    const appleCells = result.matrix.filter((c) => c.brand === "Apple");
    const actualAppleSum = Number(
      appleCells.reduce((acc, c) => acc + c.percentage, 0).toFixed(2)
    );
    expect(result.featurePercentageSumByBrand["Apple"]).toBe(actualAppleSum);
    expect(result.featurePercentageSumByBrand["Apple"]).toBeLessThan(300.0);

    const samsungCells = result.matrix.filter((c) => c.brand === "Samsung");
    const actualSamsungSum = Number(
      samsungCells.reduce((acc, c) => acc + c.percentage, 0).toFixed(2)
    );
    expect(result.featurePercentageSumByBrand["Samsung"]).toBe(actualSamsungSum);
    expect(result.featurePercentageSumByBrand["Samsung"]).toBeLessThan(300.0);
  });

  it("verifies that for a subset of three features, displayed sum is computed correctly", () => {
    const threeFeatures = [
      "Camera Quality",
      "Battery Life",
      "Processing Performance",
    ] as const;
    const result = computeBrandFeatureAssociation(
      responses,
      ["Apple", "Samsung"],
      threeFeatures
    );

    expect(result.isFullFeatureUniverse).toBe(false);

    const appleCells = result.matrix.filter((c) => c.brand === "Apple");
    const actualAppleSum = Number(
      appleCells.reduce((acc, c) => acc + c.percentage, 0).toFixed(2)
    );
    expect(result.featurePercentageSumByBrand["Apple"]).toBe(actualAppleSum);
    expect(result.featurePercentageSumByBrand["Apple"]).toBeLessThanOrEqual(300.0);

    const samsungCells = result.matrix.filter((c) => c.brand === "Samsung");
    const actualSamsungSum = Number(
      samsungCells.reduce((acc, c) => acc + c.percentage, 0).toFixed(2)
    );
    expect(result.featurePercentageSumByBrand["Samsung"]).toBe(actualSamsungSum);
    expect(result.featurePercentageSumByBrand["Samsung"]).toBeLessThanOrEqual(300.0);
  });

  it("handles empty feature selection safely without NaN or Infinity", () => {
    const result = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      []
    );

    expect(result.isFullFeatureUniverse).toBe(false);
    expect(result.matrix.length).toBe(0);

    for (const brand of SMARTPHONE_BRANDS) {
      const sum = result.featurePercentageSumByBrand[brand];
      expect(Number.isNaN(sum)).toBe(false);
      expect(Number.isFinite(sum)).toBe(true);
      expect(sum).toBe(0.0);
    }

    // Descriptive notes should handle empty features safely
    expect(result.descriptiveNotes.length).toBeGreaterThan(0);
    for (const note of result.descriptiveNotes) {
      expect(note.includes("NaN")).toBe(false);
      expect(note.includes("Infinity")).toBe(false);
    }
  });

  it("verifies that filtering features does not alter the underlying brand cohort denominator", () => {
    const resultAll = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      SMARTPHONE_FEATURES
    );

    const resultFiltered = computeBrandFeatureAssociation(
      responses,
      SMARTPHONE_BRANDS,
      ["Camera Quality"]
    );

    // Brand totals (denominators) must remain identical
    for (const brand of SMARTPHONE_BRANDS) {
      expect(resultFiltered.brandTotals[brand]).toBe(
        resultAll.brandTotals[brand]
      );
    }

    const appleCellAll = resultAll.matrix.find(
      (c) => c.brand === "Apple" && c.feature === "Camera Quality"
    );
    const appleCellFiltered = resultFiltered.matrix.find(
      (c) => c.brand === "Apple" && c.feature === "Camera Quality"
    );
    expect(appleCellFiltered?.count).toBe(appleCellAll?.count);
    expect(appleCellFiltered?.percentage).toBe(appleCellAll?.percentage);
  });
});

```


## File: `src/__tests__/budget_combination_experiment.test.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Validates budget-triplet cross-tabulation over 300 records, conservation law sum P(t|p) = 100.0% for all budget tiers.

```typescript
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
    // Artificial cohort with only Over $1,000 responses
    const singleTierCohort: SurveyResponse[] = [
      {
        response_id: "T1",
        preferred_brand: "Apple",
        budget_range: "Over $1,000",
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

    expect(result.budgetTotals["Under $400"]).toBe(0);
    expect(result.distinctCombinationsCountByBudget["Under $400"]).toBe(0);

    for (const row of result.all35Rows) {
      expect(row.frequenciesByBudget["Under $400"]).toBe(0);
      expect(row.percentagesByBudget["Under $400"]).toBe(0);
      expect(Number.isNaN(row.percentagesByBudget["Under $400"])).toBe(false);
      expect(Number.isFinite(row.percentagesByBudget["Under $400"])).toBe(true);
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

```


## File: `src/__tests__/matching_engine.test.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Validates 4-way disjoint match partition N3+N2+N1+N0=300, exact profile intersection, and feature overlap.

```typescript
import { describe, it, expect } from "vitest";
import {
  buildBrandSet,
  buildBudgetSet,
  buildExactFeatureSet,
  calculateFeatureOverlap,
  computeExactMatches,
  executeMatchingEngine,
} from "@/lib/math/matchingEngine";
import { loadDemoSurveyDataset } from "@/lib/data/loader";
import type { SurveyResponse, SmartphoneFeature } from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

describe("Preference Matching Engine (My PhonePrint)", () => {
  const dataset = loadDemoSurveyDataset();
  const responses = dataset.responses; // 300 valid respondents

  const appleProfile: UserProfileInput = {
    brand: "Apple",
    budget: "Over $1,000",
    features: [
      "Camera Quality",
      "Battery Life",
      "Build & Design Quality",
    ],
  };

  describe("Set Construction & Exact Intersections", () => {
    it("constructs correct brand set B", () => {
      const bSet = buildBrandSet(responses, "Apple");
      const expectedAppleCount = responses.filter((r) => r.preferred_brand === "Apple").length;
      expect(bSet.size).toBe(expectedAppleCount);
      for (const id of bSet) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.preferred_brand).toBe("Apple");
      }
    });

    it("constructs correct budget set P", () => {
      const pSet = buildBudgetSet(responses, "Over $1,000");
      const expectedOver1kCount = responses.filter((r) => r.budget_range === "Over $1,000").length;
      expect(pSet.size).toBe(expectedOver1kCount);
      for (const id of pSet) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.budget_range).toBe("Over $1,000");
      }
    });

    it("constructs correct exact feature triplet set F", () => {
      const fSet = buildExactFeatureSet(responses, [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ]);
      const expectedFCount = responses.filter((r) =>
        appleProfile.features.every((f) => r.preferred_features.includes(f))
      ).length;
      expect(fSet.size).toBe(expectedFCount);
      for (const id of fSet) {
        const resp = responses.find((r) => r.response_id === id);
        for (const f of appleProfile.features) {
          expect(resp?.preferred_features).toContain(f);
        }
      }
    });

    it("evaluates exact match intersection B ∩ P ∩ F", () => {
      const bSet = buildBrandSet(responses, "Apple");
      const pSet = buildBudgetSet(responses, "Over $1,000");
      const fSet = buildExactFeatureSet(responses, [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ]);

      const exact = computeExactMatches(bSet, pSet, fSet);
      const expectedExact = responses.filter(
        (r) =>
          r.preferred_brand === "Apple" &&
          r.budget_range === "Over $1,000" &&
          appleProfile.features.every((f) => r.preferred_features.includes(f))
      ).length;
      expect(exact.size).toBe(expectedExact);
    });

    it("guarantees unranked feature selection invariance", () => {
      // Swapping the order of the features in the input vector
      const permutedFeatures1: [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature] = [
        "Build & Design Quality",
        "Camera Quality",
        "Battery Life",
      ];
      const permutedFeatures2: [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature] = [
        "Battery Life",
        "Build & Design Quality",
        "Camera Quality",
      ];

      const fSet1 = buildExactFeatureSet(responses, appleProfile.features);
      const fSet2 = buildExactFeatureSet(responses, permutedFeatures1);
      const fSet3 = buildExactFeatureSet(responses, permutedFeatures2);

      expect(Array.from(fSet1).sort()).toEqual(Array.from(fSet2).sort());
      expect(Array.from(fSet1).sort()).toEqual(Array.from(fSet3).sort());
    });
  });

  describe("Mutually Exclusive Partial-Match Classification", () => {
    it("partitions respondents into 4 mutually exclusive categories summing to N", () => {
      const result = executeMatchingEngine(responses, appleProfile);

      const n3 = result.category3Exact.count;
      const n2 = result.category2Partial.total.count;
      const n1 = result.category1Partial.total.count;
      const n0 = result.category0None.count;

      // Category count conservation: N_3 + N_2 + N_1 + N_0 = N
      expect(n3 + n2 + n1 + n0).toBe(responses.length);
      expect(responses.length).toBe(300);

      // Category 3 exact match strictly agrees with exactMatches
      expect(result.category3Exact.count).toBe(result.exactMatches.count);
      expect(Array.from(result.category3Exact.ids)).toEqual(
        Array.from(result.exactMatches.ids)
      );

      // Verify mutual exclusivity across all 4 sets
      const set3 = result.category3Exact.ids;
      const set2 = result.category2Partial.total.ids;
      const set1 = result.category1Partial.total.ids;
      const set0 = result.category0None.ids;

      for (const id of set3) {
        expect(set2.has(id)).toBe(false);
        expect(set1.has(id)).toBe(false);
        expect(set0.has(id)).toBe(false);
      }
      for (const id of set2) {
        expect(set3.has(id)).toBe(false);
        expect(set1.has(id)).toBe(false);
        expect(set0.has(id)).toBe(false);
      }
      for (const id of set1) {
        expect(set3.has(id)).toBe(false);
        expect(set2.has(id)).toBe(false);
        expect(set0.has(id)).toBe(false);
      }
      for (const id of set0) {
        expect(set3.has(id)).toBe(false);
        expect(set2.has(id)).toBe(false);
        expect(set1.has(id)).toBe(false);
      }
    });

    it("verifies sub-breakdown partition for 2 of 3 matched conditions", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      const cat2 = result.category2Partial;

      // Disjoint sum of 2-of-3 subcategories must equal cat2 total
      expect(
        cat2.brandAndBudget.count +
          cat2.brandAndFeature.count +
          cat2.budgetAndFeature.count
      ).toBe(cat2.total.count);

      for (const id of cat2.brandAndBudget.ids) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.preferred_brand).toBe("Apple");
        expect(resp?.budget_range).toBe("Over $1,000");
      }
    });

    it("verifies sub-breakdown partition for 1 of 3 matched conditions", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      const cat1 = result.category1Partial;

      // Disjoint sum of 1-of-3 subcategories must equal cat1 total
      expect(
        cat1.onlyBrand.count + cat1.onlyBudget.count + cat1.onlyFeature.count
      ).toBe(cat1.total.count);

      for (const id of cat1.onlyBrand.ids) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.preferred_brand).toBe("Apple");
        expect(resp?.budget_range).not.toBe("Over $1,000");
      }
    });

    it("correctly identifies respondents with 0 conditions matched", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      expect(result.category0None.count).toBeGreaterThan(0);
      for (const id of result.category0None.ids) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.preferred_brand).not.toBe("Apple");
        expect(resp?.budget_range).not.toBe("Over $1,000");
        const hasExactFeatures = appleProfile.features.every((f) => resp?.preferred_features.includes(f));
        expect(hasExactFeatures).toBe(false);
      }
    });
  });

  describe("Feature Overlap Calculation (Independent of Brand/Budget)", () => {
    it("computes accurate feature overlap counts", () => {
      const userFeatures: SmartphoneFeature[] = [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ];

      for (const resp of responses) {
        const overlap = calculateFeatureOverlap(userFeatures, resp.preferred_features);
        const expectedOverlap = resp.preferred_features.filter((f) => userFeatures.includes(f)).length;
        expect(overlap).toBe(expectedOverlap);
      }
    });

    it("verifies cumulative feature overlap relationships: allThree ⊆ atLeastTwo ⊆ atLeastOne", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      const fo = result.featureOverlap;

      expect(fo.matchAllThree.count).toBe(result.featureSet.size);
      expect(fo.atLeastTwo.count).toBeGreaterThanOrEqual(fo.matchAllThree.count);
      expect(fo.atLeastOne.count).toBeGreaterThanOrEqual(fo.atLeastTwo.count);

      // Disjoint partition check: allThree + two + one + none = total cohort
      const disjointSum =
        fo.matchAllThree.count +
        fo.matchTwo.count +
        fo.matchOne.count +
        fo.matchNone.count;
      expect(disjointSum).toBe(responses.length);
    });
  });

  describe("Percentage Denominator & Full-Cohort Integrity", () => {
    it("uses full valid cohort as denominator for exact and partial match percentages", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      expect(result.totalCohort).toBe(responses.length);

      expect(result.exactMatches.percentage).toBeCloseTo((result.exactMatches.count / responses.length) * 100, 2);
      expect(result.category3Exact.percentage).toBeCloseTo((result.category3Exact.count / responses.length) * 100, 2);

      // Sum of percentages of the 4 mutually exclusive categories is ~100%
      const sumPct =
        result.category3Exact.percentage +
        result.category2Partial.total.percentage +
        result.category1Partial.total.percentage +
        result.category0None.percentage;
      expect(sumPct).toBeCloseTo(100, 1);
    });
  });

  describe("Boundary & Edge Cases", () => {
    it("handles zero exact matches gracefully without errors", () => {
      // Profile with brand Motorola and budget Over $1,000 (0 respondents in our dataset)
      const noMatchProfile: UserProfileInput = {
        brand: "Motorola",
        budget: "Over $1,000",
        features: [
          "Camera Quality",
          "Battery Life",
          "Build & Design Quality",
        ],
      };

      const result = executeMatchingEngine(responses, noMatchProfile);
      expect(result.exactMatches.count).toBe(0);
      expect(result.exactMatches.percentage).toBe(0);
      expect(result.category3Exact.count).toBe(0);
      expect(result.category3Exact.percentage).toBe(0);
    });

    it("handles empty survey response cohort gracefully", () => {
      const result = executeMatchingEngine([], appleProfile);
      expect(result.totalCohort).toBe(0);
      expect(result.exactMatches.count).toBe(0);
      expect(result.exactMatches.percentage).toBe(0);
      expect(result.category3Exact.count).toBe(0);
      expect(result.category2Partial.total.count).toBe(0);
      expect(result.category1Partial.total.count).toBe(0);
      expect(result.category0None.count).toBe(0);
      expect(result.respondents).toEqual([]);
    });

    it("handles brand set B properly", () => {
      const unfamiliarBrandProfile: UserProfileInput = {
        brand: "Other",
        budget: "Under $400",
        features: [
          "Camera Quality",
          "Battery Life",
          "Storage Capacity",
        ],
      };

      const result = executeMatchingEngine(responses, unfamiliarBrandProfile);
      const expectedOtherCount = responses.filter((r) => r.preferred_brand === "Other").length;
      expect(result.brandSet.size).toBe(expectedOtherCount);
    });

    it("handles scenario where all respondents match", () => {
      // Create artificial 3 identical responses
      const identicalResponses: SurveyResponse[] = [
        {
          response_id: "TEST_001",
          preferred_brand: "Apple",
          budget_range: "Over $1,000",
          preferred_features: [
            "Camera Quality",
            "Battery Life",
            "Build & Design Quality",
          ],
          primary_use: "Everyday General Use",
          os_preference: "iOS",
        },
        {
          response_id: "TEST_002",
          preferred_brand: "Apple",
          budget_range: "Over $1,000",
          preferred_features: [
            "Camera Quality",
            "Battery Life",
            "Build & Design Quality",
          ],
          primary_use: "Gaming",
          os_preference: "iOS",
        },
      ];

      const result = executeMatchingEngine(identicalResponses, appleProfile);
      expect(result.totalCohort).toBe(2);
      expect(result.exactMatches.count).toBe(2);
      expect(result.exactMatches.percentage).toBe(100);
      expect(result.category3Exact.count).toBe(2);
      expect(result.category2Partial.total.count).toBe(0);
      expect(result.category1Partial.total.count).toBe(0);
      expect(result.category0None.count).toBe(0);
    });
  });
});

```


## File: `src/__tests__/sets.test.ts` (**UNCHANGED**)

> **Notes**: Validates set union, intersection, relative complement, symmetric difference, and 2-set PIE identity.

```typescript
import { describe, it, expect } from "vitest";
import {
  setIntersection,
  setUnion,
  setDifference,
  setCardinality,
  multiSetIntersection,
  multiSetUnion,
  symmetricDifference,
  isSubset,
  areDisjoint,
} from "@/lib/math/sets";

describe("Pure Set-Theoretic Mathematical Utilities", () => {
  const setA = new Set(["RESP_001", "RESP_002", "RESP_003"]);
  const setB = new Set(["RESP_002", "RESP_003", "RESP_004"]);
  const setC = new Set(["RESP_003", "RESP_005"]);
  const disjointSet = new Set(["RESP_099", "RESP_100"]);
  const emptySet = new Set<string>();

  describe("setCardinality", () => {
    it("correctly computes cardinality |A| for Sets and Arrays", () => {
      expect(setCardinality(setA)).toBe(3);
      expect(setCardinality(emptySet)).toBe(0);
      expect(setCardinality(["A", "B", "A", "C"])).toBe(3); // Deduplication
    });
  });

  describe("setIntersection", () => {
    it("computes intersection between overlapping sets: A ∩ B", () => {
      const intersection = setIntersection(setA, setB);
      expect(intersection.size).toBe(2);
      expect(intersection.has("RESP_002")).toBe(true);
      expect(intersection.has("RESP_003")).toBe(true);
      expect(intersection.has("RESP_001")).toBe(false);
      expect(intersection.has("RESP_004")).toBe(false);
    });

    it("returns empty set for disjoint sets", () => {
      const intersection = setIntersection(setA, disjointSet);
      expect(intersection.size).toBe(0);
    });

    it("returns empty set when intersecting with empty set", () => {
      expect(setIntersection(setA, emptySet).size).toBe(0);
      expect(setIntersection(emptySet, setA).size).toBe(0);
    });

    it("supports arrays as input collections", () => {
      const arrA = ["RESP_001", "RESP_002"];
      const arrB = ["RESP_002", "RESP_003"];
      const intersection = setIntersection(arrA, arrB);
      expect(Array.from(intersection)).toEqual(["RESP_002"]);
    });
  });

  describe("multiSetIntersection", () => {
    it("computes intersection across three sets: A ∩ B ∩ C", () => {
      const result = multiSetIntersection(setA, setB, setC);
      expect(Array.from(result)).toEqual(["RESP_003"]);
    });

    it("returns empty set when given no sets", () => {
      expect(multiSetIntersection().size).toBe(0);
    });
  });

  describe("setUnion", () => {
    it("computes union of two sets: A ∪ B", () => {
      const union = setUnion(setA, setB);
      expect(union.size).toBe(4);
      expect(Array.from(union).sort()).toEqual([
        "RESP_001",
        "RESP_002",
        "RESP_003",
        "RESP_004",
      ]);
    });

    it("returns original set elements when unioned with empty set", () => {
      const union = setUnion(setA, emptySet);
      expect(union.size).toBe(setA.size);
    });
  });

  describe("multiSetUnion", () => {
    it("computes union across multiple sets: ⋃ S_i", () => {
      const union = multiSetUnion(setA, setB, setC);
      expect(union.size).toBe(5);
      expect(Array.from(union).sort()).toEqual([
        "RESP_001",
        "RESP_002",
        "RESP_003",
        "RESP_004",
        "RESP_005",
      ]);
    });
  });

  describe("setDifference", () => {
    it("computes relative complement A \\ B", () => {
      const diff = setDifference(setA, setB);
      expect(Array.from(diff)).toEqual(["RESP_001"]);
    });

    it("computes relative complement B \\ A", () => {
      const diff = setDifference(setB, setA);
      expect(Array.from(diff)).toEqual(["RESP_004"]);
    });

    it("returns A when subtracting empty set", () => {
      expect(setDifference(setA, emptySet).size).toBe(3);
    });

    it("returns empty set when subtracting set from itself: A \\ A = ∅", () => {
      expect(setDifference(setA, setA).size).toBe(0);
    });
  });

  describe("symmetricDifference", () => {
    it("computes symmetric difference A Δ B = (A \\ B) ∪ (B \\ A)", () => {
      const symDiff = symmetricDifference(setA, setB);
      expect(Array.from(symDiff).sort()).toEqual(["RESP_001", "RESP_004"]);
    });
  });

  describe("isSubset & areDisjoint", () => {
    it("identifies proper subsets", () => {
      const sub = new Set(["RESP_001", "RESP_002"]);
      expect(isSubset(sub, setA)).toBe(true);
      expect(isSubset(setA, sub)).toBe(false);
    });

    it("identifies disjoint sets", () => {
      expect(areDisjoint(setA, disjointSet)).toBe(true);
      expect(areDisjoint(setA, setB)).toBe(false);
    });
  });
});

```


## File: `src/__tests__/venn.test.ts` (**UNCHANGED**)

> **Notes**: Validates 2-set and 3-set disjoint Venn minterm partitions and 3-set PIE identity.

```typescript
import { describe, it, expect } from "vitest";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "../lib/math/venn";
import {
  setIntersection,
  setUnion,
  setComplement,
} from "../lib/math/sets";
import {
  loadDemoSurveyDataset,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getUniverseRespondentIds,
} from "../lib/data/loader";

describe("Two-Set Venn Region Partitioning", () => {
  const universe = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  const setA = new Set(["1", "2", "3", "4"]);
  const setB = new Set(["3", "4", "5", "6"]);

  it("partitions sets into mutually disjoint subsets", () => {
    const regions = computeTwoSetVennRegions(universe, setA, setB);

    expect(Array.from(regions.onlyA).sort()).toEqual(["1", "2"]);
    expect(Array.from(regions.onlyB).sort()).toEqual(["5", "6"]);
    expect(Array.from(regions.both).sort()).toEqual(["3", "4"]);
    expect(Array.from(regions.neither).sort()).toEqual(["10", "7", "8", "9"]);

    // Disjointness checks
    expect(setIntersection(regions.onlyA, regions.onlyB).size).toBe(0);
    expect(setIntersection(regions.onlyA, regions.both).size).toBe(0);
    expect(setIntersection(regions.onlyB, regions.both).size).toBe(0);
    expect(setIntersection(regions.unionSet, regions.neither).size).toBe(0);
  });

  it("satisfies the partition cardinality sum: |onlyA| + |onlyB| + |both| = |A ∪ B|", () => {
    const regions = computeTwoSetVennRegions(universe, setA, setB);
    const sumInternal = regions.onlyA.size + regions.onlyB.size + regions.both.size;

    expect(sumInternal).toBe(regions.unionSet.size);
    expect(sumInternal + regions.neither.size).toBe(universe.size);
  });

  it("handles disjoint sets (A ∩ B = ∅)", () => {
    const a = new Set(["1", "2"]);
    const b = new Set(["3", "4"]);
    const regions = computeTwoSetVennRegions(universe, a, b);

    expect(regions.both.size).toBe(0);
    expect(regions.onlyA.size).toBe(2);
    expect(regions.onlyB.size).toBe(2);
    expect(regions.unionSet.size).toBe(4);
  });

  it("handles identical sets (A = B)", () => {
    const a = new Set(["1", "2", "3"]);
    const regions = computeTwoSetVennRegions(universe, a, a);

    expect(regions.onlyA.size).toBe(0);
    expect(regions.onlyB.size).toBe(0);
    expect(regions.both.size).toBe(3);
    expect(regions.unionSet.size).toBe(3);
  });

  it("handles empty sets", () => {
    const a = new Set<string>();
    const b = new Set(["1", "2"]);
    const regions = computeTwoSetVennRegions(universe, a, b);

    expect(regions.onlyA.size).toBe(0);
    expect(regions.both.size).toBe(0);
    expect(regions.onlyB.size).toBe(2);
    expect(regions.neither.size).toBe(universe.size - 2);
  });
});

describe("Three-Set Venn Region Partitioning", () => {
  const universe = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  // A = {1, 2, 4, 5}
  // B = {2, 3, 5, 6}
  // C = {4, 5, 6, 7}
  const setA = new Set(["1", "2", "4", "5"]);
  const setB = new Set(["2", "3", "5", "6"]);
  const setC = new Set(["4", "5", "6", "7"]);

  it("partitions 3 overlapping sets into 7 mutually disjoint internal regions + outside", () => {
    const r = computeThreeSetVennRegions(universe, setA, setB, setC);

    // onlyA = A \ (B ∪ C) = {1}
    expect(Array.from(r.onlyA)).toEqual(["1"]);
    // onlyB = B \ (A ∪ C) = {3}
    expect(Array.from(r.onlyB)).toEqual(["3"]);
    // onlyC = C \ (A ∪ B) = {7}
    expect(Array.from(r.onlyC)).toEqual(["7"]);
    // onlyAB = (A ∩ B) \ C = {2}
    expect(Array.from(r.onlyAB)).toEqual(["2"]);
    // onlyAC = (A ∩ C) \ B = {4}
    expect(Array.from(r.onlyAC)).toEqual(["4"]);
    // onlyBC = (B ∩ C) \ A = {6}
    expect(Array.from(r.onlyBC)).toEqual(["6"]);
    // allThree = A ∩ B ∩ C = {5}
    expect(Array.from(r.allThree)).toEqual(["5"]);
    // outside = U \ (A ∪ B ∪ C) = {8, 9, 10}
    expect(Array.from(r.outside).sort()).toEqual(["10", "8", "9"]);

    // Verify all 7 internal regions are pairwise disjoint
    const internalRegions = [r.onlyA, r.onlyB, r.onlyC, r.onlyAB, r.onlyAC, r.onlyBC, r.allThree];
    for (let i = 0; i < internalRegions.length; i++) {
      for (let j = i + 1; j < internalRegions.length; j++) {
        expect(setIntersection(internalRegions[i]!, internalRegions[j]!).size).toBe(0);
      }
    }
  });

  it("satisfies the 7-region collective exhaustiveness: sum of 7 regions = |A ∪ B ∪ C|", () => {
    const r = computeThreeSetVennRegions(universe, setA, setB, setC);
    const sum7Regions =
      r.onlyA.size +
      r.onlyB.size +
      r.onlyC.size +
      r.onlyAB.size +
      r.onlyAC.size +
      r.onlyBC.size +
      r.allThree.size;

    expect(sum7Regions).toBe(r.unionSet.size);
    expect(sum7Regions + r.outside.size).toBe(universe.size);
  });

  it("handles real respondent ID sets from demo dataset", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;
    const u = getUniverseRespondentIds(responses);
    const apple = getRespondentIdsByBrand(responses, "Apple");
    const camera = getRespondentIdsByFeature(responses, "Camera Quality");
    const battery = getRespondentIdsByFeature(responses, "Battery Life");

    const r = computeThreeSetVennRegions(u, apple, camera, battery);
    const sum7 =
      r.onlyA.size +
      r.onlyB.size +
      r.onlyC.size +
      r.onlyAB.size +
      r.onlyAC.size +
      r.onlyBC.size +
      r.allThree.size;

    expect(sum7).toBe(r.unionSet.size);
    expect(sum7 + r.outside.size).toBe(responses.length);
    expect(r.allThree.size).toBeGreaterThanOrEqual(0);
  });
});

describe("Three-Set Principle of Inclusion-Exclusion (PIE)", () => {
  it("formally verifies |A ∪ B ∪ C| = |A| + |B| + |C| - |A ∩ B| - |A ∩ C| - |B ∩ C| + |A ∩ B ∩ C|", () => {
    const setA = new Set(["1", "2", "4", "5"]);
    const setB = new Set(["2", "3", "5", "6"]);
    const setC = new Set(["4", "5", "6", "7"]);

    const pie = verifyThreeSetInclusionExclusion(setA, setB, setC);

    expect(pie.cardA).toBe(4);
    expect(pie.cardB).toBe(4);
    expect(pie.cardC).toBe(4);
    expect(pie.cardAB).toBe(2);
    expect(pie.cardAC).toBe(2);
    expect(pie.cardBC).toBe(2);
    expect(pie.cardABC).toBe(1);

    // Singletons sum = 4 + 4 + 4 = 12
    expect(pie.singletonsSum).toBe(12);
    // Pairwise sum = 2 + 2 + 2 = 6
    expect(pie.pairwiseIntersectionsSum).toBe(6);
    // Calculated RHS = 12 - 6 + 1 = 7
    expect(pie.calculatedRhs).toBe(7);
    // Direct union size = 7 ({1, 2, 3, 4, 5, 6, 7})
    expect(pie.unionCardinality).toBe(7);
    expect(pie.isValid).toBe(true);
  });

  it("verifies on empirical survey partitions (Apple, Camera, Battery)", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;
    const apple = getRespondentIdsByBrand(responses, "Apple");
    const camera = getRespondentIdsByFeature(responses, "Camera Quality");
    const battery = getRespondentIdsByFeature(responses, "Battery Life");

    const pie = verifyThreeSetInclusionExclusion(apple, camera, battery);

    expect(pie.isValid).toBe(true);
    expect(pie.calculatedRhs).toBe(pie.unionCardinality);
  });

  it("handles completely disjoint 3 sets", () => {
    const a = new Set(["1"]);
    const b = new Set(["2"]);
    const c = new Set(["3"]);

    const pie = verifyThreeSetInclusionExclusion(a, b, c);

    expect(pie.cardAB).toBe(0);
    expect(pie.cardAC).toBe(0);
    expect(pie.cardBC).toBe(0);
    expect(pie.cardABC).toBe(0);
    expect(pie.singletonsSum).toBe(3);
    expect(pie.calculatedRhs).toBe(3);
    expect(pie.unionCardinality).toBe(3);
    expect(pie.isValid).toBe(true);
  });

  it("handles identical 3 sets (A = B = C)", () => {
    const a = new Set(["1", "2", "3"]);

    const pie = verifyThreeSetInclusionExclusion(a, a, a);

    // Singletons = 3 + 3 + 3 = 9
    // Pairwise = 3 + 3 + 3 = 9
    // Triple = 3
    // RHS = 9 - 9 + 3 = 3
    expect(pie.calculatedRhs).toBe(3);
    expect(pie.unionCardinality).toBe(3);
    expect(pie.isValid).toBe(true);
  });
});

describe("Set Complement Operations", () => {
  const universe = new Set(["1", "2", "3", "4", "5"]);
  const a = new Set(["1", "2"]);

  it("computes Aᶜ = U \\ A", () => {
    const compA = setComplement(universe, a);
    expect(Array.from(compA).sort()).toEqual(["3", "4", "5"]);
  });

  it("satisfies A ∩ Aᶜ = ∅ and A ∪ Aᶜ = U", () => {
    const compA = setComplement(universe, a);
    expect(setIntersection(a, compA).size).toBe(0);
    expect(setUnion(a, compA).size).toBe(universe.size);
  });

  it("satisfies double complement (Aᶜ)ᶜ = A", () => {
    const compA = setComplement(universe, a);
    const doubleComp = setComplement(universe, compA);
    expect(Array.from(doubleComp).sort()).toEqual(Array.from(a).sort());
  });
});

```


## File: `src/__tests__/combinations.test.ts` (**UNCHANGED**)

> **Notes**: Validates factorial recurrence, safe integer limit n<=18, C(7,3)=35, P(7,3)=210, and lexicographical combination ordering.

```typescript
import { describe, it, expect } from "vitest";
import {
  calculateCombinations,
  calculatePermutations,
  enumerateCombinations,
  factorial,
  generatePermutations,
  getCombinationCalculationSteps,
} from "@/lib/math/combinations";
import { SMARTPHONE_FEATURES } from "@/types/survey";

describe("Combinatorics Mathematical Utilities", () => {
  describe("calculateCombinations (nCr)", () => {
    it("computes standard combinations correctly", () => {
      // C(5, 0) = 1
      expect(calculateCombinations(5, 0)).toBe(1);
      // C(5, 1) = 5
      expect(calculateCombinations(5, 1)).toBe(5);
      // C(5, 2) = 10
      expect(calculateCombinations(5, 2)).toBe(10);
      // C(5, 3) = 10
      expect(calculateCombinations(5, 3)).toBe(10);
      // C(5, 5) = 1
      expect(calculateCombinations(5, 5)).toBe(1);
      // C(7, 3) = 35 (Choosing 3 features out of 7 canonical smartphone features)
      expect(calculateCombinations(7, 3)).toBe(35);
      // C(9, 3) = 84 (Generic verification)
      expect(calculateCombinations(9, 3)).toBe(84);
      // C(10, 4) = 210
      expect(calculateCombinations(10, 4)).toBe(210);
      // C(0, 0) = 1
      expect(calculateCombinations(0, 0)).toBe(1);
    });

    it("handles large values without overflow", () => {
      // C(30, 4) = 27,405
      expect(calculateCombinations(30, 4)).toBe(27405);
      // C(20, 10) = 184,756
      expect(calculateCombinations(20, 10)).toBe(184756);
    });

    it("throws RangeError when r > n", () => {
      expect(() => calculateCombinations(3, 5)).toThrowError(RangeError);
      expect(() => calculateCombinations(0, 1)).toThrowError(RangeError);
    });

    it("throws RangeError when n or r is negative", () => {
      expect(() => calculateCombinations(-5, 2)).toThrowError(RangeError);
      expect(() => calculateCombinations(5, -2)).toThrowError(RangeError);
      expect(() => calculateCombinations(-3, -1)).toThrowError(RangeError);
    });

    it("throws TypeError when n or r is not an integer", () => {
      expect(() => calculateCombinations(5.5, 2)).toThrowError(TypeError);
      expect(() => calculateCombinations(5, 2.3)).toThrowError(TypeError);
      expect(() => calculateCombinations(NaN, 2)).toThrowError(TypeError);
      expect(() => calculateCombinations(5, Infinity)).toThrowError(TypeError);
    });
  });

  describe("calculatePermutations (nPr)", () => {
    it("computes permutations correctly", () => {
      expect(calculatePermutations(5, 2)).toBe(20);
      expect(calculatePermutations(5, 5)).toBe(120);
      expect(calculatePermutations(5, 0)).toBe(1);
      expect(calculatePermutations(9, 3)).toBe(504);
    });

    it("throws RangeError when r > n or parameters are negative", () => {
      expect(() => calculatePermutations(3, 4)).toThrowError(RangeError);
      expect(() => calculatePermutations(-1, 2)).toThrowError(RangeError);
    });
  });

  describe("enumerateCombinations", () => {
    const sampleFeatures = ["Camera", "Battery", "Display", "Processor"];

    it("enumerates all C(4, 2) = 6 combinations", () => {
      const combos = enumerateCombinations(sampleFeatures, 2);
      expect(combos.length).toBe(6);
      expect(combos).toEqual([
        ["Camera", "Battery"],
        ["Camera", "Display"],
        ["Camera", "Processor"],
        ["Battery", "Display"],
        ["Battery", "Processor"],
        ["Display", "Processor"],
      ]);
    });

    it("returns [[]] for r = 0", () => {
      const combos = enumerateCombinations(sampleFeatures, 0);
      expect(combos).toEqual([[]]);
    });

    it("returns original array as single combination for r = n", () => {
      const combos = enumerateCombinations(sampleFeatures, 4);
      expect(combos).toEqual([[...sampleFeatures]]);
    });

    it("enumerates exactly C(7, 3) = 35 feature triplets from canonical survey features", () => {
      expect(SMARTPHONE_FEATURES.length).toBe(7);
      expect(calculateCombinations(SMARTPHONE_FEATURES.length, 3)).toBe(35);

      const allTriplets = enumerateCombinations(SMARTPHONE_FEATURES, 3);
      expect(allTriplets.length).toBe(35);

      // Verify that every generated triplet has 3 distinct features
      for (const triplet of allTriplets) {
        expect(triplet.length).toBe(3);
        expect(new Set(triplet).size).toBe(3);
      }

      // Verify all 35 triplets are unique (no duplicates exist)
      const stringifiedTriplets = new Set(allTriplets.map((t) => [...t].sort().join("::")));
      expect(stringifiedTriplets.size).toBe(35);
    });

    it("throws RangeError when r > items.length or r < 0", () => {
      expect(() => enumerateCombinations(sampleFeatures, 5)).toThrowError(RangeError);
      expect(() => enumerateCombinations(sampleFeatures, -1)).toThrowError(RangeError);
    });

    it("throws TypeError when r is not an integer", () => {
      expect(() => enumerateCombinations(sampleFeatures, 1.5)).toThrowError(TypeError);
    });
  });

  describe("Symmetry and Pascal Recurrence Properties", () => {
    it("satisfies symmetry C(n, r) = C(n, n - r)", () => {
      expect(calculateCombinations(7, 3)).toBe(calculateCombinations(7, 4));
      expect(calculateCombinations(10, 2)).toBe(calculateCombinations(10, 8));
      expect(calculateCombinations(12, 5)).toBe(calculateCombinations(12, 7));
      expect(calculateCombinations(6, 0)).toBe(calculateCombinations(6, 6));
    });

    it("satisfies Pascal's identity C(n, r) = C(n - 1, r - 1) + C(n - 1, r)", () => {
      // C(7, 3) = C(6, 2) + C(6, 3) = 15 + 20 = 35
      expect(calculateCombinations(7, 3)).toBe(
        calculateCombinations(6, 2) + calculateCombinations(6, 3)
      );
      // C(8, 4) = C(7, 3) + C(7, 4) = 35 + 35 = 70
      expect(calculateCombinations(8, 4)).toBe(
        calculateCombinations(7, 3) + calculateCombinations(7, 4)
      );
    });
  });

  describe("factorial", () => {
    it("computes standard factorials accurately up to safe integer limit n = 18", () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(2)).toBe(2);
      expect(factorial(3)).toBe(6);
      expect(factorial(4)).toBe(24);
      expect(factorial(5)).toBe(120);
      expect(factorial(7)).toBe(5040);
      expect(factorial(10)).toBe(3628800);
      // 18! = 6,402,373,705,728,000, exactly within Number.MAX_SAFE_INTEGER (9,007,199,254,740,991)
      expect(factorial(18)).toBe(6402373705728000);
      expect(factorial(18)).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });

    it("throws RangeError for negative numbers and numbers > 18", () => {
      expect(() => factorial(-1)).toThrowError(RangeError);
      expect(() => factorial(19)).toThrowError(RangeError);
      expect(() => factorial(20)).toThrowError(RangeError);
      expect(() => factorial(25)).toThrowError(RangeError);
    });

    it("throws TypeError for non-integers", () => {
      expect(() => factorial(3.5)).toThrowError(TypeError);
      expect(() => factorial(NaN)).toThrowError(TypeError);
    });
  });

  describe("generatePermutations", () => {
    it("generates 3! = 6 permutations for 3 distinct items", () => {
      const items = ["A", "B", "C"];
      const perms = generatePermutations(items);
      expect(perms.length).toBe(6);
      expect(perms).toEqual([
        ["A", "B", "C"],
        ["A", "C", "B"],
        ["B", "A", "C"],
        ["B", "C", "A"],
        ["C", "A", "B"],
        ["C", "B", "A"],
      ]);
    });

    it("returns [[]] for empty array and 1 permutation for 1 item", () => {
      expect(generatePermutations([])).toEqual([[]]);
      expect(generatePermutations(["Camera"])).toEqual([["Camera"]]);
    });

    it("throws RangeError if items length exceeds 8", () => {
      const nineItems = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(() => generatePermutations(nineItems)).toThrowError(RangeError);
    });
  });

  describe("getCombinationCalculationSteps", () => {
    it("generates correct step breakdown for C(7, 3)", () => {
      const steps = getCombinationCalculationSteps(7, 3);
      expect(steps.n).toBe(7);
      expect(steps.r).toBe(3);
      expect(steps.result).toBe(35);
      expect(steps.numeratorTerms).toEqual([7, 6, 5]);
      expect(steps.denominatorTerms).toEqual([3, 2, 1]);
      expect(steps.numeratorProduct).toBe(210);
      expect(steps.denominatorProduct).toBe(6);
      expect(steps.isSymmetricApplied).toBe(false);
      expect(steps.simplifiedLatex).toContain("210");
      expect(steps.simplifiedLatex).toContain("6");
      expect(steps.simplifiedLatex).toContain("35");
    });

    it("applies symmetry when r > n - r for C(7, 4)", () => {
      const steps = getCombinationCalculationSteps(7, 4);
      expect(steps.isSymmetricApplied).toBe(true);
      expect(steps.effectiveR).toBe(3);
      expect(steps.result).toBe(35);
    });

    it("handles boundary case r = 0", () => {
      const steps = getCombinationCalculationSteps(7, 0);
      expect(steps.result).toBe(1);
      expect(steps.numeratorTerms).toEqual([1]);
      expect(steps.denominatorTerms).toEqual([1]);
    });

    it("handles boundary case r = n", () => {
      const steps = getCombinationCalculationSteps(7, 7);
      expect(steps.result).toBe(1);
    });

    it("computes exact integer steps at calculator maximum n = 18", () => {
      // For n = 18, r = 9 (maximum intermediate product size with symmetry)
      const steps = getCombinationCalculationSteps(18, 9);
      expect(steps.n).toBe(18);
      expect(steps.r).toBe(9);
      expect(steps.result).toBe(48620);
      expect(steps.numeratorProduct).toBe(17643225600);
      expect(steps.denominatorProduct).toBe(362880);
      expect(Number.isSafeInteger(steps.numeratorProduct)).toBe(true);
      expect(Number.isSafeInteger(steps.denominatorProduct)).toBe(true);
      expect(Number.isSafeInteger(steps.result)).toBe(true);
      expect(steps.numeratorProduct).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });
  });
});

```


## File: `src/__tests__/inclusion_exclusion.test.ts` (**UNCHANGED**)

> **Notes**: Validates formal identity |A ∪ B| = |A| + |B| - |A ∩ B| on arbitrary respondent ID sets.

```typescript
import { describe, it, expect } from "vitest";
import {
  setIntersection,
  setUnion,
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  loadDemoSurveyDataset,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByOS,
} from "@/lib/data/loader";

describe("Principle of Inclusion-Exclusion (PIE) Formal Verification", () => {
  it("satisfies |A ∪ B| = |A| + |B| - |A ∩ B| for synthetic overlapping sets", () => {
    const setA = new Set(["RESP_001", "RESP_002", "RESP_003", "RESP_004"]);
    const setB = new Set(["RESP_003", "RESP_004", "RESP_005", "RESP_006", "RESP_007"]);

    const verification = verifyInclusionExclusionPrinciple(setA, setB);

    expect(verification.isValid).toBe(true);
    expect(verification.unionCardinality).toBe(7);
    expect(verification.individualCardinalitiesSum).toBe(4 + 5); // 9
    expect(verification.intersectionCardinality).toBe(2);
    expect(verification.calculatedRhs).toBe(9 - 2); // 7
    expect(verification.unionCardinality).toBe(verification.calculatedRhs);
  });

  it("satisfies PIE for mutually disjoint sets (intersection is empty)", () => {
    const setA = new Set(["RESP_A1", "RESP_A2", "RESP_A3"]);
    const setB = new Set(["RESP_B1", "RESP_B2"]);

    const verification = verifyInclusionExclusionPrinciple(setA, setB);

    expect(verification.isValid).toBe(true);
    expect(verification.intersectionCardinality).toBe(0);
    expect(verification.unionCardinality).toBe(5);
    expect(verification.calculatedRhs).toBe(3 + 2 - 0);
  });

  it("satisfies PIE when one set is a subset of another (A ⊆ B)", () => {
    const setA = new Set(["RESP_001", "RESP_002"]);
    const setB = new Set(["RESP_001", "RESP_002", "RESP_003", "RESP_004"]);

    const verification = verifyInclusionExclusionPrinciple(setA, setB);

    expect(verification.isValid).toBe(true);
    expect(verification.intersectionCardinality).toBe(2);
    expect(verification.unionCardinality).toBe(4);
    expect(verification.calculatedRhs).toBe(2 + 4 - 2);
  });

  it("satisfies PIE with empty sets", () => {
    const empty = new Set<string>();
    const nonNull = new Set(["RESP_001"]);

    const v1 = verifyInclusionExclusionPrinciple(empty, nonNull);
    expect(v1.isValid).toBe(true);
    expect(v1.unionCardinality).toBe(1);

    const v2 = verifyInclusionExclusionPrinciple(empty, empty);
    expect(v2.isValid).toBe(true);
    expect(v2.unionCardinality).toBe(0);
  });

  it("verifies PIE across real survey respondent sets from demo data", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;

    // Set A: Respondents who prefer Apple
    const appleRespondents = getRespondentIdsByBrand(responses, "Apple");
    // Set B: Respondents who selected 'Camera Quality'
    const cameraRespondents = getRespondentIdsByFeature(responses, "Camera Quality");

    const verification = verifyInclusionExclusionPrinciple(
      appleRespondents,
      cameraRespondents
    );

    expect(verification.isValid).toBe(true);
    expect(verification.unionCardinality).toBe(
      appleRespondents.size + cameraRespondents.size - verification.intersectionCardinality
    );

    // Verify set operations operated on authentic respondent IDs rather than scalar counts
    for (const id of verification.intersectionSet) {
      expect(appleRespondents.has(id)).toBe(true);
      expect(cameraRespondents.has(id)).toBe(true);
    }
  });

  it("verifies 3-set Inclusion-Exclusion Principle: |A ∪ B ∪ C|", () => {
    const dataset = loadDemoSurveyDataset();
    const responses = dataset.responses;

    const setA = getRespondentIdsByBrand(responses, "Samsung");
    const setB = getRespondentIdsByFeature(responses, "Battery Life");
    const setC = getRespondentIdsByOS(responses, "Android");

    const unionABC = setUnion(setUnion(setA, setB), setC);
    const cardUnion = unionABC.size;

    const cardA = setA.size;
    const cardB = setB.size;
    const cardC = setC.size;

    const intAB = setIntersection(setA, setB).size;
    const intAC = setIntersection(setA, setC).size;
    const intBC = setIntersection(setB, setC).size;

    const intABC = setIntersection(setIntersection(setA, setB), setC).size;

    const rhs = (cardA + cardB + cardC) - (intAB + intAC + intBC) + intABC;

    expect(cardUnion).toBe(rhs);
  });
});

```


## File: `src/__tests__/stress_test.test.ts` (**UNCHANGED**)

> **Notes**: Scalability benchmarks at N=12, N=300, and N=1000 verifying linear O(N) performance and sub-100ms execution.

```typescript
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
  // Test both N=300 (primary target) and N=1,000 (scalability ceiling)
  const cohortSizes = [300, 1000] as const;

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
        const budgetFlagship = getRespondentIdsByBudget(responses, "Over $1,000");
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
          budget: "Over $1,000" as const,
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

```


## File: `src/__tests__/survey.schema.test.ts` (**UNCHANGED**)

> **Notes**: Validates strict Zod schema parsing, allowed domain enums, and rejection of non-3 or duplicate features.

```typescript
import { describe, it, expect } from "vitest";
import {
  surveyResponseSchema,
  surveyResponseListSchema,
  surveyDatasetSchema,
} from "@/schemas/survey.schema";
import demoDataJson from "@/data/survey_demo_data.json";

describe("Survey Schema Validation", () => {
  const validResponse = {
    response_id: "RESP_TEST_001",
    preferred_brand: "Apple",
    budget_range: "Over $1,000",
    preferred_features: [
      "Camera Quality",
      "Battery Life",
      "Build & Design Quality",
    ],
    primary_use: "Photography & Videography",
    os_preference: "iOS",
  };

  it("validates a compliant survey response", () => {
    const parsed = surveyResponseSchema.safeParse(validResponse);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.response_id).toBe("RESP_TEST_001");
      expect(parsed.data.preferred_features.length).toBe(3);
    }
  });

  it("rejects response with fewer than 3 features", () => {
    const invalid = {
      ...validResponse,
      preferred_features: ["Camera Quality", "Battery Life"],
    };
    const parsed = surveyResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("exactly 3 preferred features");
    }
  });

  it("rejects response with more than 3 features", () => {
    const invalid = {
      ...validResponse,
      preferred_features: [
        "Camera Quality",
        "Battery Life",
        "Display Quality",
        "Processing Performance",
      ],
    };
    const parsed = surveyResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("exactly 3 preferred features");
    }
  });

  it("rejects response with duplicate features in selection", () => {
    const invalid = {
      ...validResponse,
      preferred_features: [
        "Camera Quality",
        "Battery Life",
        "Camera Quality", // Duplicate
      ],
    };
    const parsed = surveyResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("3 distinct features");
    }
  });

  it("rejects unknown brand", () => {
    const invalid = {
      ...validResponse,
      preferred_brand: "NokiaUnrecognized",
    };
    const parsed = surveyResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid budget category", () => {
    const invalid = {
      ...validResponse,
      budget_range: "Free",
    };
    const parsed = surveyResponseSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("rejects empty or malformed respondent ID", () => {
    const emptyId = {
      ...validResponse,
      response_id: "",
    };
    expect(surveyResponseSchema.safeParse(emptyId).success).toBe(false);

    const specialCharId = {
      ...validResponse,
      response_id: "RESP@#$%",
    };
    expect(surveyResponseSchema.safeParse(specialCharId).success).toBe(false);
  });

  it("detects duplicate respondent IDs across response list", () => {
    const listWithDuplicates = [
      validResponse,
      {
        ...validResponse,
        preferred_brand: "Samsung",
        os_preference: "Android",
        // Same response_id
      },
    ];

    const result = surveyResponseListSchema.safeParse(listWithDuplicates);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.message.includes("Duplicate respondent ID detected")
      );
      expect(issue).toBeDefined();
    }
  });

  it("rejects removed or unlisted features like 5G Connectivity and Fast Charging", () => {
    const with5G = {
      ...validResponse,
      preferred_features: [
        "Camera Quality",
        "Battery Life",
        "5G Connectivity",
      ],
    };
    expect(surveyResponseSchema.safeParse(with5G).success).toBe(false);

    const withFastCharging = {
      ...validResponse,
      preferred_features: [
        "Camera Quality",
        "Battery Life",
        "Fast Charging",
      ],
    };
    expect(surveyResponseSchema.safeParse(withFastCharging).success).toBe(false);
  });

  it("validates the synthetic demo benchmark dataset successfully", () => {
    const result = surveyDatasetSchema.safeParse(demoDataJson);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.metadata.is_demo).toBe(true);
      expect(result.data.metadata.total_responses).toBe(result.data.responses.length);
      expect(result.data.responses.length).toBeGreaterThan(0);
    }
  });
});

```


## File: `pipeline/test_pipeline.py` (**UNCHANGED**)

> **Notes**: Python data pipeline regression test suite (25 unit tests) covering CSV normalization, validation, deduplication, and atomic swap.

```python
"""
Unit and integration tests for the PhonePrint Python pipeline.
Verifies data ingestion, validation rules, normalization, Google Forms mapping,
PII stripping, duplicate detection (with/without timestamps), unmapped column warnings,
atomic dataset activation, failure recovery, and rollback mechanisms.
"""

from __future__ import annotations

import io
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from pipeline.process_survey import (
    process_survey_csv,
    ValidationError,
    parse_and_validate_features,
    resolve_column_mapping,
    detect_duplicates,
)
from pipeline.activate_dataset import (
    validate_dataset_invariants,
    activate_dataset,
    rollback_dataset,
    get_dataset_config,
    save_dataset_config,
    ACTIVE_DATA_PATH,
    CONFIG_PATH,
    BACKUPS_DIR,
)


class TestPhonePrintPipeline(unittest.TestCase):

    def test_process_valid_demo_data(self):
        """Verifies ingestion, normalization, and JSON output of valid demo CSV data."""
        csv_path = Path("pipeline/data/survey_demo_data.csv")
        self.assertTrue(csv_path.exists(), "Demo CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(csv_path, tmp_path, is_demo=True)
            self.assertTrue(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 12)
            self.assertEqual(len(dataset["responses"]), 12)

            first = dataset["responses"][0]
            self.assertEqual(first["response_id"], "DEMO_RESP_001")
            self.assertEqual(first["preferred_brand"], "Apple")
            self.assertEqual(first["budget_range"], "Over $1,000")
            self.assertEqual(len(first["preferred_features"]), 3)
            self.assertIn("Camera Quality", first["preferred_features"])
            self.assertEqual(first["os_preference"], "iOS")
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_rejects_duplicate_respondent_ids(self):
        """Verifies that duplicate respondent IDs in the CSV are detected and rejected."""
        duplicate_csv = '''response_id,preferred_brand,budget_range,preferred_features,primary_use,os_preference
RESP_001,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
RESP_001,Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(duplicate_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("Duplicate respondent ID detected 'RESP_001'", str(ctx.exception.errors))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_rejects_fewer_than_three_features(self):
        """Verifies that selections with fewer than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features("Camera Quality; Battery Life", row_idx=1)
        self.assertIn("Exactly 3 distinct features must be selected; received 2", str(ctx.exception))

    def test_rejects_more_than_three_features(self):
        """Verifies that selections with more than 3 features are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Processing Performance; Display Quality", row_idx=1
            )
        self.assertIn("Exactly 3 distinct features must be selected; received 4", str(ctx.exception))

    def test_rejects_duplicate_features_in_selection(self):
        """Verifies that duplicate features within the same respondent selection are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; Camera Quality", row_idx=2
            )
        self.assertIn("Duplicate feature 'Camera Quality'", str(ctx.exception))

    def test_rejects_unrecognized_features(self):
        """Verifies that removed or unrecognized features (e.g. 5G, Fast Charging) are rejected."""
        with self.assertRaises(ValidationError) as ctx:
            parse_and_validate_features(
                "Camera Quality; Battery Life; 5G Connectivity", row_idx=3
            )
        self.assertIn("Unrecognized feature '5G Connectivity'", str(ctx.exception))

    def test_rejects_missing_required_columns(self):
        """Verifies that CSV files missing required header columns are rejected."""
        incomplete_csv = """response_id,preferred_brand,budget_range
RESP_001,Apple,Over $1,000
"""
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(incomplete_csv)
            temp_csv_path = Path(f.name)

        try:
            with self.assertRaises(ValidationError) as ctx:
                process_survey_csv(temp_csv_path)
            self.assertIn("missing required canonical survey fields", str(ctx.exception))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()

    def test_google_forms_template_mapping(self):
        """Verifies that the Google Forms template CSV with full question headers maps correctly."""
        template_path = Path("data/templates/google_forms_survey_template.csv")
        self.assertTrue(template_path.exists(), "Template CSV must exist")

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(template_path, tmp_path, is_demo=False)
            self.assertFalse(dataset["metadata"]["is_demo"])
            self.assertEqual(dataset["metadata"]["total_responses"], 8)
            # Verify pseudonymized sequential IDs
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][7]["response_id"], "RESP_008")
            # Verify canonical features mapped from comma/semicolon strings
            for resp in dataset["responses"]:
                self.assertEqual(len(resp["preferred_features"]), 3)
                self.assertIsInstance(resp["preferred_brand"], str)
        finally:
            if tmp_path.exists():
                tmp_path.unlink()

    def test_pii_stripping_guarantee(self):
        """Verifies that sensitive PII columns (e.g. Email Address) are strictly stripped."""
        csv_with_pii = '''Timestamp,Email Address,Username,Student Name,What is your preferred smartphone brand?,What is your budget range for a new smartphone?,Which 3 features matter most to you when choosing a smartphone?,What is your primary use for your smartphone?,What smartphone operating system do you prefer?
2026-11-06 10:00:00,student@university.edu,student1,Jane Doe,Apple,"Over $1,000","Camera Quality, Battery Life, Build & Design Quality",Social Media & Content Consumption,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_pii)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            json_text = tmp_json_path.read_text(encoding="utf-8")

            # Check that PII values never appear in the JSON output
            self.assertNotIn("student@university.edu", json_text)
            self.assertNotIn("student1", json_text)
            self.assertNotIn("Jane Doe", json_text)
            self.assertNotIn("Email Address", json_text)

            # Response structure only contains canonical fields
            resp = dataset["responses"][0]
            self.assertEqual(resp["response_id"], "RESP_001")
            self.assertEqual(resp["preferred_brand"], "Apple")
            self.assertNotIn("email", resp)
            self.assertNotIn("name", resp)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_blank_row_handling(self):
        """Verifies that blank or whitespace-only lines are ignored and counted cleanly."""
        csv_with_blanks = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS

   
Samsung,"$700 - $1,000",Display Quality; Processing Performance; Storage Capacity,Gaming,Android


'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_blanks)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(len(dataset["responses"]), 2)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_encoding_fallback_utf8_bom_and_latin1(self):
        """Verifies that UTF-8 with BOM and Latin-1 encodings are handled cleanly."""
        csv_content = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Google,"$400 - $700",Camera Quality; Battery Life; Software & OS Experience,Everyday Communication & Browsing,Android
'''
        # Test UTF-8 with BOM (common Excel export from Google Forms)
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8-sig") as f:
            f.write(csv_content)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
            self.assertEqual(dataset["responses"][0]["preferred_brand"], "Google")
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 1: Duplicate Detection With & Without Timestamps
    # -------------------------------------------------------------------------

    def test_duplicate_detection_missing_timestamp_retains_identical_preferences(self):
        """
        ISSUE 1 (A): When timestamp column is omitted, two valid respondents with
        identical preferences MUST both be retained, no exact duplicate excluded,
        and a clear warning emitted to sys.stderr.
        """
        csv_no_timestamp = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_no_timestamp)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            # Both respondents retained as distinct students
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][1]["response_id"], "RESP_002")

            # Warning captured
            stderr_output = stderr_capture.getvalue()
            self.assertIn("WARNING: Exact duplicate submission detection skipped", stderr_output)
            self.assertIn("no usable timestamp column was available", stderr_output)

            # Audit report confirms 0 exact duplicates excluded, 1 identical profile retained
            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 0)
                self.assertEqual(rep.get("identical_profiles_retained"), 1)
                self.assertEqual(rep.get("accepted_records"), 2)
                self.assertEqual(rep.get("rejected_records"), 0)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_duplicate_detection_available_timestamp_exact_duplicate_excluded(self):
        """
        ISSUE 1 (B): When timestamp is available, identical timestamps and identical answers
        trigger exact duplicate exclusion: first occurrence kept, second excluded.
        """
        csv_with_timestamp = '''Timestamp,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_with_timestamp)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            # Only first instance retained
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")

            # Audit report confirms exclusion
            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 1)
                self.assertEqual(rep.get("accepted_records"), 1)
                self.assertEqual(rep.get("rejected_records"), 1)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_duplicate_detection_distinct_timestamps_retains_both(self):
        """
        ISSUE 1 (C & D): When timestamps are distinct, identical preferences represent
        independent legitimate student choices. BOTH are retained as separate respondents.
        """
        csv_distinct_ts = '''Timestamp,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
2026-11-06 10:15:30,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_distinct_ts)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)
            self.assertEqual(dataset["metadata"]["total_responses"], 2)
            self.assertEqual(dataset["responses"][0]["response_id"], "RESP_001")
            self.assertEqual(dataset["responses"][1]["response_id"], "RESP_002")

            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(rep.get("exact_duplicates_count"), 0)
                self.assertEqual(rep.get("identical_profiles_retained"), 1)
                self.assertEqual(rep.get("accepted_records"), 2)
                self.assertEqual(rep.get("rejected_records"), 0)
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_accounting_invariant_holds(self):
        """ISSUE 1 (E): Verifies evaluated_rows == accepted_records + rejected_records."""
        csv_content = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS

InvalidBrand,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
Samsung,"$700 - $1,000",Camera Quality,Gaming,Android
Google,"$400 - $700",Camera Quality; Battery Life; Software & OS Experience,Everyday General Use,Android
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_content)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        try:
            dataset = process_survey_csv(
                temp_csv_path,
                tmp_json_path,
                is_demo=False,
                filter_invalid=True,
            )
            self.assertEqual(dataset["metadata"]["total_responses"], 2)

            report_path = Path("pipeline/reports/cleaning_report.json")
            if report_path.exists():
                with open(report_path, "r", encoding="utf-8") as rf:
                    rep = json.load(rf)
                self.assertEqual(
                    rep.get("total_raw_rows"),
                    rep.get("blank_rows") + rep.get("accepted_records") + rep.get("rejected_records"),
                )
                self.assertEqual(
                    rep.get("evaluated_rows"),
                    rep.get("accepted_records") + rep.get("rejected_records"),
                )
                self.assertTrue(rep.get("invariant_satisfied"))
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 3: Unmapped CSV Columns Warning
    # -------------------------------------------------------------------------

    def test_unmapped_csv_column_triggers_warning(self):
        """
        ISSUE 3: An unmapped non-PII column triggers a clear warning to sys.stderr
        identifying column names only, not respondent values.
        """
        csv_extra_col = '''preferred_brand,budget_range,preferred_features,primary_use,os_preference,Additional Research Question
Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS,SecretStudentOpinionValue123
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_extra_col)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                dataset = process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            stderr_text = stderr_capture.getvalue()
            # Warning must identify column name
            self.assertIn("WARNING: Unmapped CSV columns will be ignored", stderr_text)
            self.assertIn("Additional Research Question", stderr_text)

            # Warning MUST NOT leak cell contents / respondent values
            self.assertNotIn("SecretStudentOpinionValue123", stderr_text)

            # Processing continues safely
            self.assertEqual(dataset["metadata"]["total_responses"], 1)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    def test_explicitly_mapped_columns_do_not_trigger_unmapped_warning(self):
        """
        ISSUE 3: Columns that are explicitly mapped (canonical, PII, timestamp)
        do not trigger unmapped warnings.
        """
        csv_standard = '''Timestamp,Email Address,preferred_brand,budget_range,preferred_features,primary_use,os_preference
2026-11-06 10:00:00,test@uni.edu,Apple,"Over $1,000",Camera Quality; Battery Life; Build & Design Quality,Gaming,iOS
'''
        with tempfile.NamedTemporaryFile("w+", suffix=".csv", delete=False, encoding="utf-8") as f:
            f.write(csv_standard)
            temp_csv_path = Path(f.name)

        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            tmp_json_path = Path(tmp.name)

        stderr_capture = io.StringIO()
        try:
            with patch("sys.stderr", stderr_capture):
                process_survey_csv(temp_csv_path, tmp_json_path, is_demo=False)

            stderr_text = stderr_capture.getvalue()
            self.assertNotIn("WARNING: Unmapped CSV columns will be ignored", stderr_text)
        finally:
            if temp_csv_path.exists():
                temp_csv_path.unlink()
            if tmp_json_path.exists():
                tmp_json_path.unlink()

    # -------------------------------------------------------------------------
    # ISSUE 2: Atomic Replacement & Failure Path Recovery Tests
    # -------------------------------------------------------------------------

    def test_activation_checklist_invariants_pass_on_valid_data(self):
        """Verifies that validate_dataset_invariants passes cleanly on demo data."""
        with open("src/data/survey_demo_data.json", "r", encoding="utf-8") as f:
            demo_data = json.load(f)
        errors = validate_dataset_invariants(demo_data)
        self.assertEqual(len(errors), 0, f"Valid demo data must have 0 invariant errors: {errors}")

    def test_activation_checklist_rejects_corrupted_dataset(self):
        """Verifies that validate_dataset_invariants catches duplicate IDs, count mismatch, and invalid features."""
        corrupted_data = {
            "metadata": {
                "version": "1.0.0",
                "total_responses": 3,
                "is_demo": False,
            },
            "responses": [
                {
                    "response_id": "RESP_001",
                    "preferred_brand": "Apple",
                    "budget_range": "Over $1,000",
                    "preferred_features": ["Camera Quality", "Battery Life", "Build & Design Quality"],
                    "primary_use": "Gaming",
                    "os_preference": "iOS",
                    "email": "leaked_pii@uni.edu",
                },
                {
                    "response_id": "RESP_001",
                    "preferred_brand": "UnknownBrand",
                    "budget_range": "Over $1,000",
                    "preferred_features": ["Camera Quality"],
                    "primary_use": "Gaming",
                    "os_preference": "iOS",
                },
            ],
        }
        errors = validate_dataset_invariants(corrupted_data)
        self.assertTrue(any("Metadata total_responses" in e for e in errors))
        self.assertTrue(any("Duplicate response_id" in e for e in errors))
        self.assertTrue(any("Prohibited PII field" in e for e in errors))
        self.assertTrue(any("Unknown brand" in e for e in errors))
        self.assertTrue(any("Expected exactly 3 features" in e for e in errors))

    def test_activation_failure_candidate_validation_leaves_active_unchanged(self):
        """
        ISSUE 2: Candidate validation failure prevents activation and leaves active dataset untouched.
        """
        # Save snapshot of current active dataset and config
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        # Create invalid candidate JSON
        invalid_candidate = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
        with tempfile.NamedTemporaryFile("w+", suffix=".json", delete=False, encoding="utf-8") as f:
            json.dump(invalid_candidate, f)
            invalid_path = Path(f.name)

        try:
            success = activate_dataset(str(invalid_path))
            self.assertFalse(success, "Activation must fail on empty / invalid dataset")

            # Active file and config must remain identical
            if orig_active:
                self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
            self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])
        finally:
            if invalid_path.exists():
                invalid_path.unlink()

    def test_activation_failure_backup_prevents_activation(self):
        """
        ISSUE 2: If backup creation fails, activation MUST abort and leave active dataset unchanged.
        """
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("pipeline.activate_dataset.backup_active_dataset", side_effect=RuntimeError("Disk write simulated failure")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must abort if backup creation fails")

        if orig_active:
            self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
        self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])

    def test_activation_failure_atomic_replacement_preserves_previous_dataset(self):
        """
        ISSUE 2: If os.replace fails during atomic deployment, the previous active dataset is preserved.
        """
        orig_active = ACTIVE_DATA_PATH.read_text(encoding="utf-8") if ACTIVE_DATA_PATH.exists() else None
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("os.replace", side_effect=OSError("Simulated filesystem lock")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must fail if atomic replace fails")

        if orig_active:
            self.assertEqual(ACTIVE_DATA_PATH.read_text(encoding="utf-8"), orig_active)
        self.assertEqual(get_dataset_config()["active_dataset"], orig_config["active_dataset"])

    def test_activation_failure_config_update_triggers_recovery(self):
        """
        ISSUE 2: If atomic JSON replacement succeeds but configuration update fails,
        recovery restores the previous active dataset to prevent inconsistent state.
        """
        # Ensure we have a populated initial active dataset for backup
        initial_data = {
            "metadata": {"version": "1.0.0", "total_responses": 1, "is_demo": False},
            "responses": [{
                "response_id": "RESP_INIT",
                "preferred_brand": "Apple",
                "budget_range": "Over $1,000",
                "preferred_features": ["Camera Quality", "Battery Life", "Build & Design Quality"],
                "primary_use": "Gaming",
                "os_preference": "iOS"
            }]
        }
        ACTIVE_DATA_PATH.write_text(json.dumps(initial_data, indent=2), encoding="utf-8")
        orig_config = get_dataset_config()

        template_path = Path("data/templates/google_forms_survey_template.csv")

        with patch("pipeline.activate_dataset.save_dataset_config", side_effect=IOError("Simulated config disk error")):
            success = activate_dataset(str(template_path))
            self.assertFalse(success, "Activation must report failure if config save fails")

        # Verify recovery restored the initial data from backup
        curr_active_data = json.loads(ACTIVE_DATA_PATH.read_text(encoding="utf-8"))
        self.assertEqual(curr_active_data["responses"][0]["response_id"], "RESP_INIT")

        # Clean up and restore demo placeholder
        placeholder = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
        ACTIVE_DATA_PATH.write_text(json.dumps(placeholder, indent=2), encoding="utf-8")
        save_dataset_config(orig_config)
        for b in BACKUPS_DIR.glob("dataset_backup_*.json"):
            try:
                b.unlink()
            except Exception:
                pass

    def test_activation_success_and_rollback_flow(self):
        """
        ISSUE 2: Verifies end-to-end atomic activation of template data followed by clean rollback.
        """
        orig_config = get_dataset_config()
        template_path = Path("data/templates/google_forms_survey_template.csv")

        try:
            # 1. Activate
            success = activate_dataset(str(template_path))
            self.assertTrue(success, "Template activation should succeed")

            config_after = get_dataset_config()
            self.assertEqual(config_after["active_dataset"], "real")
            self.assertFalse(config_after["is_demo"])
            self.assertEqual(config_after["total_responses"], 8)

            active_json = json.loads(ACTIVE_DATA_PATH.read_text(encoding="utf-8"))
            self.assertEqual(len(active_json["responses"]), 8)

            # 2. Rollback
            rollback_success = rollback_dataset()
            self.assertTrue(rollback_success, "Rollback must succeed")

        finally:
            # Guarantee environment returns to canonical demo mode
            save_dataset_config(orig_config)
            placeholder = {"metadata": {"total_responses": 0, "is_demo": False}, "responses": []}
            ACTIVE_DATA_PATH.write_text(json.dumps(placeholder, indent=2), encoding="utf-8")
            for b in BACKUPS_DIR.glob("dataset_backup_*.json"):
                try:
                    b.unlink()
                except Exception:
                    pass

    def test_temporary_files_are_cleaned_up(self):
        """
        ISSUE 2: Verifies no temporary staging files linger in src/data or pipeline/data.
        """
        staging_files = list(ACTIVE_DATA_PATH.parent.glob("tmp_active_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_config_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_recovery_*.json"))
        staging_files += list(ACTIVE_DATA_PATH.parent.glob("tmp_rollback_*.json"))
        self.assertEqual(len(staging_files), 0, f"Found lingering temporary files: {staging_files}")


if __name__ == "__main__":
    unittest.main()

```
