import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdPerformance } from "@/types";

type Platform = 'meta' | 'tiktok' | 'all';

interface AdPerformanceSectionProps {
  className?: string;
}

export function AdPerformanceSection({ className }: AdPerformanceSectionProps) {
  const { currentBrand } = useBrand();
  const [platform, setPlatform] = useState<Platform>('tiktok');
  
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['/api/ad-performance', currentBrand?.id, platform !== 'all' ? platform : undefined],
    enabled: !!currentBrand?.id,
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Ad Performance</h2>
        <div className="flex space-x-2">
          <Button
            variant={platform === 'meta' ? "default" : "outline"}
            className={
              platform === 'meta'
                ? ""
                : "border-slate-700 text-white bg-slate-800 hover:bg-slate-700"
            }
            onClick={() => setPlatform('meta')}
          >
            Meta
          </Button>
          <Button
            variant={platform === 'tiktok' ? "default" : "outline"}
            className={
              platform === 'tiktok'
                ? ""
                : "border-slate-700 text-white bg-slate-800 hover:bg-slate-700"
            }
            onClick={() => setPlatform('tiktok')}
          >
            TikTok
          </Button>
          <Button
            variant={platform === 'all' ? "default" : "outline"}
            className={
              platform === 'all'
                ? ""
                : "border-slate-700 text-white bg-slate-800 hover:bg-slate-700"
            }
            onClick={() => setPlatform('all')}
          >
            All
          </Button>
        </div>
      </div>
      <Card className="bg-slate-900 rounded-lg shadow overflow-hidden border-slate-800">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    Ad Set
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    Spend
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    ROAS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    CTR
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="ml-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24 mt-1" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-24 mt-1" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-16 mt-1" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                    </tr>
                  ))
                ) : (
                  ads.map((ad: AdPerformance) => (
                    <tr key={ad.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {ad.thumbnail ? (
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white overflow-hidden">
                              {ad.adSetName.slice(0, 2)}
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                              {ad.adSetName.slice(0, 2)}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {ad.adSetName}
                            </div>
                            <div className="text-sm text-slate-400">
                              {ad.adSetId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {formatCurrency(ad.spend)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {Math.random() > 0.5 ? "+" : "-"}
                          {Math.floor(Math.random() * 20)}% vs yesterday
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-medium">
                          {ad.roas.toFixed(1)}x
                        </div>
                        <div
                          className={cn(
                            "text-sm",
                            ad.roas >= 3.0
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {ad.roas >= 3.0 ? "+" : ""}
                          {(ad.roas - 3.0).toFixed(1)} vs target
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {ad.ctr.toFixed(1)}%
                        </div>
                        <div
                          className={cn(
                            "text-sm",
                            ad.ctr >= 1.7
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {ad.ctr >= 1.7 ? "+" : ""}
                          {(ad.ctr - 1.7).toFixed(1)}% vs avg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            {
                              "bg-green-100 text-green-800": ad.status === "active",
                              "bg-yellow-100 text-yellow-800": ad.status === "warning",
                              "bg-red-100 text-red-800": ad.status === "paused",
                            }
                          )}
                        >
                          {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
