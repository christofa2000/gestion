/**
 * Panel Admin - Dashboard
 * 
 * V1: Dashboard principal del panel administrativo
 * 
 * Reglas V1:
 * - Solo CLUB_ADMIN, PROFESSIONAL y SUPER_ADMIN pueden acceder (verificado en layout)
 * - Todas las queries deben filtrar por club_id del usuario actual (multi-tenant)
 * - CLUB_ADMIN puede crear alumnos, profesionales y datos de su club
 * - No puede crear otros CLUB_ADMIN (eso es solo SUPER_ADMIN)
 */

"use client";

import { DashboardTabs } from "@/components/admin/DashboardTabs";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import {
  ArrowRight,
  Banknote,
  Building2,
  Cake,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  List,
  RefreshCw,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SedesList } from "./components/SedesList";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [openTabs, setOpenTabs] = useState(["inicio", "agenda"]);

  const tabs = [
    { id: "inicio", label: "Panel de inicio", icon: Zap },
    { id: "agenda", label: "Agenda diaria", icon: Calendar },
  ].filter((tab) => openTabs.includes(tab.id));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: string) => {
    if (tabId === "inicio") return; // No permitir cerrar el tab principal
    setOpenTabs(openTabs.filter((id) => id !== tabId));
    if (activeTab === tabId) {
      setActiveTab("inicio");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <DashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        closableTabs={["agenda"]}
      />
      {/* Contenido según tab activo */}
      {activeTab === "inicio" && (
        <div className="space-y-8">
          {/* Botones de Acción Principales - Estilo Referencia */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/clientes/nuevo" className="contents">
              <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                  <UserPlus className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-main)] text-center">
                  Crear un Cliente
                </span>
              </button>
            </Link>

            <Link href="/admin/clientes" className="contents">
              <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                  <List className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-main)] text-center">
                  Listado de Clientes
                </span>
              </button>
            </Link>

            <Link href="/admin/pagos/nuevo" className="contents">
              <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                  <Banknote className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-main)] text-center">
                  Registrar un pago
                </span>
              </button>
            </Link>

            <Link href="/admin/turnos" className="contents">
              <button className="flex flex-col items-center justify-center p-6 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary)] transition-colors">
                  <CheckCircle className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-[var(--color-text-main)] text-center">
                  Agenda diaria
                </span>
              </button>
            </Link>
          </div>

          {/* Sedes */}
          <SedesList />

          {/* Sección de Notas */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[var(--color-text-main)] mb-2">
                    Notas:
                  </label>
                  <textarea
                    className="w-full min-h-[100px] p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-main)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Escribe tus notas aquí..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-2 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="primary" className="w-full md:w-auto">
                  <Cake className="w-4 h-4 mr-2" />
                  Cumpleaños
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "agenda" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Agenda del Día</CardTitle>
                <Link href="/admin/turnos">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    Ver todo <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horario</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      time: "18:00",
                      activity: "Tenis - Adultos",
                      court: "Cancha 1",
                      prof: "Juan Pérez",
                      status: "confirmed",
                    },
                    {
                      time: "19:00",
                      activity: "Fútbol 5",
                      court: "Cancha Principal",
                      prof: "-",
                      status: "pending",
                    },
                    {
                      time: "19:30",
                      activity: "Tenis - Niños",
                      court: "Cancha 2",
                      prof: "Ana Silva",
                      status: "confirmed",
                    },
                    {
                      time: "20:00",
                      activity: "Padel",
                      court: "Cancha Cristal",
                      prof: "-",
                      status: "cancelled",
                    },
                    {
                      time: "21:00",
                      activity: "Fútbol 7",
                      court: "Cancha Principal",
                      prof: "-",
                      status: "confirmed",
                    },
                  ].map((turno, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <Clock size={14} className="text-[var(--color-text-muted)]" />
                          {turno.time}
                        </div>
                      </TableCell>
                      <TableCell>{turno.activity}</TableCell>
                      <TableCell>{turno.court}</TableCell>
                      <TableCell>{turno.prof}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            turno.status === "confirmed"
                              ? "success"
                              : turno.status === "pending"
                                ? "warning"
                                : "error"
                          }
                        >
                          {turno.status === "confirmed"
                            ? "Confirmado"
                            : turno.status === "pending"
                              ? "Pendiente"
                              : "Cancelado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
