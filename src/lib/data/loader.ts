/**
 * PhonePrint - Data Ingestion and Set Extraction Utilities
 * Transforms survey records into discrete sets of respondent IDs for mathematical processing.
 */

import demoDataJson from "@/data/survey_demo_data.json";
import activeDataJson from "@/data/survey_active_data.json";
import datasetConfig from "@/data/dataset_config.json";
import { surveyDatasetSchema } from "@/schemas/survey.schema";
import type {
  SurveyDataset,
  SurveyResponse,
  SmartphoneBrand,
  SmartphoneFeature,
  OSPreference,
  BudgetRange,
  PrimaryUse,
} from "@/types/survey";

/**
 * Loads the currently configured active dataset (demo or real survey data).
 * If real data is active, validates it with Zod schema. If real data is invalid or empty,
 * safely falls back to the validated demo dataset.
 */
export function loadSurveyDataset(): SurveyDataset {
  if (datasetConfig.active_dataset === "real") {
    try {
      const result = surveyDatasetSchema.safeParse(activeDataJson);
      if (result.success && result.data.responses.length > 0) {
        return result.data as unknown as SurveyDataset;
      }
    } catch {
      // Fallback to demo
    }
  }
  return loadDemoSurveyDataset();
}

/**
 * Loads and validates the demo survey dataset using the Zod schema.
 * Guaranteed to return the 30-record synthetic benchmark fixture.
 */
export function loadDemoSurveyDataset(): SurveyDataset {
  const result = surveyDatasetSchema.safeParse(demoDataJson);
  if (!result.success) {
    throw new Error(
      `Demo dataset validation failed: ${result.error.issues.map((i) => i.message).join(", ")}`
    );
  }
  return result.data as unknown as SurveyDataset;
}

/**
 * Returns metadata and active badge details for UI headers and navigation.
 */
export function getActiveDatasetInfo() {
  const dataset = loadSurveyDataset();
  const isDemo = dataset.metadata.is_demo;
  const count = dataset.metadata.total_responses;

  return {
    isDemo,
    totalResponses: count,
    version: dataset.metadata.version,
    description: dataset.metadata.description,
    badgeText: isDemo ? `SIMULATED CAMPUS DATA — N=${count}` : `REAL SURVEY (n=${count})`,
    tagText: isDemo ? `[SIMULATED CAMPUS DATA: N=${count}]` : `[REAL SURVEY: N=${count}]`,
    notes: datasetConfig.notes || (isDemo ? "SIMULATED CAMPUS DATA — N=30" : "REAL SURVEY DATA"),
  };
}

/**
 * Returns a discrete set of respondent IDs preferring a specific smartphone brand:
 * S_brand = { id ∈ U | response(id).brand = brand }
 */
export function getRespondentIdsByBrand(
  responses: readonly SurveyResponse[],
  brand: SmartphoneBrand
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_brand === brand) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs selecting a given feature:
 * S_feature = { id ∈ U | feature ∈ response(id).preferred_features }
 */
export function getRespondentIdsByFeature(
  responses: readonly SurveyResponse[],
  feature: SmartphoneFeature
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.preferred_features.includes(feature)) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs with a given OS preference:
 * S_os = { id ∈ U | response(id).os = os }
 */
export function getRespondentIdsByOS(
  responses: readonly SurveyResponse[],
  os: OSPreference
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.os_preference === os) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs within a budget range:
 * S_budget = { id ∈ U | response(id).budget = budget }
 */
export function getRespondentIdsByBudget(
  responses: readonly SurveyResponse[],
  budget: BudgetRange
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.budget_range === budget) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns a discrete set of respondent IDs with a given primary use:
 * S_use = { id ∈ U | response(id).primary_use = use }
 */
export function getRespondentIdsByPrimaryUse(
  responses: readonly SurveyResponse[],
  use: PrimaryUse
): Set<string> {
  const result = new Set<string>();
  for (const resp of responses) {
    if (resp.primary_use === use) {
      result.add(resp.response_id);
    }
  }
  return result;
}

/**
 * Returns the entire universe of respondent IDs: U = { id | response(id) ∈ responses }
 */
export function getUniverseRespondentIds(
  responses: readonly SurveyResponse[]
): Set<string> {
  return new Set(responses.map((r) => r.response_id));
}
