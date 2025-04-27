import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileDownIcon,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  MessageCircle,
  MessageSquare
} from "lucide-react";

export default function PMFIntelligence() {
  // Sample product-market fit data
  const customerSatisfactionData = [
    { month: "Jan", score: 7.6 },
    { month: "Feb", score: 7.8 },
    { month: "Mar", score: 7.9 },
    { month: "Apr", score: 8.1 },
    { month: "May", score: 8.4 },
    { month: "Jun", score: 8.2 },
  ];
  
  const sentimentData = [
    { name: "Positive", value: 65 },
    { name: "Neutral", value: 25 },
    { name: "Negative", value: 10 },
  ];
  
  const SENTIMENT_COLORS = ['#10b981', '#6b7280', '#ef4444'];
  
  const objectionData = [
    { objection: "Price", count: 42 },
    { objection: "Taste", count: 28 },
    { objection: "Packaging", count: 18 },
    { objection: "Shipping", count: 36 },
    { objection: "Size Options", count: 22 },
  ];
  
  const productFitRadarData = [
    { attribute: "Solves Problem", product: 85, competitor: 65 },
    { attribute: "Ease of Use", product: 90, competitor: 70 },
    { attribute: "Value for Money", product: 70, competitor: 75 },
    { attribute: "Brand Trust", product: 80, competitor: 85 },
    { attribute: "Customer Service", product: 95, competitor: 65 },
  ];
  
  const customerDemographicsData = [
    { name: "18-24", value: 15 },
    { name: "25-34", value: 35 },
    { name: "35-44", value: 25 },
    { name: "45-54", value: 15 },
    { name: "55+", value: 10 },
  ];
  
  const DEMOGRAPHIC_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];
  
  const formatYAxis = (tickItem: number) => {
    return `${tickItem}/10`;
  };
  
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">PMF Intelligence</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileDownIcon className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button>
            <MessageCircle className="h-4 w-4 mr-2" />
            Customer Feedback
          </Button>
        </div>
      </div>
      
      {/* PMF Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800 col-span-1 md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col h-full justify-center">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Product-Market Fit Score</p>
                <Badge variant="outline" className="bg-green-500 bg-opacity-10 text-green-400 border-green-500">
                  Good
                </Badge>
              </div>
              <div className="flex items-baseline mt-1">
                <h3 className="text-5xl font-bold">73%</h3>
                <span className="ml-2 text-lg text-green-500 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  4.2%
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2">40%+ is considered Product-Market fit</p>
              <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col h-full justify-center">
              <p className="text-sm text-slate-400">Customer Satisfaction</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold">8.2/10</h3>
                <span className="ml-2 text-sm text-green-500 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  0.3
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col h-full justify-center">
              <p className="text-sm text-slate-400">Net Promoter Score</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-3xl font-bold">42</h3>
                <span className="ml-2 text-sm text-red-500 flex items-center">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  2
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer Satisfaction Trend */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader>
          <CardTitle>Customer Satisfaction Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={customerSatisfactionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={formatYAxis} domain={[6, 10]} />
                <Tooltip formatter={(value) => [`${value}/10`, 'Satisfaction']} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                <Legend />
                <Line type="monotone" dataKey="score" name="Satisfaction Score" stroke="#3b82f6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Feedback Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Objection Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={objectionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="objection" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                  <Bar dataKey="count" name="Objection Count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerDemographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerDemographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEMOGRAPHIC_COLORS[index % DEMOGRAPHIC_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Product-Market Fit Radar */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader>
          <CardTitle>Product-Market Fit Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={productFitRadarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="attribute" stroke="#9ca3af" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9ca3af" />
                <Radar name="Your Product" dataKey="product" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Top Competitor" dataKey="competitor" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Customer Feedback */}
      <Card className="bg-slate-900 border-slate-800 mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Customer Feedback</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center text-sm text-green-500 mr-3">JD</div>
                  <div>
                    <h4 className="font-medium">John D.</h4>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-500' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-slate-400">2 days ago</span>
              </div>
              <p className="mt-3 text-slate-300">"My dog absolutely loves HydraBark! His coat is shinier and he seems to have more energy. Will definitely be buying again."</p>
              <div className="mt-2 flex">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 bg-opacity-10 text-green-400">
                  Positive
                </span>
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center text-sm text-blue-500 mr-3">SM</div>
                  <div>
                    <h4 className="font-medium">Sarah M.</h4>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < 3 ? 'text-yellow-500' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-slate-400">5 days ago</span>
              </div>
              <p className="mt-3 text-slate-300">"The product is good, but I think it's a bit expensive compared to other options. My dog likes it, but I'm not sure if I'll keep buying it at this price point."</p>
              <div className="mt-2 flex">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500 bg-opacity-10 text-yellow-400">
                  Mixed
                </span>
              </div>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center text-sm text-purple-500 mr-3">RJ</div>
                  <div>
                    <h4 className="font-medium">Robert J.</h4>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-500' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-slate-400">1 week ago</span>
              </div>
              <p className="mt-3 text-slate-300">"I switched from Brand X to HydraBark and noticed an immediate difference in my senior dog's energy levels. The packaging is convenient and the auto-ship option saves me time. Highly recommend!"</p>
              <div className="mt-2 flex">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 bg-opacity-10 text-green-400">
                  Positive
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import Badge separately since it wasn't included in the imports
function Badge({ variant, className, children }: { variant: string, className?: string, children: React.ReactNode }) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variantStyles = {
    default: "bg-slate-700 text-slate-200",
    secondary: "bg-slate-600 text-slate-200",
    success: "bg-green-500 bg-opacity-20 text-green-400",
    warning: "bg-yellow-500 bg-opacity-20 text-yellow-400",
    destructive: "bg-red-500 bg-opacity-20 text-red-400",
    outline: "border border-slate-700 text-slate-300"
  };
  
  const styles = variant === "outline" ? baseStyles + " " + variantStyles.outline : baseStyles + " " + variantStyles[variant as keyof typeof variantStyles];
  
  return (
    <span className={`${styles} ${className || ""}`}>
      {children}
    </span>
  );
}
