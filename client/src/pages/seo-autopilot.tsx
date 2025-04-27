import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BarChart4, Zap, Globe, ArrowUpRight } from "lucide-react";

export default function SEOAutopilot() {
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">SEO Autopilot</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" /> Keyword Research
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" /> Run Analysis
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Domain Authority</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">42/100</h3>
                <span className="ml-2 text-sm text-green-500">+5</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Organic Keywords</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">1,245</h3>
                <span className="ml-2 text-sm text-green-500">+124</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Organic Traffic</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">28,432</h3>
                <span className="ml-2 text-sm text-green-500">+12.4%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Avg. Position</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">14.3</h3>
                <span className="ml-2 text-sm text-green-500">+2.1</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* SEO Opportunities */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader>
          <CardTitle>SEO Improvement Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500 bg-opacity-20 mr-3">
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Content Enhancement for "Dog Food Benefits" Page</h3>
                    <p className="text-sm text-slate-400 mt-1">Keyword: "healthy dog food benefits" (Search volume: 2.4k/mo)</p>
                  </div>
                </div>
                <Button size="sm" className="gap-1">
                  <ArrowUpRight className="h-4 w-4" /> Apply
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-300">Adding more comprehensive content about the specific health benefits of your ingredients could boost this page from position #8 to top 3.</p>
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500 bg-opacity-20 mr-3">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Page Speed Optimization</h3>
                    <p className="text-sm text-slate-400 mt-1">Current mobile speed score: 64/100</p>
                  </div>
                </div>
                <Button size="sm" className="gap-1">
                  <ArrowUpRight className="h-4 w-4" /> Fix
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-300">Optimize images and implement lazy loading to improve mobile page speed. This could improve rankings for 45+ keywords.</p>
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-500 bg-opacity-20 mr-3">
                    <BarChart4 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Internal Linking Structure</h3>
                    <p className="text-sm text-slate-400 mt-1">12 high-value pages with limited internal links</p>
                  </div>
                </div>
                <Button size="sm" className="gap-1">
                  <ArrowUpRight className="h-4 w-4" /> Implement
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-300">Improving internal linking to product category pages could significantly boost their authority and search visibility.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Coming Soon Message */}
      <Card className="bg-blue-900 bg-opacity-30 border-blue-700 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="mr-4 p-3 bg-blue-500 bg-opacity-20 rounded-full">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI-Powered Content Recommendations Coming Soon</h3>
              <p className="text-blue-200 mt-1">Our AI engine will soon analyze your top competitors and suggest content improvements with GPT-4 generation capabilities.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}