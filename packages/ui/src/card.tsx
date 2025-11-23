import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddingStyles = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-lg shadow-sm ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

