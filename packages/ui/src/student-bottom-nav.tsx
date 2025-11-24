"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface StudentBottomNavProps {
  items: NavItem[];
  className?: string;
}

export function StudentBottomNav({ items, className }: StudentBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={clsx(
        "fixed bottom-0 left-0 right-0 h-16 border-t border-border-subtle bg-surface flex items-center justify-around z-40 md:hidden safe-area-pb",
        className
      )}
    >
      {items.map((item) => {
        // Active if exact match or starts with href (except for root /student which could match everything)
        const isActive = item.href === "/student" 
          ? pathname === item.href 
          : pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors active:scale-95",
              isActive ? "text-primary" : "text-text-muted hover:text-text-main"
            )}
          >
            <span className={clsx("transition-transform", isActive && "scale-110")}>
              {React.isValidElement(item.icon) ? React.cloneElement(item.icon as React.ReactElement, { size: 24 }) : item.icon}
            </span>
            <span
              className={clsx(
                "text-[10px] mt-1 font-medium leading-none",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
