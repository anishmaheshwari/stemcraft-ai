"use client";

import { motion, useInView } from "framer-motion";
import { Brain, Sparkles, BookOpen, BarChart3, ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { ExplanationPanel } from "@/components/experience/ExplanationPanel";
import { QuizPanel } from "@/components/experience/QuizPanel";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { LearningJourney } from "@/components/experience/LearningJourney";
import { PageTransition } from "@/components/shared/PageTransition";
import type { ExperiencePayload } from "@/lib/types";

interface LessonShellProps {
  payload: ExperiencePayload;
}

function SectionReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LessonShell({ payload }: LessonShellProps) {
  const [quizScore, setQuizScore] = useState<number | null>(null);

  if (!payload || payload.templateId !== "ai_lesson") {
    return (
      <PageTransition className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Invalid lesson payload.</p>
        </div>
      </PageTransition>
    );
  }

  const lesson = payload.lesson;
  const title = lesson?.title || payload.topic || "STEM Lesson";
  const summary = lesson?.summary || "";
  const keyConcepts = Array.isArray(lesson?.keyConcepts) ? lesson.keyConcepts : [];
  const visualCards = Array.isArray(lesson?.visualCards) ? lesson.visualCards : [];
  const quizQuestions = Array.isArray(payload.quiz?.questions) ? payload.quiz.questions : [];
  const lessonSummary = summary || "A tailored lesson with a clear explanation, visual thinking cards, and practice quiz.";
  const confidence = payload.confidence ?? 0;
  const journeyStage = quizScore !== null ? "master" : "understand";

  const stats = [
    { label: "Concepts",     value: keyConcepts.length,   icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", glow: "hsl(160 84% 39%)" },
    { label: "Visual Cards", value: visualCards.length,   icon: Layers,   color: "text-sky-400",     bg: "bg-sky-500/10",    glow: "hsl(199 89% 48%)" },
    { label: "Quiz Qs",      value: quizQuestions.length, icon: BarChart3, color: "text-violet-400",  bg: "bg-violet-500/10", glow: "hsl(263 70% 60%)" },
  ];

  return (
    <PageTransition className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:py-6">

      {/* ── Premium Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl border border-white/8 p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, hsl(240 10% 6% / 0.95) 0%, hsl(160 84% 39% / 0.06) 50%, hsl(263 70% 60% / 0.04) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Ambient blobs */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(160 84% 39%), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(263 70% 60%), transparent 70%)" }}
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 flex-1">
            {/* Nav + badges */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                aria-label="Back to home"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-all duration-200 hover:border-white/25 hover:bg-white/5 hover:text-foreground hover:shadow-[0_0_8px_hsl(160_84%_39%_/_0.15)]"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-[0_0_10px_hsl(160_84%_39%_/_0.15)]">
                  <Brain className="h-3 w-3" />
                  AI Generated Lesson
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-amber-400/70" />
                  Gemini 2.5 Flash
                </span>
              </div>
            </div>

            {/* Title + summary */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {lessonSummary}
              </p>
            </div>

            {/* Animated confidence meter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground/70">AI Confidence</span>
              <div className="relative h-1.5 w-36 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(confidence * 100)}%` }}
                  transition={{ duration: 1.1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                  style={{ boxShadow: "0 0 10px hsl(160 84% 39% / 0.6)" }}
                />
                {/* Shimmer sweep on bar */}
                <motion.div
                  animate={{ x: ["-100%", "250%"] }}
                  transition={{ duration: 2.5, delay: 1.2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/3 rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs font-semibold text-primary"
              >
                {Math.round(confidence * 100)}%
              </motion.span>
            </div>
          </div>

          {/* Animated stat mini-cards */}
          <div className="flex gap-2.5 lg:flex-col lg:gap-2">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 min-w-[88px] cursor-default"
                  style={{ transition: "box-shadow 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 16px ${stat.glow}30`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-base font-bold tabular-nums text-foreground leading-none">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Learning Journey */}
      <SectionReveal delay={0.05}>
        <LearningJourney activeStage={journeyStage} />
      </SectionReveal>

      {/* Main Content Grid */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-5">
          <SectionReveal delay={0.1}>
            {/* Ambient glow behind explanation */}
            <div className="relative">
              <div
                className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full opacity-[0.04] blur-3xl"
                style={{ background: "radial-gradient(circle, hsl(160 84% 39%), transparent)" }}
              />
              <ExplanationPanel explanation={payload.explanation} />
            </div>
          </SectionReveal>

          {/* Key Concepts */}
          {keyConcepts.length > 0 && (
            <SectionReveal delay={0.15}>
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Key Concepts
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {keyConcepts.map((k, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                      whileHover={{ scale: 1.02, y: -3 }}
                      className="rounded-2xl border border-emerald-500/15 bg-emerald-500/4 p-4 cursor-default transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/8 hover:shadow-[0_0_20px_hsl(160_84%_39%_/_0.1)]"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                          {i + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground">{k.title}</h3>
                      </div>
                      {k.detail && (
                        <p className="text-xs leading-relaxed text-muted-foreground">{k.detail}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            </SectionReveal>
          )}

          {/* Visual Cards */}
          {visualCards.length > 0 && (
            <SectionReveal delay={0.2}>
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-sky-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                    Visual Learning Cards
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {visualCards.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
                      whileHover={{ scale: 1.02, y: -3 }}
                      className="group relative overflow-hidden rounded-2xl border border-sky-500/15 bg-gradient-to-br from-sky-500/6 to-sky-500/2 p-4 cursor-default transition-all duration-200 hover:border-sky-500/30 hover:shadow-[0_0_20px_hsl(199_89%_48%_/_0.12)]"
                    >
                      <div
                        className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full opacity-[0.07] blur-xl transition-opacity group-hover:opacity-[0.14]"
                        style={{ background: "radial-gradient(circle, hsl(199 89% 48%), transparent)" }}
                      />
                      <h3 className="mb-1.5 text-sm font-semibold text-foreground">{c.title}</h3>
                      {c.caption && (
                        <p className="text-xs leading-relaxed text-muted-foreground">{c.caption}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            </SectionReveal>
          )}
        </div>

        {/* RIGHT sidebar */}
        <aside className="lg:col-span-2 space-y-4">
          <div className="lg:sticky lg:top-6 space-y-4">
            {quizQuestions.length > 0 && (
              <SectionReveal delay={0.12}>
                {/* Ambient glow behind quiz */}
                <div className="relative">
                  <div
                    className="pointer-events-none absolute -right-8 top-4 h-32 w-32 rounded-full opacity-[0.05] blur-3xl"
                    style={{ background: "radial-gradient(circle, hsl(38 92% 50%), transparent)" }}
                  />
                  <QuizPanel
                    questions={quizQuestions}
                    onComplete={(score) => setQuizScore(score)}
                  />
                </div>
              </SectionReveal>
            )}
            <SectionReveal delay={0.18}>
              <InsightsPanel topicKey={payload.topic} />
            </SectionReveal>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
