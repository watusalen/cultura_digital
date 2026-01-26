import type { ReactNode } from "react";
import { Button } from "./Button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, onBack, backLabel = "Voltar", actions }: PageHeaderProps) {
  return (
    <header className="row align-center mb-4">
      <div className="max">
        <h5 className="no-margin">{title}</h5>
        {subtitle && <p className="small no-margin">{subtitle}</p>}
      </div>
      {actions}
      {onBack && (
        <Button variant="border" onClick={onBack} icon="arrow_back">
          {backLabel}
        </Button>
      )}
    </header>
  );
}
