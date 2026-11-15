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
