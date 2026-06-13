"use client";

import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import type { DemoTopic } from "@/lib/types";

interface UnsupportedTopicBannerProps {
  message: string;
  suggestedTopics: DemoTopic[];
  onSelectTopic: (topic: DemoTopic) => void;
  onDismiss: () => void;
}

export function UnsupportedTopicBanner({
  message,
  suggestedTopics,
  onSelectTopic,
  onDismiss,
}: UnsupportedTopicBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl rounded-[1.75rem] border border-amber-400/20 bg-amber-400/10 p-4 text-left shadow-xl shadow-amber-400/10 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div className="flex-1 space-y-3">
          <p className="text-sm leading-relaxed text-amber-100/90">{message}</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => onSelectTopic(topic)}
                className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:border-amber-300/40 hover:bg-amber-300/20"
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded-full p-1 text-amber-300/70 hover:bg-amber-500/15 hover:text-amber-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
