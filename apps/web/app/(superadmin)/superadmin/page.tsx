/**
 * Página principal del panel SUPER_ADMIN
 *
 * V1: Dashboard con vista global de todos los clubs y estadísticas.
 *
 * Reglas V1:
 * - Solo SUPER_ADMIN puede acceder (verificado en layout y middleware)
 * - Ve TODOS los clubs sin filtrado por club_id
 * - Puede crear nuevos clubs y usuarios CLUB_ADMIN
 * - Puede crear profesionales globales o asociados a un club
 */

import { isSuperAdmin } from "@/lib/auth";
import { createClient, getUser } from "@repo/supabase/server";
import { Button } from "@repo/ui";
import { Building2, CreditCard, Plus, Shield, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuperAdminPage() {
  const user = await getUser();

  if (!user || !isSuperAdmin(user)) {
    redirect("/auth/login");
  }

  const supabase = await createClient();

  // Obtener estadísticas globales
  const [
    { count: totalClubs },
    { count: totalUsers },
    { count: totalStudents },
    { data: paymentsData },
  ] = await Promise.all([
    supabase.from("clubs").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("monto")
      .gte(
        "fecha_pago",
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      ),
  ]);

  const ingresosMes = paymentsData?.reduce((sum, p) => sum + (p.monto || 0), 0) || 0;

  // Obtener últimos clubs creados
  const { data: recentClubs } = await supabase
    .from("clubs")
    .select("id, nombre, created_at, activa")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">Panel Super Admin</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Gestión global de todos los clubs y usuarios
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/superadmin/clubs/nuevo">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Club
            </Button>
          </Link>
          <Link href="/superadmin/usuarios/nuevo">
            <Button>
              <Shield className="w-4 h-4 mr-2" />
              Crear Admin
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Clubs</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">{totalClubs || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">{totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Alumnos</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">
                {totalStudents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Ingresos del Mes</p>
              <p className="text-3xl font-bold text-[var(--color-text-main)]">
                ${ingresosMes.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Últimos Clubs */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-main)]">
            Últimos Clubs Creados
          </h2>
        </div>
        <div className="p-6">
          {recentClubs && recentClubs.length > 0 ? (
            <div className="space-y-4">
              {recentClubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/superadmin/clubs/${club.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text-main)]">{club.nombre}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Creado: {new Date(club.created_at).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        club.activa ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {club.activa ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)] text-center py-8">
              No hay clubs registrados aún
            </p>
          )}
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/superadmin/clubs">
          <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-main)]">Gestionar Clubs</h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Ver y editar todos los clubs
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/superadmin/usuarios">
          <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-main)]">
                  Gestionar Usuarios Admin
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Crear y administrar usuarios ADMIN
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
