"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onGenerate: (topic: string) => void;
}

export function FinalCTA({ onGenerate }: FinalCTAProps) {
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-[0.12]"
          style={{ background: "radial-gradient(ellipse, hsl(160 84% 39%), hsl(199 89% 48%) 50%, hsl(263 70% 60%))" }}
        />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Powered by Gemini 2.5 Flash
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Ready to Learn{" "}
            <span className="gradient-text-primary">Anything?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Transform complex STEM concepts into interactive experiences powered by Gemini AI.
            No setup. No waiting. Just learning.
          </p>

          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 48px hsl(160 84% 39% / 0.5), 0 0 80px hsl(160 84% 39% / 0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>("input[aria-label='STEM topic']");
              if (input) {
                input.focus();
                input.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-300"
            style={{ boxShadow: "0 0 28px hsl(160 84% 39% / 0.35)" }}
          >
            <span>Generate Your First Lesson</span>
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>

          <p className="text-xs text-muted-foreground/50">
            Free to use · No sign-up · Works instantly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
