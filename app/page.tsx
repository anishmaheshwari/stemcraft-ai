"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { LoadingExperience } from "@/components/shared/LoadingExperience";
import { PageTransition } from "@/components/shared/PageTransition";
import {
  isUnsupportedTopicError,
  isAiGenerationFailedError,
  requestExperience,
} from "@/lib/api/generate-client";
import { DEMO_TOPICS, getStaticFallback } from "@/lib/fallbacks";
import { saveSession } from "@/lib/session";
import type { Category, DemoTopic, ExperiencePayload } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unsupportedMessage, setUnsupportedMessage] = useState<string | null>(
    null
  );
  const [aiError, setAiError] = useState<{ message: string; reason: string; topic: string } | null>(null);
  const [suggestedTopics, setSuggestedTopics] =
    useState<DemoTopic[]>(DEMO_TOPICS);

  function navigateWithPayload(
    payload: ExperiencePayload,
    meta?: import("@/lib/api/generate-client").GenerateMeta
  ) {
    saveSession(payload, meta);
    router.push(`/learn/${payload.sessionId}`);
  }

  function handleDemoSelect(topic: DemoTopic) {
    setUnsupportedMessage(null);
    const payload = getStaticFallback(topic.id);
    console.log("[STEMCraft][client] demo card selected — static payload", {
      templateId: topic.id,
      sessionId: payload.sessionId,
    });
    navigateWithPayload(payload);
  }

  async function handleGenerate(topic: string, category: Category | null) {
    setIsLoading(true);
    setUnsupportedMessage(null);
    setAiError(null);

    try {
      const { payload, meta } = await requestExperience(topic, category);
      console.log("[STEMCraft][client] navigating to experience", {
        sessionId: payload.sessionId,
        source: meta.source,
        templateId: meta.templateId,
      });
      // Save session FIRST (populates memory cache), then push.
      // Do NOT reset isLoading here — keep the loading screen visible
      // during the router.push() navigation transition. The learn page
      // will render with the payload already in the memory cache so it
      // never shows a second loading state.
      saveSession(payload, meta);
      router.push(`/learn/${payload.sessionId}`);
      // isLoading intentionally left as true — component unmounts on navigation
    } catch (err) {
      if (isAiGenerationFailedError(err)) {
        console.warn("[STEMCraft][client] ai generation failed", {
          topic,
          reason: err.reason,
        });
        setAiError({ message: err.message, reason: err.reason, topic: err.topic });
        setIsLoading(false);
        return;
      }

      if (isUnsupportedTopicError(err)) {
        console.warn("[STEMCraft][client] topic not in MVP scope", {
          topic,
          suggested: err.suggestedTopics.map((t) => t.id),
        });
        setUnsupportedMessage(err.message);
        setSuggestedTopics(err.suggestedTopics);
        setIsLoading(false);
        return;
      }

      const message = err instanceof Error ? err.message : "Generate failed";
      console.error("[STEMCraft][client] generate failed", { error: message });
      setAiError({
        message: "Something went wrong. Please try again.",
        reason: "unknown",
        topic,
      });
      setSuggestedTopics(DEMO_TOPICS);
      setIsLoading(false);
    }
  }

  return (
    <PageTransition>
      <main>
        {isLoading ? (
          <LoadingExperience />
        ) : (
          <HeroSection
            onGenerate={handleGenerate}
            onDemoSelect={handleDemoSelect}
            isLoading={isLoading}
            unsupportedMessage={unsupportedMessage}
            aiError={aiError}
            suggestedTopics={suggestedTopics}
            onDismissUnsupported={() => {
              setUnsupportedMessage(null);
              setAiError(null);
            }}
          />
        )}
      </main>
    </PageTransition>
  );
}
