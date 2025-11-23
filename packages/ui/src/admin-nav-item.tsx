"use client";

import * as React from "react";
import Link from "next/link";

interface AdminNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export function AdminNavItem({ href, icon, label, isActive = false }: AdminNavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive ? "font-medium" : "font-normal"
      }`}
      style={{
        backgroundColor: isActive ? "var(--color-sidebar-item-active)" : "transparent",
        color: isActive ? "var(--color-primary)" : "var(--color-text-main)",
      }}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

