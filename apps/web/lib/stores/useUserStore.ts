/**
 * Store global de autenticación con Zustand
 * 
 * Maneja el estado global del usuario autenticado incluyendo
 * sesión, datos del usuario, rol y club.
 * 
 * Con persistencia en sessionStorage.
 */

'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SupabaseUser, SupabaseSession, UserRole } from '@repo/supabase'

interface UserState {
  // Estado
  user: SupabaseUser | null
  session: SupabaseSession | null
  role: UserRole | null
  clubId: string | null
  
  // Actions
  setUser: (user: SupabaseUser | null) => void
  setSession: (session: SupabaseSession | null) => void
  setRole: (role: UserRole | null) => void
  setClubId: (clubId: string | null) => void
  logout: () => void
  
  // Helpers
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  isStudent: () => boolean
  isProfessional: () => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      session: null,
      role: null,
      clubId: null,

      // Setters
      setUser: (user) => {
        set({ user })
        // Extraer role y clubId automáticamente
        if (user) {
          set({
            role: user.user_metadata?.role as UserRole || null,
            clubId: user.user_metadata?.club_id || null
          })
        }
      },

      setSession: (session) => {
        set({ session })
        // Si hay sesión, actualizar usuario
        if (session?.user) {
          set({
            user: session.user as SupabaseUser,
            role: session.user.user_metadata?.role as UserRole || null,
            clubId: session.user.user_metadata?.club_id || null
          })
        }
      },

      setRole: (role) => set({ role }),

      setClubId: (clubId) => set({ clubId }),

      logout: () => {
        set({
          user: null,
          session: null,
          role: null,
          clubId: null
        })
      },

      // Helpers
      isAuthenticated: () => {
        const { session } = get()
        return session !== null
      },

      isAdmin: () => {
        const { role } = get()
        return role === 'CLUB_ADMIN' || role === 'SUPER_ADMIN'
      },

      isSuperAdmin: () => {
        const { role } = get()
        return role === 'SUPER_ADMIN'
      },

      isStudent: () => {
        const { role } = get()
        return role === 'STUDENT'
      },

      isProfessional: () => {
        const { role } = get()
        return role === 'PROFESSIONAL'
      },
    }),
    {
      name: 'user-storage', // Nombre en sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Usar sessionStorage
      partialize: (state) => ({
        // Solo persistir lo necesario
        user: state.user,
        session: state.session,
        role: state.role,
        clubId: state.clubId,
      }),
    }
  )
)




