import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2";

  const variantStyles = {
    primary: "bg-[var(--color-primary)] text-white hover:opacity-90 focus:ring-[var(--color-primary)]",
    secondary: "bg-[var(--color-surface)] text-[var(--color-text-main)] hover:opacity-80 focus:ring-[var(--color-primary)]",
    outline: "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] focus:ring-[var(--color-primary)]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

