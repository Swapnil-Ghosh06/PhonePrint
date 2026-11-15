"use client";

import React from "react";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  type SmartphoneBrand,
  type SmartphoneFeature,
} from "@/types/survey";

export interface BrandFeatureControlsProps {
  selectedBrands: readonly SmartphoneBrand[];
  setSelectedBrands: (brands: SmartphoneBrand[]) => void;
  selectedFeatures: readonly SmartphoneFeature[];
  setSelectedFeatures: (features: SmartphoneFeature[]) => void;
}

export function BrandFeatureControls({
  selectedBrands,
  setSelectedBrands,
  selectedFeatures,
  setSelectedFeatures,
}: BrandFeatureControlsProps) {
  const toggleBrand = (b: SmartphoneBrand) => {
    if (selectedBrands.includes(b)) {
      setSelectedBrands(selectedBrands.filter((brand) => brand !== b));
    } else {
      setSelectedBrands([...selectedBrands, b]);
    }
  };

  const toggleFeature = (f: SmartphoneFeature) => {
    if (selectedFeatures.includes(f)) {
      setSelectedFeatures(selectedFeatures.filter((feat) => feat !== f));
    } else {
      setSelectedFeatures([...selectedFeatures, f]);
    }
  };

  return (
    <div className="rounded-xs border border-stone-200 bg-[#FAF9F5] p-4 space-y-4 shadow-none">
      {/* Brand Selection */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200 pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-700">
            1. Select Brands to Compare ({selectedBrands.length} / {SMARTPHONE_BRANDS.length})
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedBrands([...SMARTPHONE_BRANDS])}
              className="text-cobalt-700 hover:underline font-medium"
            >
              Select All
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setSelectedBrands(["Apple", "Samsung", "Google"])}
              className="text-cobalt-700 hover:underline font-medium"
            >
              Top 3 Rivals
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setSelectedBrands(["Xiaomi", "Motorola", "OnePlus"])}
              className="text-cobalt-700 hover:underline font-medium"
            >
              Alternative Tier
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SMARTPHONE_BRANDS.map((b) => {
            const isSelected = selectedBrands.includes(b);
            return (
              <button
                key={b}
                onClick={() => toggleBrand(b)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cobalt-600 text-white shadow-none"
                    : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-200"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {b}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Selection */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200 pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-700">
            2. Canonical Features to Evaluate ({selectedFeatures.length} / {SMARTPHONE_FEATURES.length})
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedFeatures([...SMARTPHONE_FEATURES])}
              className="text-cobalt-700 hover:underline font-medium"
            >
              All 7 Features
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() =>
                setSelectedFeatures([
                  "Camera Quality",
                  "Battery Life",
                  "Processing Performance",
                ])
              }
              className="text-cobalt-700 hover:underline font-medium"
            >
              Core Trinity
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setSelectedFeatures([])}
              className="text-stone-500 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SMARTPHONE_FEATURES.map((f) => {
            const isSelected = selectedFeatures.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-lime-600 text-white shadow-none"
                    : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-200"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
