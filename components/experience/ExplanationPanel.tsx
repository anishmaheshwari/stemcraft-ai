"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Explanation } from "@/lib/types";

interface ExplanationPanelProps {
  explanation?: Explanation;
}

const cardVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.35 },
  }),
};

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  const keyIdeas = explanation?.keyIdeas ?? [];

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        custom={0}
        initial="hidden"
        animate="show"
        variants={cardVariants}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-primary">
              Hook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">
              {explanation?.hook || "A quick overview is not available for this lesson."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="show"
        variants={cardVariants}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Key Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            {keyIdeas.length > 0 ? (
              <ul className="space-y-2">
                {keyIdeas.map((idea) => (
                  <li
                    key={idea}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {idea}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Key ideas are not available for this lesson.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        custom={2}
        initial="hidden"
        animate="show"
        variants={cardVariants}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Analogy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic text-muted-foreground">
              {explanation?.analogy || "No analogy was provided for this lesson."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
