import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-ink-900 tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
}
