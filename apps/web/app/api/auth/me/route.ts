/**
 * API Route: Current User Info
 * 
 * Devuelve información del usuario autenticado actual.
 */

import { createClient } from '@repo/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Obtener usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Extraer información importante
    const role = user.user_metadata?.role
    const clubId = user.user_metadata?.club_id

    // Respuesta con datos del usuario
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      role,
      clubId,
      authenticated: true,
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { error: err.message || 'Error al obtener usuario' },
      { status: 500 }
    )
  }
}

