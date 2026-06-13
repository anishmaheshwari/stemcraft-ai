"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { LoadingExperience } from "@/components/shared/LoadingExperience";
import { PageTransition } from "@/components/shared/PageTransition";
import {
  isUnsupportedTopicError,
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

    try {
      const { payload, meta } = await requestExperience(topic, category);
      console.log("[STEMCraft][client] navigating to experience", {
        sessionId: payload.sessionId,
        source: meta.source,
        templateId: meta.templateId,
      });
      navigateWithPayload(payload, meta);
    } catch (err) {
      if (isUnsupportedTopicError(err)) {
        console.warn("[STEMCraft][client] topic not in MVP scope", {
          topic,
          suggested: err.suggestedTopics.map((t) => t.id),
        });
        setUnsupportedMessage(err.message);
        setSuggestedTopics(err.suggestedTopics);
        return;
      }

      const message = err instanceof Error ? err.message : "Generate failed";
      console.error("[STEMCraft][client] generate failed", { error: message });
      setUnsupportedMessage(
        "Something went wrong while generating your lesson. Please try a demo topic below."
      );
      setSuggestedTopics(DEMO_TOPICS);
    } finally {
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
            suggestedTopics={suggestedTopics}
            onDismissUnsupported={() => setUnsupportedMessage(null)}
          />
        )}
      </main>
    </PageTransition>
  );
}
