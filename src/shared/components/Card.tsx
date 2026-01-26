import type { ReactNode, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  icon?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function Card({ title, icon, children, actions, className = "", ...props }: CardProps) {
  return (
    <article className={className} {...props}>
      {(title || icon) && (
        <div className="row align-center">
          {icon && <i className="large">{icon}</i>}
          {title && <h5 className="max">{title}</h5>}
        </div>
      )}
      <div className="padding">
        {children}
        {actions && (
          <nav className="right-align mt-4">
            {actions}
          </nav>
        )}
      </div>
    </article>
  );
}
