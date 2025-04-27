import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { useBrand } from "@/providers/BrandProvider";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PnL() {
  const { currentBrand } = useBrand();
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  // Format dates for API queries
  const fromDate = oneMonthAgo.toISOString().split('T')[0];
  const toDate = today.toISOString().split('T')[0];
  
  // Fetch revenue data
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['/api/revenue', currentBrand?.id, fromDate, toDate],
    enabled: !!currentBrand?.id,
  });
  
  // Fetch ad spend data
  const { data: adSpendData, isLoading: adSpendLoading } = useQuery({
    queryKey: ['/api/ad-spend', currentBrand?.id, fromDate, toDate],
    enabled: !!currentBrand?.id,
  });
  
  // Sample P&L data (in a real app this would be calculated from actual data)
  const monthlyPnLData = [
    { name: "Jan", revenue: 310000, expenses: 240000, profit: 70000 },
    { name: "Feb", revenue: 340000, expenses: 250000, profit: 90000 },
    { name: "Mar", revenue: 370000, expenses: 260000, profit: 110000 },
    { name: "Apr", revenue: 390000, expenses: 270000, profit: 120000 },
    { name: "May", revenue: 380000, expenses: 280000, profit: 100000 },
    { name: "Jun", revenue: 400000, expenses: 290000, profit: 110000 },
  ];
  
  const revenueBreakdown = [
    { name: "Direct Sales", value: 65 },
    { name: "Affiliates", value: 15 },
    { name: "Amazon", value: 10 },
    { name: "Other", value: 10 },
  ];
  
  const expenseBreakdown = [
    { name: "Ad Spend", value: 45 },
    { name: "COGS", value: 30 },
    { name: "Operations", value: 15 },
    { name: "Other", value: 10 },
  ];
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
  
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">P&L Engine</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Last 30 Days
          </Button>
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Monthly Revenue</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{formatCurrency(390000)}</h3>
                <span className="ml-2 text-sm text-green-500">+8.2%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Monthly Expenses</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{formatCurrency(270000)}</h3>
                <span className="ml-2 text-sm text-red-500">+5.1%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Monthly Profit</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{formatCurrency(120000)}</h3>
                <span className="ml-2 text-sm text-green-500">+15.4%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Profit Margin</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">30.8%</h3>
                <span className="ml-2 text-sm text-green-500">+1.9%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* P&L Charts */}
      <Tabs defaultValue="monthly" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Profit & Loss</h2>
          <TabsList className="bg-slate-800">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="monthly" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyPnLData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis
                      stroke="#9ca3af"
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`${formatCurrency(value as number)}`, '']}
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quarterly" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center text-slate-400">
                Quarterly data visualization would appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="h-80 flex items-center justify-center text-slate-400">
                Yearly data visualization would appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
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
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-md">
              <h4 className="font-semibold text-blue-400 mb-1">Revenue Growth Trend</h4>
              <p className="text-slate-300">Your month-over-month revenue growth of 8.2% outperforms your industry average of 5.7%. Consider increasing ad spend in your top-performing channels to capitalize on this momentum.</p>
            </div>
            
            <div className="p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-md">
              <h4 className="font-semibold text-yellow-400 mb-1">Expense Anomaly Detected</h4>
              <p className="text-slate-300">Ad spend increased by 12.4% this month while ROAS declined by 5.1%. Consider auditing your ad campaigns to identify underperforming segments.</p>
            </div>
            
            <div className="p-4 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-md">
              <h4 className="font-semibold text-green-400 mb-1">Profit Optimization Opportunity</h4>
              <p className="text-slate-300">Analysis of your product mix shows the Adult formula has a 42% higher profit margin than other variants. Consider highlighting this product in upcoming marketing campaigns.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
