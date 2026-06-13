"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryPillsProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "cs", label: "Computer Science" },
  { id: "physics", label: "Physics" },
];

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {CATEGORIES.map((category) => {
        const isActive = selected === category.id;
        return (
          <motion.button
            key={category.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              onSelect(isActive ? null : category.id)
            }
            className={cn(
              "min-h-[44px] rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            {category.label}
          </motion.button>
        );
      })}
    </div>
  );
}
