import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn, formatCurrency } from "@/lib/utils";

interface TimeRange {
  value: 'day' | 'week' | 'month' | 'year';
  label: string;
}

const timeRanges: TimeRange[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

interface RevenueChartProps {
  data: {
    name: string;
    revenue: number;
    adSpend: number;
  }[];
  className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(timeRanges[1]); // Default to week

  return (
    <Card className={cn("bg-slate-900 rounded-lg shadow overflow-hidden border-slate-800", className)}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h2 className="text-xl font-semibold text-white">Revenue & Ad Spend</h2>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={range.value === timeRange.value ? "default" : "outline"}
              className={
                range.value === timeRange.value
                  ? ""
                  : "border-slate-700 text-white bg-slate-800 hover:bg-slate-700"
              }
              onClick={() => setTimeRange(range)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
      <CardContent className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                formatter={(value) => [`${formatCurrency(value as number)}`, '']}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ r: 4, fill: '#3b82f6' }}
              />
              <Line
                type="monotone"
                dataKey="adSpend"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
