/**
 * API Route: Crear Usuario Admin
 * 
 * Solo SUPER_ADMIN puede ejecutar esta acción.
 * Crea un usuario ADMIN para un club existente.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@repo/supabase/server'
import { getUser } from '@repo/supabase/server'
import { isSuperAdmin } from '@/lib/auth'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario es SUPER_ADMIN
    const user = await getUser()
    if (!user || !isSuperAdmin(user)) {
      return NextResponse.json(
        { error: 'No autorizado. Solo SUPER_ADMIN puede crear usuarios admin.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { clubId, nombre, apellido, email, password, telefono } = body

    // Validar datos requeridos
    if (!clubId || !nombre || !apellido || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el club existe
    const supabase = await createClient()
    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('id, nombre')
      .eq('id', clubId)
      .single()

    if (clubError || !club) {
      return NextResponse.json(
        { error: 'El club no existe' },
        { status: 404 }
      )
    }

    // Crear cliente admin para operaciones de auth
    const supabaseAdminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY no está configurada' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createAdminClient(supabaseAdminUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nombre,
        apellido,
        role: 'CLUB_ADMIN',
        club_id: clubId,
      },
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: `Error al crear el usuario: ${authError.message}` },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario en Auth' },
        { status: 500 }
      )
    }

    // Crear el registro en la tabla users
    const { error: userError } = await supabase
      .from('users')
      .insert({
        auth_user_id: authData.user.id,
        club_id: clubId,
        role: 'CLUB_ADMIN',
        nombre,
        apellido,
        email,
        telefono: telefono || null,
        activo: true,
      })

    if (userError) {
      // Si falla, eliminar el usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      console.error('Error creating user record:', userError)
      return NextResponse.json(
        { error: `Error al crear el registro de usuario: ${userError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email,
          nombre,
          apellido,
        },
        club: {
          id: club.id,
          nombre: club.nombre,
        }
      }
    })

  } catch (error) {
    const err = error as Error
    console.error('Error in create-user-admin:', err)
    return NextResponse.json(
      { error: err.message || 'Error al crear el usuario' },
      { status: 500 }
    )
  }
}

