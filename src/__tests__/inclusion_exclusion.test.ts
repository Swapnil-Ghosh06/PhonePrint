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
