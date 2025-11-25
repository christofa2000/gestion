/**
 * Header del panel de administración - Rediseñado inspirado en JuegoTenis
 */

"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { useClubStore } from "@/lib/stores/club-store";
import { supabase } from "@repo/supabase/client";
import { Bell, LogOut, ChevronDown, Users, DollarSign, Calendar, Settings, HelpCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ClubLogo } from "@repo/ui";

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  userEmail?: string;
}

export default function AdminHeader({ userName, userRole, userEmail }: AdminHeaderProps) {
  const router = useRouter();
  const { logout } = useUserStore();
  const { currentClub } = useClubStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const clubName = currentClub?.name || "JuegoTenis";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      // Usar window.location en lugar de router para evitar loops
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así redirigir al login
      window.location.href = "/auth/login";
    }
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const navItems = [
    {
      label: "Clientes",
      icon: Users,
      href: "/admin/clientes",
      dropdown: [
        { label: "Listado de Clientes", href: "/admin/clientes" },
        { label: "Crear Cliente", href: "/admin/clientes/nuevo" },
      ],
    },
    {
      label: "Valores",
      icon: DollarSign,
      href: "/admin/pagos",
      dropdown: [
        { label: "Registrar Pago", href: "/admin/pagos/nuevo" },
        { label: "Historial de Pagos", href: "/admin/pagos" },
        { label: "Egresos", href: "/admin/egresos" },
      ],
    },
    {
      label: "Turnos",
      icon: Calendar,
      href: "/admin/turnos",
      dropdown: [
        { label: "Agenda Diaria", href: "/admin/turnos" },
        { label: "Nuevo Turno", href: "/admin/turnos/nuevo" },
      ],
    },
    {
      label: "Configuraciones",
      icon: Settings,
      href: "/admin/configuraciones",
    },
    {
      label: "Ayuda",
      icon: HelpCircle,
      href: "/admin/ayuda",
    },
  ];

  return (
    <header className="bg-[var(--color-primary)] text-white sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-medium text-white/80 uppercase tracking-wide">Admin</div>
            </div>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white hidden md:block">{clubName}</h1>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive = activeDropdown === item.label.toLowerCase();

            return (
              <div key={item.label} className="relative" ref={(el) => (dropdownRefs.current[item.label] = el)}>
                {hasDropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label.toLowerCase())}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isActive ? "rotate-180" : ""}`} />
                    </button>
                    {isActive && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        {item.dropdown!.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: User Info + Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border-2 border-[var(--color-primary)]"></span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 pl-3 border-l border-white/20">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">Usuario: {userName}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-medium backdrop-blur-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
            title="Cerrar sesión"
          >
            <span className="hidden sm:inline">Salir</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
