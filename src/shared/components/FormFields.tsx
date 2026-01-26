import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
  className?: string;
  error?: string;
};

function FieldWrapper({ label, children, className = "", error }: FieldWrapperProps) {
  return (
    <div className={`field border label ${className} ${error ? "invalid" : ""}`}>
      {children}
      <label>{label}</label>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

export function Input({ label, className = "", error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string, error?: string }) {
  return (
    <FieldWrapper label={label} className={className} error={error}>
      <input placeholder=" " {...props} />
    </FieldWrapper>
  );
}

export function Textarea({ label, className = "", error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }) {
  return (
    <FieldWrapper label={label} className={`textarea ${className}`} error={error}>
      <textarea placeholder=" " {...props} />
    </FieldWrapper>
  );
}

export function Select({ label, children, className = "", error, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string, error?: string }) {
  return (
    <FieldWrapper label={label} className={className} error={error}>
      <select {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}
