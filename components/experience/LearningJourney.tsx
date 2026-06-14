"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Play, HelpCircle, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "understand", label: "Understand", icon: BookOpen },
  { id: "visualize",  label: "Visualize",  icon: Play },
  { id: "practice",   label: "Practice",   icon: HelpCircle },
  { id: "challenge",  label: "Challenge",  icon: Zap },
  { id: "master",     label: "Master",     icon: Trophy },
];

interface LearningJourneyProps {
  activeStage: "understand" | "visualize" | "practice" | "challenge" | "master";
}

export function LearningJourney({ activeStage }: LearningJourneyProps) {
  const activeIdx = STAGES.findIndex((s) => s.id === activeStage);

  return (
    <div className="rounded-2xl border border-white/8 bg-secondary/20 px-5 py-3.5 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Learning Journey
        </p>
        <span className="text-[10px] text-muted-foreground/50">
          Stage {activeIdx + 1} of {STAGES.length}
        </span>
      </div>

      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStage;
          const isDone = i < activeIdx;
          const isPending = i > activeIdx;

          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              {/* Stage node */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.1, 1], boxShadow: ["0 0 0px hsl(160 84% 39% / 0)", "0 0 16px hsl(160 84% 39% / 0.5)", "0 0 8px hsl(160 84% 39% / 0.3)"] }
                        : {}
                    }
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-400",
                      isActive   && "border-primary bg-primary/20 text-primary",
                      isDone     && "border-primary/40 bg-primary/10 text-primary/60",
                      isPending  && "border-white/10 bg-white/3 text-muted-foreground/30"
                    )}
                  >
                    {isDone ? (
                      <motion.span
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-sm font-bold text-primary/70"
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </motion.div>

                  {/* Active pulse dot */}
                  {isActive && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary shadow-[0_0_6px_hsl(160_84%_39%_/_0.8)]" />
                    </span>
                  )}
                </div>

                <span
                  className={cn(
                    "text-[9px] font-semibold whitespace-nowrap transition-colors duration-300",
                    isActive ? "text-primary" : isDone ? "text-primary/45" : "text-muted-foreground/25"
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connecting path */}
              {i < STAGES.length - 1 && (
                <div className="relative mx-1.5 flex-1 h-0.5 min-w-[16px] overflow-hidden rounded-full bg-white/6">
                  {/* Static done fill */}
                  {i < activeIdx && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                      className="absolute inset-0 origin-left rounded-full bg-primary/60 journey-path-glow"
                    />
                  )}
                  {/* Energy travel on active connector */}
                  {i === activeIdx - 1 && (
                    <motion.div
                      className="absolute top-0 h-full w-4 rounded-full"
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
                      style={{ background: "linear-gradient(90deg, transparent, hsl(160 84% 39% / 0.9), transparent)" }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
