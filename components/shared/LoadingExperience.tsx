"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Layers, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const STAGES = [
  { label: "Analyzing topic", icon: Brain },
  { label: "Building simulation", icon: Layers },
  { label: "Crafting quiz", icon: Activity },
  { label: "Personalizing lesson", icon: Zap },
];

const STEP_MESSAGES = [
  "Analyzing your STEM topic...",
  "Building interactive simulation...",
  "Crafting quiz questions...",
  "Generating visual learning cards...",
  "Personalizing your lesson...",
];

export function LoadingExperience() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStage((s) => (s + 1) % STAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-4 py-8"
    >
      {/* ── Central AI orb + rings ── */}
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">

          {/* Ambient glow behind orb */}
          <div
            className="absolute h-48 w-48 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, hsl(160 84% 39%), hsl(199 89% 48%) 60%, transparent)" }}
          />

          {/* Outer pulsing halo */}
          <motion.div
            className="absolute h-36 w-36 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-28 w-28 rounded-full border border-sky-500/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.06, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />

          {/* 3-ring orbit spinner */}
          <div className="orbit-container h-24 w-24">
            <div className="orbit-ring" />
            <div className="orbit-ring-2" />
            <div className="orbit-ring-3" />
            <div className="orbit-core" />
          </div>

          {/* AI badge */}
          <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/20 backdrop-blur-sm shadow-[0_0_12px_hsl(160_84%_39%_/_0.4)]">
            <span className="text-[10px] font-bold text-primary">AI</span>
          </div>
        </div>

        {/* ── Stage indicators ── */}
        <div className="flex items-center gap-3">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const isActive = i === activeStage;
            const isDone = i < activeStage;
            return (
              <motion.div
                key={stage.label}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-500"
                  style={
                    isActive
                      ? {
                          borderColor: "hsl(160 84% 39% / 0.6)",
                          background: "hsl(160 84% 39% / 0.15)",
                          boxShadow: "0 0 16px hsl(160 84% 39% / 0.3)",
                          color: "hsl(160 84% 39%)",
                        }
                      : isDone
                      ? {
                          borderColor: "hsl(160 84% 39% / 0.25)",
                          background: "hsl(160 84% 39% / 0.08)",
                          color: "hsl(160 84% 39% / 0.5)",
                        }
                      : {
                          borderColor: "hsl(0 0% 100% / 0.08)",
                          background: "transparent",
                          color: "hsl(240 5% 45%)",
                        }
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className="text-[9px] font-medium whitespace-nowrap transition-colors duration-300"
                  style={{ color: isActive ? "hsl(160 84% 39%)" : "hsl(240 5% 45%)" }}
                >
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* ── AI flowing progress line ── */}
        <div className="w-64 overflow-hidden rounded-full">
          <div className="ai-flow-line rounded-full" style={{ height: 2 }} />
        </div>

        {/* ── Text ── */}
        <div className="space-y-2 text-center">
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="text-base font-semibold text-foreground"
          >
            AI is crafting your personalized lesson
          </motion.p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <p className="text-sm text-muted-foreground">
            Powered by Gemini 2.5 Flash · Usually ready in ~15 seconds
          </p>
        </div>
      </div>

      {/* ── Skeleton preview ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-4xl space-y-4"
      >
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="shimmer h-72 rounded-2xl" />
          </div>
          <div className="lg:col-span-2 space-y-3">
            <div className="shimmer h-24 rounded-2xl" />
            <div className="shimmer h-40 rounded-2xl" />
          </div>
        </div>
        <div className="shimmer h-36 rounded-2xl" />
      </motion.div>
    </motion.div>
  );
}
