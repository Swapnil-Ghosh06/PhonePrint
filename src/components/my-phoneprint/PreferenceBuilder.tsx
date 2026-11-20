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
    <Card>
      <CardHeader
        title="Construct Your Preference Vector"
        subtitle="Specify target brand, budget tier, and exactly three priority features"
        badge={
          isFeatureCountValid ? (
            <Badge variant="lime">3 of 3 Selected</Badge>
          ) : (
            <Badge variant="warning">{features.length} of 3 Selected</Badge>
          )
        }
      />
      <CardContent className="space-y-6">
        {/* Quick Persona Presets */}
        <div>
          <label className="text-xs font-montserrat uppercase tracking-wider text-slate-500 block mb-2 font-semibold">
            Quick Persona Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_OPTIONS.map((preset) => {
              const isActive =
                brand === preset.profile.brand &&
                budget === preset.profile.budget &&
                preset.profile.features.every((f) => features.includes(f));
              return (
                <button
                  key={preset.label}
                  onClick={() => onApplyPreset(preset.profile)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-montserrat transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20"
                      : "glass-panel hover:bg-white text-slate-700 border border-slate-200/70"
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
          <div className="glass-panel rounded-2xl border border-blue-200/50 bg-blue-50/20 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-brand"
                className="text-xs font-sora font-bold text-slate-900"
              >
                1. Preferred Brand (B)
              </label>
              <span className="font-montserrat text-xs font-semibold text-blue-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-blue-200/80">
                {brand}
              </span>
            </div>
            <select
              id="select-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value as SmartphoneBrand)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white/90 px-3 text-xs font-montserrat font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {SMARTPHONE_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 font-sans">
              Filters cohort where brand = &quot;{brand}&quot;
            </p>
          </div>

          {/* Budget Selection */}
          <div className="glass-panel rounded-2xl border border-emerald-200/50 bg-emerald-50/20 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="select-budget"
                className="text-xs font-sora font-bold text-slate-900"
              >
                2. Budget Range (P)
              </label>
              <span className="font-montserrat text-xs font-semibold text-emerald-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                {budget}
              </span>
            </div>
            <select
              id="select-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetRange)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white/90 px-3 text-xs font-montserrat font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {BUDGET_RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 font-sans">
              Filters cohort where budget = &quot;{budget}&quot;
            </p>
          </div>
        </div>

        {/* Step C: Feature Preferences */}
        <div className="glass-panel rounded-2xl border border-white/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-3">
            <div>
              <span className="text-sm font-sora font-bold text-slate-900 block">
                3. Priority Feature Triplet (F)
              </span>
              <p className="text-xs text-slate-500 font-sans">
                Select strictly three canonical features. Order does not matter: C(7,3) combinatorial space.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isFeatureCountValid ? "lime" : "warning"}
                size="md"
              >
                {features.length} / 3 Selected
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={resetPreferences}
                className="text-xs"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {SMARTPHONE_FEATURES.map((feature) => {
              const isSelected = features.includes(feature);
              const isDisabled = !isSelected && features.length >= 3;
              return (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  disabled={isDisabled}
                  className={`p-3 rounded-xl border text-left text-xs font-montserrat transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-900 font-semibold shadow-xs"
                      : isDisabled
                      ? "border-slate-200/60 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-50"
                      : "border-slate-200/80 glass-panel hover:bg-white text-slate-700"
                  }`}
                >
                  <span>{feature}</span>
                  <span
                    className={`font-montserrat text-xs ${
                      isSelected
                        ? "text-blue-600 font-bold"
                        : isDisabled
                        ? "text-slate-300"
                        : "text-slate-400"
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
            <p className="text-xs text-emerald-700 font-medium font-sans flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Exactly 3 features selected. Profile is ready for matching engine evaluation.
            </p>
          ) : (
            <p className="text-xs text-amber-700 font-medium font-sans flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Please select {3 - features.length} more feature{3 - features.length > 1 ? "s" : ""} to complete your profile vector.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
