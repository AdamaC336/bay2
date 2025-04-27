import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useBrand } from "@/providers/BrandProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BrandSelectorProps {
  className?: string;
}

export function BrandSelector({ className }: BrandSelectorProps) {
  const { currentBrand, brands, setCurrentBrand, isLoading } = useBrand();
  const [open, setOpen] = useState(false);

  if (isLoading || !currentBrand) {
    return (
      <div className={cn("px-4 py-4 border-b border-slate-800", className)}>
        <div className="h-9 bg-slate-800 rounded-md animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={cn("px-4 py-4 border-b border-slate-800", className)}>
      <div className="relative">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 focus:outline-none border-slate-700"
            >
              <div className="flex items-center">
                <span className="h-6 w-6 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-xs mr-2">
                  {currentBrand.code}
                </span>
                <span>{currentBrand.name}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 bg-slate-800 border border-slate-700 text-slate-100"
          >
            {brands.map((brand) => (
              <DropdownMenuItem
                key={brand.id}
                className={cn(
                  "flex items-center py-2 cursor-pointer",
                  currentBrand.id === brand.id && "bg-slate-700"
                )}
                onClick={() => {
                  setCurrentBrand(brand);
                  setOpen(false);
                }}
              >
                <span className="h-6 w-6 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-xs mr-2">
                  {brand.code}
                </span>
                <span>{brand.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
