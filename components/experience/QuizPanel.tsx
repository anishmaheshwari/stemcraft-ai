"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";

interface QuizPanelProps {
  questions: QuizQuestion[];
  initialScore?: number | null;
  initialAnswers?: Record<string, number>;
  onComplete?: (score: number, answers: Record<string, number>) => void;
}

/** Animated count-up for score display */
function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(easeOut(t) * value));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return <>{display}</>;
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
  const [justRevealed, setJustRevealed] = useState(false);

  const answeredCount = Object.keys(selected).length;

  const calculateScore = useCallback(
    (answers: Record<string, number>) => {
      const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
      return Math.round((correct / questions.length) * 100);
    },
    [questions]
  );

  useEffect(() => {
    if (initialAnswers) setSelected(initialAnswers);
    if (initialScore !== null) setFinalScore(initialScore);
  }, [initialAnswers, initialScore]);

  function handleSelect(question: QuizQuestion, optionIndex: number) {
    if (selected[question.id] !== undefined || finalScore !== null) return;
    const next = { ...selected, [question.id]: optionIndex };
    setSelected(next);
    if (Object.keys(next).length === questions.length) {
      const score = calculateScore(next);
      setFinalScore(score);
      setJustRevealed(true);
      onComplete?.(score, next);
    }
  }

  const scoreClass =
    finalScore === null ? "" :
    finalScore >= 80 ? "score-excellent" :
    finalScore >= 50 ? "score-good" : "score-low";

  const scoreEmoji = finalScore === null ? "" : finalScore >= 80 ? "🎉" : finalScore >= 50 ? "👏" : "💪";
  const scoreLabel = finalScore === null ? "" : finalScore >= 80 ? "Excellent!" : finalScore >= 50 ? "Nice work!" : "Keep going!";

  return (
    <div className="rounded-2xl border border-white/8 bg-secondary/20 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={finalScore !== null && finalScore >= 80 ? { rotate: [0, -8, 8, -4, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
          </motion.div>
          <span className="text-sm font-semibold">Knowledge Check</span>
        </div>

        <AnimatePresence mode="wait">
          {finalScore === null ? (
            <motion.span
              key="counter"
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-xs text-muted-foreground"
            >
              {answeredCount}/{questions.length} answered
            </motion.span>
          ) : (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.5, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className={cn("text-lg font-bold tabular-nums leading-none", scoreClass)}>
                <AnimatedScore value={finalScore} />%
              </span>
              <span className="text-xs text-muted-foreground">{scoreLabel} {scoreEmoji}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated progress fill */}
      <div className="h-0.5 bg-white/5">
        <motion.div
          animate={{ width: `${questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-amber-500/60 to-amber-400"
          style={finalScore !== null ? { boxShadow: "0 0 6px hsl(38 92% 50% / 0.6)" } : {}}
        />
      </div>

      {/* Score reveal confetti row */}
      <AnimatePresence>
        {justRevealed && finalScore !== null && finalScore >= 80 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-center gap-1.5 bg-emerald-500/8 py-2 border-b border-emerald-500/15">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 300 }}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs font-semibold text-emerald-400 ml-1"
              >
                Perfect knowledge!
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions */}
      <div className="space-y-4 p-4">
        {questions.map((question, index) => {
          const chosen = selected[question.id];
          const isAnswered = chosen !== undefined;
          const isCorrect = chosen === question.correctIndex;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="rounded-xl border border-white/6 bg-background/30 p-3.5"
            >
              <p className="mb-3 text-sm font-medium leading-snug">
                <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
                {question.question}
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option, optionIndex) => {
                  const isChosen = chosen === optionIndex;
                  const showCorrect = isAnswered && optionIndex === question.correctIndex;
                  const showWrong = isAnswered && isChosen && !isCorrect;

                  return (
                    <motion.button
                      key={option}
                      type="button"
                      disabled={isAnswered}
                      whileHover={isAnswered ? {} : { scale: 1.015, y: -1 }}
                      whileTap={isAnswered ? {} : { scale: 0.97 }}
                      animate={
                        showWrong
                          ? { x: [0, -6, 6, -5, 5, -3, 3, 0] }
                          : showCorrect && isChosen
                            ? { scale: [1, 1.04, 1] }
                            : {}
                      }
                      transition={{ duration: 0.4 }}
                      onClick={() => handleSelect(question, optionIndex)}
                      className={cn(
                        "flex min-h-[42px] items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all duration-200",
                        !isAnswered &&
                          "cursor-pointer border-white/8 bg-background/30 hover:border-primary/30 hover:bg-primary/5 hover:text-foreground",
                        showCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-100 answer-correct-glow",
                        showWrong   && "border-red-500/40 bg-red-500/8 text-red-200 answer-wrong-glow",
                        isAnswered && !showCorrect && !showWrong &&
                          "border-white/5 bg-background/20 text-muted-foreground/50"
                      )}
                    >
                      <span className="leading-relaxed">
                        <span className="mr-1.5 font-mono text-[10px] opacity-50">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </span>

                      {/* Check icon with pop animation */}
                      {showCorrect && isChosen && (
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.05 }}
                          className="ml-2 shrink-0"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </motion.div>
                      )}
                      {/* Show correct answer icon (not chosen) */}
                      {showCorrect && !isChosen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="ml-2 shrink-0"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-400/60" />
                        </motion.div>
                      )}
                      {showWrong && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          className="ml-2 shrink-0"
                        >
                          <XCircle className="h-4 w-4 text-red-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "text-xs leading-relaxed",
                      isCorrect ? "text-emerald-400/80" : "text-muted-foreground/65"
                    )}
                  >
                    {question.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
