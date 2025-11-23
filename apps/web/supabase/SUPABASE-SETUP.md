# 🗄️ CONFIGURACIÓN SUPABASE - SISTEMA MULTI-CLUB

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación Paso a Paso](#instalación-paso-a-paso)
4. [Estructura de Tablas](#estructura-de-tablas)
5. [Diagrama ER Visual](#diagrama-er-visual)
6. [Roles y Permisos](#roles-y-permisos)
7. [Configuración de Storage](#configuración-de-storage)
8. [Testing del Sistema](#testing-del-sistema)
9. [Queries Útiles](#queries-útiles)

---

## 📖 Descripción General

Este documento describe la implementación completa del modelo de datos para una **plataforma multi-tenant** de gestión deportiva en Supabase.

### Características Principales

- ✅ **Multi-tenant**: Cada club tiene sus datos completamente aislados
- ✅ **RLS Completo**: Row Level Security configurado para todos los roles
- ✅ **Escalable**: Diseño optimizado con índices y relaciones eficientes
- ✅ **Seguro**: Políticas de acceso granulares por rol
- ✅ **Auditable**: Timestamps y tracking de cambios

### Roles Implementados

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `SUPER_ADMIN` | Administrador global | Todos los clubs |
| `CLUB_ADMIN` | Administrador de club | Solo su club |
| `PROFESSIONAL` | Instructor/Profesor | Turnos y alumnos asignados |
| `STUDENT` | Alumno/Cliente | Solo sus propios datos |

---

## 🔧 Requisitos Previos

- Proyecto de Supabase creado
- PostgreSQL 14+ (viene con Supabase)
- Acceso al SQL Editor de Supabase
- Extensión `uuid-ossp` habilitada (se habilita automáticamente en el script)

---

## 🚀 Instalación Paso a Paso

### Paso 1: Ejecutar el Script Principal

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido completo de `supabase-schema.sql`
5. Ejecuta el script (puede tardar 1-2 minutos)

### Paso 2: Verificar la Instalación

```sql
-- Verificar que todas las tablas se crearon
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Debería devolver 16 tablas:
-- activities, bookings, branches, clubs, expense_categories,
-- expenses, first_contact_sources, notification_settings,
-- payment_categories, payment_methods, payments,
-- professional_activities, professionals, students,
-- time_slots, users
```

### Paso 3: Verificar RLS

```sql
-- Verificar que RLS está habilitado en todas las tablas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Todas deben tener rowsecurity = true
```

### Paso 4: Verificar Seeds

```sql
-- Verificar datos de ejemplo
SELECT nombre FROM clubs;
SELECT nombre FROM activities;
SELECT nombre, apellido FROM professionals;
SELECT nombre, apellido FROM students;

-- Debe devolver el club y datos de ejemplo
```

### Paso 5: Configurar Storage Buckets

En Supabase Dashboard → Storage, crea los siguientes buckets:

```sql
-- Ejecutar en SQL Editor para crear buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('club-logos', 'club-logos', true),
  ('professional-photos', 'professional-photos', true),
  ('student-photos', 'student-photos', false),
  ('medical-certificates', 'medical-certificates', false),
  ('payment-receipts', 'payment-receipts', false);
```

Configura las políticas de storage:

```sql
-- Política para logos de club (público)
CREATE POLICY "Logos públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'club-logos');

-- Política para fotos de profesionales (público)
CREATE POLICY "Fotos profesionales públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'professional-photos');

-- Política para fotos de estudiantes (privado)
CREATE POLICY "Estudiantes pueden ver su foto"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'student-photos' AND
  (auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role IN ('SUPER_ADMIN', 'CLUB_ADMIN')
  ) OR
  (storage.foldername(name))[1] = auth.uid()::text)
);

-- Políticas para certificados médicos
CREATE POLICY "Admin puede ver certificados"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'medical-certificates' AND
  auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role IN ('SUPER_ADMIN', 'CLUB_ADMIN')
  )
);

-- Políticas para comprobantes de pago
CREATE POLICY "Admin puede ver comprobantes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-receipts' AND
  auth.uid() IN (
    SELECT auth_user_id FROM users WHERE role IN ('SUPER_ADMIN', 'CLUB_ADMIN')
  )
);
```

---

## 📊 Estructura de Tablas

### Tabla: `clubs`

**Descripción**: Tabla principal multi-tenant. Cada registro representa un club deportivo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `nombre` | VARCHAR(255) | Nombre del club |
| `logo_url` | TEXT | URL del logo |
| `theme` | VARCHAR(50) | Tema visual (sky/sport/neutral) |
| `direccion` | TEXT | Dirección física |
| `activa` | BOOLEAN | Estado del club |

### Tabla: `users`

**Descripción**: Extensión de auth.users con metadatos y rol.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `auth_user_id` | UUID | FK a auth.users |
| `club_id` | UUID | FK a clubs |
| `role` | VARCHAR(50) | Rol del usuario |
| `nombre` | VARCHAR(255) | Nombre |
| `email` | VARCHAR(255) | Email |

### Tabla: `students`

**Descripción**: Alumnos/clientes del club.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `club_id` | UUID | FK a clubs |
| `numero_cliente` | VARCHAR(50) | Número único de cliente |
| `nombre` | VARCHAR(255) | Nombre |
| `certificado_medico_url` | TEXT | URL del certificado |
| `certificado_vencimiento` | DATE | Fecha de vencimiento |
| `estado` | VARCHAR(50) | Estado (activo/inactivo) |

### Tabla: `time_slots`

**Descripción**: Turnos/clases programadas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `activity_id` | UUID | FK a activities |
| `branch_id` | UUID | FK a branches |
| `professional_id` | UUID | FK a professionals |
| `fecha` | DATE | Fecha del turno |
| `hora_inicio` | TIME | Hora de inicio |
| `cupo_maximo` | INTEGER | Capacidad máxima |
| `cupo_actual` | INTEGER | Reservas actuales |

### Tabla: `bookings`

**Descripción**: Reservas de alumnos en turnos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `slot_id` | UUID | FK a time_slots |
| `student_id` | UUID | FK a students |
| `estado` | VARCHAR(50) | Estado de la reserva |
| `metodo_reserva` | VARCHAR(50) | Origen de la reserva |

### Tabla: `payments`

**Descripción**: Pagos recibidos de alumnos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `student_id` | UUID | FK a students |
| `categoria_id` | UUID | FK a payment_categories |
| `monto` | DECIMAL(10,2) | Monto pagado |
| `fecha_pago` | DATE | Fecha del pago |

---

## 🎨 Diagrama ER Visual

### Relaciones Principales

```
CLUBS (1:N)
  ├─→ USERS
  ├─→ BRANCHES
  ├─→ ACTIVITIES
  ├─→ PROFESSIONALS
  ├─→ STUDENTS
  ├─→ PAYMENT_CATEGORIES
  ├─→ PAYMENT_METHODS
  └─→ EXPENSE_CATEGORIES

PROFESSIONALS (N:N) ←→ ACTIVITIES
  └─→ PROFESSIONAL_ACTIVITIES (tabla intermedia)

TIME_SLOTS depende de:
  ├─→ ACTIVITY (FK)
  ├─→ BRANCH (FK)
  └─→ PROFESSIONAL (FK)

BOOKINGS vincula:
  ├─→ TIME_SLOTS (FK)
  └─→ STUDENTS (FK)

PAYMENTS vincula:
  ├─→ STUDENTS (FK)
  ├─→ PAYMENT_CATEGORIES (FK)
  └─→ PAYMENT_METHODS (FK)

STUDENTS (1:N)
  ├─→ BOOKINGS
  ├─→ PAYMENTS
  └─→ NOTIFICATION_SETTINGS
```

### Flujo de Datos Típico

```
1. CLUB_ADMIN crea un CLUB
   ↓
2. Se agregan BRANCHES, ACTIVITIES, PROFESSIONALS
   ↓
3. Se crean TIME_SLOTS (turnos programados)
   ↓
4. STUDENTS se registran
   ↓
5. STUDENTS hacen BOOKINGS en TIME_SLOTS
   ↓
6. STUDENTS realizan PAYMENTS
   ↓
7. Sistema registra asistencias y estadísticas
```

---

## 🔐 Roles y Permisos

### SUPER_ADMIN

**Permisos:**
- ✅ Acceso total a todos los clubs
- ✅ Crear/editar/eliminar clubs
- ✅ Crear/editar/eliminar usuarios de cualquier club
- ✅ Ver todas las tablas de todos los clubs

**Casos de uso:**
- Administración de la plataforma
- Soporte técnico
- Configuración global

### CLUB_ADMIN

**Permisos:**
- ✅ Acceso total a su club (club_id)
- ✅ Gestión de usuarios de su club
- ✅ Gestión de alumnos, profesionales, turnos
- ✅ Gestión financiera (pagos y gastos)
- ❌ No puede ver/modificar otros clubs

**Casos de uso:**
- Administrador del club deportivo
- Gestión diaria del club

### PROFESSIONAL

**Permisos:**
- ✅ Ver turnos asignados
- ✅ Ver alumnos en sus turnos
- ✅ Registrar asistencias
- ✅ Crear/modificar turnos propios
- ❌ No puede ver datos financieros
- ❌ No puede gestionar otros profesionales

**Casos de uso:**
- Instructor/profesor
- Gestión de clases y alumnos

### STUDENT

**Permisos:**
- ✅ Ver sus propios datos
- ✅ Ver sus reservas
- ✅ Crear/cancelar reservas
- ✅ Ver sus pagos
- ✅ Editar su perfil (limitado)
- ❌ No puede ver otros alumnos
- ❌ No puede ver datos administrativos

**Casos de uso:**
- Cliente/alumno del club
- Autogestión de turnos

---

## 💾 Configuración de Storage

### Estructura de Carpetas Recomendada

```
storage/
├── club-logos/
│   └── {club_id}/
│       └── logo.png
├── professional-photos/
│   └── {professional_id}/
│       └── photo.jpg
├── student-photos/
│   └── {student_id}/
│       └── photo.jpg
├── medical-certificates/
│   └── {student_id}/
│       └── certificado-{date}.pdf
└── payment-receipts/
    └── {payment_id}/
        └── comprobante-{date}.pdf
```

### Ejemplo de Upload desde Frontend

```typescript
// Subir foto de estudiante
const uploadStudentPhoto = async (studentId: string, file: File) => {
  const { data, error } = await supabase.storage
    .from('student-photos')
    .upload(`${studentId}/photo.jpg`, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) throw error;
  
  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('student-photos')
    .getPublicUrl(`${studentId}/photo.jpg`);
    
  // Actualizar registro en DB
  await supabase
    .from('students')
    .update({ foto_url: publicUrl })
    .eq('id', studentId);
    
  return publicUrl;
};
```

---

## 🧪 Testing del Sistema

### Test 1: Crear Usuario y Verificar Acceso

```sql
-- 1. Crear usuario en Supabase Auth (desde Dashboard)
-- Email: admin@clubejemplo.com
-- Password: (tu password seguro)

-- 2. Obtener el auth_user_id del usuario creado
SELECT id FROM auth.users WHERE email = 'admin@clubejemplo.com';

-- 3. Vincular el usuario con el club
INSERT INTO users (auth_user_id, club_id, role, nombre, apellido, email)
VALUES (
  'AUTH_USER_ID_AQUI', -- Reemplazar con el id del paso 2
  '11111111-1111-1111-1111-111111111111', -- Club de ejemplo
  'CLUB_ADMIN',
  'Admin',
  'Del Club',
  'admin@clubejemplo.com'
);

-- 4. Verificar que el usuario puede acceder a su club
-- (Ejecutar como el usuario creado)
SELECT * FROM clubs WHERE id = auth.user_club_id();
```

### Test 2: Crear Turno y Reserva

```sql
-- Como CLUB_ADMIN o PROFESSIONAL, crear un turno
INSERT INTO time_slots (
  club_id, activity_id, branch_id, professional_id,
  fecha, hora_inicio, hora_fin, cupo_maximo
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333331',
  '22222222-2222-2222-2222-222222222221',
  '44444444-4444-4444-4444-444444444441',
  CURRENT_DATE + 1,
  '18:00',
  '19:30',
  20
);

-- Como STUDENT, reservar el turno
INSERT INTO bookings (club_id, slot_id, student_id, estado, metodo_reserva)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'SLOT_ID_CREADO_ARRIBA',
  '66666666-6666-6666-6666-666666666661',
  'reservado',
  'web'
);

-- Verificar que el cupo_actual se actualizó automáticamente
SELECT cupo_actual FROM time_slots WHERE id = 'SLOT_ID_CREADO_ARRIBA';
-- Debe mostrar 1
```

### Test 3: Verificar RLS

```sql
-- Como STUDENT, intentar ver estudiantes de otros
-- (Debe devolver solo sus propios datos)
SELECT * FROM students;

-- Como CLUB_ADMIN, ver todos los estudiantes del club
-- (Debe devolver todos los estudiantes del club)
SELECT * FROM students;

-- Intentar ver estudiantes de otro club
-- (No debe devolver nada si el club_id es diferente)
SELECT * FROM students WHERE club_id = 'OTRO_CLUB_ID';
```

---

## 📝 Queries Útiles

### Obtener Turnos Disponibles

```sql
-- Turnos con cupos disponibles para los próximos 7 días
SELECT 
  ts.id,
  ts.fecha,
  ts.hora_inicio,
  ts.hora_fin,
  a.nombre AS actividad,
  b.nombre AS sede,
  p.nombre || ' ' || p.apellido AS profesional,
  ts.cupo_maximo - ts.cupo_actual AS cupos_disponibles
FROM time_slots ts
INNER JOIN activities a ON ts.activity_id = a.id
INNER JOIN branches b ON ts.branch_id = b.id
INNER JOIN professionals p ON ts.professional_id = p.id
WHERE 
  ts.club_id = auth.user_club_id()
  AND ts.fecha BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
  AND ts.estado = 'activo'
  AND ts.cupo_actual < ts.cupo_maximo
ORDER BY ts.fecha, ts.hora_inicio;
```

### Reporte de Pagos Mensuales

```sql
-- Pagos del mes actual agrupados por categoría
SELECT 
  pc.nombre AS categoria,
  COUNT(*) AS cantidad_pagos,
  SUM(p.monto) AS total_recaudado
FROM payments p
INNER JOIN payment_categories pc ON p.categoria_id = pc.id
WHERE 
  p.club_id = auth.user_club_id()
  AND DATE_TRUNC('month', p.fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
  AND p.estado = 'completado'
GROUP BY pc.nombre
ORDER BY total_recaudado DESC;
```

### Alumnos con Certificado Vencido

```sql
-- Alumnos activos con certificado médico vencido o próximo a vencer
SELECT 
  numero_cliente,
  nombre,
  apellido,
  email,
  certificado_vencimiento,
  CURRENT_DATE - certificado_vencimiento AS dias_vencido
FROM students
WHERE 
  club_id = auth.user_club_id()
  AND estado = 'activo'
  AND certificado_vencimiento < CURRENT_DATE + 30
ORDER BY certificado_vencimiento;
```

### Turnos con Mayor Ocupación

```sql
-- Top 10 turnos con mayor porcentaje de ocupación
SELECT 
  ts.fecha,
  ts.hora_inicio,
  a.nombre AS actividad,
  p.nombre || ' ' || p.apellido AS profesional,
  ts.cupo_actual,
  ts.cupo_maximo,
  ROUND((ts.cupo_actual::DECIMAL / ts.cupo_maximo * 100), 2) AS porcentaje_ocupacion
FROM time_slots ts
INNER JOIN activities a ON ts.activity_id = a.id
INNER JOIN professionals p ON ts.professional_id = p.id
WHERE 
  ts.club_id = auth.user_club_id()
  AND ts.estado = 'completado'
  AND ts.fecha >= CURRENT_DATE - 30
ORDER BY porcentaje_ocupacion DESC
LIMIT 10;
```

### Balance Financiero Mensual

```sql
-- Balance del mes: ingresos vs egresos
WITH ingresos AS (
  SELECT COALESCE(SUM(monto), 0) AS total
  FROM payments
  WHERE 
    club_id = auth.user_club_id()
    AND DATE_TRUNC('month', fecha_pago) = DATE_TRUNC('month', CURRENT_DATE)
    AND estado = 'completado'
),
egresos AS (
  SELECT COALESCE(SUM(monto), 0) AS total
  FROM expenses
  WHERE 
    club_id = auth.user_club_id()
    AND DATE_TRUNC('month', fecha) = DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
  i.total AS ingresos,
  e.total AS egresos,
  i.total - e.total AS balance
FROM ingresos i, egresos e;
```

### Estudiantes Más Activos

```sql
-- Top 10 estudiantes con más reservas en el último mes
SELECT 
  s.numero_cliente,
  s.nombre,
  s.apellido,
  COUNT(b.id) AS total_reservas,
  COUNT(CASE WHEN b.estado = 'presente' THEN 1 END) AS asistencias,
  ROUND(
    COUNT(CASE WHEN b.estado = 'presente' THEN 1 END)::DECIMAL / 
    COUNT(b.id) * 100, 
    2
  ) AS porcentaje_asistencia
FROM students s
INNER JOIN bookings b ON s.id = b.student_id
INNER JOIN time_slots ts ON b.slot_id = ts.id
WHERE 
  s.club_id = auth.user_club_id()
  AND ts.fecha >= CURRENT_DATE - 30
GROUP BY s.id, s.numero_cliente, s.nombre, s.apellido
ORDER BY total_reservas DESC
LIMIT 10;
```

---

## 🚨 Troubleshooting

### Error: "permission denied for table X"

**Causa**: RLS está bloqueando el acceso porque el usuario no tiene un registro en la tabla `users`.

**Solución**:
```sql
-- Verificar que el usuario existe en la tabla users
SELECT * FROM users WHERE auth_user_id = auth.uid();

-- Si no existe, crear el registro
INSERT INTO users (auth_user_id, club_id, role, nombre, apellido, email)
VALUES (
  auth.uid(),
  'CLUB_ID_AQUI',
  'CLUB_ADMIN',
  'Nombre',
  'Apellido',
  'email@ejemplo.com'
);
```

### Error: "new row violates check constraint"

**Causa**: Estás intentando insertar un valor que no cumple con las validaciones.

**Solución**:
- Verifica que `role` sea uno de: SUPER_ADMIN, CLUB_ADMIN, PROFESSIONAL, STUDENT
- Verifica que `estado` use valores válidos según la tabla
- Verifica que `theme` sea uno de: theme-sky, theme-sport, theme-neutral

### Error: "cupo_actual" no se actualiza

**Causa**: El trigger no está funcionando correctamente.

**Solución**:
```sql
-- Re-crear el trigger
DROP TRIGGER IF EXISTS update_slot_cupo_trigger ON bookings;
CREATE TRIGGER update_slot_cupo_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_time_slot_cupo();

-- Recalcular cupos manualmente
UPDATE time_slots SET cupo_actual = (
  SELECT COUNT(*) 
  FROM bookings 
  WHERE slot_id = time_slots.id AND estado = 'reservado'
);
```

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

## 📧 Soporte

Si tienes problemas con la implementación:

1. Verifica que seguiste todos los pasos de instalación
2. Revisa la sección de Troubleshooting
3. Verifica los logs en Supabase Dashboard → Logs
4. Consulta la documentación oficial de Supabase

---

**✨ ¡Tu base de datos está lista para producción!**

Este modelo de datos es escalable, seguro y está optimizado para manejar múltiples clubs deportivos con miles de usuarios simultáneos.

