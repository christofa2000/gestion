"use client";

import * as React from "react";
import Link from "next/link";
import { clsx } from "clsx";

interface AdminNavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

export function AdminNavItem({ href, icon, label, isActive = false, isCollapsed = false }: AdminNavItemProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-text-muted hover:bg-surface hover:text-text-main",
        isCollapsed && "justify-center px-2"
      )}
    >
      <span className={clsx("flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-text-muted group-hover:text-text-main")}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 20 }) : icon}
      </span>
      
      {!isCollapsed && (
        <span className="text-sm truncate">{label}</span>
      )}
      
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
}
