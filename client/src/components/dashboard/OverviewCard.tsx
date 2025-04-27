import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

interface OverviewCardProps {
  title: string;
  value: string;
  change: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconColor: "blue" | "purple" | "green" | "yellow" | "red";
  href?: string;
}

export function OverviewCard({
  title,
  value,
  change,
  icon,
  iconColor,
  href = "#",
}: OverviewCardProps) {
  const getIconBgColor = (color: string): string => {
    switch (color) {
      case "blue":
        return "bg-blue-500 bg-opacity-20";
      case "purple":
        return "bg-purple-500 bg-opacity-20";
      case "green":
        return "bg-green-500 bg-opacity-20";
      case "yellow":
        return "bg-yellow-500 bg-opacity-20";
      case "red":
        return "bg-red-500 bg-opacity-20";
      default:
        return "bg-blue-500 bg-opacity-20";
    }
  };

  const getIconTextColor = (color: string): string => {
    switch (color) {
      case "blue":
        return "text-blue-500";
      case "purple":
        return "text-purple-500";
      case "green":
        return "text-green-500";
      case "yellow":
        return "text-yellow-500";
      case "red":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <Card className="bg-slate-900 rounded-lg shadow overflow-hidden border-slate-800">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center">
            <div
              className={cn(
                "flex-shrink-0 rounded-md p-3",
                getIconBgColor(iconColor)
              )}
            >
              <div className={cn("h-6 w-6", getIconTextColor(iconColor))}>
                {icon}
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-400 truncate">
                  {title}
                </dt>
                <dd>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-semibold text-white">
                      {value}
                    </div>
                    <div
                      className={cn(
                        "ml-2 flex items-center text-sm font-medium",
                        change.isPositive ? "text-green-500" : "text-red-500"
                      )}
                    >
                      <svg
                        className={cn(
                          "self-center flex-shrink-0 h-5 w-5",
                          change.isPositive ? "text-green-500" : "text-red-500"
                        )}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d={
                            change.isPositive
                              ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                              : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          }
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="sr-only">
                        {change.isPositive ? "Increased by" : "Decreased by"}
                      </span>
                      {Math.abs(change.value).toFixed(1)}%
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 px-5 py-3">
          <div className="text-sm">
            <Link
              href={href}
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              View details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
