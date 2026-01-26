import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "fill" | "outline" | "transparent" | "border"; 
  color?: string; // e.g. "primary", "secondary", "error"
  icon?: string;
  loading?: boolean;
};

export function Button({ 
  children, 
  variant = "fill", 
  color = "", 
  icon, 
  loading, 
  className = "", 
  ...props 
}: ButtonProps) {
  return (
    <button className={`${variant} ${color} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <i>sync</i> : (icon && <i>{icon}</i>)}
      <span>{children}</span>
    </button>
  );
}
