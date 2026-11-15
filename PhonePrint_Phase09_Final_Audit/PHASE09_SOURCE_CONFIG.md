# PhonePrint Phase 09 — Complete Configuration Source Bundle

Complete unabridged source code for build configurations, Tailwind theme, package dependencies, and synthetic generator.

---


## File: `tailwind.config.ts` (**MODIFIED IN PHASE 09**)

> **Notes**: Tailwind configuration with editorial paper palette (#FBFBF9), serif display typography, and subtle shadows.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBFBF9",
          50: "#FFFFFF",
          100: "#FBFBF9",
          200: "#F4F3EE",
          300: "#E8E6DF",
          400: "#D3D0C7",
          500: "#A8A59C",
          600: "#78766F",
          700: "#52504A",
          800: "#2B2A27",
          900: "#181715",
        },
        graphite: {
          50: "#f8f9fa",
          100: "#f1f3f6",
          200: "#e2e6ed",
          300: "#c7d0de",
          400: "#8f9eb6",
          500: "#5c6c86",
          600: "#3e4b63",
          700: "#273145",
          800: "#182030",
          900: "#101623",
          950: "#0b0f17",
        },
        cobalt: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#172554",
          950: "#0c183d",
        },
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          950: "#1a2e05",
        },
      },
      fontFamily: {
        serif: [
          "Newsreader",
          "Playfair Display",
          "Charter",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(11, 15, 23, 0.05)",
        card: "0 1px 3px 0 rgba(11, 15, 23, 0.08), 0 1px 2px -1px rgba(11, 15, 23, 0.08)",
        dropdown: "0 10px 15px -3px rgba(11, 15, 23, 0.1), 0 4px 6px -4px rgba(11, 15, 23, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;

```


## File: `next.config.mjs` (**UNCHANGED**)

> **Notes**: Next.js production build configuration.

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;

```


## File: `package.json` (**UNCHANGED**)

> **Notes**: Node package definitions, dependencies, and build scripts.

```json
{
  "name": "phoneprint",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "katex": "^0.16.21",
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/katex": "^0.16.7",
    "@types/node": "^22.13.9",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.21.0",
    "eslint-config-next": "^15.2.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2",
    "vitest": "^3.0.7"
  }
}

```


## File: `tsconfig.json` (**UNCHANGED**)

> **Notes**: Strict TypeScript compiler options.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".venv"]
}

```


## File: `vitest.config.ts` (**UNCHANGED**)

> **Notes**: Vitest test runner configuration with path aliases.

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.{test,spec}.ts", "src/**/*.{test,spec}.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

```


## File: `scratch/generate_synthetic_300.py` (**MODIFIED IN PHASE 09**)

> **Notes**: Deterministic synthetic dataset generator for N=300 realistic student responses.

```python
"""
Generate 300 realistic synthetic college-student survey records for PhonePrint.
Ensures exact consistency across CSV, JSON, and SQL representations.
"""

import json
import random
import csv
from datetime import datetime, timedelta, timezone
from pathlib import Path

RANDOM_SEED = 20261108
random.seed(RANDOM_SEED)

CANONICAL_BRANDS = [
    "Apple",
    "Samsung",
    "Google",
    "OnePlus",
    "Xiaomi",
    "Motorola",
    "Other",
]

CANONICAL_BUDGETS = [
    "Under $400",
    "$400 - $700",
    "$700 - $1,000",
    "Over $1,000",
]

CANONICAL_FEATURES = [
    "Camera Quality",
    "Battery Life",
    "Processing Performance",
    "Display Quality",
    "Storage Capacity",
    "Build & Design Quality",
    "Software & OS Experience",
]

PRIMARY_USES = [
    "Photography & Videography",
    "Gaming",
    "Business & Productivity",
    "Social Media & Content Consumption",
    "Everyday General Use",
]

OS_PREFERENCES = [
    "Android",
    "iOS",
    "No Preference",
]

# Target brand proportions out of 300:
# Apple: 105 (35%)
# Samsung: 81 (27%)
# Google: 48 (16%)
# OnePlus: 27 (9%)
# Xiaomi: 18 (6%)
# Motorola: 12 (4%)
# Other: 9 (3%)
# Sum = 300
BRAND_TARGETS = {
    "Apple": 105,
    "Samsung": 81,
    "Google": 48,
    "OnePlus": 27,
    "Xiaomi": 18,
    "Motorola": 12,
    "Other": 9,
}

# Budget distributions per brand (weights for ["Under $400", "$400 - $700", "$700 - $1,000", "Over $1,000"])
BRAND_BUDGET_WEIGHTS = {
    "Apple": [0.03, 0.20, 0.42, 0.35],
    "Samsung": [0.10, 0.38, 0.32, 0.20],
    "Google": [0.08, 0.50, 0.30, 0.12],
    "OnePlus": [0.15, 0.48, 0.30, 0.07],
    "Xiaomi": [0.45, 0.40, 0.15, 0.00],
    "Motorola": [0.55, 0.35, 0.10, 0.00],
    "Other": [0.35, 0.40, 0.20, 0.05],
}

# Feature affinity weights per brand
# Order: Camera, Battery, Processing, Display, Storage, Build, Software
BRAND_FEATURE_WEIGHTS = {
    "Apple": [0.24, 0.19, 0.13, 0.10, 0.10, 0.14, 0.10],
    "Samsung": [0.18, 0.21, 0.17, 0.18, 0.13, 0.07, 0.06],
    "Google": [0.25, 0.20, 0.11, 0.09, 0.08, 0.07, 0.20],
    "OnePlus": [0.13, 0.22, 0.23, 0.16, 0.12, 0.07, 0.07],
    "Xiaomi": [0.14, 0.27, 0.16, 0.14, 0.20, 0.05, 0.04],
    "Motorola": [0.12, 0.30, 0.12, 0.12, 0.22, 0.06, 0.06],
    "Other": [0.14, 0.25, 0.15, 0.14, 0.18, 0.07, 0.07],
}

def generate_records(n=300):
    records = []
    
    # Generate list of brands matching exact target counts
    brands_pool = []
    for brand, count in BRAND_TARGETS.items():
        brands_pool.extend([brand] * count)
    random.shuffle(brands_pool)
    
    base_time = datetime(2026, 9, 15, 9, 0, 0, tzinfo=timezone.utc)
    
    for i in range(1, n + 1):
        resp_id = f"RESP_{i:03d}"
        brand = brands_pool[i - 1]
        
        # Pick budget
        b_weights = BRAND_BUDGET_WEIGHTS[brand]
        budget = random.choices(CANONICAL_BUDGETS, weights=b_weights, k=1)[0]
        
        # Pick 3 distinct features based on brand weights, adjusted by budget
        f_weights = list(BRAND_FEATURE_WEIGHTS[brand])
        if budget == "Over $1,000":
            # Boost camera, processing, build
            f_weights[0] *= 1.3 # Camera
            f_weights[2] *= 1.2 # Processing
            f_weights[5] *= 1.3 # Build
        elif budget == "Under $400":
            # Boost battery, storage
            f_weights[1] *= 1.4 # Battery
            f_weights[4] *= 1.3 # Storage
            f_weights[0] *= 0.7 # Camera
            
        chosen_features = []
        features_pool = list(CANONICAL_FEATURES)
        weights_pool = list(f_weights)
        for _ in range(3):
            pick = random.choices(features_pool, weights=weights_pool, k=1)[0]
            chosen_features.append(pick)
            idx = features_pool.index(pick)
            features_pool.pop(idx)
            weights_pool.pop(idx)
            
        # OS preference
        if brand == "Apple":
            os_pref = random.choices(["iOS", "No Preference"], weights=[0.94, 0.06], k=1)[0]
        else:
            os_pref = random.choices(["Android", "No Preference", "iOS"], weights=[0.88, 0.09, 0.03], k=1)[0]
            
        # Primary use
        if "Camera Quality" in chosen_features and random.random() < 0.45:
            prim_use = "Photography & Videography"
        elif "Processing Performance" in chosen_features and random.random() < 0.45:
            prim_use = "Gaming"
        elif "Battery Life" in chosen_features and random.random() < 0.40:
            prim_use = "Everyday General Use"
        elif "Display Quality" in chosen_features and random.random() < 0.35:
            prim_use = "Social Media & Content Consumption"
        else:
            prim_use = random.choice(PRIMARY_USES)
            
        # Timestamp staggered across 40 days
        seconds_offset = int((i / n) * 40 * 86400) + random.randint(-12000, 12000)
        ts = base_time + timedelta(seconds=max(0, seconds_offset))
        ts_str = ts.strftime("%Y-%m-%dT%H:%M:%SZ")
        
        records.append({
            "response_id": resp_id,
            "preferred_brand": brand,
            "budget_range": budget,
            "preferred_features": chosen_features,
            "primary_use": prim_use,
            "os_preference": os_pref,
            "submission_timestamp": ts_str,
        })
        
    return records

def main():
    records = generate_records(300)
    assert len(records) == 300
    
    # Verify uniqueness of IDs
    ids = set(r["response_id"] for r in records)
    assert len(ids) == 300
    
    # Verify exactly 3 distinct features
    for r in records:
        assert len(r["preferred_features"]) == 3
        assert len(set(r["preferred_features"])) == 3
        assert r["preferred_brand"] in CANONICAL_BRANDS
        assert r["budget_range"] in CANONICAL_BUDGETS
        for f in r["preferred_features"]:
            assert f in CANONICAL_FEATURES

    # 1. Write synthetic CSV: data/synthetic_survey_300.csv
    csv_dir = Path("data")
    csv_dir.mkdir(parents=True, exist_ok=True)
    csv_path = csv_dir / "synthetic_survey_300.csv"
    
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "respondent_id",
            "preferred_brand",
            "budget_range",
            "feature_1",
            "feature_2",
            "feature_3",
            "primary_use",
            "os_preference",
            "submission_timestamp"
        ])
        for r in records:
            writer.writerow([
                r["response_id"],
                r["preferred_brand"],
                r["budget_range"],
                r["preferred_features"][0],
                r["preferred_features"][1],
                r["preferred_features"][2],
                r["primary_use"],
                r["os_preference"],
                r["submission_timestamp"]
            ])
    print(f"Written: {csv_path}")
    
    # 2. Write application JSON: src/data/survey_demo_data.json
    json_path = Path("src/data/survey_demo_data.json")
    dataset_json = {
        "metadata": {
            "version": "2.1.0",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_responses": 300,
            "is_demo": True,
            "description": "SIMULATED CAMPUS DATA — N=300. Realistic synthetic student preference survey for university discrete mathematics exploration."
        },
        "responses": [
            {
                "response_id": r["response_id"],
                "preferred_brand": r["preferred_brand"],
                "budget_range": r["budget_range"],
                "preferred_features": r["preferred_features"],
                "primary_use": r["primary_use"],
                "os_preference": r["os_preference"]
            }
            for r in records
        ]
    }
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(dataset_json, f, indent=2)
    print(f"Written: {json_path}")
    
    # 3. Update src/data/dataset_config.json
    config_path = Path("src/data/dataset_config.json")
    config_data = {
        "active_dataset": "demo",
        "is_demo": True,
        "total_responses": 300,
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "demo_file": "survey_demo_data.json",
        "real_file": "survey_active_data.json",
        "notes": "SIMULATED CAMPUS DATA — N=300"
    }
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config_data, f, indent=2)
    print(f"Written: {config_path}")
    
    # 4. Write SQL schema & seed script: data/seed_survey_300.sql
    sql_path = Path("data/seed_survey_300.sql")
    with open(sql_path, "w", encoding="utf-8") as f:
        f.write("-- PhonePrint: Synthetic Campus Survey Database Schema and Seed Script\n")
        f.write("-- N = 300 Verified Synthetic Student Responses\n")
        f.write("-- Generated for University Discrete Mathematics & Graph Theory Exploration\n\n")
        f.write("DROP TABLE IF EXISTS student_survey_responses;\n\n")
        f.write("CREATE TABLE student_survey_responses (\n")
        f.write("    respondent_id VARCHAR(32) PRIMARY KEY,\n")
        f.write("    preferred_brand VARCHAR(64) NOT NULL,\n")
        f.write("    budget_range VARCHAR(64) NOT NULL,\n")
        f.write("    feature_1 VARCHAR(64) NOT NULL,\n")
        f.write("    feature_2 VARCHAR(64) NOT NULL,\n")
        f.write("    feature_3 VARCHAR(64) NOT NULL,\n")
        f.write("    primary_use VARCHAR(64) NOT NULL,\n")
        f.write("    os_preference VARCHAR(32) NOT NULL,\n")
        f.write("    submission_timestamp TIMESTAMP WITH TIME ZONE NOT NULL\n")
        f.write(");\n\n")
        f.write("INSERT INTO student_survey_responses (\n")
        f.write("    respondent_id, preferred_brand, budget_range,\n")
        f.write("    feature_1, feature_2, feature_3,\n")
        f.write("    primary_use, os_preference, submission_timestamp\n")
        f.write(") VALUES\n")
        
        values = []
        for r in records:
            vals = (
                f"    ('{r['response_id']}', '{r['preferred_brand']}', '{r['budget_range']}', "
                f"'{r['preferred_features'][0]}', '{r['preferred_features'][1]}', '{r['preferred_features'][2]}', "
                f"'{r['primary_use']}', '{r['os_preference']}', '{r['submission_timestamp']}')"
            )
            values.append(vals)
        f.write(",\n".join(values) + ";\n")
    print(f"Written: {sql_path}")
    
    # 5. Write documentation: data/SYNTHETIC_DATASET_DOCUMENTATION.md
    doc_path = Path("data/SYNTHETIC_DATASET_DOCUMENTATION.md")
    with open(doc_path, "w", encoding="utf-8") as f:
        f.write("# PhonePrint — Synthetic Campus Survey Dataset (N=300)\n\n")
        f.write("## 1. Academic Disclosure & Dataset Identity\n\n")
        f.write("> **IMPORTANT NOTICE**:\n")
        f.write("> This dataset is a **simulated benchmark cohort** consisting of exactly 300 synthetic student records (`N = 300`).\n")
        f.write("> It is constructed specifically for testing, demonstrating, and evaluating discrete mathematical set operations,\n")
        f.write("> combinatorial structures, and web application interactions in the PhonePrint platform.\n")
        f.write("> **These records are NOT empirical survey submissions collected from human subjects.**\n\n")
        f.write("## 2. Structural Characteristics\n\n")
        f.write("- **Total Record Count ($N$)**: 300 unique respondents (`RESP_001` through `RESP_300`).\n")
        f.write("- **Canonical Smartphone Brands ($|\\mathcal{B}| = 7$)**:\n")
        for b, count in BRAND_TARGETS.items():
            f.write(f"  - {b}: {count} ({count/300*100:.1f}%)\n")
        f.write("\n")
        f.write("- **Canonical Budget Ranges ($|\\mathcal{P}| = 4$)**:\n")
        
        # Calculate budget counts
        b_counts = {}
        for b in CANONICAL_BUDGETS:
            b_counts[b] = sum(1 for r in records if r["budget_range"] == b)
        for b, count in b_counts.items():
            f.write(f"  - {b}: {count} ({count/300*100:.1f}%)\n")
        f.write("\n")
        f.write("- **Canonical Feature Selection Rules**:\n")
        f.write("  - Strict cardinality: Exactly 3 distinct features per student chosen from the 7 canonical features.\n")
        f.write("  - Total feature selections across cohort: $3 \\times 300 = 900$.\n")
        f.write("  - Total theoretical combinations available: $\\binom{7}{3} = 35$.\n\n")
        f.write("## 3. Feature Selection Frequencies\n\n")
        f_counts = {}
        for feat in CANONICAL_FEATURES:
            f_counts[feat] = sum(1 for r in records if feat in r["preferred_features"])
        for feat, count in sorted(f_counts.items(), key=lambda x: -x[1]):
            f.write(f"  - {feat}: {count} selections ({count/300*100:.1f}% of students)\n")
        f.write(f"\n  *Sum of feature selections: {sum(f_counts.values())} (Guaranteed = 3N = 900)*\n\n")
        f.write("## 4. File Formats\n\n")
        f.write("1. `data/synthetic_survey_300.csv`: Tabular CSV format compatible with Microsoft Excel, Google Sheets, and Pandas.\n")
        f.write("2. `src/data/survey_demo_data.json`: Canonical JSON structure consumed by the Next.js runtime.\n")
        f.write("3. `data/seed_survey_300.sql`: SQL DDL and INSERT script for relational database replication.\n")
    print(f"Written: {doc_path}")

if __name__ == "__main__":
    main()

```
