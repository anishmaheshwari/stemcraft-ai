"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function TopicInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: TopicInputProps) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !isLoading) onSubmit();
      }}
      className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Explain packet switching, torque, or sorting with AI..."
        disabled={isLoading}
        className="flex-1"
        aria-label="STEM topic"
      />
      <Button
        type="submit"
        size="lg"
        disabled={!value.trim() || isLoading}
        className="sm:min-w-[120px]"
      >
        {isLoading ? (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            Generating
          </motion.span>
        ) : (
          <>
            Go
            <ArrowRight className="ml-1" />
          </>
        )}
      </Button>
    </motion.form>
  );
}
