import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { useBrand } from "@/providers/BrandProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Check, ArrowRight, Pause, Play, Filter, RefreshCw } from "lucide-react";
import type { AdPerformance } from "@/types";

export default function AdOptimizer() {
  const { currentBrand } = useBrand();
  const [platform, setPlatform] = useState("tiktok");
  const queryClient = useQueryClient();
  
  // Fetch ad performance data
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ['/api/ad-performance', currentBrand?.id, platform],
    enabled: !!currentBrand?.id,
  });
  
  // Update ad status mutation
  const updateAdStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest('PATCH', `/api/ad-performance/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ad-performance', currentBrand?.id] });
    },
  });
  
  const toggleAdStatus = (ad: AdPerformance) => {
    const newStatus = ad.status === 'active' ? 'paused' : 'active';
    updateAdStatusMutation.mutate({ id: ad.id, status: newStatus });
  };
  
  // Metrics summary
  const totalSpend = ads.reduce((sum: number, ad: AdPerformance) => sum + ad.spend, 0);
  const averageRoas = ads.length > 0 
    ? ads.reduce((sum: number, ad: AdPerformance) => sum + ad.roas, 0) / ads.length 
    : 0;
  const averageCtr = ads.length > 0 
    ? ads.reduce((sum: number, ad: AdPerformance) => sum + ad.ctr, 0) / ads.length 
    : 0;
  
  // At-risk ads (low ROAS)
  const atRiskAds = ads.filter((ad: AdPerformance) => ad.roas < 2.5 && ad.status === 'active');
  
  // Sample ad performance trend data (in a real app this would come from API)
  const performanceTrendData = [
    { day: "Mon", roas: 2.8, ctr: 1.9, cpc: 0.62 },
    { day: "Tue", roas: 3.1, ctr: 2.1, cpc: 0.58 },
    { day: "Wed", roas: 2.7, ctr: 1.8, cpc: 0.65 },
    { day: "Thu", roas: 3.3, ctr: 2.3, cpc: 0.55 },
    { day: "Fri", roas: 3.5, ctr: 2.5, cpc: 0.52 },
    { day: "Sat", roas: 3.0, ctr: 2.0, cpc: 0.60 },
    { day: "Sun", roas: 3.2, ctr: 2.2, cpc: 0.57 },
  ];
  
  // Platform performance comparison data
  const platformComparisonData = [
    { platform: "Meta", roas: 2.9, spend: 5200, conversions: 143 },
    { platform: "TikTok", roas: 3.4, spend: 7500, conversions: 224 },
    { platform: "Google", roas: 2.5, spend: 4100, conversions: 98 },
  ];
  
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">Ad Optimizer</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              placeholder="Search ads..."
              className="pl-8 w-full md:w-64 bg-slate-800 border-slate-700"
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Total Ad Spend</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{formatCurrency(totalSpend)}</h3>
                <span className="ml-2 text-sm text-green-500">+8.2%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Average ROAS</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{averageRoas.toFixed(1)}x</h3>
                <span className="ml-2 text-sm text-green-500">+0.3x</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. previous period</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Average CTR</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{averageCtr.toFixed(1)}%</h3>
                <span className="ml-2 text-sm text-green-500">+0.2%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. previous period</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Trend */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader>
          <CardTitle>Ad Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceTrendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Legend />
                <Line type="monotone" dataKey="roas" name="ROAS" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="ctr" name="CTR (%)" stroke="#10b981" />
                <Line type="monotone" dataKey="cpc" name="CPC ($)" stroke="#f59e0b" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Platform Comparison */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader>
          <CardTitle>Platform Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={platformComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Legend />
                <Bar dataKey="roas" name="ROAS" fill="#3b82f6" />
                <Bar dataKey="spend" name="Spend ($100s)" fill="#10b981" />
                <Bar dataKey="conversions" name="Conversions" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* At-Risk Ads */}
      {atRiskAds.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 mb-8 border-yellow-500 border-2">
          <CardHeader className="bg-yellow-500 bg-opacity-10">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              At-Risk Ads
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {atRiskAds.map((ad: AdPerformance) => (
                <div key={ad.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-white">{ad.adSetName}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-slate-400">{ad.adSetId}</span>
                      <span className="mx-2 text-slate-500">•</span>
                      <Badge variant="outline" className="bg-red-500 bg-opacity-10 text-red-400 border-red-500">
                        ROAS: {ad.roas.toFixed(1)}x
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Daily Spend</p>
                      <p className="font-medium">{formatCurrency(ad.spend)}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => toggleAdStatus(ad)}
                    >
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Ad Manager */}
      <Tabs defaultValue="tiktok" onValueChange={setPlatform} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ad Manager</h2>
          <TabsList className="bg-slate-800">
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="all">All Platforms</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="meta" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Ad Set</TableHead>
                      <TableHead className="text-slate-400">Spend</TableHead>
                      <TableHead className="text-slate-400">ROAS</TableHead>
                      <TableHead className="text-slate-400">CTR</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : ads.length === 0 ? (
                      <TableRow className="border-slate-800 hover:bg-slate-800/50">
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="text-slate-400">No Meta ads available</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ads.map((ad: AdPerformance) => (
                        <TableRow key={ad.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white mr-2">
                                {ad.adSetName.slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium">{ad.adSetName}</p>
                                <p className="text-xs text-slate-400">{ad.adSetId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(ad.spend)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={ad.roas >= 3.0 ? "text-green-500" : "text-red-500"}>
                                {ad.roas.toFixed(1)}x
                              </span>
                              {ad.roas >= 3.0 ? (
                                <Check className="h-4 w-4 text-green-500 ml-1" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={ad.ctr >= 1.7 ? "text-green-500" : "text-red-500"}>
                                {ad.ctr.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={ad.status === 'active' ? 'success' : 'secondary'}>
                              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant={ad.status === 'active' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => toggleAdStatus(ad)}
                            >
                              {ad.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-1" /> Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" /> Activate
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiktok" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Ad Set</TableHead>
                      <TableHead className="text-slate-400">Spend</TableHead>
                      <TableHead className="text-slate-400">ROAS</TableHead>
                      <TableHead className="text-slate-400">CTR</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      ads.map((ad: AdPerformance) => (
                        <TableRow key={ad.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white mr-2">
                                {ad.adSetName.slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium">{ad.adSetName}</p>
                                <p className="text-xs text-slate-400">{ad.adSetId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(ad.spend)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={ad.roas >= 3.0 ? "text-green-500" : "text-red-500"}>
                                {ad.roas.toFixed(1)}x
                              </span>
                              {ad.roas >= 3.0 ? (
                                <Check className="h-4 w-4 text-green-500 ml-1" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={ad.ctr >= 1.7 ? "text-green-500" : "text-red-500"}>
                                {ad.ctr.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                ad.status === 'active' 
                                  ? 'success' 
                                  : ad.status === 'warning' 
                                    ? 'warning' 
                                    : 'secondary'
                              }
                            >
                              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant={ad.status === 'active' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => toggleAdStatus(ad)}
                            >
                              {ad.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-1" /> Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" /> Activate
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="rounded-md border border-slate-800">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-slate-800/50">
                      <TableHead className="text-slate-400">Platform</TableHead>
                      <TableHead className="text-slate-400">Ad Set</TableHead>
                      <TableHead className="text-slate-400">Spend</TableHead>
                      <TableHead className="text-slate-400">ROAS</TableHead>
                      <TableHead className="text-slate-400">CTR</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      ads.map((ad: AdPerformance) => (
                        <TableRow key={ad.id} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell>
                            <Badge variant="outline">
                              {ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white mr-2">
                                {ad.adSetName.slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium">{ad.adSetName}</p>
                                <p className="text-xs text-slate-400">{ad.adSetId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(ad.spend)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={ad.roas >= 3.0 ? "text-green-500" : "text-red-500"}>
                                {ad.roas.toFixed(1)}x
                              </span>
                              {ad.roas >= 3.0 ? (
                                <Check className="h-4 w-4 text-green-500 ml-1" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={ad.ctr >= 1.7 ? "text-green-500" : "text-red-500"}>
                                {ad.ctr.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                ad.status === 'active' 
                                  ? 'success' 
                                  : ad.status === 'warning' 
                                    ? 'warning' 
                                    : 'secondary'
                              }
                            >
                              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant={ad.status === 'active' ? 'destructive' : 'default'}
                              size="sm"
                              onClick={() => toggleAdStatus(ad)}
                            >
                              {ad.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-1" /> Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" /> Activate
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
