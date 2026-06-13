"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExperienceShell } from "@/components/experience/ExperienceShell";
import { LoadingExperience } from "@/components/shared/LoadingExperience";
import { getStaticFallback } from "@/lib/fallbacks";
import { loadSession, loadSessionMeta } from "@/lib/session";
import type { ExperiencePayload } from "@/lib/types";

export default function LearnPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const [payload, setPayload] = useState<ExperiencePayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [generationMeta, setGenerationMeta] = useState<{
    source: string;
    reason: string;
  } | null>(null);

  useEffect(() => {
    const stored = loadSession(sessionId);
    const meta = loadSessionMeta(sessionId);
    if (stored) {
      setPayload(stored);
    } else {
      setPayload(getStaticFallback("binary_search"));
    }
    if (meta) {
      setGenerationMeta({ source: meta.source, reason: meta.reason });
    }
    setIsLoading(false);
  }, [sessionId]);

  if (isLoading) {
    return <LoadingExperience />;
  }

  if (!payload) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Session not found.</p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <ExperienceShell payload={payload} generationMeta={generationMeta} />
  );
}
