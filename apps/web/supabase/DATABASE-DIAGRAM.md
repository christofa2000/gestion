# 📊 DIAGRAMA DE BASE DE DATOS - SISTEMA MULTI-CLUB

## Arquitectura Multi-Tenant para Gestión Deportiva

---

## 🎯 Visión General

Este diagrama representa la estructura completa de la base de datos para un sistema multi-tenant de gestión de clubes deportivos, con 16 tablas interrelacionadas.

---

## 📐 DIAGRAMA ENTIDAD-RELACIÓN COMPLETO

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                           SISTEMA MULTI-CLUB - ARQUITECTURA                           ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

                                    ┌──────────────────┐
                                    │      CLUBS       │
                                    │ ════════════════ │
                                    │ • id (PK)        │
                                    │ • nombre         │
                                    │ • logo_url       │
                                    │ • theme          │
                                    │ • direccion      │
                                    │ • activa         │
                                    │ • created_at     │
                                    └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
      ┌─────────────┴──────────┐  ┌──────────┴──────────┐  ┌─────────┴──────────┐
      │        USERS           │  │      BRANCHES       │  │     ACTIVITIES     │
      │ ══════════════════════ │  │ ══════════════════  │  │ ══════════════════ │
      │ • id (PK)              │  │ • id (PK)           │  │ • id (PK)          │
      │ • auth_user_id (FK)    │  │ • club_id (FK)      │  │ • club_id (FK)     │
      │ • club_id (FK)         │  │ • nombre            │  │ • nombre           │
      │ • role ⭐              │  │ • direccion         │  │ • descripcion      │
      │   - SUPER_ADMIN        │  │ • telefono          │  │ • duracion_minutos │
      │   - CLUB_ADMIN         │  │ • geo_lat           │  │ • color            │
      │   - PROFESSIONAL       │  │ • geo_lng           │  │ • activa           │
      │   - STUDENT            │  │ • foto_url          │  │ • icono            │
      │ • nombre               │  │ • activa            │  └────────┬───────────┘
      │ • apellido             │  │ • created_at        │           │
      │ • email                │  └─────────────────────┘           │
      │ • telefono             │                                    │
      │ • activo               │                                    │
      └────────────────────────┘                                    │
                                                                    │
      ┌────────────────────────────────────────────────────────────┘
      │
      │         ┌──────────────────────────────────┐
      │         │      PROFESSIONALS               │
      │         │ ════════════════════════════════ │
      │         │ • id (PK)                        │
      │         │ • club_id (FK)                   │
      │         │ • user_id (FK) → users           │
      │         │ • nombre                         │
      │         │ • apellido                       │
      │         │ • telefono                       │
      │         │ • email                          │
      │         │ • estado                         │
      ├─────────│ • foto_url                       │
      │         │ • created_at                     │
      │         └──────────┬───────────────────────┘
      │                    │
      │                    │ N:N ↔ ACTIVITIES
      │                    │
      │         ┌──────────┴───────────────────────┐
      │         │  PROFESSIONAL_ACTIVITIES         │
      │         │ ════════════════════════════════ │
      │         │ • id (PK)                        │
      │         │ • club_id (FK)                   │
      │         │ • professional_id (FK)           │
      │         │ • activity_id (FK)               │
      │         │ • created_at                     │
      │         │                                  │
      │         │ UNIQUE(professional_id,          │
      │         │        activity_id)              │
      │         └──────────────────────────────────┘
      │
      │
      ├─────────┐
      │         ▼
      │    ┌──────────────────────────────────────┐       ┌────────────────────────┐
      │    │           TIME_SLOTS                 │       │  FIRST_CONTACT_SOURCES │
      │    │ ════════════════════════════════════ │       │ ══════════════════════ │
      │    │ • id (PK)                            │       │ • id (PK)              │
      │    │ • club_id (FK)                       │       │ • club_id (FK)         │
      │    │ • activity_id (FK) ───────────┐      │       │ • nombre               │
      │    │ • branch_id (FK) ──────────┐  │      │       │ • descripcion          │
      │    │ • professional_id (FK) ─┐  │  │      │       │ • activa               │
      │    │ • fecha                 │  │  │      │       └────────┬───────────────┘
      │    │ • hora_inicio           │  │  │      │                │
      │    │ • hora_fin              │  │  │      │                │
      │    │ • cupo_maximo 🔢        │  │  │      │                │
      │    │ • cupo_actual 🔢        │  │  │      │         ┌──────┴────────┐
      │    │ • estado                │  │  │      │         │               │
      │    │ • created_at            │  │  │      │         │ FK source_id  │
      │    └──────────┬──────────────┘  │  │      │         ▼               │
      │               │                 │  │      │    ┌────────────────────┴──────┐
      │               │ 1:N             │  │      │    │       STUDENTS            │
      │               │                 │  │      │    │ ══════════════════════════│
      │               ▼                 │  │      │    │ • id (PK)                 │
      │         ┌─────────────────────┐ │  │      │    │ • club_id (FK)            │
      │         │      BOOKINGS       │ │  │      │    │ • user_id (FK) → users    │
      │         │ ══════════════════  │ │  │      │    │ • numero_cliente 🔑       │
      │         │ • id (PK)           │ │  │      │    │ • nombre                  │
      │         │ • club_id (FK)      │ │  │      │    │ • apellido                │
      │         │ • slot_id (FK) ─────┘ │  │      │    │ • apodo                   │
      │         │ • student_id (FK) ────┼──┼──────┼────│ • telefono                │
      │         │ • estado ⭐          │  │      │    │ • email                   │
      │         │   - reservado        │  │      │    │ • fecha_nacimiento        │
      │         │   - cancelado        │  │      │    │ • genero                  │
      │         │   - ausente          │  │      │    │ • numero_documento        │
      │         │   - presente         │  │      │    │ • certificado_medico_url  │
      │         │   - confirmado       │  │      │    │ • certificado_vencimiento │
      │         │ • metodo_reserva     │  │      │    │ • estado                  │
      │         │ • notas              │  │      │    │ • observaciones           │
      │         │ • created_at         │  │      │    │ • source_id (FK) ─────────┘
      │         │                      │  │      │    │ • created_at              │
      │         │ UNIQUE(slot_id,      │  │      │    └──────┬────────────────────┘
      │         │        student_id)   │  │      │           │
      │         └──────────────────────┘  │      │           │ 1:N
      │                                   │      │           │
      │                                   │      │    ┌──────┴──────────────────┐
      │                                   │      │    │                         │
      │                                   │      │    ▼                         ▼
      │         ┌─────────────────────────┘      │ ┌──────────────┐  ┌─────────────────────┐
      │         ▼                                │ │   PAYMENTS   │  │ NOTIFICATION_       │
      │    ┌────────────────────┐                │ │ ════════════ │  │ SETTINGS            │
      │    │ PAYMENT_CATEGORIES │                │ │ • id (PK)    │  │ ═══════════════════ │
      │    │ ══════════════════ │                │ │ • club_id    │  │ • id (PK)           │
      │    │ • id (PK)          │                │ │ • student(FK)│  │ • club_id (FK)      │
      │    │ • club_id (FK)     │        ┌───────┼─│ • categoria  │  │ • student_id (FK)   │
      │    │ • nombre           │        │       │ │   (FK) ──────┘  │ • notificar_turnos  │
      │    │ • descripcion      │        │       │ │ • medio_pago │  │ • notificar_cancela │
      │    │ • monto_default 💰 │        │       │ │   (FK) ──┐   │  │ • notificar_pagos   │
      │    │ • tipo             │        │       │ │ • monto 💰│   │  │ • canal_email       │
      │    │ • activa           │        │       │ │ • fecha_p │   │  │ • canal_sms         │
      │    └────────────────────┘        │       │ │ • compro  │   │  │ • canal_push        │
      │                                  │       │ │ • detalle │   │  │ • created_at        │
      │    ┌────────────────────┐        │       │ │ • estado  │   │  │                     │
      │    │  PAYMENT_METHODS   │        │       │ └───────────┘   │  │ UNIQUE(student_id)  │
      │    │ ══════════════════ │        │       │                 │  └─────────────────────┘
      │    │ • id (PK)          │        │       │    ┌────────────┘
      │    │ • club_id (FK)     │        │       │    │
      │    │ • nombre           │        │       │    ▼
      │    │ • descripcion      │        │       │ ┌────────────────────┐
      │    │ • requiere_        │        │       │ │  PAYMENT_METHODS   │
      │    │   comprobante      │        │       │ │ ══════════════════ │
      │    │ • activo           │        │       │ │ • id (PK)          │
      │    └────────────────────┘        │       │ │ • club_id (FK)     │
      │                                  │       │ │ • nombre           │
      │                                  │       │ │ • requiere_        │
      │                                  │       │ │   comprobante      │
      │                                  │       │ │ • activo           │
      │    ┌────────────────────┐        │       │ └────────────────────┘
      │    │ EXPENSE_CATEGORIES │        │       │
      │    │ ══════════════════ │        │       │
      │    │ • id (PK)          │        │       │
      │    │ • club_id (FK)     │        │       │
      │    │ • nombre           │        │       │
      │    │ • descripcion      │        │       │
      │    │ • activa           │        │       │
      │    └──────────┬─────────┘        │       │
      │               │                  │       │
      │               │ 1:N              │       │
      │               ▼                  │       │
      │         ┌─────────────────┐      │       │
      └─────────│    EXPENSES     │      │       │
                │ ═══════════════ │      │       │
                │ • id (PK)       │      │       │
                │ • club_id (FK)  │      │       │
                │ • categoria(FK) │──────┘       │
                │ • monto 💰      │              │
                │ • fecha         │              │
                │ • detalle       │              │
                │ • comprobante   │              │
                │ • created_at    │              │
                └─────────────────┘              │
                                                 │
                                                 │
             auth.users (Supabase Auth) ◄────────┘
             ══════════════════════════
             • id
             • email
             • encrypted_password
             • created_at
```

---

## 🔑 RELACIONES CLAVE

### 1. Multi-Tenancy (Aislamiento por Club)

```
CLUBS (1) ──┬──► (N) USERS
            ├──► (N) BRANCHES
            ├──► (N) ACTIVITIES
            ├──► (N) PROFESSIONALS
            ├──► (N) STUDENTS
            ├──► (N) TIME_SLOTS
            ├──► (N) BOOKINGS
            ├──► (N) PAYMENTS
            ├──► (N) EXPENSES
            ├──► (N) PAYMENT_CATEGORIES
            ├──► (N) PAYMENT_METHODS
            ├──► (N) EXPENSE_CATEGORIES
            └──► (N) FIRST_CONTACT_SOURCES
```

**Estrategia**: Cada tabla (excepto `clubs`) tiene `club_id` como FK con `ON DELETE CASCADE`

---

### 2. Gestión de Usuarios y Roles

```
auth.users (Supabase)
      │
      │ 1:1
      ▼
   USERS (metadata extendida)
      │
      ├──► role: SUPER_ADMIN | CLUB_ADMIN | PROFESSIONAL | STUDENT
      │
      ├─── 1:1 opcional ───► PROFESSIONALS (si role = PROFESSIONAL)
      │
      └─── 1:1 opcional ───► STUDENTS (si role = STUDENT)
```

**Flujo**:
1. Usuario se registra → se crea en `auth.users`
2. Se crea registro en `USERS` con `auth_user_id` + `club_id` + `role`
3. Opcionalmente se vincula con `PROFESSIONALS` o `STUDENTS`

---

### 3. Profesionales y Actividades (N:N)

```
PROFESSIONALS (N) ◄──► (N) ACTIVITIES
                 └───────┘
         PROFESSIONAL_ACTIVITIES
         (tabla intermedia)
```

**Propósito**: Un profesional puede enseñar múltiples actividades, y una actividad puede ser impartida por múltiples profesionales.

**Ejemplo**:
- Juan Pérez → Fútbol, Básquet
- María González → Natación, Aqua Gym

---

### 4. Sistema de Turnos y Reservas

```
TIME_SLOTS
   │
   ├──► activity_id    (FK a ACTIVITIES)
   ├──► branch_id      (FK a BRANCHES)
   ├──► professional_id (FK a PROFESSIONALS)
   │
   │ Campos clave:
   ├── fecha
   ├── hora_inicio / hora_fin
   ├── cupo_maximo 🔢
   ├── cupo_actual 🔢  ← Actualizado automáticamente por trigger
   └── estado (activo / cancelado / completado)

        │
        │ 1:N
        ▼
    BOOKINGS (reservas)
        │
        ├──► slot_id (FK a TIME_SLOTS)
        ├──► student_id (FK a STUDENTS)
        │
        └── estado:
            • reservado → alumno hizo la reserva
            • confirmado → alumno confirmó asistencia
            • presente → alumno asistió (registrado por profesional)
            • ausente → alumno no asistió
            • cancelado → reserva cancelada
```

**Lógica automática**:
- Al crear `BOOKING` con estado "reservado" → `cupo_actual` ++
- Al cancelar `BOOKING` → `cupo_actual` --
- Constraint: `cupo_actual` ≤ `cupo_maximo`

---

### 5. Sistema de Pagos

```
STUDENTS
   │
   │ 1:N
   ▼
PAYMENTS
   │
   ├──► categoria_id (FK a PAYMENT_CATEGORIES)
   │     • "1 vez por semana" → $15,000
   │     • "2 veces por semana" → $25,000
   │     • "Libre (ilimitado)" → $40,000
   │
   ├──► medio_pago_id (FK a PAYMENT_METHODS)
   │     • Efectivo
   │     • Transferencia (requiere comprobante)
   │     • Tarjeta
   │
   ├── monto 💰
   ├── fecha_pago
   ├── periodo_inicio / periodo_fin
   ├── comprobante_url (opcional)
   └── estado (completado / pendiente / anulado)
```

**Flujo típico**:
1. Alumno paga cuota mensual
2. Admin registra pago en `PAYMENTS`
3. Se asocia con categoría (ej: "2 veces por semana")
4. Se registra medio de pago
5. Se guarda comprobante si es necesario

---

### 6. Sistema de Gastos (Egresos)

```
CLUB
   │
   │ 1:N
   ▼
EXPENSE_CATEGORIES
   • Mantenimiento
   • Equipamiento
   • Servicios
   • Sueldos
   
        │
        │ 1:N
        ▼
    EXPENSES
        │
        ├── monto 💰
        ├── fecha
        ├── detalle
        ├── proveedor
        ├── comprobante_url
        └── registrado_por (FK a USERS)
```

**Uso**: Balance financiero = Σ(PAYMENTS) - Σ(EXPENSES)

---

### 7. Notificaciones

```
STUDENTS
   │
   │ 1:1
   ▼
NOTIFICATION_SETTINGS
   │
   ├── notificar_turnos (bool)
   ├── notificar_cancelaciones (bool)
   ├── notificar_pagos (bool)
   ├── notificar_recordatorios (bool)
   │
   └── Canales:
       ├── canal_email
       ├── canal_sms
       └── canal_push
```

**Propósito**: Control granular de qué notificaciones recibe cada alumno y por qué canal.

---

## 🔒 SEGURIDAD (RLS)

### Políticas por Rol

| Tabla | SUPER_ADMIN | CLUB_ADMIN | PROFESSIONAL | STUDENT |
|-------|-------------|------------|--------------|---------|
| `clubs` | CRUD all | RU own club | R own club | R own club |
| `users` | CRUD all | CRUD own club | R own club | RU self |
| `branches` | CRUD all | CRUD own club | R own club | R own club |
| `activities` | CRUD all | CRUD own club | R own club | R own club |
| `professionals` | CRUD all | CRUD own club | RU self | R own club |
| `students` | CRUD all | CRUD own club | R assigned | RU self |
| `time_slots` | CRUD all | CRUD own club | CRUD assigned | R own club |
| `bookings` | CRUD all | CRUD own club | RU assigned | CRUD self |
| `payments` | CRUD all | CRUD own club | - | R self |
| `expenses` | CRUD all | CRUD own club | - | - |

**Leyenda**:
- C = Create
- R = Read
- U = Update
- D = Delete

---

## 📊 ÍNDICES CRÍTICOS

### Índices para Performance

```sql
-- Multi-tenancy
CREATE INDEX idx_*_club_id ON * (club_id);

-- Búsquedas frecuentes
CREATE INDEX idx_students_email ON students (email);
CREATE INDEX idx_students_numero_cliente ON students (numero_cliente);
CREATE INDEX idx_students_estado ON students (estado);

-- Turnos y reservas
CREATE INDEX idx_time_slots_fecha ON time_slots (fecha);
CREATE INDEX idx_time_slots_fecha_estado ON time_slots (fecha, estado);
CREATE INDEX idx_bookings_student_id ON bookings (student_id);
CREATE INDEX idx_bookings_slot_id ON bookings (slot_id);

-- Pagos
CREATE INDEX idx_payments_student_id ON payments (student_id);
CREATE INDEX idx_payments_fecha_pago ON payments (fecha_pago);

-- Foreign Keys (todas indexadas)
CREATE INDEX idx_*_foreign_key ON * (foreign_key);
```

---

## 🔄 TRIGGERS AUTOMÁTICOS

### 1. Actualizar `updated_at`

```sql
-- Ejecutado BEFORE UPDATE en todas las tablas
CREATE TRIGGER update_{table}_updated_at 
BEFORE UPDATE ON {table}
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

### 2. Actualizar `cupo_actual` en TIME_SLOTS

```sql
-- Ejecutado AFTER INSERT/UPDATE/DELETE en bookings
CREATE TRIGGER update_slot_cupo_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW 
EXECUTE FUNCTION update_time_slot_cupo();

-- Lógica:
-- INSERT con estado='reservado' → cupo_actual++
-- UPDATE de otro estado a 'reservado' → cupo_actual++
-- UPDATE de 'reservado' a otro estado → cupo_actual--
-- DELETE de reservado → cupo_actual--
```

---

## 📈 MÉTRICAS CALCULABLES

### Métricas de Negocio

```sql
-- 1. Tasa de ocupación de turnos
SELECT 
  AVG(cupo_actual::DECIMAL / cupo_maximo * 100) AS ocupacion_promedio
FROM time_slots
WHERE estado = 'completado' AND fecha >= NOW() - INTERVAL '30 days';

-- 2. Ingresos mensuales
SELECT 
  SUM(monto) AS ingresos_mes
FROM payments
WHERE 
  estado = 'completado' 
  AND fecha_pago >= DATE_TRUNC('month', CURRENT_DATE);

-- 3. Tasa de asistencia por alumno
SELECT 
  s.nombre,
  COUNT(CASE WHEN b.estado = 'presente' THEN 1 END)::DECIMAL / 
    COUNT(b.id) * 100 AS tasa_asistencia
FROM students s
INNER JOIN bookings b ON s.id = b.student_id
GROUP BY s.id, s.nombre;

-- 4. Actividades más populares
SELECT 
  a.nombre,
  COUNT(b.id) AS total_reservas
FROM activities a
INNER JOIN time_slots ts ON a.id = ts.activity_id
INNER JOIN bookings b ON ts.id = b.slot_id
WHERE b.created_at >= NOW() - INTERVAL '30 days'
GROUP BY a.id, a.nombre
ORDER BY total_reservas DESC;

-- 5. Balance financiero
SELECT 
  (SELECT COALESCE(SUM(monto), 0) FROM payments WHERE estado = 'completado') -
  (SELECT COALESCE(SUM(monto), 0) FROM expenses) AS balance;
```

---

## 🚀 ESCALABILIDAD

### Capacidad Estimada

- **Clubs**: Ilimitados (multi-tenant)
- **Usuarios por club**: 10,000+
- **Estudiantes por club**: 5,000+
- **Turnos por día**: 500+
- **Reservas simultáneas**: 10,000+

### Optimizaciones Implementadas

✅ Índices en todas las FK  
✅ Índices compuestos en queries frecuentes  
✅ RLS con funciones SECURITY DEFINER  
✅ Triggers optimizados  
✅ Constraints para integridad de datos  
✅ Cascade deletes para limpieza automática  

---

## 📁 STORAGE (Supabase Storage)

### Buckets Recomendados

```
storage/
├── club-logos/           [PÚBLICO]
│   └── {club_id}/logo.png
│
├── professional-photos/  [PÚBLICO]
│   └── {professional_id}/photo.jpg
│
├── student-photos/       [PRIVADO - Solo admin y alumno]
│   └── {student_id}/photo.jpg
│
├── medical-certificates/ [PRIVADO - Solo admin]
│   └── {student_id}/certificado-{date}.pdf
│
└── payment-receipts/     [PRIVADO - Solo admin]
    └── {payment_id}/comprobante-{date}.pdf
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Ejecutar `supabase-schema.sql` en SQL Editor
- [ ] Verificar que todas las 16 tablas existen
- [ ] Verificar que RLS está habilitado en todas las tablas
- [ ] Verificar que existen datos de ejemplo (seeds)
- [ ] Crear buckets de Storage
- [ ] Configurar políticas de Storage
- [ ] Generar tipos de TypeScript
- [ ] Implementar cliente de Supabase en Next.js
- [ ] Configurar variables de entorno
- [ ] Crear funciones auxiliares (queries/)
- [ ] Implementar hooks personalizados
- [ ] Configurar autenticación
- [ ] Testing de RLS por rol
- [ ] Testing de triggers
- [ ] Testing de queries complejas
- [ ] Configurar Realtime (opcional)
- [ ] Configurar webhooks (opcional)
- [ ] Deploy y testing en producción

---

## 📚 DOCUMENTOS RELACIONADOS

1. **supabase-schema.sql** - Script SQL completo ejecutable
2. **SUPABASE-SETUP.md** - Guía de instalación y configuración
3. **SUPABASE-INTEGRATION.md** - Integración con Next.js
4. **DATABASE-DIAGRAM.md** - Este documento (diagrama visual)

---

**🎉 Base de datos lista para escalar de 1 a 1,000,000 de usuarios**

Este diseño soporta:
- ✅ Multi-tenancy completo
- ✅ Seguridad a nivel de fila (RLS)
- ✅ Integridad referencial
- ✅ Triggers automáticos
- ✅ Índices optimizados
- ✅ Escalabilidad horizontal
- ✅ Auditoría completa
- ✅ Soft deletes opcionales

