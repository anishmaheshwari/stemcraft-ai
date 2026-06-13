"use client";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { TopicInsights } from "@/lib/insights";
import * as InsightsLib from "@/lib/insights";

type InsightsContextValue = {
  getTopicInsights: (topicKey: string) => TopicInsights | null;
  recordQuizResults: (templateId: string, topicKey: string, sessionId: string, quizResults: { questionId: string; correct: boolean; question?: string }[]) => TopicInsights;
  clearTopic: (topicKey: string) => void;
};

const InsightsContext = createContext<InsightsContextValue | null>(null);

export function InsightsProvider({ children }: { children: React.ReactNode }) {
  const [, setVersion] = useState(0);

  const value = useMemo<InsightsContextValue>(() => ({
    getTopicInsights: (topicKey: string) => InsightsLib.getTopicInsights(topicKey),
    recordQuizResults: (templateId, topicKey, sessionId, quizResults) => {
      const res = InsightsLib.recordQuizResults(templateId, topicKey, sessionId, quizResults);
      setVersion((v) => v + 1);
      return res;
    },
    clearTopic: (topicKey: string) => {
      InsightsLib.clearTopicInsights(topicKey);
      setVersion((v) => v + 1);
    },
  }), []);
  useEffect(() => {
    const handler = () => setVersion((v) => v + 1);
    window.addEventListener("stemcraft:insights:updated", handler as EventListener);
    return () => window.removeEventListener("stemcraft:insights:updated", handler as EventListener);
  }, []);

  return (
    <InsightsContext.Provider value={value}>
      {children}
    </InsightsContext.Provider>
  );
}

export function useInsights() {
  const ctx = useContext(InsightsContext);
  if (!ctx) throw new Error("useInsights must be used within InsightsProvider");
  return ctx;
}
