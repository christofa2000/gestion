/**
 * Página: Editar Profesional
 *
 * Formulario para editar un profesional existente
 */

import { canAccessAdmin, getClubId } from "@/lib/auth";
import { getUser, createClient } from "@repo/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ProfesionalForm } from "../../components/ProfesionalForm";

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarProfesionalPage({ params }: PageProps) {
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

  // Obtener datos del profesional
  const supabase = await createClient()
  
  const { data: profesional, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', params.id)
    .eq('club_id', clubId)
    .single()

  if (error || !profesional) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/profesionales/${params.id}`}>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">Editar Profesional</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Modifica los datos del profesional
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <ProfesionalForm 
          profesionalId={params.id}
          initialData={{
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            email: profesional.email || undefined,
            telefono: profesional.telefono || undefined,
            especialidad: profesional.especialidad || undefined,
            estado: profesional.estado as 'activo' | 'inactivo' | 'licencia',
          }}
        />
      </div>
    </div>
  );
}

