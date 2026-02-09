"use client";

import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionTooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

export const ActionTooltip = ({
  label,
  children,
  side = "right",
  align = "center",
  delayDuration = 50,
}: ActionTooltipProps) => {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        <span className="inline-flex">{children}</span>
      </TooltipTrigger>

      <TooltipContent side={side} align={align} className="bg-green-500 text-white border-none">
        <p className="font-semibold text-sm capitalize">
          {label.toLowerCase()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
