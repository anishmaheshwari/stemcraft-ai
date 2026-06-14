"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  { num: "01", icon: "⌨️", title: "Enter Any Topic", desc: "Type any STEM concept — from Kubernetes to Quantum Physics", examples: ["Kubernetes", "Binary Search", "Projectile Motion"] },
  { num: "02", icon: "✨", title: "Gemini Generates", desc: "Gemini 2.5 Flash builds a structured lesson in seconds", examples: ["Explanation", "Key concepts", "Analogies"] },
  { num: "03", icon: "🎮", title: "Interactive Simulation", desc: "Step through a live visual simulation of the concept", examples: ["Visual trace", "Step controls", "Real-time feedback"] },
  { num: "04", icon: "🧠", title: "Quiz + Insights", desc: "Adaptive quiz measures understanding with personal insights", examples: ["MCQ quiz", "Score breakdown", "Learning tips"] },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* bg orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(199 89% 48%), hsl(160 84% 39%))" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial="hidden" animate={inView ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/8 px-4 py-1.5 text-xs font-semibold text-sky-400 mb-4">
            ⚡ INSTANT GENERATION
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold mb-4">
            From Topic to <span className="gradient-text-primary">Full Lesson</span> in Seconds
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
            STEMCraft AI turns any topic into a complete, interactive learning experience — no prep, no waiting.
          </motion.p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i + 0.2, duration: 0.5, ease: "easeOut" }}
              className="relative group"
            >
              {/* Connector line (not last) */}
              {i < 3 && (
                <div className="hidden lg:block absolute top-10 left-[calc(100%_-_12px)] w-6 h-0.5 z-20">
                  <div className="w-full h-full rounded-full overflow-hidden"
                    style={{ background: "linear-gradient(90deg, hsl(160 84% 39% / 0.6), hsl(199 89% 48% / 0.3))", animation: "connector-pulse 2s linear infinite" }} />
                </div>
              )}

              <div className="relative rounded-2xl border border-white/8 bg-secondary/30 backdrop-blur-sm p-5 h-full transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_0_30px_hsl(160_84%_39%_/_0.12)] group-hover:-translate-y-1">
                {/* Step number */}
                <div className="text-[10px] font-bold tracking-widest text-primary/50 mb-3">{step.num}</div>

                {/* Icon */}
                <div className="text-3xl mb-3">{step.icon}</div>

                {/* Title */}
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{step.desc}</p>

                {/* Example pills */}
                <div className="flex flex-wrap gap-1.5">
                  {step.examples.map((ex) => (
                    <span key={ex} className="rounded-full bg-primary/8 border border-primary/15 px-2 py-0.5 text-[10px] text-primary/70 font-medium">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
