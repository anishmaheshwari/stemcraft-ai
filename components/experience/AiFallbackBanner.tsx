"use client";

import { AlertTriangle } from "lucide-react";

interface AiFallbackBannerProps {
  reason?: string;
}

export function AiFallbackBanner({ reason }: AiFallbackBannerProps) {
  const isQuota = reason?.includes("quota");

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-amber-100">
            {isQuota
              ? "AI generation unavailable — Gemini API quota exceeded"
              : "AI generation unavailable — showing demo lesson"}
          </p>
          <p className="text-xs leading-relaxed text-amber-100/80">
            Your topic was recognized, but lesson content is from a pre-built demo
            until the API key has quota. The title reflects your question; explanation
            and quiz may not match yet.
            {isQuota && (
              <>
                {" "}
                Check billing at{" "}
                <a
                  href="https://ai.google.dev/gemini-api/docs/rate-limits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-50"
                >
                  Google AI rate limits
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
