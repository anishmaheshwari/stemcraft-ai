"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function TopicInput({ value, onChange, onSubmit, isLoading = false }: TopicInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !isLoading) onSubmit();
      }}
      className="w-full max-w-2xl"
    >
      {/* Container with animated focus glow */}
      <motion.div
        className="relative flex items-center rounded-2xl border border-white/10 bg-secondary/40 backdrop-blur-md transition-colors duration-300 focus-within:border-primary/50 focus-within:bg-secondary/60"
        animate={{
          boxShadow: isFocused
            ? "0 0 0 3px hsl(160 84% 39% / 0.15), 0 0 24px hsl(160 84% 39% / 0.12)"
            : "0 0 0 0px hsl(160 84% 39% / 0)",
        }}
        transition={{ duration: 0.25 }}
      >
        {/* AI icon */}
        <div className="flex shrink-0 items-center pl-4 pr-3">
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </motion.div>
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g. Binary Search, Projectile Motion, Neural Networks..."
          disabled={isLoading}
          aria-label="STEM topic"
          className="flex-1 bg-transparent py-4 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none disabled:cursor-not-allowed"
        />

        <div className="shrink-0 pr-2 py-2">
          <motion.div
            whileHover={!value.trim() || isLoading ? {} : { scale: 1.03 }}
            whileTap={!value.trim() || isLoading ? {} : { scale: 0.97 }}
          >
            <Button
              type="submit"
              size="sm"
              disabled={!value.trim() || isLoading}
              className="relative min-w-[100px] rounded-xl bg-primary text-primary-foreground overflow-hidden transition-all duration-200 hover:bg-primary/90 disabled:opacity-40"
              style={
                value.trim() && !isLoading
                  ? { boxShadow: "0 0 16px hsl(160 84% 39% / 0.35)" }
                  : {}
              }
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </span>
                  <span>Crafting</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Generate
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}

              {/* Shimmer on active button */}
              {value.trim() && !isLoading && (
                <motion.span
                  className="absolute inset-0"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {!isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-center text-xs text-muted-foreground/50"
        >
          Press Enter or click Generate — AI lesson ready in ~15s
        </motion.p>
      )}
    </motion.form>
  );
}
