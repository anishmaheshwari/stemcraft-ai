"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { icon: "⚡", label: "Lesson generated in", value: "< 30s", color: "text-primary" },
  { icon: "🎯", label: "Unique STEM topics", value: "Unlimited", color: "text-sky-400" },
  { icon: "🧠", label: "Powered by", value: "Gemini 2.5", color: "text-violet-400" },
  { icon: "📚", label: "Learning formats", value: "4 modes", color: "text-amber-400" },
];

const EXAMPLE_TOPICS = [
  "Kubernetes", "Load Balancer", "Binary Search", "DNS Resolution",
  "Neural Networks", "Photosynthesis", "Projectile Motion", "AWS EC2",
  "Docker Containers", "Sorting Algorithms",
];

interface ImpactSectionProps {
  onTopicSelect: (topic: string) => void;
}

export function ImpactSection({ onTopicSelect }: ImpactSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="mx-auto max-w-6xl space-y-20">

        {/* Stats row */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/8 px-4 py-1.5 text-xs font-semibold text-amber-400 mb-4">
              📊 WHY STEMCRAFT AI?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Built for the <span className="gradient-text-primary">Modern Learner</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
                className="rounded-2xl border border-white/8 bg-secondary/40 backdrop-blur-sm p-5 text-center hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`text-xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live examples topic pills */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/8 px-4 py-1.5 text-xs font-semibold text-sky-400 mb-4">
              💡 LIVE EXAMPLES — click any topic
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Try These <span className="gradient-text-primary">Right Now</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Click any topic below to auto-fill the search — then hit Generate.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {EXAMPLE_TOPICS.map((topic, i) => (
              <motion.button
                key={topic}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.04 * i + 0.45, duration: 0.3 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onTopicSelect(topic)}
                className="group rounded-full border border-white/10 bg-secondary/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/8 hover:text-primary hover:shadow-[0_0_16px_hsl(160_84%_39%_/_0.15)]"
              >
                {topic}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
