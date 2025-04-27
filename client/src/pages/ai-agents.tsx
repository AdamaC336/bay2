import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Play, 
  Pause, 
  Clock, 
  PieChart, 
  Activity, 
  BarChart3, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { AIAgent } from "@/types";

export default function AIAgents() {
  const { currentBrand } = useBrand();
  const queryClient = useQueryClient();
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);
  const [newAgentData, setNewAgentData] = useState({
    name: "",
    type: "",
    status: "active",
    metrics: {},
  });
  
  // Fetch AI agents
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/ai-agents', currentBrand?.id],
    enabled: !!currentBrand?.id,
  });
  
  // Create new agent mutation
  const createAgentMutation = useMutation({
    mutationFn: async (agentData: any) => {
      const data = {
        ...agentData,
        brandId: currentBrand?.id,
      };
      return await apiRequest('POST', '/api/ai-agents', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-agents', currentBrand?.id] });
      setIsNewAgentDialogOpen(false);
      setNewAgentData({
        name: "",
        type: "",
        status: "active",
        metrics: {},
      });
    },
  });
  
  // Update agent status mutation
  const updateAgentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest('PATCH', `/api/ai-agents/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-agents', currentBrand?.id] });
    },
  });
  
  const handleCreateAgent = () => {
    // Initialize default metrics based on agent type
    let metrics = {};
    
    switch (newAgentData.type) {
      case 'support':
        metrics = { conversations: 0, avgResponse: "0s", satisfaction: "0%" };
        break;
      case 'content':
        metrics = { articles: 0, tokens: "0", quality: "0/10" };
        break;
      case 'ads':
        metrics = { optimizations: 0, adSets: 0, roasImpact: "0%" };
        break;
      default:
        metrics = {};
    }
    
    createAgentMutation.mutate({
      ...newAgentData,
      metrics,
    });
  };
  
  const toggleAgentStatus = (agent: AIAgent) => {
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    updateAgentStatusMutation.mutate({ id: agent.id, status: newStatus });
  };
  
  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'support':
        return <Activity className="h-5 w-5" />;
      case 'content':
        return <PieChart className="h-5 w-5" />;
      case 'ads':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getAgentTypeColor = (type: string): string => {
    switch (type) {
      case 'support':
        return 'bg-green-500 text-green-50';
      case 'content':
        return 'bg-blue-500 text-blue-50';
      case 'ads':
        return 'bg-red-500 text-red-50';
      default:
        return 'bg-slate-500 text-slate-50';
    }
  };
  
  // Group agents by status for the dashboard view
  const activeAgents = agents.filter((agent: AIAgent) => agent.status === 'active');
  const pausedAgents = agents.filter((agent: AIAgent) => agent.status === 'paused');
  const totalAgentCost = agents.reduce((sum: number, agent: AIAgent) => sum + agent.cost, 0);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <Button onClick={() => setIsNewAgentDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>
      
      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">Active Agents</p>
                <h3 className="text-2xl font-bold">{activeAgents.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-full">
                <Pause className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">Paused Agents</p>
                <h3 className="text-2xl font-bold">{pausedAgents.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">Today's Cost</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalAgentCost)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Agents List */}
      <Tabs defaultValue="all" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Manage Agents</h2>
          <TabsList className="bg-slate-800">
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="ml-4">
                            <Skeleton className="h-5 w-40 mb-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-9 w-24 rounded-md" />
                      </div>
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <Skeleton className="h-16 rounded-md" />
                        <Skeleton className="h-16 rounded-md" />
                        <Skeleton className="h-16 rounded-md" />
                        <Skeleton className="h-16 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No AI agents found</h3>
                  <p className="text-slate-400 mb-4">Create your first AI agent to automate tasks and improve efficiency.</p>
                  <Button onClick={() => setIsNewAgentDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agent
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent: AIAgent) => (
                    <div key={agent.id} className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-full bg-opacity-20 ${agent.type === 'support' ? 'bg-green-500' : agent.type === 'content' ? 'bg-blue-500' : 'bg-red-500'}`}>
                            {getAgentTypeIcon(agent.type)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">{agent.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className={getAgentTypeColor(agent.type)}>
                                {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                              </Badge>
                              <span className={`ml-2 inline-flex items-center h-2 w-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                              <span className="ml-1 text-sm text-slate-400">
                                {agent.status === 'active' ? 'Active' : 'Paused'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={agent.status === 'active' ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => toggleAgentStatus(agent)}
                        >
                          {agent.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900 p-3 rounded-md">
                          <p className="text-sm text-slate-400">Today's Cost</p>
                          <h4 className="text-xl font-medium mt-1">{formatCurrency(agent.cost)}</h4>
                        </div>
                        
                        {agent.metrics && Object.entries(agent.metrics).map(([key, value], idx) => (
                          <div key={idx} className="bg-slate-900 p-3 rounded-md">
                            <p className="text-sm text-slate-400">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            <h4 className="text-xl font-medium mt-1">{value}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              {!isLoading && activeAgents.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active agents</h3>
                  <p className="text-slate-400 mb-4">Activate an existing agent or create a new one.</p>
                  <Button onClick={() => setIsNewAgentDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agent
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAgents.map((agent: AIAgent) => (
                    <div key={agent.id} className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-full bg-opacity-20 ${agent.type === 'support' ? 'bg-green-500' : agent.type === 'content' ? 'bg-blue-500' : 'bg-red-500'}`}>
                            {getAgentTypeIcon(agent.type)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">{agent.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className={getAgentTypeColor(agent.type)}>
                                {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                              </Badge>
                              <span className="ml-2 inline-flex items-center h-2 w-2 rounded-full bg-green-500"></span>
                              <span className="ml-1 text-sm text-slate-400">Active</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => toggleAgentStatus(agent)}
                        >
                          <Pause className="h-4 w-4 mr-1" /> Pause
                        </Button>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900 p-3 rounded-md">
                          <p className="text-sm text-slate-400">Today's Cost</p>
                          <h4 className="text-xl font-medium mt-1">{formatCurrency(agent.cost)}</h4>
                        </div>
                        
                        {agent.metrics && Object.entries(agent.metrics).map(([key, value], idx) => (
                          <div key={idx} className="bg-slate-900 p-3 rounded-md">
                            <p className="text-sm text-slate-400">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            <h4 className="text-xl font-medium mt-1">{value}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="paused" className="mt-0">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              {!isLoading && pausedAgents.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">All agents are active</h3>
                  <p className="text-slate-400">There are no paused agents at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pausedAgents.map((agent: AIAgent) => (
                    <div key={agent.id} className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-full bg-opacity-20 ${agent.type === 'support' ? 'bg-green-500' : agent.type === 'content' ? 'bg-blue-500' : 'bg-red-500'}`}>
                            {getAgentTypeIcon(agent.type)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-white">{agent.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className={getAgentTypeColor(agent.type)}>
                                {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                              </Badge>
                              <span className="ml-2 inline-flex items-center h-2 w-2 rounded-full bg-slate-500"></span>
                              <span className="ml-1 text-sm text-slate-400">Paused</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => toggleAgentStatus(agent)}
                        >
                          <Play className="h-4 w-4 mr-1" /> Activate
                        </Button>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900 p-3 rounded-md">
                          <p className="text-sm text-slate-400">Today's Cost</p>
                          <h4 className="text-xl font-medium mt-1">{formatCurrency(agent.cost)}</h4>
                        </div>
                        
                        {agent.metrics && Object.entries(agent.metrics).map(([key, value], idx) => (
                          <div key={idx} className="bg-slate-900 p-3 rounded-md">
                            <p className="text-sm text-slate-400">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                            <h4 className="text-xl font-medium mt-1">{value}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Agent Dialog */}
      <Dialog open={isNewAgentDialogOpen} onOpenChange={setIsNewAgentDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle>Create New AI Agent</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                placeholder="e.g., Customer Support Assistant"
                value={newAgentData.name}
                onChange={(e) => setNewAgentData({ ...newAgentData, name: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Agent Type</Label>
              <Select
                value={newAgentData.type}
                onValueChange={(value) => setNewAgentData({ ...newAgentData, type: value })}
              >
                <SelectTrigger id="type" className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="ads">Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={newAgentData.status}
                onValueChange={(value) => setNewAgentData({ ...newAgentData, status: value })}
              >
                <SelectTrigger id="status" className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAgentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAgent}
              disabled={createAgentMutation.isPending || !newAgentData.name || !newAgentData.type}
            >
              {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
