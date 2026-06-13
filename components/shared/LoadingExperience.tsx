"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingExperience() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col gap-6 px-4 py-8"
    >
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm font-medium text-primary"
          >
            Crafting your lesson...
          </motion.p>
          <p className="text-muted-foreground text-sm">
            Generating a polished STEM learning path with visuals and practice.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <Skeleton className="h-64 lg:col-span-2 rounded-[1.5rem]" />
          <Skeleton className="h-64 lg:col-span-3 rounded-[1.5rem]" />
          <Skeleton className="h-40 lg:col-span-5 rounded-[1.5rem]" />
        </div>
      </div>
    </motion.div>
  );
}
