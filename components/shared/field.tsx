import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-brand-700/10 bg-white px-4 text-sm text-ink shadow-sm outline-none transition-all duration-300 placeholder:text-ink/35 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:shadow-[0_14px_30px_rgba(25,56,28,0.08)]",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-brand-700/10 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition-all duration-300 placeholder:text-ink/35 focus:-translate-y-0.5 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:shadow-[0_14px_30px_rgba(25,56,28,0.08)]",
        className
      )}
      {...props}
    />
  );
}
