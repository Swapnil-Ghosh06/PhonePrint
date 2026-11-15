# PhonePrint Phase 09 — Complete UI Source Code Bundle

Complete unabridged source code for all modified UI components, layouts, pages, and styling files in the Light Editorial Theme.

---


## File: `src/app/layout.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Configured metadata, title, and link tags for vector favicon SVG assets.

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "PhonePrint — Discrete Mathematics & Smartphone Preference Analytics",
  description:
    "An interactive research platform modeling smartphone brand and feature preferences through discrete mathematics and graph theory.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

```


## File: `src/app/globals.css` (**MODIFIED IN PHASE 09**)

> **Notes**: Configured light paper variables (#FBFBF9), editorial grid pattern, and light scrollbar styling.

```css
@import "katex/dist/katex.min.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #FBFBF9;
  --foreground: #181715;
  --surface-paper: #FBFBF9;
  --surface-card: #FFFFFF;
  --surface-subtle: #F4F3EE;
  --surface-border: #E8E6DF;
  --accent-cobalt: #2563EB;
  --accent-lime: #84CC16;
}

body {
  color: var(--foreground);
  background-color: var(--background);
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

::selection {
  background-color: #DBEAFE;
  color: #1E40AF;
}

/* Custom subtle scrollbar for light theme */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #D3D0C7;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #A8A59C;
}

/* Editorial styling utilities */
.bg-grid-pattern {
  background-size: 28px 28px;
  background-image: 
    linear-gradient(to right, rgba(24, 23, 21, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(24, 23, 21, 0.035) 1px, transparent 1px);
}

.editorial-line {
  height: 1px;
  background-color: #181715;
}

.editorial-double-line {
  border-top: 1px solid #181715;
  border-bottom: 1px solid rgba(24, 23, 21, 0.15);
  padding-bottom: 2px;
}

```


## File: `src/components/layout/AppShell.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Updated root background to bg-[#FBFBF9] and text-stone-900.

```typescript
import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-stone-900 antialiased font-sans selection:bg-cobalt-100 selection:text-cobalt-900">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

```


## File: `src/components/layout/Navbar.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Redesigned with light translucent glassmorphism, vector PhonePrintLogo, and SIMULATED CAMPUS DATA — N=300 badge.

```typescript
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhonePrintLogo } from "@/components/ui/PhonePrintLogo";
import { StatusDot } from "@/components/ui/StatusDot";
import { getActiveDatasetInfo } from "@/lib/data/loader";

interface NavLink {
  name: string;
  href: string;
  code: string;
  tag?: string;
}

const NAV_LINKS: NavLink[] = [
  { name: "Campus Pulse", href: "/", code: "01" },
  { name: "My PhonePrint", href: "/my-phoneprint", code: "02", tag: "Interactive" },
  { name: "SetLab", href: "/setlab", code: "03", tag: "Set Theory" },
  { name: "ComboLab", href: "/combolab", code: "04", tag: "C(7,3)" },
  { name: "Experiment Studio", href: "/experiment-studio", code: "05", tag: "Hypothesis" },
  { name: "Methodology", href: "/methodology", code: "06" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const datasetInfo = getActiveDatasetInfo();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#FBFBF9]/90 backdrop-blur-md text-stone-900 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 rounded-lg"
          >
            <PhonePrintLogo size={34} showWordmark />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                  isActive
                    ? "bg-cobalt-50 text-cobalt-700 font-semibold border border-cobalt-200/60 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/70"
                }`}
              >
                <span className="font-mono text-[10px] text-stone-400 mr-1.5">
                  {link.code}
                </span>
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cobalt-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section / Dataset Status */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/90 px-3 py-1 text-xs shadow-2xs">
            <StatusDot variant={datasetInfo.isDemo ? "lime" : "cobalt"} pulse size="sm" />
            <span className="font-mono text-[11px] font-medium text-stone-700">
              {datasetInfo.badgeText}
            </span>
          </div>

          <span className="font-mono text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
            Research v2.5
          </span>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-[#FBFBF9] px-4 py-4 lg:hidden shadow-lg">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cobalt-50 text-cobalt-700 font-semibold border border-cobalt-200/60"
                      : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-stone-400">
                      {link.code}
                    </span>
                    <span>{link.name}</span>
                  </div>
                  {link.tag && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                      {link.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-stone-200 pt-3 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <StatusDot variant={datasetInfo.isDemo ? "lime" : "cobalt"} pulse size="sm" />
              <span className="font-mono text-[11px] text-stone-700">
                {datasetInfo.badgeText}
              </span>
            </div>
            <span className="font-mono text-[11px] text-stone-500">v2.5</span>
          </div>
        </div>
      )}
    </header>
  );
}

```


## File: `src/components/layout/Footer.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Redesigned with light paper styling, double hairline dividers, and university research disclosures.

```typescript
import React from "react";
import Link from "next/link";
import { PhonePrintLogo } from "@/components/ui/PhonePrintLogo";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#F4F3EE] text-xs text-stone-600 mt-28">
      {/* Editorial top accent line */}
      <div className="h-0.5 bg-stone-900 w-full" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block">
              <PhonePrintLogo size={32} showWordmark />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-stone-600">
              An interactive research laboratory modeling smartphone brand and feature
              preferences through axiomatic discrete set theory, combinatorial spaces,
              and educational graph-theoretic visualization.
            </p>
            <div className="rounded-lg border border-stone-200 bg-white p-3 text-[11px] text-stone-700 shadow-2xs">
              <span className="font-semibold text-stone-900 font-mono uppercase tracking-wide text-[10px] block mb-1">
                Academic Research Disclosure
              </span>
              Current demonstration runs on <code className="font-mono text-cobalt-700 font-semibold bg-cobalt-50 px-1 py-0.5 rounded border border-cobalt-200/60">SIMULATED CAMPUS DATA — N=300</code>. All records are synthesized for software architecture validation and pedagogical exploration.
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Laboratory Modules
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li>
                <Link
                  href="/"
                  className="text-stone-600 hover:text-cobalt-600 transition-colors"
                >
                  01 / Campus Pulse
                </Link>
              </li>
              <li>
                <Link
                  href="/my-phoneprint"
                  className="text-stone-600 hover:text-cobalt-600 transition-colors"
                >
                  02 / My PhonePrint
                </Link>
              </li>
              <li>
                <Link
                  href="/setlab"
                  className="text-stone-600 hover:text-cobalt-600 transition-colors"
                >
                  03 / SetLab (Venn &amp; PIE)
                </Link>
              </li>
              <li>
                <Link
                  href="/combolab"
                  className="text-stone-600 hover:text-cobalt-600 transition-colors"
                >
                  04 / ComboLab (C(7,3))
                </Link>
              </li>
              <li>
                <Link
                  href="/experiment-studio"
                  className="text-stone-600 hover:text-cobalt-600 transition-colors"
                >
                  05 / Experiment Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-stone-600 hover:text-cobalt-600 transition-colors"
                >
                  06 / Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Foundation */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Discrete Mathematics
            </h4>
            <ul className="space-y-2 text-[11px] text-stone-600">
              <li>&bull; Principle of Inclusion-Exclusion</li>
              <li>&bull; Binomial Coefficients &amp; Permutations</li>
              <li>&bull; Partition Conservation ($N_3+N_2+N_1+N_0=N$)</li>
              <li>&bull; Dynamic 300% Feature-Sum Invariant</li>
              <li className="pt-2">
                <Link
                  href="/methodology"
                  className="font-medium text-cobalt-700 hover:underline inline-flex items-center gap-1"
                >
                  Review Proofs &amp; Specs &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} PhonePrint Experiential Learning Project. University Computer Science &amp; Discrete Mathematics.
          </p>
          <p className="font-mono text-stone-500">
            Next.js 15 &bull; TypeScript &bull; Editorial Light Theme &bull; N=300
          </p>
        </div>
      </div>
    </footer>
  );
}

```


## File: `src/components/ui/PhonePrintLogo.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: New vector SVG logo uniting smartphone silhouette, biometric fingerprint contours, and cobalt data node.

```typescript
import React from "react";

export interface PhonePrintLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

/**
 * PhonePrint Identity Symbol:
 * Harmonizes the silhouette of a modern smartphone with biometric fingerprint contours
 * and a discrete mathematical focal node (representing individual preference in U).
 */
export function PhonePrintLogo({
  size = 32,
  className = "",
  showWordmark = false,
  wordmarkClassName = "",
}: PhonePrintLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Soft rounded container with subtle border */}
        <rect
          x="3"
          y="2"
          width="34"
          height="36"
          rx="9"
          className="fill-stone-50 stroke-stone-300/80"
          strokeWidth="1.5"
        />

        {/* Top speaker slit (subtle phone detail) */}
        <line
          x1="17"
          y1="6"
          x2="23"
          y2="6"
          className="stroke-stone-400"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Outer fingerprint arch / contour */}
        <path
          d="M10 28C10 21.5 14.5 11 20 11C25.5 11 30 21.5 30 28"
          className="stroke-stone-700"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Middle fingerprint arch */}
        <path
          d="M14 29C14 24 16.5 15.5 20 15.5C23.5 15.5 26 24 26 29"
          className="stroke-stone-700"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Inner biometric loop */}
        <path
          d="M17.5 30C17.5 26.5 18.5 20 20 20C21.5 20 22.5 26.5 22.5 30"
          className="stroke-stone-800"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Central preference data node (cobalt focal point) */}
        <circle
          cx="20"
          cy="24"
          r="2.25"
          className="fill-cobalt-600 stroke-white"
          strokeWidth="1.2"
        />
      </svg>

      {showWordmark && (
        <div className={`flex flex-col leading-none ${wordmarkClassName}`}>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-lg tracking-tight text-stone-900">
              PhonePrint
            </span>
            <span className="font-mono text-[10px] uppercase font-semibold text-cobalt-700 bg-cobalt-50 border border-cobalt-200/80 px-1.5 py-0.5 rounded">
              Lab
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-wider uppercase text-stone-500 mt-0.5">
            Discrete Preference Analytics
          </span>
        </div>
      )}
    </div>
  );
}

```


## File: `src/components/ui/PageHeader.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Editorial light header with serif display typography, section code badges, and SectionHeader sub-component.

```typescript
import React from "react";
import { Badge } from "./Badge";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "cobalt" | "lime" | "warning";
  };
  actions?: React.ReactNode;
  className?: string;
  sectionCode?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className = "",
  sectionCode,
}: PageHeaderProps) {
  return (
    <div
      className={`border-b border-stone-200/90 bg-[#FBFBF9] px-4 py-10 sm:px-6 lg:px-8 bg-grid-pattern relative overflow-hidden ${className}`}
    >
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3 max-w-3xl">
            {/* Eyebrow and badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              {sectionCode && (
                <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                  {sectionCode}
                </span>
              )}
              {eyebrow && (
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cobalt-700">
                  {eyebrow}
                </span>
              )}
              {badge && (
                <Badge variant={badge.variant || "default"} size="sm">
                  {badge.text}
                </Badge>
              )}
            </div>

            {/* Editorial title */}
            <h1 className="text-3xl font-serif font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl leading-tight">
              {title}
            </h1>

            {/* Editorial description */}
            {description && (
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl font-sans">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2.5 md:self-end shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Editorial bottom hairline accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-stone-200" />
    </div>
  );
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-stone-200 ${className}`}>
      <div>
        <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{subtitle}</p>}
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
}

```


## File: `src/components/ui/Button.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Editorial light button styling with crisp stone borders and active states.

```typescript
import React from "react";

export type ButtonVariant = "primary" | "secondary" | "lime" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950 border border-stone-900 shadow-2xs disabled:bg-stone-300 disabled:border-stone-300",
    secondary:
      "bg-white text-stone-800 hover:bg-stone-50 active:bg-stone-100 border border-stone-200/90 shadow-2xs",
    lime:
      "bg-lime-600 text-white hover:bg-lime-700 active:bg-lime-800 font-semibold shadow-2xs disabled:opacity-50",
    outline:
      "bg-transparent text-stone-700 border border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:bg-stone-100",
    ghost:
      "bg-transparent text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 active:bg-stone-200",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3.5 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 disabled:pointer-events-none disabled:opacity-50 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

```


## File: `src/components/ui/Badge.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: All badge variants converted from dark mode to crisp high-contrast light editorial tokens.

```typescript
import React from "react";

export type BadgeVariant =
  | "default"
  | "cobalt"
  | "lime"
  | "success"
  | "warning"
  | "info"
  | "outline";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs",
    cobalt: "bg-cobalt-50 text-cobalt-800 border border-cobalt-200 shadow-2xs",
    lime: "bg-lime-50 text-lime-900 border border-lime-300 shadow-2xs",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs",
    warning: "bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs",
    info: "bg-cobalt-50 text-cobalt-800 border border-cobalt-200 shadow-2xs",
    outline: "bg-transparent text-stone-700 border border-stone-300",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-stone-400",
    cobalt: "bg-cobalt-600",
    lime: "bg-lime-600",
    success: "bg-emerald-600",
    warning: "bg-amber-600",
    info: "bg-cobalt-600",
    outline: "bg-stone-400",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-mono font-medium leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

```


## File: `src/components/ui/Callout.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Converted from dark #101623 containers to light tinted paper callouts (cobalt, lime, amber, neutral).

```typescript
import React from "react";

export type CalloutVariant = "info" | "highlight" | "warning" | "neutral";

export interface CalloutProps {
  title?: string;
  variant?: CalloutVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  title,
  variant = "info",
  icon,
  children,
  className = "",
}: CalloutProps) {
  const variantStyles: Record<
    CalloutVariant,
    { container: string; title: string; text: string; iconColor: string }
  > = {
    info: {
      container: "border-cobalt-200 bg-cobalt-50/60 text-stone-800 shadow-2xs",
      title: "text-cobalt-950 font-semibold",
      text: "text-stone-700",
      iconColor: "text-cobalt-600",
    },
    highlight: {
      container: "border-lime-200 bg-lime-50/60 text-stone-800 shadow-2xs",
      title: "text-lime-950 font-semibold",
      text: "text-stone-700",
      iconColor: "text-lime-700",
    },
    warning: {
      container: "border-amber-200 bg-amber-50/70 text-stone-800 shadow-2xs",
      title: "text-amber-950 font-semibold",
      text: "text-stone-700",
      iconColor: "text-amber-600",
    },
    neutral: {
      container: "border-stone-200 bg-[#F4F3EE]/80 text-stone-800 shadow-2xs",
      title: "text-stone-900 font-semibold",
      text: "text-stone-600",
      iconColor: "text-stone-500",
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-xs leading-relaxed ${style.container} ${className}`}
    >
      {icon && <div className={`flex-shrink-0 mt-0.5 ${style.iconColor}`}>{icon}</div>}
      <div className="space-y-1 w-full">
        {title && <h4 className={`text-sm ${style.title}`}>{title}</h4>}
        <div className={style.text}>{children}</div>
      </div>
    </div>
  );
}

```


## File: `src/components/ui/Tabs.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Redesigned as light paper container (#F4F3EE) with active white tab cards and subtle shadows.

```typescript
import React from "react";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({
  items,
  activeId,
  onChange,
  className = "",
  size = "md",
}: TabsProps) {
  const sizeStyles = {
    sm: "p-0.5 text-xs",
    md: "p-1 text-xs sm:text-sm",
  };

  const itemSizeStyles = {
    sm: "px-2.5 py-1",
    md: "px-3.5 py-1.5",
  };

  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap items-center rounded-lg border border-stone-200 bg-[#F4F3EE]/80 shadow-2xs ${sizeStyles[size]} ${className}`}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
              itemSizeStyles[size]
            } ${
              isActive
                ? "bg-white text-stone-900 shadow-2xs font-semibold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 rounded px-1.5 py-0.2 font-mono text-[10px] ${
                  isActive
                    ? "bg-cobalt-50 text-cobalt-700 border border-cobalt-200 font-semibold"
                    : "bg-stone-200/70 text-stone-600"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

```


## File: `src/components/ui/Card.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light card containers with subtle hairline borders, card headers, and content areas.

```typescript
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white shadow-card transition-all text-slate-900 ${
        hoverable ? "hover:border-slate-300 hover:shadow-dropdown" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b border-slate-100 p-5 ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 text-slate-800 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-t border-slate-100 bg-[#f8fafc] px-5 py-3 text-xs text-slate-600 rounded-b-xl ${className}`}
    >
      {children}
    </div>
  );
}

```


## File: `src/components/ui/MetricCard.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light metric cards with colored accent borders, bold serif/mono numbers, and metadata badges.

```typescript
import React from "react";
import { Badge, type BadgeVariant } from "./Badge";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    variant?: BadgeVariant;
  };
  accentColor?: "cobalt" | "lime" | "graphite";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subtext,
  badge,
  accentColor = "cobalt",
  icon,
  className = "",
}: MetricCardProps) {
  const accentBorders = {
    cobalt: "border-l-4 border-l-cobalt-600",
    lime: "border-l-4 border-l-lime-500",
    graphite: "border-l-4 border-l-slate-400",
  };

  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 ${accentBorders[accentColor]} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="font-mono text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {value}
        </div>
        {badge && (
          <Badge variant={badge.variant || "default"} size="sm">
            {badge.text}
          </Badge>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
          {subtext}
        </p>
      )}
    </div>
  );
}

```


## File: `src/components/ui/ChartCard.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light chart cards with key insight callouts in cobalt and lime accents.

```typescript
import React from "react";
import { Badge, type BadgeVariant } from "./Badge";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: BadgeVariant;
  };
  takeaway?: string;
  takeawayAccent?: "cobalt" | "lime";
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  badge,
  takeaway,
  takeawayAccent = "cobalt",
  action,
  children,
  className = "",
}: ChartCardProps) {
  const takeawayBorders = {
    cobalt:
      "border-l-4 border-l-cobalt-600 bg-cobalt-50/70 text-slate-800",
    lime:
      "border-l-4 border-l-lime-500 bg-lime-50/70 text-slate-800",
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white shadow-card text-slate-900 ${className}`}
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-slate-950">
                {title}
              </h3>
              {badge && (
                <Badge variant={badge.variant || "default"} size="sm">
                  {badge.text}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>

        <div className="p-5">{children}</div>
      </div>

      {takeaway && (
        <div
          className={`mx-5 mb-5 rounded-md px-3.5 py-2.5 text-xs font-normal leading-relaxed ${takeawayBorders[takeawayAccent]}`}
        >
          <span className="font-semibold uppercase tracking-wider text-[10px] mr-1.5 text-slate-900">
            Key Insight:
          </span>
          {takeaway}
        </div>
      )}
    </div>
  );
}

```


## File: `src/components/ui/DataTable.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Editorial data table with light headers, zebra striping, and clean borders.

```typescript
import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  className = "",
  emptyMessage = "No survey records found",
}: DataTableProps<T>) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-slate-200 bg-white ${className}`}
    >
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-[#f8fafc] text-slate-600 font-semibold">
            {columns.map((col) => {
              const alignClass =
                col.align === "center"
                  ? "text-center"
                  : col.align === "right"
                  ? "text-right"
                  : "text-left";
              return (
                <th
                  key={col.key}
                  className={`px-4 py-3 tracking-wider uppercase text-[11px] ${alignClass} ${col.className || ""}`}
                >
                  {col.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-400 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors hover:bg-slate-50 ${
                  rowIdx % 2 === 1
                    ? "bg-[#f8fafc]/60"
                    : "bg-white"
                }`}
              >
                {columns.map((col) => {
                  const alignClass =
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left";
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-slate-800 ${alignClass} ${col.className || ""}`}
                    >
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

```


## File: `src/components/ui/StatCard.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light stat cards with serif display numbers and light divider borders.

```typescript
import React from "react";
import { Card } from "./Card";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  meta?: string;
}

export function StatCard({ label, value, description, meta }: StatCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
          {label}
        </p>
        <div className="mt-2 text-2xl font-serif font-bold text-stone-900">
          {value}
        </div>
      </div>
      {(description || meta) && (
        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2 text-xs text-stone-500">
          {description && <span>{description}</span>}
          {meta && <span className="font-mono text-emerald-700 font-medium">{meta}</span>}
        </div>
      )}
    </Card>
  );
}

```


## File: `src/components/ui/EmptyState.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light dashed empty state with subtle stone background and clear icon containers.

```typescript
import React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-[#F4F3EE]/40 p-8 text-center sm:p-12 ${className}`}
    >
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          {icon}
        </div>
      ) : (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      )}

      <h3 className="text-base font-serif font-bold text-stone-900">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-stone-600 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}

```


## File: `src/components/visualizations/ChartTooltip.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Converted from dark #101623 to white/95 translucent backdrop with high-contrast text.

```typescript
import React from "react";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    dataKey?: string;
    color?: string;
    payload?: {
      percentage?: number;
      [key: string]: unknown;
    };
  }>;
  label?: string;
  unit?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  unit = "Respondents",
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const primaryItem = payload[0];
  const percentage = primaryItem?.payload?.percentage;

  return (
    <div className="rounded-xl border border-stone-200 bg-white/95 backdrop-blur-md p-3 shadow-md text-xs text-stone-900 min-w-[160px] z-50">
      {label && (
        <p className="font-serif font-bold text-stone-900 border-b border-stone-100 pb-1.5 mb-2 tracking-tight">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div
            key={`tooltip-${index}`}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color || "#2563eb" }}
              />
              <span className="text-stone-500 capitalize text-[11px]">
                {entry.name || "Count"}
              </span>
            </div>
            <span className="font-mono font-bold text-stone-900 text-[11px]">
              {entry.value} {unit}
            </span>
          </div>
        ))}

        {percentage !== undefined && (
          <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-stone-100 text-[10px]">
            <span className="text-stone-500">Cohort Share</span>
            <span className="font-mono font-semibold text-cobalt-700">
              {percentage}% of cohort
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

```


## File: `src/components/visualizations/BrandPreferenceChart.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Dynamic Y-axis scaling for N=300, rank-based cobalt palette, and light grid lines.

```typescript
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export interface BrandDataPoint {
  brand: string;
  count: number;
  percentage?: number;
}

export interface BrandPreferenceChartProps {
  data: BrandDataPoint[];
  height?: number;
}

export function BrandPreferenceChart({
  data,
  height = 280,
}: BrandPreferenceChartProps) {
  // Sort descending to establish clear hierarchy
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Differentiation based on rank in cohort
  const getBrandColor = (index: number) => {
    if (index === 0) return "#1d4ed8"; // Leader - Deep Cobalt
    if (index === 1) return "#2563eb"; // Second - Primary Cobalt
    if (index === 2) return "#3b82f6"; // Third - Bright Cobalt
    if (index === 3) return "#60a5fa"; // Fourth - Soft Cobalt
    return "#64748b"; // Long tail - Muted Slate
  };

  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="brand"
            tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            content={<ChartTooltip unit="Respondents" />}
            cursor={{ fill: "rgba(37, 99, 235, 0.04)" }}
          />
          <Bar
            dataKey="count"
            name="Respondents"
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
            barSize={40}
          >
            {sortedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getBrandColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

```


## File: `src/components/visualizations/BudgetDistributionChart.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Dynamic Y-axis scaling for N=300, ascending cobalt progression, and light grid lines.

```typescript
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export interface BudgetDataPoint {
  budget: string;
  count: number;
  percentage?: number;
}

export interface BudgetDistributionChartProps {
  data: BudgetDataPoint[];
  height?: number;
}

export function BudgetDistributionChart({
  data,
  height = 280,
}: BudgetDistributionChartProps) {
  // Ascending monochromatic cobalt progression mapping price tiers
  const tierColors = [
    "#93c5fd", // Under $400 (Entry) - Soft Cobalt
    "#60a5fa", // $400 - $700 (Mid) - Cobalt
    "#2563eb", // $700 - $1,000 (Premium) - Primary Cobalt
    "#1d4ed8", // Over $1,000 (Flagship) - Deep Cobalt
  ];

  return (
    <div style={{ width: "100%", height }} className="pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="budget"
            tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }}
            interval={0}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            domain={[0, "auto"]}
          />
          <Tooltip
            content={<ChartTooltip unit="Respondents" />}
            cursor={{ fill: "rgba(37, 99, 235, 0.04)" }}
          />
          <Bar
            dataKey="count"
            name="Respondents"
            radius={[4, 4, 0, 0]}
            maxBarSize={44}
            barSize={40}
          >
            {data.map((_, index) => (
              <Cell
                key={`budget-cell-${index}`}
                fill={tierColors[index % tierColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

```


## File: `src/components/visualizations/FeaturePreferenceChart.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Dynamic X-axis scaling, horizontal orientation, and 3-tier visual hierarchy.

```typescript
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export interface FeatureDataPoint {
  feature: string;
  count: number;
  percentage?: number;
}

export interface FeaturePreferenceChartProps {
  data: FeatureDataPoint[];
  height?: number;
}

export function FeaturePreferenceChart({
  data,
  height = 300,
}: FeaturePreferenceChartProps) {
  // Sort descending by count for hierarchical readability
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Subtle 3-tier visual hierarchy
  // Tier 1 (dominant priorities): Acid Lime #84cc16
  // Tier 2 (core performance specs): Cobalt #2563eb
  // Tier 3 (supporting factors): Slate #64748b
  const getFeatureColor = (index: number) => {
    if (index < 2) return "#84cc16"; // Top 2 dominant priorities
    if (index < 5) return "#2563eb"; // Middle performance tier
    return "#64748b"; // Supporting tier
  };

  return (
    <div style={{ width: "100%", height }} className="pt-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#f1f5f9"
          />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fontSize: 11, fill: "#1e293b", fontWeight: 500 }}
            width={165}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip
            content={<ChartTooltip unit="Selections" />}
            cursor={{ fill: "rgba(132, 204, 22, 0.05)" }}
          />
          <Bar
            dataKey="count"
            name="Selections"
            radius={[0, 4, 4, 0]}
            maxBarSize={22}
            barSize={18}
            isAnimationActive={false}
          >
            {sortedData.map((_, index) => (
              <Cell
                key={`feature-cell-${index}`}
                fill={getFeatureColor(index)}
                className="transition-opacity hover:opacity-85"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

```


## File: `src/components/visualizations/BrandDistributionChart.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light tooltip styling with 1px stone border and box shadow.

```typescript
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BrandCount {
  brand: string;
  count: number;
}

interface BrandDistributionChartProps {
  data: BrandCount[];
}

export function BrandDistributionChart({ data }: BrandDistributionChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="brand"
            tick={{ fontSize: 12, fill: "#475569" }}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#1c1917",
              borderRadius: "0.75rem",
              border: "1px solid #e7e5e4",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              fontSize: "0.875rem",
            }}
            formatter={(value: unknown) => [`${value} Respondents`, "Count"]}
          />
          <Bar
            dataKey="count"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

```


## File: `src/components/setlab/SetSelector.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Light 2-set vs 3-set toggle switcher (#F4F3EE) and clean select inputs.

```typescript
"use client";

import React from "react";
import type { SetOption } from "@/lib/data/setDescriptors";
import { Badge } from "@/components/ui/Badge";

export interface SetSelectorProps {
  mode: "2-set" | "3-set";
  onModeChange: (mode: "2-set" | "3-set") => void;
  availableOptions: SetOption[];
  setAId: string;
  setBId: string;
  setCId: string;
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
  onSelectC: (id: string) => void;
  setASize: number;
  setBSize: number;
  setCSize: number;
  totalUniverseSize: number;
}

export function SetSelector({
  mode,
  onModeChange,
  availableOptions,
  setAId,
  setBId,
  setCId,
  onSelectA,
  onSelectB,
  onSelectC,
  setASize,
  setBSize,
  setCSize,
  totalUniverseSize,
}: SetSelectorProps) {
  const brandOptions = availableOptions.filter((o) => o.category === "brand");
  const featureOptions = availableOptions.filter((o) => o.category === "feature");

  const optionA = availableOptions.find((o) => o.id === setAId);
  const optionB = availableOptions.find((o) => o.id === setBId);
  const optionC = availableOptions.find((o) => o.id === setCId);

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 space-y-5">
      {/* Header and Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight text-slate-950">
              Set Definition Workspace
            </h3>
            <Badge variant="cobalt">Discrete Partitions</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select {mode === "2-set" ? "two" : "three"} distinct brand or feature cohorts from the universe (U = {totalUniverseSize} respondents)
          </p>
        </div>

        {/* 2-Set vs 3-Set Mode Switch */}
        <div className="inline-flex rounded-lg border border-stone-200 bg-[#F4F3EE] p-1 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => onModeChange("2-set")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === "2-set"
                ? "bg-white text-stone-900 font-semibold shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Two Sets (A, B)
          </button>
          <button
            type="button"
            onClick={() => onModeChange("3-set")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              mode === "3-set"
                ? "bg-white text-stone-900 font-semibold shadow-2xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Three Sets (A, B, C)
          </button>
        </div>
      </div>

      {/* Set Pickers Grid */}
      <div className={`grid grid-cols-1 gap-4 ${mode === "3-set" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {/* SET A */}
        <div className="rounded-lg border-2 border-cobalt-500/30 bg-[#f8fafc] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-cobalt-600 text-white font-mono font-bold text-xs shadow-sm">
                A
              </span>
              <span className="font-semibold text-slate-900 text-sm">Set A</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-cobalt-700 bg-cobalt-50 border border-cobalt-200 px-2 py-0.5 rounded">
                |A| = {setASize}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({Math.round((setASize / totalUniverseSize) * 100)}%)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="set-a-select" className="sr-only">
              Choose Set A
            </label>
            <select
              id="set-a-select"
              value={setAId}
              onChange={(e) => onSelectA(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-cobalt-500 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            >
              <optgroup label="Smartphone Brands">
                {brandOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setBId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Canonical Features">
                {featureOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setBId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2">
            {optionA?.description}
          </p>
        </div>

        {/* SET B */}
        <div className="rounded-lg border-2 border-lime-500/40 bg-[#f8fafc] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-lime-500 text-slate-950 font-mono font-bold text-xs shadow-sm">
                B
              </span>
              <span className="font-semibold text-slate-900 text-sm">Set B</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-lime-800 bg-lime-50 border border-lime-300 px-2 py-0.5 rounded">
                |B| = {setBSize}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                ({Math.round((setBSize / totalUniverseSize) * 100)}%)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="set-b-select" className="sr-only">
              Choose Set B
            </label>
            <select
              id="set-b-select"
              value={setBId}
              onChange={(e) => onSelectB(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
            >
              <optgroup label="Smartphone Brands">
                {brandOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setAId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Canonical Features">
                {featureOptions.map((opt) => (
                  <option
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.id === setAId || (mode === "3-set" && opt.id === setCId)}
                  >
                    {opt.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2">
            {optionB?.description}
          </p>
        </div>

        {/* SET C (Only in 3-set mode) */}
        {mode === "3-set" && (
          <div className="rounded-lg border-2 border-purple-500/30 bg-[#f8fafc] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-600 text-white font-mono font-bold text-xs shadow-sm">
                  C
                </span>
                <span className="font-semibold text-slate-900 text-sm">Set C</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                  |C| = {setCSize}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ({Math.round((setCSize / totalUniverseSize) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="set-c-select" className="sr-only">
                Choose Set C
              </label>
              <select
                id="set-c-select"
                value={setCId}
                onChange={(e) => onSelectC(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <optgroup label="Smartphone Brands">
                  {brandOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.id === setAId || opt.id === setBId}
                    >
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Canonical Features">
                  {featureOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      disabled={opt.id === setAId || opt.id === setBId}
                    >
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200/80 pt-2">
              {optionC?.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

```


## File: `src/components/setlab/VennDiagram2Set.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: High-contrast text labels (#0f172a, #ffffff active) on light circle fills.

```typescript
"use client";

import React, { useState } from "react";
import type { TwoSetVennRegions } from "@/types/math";
import type { Operation2Set, ActiveOperation } from "./SetOperationsToolbar";

export interface VennDiagram2SetProps {
  setAName: string;
  setBName: string;
  regions: TwoSetVennRegions<string>;
  activeOperation: ActiveOperation;
  onSelectRegion: (op: Operation2Set) => void;
}

export function VennDiagram2Set({
  setAName,
  setBName,
  regions,
  activeOperation,
  onSelectRegion,
}: VennDiagram2SetProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region active checks based on algebraic operation
  const isOnlyAActive =
    activeOperation === "diff_ab" ||
    activeOperation === "union" ||
    activeOperation === "sym_diff" ||
    activeOperation === "comp_b";

  const isBothActive =
    activeOperation === "intersection" ||
    activeOperation === "union" ||
    activeOperation === "disjoint_ab";

  const isOnlyBActive =
    activeOperation === "diff_ba" ||
    activeOperation === "union" ||
    activeOperation === "sym_diff" ||
    activeOperation === "comp_a";

  const isNeitherActive =
    activeOperation === "neither" ||
    activeOperation === "comp_a" ||
    activeOperation === "comp_b";

  return (
    <div className="relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 overflow-hidden">
      {/* Top Banner with Set Labels */}
      <div className="w-full flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-cobalt-600" />
          <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={setAName}>
            Set A: {setAName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={setBName}>
            Set B: {setBName}
          </span>
          <span className="h-3 w-3 rounded-full bg-lime-500" />
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full max-w-[540px] aspect-[540/320] relative">
        <svg
          viewBox="0 0 540 320"
          className="w-full h-full select-none"
          role="img"
          aria-label="Two-set Venn diagram representing Set A and Set B"
        >
          <defs>
            {/* Subtle drop shadows for interactive hover */}
            <filter id="venn-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.3" />
            </filter>
            <filter id="lime-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#84cc16" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Universal Set Bounding Rectangle */}
          <rect
            x="8"
            y="8"
            width="524"
            height="304"
            rx="12"
            fill={isNeitherActive ? "#f1f5f9" : "#fafafa"}
            stroke={isNeitherActive ? "#2563eb" : "#e2e8f0"}
            strokeWidth={isNeitherActive ? "2" : "1.5"}
            strokeDasharray={isNeitherActive ? "none" : "4 4"}
            className="transition-colors cursor-pointer"
            onClick={() => onSelectRegion("neither")}
            onMouseEnter={() => setHoveredRegion("neither")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Universe Label */}
          <text
            x="24"
            y="32"
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="600"
          >
            Universal Set U (n={regions.universeSet.size})
          </text>

          {/* Outside Region (Neither) Button Indicator */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectRegion("neither")}
            onMouseEnter={() => setHoveredRegion("neither")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="380"
              y="18"
              width="140"
              height="26"
              rx="6"
              fill={isNeitherActive ? "#2563eb" : "#ffffff"}
              stroke={isNeitherActive ? "#1d4ed8" : "#cbd5e1"}
              strokeWidth="1"
            />
            <text
              x="450"
              y="35"
              textAnchor="middle"
              fill={isNeitherActive ? "#ffffff" : "#475569"}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              (A ∪ B)ᶜ : n={regions.neither.size}
            </text>
          </g>

          {/* ============================================================== */}
          {/* Region 1: Only A (A \ B)                                       */}
          {/* Center (200, 160), R=105, intersection pts: (270, 81.74) to (270, 238.26) */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 1,0 270,238.26 A 105,105 0 0,0 270,81.74 Z"
            fill={
              isOnlyAActive
                ? "#2563eb"
                : hoveredRegion === "onlyA"
                ? "#93c5fd"
                : "#dbeafe"
            }
            fillOpacity={isOnlyAActive ? 0.85 : 0.45}
            stroke={isOnlyAActive ? "#1d4ed8" : "#3b82f6"}
            strokeWidth={isOnlyAActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("diff_ab")}
            onMouseEnter={() => setHoveredRegion("onlyA")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* ============================================================== */}
          {/* Region 2: Only B (B \ A)                                       */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 1,1 270,238.26 A 105,105 0 0,0 270,81.74 Z"
            fill={
              isOnlyBActive
                ? "#84cc16"
                : hoveredRegion === "onlyB"
                ? "#bef264"
                : "#d9f99d"
            }
            fillOpacity={isOnlyBActive ? 0.85 : 0.45}
            stroke={isOnlyBActive ? "#4d7c0f" : "#65a30d"}
            strokeWidth={isOnlyBActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("diff_ba")}
            onMouseEnter={() => setHoveredRegion("onlyB")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* ============================================================== */}
          {/* Region 3: Intersection (A ∩ B)                                  */}
          {/* ============================================================== */}
          <path
            d="M 270,81.74 A 105,105 0 0,1 270,238.26 A 105,105 0 0,1 270,81.74 Z"
            fill={
              isBothActive
                ? "#3b82f6"
                : hoveredRegion === "both"
                ? "#a7f3d0"
                : "#bfdbfe"
            }
            fillOpacity={isBothActive ? 0.95 : 0.65}
            stroke={isBothActive ? "#1e40af" : "#2563eb"}
            strokeWidth={isBothActive ? 3 : 1.5}
            className="transition-all cursor-pointer hover:opacity-95"
            onClick={() => onSelectRegion("intersection")}
            onMouseEnter={() => setHoveredRegion("both")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Labels & Dynamic Cardinality Badges */}

          {/* Region A Only Text */}
          <g
            className="pointer-events-none"
            transform="translate(180, 160)"
          >
            <text
              textAnchor="middle"
              y="-10"
              fontSize="12"
              fontWeight="bold"
              fill={isOnlyAActive ? "#ffffff" : "#1e40af"}
            >
              A only
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyAActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyA.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isOnlyAActive ? "#eff6ff" : "#475569"}
            >
              A \ B
            </text>
          </g>

          {/* Intersection A ∩ B Text */}
          <g
            className="pointer-events-none"
            transform="translate(270, 160)"
          >
            <text
              textAnchor="middle"
              y="-12"
              fontSize="11"
              fontWeight="bold"
              fill={isBothActive ? "#ffffff" : "#1e3a8a"}
            >
              Both
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="20"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isBothActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.both.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isBothActive ? "#eff6ff" : "#1e40af"}
            >
              A ∩ B
            </text>
          </g>

          {/* Region B Only Text */}
          <g
            className="pointer-events-none"
            transform="translate(360, 160)"
          >
            <text
              textAnchor="middle"
              y="-10"
              fontSize="12"
              fontWeight="bold"
              fill={isOnlyBActive ? "#ffffff" : "#365314"}
            >
              B only
            </text>
            <text
              textAnchor="middle"
              y="12"
              fontSize="18"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyB.size}
            </text>
            <text
              textAnchor="middle"
              y="28"
              fontSize="10"
              fontWeight="500"
              fill={isOnlyBActive ? "#eff6ff" : "#3f6212"}
            >
              B \ A
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <span>Click any Venn region to inspect its matching respondent IDs</span>
        <span className="font-mono text-slate-600">
          |A ∪ B| = {regions.unionSet.size} of {regions.universeSet.size}
        </span>
      </div>
    </div>
  );
}

```


## File: `src/components/setlab/VennDiagram3Set.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: High-contrast text labels on light 3-circle geometry.

```typescript
"use client";

import React, { useState } from "react";
import type { ThreeSetVennRegions } from "@/types/math";
import type { Operation3Set, ActiveOperation } from "./SetOperationsToolbar";

export interface VennDiagram3SetProps {
  setAName: string;
  setBName: string;
  setCName: string;
  regions: ThreeSetVennRegions<string>;
  activeOperation: ActiveOperation;
  onSelectRegion: (op: Operation3Set) => void;
}

export function VennDiagram3Set({
  setAName,
  setBName,
  setCName,
  regions,
  activeOperation,
  onSelectRegion,
}: VennDiagram3SetProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Region active checks based on 3-set algebraic operation
  const isOnlyAActive = activeOperation === "only_a" || activeOperation === "union_abc";
  const isOnlyBActive = activeOperation === "only_b" || activeOperation === "union_abc";
  const isOnlyCActive = activeOperation === "only_c" || activeOperation === "union_abc";

  const isOnlyABActive =
    activeOperation === "only_ab" ||
    activeOperation === "inter_ab" ||
    activeOperation === "union_abc";

  const isOnlyACActive =
    activeOperation === "only_ac" ||
    activeOperation === "inter_ac" ||
    activeOperation === "union_abc";

  const isOnlyBCActive =
    activeOperation === "only_bc" ||
    activeOperation === "inter_bc" ||
    activeOperation === "union_abc";

  const isAllThreeActive =
    activeOperation === "inter_abc" ||
    activeOperation === "inter_ab" ||
    activeOperation === "inter_ac" ||
    activeOperation === "inter_bc" ||
    activeOperation === "union_abc";

  const isOutsideActive = activeOperation === "outside_abc";

  return (
    <div className="relative flex flex-col items-center justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-card text-slate-900 overflow-hidden">
      {/* Top Banner with 3 Set Labels */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-cobalt-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setAName}>
            Set A: {setAName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-start sm:justify-center">
          <span className="h-3 w-3 rounded-full bg-lime-500 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setBName}>
            Set B: {setBName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 justify-start sm:justify-end">
          <span className="h-3 w-3 rounded-full bg-purple-600 flex-shrink-0" />
          <span className="font-semibold text-slate-900 truncate" title={setCName}>
            Set C: {setCName}
          </span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full max-w-[560px] aspect-[560/460] relative">
        <svg
          viewBox="0 0 560 460"
          className="w-full h-full select-none"
          role="img"
          aria-label="Three-set Venn diagram representing Sets A, B, and C"
        >
          {/* Universal Set Bounding Rectangle */}
          <rect
            x="8"
            y="8"
            width="544"
            height="444"
            rx="12"
            fill={isOutsideActive ? "#f1f5f9" : "#fafafa"}
            stroke={isOutsideActive ? "#2563eb" : "#e2e8f0"}
            strokeWidth={isOutsideActive ? "2" : "1.5"}
            strokeDasharray={isOutsideActive ? "none" : "4 4"}
            className="transition-colors cursor-pointer"
            onClick={() => onSelectRegion("outside_abc")}
            onMouseEnter={() => setHoveredRegion("outside")}
            onMouseLeave={() => setHoveredRegion(null)}
          />

          {/* Universe Label */}
          <text
            x="24"
            y="32"
            fill="#64748b"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="600"
          >
            Universal Set U (n={regions.universeSet.size})
          </text>

          {/* Outside Region Button */}
          <g
            className="cursor-pointer"
            onClick={() => onSelectRegion("outside_abc")}
            onMouseEnter={() => setHoveredRegion("outside")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="390"
              y="18"
              width="150"
              height="26"
              rx="6"
              fill={isOutsideActive ? "#2563eb" : "#ffffff"}
              stroke={isOutsideActive ? "#1d4ed8" : hoveredRegion === "outside" ? "#3b82f6" : "#cbd5e1"}
              strokeWidth="1"
            />
            <text
              x="465"
              y="35"
              textAnchor="middle"
              fill={isOutsideActive ? "#ffffff" : "#475569"}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              (A ∪ B ∪ C)ᶜ : n={regions.outside.size}
            </text>
          </g>

          {/* 3 Translucent Circles Background */}
          {/* Circle A (Top): (280, 170), R=115 */}
          <circle
            cx="280"
            cy="170"
            r="115"
            fill="#2563eb"
            fillOpacity={0.15}
            stroke="#2563eb"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Circle B (Bottom-Left): (215, 275), R=115 */}
          <circle
            cx="215"
            cy="275"
            r="115"
            fill="#84cc16"
            fillOpacity={0.15}
            stroke="#65a30d"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Circle C (Bottom-Right): (345, 275), R=115 */}
          <circle
            cx="345"
            cy="275"
            r="115"
            fill="#a855f7"
            fillOpacity={0.15}
            stroke="#9333ea"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* ========================================================== */}
          {/* 7 Interactive Region Badges with Exact Dynamic Counts       */}
          {/* ========================================================== */}

          {/* 1. Only A: Top (280, 110) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(280, 110)"
            onClick={() => onSelectRegion("only_a")}
            onMouseEnter={() => setHoveredRegion("onlyA")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyAActive ? "#2563eb" : "#ffffff"}
              stroke={isOnlyAActive ? "#1d4ed8" : "#93c5fd"}
              strokeWidth={isOnlyAActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyAActive ? "#eff6ff" : "#1e40af"}
            >
              A only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyAActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyA.size}
            </text>
          </g>

          {/* 2. Only B: Bottom-Left (150, 320) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(150, 320)"
            onClick={() => onSelectRegion("only_b")}
            onMouseEnter={() => setHoveredRegion("onlyB")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyBActive ? "#84cc16" : "#ffffff"}
              stroke={isOnlyBActive ? "#4d7c0f" : "#bef264"}
              strokeWidth={isOnlyBActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyBActive ? "#1a2e05" : "#3f6212"}
            >
              B only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBActive ? "#0f172a" : "#0f172a"}
            >
              n = {regions.onlyB.size}
            </text>
          </g>

          {/* 3. Only C: Bottom-Right (410, 320) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(410, 320)"
            onClick={() => onSelectRegion("only_c")}
            onMouseEnter={() => setHoveredRegion("onlyC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="8"
              fill={isOnlyCActive ? "#a855f7" : "#ffffff"}
              stroke={isOnlyCActive ? "#7e22ce" : "#d8b4fe"}
              strokeWidth={isOnlyCActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={isOnlyCActive ? "#ffffff" : "#6b21a8"}
            >
              C only
            </text>
            <text
              y="11"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyCActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyC.size}
            </text>
          </g>

          {/* 4. Only AB: (A ∩ B) \ C (210, 200) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(210, 200)"
            onClick={() => onSelectRegion("only_ab")}
            onMouseEnter={() => setHoveredRegion("onlyAB")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyABActive ? "#0284c7" : "#ffffff"}
              stroke={isOnlyABActive ? "#0369a1" : "#7dd3fc"}
              strokeWidth={isOnlyABActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyABActive ? "#ffffff" : "#0369a1"}
            >
              (A ∩ B) \ C
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyABActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyAB.size}
            </text>
          </g>

          {/* 5. Only AC: (A ∩ C) \ B (350, 200) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(350, 200)"
            onClick={() => onSelectRegion("only_ac")}
            onMouseEnter={() => setHoveredRegion("onlyAC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyACActive ? "#6366f1" : "#ffffff"}
              stroke={isOnlyACActive ? "#4338ca" : "#a5b4fc"}
              strokeWidth={isOnlyACActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyACActive ? "#ffffff" : "#4338ca"}
            >
              (A ∩ C) \ B
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyACActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyAC.size}
            </text>
          </g>

          {/* 6. Only BC: (B ∩ C) \ A (280, 345) */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            transform="translate(280, 345)"
            onClick={() => onSelectRegion("only_bc")}
            onMouseEnter={() => setHoveredRegion("onlyBC")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-42"
              y="-16"
              width="84"
              height="32"
              rx="7"
              fill={isOnlyBCActive ? "#10b981" : "#ffffff"}
              stroke={isOnlyBCActive ? "#047857" : "#6ee7b7"}
              strokeWidth={isOnlyBCActive ? "2.5" : "1.5"}
              filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))"
            />
            <text
              y="-3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill={isOnlyBCActive ? "#ffffff" : "#047857"}
            >
              (B ∩ C) \ A
            </text>
            <text
              y="10"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill={isOnlyBCActive ? "#ffffff" : "#0f172a"}
            >
              n = {regions.onlyBC.size}
            </text>
          </g>

          {/* 7. Triple Intersection: A ∩ B ∩ C Center (280, 240) */}
          <g
            className="cursor-pointer transition-transform hover:scale-110"
            transform="translate(280, 240)"
            onClick={() => onSelectRegion("inter_abc")}
            onMouseEnter={() => setHoveredRegion("allThree")}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <rect
              x="-48"
              y="-20"
              width="96"
              height="40"
              rx="8"
              fill={isAllThreeActive ? "#1e3a8a" : "#1e293b"}
              stroke={isAllThreeActive ? "#60a5fa" : "#334155"}
              strokeWidth={isAllThreeActive ? "3" : "2"}
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            />
            <text
              y="-4"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#93c5fd"
            >
              A ∩ B ∩ C
            </text>
            <text
              y="13"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fontFamily="monospace"
              fill="#ffffff"
            >
              n = {regions.allThree.size}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Helper Text */}
      <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
        <span>Click any region to inspect its exact respondent membership</span>
        <span className="font-mono text-slate-600">
          |A ∪ B ∪ C| = {regions.unionSet.size} (Sum of 7 regions = {regions.onlyA.size + regions.onlyB.size + regions.onlyC.size + regions.onlyAB.size + regions.onlyAC.size + regions.onlyBC.size + regions.allThree.size})
        </span>
      </div>
    </div>
  );
}

```


## File: `src/components/combolab/CombinationDetailModal.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Updated modal backdrop to soft stone translucent overlay (bg-stone-900/40 backdrop-blur-sm).

```typescript
"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { FeatureCombinationRecord } from "@/types/math";
import type { SurveyResponse } from "@/types/survey";

export interface CombinationDetailModalProps {
  combination: FeatureCombinationRecord | null;
  onClose: () => void;
  allResponses: readonly SurveyResponse[];
}

export function CombinationDetailModal({
  combination,
  onClose,
  allResponses,
}: CombinationDetailModalProps) {
  if (!combination) return null;

  // Retrieve respondent objects
  const matchingResponses = allResponses.filter((resp) =>
    combination.matchingRespondentIds.includes(resp.response_id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {combination.id}
              </span>
              <h3 className="text-lg font-bold text-slate-950">
                Feature Triplet Details
              </h3>
              {combination.isObserved ? (
                <Badge variant="lime">
                  Observed ({combination.observedCount} resp. •{" "}
                  {combination.observedPercentage}%)
                </Badge>
              ) : (
                <Badge variant="default">Theoretical Void (0 resp.)</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Index #{combination.index} of 35 in dynamic lexicographic enumeration
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm font-bold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Feature Triplet Badges */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
            Canonical Feature Triplet:
          </span>
          <div className="flex flex-wrap gap-2">
            {combination.features.map((feature) => (
              <span
                key={feature}
                className="font-medium text-xs text-cobalt-800 bg-cobalt-50 px-3 py-1.5 rounded-lg border border-cobalt-200 shadow-2xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Empirical Distribution Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Observed Count
            </span>
            <div className="mt-1 font-mono text-xl font-bold text-slate-900">
              {combination.observedCount}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Cohort Share
            </span>
            <div className="mt-1 font-mono text-xl font-bold text-cobalt-600">
              {combination.observedPercentage}%
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Status
            </span>
            <div
              className={`mt-1 font-bold text-xs ${
                combination.isObserved ? "text-lime-700" : "text-slate-500"
              }`}
            >
              {combination.isObserved ? "POPULATED" : "UNOBSERVED"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Permutations
            </span>
            <div className="mt-1 font-mono text-xl font-bold text-slate-700">
              6
            </div>
          </div>
        </div>

        {/* Matching Respondent Records or Empty Set State */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Matching Survey Respondents
            </span>
            <span className="font-mono text-xs text-slate-500">
              {matchingResponses.length} records
            </span>
          </div>

          {!combination.isObserved || matchingResponses.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <div className="text-3xl font-serif text-slate-400 mb-1">∅</div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Empty Set: Unobserved Theoretical Combination
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No participant in the university survey chose this exact
                three-feature combination. In discrete mathematics, its empirical
                frequency is exactly zero.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Respondent ID</th>
                    <th className="px-3 py-2">Preferred Brand</th>
                    <th className="px-3 py-2">Budget Tier</th>
                    <th className="px-3 py-2">Primary Use</th>
                    <th className="px-3 py-2">OS Preference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchingResponses.map((resp) => (
                    <tr key={resp.response_id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2 font-mono font-bold text-cobalt-700">
                        {resp.response_id}
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-800">
                        {resp.preferred_brand}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {resp.budget_range}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {resp.primary_use}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                            resp.os_preference === "iOS"
                              ? "bg-slate-100 text-slate-800"
                              : resp.os_preference === "Android"
                              ? "bg-lime-100 text-lime-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {resp.os_preference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}

```


## File: `src/components/experiment-studio/RespondentInspectorModal.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Updated modal backdrop to soft stone translucent overlay (bg-stone-900/40 backdrop-blur-sm).

```typescript
"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SurveyResponse } from "@/types/survey";

export interface RespondentInspectorModalProps {
  title: string;
  subtitle: string;
  matchingIds: readonly string[];
  allResponses: readonly SurveyResponse[];
  onClose: () => void;
}

export function RespondentInspectorModal({
  title,
  subtitle,
  matchingIds,
  allResponses,
  onClose,
}: RespondentInspectorModalProps) {
  const matchingRecords = allResponses.filter((r) =>
    matchingIds.includes(r.response_id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              <Badge variant="cobalt" className="font-mono">
                {matchingIds.length} {matchingIds.length === 1 ? "Respondent" : "Respondents"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all text-sm font-bold"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content Table or Empty State */}
        {matchingRecords.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-3xl font-serif text-slate-400 mb-1">∅</div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Empty Intersection (0 Respondents)
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No survey respondents match this exact brand-feature or budget-combination conjunction in the validated dataset.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5">Response ID</th>
                  <th className="px-3.5 py-2.5">Brand</th>
                  <th className="px-3.5 py-2.5">Budget</th>
                  <th className="px-3.5 py-2.5">Preferred Features</th>
                  <th className="px-3.5 py-2.5">Primary Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {matchingRecords.map((r) => (
                  <tr key={r.response_id} className="hover:bg-slate-50/80">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-cobalt-700">
                      {r.response_id}
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-slate-800">
                      {r.preferred_brand}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      {r.budget_range}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {r.preferred_features.map((f) => (
                          <span
                            key={f}
                            className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-500 text-[11px]">
                      {r.primary_use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}

```


## File: `src/app/page.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Campus Pulse page: fully updated to light editorial layout, dynamic 300-student data, and live PIE theorem.

```typescript
import React from "react";
import Link from "next/link";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { BrandPreferenceChart } from "@/components/visualizations/BrandPreferenceChart";
import { FeaturePreferenceChart } from "@/components/visualizations/FeaturePreferenceChart";
import { BudgetDistributionChart } from "@/components/visualizations/BudgetDistributionChart";
import { ResponseExplorer } from "@/components/campus-pulse/ResponseExplorer";

import {
  loadSurveyDataset,
  getActiveDatasetInfo,
  getRespondentIdsByBrand,
  getRespondentIdsByFeature,
  getRespondentIdsByBudget,
} from "@/lib/data/loader";
import { verifyInclusionExclusionPrinciple } from "@/lib/math/sets";
import { calculateCombinations } from "@/lib/math/combinations";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
} from "@/types/survey";

export default function CampusPulsePage() {
  const dataset = loadSurveyDataset();
  const datasetInfo = getActiveDatasetInfo();
  const responses = dataset.responses;

  // 1. Brand distribution data
  const brandData = SMARTPHONE_BRANDS.map((brand) => {
    const ids = getRespondentIdsByBrand(responses, brand);
    return {
      brand,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  }).filter((b) => b.count > 0);

  // 2. Feature preference frequency data (ranked)
  const featureData = SMARTPHONE_FEATURES.map((feature) => {
    const ids = getRespondentIdsByFeature(responses, feature);
    return {
      feature,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  });

  // 3. Budget tier distribution data
  const budgetData = BUDGET_RANGES.map((budget) => {
    const ids = getRespondentIdsByBudget(responses, budget);
    return {
      budget,
      count: ids.size,
      percentage: Math.round((ids.size / responses.length) * 100),
    };
  });

  // 4. Live Discrete Mathematics Theorem Verification
  const appleRespondents = getRespondentIdsByBrand(responses, "Apple");
  const cameraRespondents = getRespondentIdsByFeature(responses, "Camera Quality");

  const pieVerification = verifyInclusionExclusionPrinciple(
    appleRespondents,
    cameraRespondents
  );

  const totalPossibleTriplets = calculateCombinations(
    SMARTPHONE_FEATURES.length,
    3
  );

  // Dynamic takeaway texts
  const sortedBrands = [...brandData].sort((a, b) => b.count - a.count);
  const brandTakeaway = `${sortedBrands[0]?.brand} (${sortedBrands[0]?.percentage}%) and ${sortedBrands[1]?.brand} (${sortedBrands[1]?.percentage}%) lead the student cohort, followed by ${sortedBrands[2]?.brand} (${sortedBrands[2]?.percentage}%).`;

  const sortedFeatures = [...featureData].sort((a, b) => b.count - a.count);
  const featureTakeaway = `${sortedFeatures[0]?.feature} (${sortedFeatures[0]?.percentage}%) and ${sortedFeatures[1]?.feature} (${sortedFeatures[1]?.percentage}%) are the leading priorities, with ${sortedFeatures[2]?.feature} (${sortedFeatures[2]?.percentage}%) anchoring performance.`;

  const sortedBudgets = [...budgetData].sort((a, b) => b.count - a.count);
  const budgetTakeaway = `${sortedBudgets[0]?.budget} (${sortedBudgets[0]?.percentage}%) and ${sortedBudgets[1]?.budget} (${sortedBudgets[1]?.percentage}%) represent the primary target purchase thresholds.`;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Campus Research Dashboard"
        title="Campus Pulse"
        description="Exploratory preference analytics synthesized from university student survey records. Models smartphone ecosystems through discrete mathematics, combinatorial structures, and set theory."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <>
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                Open SetLab &rarr;
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="primary" size="sm">
                Methodology
              </Button>
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dataset Status Banner */}
        <Callout
          variant="highlight"
          title={`Academic Dataset Status — ${datasetInfo.isDemo ? "Verified Benchmark Data" : "Verified Real Survey Data"}`}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          {datasetInfo.isDemo ? (
            <>
              This dashboard currently presents <strong>{responses.length} simulated campus responses ({datasetInfo.notes || "SIMULATED CAMPUS DATA — N=300"})</strong> designed to model realistic undergraduate smartphone preferences, schema validation, and discrete mathematical algorithms. This dataset is an empirical simulation benchmark.
            </>
          ) : (
            <>
              This dashboard currently presents <strong>{datasetInfo.totalResponses} verified survey responses</strong> collected from the university cohort and validated through the data quality pipeline.
            </>
          )}
        </Callout>

        {/* Confident KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Survey Cohort"
            value={responses.length}
            subtext={datasetInfo.isDemo ? "Anonymized student records [SIMULATED N=300]" : `Anonymized student records ${datasetInfo.tagText}`}
            badge={{ text: "100% Unique IDs", variant: "lime" }}
            accentColor="lime"
          />
          <MetricCard
            label="Canonical Features"
            value={SMARTPHONE_FEATURES.length}
            subtext="Discrete choice feature universe"
            badge={{ text: "Approved Domain", variant: "cobalt" }}
            accentColor="cobalt"
          />
          <MetricCard
            label="Triplet Choice Space"
            value={totalPossibleTriplets}
            subtext="Combinations C(7, 3) available"
            badge={{ text: "Combinatorics", variant: "cobalt" }}
            accentColor="cobalt"
          />
          <MetricCard
            label="Selection Rule"
            value="3 of 7"
            subtext="Exactly 3 distinct features per student"
            badge={{ text: "Strict Schema", variant: "lime" }}
            accentColor="lime"
          />
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Brand Preference */}
          <ChartCard
            title="Brand Preference Distribution"
            subtitle="Distribution of preferred smartphone brands across the cohort"
            badge={{ text: "Primary Choice", variant: "cobalt" }}
            takeaway={brandTakeaway}
            takeawayAccent="cobalt"
          >
            <BrandPreferenceChart data={brandData} height={280} />
          </ChartCard>

          {/* Budget Tier Distribution */}
          <ChartCard
            title="Budget Tier Distribution"
            subtitle="Allocation across discrete price intervals"
            badge={{ text: "Purchasing Tier", variant: "cobalt" }}
            takeaway={budgetTakeaway}
            takeawayAccent="cobalt"
          >
            <BudgetDistributionChart data={budgetData} height={280} />
          </ChartCard>
        </div>

        {/* Feature Preference Ranking (Full Width) */}
        <ChartCard
          title="Feature Preference Frequency (Ranked)"
          subtitle="Selection frequency across the 7 approved canonical features"
          badge={{ text: "Distinct 3 Choices", variant: "lime" }}
          takeaway={featureTakeaway}
          takeawayAccent="lime"
        >
          <FeaturePreferenceChart data={featureData} height={280} />
        </ChartCard>

        {/* Discrete Mathematics Foundation Section */}
        <Card>
          <CardHeader
            title="Discrete Mathematics: Principle of Inclusion-Exclusion"
            subtitle="Pure set-theoretic calculation on real respondent ID partitions"
            badge={<Badge variant="lime">Live Theorem Verification</Badge>}
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 rounded-lg border border-slate-200 bg-[#f8fafc] p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Formal Identity
                  </p>
                  <KaTeXMath
                    math="|A \cup B| = |A| + |B| - |A \cap B|"
                    block
                    className="text-cobalt-600 font-semibold"
                  />
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Operates directly on sets of unique respondent IDs without scalar aggregation approximations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-lime-600 font-semibold">
                  ✓ Theorem Identity Confirmed
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Set A (Apple)
                    </span>
                    <div className="font-mono text-lg font-bold text-slate-950 mt-1">
                      |A| = {appleRespondents.size}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Set B (Camera)
                    </span>
                    <div className="font-mono text-lg font-bold text-slate-950 mt-1">
                      |B| = {cameraRespondents.size}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Intersection
                    </span>
                    <div className="font-mono text-lg font-bold text-cobalt-600 mt-1">
                      |A ∩ B| = {pieVerification.intersectionCardinality}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f8fafc] p-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-500">
                      Union
                    </span>
                    <div className="font-mono text-lg font-bold text-lime-600 mt-1">
                      |A ∪ B| = {pieVerification.unionCardinality}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[#f8fafc] p-3.5 text-xs text-slate-700 border border-slate-200">
                  <p className="font-mono font-medium">
                    Calculation: {pieVerification.unionCardinality} = {appleRespondents.size} + {cameraRespondents.size} - {pieVerification.intersectionCardinality}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Intersection Respondents ({pieVerification.intersectionSet.size} total): <code className="font-mono text-slate-800 font-semibold">{Array.from(pieVerification.intersectionSet).slice(0, 12).join(", ")}{pieVerification.intersectionSet.size > 12 ? ` ... (+${pieVerification.intersectionSet.size - 12} more)` : ""}</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey Responses Data Explorer */}
        <div className="space-y-4">
          <SectionHeader
            title="Cohort Response Explorer"
            subtitle="Browse and filter individual anonymized survey records"
            badge={<Badge variant="default">Zod Validated</Badge>}
          />
          <ResponseExplorer responses={responses} />
        </div>

        {/* Research Modules Showcase */}
        <div className="space-y-4 pt-4">
          <SectionHeader
            title="PhonePrint Research Architecture"
            subtitle="Interactive experiential-learning modules across the curriculum"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/my-phoneprint" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="My PhonePrint"
                  badge={<Badge variant="cobalt">Profiling</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Interactive preference profiler generating your personal vector and cohort match score.
                  </p>
                  <div className="text-cobalt-600 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/setlab" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="SetLab"
                  badge={<Badge variant="lime">Set Theory</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Interactive Venn diagrams, Inclusion-Exclusion calculator, and set partition explorer.
                  </p>
                  <div className="text-lime-600 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/combolab" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="ComboLab"
                  badge={<Badge variant="cobalt">C(7,3) = 35</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Analysis of the 35 feature triplets, combination heatmaps, and void detection.
                  </p>
                  <div className="text-cobalt-600 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/experiment-studio" className="group">
              <Card hoverable className="h-full flex flex-col justify-between">
                <CardHeader
                  title="Experiment Studio"
                  badge={<Badge variant="outline">Graph Theory</Badge>}
                />
                <CardContent className="text-xs text-slate-600 space-y-2">
                  <p>
                    Feature co-occurrence graphs $G=(V, E)$, centrality indices, and hypothesis tests.
                  </p>
                  <div className="text-slate-800 font-semibold group-hover:underline pt-2">
                    Explore module &rarr;
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

```


## File: `src/app/my-phoneprint/page.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: My PhonePrint page: light preference builder, 4-way match partition, and respondent explorer.

```typescript
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { executeMatchingEngine } from "@/lib/math/matchingEngine";
import type {
  SmartphoneBrand,
  BudgetRange,
  SmartphoneFeature,
} from "@/types/survey";
import type { UserProfileInput } from "@/types/matcher";

import { PreferenceBuilder } from "@/components/my-phoneprint/PreferenceBuilder";
import { ExactMatchCard } from "@/components/my-phoneprint/ExactMatchCard";
import { PartialMatchBreakdown } from "@/components/my-phoneprint/PartialMatchBreakdown";
import { FeatureOverlapCard } from "@/components/my-phoneprint/FeatureOverlapCard";
import { RespondentExplorerTable } from "@/components/my-phoneprint/RespondentExplorerTable";
import { MatchingTheoryPanel } from "@/components/my-phoneprint/MatchingTheoryPanel";

export default function MyPhonePrintPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;

  // Initial default: Apple, Over $1,000, Camera + Battery + Build (Matches DEMO_RESP_001)
  const [brand, setBrand] = useState<SmartphoneBrand>("Apple");
  const [budget, setBudget] = useState<BudgetRange>("Over $1,000");
  const [features, setFeatures] = useState<SmartphoneFeature[]>([
    "Camera Quality",
    "Battery Life",
    "Build & Design Quality",
  ]);

  const toggleFeature = (feature: SmartphoneFeature) => {
    if (features.includes(feature)) {
      setFeatures(features.filter((f) => f !== feature));
    } else {
      if (features.length < 3) {
        setFeatures([...features, feature]);
      }
    }
  };

  const resetPreferences = () => {
    setBrand("Apple");
    setBudget("Over $1,000");
    setFeatures([]);
  };

  const applyPreset = (preset: UserProfileInput) => {
    setBrand(preset.brand);
    setBudget(preset.budget);
    setFeatures([...preset.features]);
  };

  // Run the matching engine only when exactly 3 features are selected
  const isProfileComplete = features.length === 3;

  const matchResult = useMemo(() => {
    if (!isProfileComplete) return null;

    const profile: UserProfileInput = {
      brand,
      budget,
      features: [features[0]!, features[1]!, features[2]!],
    };

    return executeMatchingEngine(responses, profile);
  }, [responses, brand, budget, features, isProfileComplete]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Interactive Preference Profiling"
        title="My PhonePrint: Preference Matcher"
        description="Select your target brand, budget tier, and exactly three canonical features to construct your personal PhonePrint vector. Computes exact set intersections and mutually exclusive partial matches against the student cohort."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              datasetInfo.isDemo
                ? "text-stone-700 bg-stone-100 border-stone-200"
                : "text-cobalt-800 bg-cobalt-50 border-cobalt-200"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section 1: Preference Builder */}
        <section id="builder" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
              1. Preference Vector Formulation
            </h2>
            <span className="text-xs text-graphite-500 font-mono">
              3 Dimensions: Brand • Budget • 3 Features
            </span>
          </div>
          <PreferenceBuilder
            brand={brand}
            setBrand={setBrand}
            budget={budget}
            setBudget={setBudget}
            features={features}
            toggleFeature={toggleFeature}
            resetPreferences={resetPreferences}
            onApplyPreset={applyPreset}
          />
        </section>

        {/* Section 2: Results Dashboard (Conditioned on complete profile) */}
        {matchResult ? (
          <>
            {/* Exact Matches */}
            <section id="exact-matches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  2. Exact Profile Matching
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Intersection: B ∩ P ∩ F
                </span>
              </div>
              <ExactMatchCard result={matchResult} />
            </section>

            {/* Mutually Exclusive Partial Match Breakdown */}
            <section id="partial-matches" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  3. Mutually Exclusive Match Classification
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Conservation: N₃ + N₂ + N₁ + N₀ = N
                </span>
              </div>
              <PartialMatchBreakdown result={matchResult} />
            </section>

            {/* Independent Feature Overlap */}
            <section id="feature-overlap" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  4. Feature Triplet Overlap Analysis
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Subset Size: |F* ∩ F_i| ∈ &#123;0, 1, 2, 3&#125;
                </span>
              </div>
              <FeatureOverlapCard
                featureOverlap={matchResult.featureOverlap}
                selectedFeatures={matchResult.profile.features}
                totalCohort={matchResult.totalCohort}
              />
            </section>

            {/* Respondent Explorer Table */}
            <section id="explorer" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  5. Anonymous Respondent Explorer
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Individual Record Evaluation
                </span>
              </div>
              <RespondentExplorerTable respondents={matchResult.respondents} />
            </section>

            {/* Discrete Mathematics Learning Foundation */}
            <section id="theory" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-graphite-400">
                  6. Discrete Mathematics Matching Foundation
                </h2>
                <span className="text-xs text-graphite-500 font-mono">
                  Formal Set Theory &amp; Partitions
                </span>
              </div>
              <MatchingTheoryPanel />
            </section>
          </>
        ) : (
          <Callout
            variant="warning"
            title="Incomplete Preference Vector"
          >
            Please select exactly three distinct features in the builder above to
            compute your PhonePrint vector and evaluate set intersections across
            the student cohort.
          </Callout>
        )}

        {/* Academic Synthesis Summary */}
        <Callout
          variant="highlight"
          title="PhonePrint Preference Analytics Summary"
        >
          My PhonePrint models user smartphone affinity as a discrete set
          intersection problem over $U$. By evaluating Brand ($B$), Budget ($P$),
          and Feature Triplet ($F$), the system demonstrates how multi-dimensional
          conjunctions partition a population into non-overlapping distance bands,
          providing mathematically rigorous insights without aggregate scalar
          approximations.
        </Callout>
      </div>
    </div>
  );
}

```


## File: `src/app/setlab/page.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: SetLab page: 2-set & 3-set Venn diagrams and step-by-step PIE proof over U=300.

```typescript
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import {
  loadSurveyDataset,
  getActiveDatasetInfo,
  getUniverseRespondentIds,
} from "@/lib/data/loader";
import { getAvailableSetOptions } from "@/lib/data/setDescriptors";
import {
  setIntersection,
  setUnion,
  setDifference,
  symmetricDifference,
  setComplement,
  isSubset,
  verifyInclusionExclusionPrinciple,
} from "@/lib/math/sets";
import {
  computeTwoSetVennRegions,
  computeThreeSetVennRegions,
  verifyThreeSetInclusionExclusion,
} from "@/lib/math/venn";

import { SetSelector } from "@/components/setlab/SetSelector";
import {
  SetOperationsToolbar,
  type ActiveOperation,
  type Operation2Set,
  type Operation3Set,
} from "@/components/setlab/SetOperationsToolbar";
import { VennDiagram2Set } from "@/components/setlab/VennDiagram2Set";
import { VennDiagram3Set } from "@/components/setlab/VennDiagram3Set";
import { InclusionExclusionCalculator } from "@/components/setlab/InclusionExclusionCalculator";
import { EducationalCard } from "@/components/setlab/EducationalCard";
import { SetRespondentExplorer } from "@/components/setlab/SetRespondentExplorer";

export default function SetLabPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;
  const universe = useMemo(() => getUniverseRespondentIds(responses), [responses]);
  const availableOptions = useMemo(() => getAvailableSetOptions(), []);

  // UI Mode: "2-set" or "3-set"
  const [mode, setMode] = useState<"2-set" | "3-set">("2-set");

  // Selected Set IDs
  const [setAId, setSetAId] = useState<string>("brand_apple");
  const [setBId, setSetBId] = useState<string>("feature_camera_quality");
  const [setCId, setSetCId] = useState<string>("feature_battery_life");

  // Active Algebraic Operation
  const [activeOperation, setActiveOperation] = useState<ActiveOperation>("intersection");

  // Resolve Set Option Descriptors
  const optionA = availableOptions.find((o) => o.id === setAId) || availableOptions[0]!;
  const optionB = availableOptions.find((o) => o.id === setBId) || availableOptions[1]!;
  const optionC = availableOptions.find((o) => o.id === setCId) || availableOptions[2]!;

  // Compute Discrete Sets of Respondent IDs
  const setA = useMemo(() => optionA.getIds(responses), [optionA, responses]);
  const setB = useMemo(() => optionB.getIds(responses), [optionB, responses]);
  const setC = useMemo(() => optionC.getIds(responses), [optionC, responses]);

  // Compute 2-Set Venn & PIE
  const regions2Set = useMemo(
    () => computeTwoSetVennRegions(universe, setA, setB),
    [universe, setA, setB]
  );
  const pie2Set = useMemo(
    () => verifyInclusionExclusionPrinciple(setA, setB),
    [setA, setB]
  );

  // Compute 3-Set Venn & PIE
  const regions3Set = useMemo(
    () => computeThreeSetVennRegions(universe, setA, setB, setC),
    [universe, setA, setB, setC]
  );
  const pie3Set = useMemo(
    () => verifyThreeSetInclusionExclusion(setA, setB, setC),
    [setA, setB, setC]
  );

  // Handle Mode Change
  const handleModeChange = (newMode: "2-set" | "3-set") => {
    setMode(newMode);
    setActiveOperation(newMode === "2-set" ? "intersection" : "inter_abc");
  };

  // Determine Current Matching Respondent IDs based on Active Operation
  const matchingIds: Set<string> = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return setUnion(setA, setB);
        case "intersection":
          return setIntersection(setA, setB);
        case "diff_ab":
          return setDifference(setA, setB);
        case "diff_ba":
          return setDifference(setB, setA);
        case "sym_diff":
          return symmetricDifference(setA, setB);
        case "comp_a":
          return setComplement(universe, setA);
        case "comp_b":
          return setComplement(universe, setB);
        case "neither":
          return regions2Set.neither;
        case "subset_ab":
          // If subset, return A; if not, return counterexamples (A \ B)
          return isSubset(setA, setB) ? setA : setDifference(setA, setB);
        case "disjoint_ab":
          return setIntersection(setA, setB);
        default:
          return setIntersection(setA, setB);
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return regions3Set.unionSet;
        case "inter_abc":
          return regions3Set.allThree;
        case "inter_ab":
          return setIntersection(setA, setB);
        case "inter_ac":
          return setIntersection(setA, setC);
        case "inter_bc":
          return setIntersection(setB, setC);
        case "only_a":
          return regions3Set.onlyA;
        case "only_b":
          return regions3Set.onlyB;
        case "only_c":
          return regions3Set.onlyC;
        case "only_ab":
          return regions3Set.onlyAB;
        case "only_ac":
          return regions3Set.onlyAC;
        case "only_bc":
          return regions3Set.onlyBC;
        case "outside_abc":
          return regions3Set.outside;
        default:
          return regions3Set.allThree;
      }
    }
  }, [mode, activeOperation, setA, setB, setC, universe, regions2Set, regions3Set]);

  // Human-readable operation explanation for explorer
  const operationLabel = useMemo(() => {
    if (mode === "2-set") {
      switch (activeOperation) {
        case "union":
          return "Union: A ∪ B";
        case "intersection":
          return "Intersection: A ∩ B";
        case "diff_ab":
          return "Difference: A \\ B (A only)";
        case "diff_ba":
          return "Difference: B \\ A (B only)";
        case "sym_diff":
          return "Symmetric Difference: A Δ B";
        case "comp_a":
          return "Complement: Aᶜ (U \\ A)";
        case "comp_b":
          return "Complement: Bᶜ (U \\ B)";
        case "neither":
          return "Neither: (A ∪ B)ᶜ";
        case "subset_ab":
          return isSubset(setA, setB)
            ? "Subset Test: True (A ⊆ B)"
            : "Subset Test: False (Counterexample Elements in A \\ B)";
        case "disjoint_ab":
          return setIntersection(setA, setB).size === 0
            ? "Disjointness: True (A ∩ B = ∅)"
            : "Disjointness: False (Shared Elements Exist)";
        default:
          return "Active Selection";
      }
    } else {
      switch (activeOperation) {
        case "union_abc":
          return "Triple Union: A ∪ B ∪ C";
        case "inter_abc":
          return "Triple Intersection: A ∩ B ∩ C";
        case "inter_ab":
          return "Pairwise Overlap: A ∩ B";
        case "inter_ac":
          return "Pairwise Overlap: A ∩ C";
        case "inter_bc":
          return "Pairwise Overlap: B ∩ C";
        case "only_a":
          return "Region 1: A Only (A \\ (B ∪ C))";
        case "only_b":
          return "Region 2: B Only (B \\ (A ∪ C))";
        case "only_c":
          return "Region 3: C Only (C \\ (A ∪ B))";
        case "only_ab":
          return "Region 4: AB Only ((A ∩ B) \\ C)";
        case "only_ac":
          return "Region 5: AC Only ((A ∩ C) \\ B)";
        case "only_bc":
          return "Region 6: BC Only ((B ∩ C) \\ A)";
        case "outside_abc":
          return "Region 8: Outside All Three ((A ∪ B ∪ C)ᶜ)";
        default:
          return "Active 3-Set Selection";
      }
    }
  }, [mode, activeOperation, setA, setB]);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <PageHeader
        eyebrow="Interactive Mathematics Laboratory"
        title="SetLab"
        description="Formal set theory laboratory evaluating union, intersection, symmetric difference, relative complements, and the Principle of Inclusion-Exclusion on empirical student cohorts."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <>
            <Link href="/">
              <Button variant="outline" size="sm">
                &larr; Campus Pulse
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="primary" size="sm">
                Methodology
              </Button>
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Academic Dataset Status Banner */}
        <Callout
          variant="highlight"
          title={`Active Laboratory Cohort (U = ${universe.size} Respondents)`}
        >
          All operations below evaluate pure mathematical expressions on discrete sets of unique student IDs. Intersections and cardinalities are calculated dynamically from verified survey records rather than estimated from aggregate totals.
        </Callout>

        {/* 1. Set Definition Workspace */}
        <SetSelector
          mode={mode}
          onModeChange={handleModeChange}
          availableOptions={availableOptions}
          setAId={setAId}
          setBId={setBId}
          setCId={setCId}
          onSelectA={setSetAId}
          onSelectB={setSetBId}
          onSelectC={setSetCId}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
          totalUniverseSize={universe.size}
        />

        {/* 2. Set Operations Toolbar */}
        <SetOperationsToolbar
          mode={mode}
          activeOperation={activeOperation}
          onSelectOperation={setActiveOperation}
          resultCardinality={matchingIds.size}
          totalUniverse={universe.size}
        />

        {/* 3. Interactive Venn Diagram & Educational Theory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Venn Diagram */}
          <div className="lg:col-span-7">
            {mode === "2-set" ? (
              <VennDiagram2Set
                setAName={optionA.name}
                setBName={optionB.name}
                regions={regions2Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation2Set) => setActiveOperation(op)}
              />
            ) : (
              <VennDiagram3Set
                setAName={optionA.name}
                setBName={optionB.name}
                setCName={optionC.name}
                regions={regions3Set}
                activeOperation={activeOperation}
                onSelectRegion={(op: Operation3Set) => setActiveOperation(op)}
              />
            )}
          </div>

          {/* Educational Theory Card */}
          <div className="lg:col-span-5">
            <EducationalCard
              operation={activeOperation}
              setAName={optionA.name}
              setBName={optionB.name}
              setCName={mode === "3-set" ? optionC.name : undefined}
              resultCount={matchingIds.size}
              totalUniverse={universe.size}
            />
          </div>
        </div>

        {/* 4. Inclusion-Exclusion Calculator & Step-by-Step Proof */}
        <InclusionExclusionCalculator
          mode={mode}
          pie2Set={pie2Set}
          pie3Set={pie3Set}
          setAName={optionA.name}
          setBName={optionB.name}
          setCName={optionC.name}
          setASize={setA.size}
          setBSize={setB.size}
          setCSize={setC.size}
        />

        {/* 5. Matching Respondent Explorer */}
        <SetRespondentExplorer
          matchingIds={matchingIds}
          allResponses={responses}
          operationName={operationLabel}
          setExplanation={
            mode === "2-set"
              ? `Filtered against Set A (${optionA.name}) and Set B (${optionB.name})`
              : `Filtered against Sets A, B, and C (${optionA.name}, ${optionB.name}, ${optionC.name})`
          }
        />
      </div>
    </div>
  );
}

```


## File: `src/app/combolab/page.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: ComboLab page: light navigation tabs, binomial calculator, and 35-triplet parameter space.

```typescript
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { analyzeFeatureCombinations } from "@/lib/data/combinationAnalytics";
import type { FeatureCombinationRecord } from "@/types/math";

import { CombinationCalculator } from "@/components/combolab/CombinationCalculator";
import { PermutationVsCombination } from "@/components/combolab/PermutationVsCombination";
import { FeatureCombinationExplorer } from "@/components/combolab/FeatureCombinationExplorer";
import { CombinationFrequencyAnalysis } from "@/components/combolab/CombinationFrequencyAnalysis";
import { BudgetCombinationAnalysis } from "@/components/combolab/BudgetCombinationAnalysis";
import { CombinatoricsLearningPanel } from "@/components/combolab/CombinatoricsLearningPanel";
import { CombinationDetailModal } from "@/components/combolab/CombinationDetailModal";

type ActiveTab =
  | "all"
  | "calculator"
  | "permutations"
  | "explorer"
  | "frequency"
  | "budget"
  | "theory";

export default function ComboLabPage() {
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;
  const analytics = useMemo(
    () => analyzeFeatureCombinations(responses),
    [responses]
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [selectedCombination, setSelectedCombination] =
    useState<FeatureCombinationRecord | null>(null);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        eyebrow="Discrete Mathematics & Combinatorics"
        title="ComboLab: Combinatorial Feature Space"
        description="Interactive laboratory exploring binomial coefficients C(n, r), permutations P(n, r), and empirical survey frequencies. Analyzes the discrete space of C(7, 3) = 35 theoretical triplets from the 7 canonical smartphone features."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              datasetInfo.isDemo
                ? "text-stone-700 bg-stone-100 border-stone-200"
                : "text-cobalt-800 bg-cobalt-50 border-cobalt-200"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/setlab">
              <Button variant="outline" size="sm">
                &larr; SetLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation / Focus Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F4F3EE] border border-stone-200 shadow-2xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            All Modules Overview
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "calculator"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            nCr Calculator
          </button>
          <button
            onClick={() => setActiveTab("permutations")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "permutations"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            Permutations vs Combinations
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "explorer"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            35-Triplet Space Explorer
          </button>
          <button
            onClick={() => setActiveTab("frequency")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "frequency"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            Frequency Ranking & Voids
          </button>
          <button
            onClick={() => setActiveTab("budget")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "budget"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            Budget Stratification
          </button>
          <button
            onClick={() => setActiveTab("theory")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "theory"
                ? "bg-white text-stone-900 shadow-2xs font-bold"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
            }`}
          >
            Curriculum Theory
          </button>
        </div>

        {/* Section 1: nCr Calculator */}
        {(activeTab === "all" || activeTab === "calculator") && (
          <section id="calculator" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-base font-serif font-bold text-stone-900 tracking-tight">
                1. Combinations Calculator &amp; Factorial Simplification
              </h2>
              <Badge variant="cobalt">Interactive Math</Badge>
            </div>
            <CombinationCalculator />
          </section>
        )}

        {/* Section 2: Permutation vs Combination Explainer */}
        {(activeTab === "all" || activeTab === "permutations") && (
          <section id="permutations" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-base font-serif font-bold text-stone-900 tracking-tight">
                2. Permutations vs Combinations
              </h2>
              <Badge variant="lime">Order Invariance</Badge>
            </div>
            <PermutationVsCombination />
          </section>
        )}

        {/* Section 3: Feature Combination Explorer (All 35 Triplets) */}
        {(activeTab === "all" || activeTab === "explorer") && (
          <section id="explorer" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-base font-serif font-bold text-stone-900 tracking-tight">
                3. The C(7, 3) = 35 Feature Triplet Space
              </h2>
              <Badge variant="cobalt">Theoretical vs Observed</Badge>
            </div>
            <FeatureCombinationExplorer
              combinations={analytics.combinations}
              totalRespondents={analytics.totalRespondents}
              selectedCombinationId={selectedCombination?.id}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 4: Frequency Analysis & Unobserved Voids */}
        {(activeTab === "all" || activeTab === "frequency") && (
          <section id="frequency" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-base font-serif font-bold text-stone-900 tracking-tight">
                4. Empirical Triplet Frequency Ranking
              </h2>
              <Badge variant="lime">Survey Observations</Badge>
            </div>
            <CombinationFrequencyAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 5: Budget-Based Combination Analysis */}
        {(activeTab === "all" || activeTab === "budget") && (
          <section id="budget" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-base font-serif font-bold text-stone-900 tracking-tight">
                5. Price Tier Stratification &amp; Denominator Integrity
              </h2>
              <Badge variant="cobalt">Subgroup Analysis</Badge>
            </div>
            <BudgetCombinationAnalysis
              analytics={analytics}
              onSelectCombination={(combo) => setSelectedCombination(combo)}
            />
          </section>
        )}

        {/* Section 6: Curriculum Learning Foundation */}
        {(activeTab === "all" || activeTab === "theory") && (
          <section id="theory" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h2 className="text-base font-serif font-bold text-stone-900 tracking-tight">
                6. Undergraduate Curriculum Learning Reference
              </h2>
              <Badge variant="outline">Formal Mathematics</Badge>
            </div>
            <CombinatoricsLearningPanel />
          </section>
        )}

        {/* Global Academic Callout */}
        <Callout
          variant="highlight"
          title="PhonePrint Combinatorial Architecture Summary"
        >
          PhonePrint grounds smartphone preference research in discrete
          mathematics. Selecting 3 features from 7 canonical options establishes a
          finite parameter space of exactly 35 unordered combinations. In this{" "}
          cohort of {responses.length} student respondents ({datasetInfo.notes || "SIMULATED CAMPUS DATA — N=300"}),{" "}
          {analytics.totalObservedCombinations} combinations are populated while{" "}
          {analytics.totalUnobservedCombinations} remain unobserved voids, demonstrating how finite sampling interacts
          with multi-attribute combinatorial spaces.
        </Callout>
      </div>

      {/* Modal / Inspector for selected combination */}
      <CombinationDetailModal
        combination={selectedCombination}
        onClose={() => setSelectedCombination(null)}
        allResponses={responses}
      />
    </div>
  );
}

```


## File: `src/app/experiment-studio/page.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Experiment Studio page: dynamic 300% sum verification badge and budget-triplet cross-tabulation.

```typescript
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { loadSurveyDataset, getActiveDatasetInfo } from "@/lib/data/loader";
import { computeBrandFeatureAssociation } from "@/lib/math/brandFeatureExperiment";
import { computeBudgetCombinationAnalysis } from "@/lib/math/budgetCombinationExperiment";
import {
  SMARTPHONE_BRANDS,
  SMARTPHONE_FEATURES,
  BUDGET_RANGES,
  type SmartphoneBrand,
  type SmartphoneFeature,
  type BudgetRange,
} from "@/types/survey";
import type {
  BrandFeatureCell,
  BudgetCombinationRow,
} from "@/types/experiment";

import { BrandFeatureControls } from "@/components/experiment-studio/BrandFeatureControls";
import { BrandFeatureHeatmap } from "@/components/experiment-studio/BrandFeatureHeatmap";
import { BrandFeatureBarChart } from "@/components/experiment-studio/BrandFeatureBarChart";
import { BrandFeatureInterpretation } from "@/components/experiment-studio/BrandFeatureInterpretation";
import { BudgetCombinationControls } from "@/components/experiment-studio/BudgetCombinationControls";
import { BudgetCombinationMetrics } from "@/components/experiment-studio/BudgetCombinationMetrics";
import { BudgetCombinationChart } from "@/components/experiment-studio/BudgetCombinationChart";
import { BudgetCombinationTable } from "@/components/experiment-studio/BudgetCombinationTable";
import { BudgetCombinationInterpretation } from "@/components/experiment-studio/BudgetCombinationInterpretation";
import { RespondentInspectorModal } from "@/components/experiment-studio/RespondentInspectorModal";

type ActiveTab = "all" | "exp1" | "exp2" | "methodology";

export default function ExperimentStudioPage() {
  // Load dataset
  const dataset = useMemo(() => loadSurveyDataset(), []);
  const datasetInfo = useMemo(() => getActiveDatasetInfo(), []);
  const responses = dataset.responses;

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");

  // Experiment 1 State
  const [selectedBrands, setSelectedBrands] = useState<SmartphoneBrand[]>([
    ...SMARTPHONE_BRANDS,
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<SmartphoneFeature[]>([
    ...SMARTPHONE_FEATURES,
  ]);

  // Experiment 2 State
  const [selectedBudgets, setSelectedBudgets] = useState<BudgetRange[]>([
    ...BUDGET_RANGES,
  ]);

  // Modal State
  const [inspectorModal, setInspectorModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    matchingIds: readonly string[];
  } | null>(null);

  // Computations
  const brandFeatureResult = useMemo(
    () =>
      computeBrandFeatureAssociation(responses, selectedBrands, selectedFeatures),
    [responses, selectedBrands, selectedFeatures]
  );

  const budgetCombinationResult = useMemo(
    () => computeBudgetCombinationAnalysis(responses, selectedBudgets),
    [responses, selectedBudgets]
  );

  // Dynamic Feature Percentage Sum summary across currently selected populated brands
  const displayedFeatureSumSummary = useMemo(() => {
    if (brandFeatureResult.isFullFeatureUniverse) {
      return {
        label: "300.0%",
        note: "All 7 Features (Expected: 300%)",
        isExpected300: true,
      };
    }

    if (selectedFeatures.length === 0) {
      return {
        label: "0.0%",
        note: "0 Features Selected",
        isExpected300: false,
      };
    }

    const populatedSelectedBrands = selectedBrands.filter(
      (b) => (brandFeatureResult.brandTotals[b] ?? 0) > 0
    );

    if (populatedSelectedBrands.length === 0) {
      return {
        label: "0.0%",
        note: "No populated cohorts",
        isExpected300: false,
      };
    }

    const sums = populatedSelectedBrands.map(
      (b) => brandFeatureResult.featurePercentageSumByBrand[b] ?? 0
    );
    const minSum = Math.min(...sums);
    const maxSum = Math.max(...sums);

    const rangeLabel =
      minSum === maxSum
        ? `${minSum.toFixed(1)}%`
        : `${minSum.toFixed(1)}% – ${maxSum.toFixed(1)}%`;

    return {
      label: rangeLabel,
      note: `${selectedFeatures.length}/7 Features (Dynamic Sum)`,
      isExpected300: false,
    };
  }, [brandFeatureResult, selectedBrands, selectedFeatures]);

  // Modal Triggers
  const handleSelectCell = (cell: BrandFeatureCell) => {
    const brandCohortSize = brandFeatureResult.brandTotals[cell.brand] ?? 0;
    setInspectorModal({
      isOpen: true,
      title: `${cell.brand} × ${cell.feature}`,
      subtitle: `Discrete intersection S_${cell.brand} ∩ S_${cell.feature}: ${cell.count} respondents (${cell.percentage.toFixed(
        1
      )}% of ${cell.brand} cohort N=${brandCohortSize})`,
      matchingIds: cell.matchingRespondentIds,
    });
  };

  const handleSelectBudgetRow = (row: BudgetCombinationRow) => {
    const allMatchingIds = Object.values(row.matchingRespondentIdsByBudget).flat();
    setInspectorModal({
      isOpen: true,
      title: `${row.combinationId}: {${row.features.join(", ")}}`,
      subtitle: `Observed ${row.totalObservedOverall} times across all segments. ${
        row.isObservedOverall
          ? "Observed empirical combination."
          : "Combinatorial void (unobserved in dataset)."
      }`,
      matchingIds: allMatchingIds,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Page Header */}
      <PageHeader
        eyebrow="Empirical Discrete Research"
        title="Experiment Studio: Preference Hypothesis Testing"
        description="Investigate empirical patterns and associations across smartphone brands, canonical features, and budget segments. Formulates formal hypotheses, evaluates discrete cross-tabulations, and contrasts theoretical combinatorial spaces against observed survey responses."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "lime" : "cobalt" }}
        actions={
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              datasetInfo.isDemo
                ? "text-stone-700 bg-stone-100 border-stone-200"
                : "text-cobalt-800 bg-cobalt-50 border-cobalt-200"
            }`}>
              {datasetInfo.tagText}
            </span>
            <Link href="/combolab">
              <Button variant="outline" size="sm">
                &larr; ComboLab
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Observational Non-Causal Framing Banner */}
        <Callout
          variant="warning"
          title="Methodological Grounding: Observational Study Notice"
        >
          <div className="space-y-1.5 text-xs text-graphite-300 leading-relaxed">
            <p>
              Data reflects an observational university sample ($N={responses.length}$). Cross-tabulations and segment percentages describe <strong>empirical associations</strong> within this cohort.
            </p>
            <p>
              They <strong>do not prove causal mechanisms</strong>, consumer utility invariance, or general population distributions. Percentages are strictly calculated using respective cohort sizes as denominators ($N(b)$ for brand cohorts; $N(p)$ for budget segments).
            </p>
          </div>
        </Callout>

        {/* Studio Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
          <Button
            size="sm"
            variant={activeTab === "all" ? "primary" : "secondary"}
            onClick={() => setActiveTab("all")}
          >
            All Experiments
          </Button>
          <Button
            size="sm"
            variant={activeTab === "exp1" ? "primary" : "secondary"}
            onClick={() => setActiveTab("exp1")}
          >
            Exp 1: Brand–Feature Association
          </Button>
          <Button
            size="sm"
            variant={activeTab === "exp2" ? "primary" : "secondary"}
            onClick={() => setActiveTab("exp2")}
          >
            Exp 2: Combinations by Budget
          </Button>
          <Button
            size="sm"
            variant={activeTab === "methodology" ? "primary" : "secondary"}
            onClick={() => setActiveTab("methodology")}
          >
            Methodology &amp; Hypotheses
          </Button>
        </div>

        {/* EXPERIMENT 1 SECTION */}
        {(activeTab === "all" || activeTab === "exp1") && (
          <section className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="cobalt">Experiment 01</Badge>
                  <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                    Brand–Feature Preference Association
                  </h2>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Cross-tabulating brand affinity against canonical feature choices. Evaluates within-brand preference distributions P(f | b).
                </p>
                <p className="text-[11px] text-stone-500 mt-1.5 italic">
                  When all seven features are included, the percentages sum to 300% because each respondent selects exactly three features. Filtering the feature list changes the displayed sum.
                </p>
              </div>
              <div className="font-mono text-xs text-stone-700 bg-[#F4F3EE] border border-stone-200 px-3 py-1.5 rounded-lg shrink-0 shadow-2xs">
                Denominator: <span className="text-cobalt-700 font-bold">N(b)</span> | Displayed Sum:{" "}
                <span
                  className={
                    displayedFeatureSumSummary.isExpected300
                      ? "text-lime-700 font-bold"
                      : "text-amber-700 font-bold"
                  }
                >
                  {displayedFeatureSumSummary.label}
                </span>{" "}
                <span className="text-stone-500 text-[10px]">
                  ({displayedFeatureSumSummary.note})
                </span>
              </div>
            </div>

            {/* Interactive Multi-Select Controls */}
            <BrandFeatureControls
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />

            {/* Heatmap Matrix */}
            <BrandFeatureHeatmap
              result={brandFeatureResult}
              onSelectCell={handleSelectCell}
            />

            {/* Grouped Bar Chart */}
            <BrandFeatureBarChart
              result={brandFeatureResult}
              onSelectCell={handleSelectCell}
            />

            {/* Scientific Interpretation & Descriptive Notes */}
            <BrandFeatureInterpretation result={brandFeatureResult} />
          </section>
        )}

        {/* EXPERIMENT 2 SECTION */}
        {(activeTab === "all" || activeTab === "exp2") && (
          <section className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="lime">Experiment 02</Badge>
                  <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                    Feature Triplet Combinations by Budget Segment
                  </h2>
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Stratifying the 35 theoretical triplets across budget ranges. Evaluates C(7,3)=35 theoretical vs empirical observations and within-budget distributions P(t | p).
                </p>
              </div>
              <div className="font-mono text-xs text-stone-700 bg-[#F4F3EE] border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs">
                Denominator: <span className="text-lime-700 font-bold">N(p)</span> | Triplet Sum: <span className="text-cobalt-700 font-bold">100%</span>
              </div>
            </div>

            {/* Budget Controls */}
            <BudgetCombinationControls
              selectedBudgets={selectedBudgets}
              setSelectedBudgets={setSelectedBudgets}
            />

            {/* Summary Stat Cards */}
            <BudgetCombinationMetrics result={budgetCombinationResult} />

            {/* Recharts Bar Chart */}
            <BudgetCombinationChart
              result={budgetCombinationResult}
              onSelectRow={handleSelectBudgetRow}
            />

            {/* Full 35 Combination Table */}
            <BudgetCombinationTable
              result={budgetCombinationResult}
              onSelectRow={handleSelectBudgetRow}
            />

            {/* Scientific Interpretation & Conservation Law */}
            <BudgetCombinationInterpretation result={budgetCombinationResult} />
          </section>
        )}

        {/* DEDICATED METHODOLOGY & HYPOTHESIS COMPARISON TAB */}
        {activeTab === "methodology" && (
          <section className="space-y-6 pt-2">
            <div className="border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">Formal Framework</Badge>
                <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                  Research Hypotheses &amp; Methodological Comparison
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Formal mathematical criteria, hypothesis definitions, and analytical guardrails for the PhonePrint research suite.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exp 1 Summary Card */}
              <Card className="border-slate-200/90 shadow-card">
                <CardHeader
                  title="Experiment 1: Brand–Feature Preferences"
                  subtitle="Within-brand preference distributions"
                  badge={<Badge variant="cobalt">Exp 1 Protocol</Badge>}
                />
                <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Formal Hypothesis Framing
                    </span>
                    <p className="font-medium text-slate-900 mb-1">
                      <strong>H₀ (Null):</strong> Canonical feature selection is conditionally independent of brand choice: <KaTeXMath math="P(f \mid b) = P(f)" /> for all <KaTeXMath math="b \in B, f \in F" />.
                    </p>
                    <p className="font-medium text-slate-900">
                      <strong>H₁ (Alternative):</strong> Feature selection distributions systematically vary across brand cohorts: <KaTeXMath math="\exists b, f: P(f \mid b) \neq P(f)" />.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Mathematical Invariants
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Intersection count: <KaTeXMath math="C(b, f) = |S_b \cap S_f|" />.</li>
                      <li>Within-brand percentage: <KaTeXMath math="P(f \mid b) = \frac{C(b, f)}{N(b)} \times 100\%" />.</li>
                      <li>Because each student selects 3 features, <KaTeXMath math="\sum_{f=1}^7 P(f \mid b) = 300.0\%" /> for every populated brand cohort.</li>
                      <li>Safe zero-denominator handling: <KaTeXMath math="P(f \mid b) = 0.0\%" /> when <KaTeXMath math="N(b) = 0" />.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Exp 2 Summary Card */}
              <Card className="border-slate-200/90 shadow-card">
                <CardHeader
                  title="Experiment 2: Budget Segment Triplet Space"
                  subtitle="Discrete combinatorics across expenditure tiers"
                  badge={<Badge variant="lime">Exp 2 Protocol</Badge>}
                />
                <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Formal Hypothesis Framing
                    </span>
                    <p className="font-medium text-slate-900 mb-1">
                      <strong>H₀ (Null):</strong> Feature triplet choices are uniformly or identically distributed across budget tiers: <KaTeXMath math="P(t \mid p) = P(t)" /> for all <KaTeXMath math="p \in P" />.
                    </p>
                    <p className="font-medium text-slate-900">
                      <strong>H₁ (Alternative):</strong> Specific triplets concentrate within distinct budget tiers (e.g. premium hardware in high budget, value combinations in low budget).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Mathematical Invariants
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Theoretical space: <KaTeXMath math="C(7, 3) = \frac{7!}{3! \cdot 4!} = 35" /> distinct combinations.</li>
                      <li>Observed triplets in sample: {budgetCombinationResult.totalObservedInDataset} combinations; combinatorial voids: {budgetCombinationResult.totalUnobservedInDataset} combinations.</li>
                      <li>Exact unranked set equality: triplet <KaTeXMath math="t = \{f_a, f_b, f_c\}" /> matches regardless of order.</li>
                      <li>Within-budget percentage: <KaTeXMath math="P(t \mid p) = \frac{C(p, t)}{N(p)} \times 100\%" />.</li>
                      <li>Conservation law: <KaTeXMath math="\sum_{t \in C(7,3)} P(t \mid p) = 100.0\%" /> for each populated budget segment.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Comparison Matrix */}
            <Card className="border-slate-200/90 shadow-card">
              <CardHeader
                title="Experiment Comparison Matrix"
                subtitle="Methodological and computational properties of Experiments 1 and 2"
              />
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Experiment 1 (Brand–Feature)</th>
                        <th className="px-4 py-3">Experiment 2 (Budget–Combinations)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Analytical Entity</td>
                        <td className="px-4 py-3">Individual canonical features (<KaTeXMath math="f \in F, |F|=7" />)</td>
                        <td className="px-4 py-3">3-feature subsets / triplets (<KaTeXMath math="t \in \mathcal{P}_3(F), |\mathcal{P}_3(F)|=35" />)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Primary Denominator</td>
                        <td className="px-4 py-3 font-mono text-cobalt-600 font-bold">N(b) (Brand cohort size)</td>
                        <td className="px-4 py-3 font-mono text-lime-600 font-bold">N(p) (Budget segment size)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Sum Conservation Law</td>
                        <td className="px-4 py-3 font-mono">Σ P(f | b) = 300.0% (3 features / student)</td>
                        <td className="px-4 py-3 font-mono">Σ P(t | p) = 100.0% (1 triplet / student)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Theoretical vs Observed</td>
                        <td className="px-4 py-3">All 7 features observed in cohort</td>
                        <td className="px-4 py-3">35 theoretical, {budgetCombinationResult.totalObservedInDataset} observed, {budgetCombinationResult.totalUnobservedInDataset} combinatorial voids</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Set-Theoretic Foundation</td>
                        <td className="px-4 py-3 font-mono">|S_b ∩ S_f|</td>
                        <td className="px-4 py-3 font-mono">|&#123;id | budget = p ∧ features = t&#125;|</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">Interpretation Boundary</td>
                        <td className="px-4 py-3 text-slate-500">Descriptive co-selection; no brand loyalty causality</td>
                        <td className="px-4 py-3 text-slate-500">Empirical concentration; no pricing elasticity causality</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Respondent Inspector Modal */}
      {inspectorModal && (
        <RespondentInspectorModal
          title={inspectorModal.title}
          subtitle={inspectorModal.subtitle}
          matchingIds={inspectorModal.matchingIds}
          allResponses={responses}
          onClose={() => setInspectorModal(null)}
        />
      )}
    </div>
  );
}

```


## File: `src/app/methodology/page.tsx` (**MODIFIED IN PHASE 09**)

> **Notes**: Methodology page: academic textbook format with KaTeX formulas and N=300 simulated dataset notice.

```typescript
import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { KaTeXMath } from "@/components/ui/KaTeXMath";
import { getActiveDatasetInfo } from "@/lib/data/loader";
import {
  SMARTPHONE_BRANDS,
  BUDGET_RANGES,
  SMARTPHONE_FEATURES,
  PRIMARY_USES,
  OS_PREFERENCES,
} from "@/types/survey";

export default function MethodologyPage() {
  const datasetInfo = getActiveDatasetInfo();

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        eyebrow="Academic Research Framework"
        title="Methodology & Data Architecture"
        description="Formal documentation of the survey design, discrete mathematical foundations, validation schemas, and offline data pipeline."
        badge={{ text: datasetInfo.badgeText, variant: datasetInfo.isDemo ? "cobalt" : "lime" }}
        actions={
          <Link href="/">
            <Button variant="outline" size="sm">
              &larr; Back to Campus Pulse
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Core Constraints Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title="Approved 7-Feature Canonical Domain"
              subtitle="Uniform discrete domain for all survey choices"
              badge={<Badge variant="lime">Approved Domain</Badge>}
            />
            <CardContent>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-stone-700">
                {SMARTPHONE_FEATURES.map((feature, i) => (
                  <li key={i} className="font-medium">
                    {feature}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-[11px] text-stone-500 border-t border-stone-100 pt-3">
                Each respondent selects <strong>exactly three distinct features</strong>. Non-distinct choices or counts other than three fail Zod schema validation and Python preprocessing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Mathematical Foundations"
              subtitle="Implemented in pure TypeScript modules decoupled from UI"
              badge={<Badge variant="cobalt">Pure Mathematics</Badge>}
            />
            <CardContent className="space-y-3 text-xs text-stone-700">
              <div>
                <p className="font-semibold text-stone-900">
                  1. Principle of Inclusion-Exclusion (PIE)
                </p>
                <KaTeXMath
                  math="|A \cup B| = |A| + |B| - |A \cap B|"
                  block
                  className="text-cobalt-700 font-semibold"
                />
              </div>
              <div>
                <p className="font-semibold text-stone-900">
                  2. Combinatorial Feature Space
                </p>
                <KaTeXMath
                  math="\binom{n}{r} = \binom{7}{3} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35"
                  block
                  className="text-cobalt-700 font-semibold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Survey Data Fields Specification */}
        <Card>
          <CardHeader
            title="Survey Data Model Specification"
            subtitle="Six discrete attributes recorded per participant"
          />
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Field</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Allowed Domain / Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">response_id</td>
                  <td className="py-2.5 px-3 font-mono">string</td>
                  <td className="py-2.5 px-3">Unique alphanumeric identifier (e.g. <code>RESP_001</code>). Duplicate IDs strictly rejected.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">preferred_brand</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{SMARTPHONE_BRANDS.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">budget_range</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{BUDGET_RANGES.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">preferred_features</td>
                  <td className="py-2.5 px-3 font-mono">[string, string, string]</td>
                  <td className="py-2.5 px-3">Exactly 3 distinct items from the 7 approved features.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">primary_use</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{PRIMARY_USES.join(", ")}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-semibold text-stone-900">os_preference</td>
                  <td className="py-2.5 px-3 font-mono">enum</td>
                  <td className="py-2.5 px-3">{OS_PREFERENCES.join(", ")}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Dataset Disclaimer */}
        <Callout
          variant="highlight"
          title={datasetInfo.isDemo ? "Simulated Campus Dataset Notice (N=300)" : "Verified Empirical Survey Dataset Notice"}
        >
          {datasetInfo.isDemo ? (
            <>
              All data files currently loaded represent the calibrated benchmark dataset of 300 student responses (<strong>SIMULATED CAMPUS DATA — N=300</strong>) tagged with <code>is_demo: true</code>. The records model realistic undergraduate preferences across all canonical brands, budget ranges, and 3-feature combinations to validate schema integrity, mathematical invariants, and interactive visual analytics.
            </>
          ) : (
            <>
              The application is currently operating on real survey data with <code>is_demo: false</code> ({datasetInfo.totalResponses} verified responses). Raw submissions were validated and cleaned through the Phase 07 offline Python pipeline.
            </>
          )}
        </Callout>
      </div>
    </div>
  );
}

```
