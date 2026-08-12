import type { HTMLAttributes } from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "accent";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success-50 text-success-700 ring-success-200",
  warning: "bg-warning-50 text-warning-700 ring-warning-200",
  danger: "bg-danger-50 text-danger-700 ring-danger-200",
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  accent: "bg-accent-50 text-accent-700 ring-accent-200",
};

export function Badge({ children, variant = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-tight ring-1 ring-inset ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
