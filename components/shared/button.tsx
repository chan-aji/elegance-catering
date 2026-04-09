import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[0.92rem] font-semibold tracking-[0.01em] transition-all duration-300 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#2f7f34_0%,#3d9647_100%)] text-white shadow-[0_16px_32px_rgba(30,73,33,0.18)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(30,73,33,0.24)]",
        variant === "secondary" &&
          "border border-brand-700/10 bg-white/88 text-ink shadow-card hover:-translate-y-0.5 hover:border-brand-700/15 hover:bg-white hover:shadow-[0_18px_36px_rgba(25,56,28,0.12)]",
        variant === "outline" &&
          "border border-brand-700/18 bg-white/35 text-brand-800 hover:-translate-y-0.5 hover:bg-brand-100/90 hover:shadow-card",
        variant === "ghost" &&
          "bg-transparent text-ink hover:bg-brand-100/70",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
