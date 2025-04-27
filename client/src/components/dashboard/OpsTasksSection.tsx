import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn, formatDateRelative } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { Skeleton } from "@/components/ui/skeleton";
import type { OpsTask } from "@/types";

interface OpsTasksSectionProps {
  className?: string;
}

export function OpsTasksSection({ className }: OpsTasksSectionProps) {
  const { currentBrand } = useBrand();
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/ops-tasks', currentBrand?.id],
    enabled: !!currentBrand?.id,
  });

  // Group tasks by status
  const groupedTasks = tasks.reduce((acc: Record<string, OpsTask[]>, task: OpsTask) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getCategoryBadge = (category: string): { bg: string; text: string } => {
    switch (category) {
      case 'marketing':
        return { bg: 'bg-purple-500 bg-opacity-20', text: 'text-purple-500' };
      case 'support':
        return { bg: 'bg-blue-500 bg-opacity-20', text: 'text-blue-500' };
      case 'product':
        return { bg: 'bg-green-500 bg-opacity-20', text: 'text-green-500' };
      case 'operations':
        return { bg: 'bg-yellow-500 bg-opacity-20', text: 'text-yellow-500' };
      default:
        return { bg: 'bg-slate-500 bg-opacity-20', text: 'text-slate-500' };
    }
  };

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const renderTaskDueDate = (task: OpsTask) => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isToday = dueDate.getTime() === today.getTime();
    const isPast = dueDate < today;
    
    if (task.status === 'done') {
      return (
        <div className="mt-3 flex items-center text-sm text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completed {formatDateRelative(dueDate)}
        </div>
      );
    }
    
    if (isToday) {
      return (
        <div className="mt-3 flex items-center text-sm text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Due today
        </div>
      );
    }
    
    if (isPast) {
      return (
        <div className="mt-3 flex items-center text-sm text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Overdue ({formatDateRelative(dueDate)})
        </div>
      );
    }
    
    return (
      <div className="mt-3 flex items-center text-sm text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Due {formatDateRelative(dueDate)}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Operations Tasks</h2>
        <Button className="inline-flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </div>
      <Card className="bg-slate-900 rounded-lg shadow overflow-hidden border-slate-800">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, columnIndex) => (
                <div key={columnIndex}>
                  <Skeleton className="h-7 w-32 mb-3" />
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, taskIndex) => (
                      <div key={taskIndex} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full mt-2" />
                        <Skeleton className="h-4 w-32 mt-3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* To Do column */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor('todo')} mr-2`}></span>
                  {formatStatus('todo')} <span className="ml-2 text-sm text-slate-400">({(groupedTasks.todo || []).length})</span>
                </h3>
                <div className="space-y-3">
                  {(groupedTasks.todo || []).map((task: OpsTask) => {
                    const categoryStyle = getCategoryBadge(task.category);
                    return (
                      <div key={task.id} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">{task.title}</h4>
                          <span className={`${categoryStyle.bg} ${categoryStyle.text} text-xs px-2 py-1 rounded-full font-medium`}>
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">{task.description}</p>
                        {renderTaskDueDate(task)}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* In Progress column */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor('in_progress')} mr-2`}></span>
                  {formatStatus('in_progress')} <span className="ml-2 text-sm text-slate-400">({(groupedTasks.in_progress || []).length})</span>
                </h3>
                <div className="space-y-3">
                  {(groupedTasks.in_progress || []).map((task: OpsTask) => {
                    const categoryStyle = getCategoryBadge(task.category);
                    return (
                      <div key={task.id} className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">{task.title}</h4>
                          <span className={`${categoryStyle.bg} ${categoryStyle.text} text-xs px-2 py-1 rounded-full font-medium`}>
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">{task.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-sm text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {task.dueDate ? formatDateRelative(new Date(task.dueDate)) : 'No deadline'}
                          </div>
                          <div className="text-sm text-slate-400">{task.progress}% complete</div>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Done column */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor('done')} mr-2`}></span>
                  {formatStatus('done')} <span className="ml-2 text-sm text-slate-400">({(groupedTasks.done || []).length})</span>
                </h3>
                <div className="space-y-3">
                  {(groupedTasks.done || []).map((task: OpsTask) => {
                    const categoryStyle = getCategoryBadge(task.category);
                    return (
                      <div key={task.id} className="bg-slate-800 p-4 rounded-lg opacity-75">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">{task.title}</h4>
                          <span className={`${categoryStyle.bg} ${categoryStyle.text} text-xs px-2 py-1 rounded-full font-medium`}>
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">{task.description}</p>
                        <div className="mt-3 flex items-center text-sm text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : 'recently'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
