import { z } from "zod";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
  type SmartphoneFeature,
} from "@/types/survey";

/**
 * Zod schema for individual smartphone brand enum.
 */
export const smartphoneBrandSchema = z.enum(SMARTPHONE_BRANDS);

/**
 * Zod schema for budget range categories.
 */
export const budgetRangeSchema = z.enum(BUDGET_RANGES);

/**
 * Zod schema for individual smartphone features.
 */
export const smartphoneFeatureSchema = z.enum(SMARTPHONE_FEATURES);

/**
 * Zod schema for primary usage classification.
 */
export const primaryUseSchema = z.enum(PRIMARY_USES);

/**
 * Zod schema for operating system preference.
 */
export const osPreferenceSchema = z.enum(OS_PREFERENCES);

/**
 * Zod schema for a single anonymous survey response.
 * Enforces exactly three distinct feature selections.
 */
export const surveyResponseSchema = z.object({
  response_id: z
    .string()
    .min(1, "Respondent ID cannot be empty")
    .regex(/^[A-Za-z0-9_-]+$/, "Respondent ID must contain only alphanumeric characters, dashes, or underscores"),
  preferred_brand: smartphoneBrandSchema,
  budget_range: budgetRangeSchema,
  preferred_features: z
    .array(smartphoneFeatureSchema)
    .length(3, "Respondent must select exactly 3 preferred features")
    .refine(
      (features) => new Set(features).size === 3,
      "Feature selections must contain exactly 3 distinct features"
    )
    .transform((features) => features as unknown as [SmartphoneFeature, SmartphoneFeature, SmartphoneFeature]),
  primary_use: primaryUseSchema,
  os_preference: osPreferenceSchema,
});

/**
 * Zod schema for an array of survey responses.
 * Enforces global uniqueness of respondent IDs across the entire dataset.
 */
export const surveyResponseListSchema = z
  .array(surveyResponseSchema)
  .superRefine((responses, ctx) => {
    const seenIds = new Set<string>();
    const duplicateIds = new Set<string>();

    responses.forEach((resp, index) => {
      if (seenIds.has(resp.response_id)) {
        duplicateIds.add(resp.response_id);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate respondent ID detected: "${resp.response_id}" at index ${index}`,
          path: [index, "response_id"],
        });
      } else {
        seenIds.add(resp.response_id);
      }
    });
  });

/**
 * Complete Survey Dataset container schema with metadata validation.
 */
export const surveyDatasetSchema = z.object({
  metadata: z.object({
    version: z.string().min(1),
    generated_at: z.string().min(1),
    total_responses: z.number().int().nonnegative(),
    is_demo: z.boolean(),
    description: z.string(),
  }),
  responses: surveyResponseListSchema,
}).refine(
  (data) => data.metadata.total_responses === data.responses.length,
  {
    message: "Metadata total_responses count does not match the actual number of responses",
    path: ["metadata", "total_responses"],
  }
);
