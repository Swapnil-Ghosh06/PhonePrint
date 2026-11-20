import type { Metadata } from "next";
import { DM_Sans, Montserrat, Sora } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PhonePrint — Discrete Mathematics & Smartphone Preference Analytics",
  description:
    "An interactive research platform modeling smartphone brand and feature preferences through discrete mathematics, combinatorial structures, and set theory.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${montserrat.variable} ${sora.variable}`}
    >
      <body className="min-h-screen font-sans bg-[#F8FAFC] text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
