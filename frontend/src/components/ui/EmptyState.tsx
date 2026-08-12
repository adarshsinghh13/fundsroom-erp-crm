import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center sm:p-12 ${className}`}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 ring-4 ring-ink-50 mb-4">
        <Icon size={24} className="text-ink-400" />
      </div>
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-ink-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
