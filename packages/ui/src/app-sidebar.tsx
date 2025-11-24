"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminNavItem } from "./admin-nav-item";
import { ClubLogo } from "./club-logo";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface AppSidebarProps {
  items: SidebarItem[];
  clubName?: string;
  clubLogo?: string;
  className?: string;
}

export function AppSidebar({ items, clubName = "Club Deportivo", clubLogo, className }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-full border-r border-border-subtle bg-surface flex flex-col transition-all duration-300 z-20",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className={clsx("flex items-center gap-3 h-16 border-b border-border-subtle transition-all duration-300", isCollapsed ? "px-2 justify-center" : "px-6")}>
        <ClubLogo src={clubLogo} size="sm" />
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h2 className="font-semibold text-sm text-text-main truncate leading-tight">
              {clubName}
            </h2>
            <p className="text-xs text-text-muted truncate">
              Panel Admin
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-surface border border-border-subtle rounded-full p-1 text-text-muted hover:text-primary shadow-sm hidden md:flex"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Footer */}
      <div className={clsx("p-4 border-t border-border-subtle", isCollapsed ? "flex justify-center" : "")}>
        {!isCollapsed ? (
          <p className="text-xs text-center text-text-muted">
            © 2025 Gestión Multi-Club
          </p>
        ) : (
          <span className="text-xs text-text-muted">©</span>
        )}
      </div>
    </aside>
  );
}
