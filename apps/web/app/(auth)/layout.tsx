/**
 * Layout para páginas de autenticación
 * 
 * Este layout envuelve las páginas de login, register y recover.
 * No requiere autenticación.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticación - Gestión Club',
  description: 'Inicia sesión o regístrate en la plataforma de gestión',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
