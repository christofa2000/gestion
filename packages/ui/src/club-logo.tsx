"use client";

import * as React from "react";

interface ClubLogoProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function ClubLogo({ src, alt = "Logo del club", size = "md", className = "" }: ClubLogoProps) {
  if (!src) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded-lg flex items-center justify-center font-bold text-white`}
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <span className="text-xl">C</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} ${className} rounded-lg object-cover`}
    />
  );
}

