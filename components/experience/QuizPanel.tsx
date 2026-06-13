"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";

interface QuizPanelProps {
  questions: QuizQuestion[];
  initialScore?: number | null;
  initialAnswers?: Record<string, number>;
  onComplete?: (score: number, answers: Record<string, number>) => void;
}

export function QuizPanel({
  questions,
  initialScore = null,
  initialAnswers,
  onComplete,
}: QuizPanelProps) {
  const [selected, setSelected] = useState<Record<string, number>>(
    initialAnswers ?? {}
  );
  const [finalScore, setFinalScore] = useState<number | null>(initialScore);

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === questions.length;

  const calculateScore = useCallback(
    (answers: Record<string, number>) => {
      const correct = questions.filter(
        (q) => answers[q.id] === q.correctIndex
      ).length;
      return Math.round((correct / questions.length) * 100);
    },
    [questions]
  );

  useEffect(() => {
    if (initialAnswers) {
      setSelected(initialAnswers);
    }
    if (initialScore !== null) {
      setFinalScore(initialScore);
    }
  }, [initialAnswers, initialScore]);

  function handleSelect(question: QuizQuestion, optionIndex: number) {
    if (selected[question.id] !== undefined || finalScore !== null) return;

    const next = { ...selected, [question.id]: optionIndex };
    setSelected(next);

    if (Object.keys(next).length === questions.length) {
      const score = calculateScore(next);
      setFinalScore(score);
      onComplete?.(score, next);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Quiz</CardTitle>
        {finalScore !== null && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary"
          >
            Score: {finalScore}%
          </motion.span>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {questions.map((question, index) => {
          const chosen = selected[question.id];
          const isAnswered = chosen !== undefined;
          const isCorrect = chosen === question.correctIndex;

          return (
            <div
              key={question.id}
              className="rounded-xl border border-border/60 bg-secondary/20 p-4"
            >
              <p className="mb-3 text-sm font-medium">
                {index + 1}. {question.question}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const isChosen = chosen === optionIndex;
                  const showCorrect =
                    isAnswered && optionIndex === question.correctIndex;
                  const showWrong = isAnswered && isChosen && !isCorrect;

                  return (
                    <motion.button
                      key={option}
                      type="button"
                      disabled={isAnswered}
                      whileTap={isAnswered ? undefined : { scale: 0.98 }}
                      animate={
                        showWrong
                          ? { x: [0, -5, 5, -4, 4, 0] }
                          : showCorrect && isChosen
                            ? { scale: [1, 1.02, 1] }
                            : {}
                      }
                      transition={{ duration: 0.35 }}
                      onClick={() => handleSelect(question, optionIndex)}
                      className={cn(
                        "flex min-h-[44px] items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        !isAnswered &&
                          "cursor-pointer border-border/50 bg-background/50 hover:border-primary/40 hover:bg-primary/5",
                        showCorrect &&
                          "border-emerald-500/60 bg-emerald-500/15 text-emerald-100",
                        showWrong &&
                          "border-red-500/50 bg-red-500/10 text-red-200",
                        isAnswered &&
                          !showCorrect &&
                          !showWrong &&
                          "border-border/30 bg-background/30 text-muted-foreground"
                      )}
                    >
                      <span>
                        {String.fromCharCode(65 + optionIndex)}. {option}
                      </span>
                      {showCorrect && isChosen && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      )}
                      {showWrong && (
                        <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {isAnswered && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={cn(
                    "mt-3 text-xs leading-relaxed",
                    isCorrect ? "text-emerald-400/90" : "text-muted-foreground"
                  )}
                >
                  {question.explanation}
                </motion.p>
              )}
            </div>
          );
        })}

        {!allAnswered && finalScore === null && (
          <p className="text-center text-xs text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </p>
        )}
      </CardContent>
    </Card>
  );
}
