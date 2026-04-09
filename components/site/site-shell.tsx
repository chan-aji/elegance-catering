import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_24%),linear-gradient(180deg,#347d38_0%,#2b6f2f_100%)] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div
        className={cn(
          "relative mx-auto overflow-hidden rounded-[2rem] border border-white/12 bg-cream shadow-[0_40px_90px_rgba(8,24,11,0.35)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_22%)] before:opacity-80 after:pointer-events-none after:absolute after:-right-16 after:top-24 after:h-56 after:w-56 after:rounded-full after:bg-[radial-gradient(circle,rgba(196,227,198,0.26),transparent_70%)]",
          "max-w-[1320px]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
