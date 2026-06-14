"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { CategoryPills } from "@/components/landing/CategoryPills";
import { DemoTopicCards } from "@/components/landing/DemoTopicCards";
import { TopicInput } from "@/components/landing/TopicInput";
import { UnsupportedTopicBanner } from "@/components/landing/UnsupportedTopicBanner";
import { HowItWorks } from "@/components/landing/sections/HowItWorks";
import { WhyItMatters } from "@/components/landing/sections/WhyItMatters";
import { ImpactSection } from "@/components/landing/sections/ImpactSection";
import { FinalCTA } from "@/components/landing/sections/FinalCTA";
import type { Category, DemoTopic } from "@/lib/types";

interface HeroSectionProps {
  onGenerate: (topic: string, category: Category | null) => void;
  onDemoSelect: (topic: DemoTopic) => void;
  isLoading?: boolean;
  unsupportedMessage?: string | null;
  aiError?: { message: string; reason: string; topic: string } | null;
  suggestedTopics?: DemoTopic[];
  onDismissUnsupported?: () => void;
}

/* ── Floating particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 6,
  duration: 5 + Math.random() * 7,
  color: ["hsl(160 84% 39%)", "hsl(199 89% 48%)", "hsl(263 70% 60%)"][i % 3],
}));

/* ── Value prop mini-cards under headline ── */
const VALUE_CARDS = [
  { icon: "📚", title: "AI Lesson Generation", desc: "Structured explanations in seconds" },
  { icon: "🎮", title: "Interactive Simulations", desc: "Learn by doing, not reading" },
  { icon: "🧠", title: "Adaptive Assessment", desc: "Quizzes tailored to understanding" },
  { icon: "📈", title: "Learning Insights", desc: "Identify strengths and weaknesses" },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const fadeSlide = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

export function HeroSection({
  onGenerate, onDemoSelect, isLoading = false,
  unsupportedMessage = null, aiError = null,
  suggestedTopics = [], onDismissUnsupported,
}: HeroSectionProps) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const shouldReduce = useReducedMotion();

  // When aiError arrives, pre-fill topic
  useEffect(() => { if (aiError?.topic) setTopic(aiError.topic); }, [aiError]);

  // Topic pill click: fill input and scroll to it
  const inputRef = useRef<HTMLDivElement>(null);
  function handleTopicPillClick(t: string) {
    setTopic(t);
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      const el = document.querySelector<HTMLInputElement>("input[aria-label='STEM topic']");
      el?.focus();
    }, 100);
  }

  return (
    <>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {/* Grid */}
          <div className="absolute inset-0 grid-flow opacity-100" />

          {/* Ambient orbs */}
          <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-[0.09] blur-[110px]"
            style={{ background: "radial-gradient(circle, hsl(160 84% 39%), hsl(199 89% 48%) 55%, transparent)" }} />
          <div className="absolute right-[-8%] top-[10%] h-80 w-80 rounded-full opacity-[0.07] blur-[80px]"
            style={{ background: "radial-gradient(circle, hsl(263 70% 60%), transparent 70%)", animation: shouldReduce ? "none" : "float-free 12s ease-in-out infinite" }} />
          <div className="absolute left-[-4%] bottom-[8%] h-72 w-72 rounded-full opacity-[0.05] blur-[70px]"
            style={{ background: "radial-gradient(circle, hsl(199 89% 48%), transparent 70%)", animation: shouldReduce ? "none" : "float-free 9s ease-in-out infinite reverse" }} />

          {/* Floating particles */}
          {!shouldReduce && PARTICLES.map((p) => (
            <div key={p.id} className="absolute rounded-full"
              style={{
                left: `${p.x}%`, top: `${p.y}%`,
                width: p.size * 2, height: p.size * 2,
                background: p.color,
                boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
                animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
                opacity: 0,
              }} />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <motion.div variants={stagger} initial="hidden" animate="show"
            className="flex flex-col items-center gap-10 text-center">

            {/* Badge */}
            <motion.div variants={fadeSlide}>
              <div className="relative inline-flex items-center gap-2.5 rounded-full border border-primary/35 bg-primary/8 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-md overflow-hidden">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                🏆 AI-Powered STEM Learning Platform
                {/* Shimmer sweep */}
                <motion.span className="absolute inset-0 rounded-full"
                  animate={{ opacity: [0, 0.07, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "linear-gradient(90deg, transparent, hsl(160 84% 39%), transparent)" }} />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeSlide} className="space-y-5 max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance leading-tight">
                Learn Any STEM Concept Through{" "}
                <span className="gradient-text-primary">Interactive AI Experiences</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Enter any STEM topic and STEMCraft instantly generates visual explanations,
                interactive simulations, adaptive quizzes, and personalized learning insights.
              </p>
            </motion.div>

            {/* Trust row */}
            <motion.div variants={fadeSlide}
              className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {[
                { dot: "bg-emerald-400", label: "Gemini 2.5 Flash" },
                { dot: "bg-sky-400",     label: "Real-time generation" },
                { dot: "bg-violet-400",  label: "Interactive simulations" },
                { dot: "bg-amber-400",   label: "Adaptive quizzes" },
              ].map(({ dot, label }) => (
                <span key={label} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${dot} shadow-[0_0_6px_currentColor]`} />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Value prop cards */}
            <motion.div variants={fadeSlide} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl">
              {VALUE_CARDS.map((card) => (
                <div key={card.title}
                  className="rounded-xl border border-white/8 bg-secondary/30 backdrop-blur-sm p-3.5 text-left transition-all duration-300 hover:border-primary/25 hover:-translate-y-0.5">
                  <div className="text-xl mb-2">{card.icon}</div>
                  <div className="text-xs font-semibold text-foreground/90 leading-snug mb-1">{card.title}</div>
                  <div className="text-[11px] text-muted-foreground/70 leading-relaxed">{card.desc}</div>
                </div>
              ))}
            </motion.div>

            {/* Error banners */}
            {unsupportedMessage && onDismissUnsupported && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }} className="w-full max-w-2xl">
                <UnsupportedTopicBanner message={unsupportedMessage} suggestedTopics={suggestedTopics}
                  onSelectTopic={(demo) => { onDismissUnsupported(); onDemoSelect(demo); }}
                  onDismiss={onDismissUnsupported} />
              </motion.div>
            )}

            {aiError && onDismissUnsupported && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }} className="w-full max-w-2xl">
                <div className="relative rounded-2xl border border-amber-500/30 bg-amber-500/8 px-5 py-4 text-sm backdrop-blur-md">
                  <button onClick={onDismissUnsupported} aria-label="Dismiss"
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/15 transition">
                    ✕
                  </button>
                  <div className="flex items-start gap-3 pr-6">
                    <span className="mt-0.5 flex-shrink-0">⚠️</span>
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-amber-200">
                        {aiError.reason === "timeout" ? "AI took too long to respond"
                          : aiError.reason === "quota_exceeded" ? "AI service is rate-limited"
                          : "AI generation failed"}
                      </p>
                      <p className="text-amber-100/70 leading-relaxed">{aiError.message}</p>
                      <p className="text-xs text-amber-100/50">
                        Your topic <span className="font-semibold text-amber-200/80">&ldquo;{aiError.topic}&rdquo;</span> is valid — the AI just needs a moment.
                      </p>
                      <button onClick={() => onGenerate(aiError.topic, null)}
                        className="mt-1 self-start rounded-lg bg-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/35 transition">
                        🔄 Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="flex w-full flex-col items-center gap-6"
              ref={inputRef}
            >
              <TopicInput value={topic} onChange={setTopic}
                onSubmit={() => onGenerate(topic, category)} isLoading={isLoading} />
              <CategoryPills selected={category} onSelect={setCategory} />

              {/* Demo cards divider */}
              <div className="flex w-full flex-col items-center gap-5 mt-2">
                <div className="flex items-center gap-3 w-full max-w-4xl">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 whitespace-nowrap">or try a demo</p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                </div>
                <DemoTopicCards onSelect={onDemoSelect} filterCategory={category} />
              </div>
            </motion.div>

            {/* Scroll cue */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="flex flex-col items-center gap-2 text-muted-foreground/30">
              <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
                className="w-px h-8 bg-gradient-to-b from-primary/40 to-transparent rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ BELOW-FOLD SECTIONS ═══════════════════ */}
      <HowItWorks />
      <WhyItMatters />
      <ImpactSection onTopicSelect={handleTopicPillClick} />
      <FinalCTA onGenerate={handleTopicPillClick} />
    </>
  );
}
