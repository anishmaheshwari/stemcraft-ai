"use client";

import { motion, AnimatePresence } from "framer-motion";
import { renderStepNarration } from "@/lib/narration";
import type { SimulationConfig, TemplateId } from "@/lib/types";

interface StepNarrationProps {
  templateId: TemplateId;
  config: SimulationConfig;
  stepIndex: number;
}

export function StepNarration({ templateId, config, stepIndex }: StepNarrationProps) {
  const text = renderStepNarration(templateId, config, stepIndex);
  if (!text) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 backdrop-blur-sm"
      >
        <div className="flex items-start gap-2.5">
          {/* AI typing indicator */}
          <div className="mt-0.5 flex shrink-0 items-center gap-0.5 pt-1">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary/60">
              AI Tutor
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StepNarration;
