import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [location] = useLocation();
  
  // Get the current page title based on location
  const getPageTitle = (): string => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/pnl":
        return "P&L Engine";
      case "/ai-agents":
        return "AI Agents";
      case "/ad-optimizer":
        return "Ad Optimizer";
      case "/pmf-intelligence":
        return "PMF Intelligence";
      case "/customer-vault":
        return "Customer Vault";
      case "/support-radar":
        return "Support Radar";
      case "/seo-autopilot":
        return "SEO Autopilot";
      case "/ops-tasks":
        return "Ops Tasks";
      case "/meeting-gpt":
        return "Meeting GPT";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-white">{getPageTitle()}</h1>
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative max-w-xs">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-3 py-2 border border-slate-700 rounded-md leading-5 bg-slate-800 text-slate-300 placeholder-slate-400 focus:outline-none focus:bg-slate-700 focus:border-slate-600 focus:text-white sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        
        {/* Command Center */}
        <Button 
          variant="default" 
          className="inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Command Center
        </Button>
      </div>
    </div>
  );
}
