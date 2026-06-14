"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExperienceShell } from "@/components/experience/ExperienceShell";
import { LoadingExperience } from "@/components/shared/LoadingExperience";
import { getStaticFallback } from "@/lib/fallbacks";
import { loadSession, loadSessionMeta } from "@/lib/session";
import type { ExperiencePayload } from "@/lib/types";
import type { GenerateMeta } from "@/lib/api/generate-client";

export default function LearnPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;

  /**
   * Initialize payload synchronously from the memory cache.
   * When the user navigates here from the home page, saveSession() has already
   * populated the in-memory map — so loadSession() returns the payload on the
   * very first render, with no useEffect delay.
   * On a page refresh, loadSession() falls back to sessionStorage.
   */
  const initialPayload = loadSession(sessionId);
  const initialMeta = loadSessionMeta(sessionId);

  const [payload, setPayload] = useState<ExperiencePayload | null>(initialPayload);
  const [generationMeta, setGenerationMeta] = useState<{
    source: string;
    reason: string;
  } | null>(
    initialMeta ? { source: initialMeta.source, reason: initialMeta.reason } : null
  );

  // isLoading is only true when the memory cache missed AND sessionStorage hasn't
  // been read yet (this only happens on a hard page refresh).
  const [isLoading, setIsLoading] = useState(initialPayload === null);
  const didInit = useRef(false);

  useEffect(() => {
    // Skip if we already got data synchronously from memory cache
    if (didInit.current) return;
    didInit.current = true;

    if (initialPayload !== null) {
      // Already set from memory cache — nothing to do
      setIsLoading(false);
      return;
    }

    // Hard refresh scenario: read from sessionStorage
    const stored = loadSession(sessionId);
    const meta = loadSessionMeta(sessionId);

    if (stored) {
      setPayload(stored);
    } else {
      // Last resort: show binary_search fallback
      setPayload(getStaticFallback("binary_search"));
    }
    if (meta) {
      setGenerationMeta({ source: meta.source, reason: meta.reason });
    }
    setIsLoading(false);
  }, [sessionId, initialPayload]);

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
