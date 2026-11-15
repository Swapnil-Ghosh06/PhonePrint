"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  type SmartphoneBrand,
  type BudgetRange,
  type SmartphoneFeature,
} from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

export interface PreferenceBuilderProps {
  brand: SmartphoneBrand;
  setBrand: (brand: SmartphoneBrand) => void;
  budget: BudgetRange;
  setBudget: (budget: BudgetRange) => void;
  features: readonly SmartphoneFeature[];
  toggleFeature: (feature: SmartphoneFeature) => void;
  resetPreferences: () => void;
  onApplyPreset: (preset: UserProfileInput) => void;
}

interface PresetOption {
  label: string;
  description: string;
  profile: UserProfileInput;
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    label: "Apple Flagship Creator",
    description: "Apple • Above ₹60,000 • Camera, Battery, Build",
    profile: {
      brand: "Apple",
      budget: "Above ₹60,000",
      features: [
        "Camera Quality",
        "Battery Life",
        "Build & Design Quality",
      ],
    },
  },
  {
    label: "Google Everyday General",
    description: "Google • ₹15,000 - ₹30,000 • Camera, Battery, Software",
    profile: {
      brand: "Google",
      budget: "₹15,000 - ₹30,000",
      features: [
        "Camera Quality",
        "Battery Life",
        "Software & OS Experience",
      ],
    },
  },
  {
    label: "Samsung Gaming Enthusiast",
    description: "Samsung • ₹30,000 - ₹60,000 • Display, Processing, Storage",
    profile: {
      brand: "Samsung",
      budget: "₹30,000 - ₹60,000",
      features: [
        "Display Quality",
        "Processing Performance",
        "Storage Capacity",
      ],
    },
  },
  {
    label: "Budget Efficiency Power",
    description: "Xiaomi • Under ₹15,000 • Battery, Storage, Processing",
    profile: {
      brand: "Xiaomi",
      budget: "Under ₹15,000",
      features: [
        "Battery Life",
        "Storage Capacity",
        "Processing Performance",
      ],
    },
  },
];

export function PreferenceBuilder({
  brand,
  setBrand,
  budget,
  setBudget,
  features,
  toggleFeature,
  resetPreferences,
  onApplyPreset,
}: PreferenceBuilderProps) {
  const isFeatureCountValid = features.length === 3;

  return (
    <Card className="border-stone-300/80 shadow-none">
      <CardHeader
        title="Construct Your Preference Vector"
        subtitle="Specify target brand, budget tier, and exactly three priority features"
        badge={
          isFeatureCountValid ? (
            <Badge variant="lime">3 of 3 Features Selected</Badge>
          ) : (
            <Badge variant="warning">{features.length} of 3 Selected</Badge>
          )
        }
      />
      <CardContent className="space-y-6">
        {/* Quick Persona Presets */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2 font-bold">
            [ BENCHMARK PRESETS ]
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_OPTIONS.map((preset) => {
              const isActive =
                brand === preset.profile.brand &&
                budget === preset.profile.budget &&
                preset.profile.features.every((f) => features.includes(f));
              return (
                <button
                  key={preset.label}
                  onClick={() => onApplyPreset(preset.profile)}
                  className={`px-3 py-1.5 rounded-xs text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-stone-900 text-white shadow-none"
                      : "bg-white hover:bg-stone-100 text-stone-800 border border-stone-300/80"
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step A & B: Brand and Budget Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brand Selection */}
          <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-brand"
                className="text-xs font-semibold text-stone-900 tracking-tight"
              >
                1. Preferred Brand (B)
              </label>
              <span className="font-mono text-xs font-medium text-stone-800 bg-white px-2 py-0.5 rounded-xs border border-stone-300/80">
                {brand}
              </span>
            </div>
            <select
              id="select-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value as SmartphoneBrand)}
              className="h-9 w-full rounded-xs border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {SMARTPHONE_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 font-sans">
              Matches respondents where preferred_brand = &quot;{brand}&quot;
            </p>
          </div>

          {/* Budget Selection */}
          <div className="rounded-xs border border-stone-300/80 bg-[#FAF9F5] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-budget"
                className="text-xs font-semibold text-stone-900 tracking-tight"
              >
                2. Budget Range (P)
              </label>
              <span className="font-mono text-xs font-medium text-stone-800 bg-white px-2 py-0.5 rounded-xs border border-stone-300/80">
                {budget}
              </span>
            </div>
            <select
              id="select-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetRange)}
              className="h-9 w-full rounded-xs border border-stone-300 bg-white px-3 text-xs font-medium text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {BUDGET_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 font-sans">
              Matches respondents where budget_range = &quot;{budget}&quot;
            </p>
          </div>
        </div>

        {/* Step C: Feature Preferences */}
        <div className="rounded-xs border border-stone-300/80 bg-white p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
            <div>
              <span className="text-xs font-semibold text-stone-900 block">
                3. Priority Feature Triplet (F)
              </span>
              <p className="text-xs text-stone-500 font-sans">
                Select exactly three distinct canonical features. Selection is unranked (order does not matter).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs font-medium px-2 py-0.5 rounded-xs ${
                  isFeatureCountValid
                    ? "bg-lime-50 text-lime-900 border border-lime-300"
                    : "bg-amber-50 text-amber-900 border border-amber-300"
                }`}
              >
                {features.length} / 3 Selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreferences}
                className="text-xs h-7 px-2"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {SMARTPHONE_FEATURES.map((feature) => {
              const isSelected = features.includes(feature);
              const isDisabled = !isSelected && features.length >= 3;
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  disabled={isDisabled}
                  className={`p-2.5 rounded-xs border text-left text-xs font-medium transition-colors flex items-center justify-between ${
                    isSelected
                      ? "border-cobalt-600 bg-cobalt-50 text-cobalt-950 font-semibold"
                      : isDisabled
                      ? "border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed opacity-60"
                      : "border-stone-300/80 bg-white hover:bg-stone-50 text-stone-800"
                  }`}
                >
                  <span>{feature}</span>
                  <span
                    className={`font-mono text-xs ${
                      isSelected
                        ? "text-cobalt-700 font-bold"
                        : isDisabled
                        ? "text-stone-300"
                        : "text-stone-400"
                    }`}
                  >
                    {isSelected ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feature selection notice */}
          {features.length === 3 ? (
            <p className="text-[11px] text-lime-800 font-medium font-sans">
              ✓ Exactly 3 features selected. Deselect any active feature to swap it with another.
            </p>
          ) : (
            <p className="text-[11px] text-amber-800 font-medium font-sans">
              Please select {3 - features.length} more feature{3 - features.length > 1 ? "s" : ""} to complete your profile vector.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
