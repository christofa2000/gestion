import React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", fullWidth = true, startIcon, ...props }, ref) => {
    return (
      <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
        {label && (
          <label className="text-sm font-medium text-text-main">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              "h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-error focus:ring-error/20" : "border-border-subtle focus:border-primary",
              startIcon && "pl-10"
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
