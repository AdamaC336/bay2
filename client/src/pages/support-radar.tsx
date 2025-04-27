import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
  Info,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart4
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
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
import { analyzeSentiment } from "@/lib/openai";

export default function SupportRadar() {
  const { currentBrand } = useBrand();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  
  // Sample support ticket data
  const supportTickets = [
    {
      id: 1,
      customer: "John Davis",
      email: "john.davis@example.com",
      subject: "Order delivery delay",
      category: "shipping",
      status: "open",
      priority: "high",
      timestamp: new Date(2023, 6, 28, 14, 35),
      sentimentScore: 0.3,
      channel: "email"
    },
    {
      id: 2,
      customer: "Sarah Miller",
      email: "sarah.miller@example.com",
      subject: "Product quality issue",
      category: "product",
      status: "in_progress",
      priority: "medium",
      timestamp: new Date(2023, 6, 27, 11, 22),
      sentimentScore: 0.2,
      channel: "chat"
    },
    {
      id: 3,
      customer: "Robert Johnson",
      email: "robert.johnson@example.com",
      subject: "Billing discrepancy",
      category: "billing",
      status: "resolved",
      priority: "low",
      timestamp: new Date(2023, 6, 26, 9, 15),
      sentimentScore: 0.7,
      channel: "phone"
    },
    {
      id: 4,
      customer: "Emily Adams",
      email: "emily.adams@example.com",
      subject: "Website login issue",
      category: "technical",
      status: "open",
      priority: "medium",
      timestamp: new Date(2023, 6, 28, 8, 42),
      sentimentScore: 0.4,
      channel: "email"
    },
    {
      id: 5,
      customer: "Michael Wilson",
      email: "michael.wilson@example.com",
      subject: "Return process question",
      category: "returns",
      status: "in_progress",
      priority: "low",
      timestamp: new Date(2023, 6, 27, 16, 10),
      sentimentScore: 0.6,
      channel: "chat"
    }
  ];
  
  // Sample support metrics
  const supportMetrics = {
    openTickets: 28,
    avgResponseTime: "1h 12m",
    avgResolutionTime: "7h 45m",
    ticketsToday: 12,
    customerSatisfaction: 87
  };
  
  // Filter tickets based on search query
  const filteredTickets = supportTickets.filter(ticket => 
    ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sample ticket messages for detail view
  const ticketMessages = [
    {
      id: 1,
      sender: "John Davis",
      isCustomer: true,
      message: "Hi, I ordered your HydraBark dog food last week (Order #4392) and it still hasn't arrived. The tracking hasn't updated since Monday. Can you help me figure out what's going on?",
      timestamp: new Date(2023, 6, 28, 14, 35),
    },
    {
      id: 2,
      sender: "Support Agent",
      isCustomer: false,
      message: "Hello John, thank you for reaching out. I'm sorry to hear about the delay with your order. Let me check the tracking information and get back to you with more details.",
      timestamp: new Date(2023, 6, 28, 14, 42),
    },
    {
      id: 3,
      sender: "Support Agent",
      isCustomer: false,
      message: "I've looked into your order #4392. It appears there was a delay at the shipping facility. I've contacted our logistics team and they've assured me your package will be delivered by tomorrow. I'll send you an updated tracking link in a moment.",
      timestamp: new Date(2023, 6, 28, 14, 55),
    },
    {
      id: 4,
      sender: "John Davis",
      isCustomer: true,
      message: "Thanks for checking. I'm running low on dog food, so this is quite urgent. I hope it does arrive tomorrow as promised.",
      timestamp: new Date(2023, 6, 28, 15, 2),
    },
    {
      id: 5,
      sender: "Support Agent",
      isCustomer: false,
      message: "I completely understand your concern, John. I've added a note about the urgency. As a goodwill gesture for the inconvenience, I've added a 15% discount code to your account for your next purchase. The code is THANKYOU15 and will be valid for 30 days.",
      timestamp: new Date(2023, 6, 28, 15, 10),
    },
    {
      id: 6,
      sender: "John Davis",
      isCustomer: true,
      message: "That's very kind of you, thank you! I appreciate your help with this.",
      timestamp: new Date(2023, 6, 28, 15, 15),
    }
  ];
  
  // Sample sentiment analysis data
  const [sentimentAnalysis, setSentimentAnalysis] = useState({
    sentiment: "negative",
    score: 0.3,
    keyThemes: ["delivery delay", "urgency", "running out of product"],
    actionableInsights: ["Expedite shipping", "Offer compensation", "Follow up tomorrow"],
    summary: "Customer is frustrated about delivery delay and is running low on product, creating urgency. The situation was handled with an explanation, apology, and discount code as compensation."
  });
  
  // Sample trend data
  const ticketTrendData = [
    { day: "Mon", tickets: 14, resolved: 12 },
    { day: "Tue", tickets: 18, resolved: 15 },
    { day: "Wed", tickets: 16, resolved: 14 },
    { day: "Thu", tickets: 22, resolved: 18 },
    { day: "Fri", tickets: 24, resolved: 20 },
    { day: "Sat", tickets: 15, resolved: 13 },
    { day: "Sun", tickets: 12, resolved: 11 },
  ];
  
  // Sample category distribution data
  const categoryData = [
    { name: "Shipping", value: 35 },
    { name: "Product", value: 25 },
    { name: "Billing", value: 15 },
    { name: "Technical", value: 15 },
    { name: "Returns", value: 10 },
  ];
  
  const CATEGORY_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  
  // Priority style mapping
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-red-50';
      case 'medium':
        return 'bg-yellow-500 text-yellow-50';
      case 'low':
        return 'bg-blue-500 text-blue-50';
      default:
        return 'bg-slate-500 text-slate-50';
    }
  };
  
  // Status style mapping
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive';
      case 'in_progress':
        return 'default';
      case 'resolved':
        return 'default'; // Using default instead of success as it's not available in Badge component
      default:
        return 'secondary';
    }
  };
  
  // Status icons
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      default:
        return <Info className="h-4 w-4 mr-1" />;
    }
  };
  
  // Channel icons
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4 text-slate-400" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 text-slate-400" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-slate-400" />;
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };
  
  // Analyze sentiment for customer message (simulated)
  const performSentimentAnalysis = async (message: string) => {
    try {
      // In a real app, this would call the OpenAI API
      console.log("Analyzing sentiment for:", message);
      // For demo purposes, use preset values instead of real API call
      return sentimentAnalysis;
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">Support Radar</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart4 className="h-4 w-4" /> Reports
          </Button>
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" /> New Ticket
          </Button>
        </div>
      </div>
      
      {/* Support Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Open Tickets</p>
              <h3 className="text-2xl font-bold mt-1">{supportMetrics.openTickets}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Avg. Response Time</p>
              <h3 className="text-2xl font-bold mt-1">{supportMetrics.avgResponseTime}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Avg. Resolution Time</p>
              <h3 className="text-2xl font-bold mt-1">{supportMetrics.avgResolutionTime}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Tickets Today</p>
              <h3 className="text-2xl font-bold mt-1">{supportMetrics.ticketsToday}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-slate-400">Customer Satisfaction</p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{supportMetrics.customerSatisfaction}%</h3>
                <span className="ml-2 text-sm text-green-500">+2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Support Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ticket Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ticketTrendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                  <Legend />
                  <Line type="monotone" dataKey="tickets" name="New Tickets" stroke="#ef4444" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Ticket Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="mb-8">
        {selectedTicket ? (
          // Ticket Detail View
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  className="mb-2 -ml-4 text-slate-400 hover:text-white"
                  onClick={() => setSelectedTicket(null)}
                >
                  <ChevronRight className="h-4 w-4 mr-1 rotate-180" /> Back to tickets
                </Button>
                <CardTitle className="text-xl flex items-center">
                  {supportTickets.find(t => t.id === selectedTicket)?.subject}
                  <Badge 
                    variant={getStatusBadgeVariant(supportTickets.find(t => t.id === selectedTicket)?.status || 'open')}
                    className="ml-2"
                  >
                    {getStatusIcon(supportTickets.find(t => t.id === selectedTicket)?.status || 'open')}
                    {(supportTickets.find(t => t.id === selectedTicket)?.status || 'open').replace('_', ' ').charAt(0).toUpperCase() + 
                    (supportTickets.find(t => t.id === selectedTicket)?.status || 'open').replace('_', ' ').slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Ticket #{selectedTicket} | {supportTickets.find(t => t.id === selectedTicket)?.customer} | {new Date(supportTickets.find(t => t.id === selectedTicket)?.timestamp || new Date()).toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" /> Reply
                </Button>
                <Button variant="outline" size="sm">
                  <XCircle className="h-4 w-4 mr-2" /> Close Ticket
                </Button>
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" /> Resolve
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Conversation */}
                  <Card className="bg-slate-800 border-slate-700 mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Conversation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {ticketMessages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.isCustomer ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className={`max-w-[80%] ${message.isCustomer ? 
                              'bg-slate-700 rounded-tr-lg rounded-br-lg rounded-bl-lg' : 
                              'bg-blue-500 bg-opacity-20 rounded-tl-lg rounded-bl-lg rounded-br-lg'
                            } p-4`}>
                              <div className="flex items-center mb-2">
                                <div className={`h-8 w-8 rounded-full ${message.isCustomer ? 
                                  'bg-green-500 text-white' : 
                                  'bg-blue-500 text-white'
                                } flex items-center justify-center text-xs font-medium mr-2`}>
                                  {message.sender.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium">{message.sender}</p>
                                  <p className="text-xs text-slate-400">{message.timestamp.toLocaleTimeString()}</p>
                                </div>
                              </div>
                              <p className="text-slate-200">{message.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Reply box */}
                      <div className="mt-6">
                        <div className="relative">
                          <Input
                            placeholder="Type your reply..."
                            className="bg-slate-900 border-slate-700 pr-24"
                          />
                          <Button className="absolute right-1 top-1 bottom-1 px-3">
                            Send
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  {/* Ticket Information */}
                  <Card className="bg-slate-800 border-slate-700 mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Ticket Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status</span>
                          <Badge 
                            variant={getStatusBadgeVariant(supportTickets.find(t => t.id === selectedTicket)?.status || 'open')}
                          >
                            {(supportTickets.find(t => t.id === selectedTicket)?.status || 'open').replace('_', ' ').charAt(0).toUpperCase() + 
                            (supportTickets.find(t => t.id === selectedTicket)?.status || 'open').replace('_', ' ').slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Priority</span>
                          <Badge 
                            className={getPriorityBadgeStyle(supportTickets.find(t => t.id === selectedTicket)?.priority || 'medium')}
                          >
                            {(supportTickets.find(t => t.id === selectedTicket)?.priority || 'medium').charAt(0).toUpperCase() + 
                            (supportTickets.find(t => t.id === selectedTicket)?.priority || 'medium').slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category</span>
                          <span className="font-medium">
                            {(supportTickets.find(t => t.id === selectedTicket)?.category || 'general').charAt(0).toUpperCase() + 
                            (supportTickets.find(t => t.id === selectedTicket)?.category || 'general').slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Channel</span>
                          <span className="font-medium flex items-center">
                            {getChannelIcon(supportTickets.find(t => t.id === selectedTicket)?.channel || 'email')}
                            <span className="ml-1">
                              {(supportTickets.find(t => t.id === selectedTicket)?.channel || 'email').charAt(0).toUpperCase() + 
                              (supportTickets.find(t => t.id === selectedTicket)?.channel || 'email').slice(1)}
                            </span>
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Created</span>
                          <span className="font-medium">
                            {new Date(supportTickets.find(t => t.id === selectedTicket)?.timestamp || new Date()).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Updated</span>
                          <span className="font-medium">
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* AI Sentiment Analysis */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
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
                        AI Sentiment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Sentiment</span>
                          <Badge 
                            variant={sentimentAnalysis.sentiment === 'positive' ? 
                              'default' : 
                              sentimentAnalysis.sentiment === 'neutral' ? 
                              'secondary' : 
                              'destructive'
                            }
                          >
                            {sentimentAnalysis.sentiment.charAt(0).toUpperCase() + sentimentAnalysis.sentiment.slice(1)}
                          </Badge>
                        </div>
                        
                        <div>
                          <span className="text-slate-400 block mb-2">Key Themes</span>
                          <div className="flex flex-wrap gap-2">
                            {sentimentAnalysis.keyThemes.map((theme, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-500 bg-opacity-10 text-blue-400 border-blue-500">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-slate-400 block mb-2">Actionable Insights</span>
                          <ul className="list-disc pl-5 space-y-1">
                            {sentimentAnalysis.actionableInsights.map((insight, index) => (
                              <li key={index} className="text-sm">{insight}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="text-slate-400 block mb-2">Summary</span>
                          <p className="text-sm">{sentimentAnalysis.summary}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Ticket List View
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Support Tickets</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Search tickets..."
                      className="pl-8 w-full md:w-64 bg-slate-800 border-slate-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="bg-slate-800 mb-4">
                  <TabsTrigger value="all">All Tickets</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="rounded-md border border-slate-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-800/50">
                          <TableHead className="text-slate-400">Ticket</TableHead>
                          <TableHead className="text-slate-400">Customer</TableHead>
                          <TableHead className="text-slate-400">Category</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400">Priority</TableHead>
                          <TableHead className="text-slate-400">Created</TableHead>
                          <TableHead className="text-slate-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets.map((ticket) => (
                          <TableRow 
                            key={ticket.id}
                            className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            <TableCell className="font-medium flex items-center">
                              {getChannelIcon(ticket.channel)}
                              <span className="ml-2">{ticket.subject}</span>
                            </TableCell>
                            <TableCell>{ticket.customer}</TableCell>
                            <TableCell>
                              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(ticket.status)}>
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getPriorityBadgeStyle(ticket.priority)}>
                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{ticket.timestamp.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTicket(ticket.id);
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="open" className="mt-0">
                  <div className="rounded-md border border-slate-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-800/50">
                          <TableHead className="text-slate-400">Ticket</TableHead>
                          <TableHead className="text-slate-400">Customer</TableHead>
                          <TableHead className="text-slate-400">Category</TableHead>
                          <TableHead className="text-slate-400">Priority</TableHead>
                          <TableHead className="text-slate-400">Created</TableHead>
                          <TableHead className="text-slate-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets
                          .filter(t => t.status === 'open')
                          .map((ticket) => (
                            <TableRow 
                              key={ticket.id}
                              className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                              onClick={() => setSelectedTicket(ticket.id)}
                            >
                              <TableCell className="font-medium flex items-center">
                                {getChannelIcon(ticket.channel)}
                                <span className="ml-2">{ticket.subject}</span>
                              </TableCell>
                              <TableCell>{ticket.customer}</TableCell>
                              <TableCell>
                                {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityBadgeStyle(ticket.priority)}>
                                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{ticket.timestamp.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTicket(ticket.id);
                                  }}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredTickets.filter(t => t.status === 'open').length === 0 && (
                            <TableRow className="border-slate-800">
                              <TableCell colSpan={6} className="text-center py-4">
                                No open tickets found
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="in_progress" className="mt-0">
                  <div className="rounded-md border border-slate-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-800/50">
                          <TableHead className="text-slate-400">Ticket</TableHead>
                          <TableHead className="text-slate-400">Customer</TableHead>
                          <TableHead className="text-slate-400">Category</TableHead>
                          <TableHead className="text-slate-400">Priority</TableHead>
                          <TableHead className="text-slate-400">Created</TableHead>
                          <TableHead className="text-slate-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets
                          .filter(t => t.status === 'in_progress')
                          .map((ticket) => (
                            <TableRow 
                              key={ticket.id}
                              className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                              onClick={() => setSelectedTicket(ticket.id)}
                            >
                              <TableCell className="font-medium flex items-center">
                                {getChannelIcon(ticket.channel)}
                                <span className="ml-2">{ticket.subject}</span>
                              </TableCell>
                              <TableCell>{ticket.customer}</TableCell>
                              <TableCell>
                                {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityBadgeStyle(ticket.priority)}>
                                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{ticket.timestamp.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTicket(ticket.id);
                                  }}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredTickets.filter(t => t.status === 'in_progress').length === 0 && (
                            <TableRow className="border-slate-800">
                              <TableCell colSpan={6} className="text-center py-4">
                                No in-progress tickets found
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="resolved" className="mt-0">
                  <div className="rounded-md border border-slate-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-slate-800/50">
                          <TableHead className="text-slate-400">Ticket</TableHead>
                          <TableHead className="text-slate-400">Customer</TableHead>
                          <TableHead className="text-slate-400">Category</TableHead>
                          <TableHead className="text-slate-400">Priority</TableHead>
                          <TableHead className="text-slate-400">Created</TableHead>
                          <TableHead className="text-slate-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets
                          .filter(t => t.status === 'resolved')
                          .map((ticket) => (
                            <TableRow 
                              key={ticket.id}
                              className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                              onClick={() => setSelectedTicket(ticket.id)}
                            >
                              <TableCell className="font-medium flex items-center">
                                {getChannelIcon(ticket.channel)}
                                <span className="ml-2">{ticket.subject}</span>
                              </TableCell>
                              <TableCell>{ticket.customer}</TableCell>
                              <TableCell>
                                {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityBadgeStyle(ticket.priority)}>
                                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{ticket.timestamp.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTicket(ticket.id);
                                  }}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredTickets.filter(t => t.status === 'resolved').length === 0 && (
                            <TableRow className="border-slate-800">
                              <TableCell colSpan={6} className="text-center py-4">
                                No resolved tickets found
                              </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
