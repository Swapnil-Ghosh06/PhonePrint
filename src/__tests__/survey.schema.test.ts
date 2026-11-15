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
    budget_range: "Above ₹60,000",
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
