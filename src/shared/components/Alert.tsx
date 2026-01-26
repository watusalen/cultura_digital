import { ReactNode } from "react";

type AlertProps = {
  type?: "info" | "success" | "warning" | "error" | "primary";
  title?: string;
  children: ReactNode;
  icon?: string;
  className?: string;
};

export function Alert({ type = "info", title, children, icon, className = "" }: AlertProps) {
  const colorClass = {
    info: "blue",
    success: "green",
    warning: "amber",
    error: "red",
    primary: "primary-container",
  }[type];

  const defaultIcon = {
    info: "info",
    success: "check_circle",
    warning: "warning",
    error: "error",
    primary: "info",
  }[type];

  return (
    <article className={`${colorClass} container ${className}`}>
      <div className="row">
        <i>{icon || defaultIcon}</i>
        <div className="max">
          {title && <h6 className="no-margin">{title}</h6>}
          <div className="no-margin">{children}</div>
        </div>
      </div>
    </article>
  );
}
