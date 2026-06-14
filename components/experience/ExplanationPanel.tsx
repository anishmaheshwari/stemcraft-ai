"use client";

import { motion, useInView } from "framer-motion";
import { Lightbulb, ListChecks, Quote } from "lucide-react";
import { useRef } from "react";
import type { Explanation } from "@/lib/types";

interface ExplanationPanelProps {
  explanation?: Explanation;
}

function RevealCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  const keyIdeas = explanation?.keyIdeas ?? [];

  return (
    <div className="flex flex-col gap-3">
      {/* Hook */}
      <RevealCard delay={0}>
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.2 }}
          className="group rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/3 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/35 hover:shadow-[0_0_24px_hsl(160_84%_39%_/_0.12)]"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_12px_hsl(160_84%_39%_/_0.2)]">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              The Hook
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {explanation?.hook || "A quick overview is not available for this lesson."}
          </p>
        </motion.div>
      </RevealCard>

      {/* Key Ideas */}
      <RevealCard delay={0.1}>
        <motion.div
          whileHover={{ scale: 1.005, y: -1 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-sky-500/20 bg-secondary/30 p-5 backdrop-blur-sm transition-all duration-200 hover:border-sky-500/35 hover:shadow-[0_0_20px_hsl(199_89%_48%_/_0.1)]"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15">
              <ListChecks className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-400">
              Key Ideas
            </span>
          </div>
          {keyIdeas.length > 0 ? (
            <ol className="space-y-2.5">
              {keyIdeas.map((idea, i) => (
                <motion.li
                  key={idea}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.09, duration: 0.35 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-[10px] font-bold text-sky-400">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{idea}</span>
                </motion.li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">Key ideas not available for this lesson.</p>
          )}
        </motion.div>
      </RevealCard>

      {/* Analogy */}
      <RevealCard delay={0.2}>
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/6 to-violet-500/2 p-5 backdrop-blur-sm transition-all duration-200 hover:border-violet-500/35 hover:shadow-[0_0_20px_hsl(263_70%_60%_/_0.1)]"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15">
              <Quote className="h-4 w-4 text-violet-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">
              Analogy
            </span>
          </div>
          <p className="text-sm italic leading-relaxed text-muted-foreground">
            {explanation?.analogy || "No analogy was provided for this lesson."}
          </p>
        </motion.div>
      </RevealCard>
    </div>
  );
}
