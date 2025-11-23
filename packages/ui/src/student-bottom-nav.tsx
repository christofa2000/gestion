"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface StudentBottomNavProps {
  items: NavItem[];
}

export function StudentBottomNav({ items }: StudentBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around z-10 md:hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
          >
            <span style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)" }}>
              {item.icon}
            </span>
            <span
              className="text-xs mt-1"
              style={{
                color: isActive ? "var(--color-primary)" : "var(--color-text-muted)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

