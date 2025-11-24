/**
 * API Route: Logout
 * 
 * Cierra la sesión del usuario y limpia las cookies.
 */

import { createClient } from '@repo/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Redirigir al login
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { error: err.message || 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // También permitir GET para facilitar testing
  return POST()
}

