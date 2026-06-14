"use client";

import { motion } from "framer-motion";
import { Monitor, Atom } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryPillsProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

const CATEGORIES: { id: Category; label: string; icon: typeof Monitor; color: string; activeClass: string }[] = [
  {
    id: "cs",
    label: "Computer Science",
    icon: Monitor,
    color: "text-emerald-400",
    activeClass: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_16px_hsl(160_84%_39%_/_0.2)]",
  },
  {
    id: "physics",
    label: "Physics",
    icon: Atom,
    color: "text-sky-400",
    activeClass: "border-sky-500/50 bg-sky-500/10 text-sky-300 shadow-[0_0_16px_hsl(199_89%_48%_/_0.2)]",
  },
];

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {CATEGORIES.map((category) => {
        const isActive = selected === category.id;
        const Icon = category.icon;
        return (
          <motion.button
            key={category.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -1 }}
            onClick={() => onSelect(isActive ? null : category.id)}
            className={cn(
              "flex min-h-[40px] items-center gap-2.5 rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? category.activeClass
                : "border-white/10 bg-secondary/50 text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", isActive ? "" : category.color)} />
            {category.label}
            {isActive && (
              <motion.span
                layoutId="category-check"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-current/20 text-[10px]"
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
