"use client";

import { motion } from "framer-motion";
import { Binary, Globe, Rocket, Book, ArrowRight } from "lucide-react";
import { DEMO_TOPICS } from "@/lib/fallbacks";
import { cn } from "@/lib/utils";
import type { DemoTopic, TemplateId } from "@/lib/types";

const ICONS: Record<TemplateId, typeof Binary> = {
  binary_search: Binary,
  dns_resolution: Globe,
  projectile_motion: Rocket,
  ai_lesson: Book,
};

const CARD_STYLES: Record<TemplateId, { icon: string; border: string; glow: string; badge: string; badgeText: string }> = {
  binary_search: {
    icon: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    border: "hover:border-emerald-500/40",
    glow: "hover:shadow-[0_0_30px_hsl(160_84%_39%_/_0.15)]",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    badgeText: "CS",
  },
  dns_resolution: {
    icon: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
    border: "hover:border-violet-500/40",
    glow: "hover:shadow-[0_0_30px_hsl(263_70%_60%_/_0.15)]",
    badge: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    badgeText: "CS",
  },
  projectile_motion: {
    icon: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
    border: "hover:border-sky-500/40",
    glow: "hover:shadow-[0_0_30px_hsl(199_89%_48%_/_0.15)]",
    badge: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    badgeText: "Physics",
  },
  ai_lesson: {
    icon: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    border: "hover:border-amber-500/40",
    glow: "hover:shadow-[0_0_30px_hsl(38_92%_50%_/_0.15)]",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    badgeText: "AI",
  },
};

interface DemoTopicCardsProps {
  onSelect: (topic: DemoTopic) => void;
  filterCategory?: "cs" | "physics" | null;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function DemoTopicCards({ onSelect, filterCategory }: DemoTopicCardsProps) {
  const topics = filterCategory
    ? DEMO_TOPICS.filter((t) => t.category === filterCategory)
    : DEMO_TOPICS;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid w-full max-w-4xl gap-4 sm:grid-cols-3"
    >
      {topics.map((topic) => {
        const Icon = ICONS[topic.id];
        const styles = CARD_STYLES[topic.id];

        return (
          <motion.button
            key={topic.id}
            type="button"
            variants={item}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(topic)}
            className="group text-left"
          >
            <div
              className={cn(
                "relative h-full overflow-hidden rounded-2xl border border-white/8 bg-secondary/30 p-5 backdrop-blur-sm transition-all duration-300",
                styles.border,
                styles.glow
              )}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg, hsl(0 0% 100% / 0.02), transparent)" }}
              />

              <div className="relative space-y-3">
                {/* Icon + Badge row */}
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.icon)}>
                    <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", styles.badge)}>
                    {styles.badgeText}
                  </span>
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{topic.description}</p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
                  <span>Start learning</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
