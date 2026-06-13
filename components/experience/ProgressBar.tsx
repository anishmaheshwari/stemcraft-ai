"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label = "Progress" }: ProgressBarProps) {
  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-1 sm:max-w-[200px]">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}
