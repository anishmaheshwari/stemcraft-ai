"use client";

import type { SimulationComponentProps } from "@/components/simulations/SimulationRegistry";
import type { ProjectileMotionConfig } from "@/lib/types";

export function ProjectileMotionSim({
  config,
}: SimulationComponentProps) {
  const { velocity, angle, gravity } = config as ProjectileMotionConfig;

  return (
    <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-4 p-4">
      <div className="flex h-40 w-full max-w-md items-end justify-center rounded-2xl border border-border bg-secondary/30">
        <svg viewBox="0 0 300 120" className="h-full w-full px-4">
          <path
            d="M 20 100 Q 150 20 280 100"
            fill="none"
            stroke="hsl(199 89% 48%)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <circle cx="20" cy="100" r="6" fill="hsl(199 89% 48%)" />
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <span>
          v = <span className="font-mono text-foreground">{velocity}</span> m/s
        </span>
        <span>
          θ = <span className="font-mono text-foreground">{angle}</span>°
        </span>
        <span>
          g = <span className="font-mono text-foreground">{gravity}</span> m/s²
        </span>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Simulation placeholder — interactive canvas on Day 4
      </p>
    </div>
  );
}
