"use client";
import React from "react";
import { motion, MotionProps } from "motion/react";

import { cn } from "@/lib/utils";

interface GradientTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

function GradientText({
  className,
  children,
  as: Component = "span",
  ...props
}: GradientTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={cn(
        "relative inline-flex items-center justify-center bg-transparent",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-400 bg-[length:250%_auto] bg-clip-text text-transparent animate-gradient-shift">
        {children}
      </span>
      <span className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="pointer-events-none absolute -top-1/2 h-[15vw] w-[15vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] opacity-25 blur-[1.5rem]"></span>
        <span className="pointer-events-none absolute right-0 top-0 h-[15vw] w-[15vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] opacity-25 blur-[1.5rem]"></span>
        <span className="pointer-events-none absolute bottom-0 left-0 h-[15vw] w-[15vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] opacity-25 blur-[1.5rem]"></span>
        <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[15vw] w-[15vw] animate-[gradient-border_6s_ease-in-out_infinite,gradient-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] opacity-25 blur-[1.5rem]"></span>
      </span>
    </MotionComponent>
  );
}

export { GradientText };
