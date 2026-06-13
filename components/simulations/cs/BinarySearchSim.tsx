"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { SimulationComponentProps } from "@/components/simulations/SimulationRegistry";
import {
  getBinarySearchStepCaption,
  isIndexEliminated,
  isIndexInActiveRange,
} from "@/lib/simulations/binary-search";
import type { BinarySearchConfig } from "@/lib/types";

const BAR_MAX_HEIGHT = 140;
const BAR_MIN_HEIGHT = 28;

function PointerBadge({
  label,
  color,
}: {
  label: string;
  color: "sky" | "emerald" | "violet";
}) {
  const colors = {
    sky: "bg-sky-500/20 text-sky-300 border-sky-500/50",
    emerald: "bg-emerald-500/25 text-emerald-300 border-emerald-500/60",
    violet: "bg-violet-500/20 text-violet-300 border-violet-500/50",
  };

  return (
    <motion.span
      layout
      initial={{ opacity: 0, y: 6, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${colors[color]}`}
    >
      {label}
    </motion.span>
  );
}

export function BinarySearchSim({
  config,
  currentStep,
}: SimulationComponentProps) {
  const { sortedArray, target, steps } = config as BinarySearchConfig;
  const safeStep = Math.min(currentStep, steps.length - 1);
  const step = steps[safeStep];
  const maxValue = Math.max(...sortedArray);

  const caption = getBinarySearchStepCaption(
    step,
    target,
    safeStep,
    steps.length
  );

  return (
    <div className="flex h-full min-h-[320px] flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Searching for{" "}
          <span className="font-mono text-base font-semibold text-emerald-400">
            {target}
          </span>
        </p>
        <p className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
          Active range: [{step.low}, {step.high}]
        </p>
      </div>

      <div className="relative flex flex-1 flex-col justify-end">
        <div className="flex items-end justify-center gap-1.5 sm:gap-2.5">
          {sortedArray.map((value, index) => {
            const barHeight =
              BAR_MIN_HEIGHT +
              (value / maxValue) * (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT);
            const eliminated = isIndexEliminated(index, step);
            const inRange = isIndexInActiveRange(index, step);
            const isMid = index === step.mid;
            const isFound = step.comparison === "found" && isMid;
            const isLow = index === step.low;
            const isHigh = index === step.high;

            return (
              <div
                key={`${value}-${index}`}
                className="flex flex-col items-center gap-1.5"
              >
                <motion.div
                  layout
                  animate={{
                    height: barHeight,
                    opacity: eliminated ? 0.22 : 1,
                    filter: eliminated ? "grayscale(0.85)" : "grayscale(0)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative flex w-9 items-end justify-center sm:w-11"
                >
                  {eliminated && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-lg bg-zinc-950/40"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255,255,255,0.04) 4px, rgba(255,255,255,0.04) 8px)",
                      }}
                    />
                  )}

                  <motion.div
                    layout
                    animate={{
                      scale: isMid ? 1.06 : 1,
                      boxShadow: isFound
                        ? "0 0 28px -4px rgba(52, 211, 153, 0.85)"
                        : isMid
                          ? "0 0 22px -6px rgba(52, 211, 153, 0.55)"
                          : "0 0 0px transparent",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className={`relative flex w-full items-center justify-center rounded-lg border font-mono text-sm font-medium sm:text-base ${
                      isFound
                        ? "border-emerald-400 bg-emerald-500/35 text-emerald-100"
                        : isMid
                          ? "border-emerald-500 bg-emerald-500/25 text-emerald-200"
                          : inRange
                            ? "border-border bg-secondary text-foreground"
                            : "border-border/40 bg-secondary/30 text-muted-foreground"
                    }`}
                    style={{ height: barHeight }}
                  >
                    {value}
                  </motion.div>

                  {isMid && !isFound && (
                    <motion.div
                      className="pointer-events-none absolute -inset-1 rounded-xl border-2 border-emerald-400/40"
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <div className="flex h-7 items-center justify-center gap-0.5">
                  <AnimatePresence mode="popLayout">
                    {isLow && <PointerBadge key="l" label="L" color="sky" />}
                    {isMid && <PointerBadge key="m" label="M" color="emerald" />}
                    {isHigh && <PointerBadge key="h" label="H" color="violet" />}
                  </AnimatePresence>
                </div>

                <span
                  className={`font-mono text-[10px] sm:text-xs ${
                    isMid ? "font-semibold text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {index}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={safeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
            step.comparison === "found"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
              : "border-border/70 bg-secondary/30 text-foreground/90"
          }`}
        >
          {caption}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
