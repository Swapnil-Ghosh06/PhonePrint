/**
 * PhonePrint - SetLab Available Set Definitions
 * Defines the discrete sets available for user selection in the laboratory.
 * Maps human-readable domain concepts to pure Set<string> of respondent IDs.
 */

import type { SurveyResponse } from "@/types/survey";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SmartphoneBrand,
  type SmartphoneFeature,
} from "@/types/survey";
import {
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
} from "./loader";

export type SetCategory = "brand" | "feature";

export interface SetOption {
  id: string;
  name: string;
  category: SetCategory;
  description: string;
  getIds: (responses: readonly SurveyResponse[]) => Set<string>;
}

/**
 * Builds the complete list of available sets for SetLab:
 * - All smartphone brands present in the domain
 * - All 7 canonical features
 */
export function getAvailableSetOptions(): SetOption[] {
  const options: SetOption[] = [];

  // 1. Brand Sets
  for (const brand of SMARTPHONE_BRANDS) {
    options.push({
      id: `brand_${brand.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      name: `Brand: ${brand}`,
      category: "brand",
      description: `Respondents who selected ${brand} as their preferred smartphone brand`,
      getIds: (responses) => getRespondentIdsByBrand(responses, brand as SmartphoneBrand),
    });
  }

  // 2. Canonical Feature Sets
  for (const feature of SMARTPHONE_FEATURES) {
    options.push({
      id: `feature_${feature.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      name: `Feature: ${feature}`,
      category: "feature",
      description: `Respondents who selected ${feature} in their 3 distinct preferred features`,
      getIds: (responses) => getRespondentIdsByFeature(responses, feature as SmartphoneFeature),
    });
  }

  return options;
}
