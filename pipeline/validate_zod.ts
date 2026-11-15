/**
 * PhonePrint - Zod Schema Dataset Validator CLI
 * Runs Zod schema validation against any JSON dataset file.
 */

import fs from "fs";
import path from "path";
import { surveyDatasetSchema } from "../src/schemas/survey.schema";

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.error("Usage: vite-node pipeline/validate_zod.ts <path-to-json>");
  process.exit(1);
}

const resolvedPath = path.resolve(jsonPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(resolvedPath, "utf-8");
  const data = JSON.parse(content);
  const result = surveyDatasetSchema.safeParse(data);

  if (result.success) {
    console.log(
      JSON.stringify({
        valid: true,
        total_responses: result.data.metadata.total_responses,
        is_demo: result.data.metadata.is_demo,
      })
    );
    process.exit(0);
  } else {
    console.error(
      JSON.stringify({
        valid: false,
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      })
    );
    process.exit(1);
  }
} catch (err: any) {
  console.error(
    JSON.stringify({
      valid: false,
      errors: [{ path: "", message: err.message || String(err) }],
    })
  );
  process.exit(1);
}
