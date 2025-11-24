/**
 * Página: Editar Cliente
 * 
 * Formulario para editar un cliente existente
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, getUser } from '@repo/supabase/server'
import { canAccessAdmin, getClubId } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import { ClientForm } from '../../components/ClientForm'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarClientePage({ params }: PageProps) {
  // Verificar autenticación y permisos
  const user = await getUser()
  
  if (!user || !canAccessAdmin(user)) {
    redirect('/auth/login')
  }

  const clubId = getClubId(user)
  
  if (!clubId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: No se pudo obtener el club del usuario</p>
        </div>
      </div>
    )
  }

  // Obtener datos del cliente
  const supabase = await createClient()
  
  const { data: cliente, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', params.id)
    .eq('club_id', clubId)
    .single()

  if (error || !cliente) {
    notFound()
  }

  // Transformar datos para el formulario
  const initialData = {
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    apodo: cliente.apodo || '',
    telefono: cliente.telefono || '',
    email: cliente.email || '',
    contacto_emergencia: cliente.contacto_emergencia || '',
    telefono_emergencia: cliente.telefono_emergencia || '',
    fecha_nacimiento: cliente.fecha_nacimiento || '',
    genero: cliente.genero || '',
    tipo_documento: cliente.tipo_documento || 'DNI',
    numero_documento: cliente.numero_documento || '',
    ocupacion: cliente.ocupacion || '',
    obra_social: cliente.obra_social || '',
    direccion: cliente.direccion || '',
    codigo_postal: cliente.codigo_postal || '',
    ciudad: cliente.ciudad || '',
    provincia: cliente.provincia || '',
    numero_cliente: cliente.numero_cliente || '',
    estado: cliente.estado as 'activo' | 'inactivo' | 'pendiente' | 'rechazado',
    observaciones: cliente.observaciones || '',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/clientes/${params.id}`}>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
            Editar Cliente
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            {cliente.nombre} {cliente.apellido}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6">
        <ClientForm 
          clubId={clubId} 
          initialData={initialData}
          clienteId={params.id}
        />
      </div>
    </div>
  )
}




