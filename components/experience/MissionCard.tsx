"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface MissionCardProps {
  title: string;
  objective: string;
}

export function MissionCard({ title, objective }: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 to-amber-500/2 p-4 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/15">
          <Target className="h-4 w-4 text-amber-400" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
              Mission
            </span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{objective}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default MissionCard;
