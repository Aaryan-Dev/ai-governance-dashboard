import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-ink text-surface hover:opacity-90",
        outline: "border border-border bg-surface text-ink hover:bg-wash",
        ghost: "text-ink-2 hover:bg-wash hover:text-ink",
        danger: "border border-border text-critical-text hover:bg-wash",
      },
      size: { sm: "h-7 px-2.5 text-xs", md: "h-9 px-3.5" },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(button({ variant, size }), className)} {...props} />;
}
