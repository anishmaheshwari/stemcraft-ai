"use client";

import { motion } from "framer-motion";
import type { SimulationComponentProps } from "@/components/simulations/SimulationRegistry";
import type { DnsResolutionConfig } from "@/lib/types";

const NODES = [
  { id: "browser", label: "Browser" },
  { id: "resolver", label: "Resolver" },
  { id: "root", label: "Root DNS" },
  { id: "tld", label: "TLD" },
  { id: "authoritative", label: "Authoritative" },
] as const;

export function DnsResolutionSim({
  config,
  currentStep,
}: SimulationComponentProps) {
  const { domain, resolvedIp, steps } = config as DnsResolutionConfig;
  const step = steps[Math.min(currentStep, steps.length - 1)];
  const activeNodes = new Set([step?.from, step?.to].filter(Boolean));

  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-6 p-4">
      <p className="text-sm text-muted-foreground">
        Resolving{" "}
        <span className="font-mono text-violet-300">{domain}</span>
        {currentStep >= steps.length - 1 && (
          <span className="text-foreground">
            {" "}
            → <span className="font-mono">{resolvedIp}</span>
          </span>
        )}
      </p>
      <div className="flex w-full max-w-lg flex-wrap items-center justify-center gap-2 sm:gap-3">
        {NODES.map((node, index) => {
          const isActive = activeNodes.has(node.id);
          return (
            <div key={node.id} className="flex items-center gap-2 sm:gap-3">
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  boxShadow: isActive
                    ? "0 0 24px -4px rgba(139, 92, 246, 0.5)"
                    : "0 0 0px transparent",
                }}
                className={`rounded-xl border px-3 py-2 text-xs font-medium sm:text-sm ${
                  isActive
                    ? "border-violet-500/60 bg-violet-500/15 text-violet-200"
                    : "border-border bg-secondary/60 text-muted-foreground"
                }`}
              >
                {node.label}
              </motion.div>
              {index < NODES.length - 1 && (
                <span className="text-muted-foreground">→</span>
              )}
            </div>
          );
        })}
      </div>
      {step && (
        <motion.p
          key={step.stepNumber}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center text-sm text-muted-foreground"
        >
          {step.query}
        </motion.p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Simulation placeholder — packet animation on Day 5
      </p>
    </div>
  );
}
