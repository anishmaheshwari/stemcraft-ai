"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CategoryPills } from "@/components/landing/CategoryPills";
import { DemoTopicCards } from "@/components/landing/DemoTopicCards";
import { TopicInput } from "@/components/landing/TopicInput";
import { UnsupportedTopicBanner } from "@/components/landing/UnsupportedTopicBanner";
import type { Category, DemoTopic } from "@/lib/types";
import { useState } from "react";

interface HeroSectionProps {
  onGenerate: (topic: string, category: Category | null) => void;
  onDemoSelect: (topic: DemoTopic) => void;
  isLoading?: boolean;
  unsupportedMessage?: string | null;
  suggestedTopics?: DemoTopic[];
  onDismissUnsupported?: () => void;
}

export function HeroSection({
  onGenerate,
  onDemoSelect,
  isLoading = false,
  unsupportedMessage = null,
  suggestedTopics = [],
  onDismissUnsupported,
}: HeroSectionProps) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  return (
    <section className="relative overflow-hidden">
      <div className="hero-deco" />
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center gap-4 text-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            AI × STEM Education
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build premium STEM lessons with
            <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
              next-level AI
            </span>
          </h1>
          <p className="text-balance max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Generate engaging STEM explanations, visual learning cards, and quiz practice for any topic in CS or physics.
          </p>
        </motion.div>

        {unsupportedMessage && onDismissUnsupported && (
          <UnsupportedTopicBanner
            message={unsupportedMessage}
            suggestedTopics={suggestedTopics}
            onSelectTopic={(demo) => {
              onDismissUnsupported();
              onDemoSelect(demo);
            }}
            onDismiss={onDismissUnsupported}
          />
        )}

        <div className="relative z-10 flex w-full flex-col items-center gap-6">
          <TopicInput
            value={topic}
            onChange={setTopic}
            onSubmit={() => onGenerate(topic, category)}
            isLoading={isLoading}
          />

          <div className="grid w-full gap-4 sm:grid-cols-[1fr_auto] lg:grid-cols-[1.2fr_auto]">
            <CategoryPills selected={category} onSelect={setCategory} />
            <div className="hidden items-center rounded-3xl border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-primary sm:flex">
              <span className="font-semibold">Judges ready:</span>
              <span className="ml-2 text-muted-foreground">Clear visuals, crisp pacing, memorable takeaways.</span>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Try a demo topic
            </p>
            <DemoTopicCards onSelect={onDemoSelect} filterCategory={category} />
          </div>
        </div>
      </div>
    </section>
  );
}

