/**
 * Página: Nuevo Profesional
 *
 * Formulario para crear un nuevo profesional
 */

import { canAccessAdmin, getClubId } from "@/lib/auth";
import { getUser } from "@repo/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfesionalForm } from "../components/ProfesionalForm";

export default async function NuevoProfesionalPage() {
  // Verificar autenticación y permisos
  const user = await getUser();

  if (!user || !canAccessAdmin(user)) {
    redirect("/auth/login");
  }

  const clubId = getClubId(user);

  if (!clubId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: No se pudo obtener el club del usuario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/profesionales">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">Nuevo Profesional</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Completa los datos del nuevo profesional
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <ProfesionalForm />
      </div>
    </div>
  );
}

