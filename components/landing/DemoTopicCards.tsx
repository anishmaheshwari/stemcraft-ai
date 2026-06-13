"use client";

import { motion } from "framer-motion";
import { Binary, Globe, Rocket, Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_TOPICS } from "@/lib/fallbacks";
import { cn } from "@/lib/utils";
import type { DemoTopic, TemplateId } from "@/lib/types";

const ICONS: Record<TemplateId, typeof Binary> = {
  binary_search: Binary,
  dns_resolution: Globe,
  projectile_motion: Rocket,
  ai_lesson: Book,
};

const GLOW: Record<TemplateId, string> = {
  binary_search: "hover:glow-cs",
  dns_resolution: "hover:glow-dns",
  projectile_motion: "hover:glow-physics",
  ai_lesson: "hover:glow-ai",
};

interface DemoTopicCardsProps {
  onSelect: (topic: DemoTopic) => void;
  filterCategory?: "cs" | "physics" | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
        const badgeVariant =
          topic.id === "dns_resolution"
            ? "dns"
            : topic.category === "cs"
              ? "cs"
              : "physics";

        return (
          <motion.button
            key={topic.id}
            type="button"
            variants={item}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(topic)}
            className="text-left"
          >
            <Card
              className={cn(
                "h-full cursor-pointer border border-white/10 bg-gradient-to-br from-slate-950/80 to-slate-900/95 shadow-2xl transition-all duration-300",
                GLOW[topic.id]
              )}
            >
              <CardHeader className="pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={badgeVariant}>
                    {topic.category === "cs" ? "CS" : "Physics"}
                  </Badge>
                </div>
                <CardTitle className="text-base">{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Tap to explore →
                </p>
              </CardContent>
            </Card>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
