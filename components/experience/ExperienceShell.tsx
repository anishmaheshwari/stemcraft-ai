"use client";

import { ArrowLeft, Brain, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AiFallbackBanner } from "@/components/experience/AiFallbackBanner";
import { ExplanationPanel } from "@/components/experience/ExplanationPanel";
import { PanelTabs } from "@/components/experience/PanelTabs";
import { ProgressBar } from "@/components/experience/ProgressBar";
import { QuizPanel } from "@/components/experience/QuizPanel";
import { SimulationPanel } from "@/components/experience/SimulationPanel";
import { LessonShell } from "@/components/experience/LessonShell";
import { LearningJourney } from "@/components/experience/LearningJourney";
import { PageTransition } from "@/components/shared/PageTransition";
import { Badge } from "@/components/ui/badge";
import {
  computeExperienceProgress,
  getTopicProgress,
  slugifyTopic,
  updateTopicProgress,
} from "@/lib/progress";
import { getMaxSteps } from "@/lib/simulations/types";
import type { ExperiencePayload } from "@/lib/types";
import * as InsightsLib from "@/lib/insights";
import { InsightsProvider } from "@/components/insights/InsightsProvider";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { MissionCard } from "@/components/experience/MissionCard";
import { StepNarration } from "@/components/experience/StepNarration";

interface ExperienceShellProps {
  payload: ExperiencePayload;
  generationMeta?: { source: string; reason: string } | null;
}

export function ExperienceShell({
  payload,
  generationMeta = null,
}: ExperienceShellProps) {
  const topicKey = useMemo(
    () => slugifyTopic(payload.topic),
    [payload.topic]
  );

  const [activeTab, setActiveTab] = useState("simulate");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const maxSteps = payload.simulation?.config
    ? getMaxSteps(payload.templateId, payload.simulation.config)
    : 1;

  useEffect(() => {
    const saved = getTopicProgress(topicKey);
    if (saved) {
      setSimulationComplete(saved.simulationComplete);
      setQuizScore(saved.quizScore);
      if (saved.quizAnswers) setQuizAnswers(saved.quizAnswers);
    }
  }, [topicKey]);

  useEffect(() => {
    if (currentStep >= maxSteps - 1) {
      setSimulationComplete(true);
      updateTopicProgress(topicKey, { simulationComplete: true });
    }
  }, [currentStep, maxSteps, topicKey]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, maxSteps]);

  const progressValue = computeExperienceProgress(
    currentStep,
    maxSteps,
    simulationComplete,
    quizScore
  );

  // Derive journey stage from progress
  const journeyStage = useMemo(() => {
    if (quizScore !== null) return "master";
    if (simulationComplete) return "practice";
    if (currentStep > 0) return "visualize";
    return "understand";
  }, [quizScore, simulationComplete, currentStep]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleQuizComplete = useCallback(
    (score: number, answers: Record<string, number>) => {
      setQuizScore(score);
      setQuizAnswers(answers);
      updateTopicProgress(topicKey, {
        quizScore: score,
        quizAnswers: answers,
      });

      try {
        const quizResults = Object.entries(answers).map(([questionId]) => ({ questionId, correct: false, question: undefined }));
          const detailed = quizResults.map((r) => {
            const questions = payload.quiz?.questions;
            if (!questions) return r;
            const q = questions.find((qq) => qq.id === r.questionId);
            if (!q) return r;
            return { questionId: r.questionId, correct: q.correctIndex === answers[r.questionId], question: q.question };
          });
        InsightsLib.recordQuizResults(payload.templateId, topicKey, payload.sessionId, detailed);
      } catch {
        // ignore insights errors
      }
    },
    [topicKey, payload.sessionId, payload.templateId, payload.quiz?.questions]
  );

  const badgeVariant =
    payload.templateId === "dns_resolution"
      ? "dns"
      : payload.category === "cs"
        ? "cs"
        : "physics";

  // Category color scheme
  const categoryColor = payload.templateId === "dns_resolution"
    ? "hsl(263 70% 60%)"
    : payload.category === "cs"
      ? "hsl(160 84% 39%)"
      : "hsl(199 89% 48%)";

  // Render LessonShell for AI-generated lessons (non-simulation topics)
  if (payload.templateId === "ai_lesson") {
    return (
      <InsightsProvider>
        <LessonShell payload={payload} />
      </InsightsProvider>
    );
  }

  const explainPanel = (
    <ExplanationPanel explanation={payload.explanation} />
  );
  const simulatePanel = (
    <SimulationPanel
      templateId={payload.templateId}
      config={payload.simulation!.config}
      isPlaying={isPlaying}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onPlayPause={() => setIsPlaying((p) => !p)}
      onReset={() => {
        setIsPlaying(false);
        setCurrentStep(0);
      }}
      maxSteps={maxSteps}
    />
  );

  const mission = (() => {
    if (payload.templateId === "binary_search") {
      const config = payload.simulation!.config as { target: number };
      return {
        title: `Find target value ${config.target}`,
        objective: `Locate the target value ${config.target} using binary search.`,
      };
    }
    if (payload.templateId === "dns_resolution") {
      const config = payload.simulation!.config as { domain: string };
      return {
        title: `Resolve ${config.domain}`,
        objective: `Trace the DNS lookup process and discover the final IP for ${config.domain}.`,
      };
    }
    if (payload.templateId === "projectile_motion") {
      return {
        title: `Projectile Motion`,
        objective: `Adjust angle and velocity to achieve the desired trajectory.`,
      };
    }
    return { title: payload.topic, objective: "Complete the mission." };
  })();

  const quizPanel = (
    <QuizPanel
      questions={payload.quiz!.questions}
      initialScore={quizScore}
      initialAnswers={
        Object.keys(quizAnswers).length > 0 ? quizAnswers : undefined
      }
      onComplete={handleQuizComplete}
    />
  );

  return (
    <InsightsProvider>
      <PageTransition className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:py-6">

        {/* ── Premium WOW Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/8 bg-secondary/30 p-4 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                aria-label="Back to home"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-all hover:border-white/20 hover:bg-secondary hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div className="min-w-0">
                {/* AI Generated label */}
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
                    <Brain className="h-2.5 w-2.5" />
                    AI Generated
                  </span>
                  {generationMeta?.source !== "static" && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Zap className="h-2.5 w-2.5 text-amber-400" />
                      Live
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h1 className="truncate text-base font-semibold sm:text-lg">
                    {payload.topic}
                  </h1>
                  <Badge variant={badgeVariant}>
                    {payload.category === "cs" ? "CS" : "Physics"}
                  </Badge>
                </div>

                {/* Confidence score */}
                {payload.confidence != null && (
                  <div className="mt-0.5 flex items-center gap-2">
                    <div className="h-1 w-20 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.round(payload.confidence * 100)}%`,
                          background: categoryColor,
                          boxShadow: `0 0 6px ${categoryColor}`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(payload.confidence * 100)}% match
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ProgressBar value={progressValue} />
            </div>
          </div>
        </motion.header>

        {generationMeta?.source === "static" && (
          <AiFallbackBanner reason={generationMeta.reason} />
        )}

        {/* ── Learning Journey Roadmap ── */}
        <LearningJourney activeStage={journeyStage} />

        {/* ── Desktop Layout ── */}
        <div className="hidden gap-5 lg:grid lg:grid-cols-5">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              {simulatePanel}
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <MissionCard title={mission.title} objective={mission.objective} />
            <StepNarration templateId={payload.templateId} config={payload.simulation!.config} stepIndex={currentStep} />
            <div className="space-y-4">
              {explainPanel}
              {quizPanel}
              <InsightsPanel topicKey={topicKey} />
            </div>
          </div>
        </div>

        {/* ── Mobile Layout ── */}
        <div className="lg:hidden">
          <PanelTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            explain={explainPanel}
            simulate={simulatePanel}
            quiz={quizPanel}
          />
        </div>

      </PageTransition>
    </InsightsProvider>
  );
}
