"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label = "XP" }: ProgressBarProps) {
  const isComplete = value >= 100;

  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-1.5 sm:max-w-[200px]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <motion.span
          key={value}
          initial={{ scale: 1.2, color: "hsl(160 84% 60%)" }}
          animate={{ scale: 1, color: "hsl(160 84% 39%)" }}
          transition={{ duration: 0.4 }}
          className="font-semibold tabular-nums text-primary"
        >
          {value}%
          {isComplete && " 🎉"}
        </motion.span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            isComplete ? "bg-gradient-to-r from-primary via-emerald-400 to-sky-400" : "xp-bar"
          )}
        />
        {/* Shimmer on the bar */}
        {!isComplete && value > 0 && (
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            className="absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ left: 0, width: `${value}%` }}
          />
        )}
      </div>
    </div>
  );
}
