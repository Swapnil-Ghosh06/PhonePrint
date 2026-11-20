import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="flex-1 transition-all">{children}</main>
      <Footer />
    </div>
  );
}
