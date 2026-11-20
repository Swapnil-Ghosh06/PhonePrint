"use client";

import React, { useState } from "react";
import Link from "next/link";
import DishOrbitCarousel, { type Dish } from "@/components/ui/dish-orbit-carousel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

// High-fidelity SVG plate cutouts for standalone local demo
const SVG_STEAK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <radialGradient id="plate" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="%23f8fafc"/>
      <stop offset="90%" stop-color="%23e2e8f0"/>
      <stop offset="100%" stop-color="%23cbd5e1"/>
    </radialGradient>
    <radialGradient id="rim" cx="50%" cy="50%" r="50%">
      <stop offset="85%" stop-color="%23ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="%2394a3b8" stop-opacity="0.3"/>
    </radialGradient>
    <radialGradient id="meat" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="%237f1d1d"/>
      <stop offset="60%" stop-color="%23450a0a"/>
      <stop offset="100%" stop-color="%231c0404"/>
    </radialGradient>
  </defs>
  <circle cx="150" cy="150" r="140" fill="url(%23plate)" stroke="%23e2e8f0" stroke-width="4"/>
  <circle cx="150" cy="150" r="120" fill="none" stroke="url(%23rim)" stroke-width="8"/>
  <!-- Charred Ribeye Steak -->
  <path d="M 85 145 C 75 105, 120 75, 175 85 C 220 95, 235 145, 215 185 C 195 220, 135 225, 95 195 C 75 180, 85 155, 85 145 Z" fill="url(%23meat)"/>
  <!-- Sear marks -->
  <line x1="110" y1="105" x2="190" y2="185" stroke="%23170303" stroke-width="5" stroke-linecap="round"/>
  <line x1="130" y1="95" x2="210" y2="175" stroke="%23170303" stroke-width="5" stroke-linecap="round"/>
  <line x1="90" y1="125" x2="170" y2="205" stroke="%23170303" stroke-width="5" stroke-linecap="round"/>
  <!-- Rosemary sprig -->
  <path d="M 125 150 Q 155 130 185 120" stroke="%2315803d" stroke-width="3" fill="none"/>
  <circle cx="140" cy="138" r="4" fill="%2322c55e"/>
  <circle cx="160" cy="130" r="4" fill="%2322c55e"/>
  <circle cx="178" cy="122" r="4" fill="%2322c55e"/>
  <!-- Flaky sea salt & pepper -->
  <circle cx="145" cy="115" r="2" fill="%23ffffff"/>
  <circle cx="165" cy="160" r="2" fill="%23ffffff"/>
  <circle cx="130" cy="170" r="2" fill="%23ffffff"/>
  <circle cx="180" cy="140" r="1.5" fill="%230f172a"/>
</svg>`;

const SVG_SALAD = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <radialGradient id="plate2" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="%23f8fafc"/>
      <stop offset="90%" stop-color="%23e2e8f0"/>
      <stop offset="100%" stop-color="%23cbd5e1"/>
    </radialGradient>
  </defs>
  <circle cx="150" cy="150" r="140" fill="url(%23plate2)" stroke="%23e2e8f0" stroke-width="4"/>
  <!-- Base Greens -->
  <circle cx="145" cy="145" r="85" fill="%23166534" opacity="0.9"/>
  <circle cx="155" cy="140" r="75" fill="%2322c55e" opacity="0.8"/>
  <circle cx="135" cy="155" r="65" fill="%2386efac" opacity="0.9"/>
  <!-- Cherry Tomatoes -->
  <circle cx="120" cy="125" r="14" fill="%23ef4444"/>
  <circle cx="175" cy="130" r="12" fill="%23dc2626"/>
  <circle cx="140" cy="180" r="13" fill="%23ef4444"/>
  <circle cx="185" cy="175" r="11" fill="%23b91c1c"/>
  <!-- Avocado Slices -->
  <ellipse cx="120" cy="155" rx="18" ry="10" transform="rotate(-30 120 155)" fill="%23a3e635"/>
  <ellipse cx="160" cy="160" rx="18" ry="10" transform="rotate(20 160 160)" fill="%23bef264"/>
  <!-- Feta Cheese Crumbles -->
  <rect x="145" y="115" width="10" height="10" rx="2" fill="%23ffffff"/>
  <rect x="130" y="140" width="9" height="9" rx="2" fill="%23ffffff"/>
  <rect x="165" y="145" width="8" height="8" rx="2" fill="%23ffffff"/>
</svg>`;

const SVG_SALMON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <radialGradient id="plate3" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="%23f8fafc"/>
      <stop offset="90%" stop-color="%23e2e8f0"/>
      <stop offset="100%" stop-color="%23cbd5e1"/>
    </radialGradient>
    <linearGradient id="salmonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23fb923c"/>
      <stop offset="60%" stop-color="%23ea580c"/>
      <stop offset="100%" stop-color="%23c2410c"/>
    </linearGradient>
  </defs>
  <circle cx="150" cy="150" r="140" fill="url(%23plate3)" stroke="%23e2e8f0" stroke-width="4"/>
  <!-- Asparagus spears -->
  <line x1="100" y1="180" x2="200" y2="110" stroke="%234d7c0f" stroke-width="8" stroke-linecap="round"/>
  <line x1="90" y1="195" x2="190" y2="125" stroke="%233f6212" stroke-width="8" stroke-linecap="round"/>
  <!-- Salmon Fillet -->
  <rect x="105" y="115" width="90" height="70" rx="14" transform="rotate(-15 150 150)" fill="url(%23salmonGrad)"/>
  <!-- Sear lines -->
  <line x1="115" y1="130" x2="175" y2="115" stroke="%237c2d12" stroke-width="4" stroke-linecap="round"/>
  <line x1="122" y1="145" x2="182" y2="130" stroke="%237c2d12" stroke-width="4" stroke-linecap="round"/>
  <line x1="130" y1="160" x2="190" y2="145" stroke="%237c2d12" stroke-width="4" stroke-linecap="round"/>
  <!-- Lemon wedge -->
  <path d="M 195 165 A 22 22 0 0 1 215 190 Z" fill="%23facc15" stroke="%23eab308" stroke-width="2"/>
</svg>`;

const SVG_DESSERT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <defs>
    <radialGradient id="plate4" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="%23f8fafc"/>
      <stop offset="90%" stop-color="%23e2e8f0"/>
      <stop offset="100%" stop-color="%23cbd5e1"/>
    </radialGradient>
    <radialGradient id="tart" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="%23fbbf24"/>
      <stop offset="70%" stop-color="%23f59e0b"/>
      <stop offset="100%" stop-color="%23d97706"/>
    </radialGradient>
  </defs>
  <circle cx="150" cy="150" r="140" fill="url(%23plate4)" stroke="%23e2e8f0" stroke-width="4"/>
  <!-- Coulis Swirl -->
  <path d="M 75 190 Q 120 240 190 220 T 235 150" fill="none" stroke="%23e11d48" stroke-width="6" stroke-linecap="round"/>
  <!-- Citrus Meringue Tart -->
  <circle cx="150" cy="150" r="60" fill="url(%23tart)"/>
  <!-- Torched Meringue Peaks -->
  <circle cx="135" cy="135" r="12" fill="%23fffbeb" stroke="%2392400e" stroke-width="2"/>
  <circle cx="165" cy="135" r="12" fill="%23fffbeb" stroke="%2392400e" stroke-width="2"/>
  <circle cx="150" cy="165" r="14" fill="%23fffbeb" stroke="%2392400e" stroke-width="2"/>
  <!-- Mint Garnish -->
  <path d="M 150 148 C 145 138, 155 130, 160 145 Z" fill="%2316a34a"/>
  <!-- Gold leaf speckle -->
  <circle cx="148" cy="152" r="3" fill="%23f59e0b"/>
</svg>`;

const DEMO_DISHES: Dish[] = [
  {
    title: "Woodfire Grilled",
    subtitle: "Aged Prime Ribeye",
    image: SVG_STEAK,
    alt: "Charred Ribeye Steak with rosemary garlic butter",
    eyebrow: "#1 Chef's Signature",
    label: "Prime Ribeye",
    rating: 4.9,
    chef: "Marco Rossi",
    kitchen: "Fire & Hearth Steakhouse",
    description: "Dry-aged 35 days in Himalayan salt chamber, charred over white oak embers, basted with cultured rosemary butter.",
    likes: 242,
    ingredients: ["Prime Black Angus", "Flaky Fleur de Sel", "Garden Rosemary", "Cultured Butter", "Cracked Tellicherry Pepper"],
    accent: "#E07A5F",
  },
  {
    title: "Crisp Botanical",
    subtitle: "Mediterranean Harvest Salad",
    image: SVG_SALAD,
    alt: "Garden Salad with heirloom tomatoes and avocado",
    eyebrow: "#2 Garden Fresh",
    label: "Harvest Salad",
    rating: 4.8,
    chef: "Elena Vance",
    kitchen: "Verdant Bistro",
    description: "Hydroponic garden greens, sun-ripened San Marzano cherry tomatoes, creamy Hass avocado, and PDO barrel-aged Greek feta.",
    likes: 189,
    ingredients: ["Heirloom Tomatoes", "Hass Avocado", "Barrel-aged Feta", "Baby Romaine", "Cold-pressed Kalamata Oil"],
    accent: "#81B29A",
  },
  {
    title: "Pacific Wild",
    subtitle: "Pan-Seared King Salmon",
    image: SVG_SALMON,
    alt: "Wild King Salmon with tender grilled asparagus",
    eyebrow: "#3 Ocean Catch",
    label: "King Salmon",
    rating: 4.95,
    chef: "Kenji Takahashi",
    kitchen: "Nami Coastal Kitchen",
    description: "Crispy skin King salmon fillet rested over charred pencil asparagus, finished with Meyer lemon beurre blanc and caper berries.",
    likes: 310,
    ingredients: ["Wild King Salmon", "Spring Asparagus", "Meyer Lemon", "Normandy Butter", "Sicilian Capers"],
    accent: "#F2CC8F",
  },
  {
    title: "Torched Citrus",
    subtitle: "Yuzu Meringue Tart",
    image: SVG_DESSERT,
    alt: "Citrus tart with torched meringue and raspberry coulis",
    eyebrow: "#4 Pastry Masterpiece",
    label: "Yuzu Tart",
    rating: 4.88,
    chef: "Claire Dupont",
    kitchen: "Atelier Sucré",
    description: "Crisp almond sable crust filled with tangy Japanese yuzu curd, crowned with hand-torched Italian meringue and gold leaf.",
    likes: 275,
    ingredients: ["Japanese Yuzu", "Almond Sable", "Italian Meringue", "Wild Raspberry Coulis", "24K Edible Gold Leaf"],
    accent: "#F4A261",
  },
];

export default function DemoPage() {
  const [activeDish, setActiveDish] = useState<Dish>(DEMO_DISHES[0]!);
  const [lastAction, setLastAction] = useState<string>("Ready — scroll or use navigation controls to swing dishes.");

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-montserrat font-semibold text-blue-600 hover:text-blue-800 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-100/60 shadow-sm transition-all"
          >
            ← Back to Campus Pulse
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="cobalt">shadcn / GSAP Integration</Badge>
            <Badge variant="lime">Physics-based 60FPS</Badge>
          </div>
        </div>

        {/* Page Title */}
        <PageHeader
          badge={{ text: "Interactive UI Component", variant: "cobalt" }}
          title="Dish Orbit Carousel"
          description="A smart kitchen and showcase display menu. Scroll-driven GSAP pinned timeline with swinging circular orbit physics, clip-path text reveals, and dynamic SVG backdrop color morphing."
        />

        {/* Action Status Bar */}
        <div className="glass-panel p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-montserrat text-slate-600 border border-white/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span><strong>Active Dish:</strong> {activeDish.title} — {activeDish.subtitle}</span>
          </div>
          <div className="text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-lg">
            {lastAction}
          </div>
        </div>

        {/* Carousel Showcase Container */}
        <Card className="p-0 overflow-hidden border border-slate-200/80 shadow-2xl rounded-3xl bg-white">
          <DishOrbitCarousel
            dishes={DEMO_DISHES}
            height="580px"
            loop={true}
            fontSrc={null}
            onChange={(idx) => {
              const d = DEMO_DISHES[idx];
              if (d) {
                setActiveDish(d);
                setLastAction(`Changed to Dish #${idx + 1}: ${d.subtitle}`);
              }
            }}
            onOrder={(dish, idx) => {
              setLastAction(`Order action triggered for ${dish.subtitle} (Index ${idx})`);
            }}
            onPlay={(dish, idx) => {
              setLastAction(`Play video action triggered for ${dish.subtitle} (Index ${idx})`);
            }}
          />
        </Card>

        {/* Technical Specification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/80 space-y-2">
            <h3 className="font-sora text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Circular Orbit Physics
            </h3>
            <p className="font-dm-sans text-xs text-slate-600 leading-relaxed">
              Plates pivot around an elevated origin point with custom SVG radial arc paths. Outgoing plates accelerate along the top curve while incoming plates swing into view.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/80 space-y-2">
            <h3 className="font-sora text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Two-Weight Typography Reveal
            </h3>
            <p className="font-dm-sans text-xs text-slate-600 leading-relaxed">
              The headline splits into light and bold titles, animated with bidirectional polygon clipping wipes (thin line from right, heavy line from left).
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/80 space-y-2">
            <h3 className="font-sora text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Light Theme & Minimalist
            </h3>
            <p className="font-dm-sans text-xs text-slate-600 leading-relaxed">
              Adheres strictly to the light minimalism and glassmorphic aesthetic using approved typography: DM Sans, Montserrat, and Sora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
