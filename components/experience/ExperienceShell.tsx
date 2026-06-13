"use client";

import { ArrowLeft } from "lucide-react";
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

  // Always initialize hooks; rendering for ai_lesson is handled later.

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
          // Attempt to map correctness by comparing to payload.quiz.questions if available
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

  // derive mission text from payload
  const mission = (() => {
    if (payload.templateId === "binary_search") {
      const config = payload.simulation!.config as { target: number };
      const target = config.target;
      return {
        title: `Find target value ${target}`,
        objective: `Locate the target value ${target} using binary search.`,
      };
    }
    if (payload.templateId === "dns_resolution") {
      const config = payload.simulation!.config as { domain: string };
      const domain = config.domain;
      return {
        title: `Resolve ${domain}`,
        objective: `Trace the DNS lookup process and discover the final IP for ${domain}.`,
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
      <PageTransition className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold sm:text-xl">
                {payload.topic}
              </h1>
              <Badge variant={badgeVariant}>
                {payload.category === "cs" ? "CS" : "Physics"}
              </Badge>
            </div>
          </div>
        </div>
        <ProgressBar value={progressValue} />
      </header>

      {generationMeta?.source === "static" && (
        <AiFallbackBanner reason={generationMeta.reason} />
      )}

      <div className="hidden gap-6 lg:grid lg:grid-cols-5">
        <div className="lg:col-span-3">
          {/* Large simulation area */}
          <div className="h-full flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {simulatePanel}
            </motion.div>
            <div className="mt-4 lg:hidden">{explainPanel}</div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {/* Right column: Mission, narration, explanation, quiz, insights */}
          {/* Mission */}
          {/* Step narration */}
          {/* Explanation */}
          {/* Quiz */}
          {/* InsightsPanel */}
          
          <MissionCard title={mission.title} objective={mission.objective} />

          <StepNarration templateId={payload.templateId} config={payload.simulation!.config} stepIndex={currentStep} />

          <div className="space-y-4">
            {explainPanel}
            {quizPanel}
            <InsightsPanel topicKey={topicKey} />
          </div>
        </div>
      </div>

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
