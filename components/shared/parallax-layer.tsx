"use client";

import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function ParallaxLayer({
  children,
  className,
  speed = 18,
  mobileFactor = 0.42
}: {
  children?: ReactNode;
  className?: string;
  speed?: number;
  mobileFactor?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const element = ref.current;

    if (!element) return;

    const update = () => {
      frame = 0;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
      const progress = Math.max(-1, Math.min(1, centerOffset / viewportHeight));
      const factor = window.innerWidth < 768 ? mobileFactor : 1;
      const y = progress * speed * factor * -1;

      element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      element.style.transform = "";
    };
  }, [mobileFactor, speed]);

  return <div ref={ref} className={cn("will-change-transform", className)}>{children}</div>;
}
