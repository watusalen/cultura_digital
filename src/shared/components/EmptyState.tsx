import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon = "info", action }: EmptyStateProps) {
  return (
    <div className="center-align padding">
      <i className="extra">{icon}</i>
      <h5 className="mt-2">{title}</h5>
      {description && <p className="text-medium">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
