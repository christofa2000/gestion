"use client";

import * as React from "react";
import { ThemeSwitcher } from "./theme-switcher";
import type { ThemeName } from "@repo/config";
import { clsx } from "clsx";
import { Bell, Search, Menu } from "lucide-react";

interface AppTopbarProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  userName?: string;
  userAvatar?: string;
  onMenuClick?: () => void; // For mobile
}

export function AppTopbar({
  currentTheme,
  onThemeChange,
  userName = "Usuario",
  userAvatar,
  onMenuClick
}: AppTopbarProps) {
  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-64 h-16 border-b border-border-subtle bg-surface/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between z-10 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-text-muted hover:text-text-main"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        
        {/* Search placeholder - could be functional later */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-bg rounded-lg border border-border-subtle text-text-muted focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all w-64">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-muted/70"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative text-text-muted hover:text-text-main transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-error rounded-full ring-2 ring-surface"></span>
        </button>

        <div className="h-6 w-px bg-border-subtle hidden md:block"></div>

        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-medium text-text-main leading-none">
              {userName}
            </span>
            <span className="text-xs text-text-muted mt-1">
              Admin
            </span>
          </div>
          
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-9 w-9 rounded-full object-cover border border-border-subtle"
            />
          ) : (
            <div className="h-9 w-9 rounded-full flex items-center justify-center font-medium text-white bg-primary shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
