import { describe, it, expect } from "vitest";
import { formatINR, formatINRNumber } from "@/lib/format/currency";
import { BUDGET_RANGES, type BudgetRange } from "@/types/survey";
import { surveyResponseSchema } from "@/schemas/survey.schema";
import { loadSurveyDataset } from "@/lib/data/loader";

describe("Indian Rupee (INR / ₹) Currency & Budget System", () => {
  describe("formatINR Currency Formatter", () => {
    it("formats standard amounts with ₹ symbol and en-IN digit grouping", () => {
      expect(formatINR(500)).toBe("₹500");
      expect(formatINR(15000)).toBe("₹15,000");
      expect(formatINR(30000)).toBe("₹30,000");
      expect(formatINR(60000)).toBe("₹60,000");
      expect(formatINR(100000)).toBe("₹1,00,000");
    });

    it("supports optional decimal formatting", () => {
      expect(formatINR(15000.5, { decimals: 2 })).toBe("₹15,000.50");
      expect(formatINR(15000, { decimals: 0 })).toBe("₹15,000");
    });

    it("formats numbers without symbol using formatINRNumber", () => {
      expect(formatINRNumber(500)).toBe("500");
      expect(formatINRNumber(15000)).toBe("15,000");
      expect(formatINRNumber(100000)).toBe("1,00,000");
    });
  });

  describe("Canonical INR Budget Ranges", () => {
    it("defines the 4 canonical, mutually exclusive and collectively exhaustive INR tiers", () => {
      expect(BUDGET_RANGES).toEqual([
        "Under ₹15,000",
        "₹15,000 - ₹30,000",
        "₹30,000 - ₹60,000",
        "Above ₹60,000",
      ]);
    });

    it("ensures all budget ranges use the Indian Rupee symbol (₹)", () => {
      for (const range of BUDGET_RANGES) {
        expect(range).toContain("₹");
        expect(range).not.toContain("$");
        expect(range).not.toContain("USD");
      }
    });
  });

  describe("Dataset Currency Integrity (N=30)", () => {
    const dataset = loadSurveyDataset();
    const responses = dataset.responses;

    it("contains exactly 30 respondent records", () => {
      expect(responses.length).toBe(30);
      expect(dataset.metadata.total_responses).toBe(30);
    });

    it("ensures every single respondent has a canonical INR budget range", () => {
      const allowed = new Set<string>(BUDGET_RANGES);
      for (const resp of responses) {
        expect(allowed.has(resp.budget_range)).toBe(true);
        expect(resp.budget_range).toContain("₹");
        expect(resp.budget_range).not.toContain("$");
      }
    });

    it("preserves exact empirical budget cohort counts and partition conservation", () => {
      const counts: Record<BudgetRange, number> = {
        "Under ₹15,000": 0,
        "₹15,000 - ₹30,000": 0,
        "₹30,000 - ₹60,000": 0,
        "Above ₹60,000": 0,
      };

      for (const resp of responses) {
        counts[resp.budget_range]++;
      }

      // Preserves exact frequencies for the 30-record cohort (3 + 13 + 8 + 6 = 30)
      expect(counts["Under ₹15,000"]).toBe(3);
      expect(counts["₹15,000 - ₹30,000"]).toBe(13);
      expect(counts["₹30,000 - ₹60,000"]).toBe(8);
      expect(counts["Above ₹60,000"]).toBe(6);

      const totalCohort = Object.values(counts).reduce((a, b) => a + b, 0);
      expect(totalCohort).toBe(30);
    });
  });

  describe("Survey Schema Validation with INR", () => {
    it("validates responses with INR budget ranges successfully", () => {
      const validSample = {
        response_id: "INR_RESP_001",
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

      const result = surveyResponseSchema.safeParse(validSample);
      expect(result.success).toBe(true);
    });

    it("strictly rejects obsolete USD budget strings", () => {
      const obsoleteSample = {
        response_id: "USD_RESP_001",
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

      const result = surveyResponseSchema.safeParse(obsoleteSample);
      expect(result.success).toBe(false);
    });
  });
});
