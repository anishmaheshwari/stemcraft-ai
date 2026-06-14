"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PROBLEMS = [
  "Static PDFs and textbooks",
  "Long passive video lectures",
  "One-size-fits-all curriculum",
  "No feedback or assessment",
];
const SOLUTIONS = [
  "AI-generated interactive lessons",
  "Live visual simulations",
  "Personalized learning path",
  "Instant adaptive quizzes",
];

const FEATURES = [
  { icon: "📚", title: "AI Lesson Generation", desc: "Structured explanations with key concepts, analogies, and visual cards — generated in seconds." },
  { icon: "🎮", title: "Interactive Simulations", desc: "Step through live visual demos. Binary search traces, DNS resolution flows, physics trajectories." },
  { icon: "🧠", title: "Adaptive Assessment", desc: "AI-crafted MCQs that test real understanding, not memorization." },
  { icon: "📈", title: "Learning Insights", desc: "Personalized tips that identify your strengths and gaps after every session." },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export function WhyItMatters() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="mx-auto max-w-6xl space-y-24">

        {/* Problem vs Solution */}
        <motion.div
          initial="hidden" animate={inView ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold text-violet-400 mb-4">
              🎯 THE PROBLEM WE SOLVE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Traditional Learning is <span className="text-red-400">Broken</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Static content doesn&apos;t adapt. Lectures don&apos;t interact. STEMCraft AI does both.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">❌</span>
                <h3 className="font-semibold text-red-300">Traditional Learning</h3>
              </div>
              <ul className="space-y-3">
                {PROBLEMS.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-red-200/60">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">✕</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* STEMCraft AI */}
            <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 backdrop-blur-sm" style={{ boxShadow: "0 0 40px hsl(160 84% 39% / 0.08)" }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">✅</span>
                <h3 className="font-semibold text-primary">STEMCraft AI</h3>
              </div>
              <ul className="space-y-3">
                {SOLUTIONS.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-emerald-200/80">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature showcase */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
              🚀 FEATURE SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text-primary">Master Any Topic</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i + 0.3, duration: 0.5, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-secondary/30 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_40px_hsl(160_84%_39%_/_0.12)]"
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, hsl(160 84% 39% / 0.04), hsl(199 89% 48% / 0.03))" }} />
                <div className="relative">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
