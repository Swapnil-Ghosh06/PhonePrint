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
  it("loadDemoSurveyDataset loads and validates the 30-record synthetic fixture", () => {
    const dataset = loadDemoSurveyDataset();

    expect(typeof dataset.metadata.is_demo).toBe("boolean");
    expect(dataset.metadata.total_responses).toBe(30);
    expect(dataset.responses.length).toBe(30);

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
