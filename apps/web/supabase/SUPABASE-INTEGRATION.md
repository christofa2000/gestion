# 🔌 INTEGRACIÓN SUPABASE + NEXT.JS

## Guía completa de integración del backend Supabase con el frontend Next.js

---

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Cliente de Supabase](#cliente-de-supabase)
3. [Tipos TypeScript](#tipos-typescript)
4. [Funciones CRUD](#funciones-crud)
5. [Autenticación](#autenticación)
6. [Hooks Personalizados](#hooks-personalizados)
7. [Server Components](#server-components)
8. [API Routes](#api-routes)
9. [Realtime](#realtime)

---

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install -D @supabase/supabase-js
```

### 2. Variables de Entorno

Crea `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### 3. Estructura de Carpetas Recomendada

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente para navegador
│   │   ├── server.ts           # Cliente para server
│   │   ├── types.ts            # Tipos generados
│   │   └── queries/            # Queries reutilizables
│   │       ├── students.ts
│   │       ├── bookings.ts
│   │       ├── payments.ts
│   │       └── time-slots.ts
├── hooks/
│   ├── useUser.ts
│   ├── useClub.ts
│   ├── useStudents.ts
│   └── useBookings.ts
└── app/
    ├── api/
    │   └── webhooks/
    └── (dashboard)/
        ├── students/
        ├── bookings/
        └── payments/
```

---

## 🔧 Cliente de Supabase

### Cliente para Navegador (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export para uso directo
export const supabase = createClient()
```

### Cliente para Server Components (`lib/supabase/server.ts`)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El `set` puede fallar en Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El `remove` puede fallar en Server Components
          }
        },
      },
    }
  )
}
```

### Cliente Administrativo (`lib/supabase/admin.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Cliente con service_role para operaciones administrativas
// ⚠️ SOLO usar en server-side, NUNCA exponer en cliente
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

---

## 📐 Tipos TypeScript

### Generar Tipos desde la Base de Datos

```bash
# Instalar CLI de Supabase
npm install -D supabase

# Login
npx supabase login

# Generar tipos
npx supabase gen types typescript --project-id "tu-project-id" > src/lib/supabase/types.ts
```

### Tipos Extendidos (`lib/supabase/types.ts`)

Después de generar los tipos base, agrega tipos útiles:

```typescript
export type { Database } from './generated-types'
import type { Database } from './generated-types'

// Tipos de tablas
export type Club = Database['public']['Tables']['clubs']['Row']
export type ClubInsert = Database['public']['Tables']['clubs']['Insert']
export type ClubUpdate = Database['public']['Tables']['clubs']['Update']

export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type TimeSlot = Database['public']['Tables']['time_slots']['Row']
export type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert']
export type TimeSlotUpdate = Database['public']['Tables']['time_slots']['Update']

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']

// Tipos con relaciones
export type StudentWithBookings = Student & {
  bookings: (Booking & {
    time_slot: TimeSlot & {
      activity: Activity
      professional: Professional
    }
  })[]
}

export type TimeSlotWithDetails = TimeSlot & {
  activity: Activity
  branch: Branch
  professional: Professional
  bookings: (Booking & {
    student: Student
  })[]
}

// Enums
export type UserRole = 'SUPER_ADMIN' | 'CLUB_ADMIN' | 'PROFESSIONAL' | 'STUDENT'
export type BookingStatus = 'reservado' | 'cancelado' | 'ausente' | 'presente' | 'confirmado'
export type StudentStatus = 'activo' | 'inactivo' | 'rechazado' | 'pendiente'
```

---

## 🔨 Funciones CRUD

### Students (`lib/supabase/queries/students.ts`)

```typescript
import { createClient } from '../client'
import type { Student, StudentInsert, StudentUpdate } from '../types'

// Obtener todos los estudiantes del club
export async function getStudents() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Student[]
}

// Obtener estudiante por ID
export async function getStudentById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      bookings (
        *,
        time_slot:time_slots (
          *,
          activity:activities (*),
          professional:professionals (*)
        )
      ),
      payments (
        *,
        category:payment_categories (*),
        method:payment_methods (*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Buscar estudiantes
export async function searchStudents(query: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%,email.ilike.%${query}%,numero_documento.ilike.%${query}%`)
    .limit(20)
  
  if (error) throw error
  return data as Student[]
}

// Crear estudiante
export async function createStudent(student: StudentInsert) {
  const supabase = createClient()
  
  // Obtener club_id del usuario actual
  const { data: userData } = await supabase.auth.getUser()
  const { data: userClub } = await supabase
    .from('users')
    .select('club_id')
    .eq('auth_user_id', userData.user?.id)
    .single()
  
  const { data, error } = await supabase
    .from('students')
    .insert({
      ...student,
      club_id: userClub?.club_id
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Student
}

// Actualizar estudiante
export async function updateStudent(id: string, updates: StudentUpdate) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Student
}

// Eliminar estudiante
export async function deleteStudent(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Estudiantes con certificado vencido
export async function getStudentsWithExpiredCertificate() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('estado', 'activo')
    .lt('certificado_vencimiento', new Date().toISOString())
    .order('certificado_vencimiento', { ascending: true })
  
  if (error) throw error
  return data as Student[]
}
```

### Time Slots (`lib/supabase/queries/time-slots.ts`)

```typescript
import { createClient } from '../client'
import type { TimeSlot, TimeSlotInsert, TimeSlotWithDetails } from '../types'

// Obtener turnos disponibles
export async function getAvailableTimeSlots(startDate?: string, endDate?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('time_slots')
    .select(`
      *,
      activity:activities (*),
      branch:branches (*),
      professional:professionals (*),
      bookings (count)
    `)
    .eq('estado', 'activo')
    .gte('cupo_maximo', 'cupo_actual')
  
  if (startDate) {
    query = query.gte('fecha', startDate)
  }
  
  if (endDate) {
    query = query.lte('fecha', endDate)
  }
  
  const { data, error } = await query.order('fecha').order('hora_inicio')
  
  if (error) throw error
  return data as TimeSlotWithDetails[]
}

// Obtener turnos de un profesional
export async function getProfessionalTimeSlots(professionalId: string, fecha?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('time_slots')
    .select(`
      *,
      activity:activities (*),
      branch:branches (*),
      bookings (
        *,
        student:students (*)
      )
    `)
    .eq('professional_id', professionalId)
  
  if (fecha) {
    query = query.eq('fecha', fecha)
  }
  
  const { data, error } = await query.order('fecha').order('hora_inicio')
  
  if (error) throw error
  return data
}

// Crear turno
export async function createTimeSlot(slot: TimeSlotInsert) {
  const supabase = createClient()
  
  const { data: userData } = await supabase.auth.getUser()
  const { data: userClub } = await supabase
    .from('users')
    .select('club_id')
    .eq('auth_user_id', userData.user?.id)
    .single()
  
  const { data, error } = await supabase
    .from('time_slots')
    .insert({
      ...slot,
      club_id: userClub?.club_id
    })
    .select()
    .single()
  
  if (error) throw error
  return data as TimeSlot
}

// Cancelar turno
export async function cancelTimeSlot(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('time_slots')
    .update({ estado: 'cancelado' })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as TimeSlot
}
```

### Bookings (`lib/supabase/queries/bookings.ts`)

```typescript
import { createClient } from '../client'
import type { Booking, BookingInsert } from '../types'

// Crear reserva
export async function createBooking(booking: BookingInsert) {
  const supabase = createClient()
  
  // Verificar cupo disponible
  const { data: slot } = await supabase
    .from('time_slots')
    .select('cupo_maximo, cupo_actual')
    .eq('id', booking.slot_id)
    .single()
  
  if (slot && slot.cupo_actual >= slot.cupo_maximo) {
    throw new Error('No hay cupos disponibles')
  }
  
  const { data: userData } = await supabase.auth.getUser()
  const { data: userClub } = await supabase
    .from('users')
    .select('club_id')
    .eq('auth_user_id', userData.user?.id)
    .single()
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...booking,
      club_id: userClub?.club_id
    })
    .select(`
      *,
      time_slot:time_slots (
        *,
        activity:activities (*),
        branch:branches (*),
        professional:professionals (*)
      ),
      student:students (*)
    `)
    .single()
  
  if (error) throw error
  return data
}

// Cancelar reserva
export async function cancelBooking(id: string, motivo?: string) {
  const supabase = createClient()
  
  const { data: userData } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('bookings')
    .update({
      estado: 'cancelado',
      cancelado_por: userData.user?.id,
      cancelado_en: new Date().toISOString(),
      motivo_cancelacion: motivo
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Booking
}

// Obtener reservas de un estudiante
export async function getStudentBookings(studentId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      time_slot:time_slots (
        *,
        activity:activities (*),
        branch:branches (*),
        professional:professionals (*)
      )
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Registrar asistencia
export async function markAttendance(bookingId: string, presente: boolean) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .update({
      estado: presente ? 'presente' : 'ausente',
      asistencia_registrada: true
    })
    .eq('id', bookingId)
    .select()
    .single()
  
  if (error) throw error
  return data as Booking
}
```

### Payments (`lib/supabase/queries/payments.ts`)

```typescript
import { createClient } from '../client'
import type { Payment, PaymentInsert } from '../types'

// Crear pago
export async function createPayment(payment: PaymentInsert) {
  const supabase = createClient()
  
  const { data: userData } = await supabase.auth.getUser()
  const { data: userClub } = await supabase
    .from('users')
    .select('club_id, id')
    .eq('auth_user_id', userData.user?.id)
    .single()
  
  const { data, error } = await supabase
    .from('payments')
    .insert({
      ...payment,
      club_id: userClub?.club_id,
      registrado_por: userClub?.id
    })
    .select(`
      *,
      student:students (*),
      category:payment_categories (*),
      method:payment_methods (*)
    `)
    .single()
  
  if (error) throw error
  return data
}

// Obtener pagos de un estudiante
export async function getStudentPayments(studentId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      category:payment_categories (*),
      method:payment_methods (*)
    `)
    .eq('student_id', studentId)
    .order('fecha_pago', { ascending: false })
  
  if (error) throw error
  return data
}

// Reporte de pagos por período
export async function getPaymentsByPeriod(startDate: string, endDate: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      student:students (nombre, apellido),
      category:payment_categories (nombre),
      method:payment_methods (nombre)
    `)
    .gte('fecha_pago', startDate)
    .lte('fecha_pago', endDate)
    .eq('estado', 'completado')
    .order('fecha_pago', { ascending: false })
  
  if (error) throw error
  return data
}
```

---

## 🔐 Autenticación

### Auth Helper (`lib/supabase/auth.ts`)

```typescript
import { createClient } from './client'
import type { UserRole } from './types'

// Obtener usuario actual con datos extendidos
export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: userData } = await supabase
    .from('users')
    .select(`
      *,
      club:clubs (*)
    `)
    .eq('auth_user_id', user.id)
    .single()
  
  return { ...user, userData }
}

// Verificar rol
export async function checkUserRole(requiredRoles: UserRole[]) {
  const user = await getCurrentUser()
  if (!user?.userData) return false
  
  return requiredRoles.includes(user.userData.role as UserRole)
}

// Login
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

// Registro
export async function signUp(
  email: string, 
  password: string,
  userData: {
    nombre: string
    apellido: string
    club_id: string
    role: UserRole
  }
) {
  const supabase = createClient()
  
  // 1. Crear usuario en auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })
  
  if (authError) throw authError
  if (!authData.user) throw new Error('Error al crear usuario')
  
  // 2. Crear registro en tabla users
  const { error: userError } = await supabase
    .from('users')
    .insert({
      auth_user_id: authData.user.id,
      email,
      ...userData
    })
  
  if (userError) {
    // Si falla, eliminar usuario de auth
    await supabase.auth.admin.deleteUser(authData.user.id)
    throw userError
  }
  
  return authData
}

// Logout
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Recuperar contraseña
export async function resetPassword(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  
  if (error) throw error
}
```

---

## 🎣 Hooks Personalizados

### `hooks/useUser.ts`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/supabase/auth'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
    
    // Suscribirse a cambios de auth
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  return { user, loading, isAdmin: user?.userData?.role === 'CLUB_ADMIN' || user?.userData?.role === 'SUPER_ADMIN' }
}
```

### `hooks/useStudents.ts`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getStudents } from '@/lib/supabase/queries/students'
import type { Student } from '@/lib/supabase/types'

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents()
        setStudents(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStudents()
  }, [])
  
  const refetch = async () => {
    setLoading(true)
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }
  
  return { students, loading, error, refetch }
}
```

---

## 🖥️ Server Components

### Ejemplo: Página de Estudiantes

```typescript
// app/(dashboard)/students/page.tsx
import { createClient } from '@/lib/supabase/server'
import { StudentsList } from './students-list'

export default async function StudentsPage() {
  const supabase = createClient()
  
  // Obtener datos en el servidor
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })
  
  return (
    <div>
      <h1>Estudiantes</h1>
      <StudentsList initialStudents={students || []} />
    </div>
  )
}
```

---

## 🚀 API Routes

### Webhook de Pagos

```typescript
// app/api/webhooks/payments/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    
    // Crear pago
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert({
        student_id: payload.student_id,
        categoria_id: payload.categoria_id,
        medio_pago_id: payload.medio_pago_id,
        monto: payload.monto,
        fecha_pago: payload.fecha_pago
      })
    
    if (error) throw error
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al procesar pago' },
      { status: 500 }
    )
  }
}
```

---

## 🔴 Realtime

### Suscripción a Cambios en Tiempo Real

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Booking } from '@/lib/supabase/types'

export function useRealtimeBookings(slotId: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  
  useEffect(() => {
    const supabase = createClient()
    
    // Cargar datos iniciales
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('slot_id', slotId)
      
      if (data) setBookings(data)
    }
    
    fetchBookings()
    
    // Suscribirse a cambios
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `slot_id=eq.${slotId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [...prev, payload.new as Booking])
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => 
              prev.map(b => b.id === payload.new.id ? payload.new as Booking : b)
            )
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [slotId])
  
  return bookings
}
```

---

## ✅ Mejores Prácticas

1. **Nunca exponer service_role_key en el cliente**
2. **Usar RLS para toda la seguridad**
3. **Cachear datos cuando sea posible**
4. **Manejar errores apropiadamente**
5. **Usar tipos de TypeScript siempre**
6. **Implementar loading y error states**
7. **Usar Server Components cuando sea posible**

---

**🎉 ¡Listo para integrar Supabase con Next.js!**

