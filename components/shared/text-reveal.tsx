import { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextRevealProps<T extends ElementType> = {
  as?: T;
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  step?: number;
  soft?: boolean;
};

export function TextReveal<T extends ElementType = "div">({
  as,
  lines,
  className,
  lineClassName,
  delay = 0,
  step = 0.08,
  soft = false
}: TextRevealProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          className={cn("text-reveal-line", soft && "text-reveal-soft", lineClassName)}
          style={
            {
              "--delay": `${delay + index * step}s`
            } as CSSProperties
          }
        >
          {line}
        </span>
      ))}
    </Component>
  );
}
