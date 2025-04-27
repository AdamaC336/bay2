import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useBrand } from "@/providers/BrandProvider";
import { Skeleton } from "@/components/ui/skeleton";
import type { AIAgent } from "@/types";

interface AIAgentsSectionProps {
  className?: string;
}

export function AIAgentsSection({ className }: AIAgentsSectionProps) {
  const { currentBrand } = useBrand();
  
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/ai-agents', currentBrand?.id],
    enabled: !!currentBrand?.id,
  });

  const renderAgentIcon = (type: string) => {
    switch (type) {
      case 'support':
        return (
          <svg
            className="h-6 w-6 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'content':
        return (
          <svg
            className="h-6 w-6 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      case 'ads':
        return (
          <svg
            className="h-6 w-6 text-red-500"
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
        );
      default:
        return (
          <svg
            className="h-6 w-6 text-purple-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  const getIconBgColor = (type: string): string => {
    switch (type) {
      case 'support':
        return 'bg-green-500 bg-opacity-20';
      case 'content':
        return 'bg-blue-500 bg-opacity-20';
      case 'ads':
        return 'bg-red-500 bg-opacity-20';
      default:
        return 'bg-purple-500 bg-opacity-20';
    }
  };

  const renderAgentStatus = (status: string) => {
    if (status === 'active') {
      return (
        <div className="flex items-center mt-1">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="ml-1.5 text-sm text-slate-400">Active</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center mt-1">
          <span className="inline-flex rounded-full h-3 w-3 bg-slate-500"></span>
          <span className="ml-1.5 text-sm text-slate-400">Paused</span>
        </div>
      );
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">AI Agents Status</h2>
        <Button className="inline-flex items-center">
          <Plus className="h-4 w-4 mr-1" />
          New Agent
        </Button>
      </div>
      <Card className="bg-slate-900 rounded-lg shadow overflow-hidden border-slate-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="ml-4">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20 mt-1" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-5 w-16 mt-1 ml-auto" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-700 pt-4">
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-8 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-12 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-10 mt-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              agents.map((agent: AIAgent) => (
                <div key={agent.id} className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center",
                          getIconBgColor(agent.type)
                        )}
                      >
                        {renderAgentIcon(agent.type)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          {agent.name}
                        </h3>
                        {renderAgentStatus(agent.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Today's cost</p>
                      <p className="text-lg font-medium text-white">
                        {formatCurrency(agent.cost)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-700 pt-4">
                    {agent.metrics && Object.entries(agent.metrics).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-slate-400">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                        <p className="text-lg font-medium text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
