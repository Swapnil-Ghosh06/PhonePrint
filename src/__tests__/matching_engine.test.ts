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
  const responses = dataset.responses; // 30 valid respondents

  const appleProfile: UserProfileInput = {
    brand: "Apple",
    budget: "Above ₹60,000",
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
      const pSet = buildBudgetSet(responses, "Above ₹60,000");
      const expectedOver1kCount = responses.filter((r) => r.budget_range === "Above ₹60,000").length;
      expect(pSet.size).toBe(expectedOver1kCount);
      for (const id of pSet) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.budget_range).toBe("Above ₹60,000");
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
      const pSet = buildBudgetSet(responses, "Above ₹60,000");
      const fSet = buildExactFeatureSet(responses, [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ]);

      const exact = computeExactMatches(bSet, pSet, fSet);
      const expectedExact = responses.filter(
        (r) =>
          r.preferred_brand === "Apple" &&
          r.budget_range === "Above ₹60,000" &&
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
      expect(responses.length).toBe(30);

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
        expect(resp?.budget_range).toBe("Above ₹60,000");
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
        expect(resp?.budget_range).not.toBe("Above ₹60,000");
      }
    });

    it("correctly identifies respondents with 0 conditions matched", () => {
      const result = executeMatchingEngine(responses, appleProfile);
      expect(result.category0None.count).toBeGreaterThan(0);
      for (const id of result.category0None.ids) {
        const resp = responses.find((r) => r.response_id === id);
        expect(resp?.preferred_brand).not.toBe("Apple");
        expect(resp?.budget_range).not.toBe("Above ₹60,000");
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
      // Profile with brand Motorola and budget Above ₹60,000 (0 respondents in our dataset)
      const noMatchProfile: UserProfileInput = {
        brand: "Motorola",
        budget: "Above ₹60,000",
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
        budget: "Under ₹15,000",
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
          budget_range: "Above ₹60,000",
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
          budget_range: "Above ₹60,000",
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
