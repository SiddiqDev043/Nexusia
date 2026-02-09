"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-border bg-background/60 backdrop-blur p-6 shadow-lg",
          "animate-fade-up",
          className
        )}
      >
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
