"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInsights } from "./InsightsProvider";

export function InsightsPanel({ topicKey }: { topicKey: string }) {
  const insights = useInsights();
  const [open, setOpen] = useState(false);
  const data = insights.getTopicInsights(topicKey);

  const topWeak = data?.weaknesses?.[0] ?? null;
  const topRec = data?.recommendations?.[0] ?? null;
  const hasData = topWeak || topRec;

  return (
    <>
      <div className="rounded-2xl border border-white/8 bg-secondary/20 p-4 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/15">
              <Brain className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-sm font-semibold">AI Insights</span>
          </div>
          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-medium text-violet-400">
            Personalized
          </span>
        </div>

        {hasData ? (
          <div className="space-y-3">
            {topWeak && (
              <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-red-400/80">
                  Area to review
                </p>
                <p className="text-sm text-foreground/80">{topWeak}</p>
              </div>
            )}
            {topRec && (
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-emerald-400/80" />
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
                    Recommended
                  </p>
                </div>
                <p className="text-sm text-foreground/80">{topRec}</p>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="h-8 rounded-lg border-white/10 text-xs hover:border-white/20"
              >
                <BookOpen className="mr-1.5 h-3 w-3" />
                Full report
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              >
                ↑ Simulation
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Complete the quiz to unlock AI-powered insights about your learning.
            </p>
            <div className="mt-3 flex justify-center gap-1">
              <span className="h-1.5 w-6 rounded-full bg-violet-500/20" />
              <span className="h-1.5 w-3 rounded-full bg-violet-500/10" />
              <span className="h-1.5 w-2 rounded-full bg-violet-500/10" />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-semibold">Learning Insights</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {data ? (
                <div className="space-y-3">
                  {data.weaknesses?.length > 0 && (
                    <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400/80">
                        Weaknesses
                      </p>
                      <ul className="space-y-1.5">
                        {data.weaknesses.map((w: string, i: number) => (
                          <li key={i} className="text-sm text-foreground/80">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.recommendations?.length > 0 && (
                    <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400/80">
                        Recommendations
                      </p>
                      <ul className="space-y-1.5">
                        {data.recommendations.map((r: string, i: number) => (
                          <li key={i} className="text-sm text-foreground/80">• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete the quiz to generate your personalized insight report.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
