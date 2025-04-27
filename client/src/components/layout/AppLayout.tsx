import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-900">
        {/* Header */}
        <Header />

        {/* Page content */}
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  );
}
