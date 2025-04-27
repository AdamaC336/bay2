import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  // In a real application, this would be fetched from an authentication context
  const user = {
    name: "John Doe",
    role: "Admin",
    initials: "JD",
  };

  return (
    <div className={cn("border-t border-slate-800 p-4", className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
            {user.initials}
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs font-medium text-slate-400">{user.role}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto flex-shrink-0 p-1 rounded-full text-slate-400 hover:text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
