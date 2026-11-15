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
  const responses = dataset.responses; // 30 respondents

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
