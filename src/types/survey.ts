/**
 * PhonePrint - Anonymous Smartphone Survey Data Models
 * Developed for University Discrete Mathematics & Graph Theory Experiential Learning.
 */

export const SMARTPHONE_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Motorola",
  "Other",
] as const;

export type SmartphoneBrand = (typeof SMARTPHONE_BRANDS)[number];

export const BUDGET_RANGES = [
  "Under ₹15,000",
  "₹15,000 - ₹30,000",
  "₹30,000 - ₹60,000",
  "Above ₹60,000",
] as const;

export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const SMARTPHONE_FEATURES = [
  "Camera Quality",
  "Battery Life",
  "Processing Performance",
  "Display Quality",
  "Storage Capacity",
  "Build & Design Quality",
  "Software & OS Experience",
] as const;

export type SmartphoneFeature = (typeof SMARTPHONE_FEATURES)[number];

export const PRIMARY_USES = [
  "Photography & Videography",
  "Gaming",
  "Business & Productivity",
  "Social Media & Content Consumption",
  "Everyday General Use",
] as const;

export type PrimaryUse = (typeof PRIMARY_USES)[number];

export const OS_PREFERENCES = [
  "Android",
  "iOS",
  "No Preference",
] as const;

export type OSPreference = (typeof OS_PREFERENCES)[number];

/**
 * Anonymous survey response record.
 * Represents a single respondent's preferences.
 */
export interface SurveyResponse {
  readonly response_id: string;
  readonly preferred_brand: SmartphoneBrand;
  readonly budget_range: BudgetRange;
  /**
   * Exactly three distinct feature preferences.
   */
  readonly preferred_features: readonly [
    SmartphoneFeature,
    SmartphoneFeature,
    SmartphoneFeature
  ];
  readonly primary_use: PrimaryUse;
  readonly os_preference: OSPreference;
}

/**
 * Survey Dataset container with metadata.
 */
export interface SurveyDatasetMetadata {
  readonly version: string;
  readonly generated_at: string;
  readonly total_responses: number;
  readonly is_demo: boolean;
  readonly description: string;
}

export interface SurveyDataset {
  readonly metadata: SurveyDatasetMetadata;
  readonly responses: readonly SurveyResponse[];
}
