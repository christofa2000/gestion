/**
 * Página: Editar Sede
 *
 * Formulario para editar una sede existente
 */

import { canAccessAdmin, getClubId } from "@/lib/auth";
import { getUser, createClient } from "@repo/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { SedeForm } from "../../components/SedeForm";

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarSedePage({ params }: PageProps) {
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

  // Obtener datos de la sede
  const supabase = await createClient()
  
  const { data: sede, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', params.id)
    .eq('id', clubId)
    .single()

  if (error || !sede) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/sedes/${params.id}`}>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">Editar Sede</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Modifica los datos de la sede
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <SedeForm 
          sedeId={params.id}
          initialData={{
            nombre: sede.nombre,
            telefono: sede.telefono || undefined,
            email: sede.email || undefined,
            direccion: sede.direccion || undefined,
            theme: sede.theme as 'theme-sky' | 'theme-sport' | 'theme-neutral' | undefined,
            activa: sede.activa,
          }}
        />
      </div>
    </div>
  );
}

