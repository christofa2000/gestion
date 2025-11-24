"use client";

import { useState } from "react";
import { Zap, Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  closableTabs?: string[];
}

export function DashboardTabs({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  closableTabs = [],
}: DashboardTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isClosable = closableTabs.includes(tab.id);

        return (
          <div
            key={tab.id}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all relative",
              isActive
                ? "bg-[var(--color-primary)] text-white shadow-md"
                : "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface)]"
            )}
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
            {isClosable && onTabClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={cn(
                  "ml-2 p-0.5 rounded hover:bg-white/20 transition-colors",
                  isActive ? "text-white" : "text-[var(--color-text-muted)]"
                )}
                aria-label={`Cerrar ${tab.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

