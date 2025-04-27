import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { AIAgentsSection } from "@/components/dashboard/AIAgentsSection";
import { AdPerformanceSection } from "@/components/dashboard/AdPerformanceSection";
import { OpsTasksSection } from "@/components/dashboard/OpsTasksSection";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { currentBrand } = useBrand();

  // Fetch revenue metrics
  const { data: revenueMetrics, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['/api/revenue', currentBrand?.id, 'today'],
    enabled: !!currentBrand?.id,
  });

  // Fetch ad spend metrics
  const { data: adSpendMetrics, isLoading: isLoadingAdSpend } = useQuery({
    queryKey: ['/api/ad-spend', currentBrand?.id, 'today'],
    enabled: !!currentBrand?.id,
  });

  // Sample chart data (in a real app this would come from an API)
  const chartData = [
    { name: "Mon", revenue: 8500, adSpend: 2800 },
    { name: "Tue", revenue: 9200, adSpend: 2900 },
    { name: "Wed", revenue: 10500, adSpend: 3000 },
    { name: "Thu", revenue: 11800, adSpend: 3100 },
    { name: "Fri", revenue: 13000, adSpend: 2900 },
    { name: "Sat", revenue: 12000, adSpend: 3000 },
    { name: "Sun", revenue: 14000, adSpend: 3200 },
  ];

  return (
    <div>
      {/* Overview section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Revenue Card */}
          <OverviewCard
            title="Today's Revenue"
            value={isLoadingRevenue ? "$--,---" : formatCurrency(revenueMetrics?.amount || 12426)}
            change={{ value: 12.4, isPositive: true }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            iconColor="blue"
            href="/pnl"
          />

          {/* ROAS Card */}
          <OverviewCard
            title="ROAS (30d avg)"
            value="3.2x"
            change={{ value: 5.1, isPositive: false }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            iconColor="purple"
            href="/ad-optimizer"
          />

          {/* Ad Spend Card */}
          <OverviewCard
            title="Today's Ad Spend"
            value={isLoadingAdSpend ? "$--,---" : formatCurrency(adSpendMetrics?.amount || 3872)}
            change={{ value: 8.2, isPositive: true }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            }
            iconColor="green"
            href="/ad-optimizer"
          />

          {/* Customer Acquisition Cost Card */}
          <OverviewCard
            title="Customer Acq. Cost"
            value="$24.16"
            change={{ value: 3.5, isPositive: true }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            iconColor="yellow"
            href="/customer-vault"
          />
        </div>
      </div>

      {/* Revenue chart section */}
      <RevenueChart data={chartData} className="mb-8" />

      {/* AI Agents & Ad Performance section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AIAgentsSection />
        <AdPerformanceSection />
      </div>

      {/* Operations Tasks section */}
      <OpsTasksSection className="mt-8" />
    </div>
  );
}
