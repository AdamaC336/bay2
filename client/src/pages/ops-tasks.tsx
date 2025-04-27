import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useBrand } from "@/providers/BrandProvider";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateRelative } from "@/lib/utils";
import { OpsTasksSection } from "@/components/dashboard/OpsTasksSection";

export default function OpsTasks() {
  const { currentBrand } = useBrand();
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/ops-tasks', currentBrand?.id],
    enabled: !!currentBrand?.id,
  });
  
  // Task metrics
  const taskMetrics = {
    total: Array.isArray(tasks) ? tasks.length : 0,
    todo: Array.isArray(tasks) ? tasks.filter((task: any) => task.status === 'todo').length : 0,
    inProgress: Array.isArray(tasks) ? tasks.filter((task: any) => task.status === 'in_progress').length : 0,
    done: Array.isArray(tasks) ? tasks.filter((task: any) => task.status === 'done').length : 0,
    overdue: Array.isArray(tasks) ? tasks.filter((task: any) => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'done';
    }).length : 0
  };

  return (
    <div>
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mt-2 md:mt-0">Operations Tasks</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>
      
      {/* Task Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-slate-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">Total Tasks</p>
                <h3 className="text-2xl font-bold">{taskMetrics.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">To Do</p>
                <h3 className="text-2xl font-bold">{taskMetrics.todo}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">In Progress</p>
                <h3 className="text-2xl font-bold">{taskMetrics.inProgress}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">Completed</p>
                <h3 className="text-2xl font-bold">{taskMetrics.done}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500 bg-opacity-20">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-400">Overdue</p>
                <h3 className="text-2xl font-bold">{taskMetrics.overdue}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task Board (reusing OpsTasksSection from dashboard) */}
      <OpsTasksSection />
      
      {/* Coming Soon Message */}
      <Card className="bg-purple-900 bg-opacity-30 border-purple-700 mt-8">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="mr-4 p-3 bg-purple-500 bg-opacity-20 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Task Automation Coming Soon</h3>
              <p className="text-purple-200 mt-1">Our AI engine will soon be able to automatically generate and prioritize tasks based on business performance metrics.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}