"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminNavItem } from "./admin-nav-item";
import { ClubLogo } from "./club-logo";

interface SidebarItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface AppSidebarProps {
  items: SidebarItem[];
  clubName?: string;
  clubLogo?: string;
}

export function AppSidebar({ items, clubName = "Club Deportivo", clubLogo }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 border-r flex flex-col"
      style={{
        backgroundColor: "var(--color-sidebar-bg)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
        <div className="flex items-center gap-3">
          <ClubLogo src={clubLogo} size="md" />
          <div>
            <h2 className="font-semibold text-lg" style={{ color: "var(--color-text-main)" }}>
              {clubName}
            </h2>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Panel Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
        <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
          © 2025 Gestión Multi-Club
        </p>
      </div>
    </aside>
  );
}

