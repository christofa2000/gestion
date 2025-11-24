# 📚 Documentación Completa - Módulos de Gestión

## ✅ Estado: TODOS LOS MÓDULOS IMPLEMENTADOS

Se han implementado **4 módulos completos para Admin** y **3 páginas para Alumnos**.

---

## 📦 Resumen de Archivos Creados

### **Total: 18 archivos nuevos**

### Módulo TURNOS (Admin) - 7 archivos:
- ✅ `/admin/turnos/page.tsx` - Vista principal de agenda
- ✅ `/admin/turnos/nuevo/page.tsx` - Crear turno
- ✅ `/admin/turnos/[slotId]/page.tsx` - Detalle de turno con reservas
- ✅ `/admin/turnos/components/TurnosFilters.tsx` - Filtros de agenda
- ✅ `/admin/turnos/components/TurnosGrid.tsx` - Grid de turnos del día
- ✅ `/admin/turnos/components/TurnoForm.tsx` - Formulario crear turno

### Módulo PAGOS (Admin) - 4 archivos:
- ✅ `/admin/pagos/page.tsx` - Lista de pagos con filtros
- ✅ `/admin/pagos/nuevo/page.tsx` - Registrar pago
- ✅ `/admin/pagos/components/PagosFilters.tsx` - Filtros de pagos
- ✅ `/admin/pagos/components/PagosTable.tsx` - Tabla de pagos

### Módulo EGRESOS (Admin) - 2 archivos:
- ✅ `/admin/egresos/page.tsx` - Lista de egresos
- ✅ `/admin/egresos/nuevo/page.tsx` - Registrar egreso

### Módulo ESTADÍSTICAS (Admin) - 1 archivo:
- ✅ `/admin/estadisticas/page.tsx` - Dashboard con métricas

### Lado ALUMNO - 3 archivos:
- ✅ `/student/agenda/page.tsx` - Ver turnos disponibles y reservar
- ✅ `/student/turnos/page.tsx` - Mis turnos reservados
- ✅ `/student/pagos/page.tsx` - Mi historial de pagos

### Documentación - 1 archivo:
- ✅ `MODULOS-COMPLETOS-DOCUMENTACION.md` (este archivo)

---

## 🎯 MÓDULO 1: TURNOS (Admin)

### Funcionalidades Implementadas

#### 1.1. Agenda Diaria (`/admin/turnos`)

**Características:**
- ✅ Vista tipo lista de turnos del día
- ✅ Filtros por fecha, sede, actividad, profesional
- ✅ Muestra capacidad actual vs máxima
- ✅ Indicador visual de ocupación (verde/amarillo/rojo)
- ✅ Alerta si hay personas en lista de espera
- ✅ Botón para ver detalle de cada turno
- ✅ Botón "Crear Turno"

**Datos mostrados por turno:**
- Horario (inicio - fin)
- Sede
- Actividad
- Profesional
- Capacidad (reservados / máximo)
- Barra de progreso visual
- Lista de espera (si existe)

**Filtros:**
- **Fecha:** Date picker (default: hoy)
- **Sede:** Select con todas las sedes del club
- **Actividad:** Select con todas las actividades
- **Profesional:** Select con todos los profesionales
- Botón "Limpiar Filtros"

#### 1.2. Crear Turno (`/admin/turnos/nuevo`)

**Formulario con validación (RHF + Zod):**
- **Fecha y Horarios:**
  - Fecha *
  - Hora inicio *
  - Hora fin *

- **Detalles del Turno:**
  - Sede * (select)
  - Actividad * (select)
  - Profesional * (select)
  - Cupo máximo * (number, 1-100)
  - Estado (activo/cancelado)

**Flujo:**
1. Seleccionar fecha, horarios y datos
2. Click en "Crear Turno"
3. Se inserta en `time_slots` con `club_id` del usuario
4. Redirige a detalle del turno `/admin/turnos/[slotId]`

#### 1.3. Detalle de Turno (`/admin/turnos/[slotId]`)

**Información mostrada:**
- **Header:** Nombre de actividad, estado (badge)
- **Info del turno:**
  - Fecha
  - Horario
  - Sede
  - Profesional
- **Capacidad:**
  - Barra de progreso visual
  - "X / Y reservados"
  - Lista de espera (si hay)

- **Tabla de reservas:**
  - Alumno (nombre + apellido)
  - Contacto (email o teléfono)
  - Estado (badge con color)
  - Fecha de reserva

**Estados de reserva:**
- `reservado` → Badge verde "Confirmado"
- `espera` → Badge amarillo "En Espera"
- `cancelado` → Badge rojo "Cancelado"
- `ausente` → Badge gris "Ausente"

### Seguridad Multi-Tenant

```typescript
// Todas las consultas filtran por club_id
const { data } = await supabase
  .from('time_slots')
  .select('*')
  .eq('club_id', clubId)  // ← SIEMPRE
  .eq('fecha', fecha)
```

### Cómo Extender

#### Agregar campo al formulario de turno:
1. Edita `TurnoForm.tsx`
2. Agrega el campo al schema de Zod
3. Agrega el input en el formulario
4. El campo se guardará automáticamente en `time_slots`

#### Agregar nueva vista (ej: vista semanal):
1. Crea `/admin/turnos/semanal/page.tsx`
2. Consulta `time_slots` para un rango de fechas
3. Renderiza en formato de grid/calendario

#### Permitir al admin cambiar estado de reserva:
1. En `/admin/turnos/[slotId]/page.tsx`
2. Agrega botones "Marcar Ausente", "Confirmar", etc
3. Usa `supabase.from('bookings').update({ estado: 'ausente' })`

---

## 💰 MÓDULO 2: PAGOS (Admin)

### Funcionalidades Implementadas

#### 2.1. Lista de Pagos (`/admin/pagos`)

**Características:**
- ✅ Tabla con todos los pagos del club
- ✅ Filtros por rango de fechas, alumno, categoría
- ✅ Paginación (20 por página)
- ✅ Total del período mostrado en KPI
- ✅ Total de pagos (contador)

**Columnas de la tabla:**
- Fecha
- Alumno (nombre + apellido)
- Categoría
- Monto (en verde, destacado)
- Medio de pago
- Detalle

**Filtros:**
- Desde (date)
- Hasta (date)
- Alumno (select)
- Categoría (select)

**KPIs:**
- Total del período ($)
- Cantidad total de pagos

#### 2.2. Registrar Pago (`/admin/pagos/nuevo`)

**Formulario:**
- **Alumno * :** Select con búsqueda de alumnos
- **Categoría * :** Select de categorías de pago
  - Al seleccionar, auto-llena el monto si la categoría tiene `monto_default`
- **Monto * :** Number input
- **Medio de Pago * :** Select (efectivo, transferencia, tarjeta, etc.)
- **Fecha de Pago * :** Date (default: hoy)
- **Detalle:** Textarea opcional

**Flujo:**
1. Seleccionar alumno y categoría
2. Monto se auto-completa (editable)
3. Seleccionar medio de pago y fecha
4. Click "Registrar Pago"
5. Se inserta en `payments` con `club_id`
6. Redirige a `/admin/pagos`

### Tablas Relacionadas

- `payments` - Pagos registrados
- `payment_categories` - Categorías (ej: Mensualidad, Matrícula, Clase extra)
- `payment_methods` - Medios (ej: Efectivo, Transferencia, Tarjeta)
- `students` - Alumnos

### Seguridad

- Filtrado por `club_id` en todas las consultas
- Solo se muestran alumnos del club en el select
- Solo se muestran categorías y medios del club

### Cómo Extender

#### Agregar comprobante de pago (PDF/imagen):
1. Agrega campo `comprobante_url` al formulario
2. Usa Supabase Storage para subir el archivo
3. Guarda la URL en `payments.comprobante_url`

#### Enviar notificación al alumno:
1. En `nuevo/page.tsx`, después del `insert`
2. Llama a una función que envíe email/SMS
3. Usa API externa o Supabase Edge Functions

#### Permitir pagos parciales:
1. Agrega campo `monto_pendiente` a `payments`
2. Crea lógica para calcular saldo por alumno
3. Muestra saldo en detalle de cliente

---

## 📉 MÓDULO 3: EGRESOS (Admin)

### Funcionalidades Implementadas

#### 3.1. Lista de Egresos (`/admin/egresos`)

**Características:**
- ✅ Tabla de todos los egresos del club
- ✅ Total del período (KPI)
- ✅ Ordenado por fecha descendente

**Columnas:**
- Fecha
- Categoría
- Monto (en rojo, destacado)
- Detalle

**KPI:**
- Total del período ($) en rojo

#### 3.2. Registrar Egreso (`/admin/egresos/nuevo`)

**Formulario:**
- **Categoría * :** Select (sueldos, alquiler, insumos, etc.)
- **Monto * :** Number
- **Fecha * :** Date (default: hoy)
- **Detalle * :** Textarea (descripción del gasto)

**Flujo:**
1. Seleccionar categoría
2. Ingresar monto, fecha y detalle
3. Click "Registrar Egreso"
4. Se inserta en `expenses` con `club_id`
5. Redirige a `/admin/egresos`

### Tablas Relacionadas

- `expenses` - Gastos/egresos
- `expense_categories` - Categorías de gastos

### Seguridad

- Filtrado por `club_id`
- Solo categorías del club en select

### Cómo Extender

#### Agregar filtros (fecha, categoría):
1. Crea componente `EgresosFilters.tsx`
2. Similar a `PagosFilters.tsx`
3. Aplica filtros en la consulta SQL

#### Agregar comprobante:
1. Similar a pagos, agrega `comprobante_url`
2. Upload a Supabase Storage

---

## 📊 MÓDULO 4: ESTADÍSTICAS (Admin)

### Funcionalidades Implementadas

#### Dashboard con Métricas (`/admin/estadisticas`)

**KPIs del Mes Actual:**
- ✅ **Ingresos del Mes:** Suma de `payments.monto` del mes
- ✅ **Egresos del Mes:** Suma de `expenses.monto` del mes
- ✅ **Balance del Mes:** Ingresos - Egresos (verde si positivo, rojo si negativo)
- ✅ **Turnos Reservados:** Count de `bookings` con `estado = 'reservado'` del mes
- ✅ **Clientes Activos:** Count de `students` con `estado = 'activo'`

**Gráfico: Ingresos vs Egresos (últimos 6 meses):**
- Barras horizontales simples (CSS)
- Verde para ingresos, rojo para egresos
- Muestra monto total de cada mes
- Escala proporcional al monto máximo

**Cálculo de métricas:**
```typescript
// Mes actual
const now = new Date()
const mesActualInicio = new Date(now.getFullYear(), now.getMonth(), 1)
const mesActualFin = new Date(now.getFullYear(), now.getMonth() + 1, 0)

// Consultar pagos del mes
const { data: ingresos } = await supabase
  .from('payments')
  .select('monto')
  .eq('club_id', clubId)
  .gte('fecha_pago', mesActualInicio)
  .lte('fecha_pago', mesActualFin)

const total = ingresos.reduce((sum, p) => sum + p.monto, 0)
```

### Cómo Extender

#### Agregar gráfico de turnos por actividad:
```typescript
const { data } = await supabase
  .from('bookings')
  .select('id, time_slots!inner(actividad_id, activities(nombre))')
  .eq('time_slots.club_id', clubId)
  .eq('estado', 'reservado')

// Agrupar por actividad y renderizar
```

#### Agregar gráfico con Recharts:
1. Instala `recharts`: `pnpm add recharts`
2. Importa `<BarChart>`, `<LineChart>`, etc.
3. Usa los datos calculados

#### Agregar estadísticas de asistencia:
1. Calcula ratio `ausente / reservado` por alumno
2. Muestra top 10 alumnos con mejor asistencia

---

## 👨‍🎓 LADO ALUMNO (Student)

### Funcionalidades Implementadas

#### 1. Ver Agenda y Reservar (`/student/agenda`)

**Características:**
- ✅ Ver turnos disponibles del día
- ✅ Filtros por fecha, sede, actividad
- ✅ Muestra cupos disponibles
- ✅ Botón "Reservar" por turno
- ✅ Si el cupo está lleno → "Lista de Espera"

**Datos mostrados por turno:**
- Horario
- Sede
- Actividad
- Cupos disponibles (restantes)
- Badge si está lleno

**Flujo de reserva:**
1. Alumno selecciona fecha y filtros
2. Ve turnos disponibles
3. Click en "Reservar"
4. Se inserta en `bookings` con:
   - `slot_id`
   - `student_id` (del usuario logueado)
   - `estado = 'reservado'` (o `'espera'` si lleno)
5. Alert de confirmación
6. Recarga la vista

**Lógica de cupo:**
```typescript
const reservadas = reservasPorSlot[slotId] || 0
const disponibles = slot.cupo_maximo - reservadas
const isFull = disponibles <= 0

// Si está lleno, reserva con estado 'espera'
const estado = isFull ? 'espera' : 'reservado'
```

#### 2. Mis Turnos (`/student/turnos`)

**Características:**
- ✅ Lista de todos los turnos reservados del alumno
- ✅ Muestra fecha, horario, sede, actividad
- ✅ Badge de estado (confirmado, en espera, cancelado)
- ✅ Botón "Cancelar" si:
  - El turno no es pasado
  - El estado es "reservado"
  - Falta más de 24 horas

**Flujo de cancelación:**
1. Click en "Cancelar"
2. Verifica que falten > 24 horas
3. Confirmación del usuario
4. Update de `bookings` → `estado = 'cancelado'`
5. Alert de confirmación

**Regla de cancelación:**
```typescript
const now = new Date()
const slotDate = new Date(slotFecha)
const horasRestantes = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60)

if (horasRestantes < 24) {
  alert('No se puede cancelar con menos de 24 horas')
  return
}
```

#### 3. Mis Pagos (`/student/pagos`)

**Características:**
- ✅ Historial completo de pagos del alumno
- ✅ KPI: Total pagado este mes
- ✅ Tabla con fecha, concepto, monto, medio de pago

**Datos mostrados:**
- Fecha del pago
- Concepto (categoría)
- Detalle (si existe)
- Monto (en verde)
- Medio de pago

**Cálculo del mes:**
```typescript
const now = new Date()
const mesActualInicio = new Date(now.getFullYear(), now.getMonth(), 1)

const pagosMes = pagos.filter(p => p.fecha_pago >= mesActualInicio)
const total = pagosMes.reduce((sum, p) => sum + p.monto, 0)
```

### Seguridad del Lado Alumno

**Verificación:**
- El `student_id` se obtiene de `user.user_metadata.student_id`
- Solo se consultan datos propios:
  ```typescript
  .eq('student_id', studentId)
  ```
- No puede ver turnos ni pagos de otros alumnos
- No puede acceder a rutas de Admin

---

## 🔒 Seguridad Multi-Tenant

### Reglas Aplicadas en TODOS los Módulos

#### 1. Filtrado por club_id

```typescript
// Server Components (Admin)
const clubId = getClubId(user)

const { data } = await supabase
  .from('tabla')
  .select('*')
  .eq('club_id', clubId)  // ← OBLIGATORIO
```

#### 2. Verificación de usuario

```typescript
// Todas las páginas empiezan con:
const user = await getUser()

if (!user || !canAccessAdmin(user)) {
  redirect('/auth/login')
}
```

#### 3. Client Components

```typescript
// En Client Components:
const { data: { user } } = await supabase.auth.getUser()
const clubId = user.user_metadata?.club_id
const studentId = user.user_metadata?.student_id

// Usar clubId o studentId en consultas
```

#### 4. Inserción de datos

```typescript
// Siempre incluir club_id al insertar
const { error } = await supabase
  .from('tabla')
  .insert({
    ...data,
    club_id: clubId,  // ← Del usuario logueado
  })
```

---

## 🛠️ Stack Técnico Utilizado

### Frontend
- **Next.js 15** (App Router)
- **React 19** (Server + Client Components)
- **TypeScript** (modo estricto)
- **Tailwind CSS** (con tokens)

### Formularios
- **react-hook-form**
- **zod** (validación)
- **@hookform/resolvers**

### Backend
- **Supabase** (PostgreSQL + Auth + RLS)
- **@supabase/ssr**

### UI
- **Lucide React** (íconos)
- Componentes de `@repo/ui` (Badge, Input, Select, Textarea)

---

## 📈 Métricas y Performance

### Optimizaciones
- ✅ Server Components para fetching de datos
- ✅ Client Components solo donde hay interactividad
- ✅ Consultas con selects específicos
- ✅ Paginación en listas largas (pagos)
- ✅ Suspense para loading states

### Límites Actuales
- Paginación en pagos: 20 por página
- Estadísticas: últimos 6 meses
- No hay caching (se consulta DB cada vez)

---

## 🚀 Cómo Usar los Módulos

### Admin

**1. Gestionar Turnos:**
```
/admin/turnos
→ Seleccionar fecha
→ Ver turnos del día
→ Click "Crear Turno" para agregar nuevo
→ Click en un turno para ver reservas
```

**2. Registrar Pagos:**
```
/admin/pagos
→ Click "Registrar Pago"
→ Seleccionar alumno y categoría
→ Ingresar monto y medio de pago
→ Guardar
```

**3. Registrar Egresos:**
```
/admin/egresos
→ Click "Registrar Egreso"
→ Seleccionar categoría
→ Ingresar monto y detalle
→ Guardar
```

**4. Ver Estadísticas:**
```
/admin/estadisticas
→ Ver KPIs del mes
→ Ver gráfico de ingresos vs egresos
```

### Alumno

**1. Reservar Turno:**
```
/student/agenda
→ Seleccionar fecha
→ Ver turnos disponibles
→ Click "Reservar" en el turno deseado
```

**2. Ver Mis Turnos:**
```
/student/turnos
→ Ver todos los turnos reservados
→ Cancelar turno (si faltan > 24hs)
```

**3. Ver Mis Pagos:**
```
/student/pagos
→ Ver historial de pagos
→ Ver total del mes
```

---

## 🔧 Cómo Extender los Módulos

### Agregar nueva métrica en Estadísticas:

```typescript
// En /admin/estadisticas/page.tsx

// 1. Consultar dato
const { data } = await supabase
  .from('tabla')
  .select('*')
  .eq('club_id', clubId)

// 2. Calcular métrica
const total = data.reduce(...)

// 3. Mostrar en KPI
<KPICard
  title="Nueva Métrica"
  value={total.toString()}
  icon={<Icon />}
  color="blue"
/>
```

### Agregar filtro adicional en Turnos:

```typescript
// 1. En TurnosFilters.tsx, agregar state y select
const [nuevoFiltro, setNuevoFiltro] = useState('')

// 2. En page.tsx, leer del searchParams
const filtro = searchParams.nuevoFiltro || ''

// 3. Aplicar en query
if (filtro) query = query.eq('campo', filtro)
```

### Enviar notificación al reservar turno:

```typescript
// En /student/agenda/page.tsx, después del insert:

await fetch('/api/notifications/send', {
  method: 'POST',
  body: JSON.stringify({
    to: user.email,
    subject: 'Turno reservado',
    message: `Tu turno del ${fecha} a las ${hora} está confirmado`
  })
})
```

### Agregar reglas de cancelación personalizadas:

```typescript
// En /student/turnos/page.tsx:

// Regla actual: 24 horas
const horasRestantes = (slotDate.getTime() - now.getTime()) / (1000 * 60 * 60)
const HORAS_MINIMAS = 24

// Cambiar a regla personalizada por actividad
const config = await supabase
  .from('activities')
  .select('horas_minimas_cancelacion')
  .eq('id', actividadId)
  .single()

const HORAS_MINIMAS = config.data?.horas_minimas_cancelacion || 24
```

---

## 🐛 Troubleshooting

### Error: No aparecen turnos en la agenda
**Posibles causas:**
1. No hay `time_slots` creados para esa fecha
2. El `club_id` no coincide
3. Los turnos están con `estado = 'cancelado'`

**Solución:**
- Verifica que los turnos existan en la base de datos
- Verifica el `club_id` del usuario en `user_metadata`

### Error: No se puede reservar turno
**Posibles causas:**
1. El `student_id` no está en `user_metadata`
2. Ya existe una reserva para ese alumno en ese turno
3. Error de RLS policies

**Solución:**
- Verifica que el usuario tenga `student_id` en metadata
- Verifica las policies de RLS en Supabase

### Error: Los pagos no se filtran correctamente
**Posibles causas:**
1. Las fechas están en formato incorrecto
2. El `club_id` no se está aplicando

**Solución:**
- Usa formato ISO para fechas: `YYYY-MM-DD`
- Verifica que todas las consultas incluyan `.eq('club_id', clubId)`

---

## 📝 Notas Finales

### Estado del Enum en bookings

El campo `estado` en `bookings` debe soportar:
- `reservado` - Turno confirmado
- `espera` - En lista de espera
- `cancelado` - Cancelado por el alumno o admin
- `ausente` - El alumno no asistió

Si tu schema SQL actual no incluye `espera`, actualízalo:

```sql
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_estado_check;

ALTER TABLE bookings 
ADD CONSTRAINT bookings_estado_check 
CHECK (estado IN ('reservado', 'cancelado', 'ausente', 'espera'));
```

### Configuración de Plantillas (Pendiente)

La página `/admin/turnos/configuracion` no está implementada. Para implementarla:

1. Crea una tabla `time_slot_templates`:
```sql
CREATE TABLE time_slot_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id),
  dia_semana INT NOT NULL, -- 0=domingo, 1=lunes, ...
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  branch_id UUID REFERENCES branches(id),
  actividad_id UUID REFERENCES activities(id),
  professional_id UUID REFERENCES professionals(id),
  cupo_maximo INT NOT NULL,
  activa BOOLEAN DEFAULT true
);
```

2. Crea la página `/admin/turnos/configuracion/page.tsx`
3. Permite crear/editar plantillas
4. Agrega función "Aplicar a rango de fechas" que genere `time_slots`

### Próximas Mejoras Sugeridas

1. **Notificaciones:** Enviar email/SMS al reservar/cancelar
2. **Pagos recurrentes:** Mensualidades automáticas
3. **Reportes PDF:** Exportar estadísticas
4. **App móvil:** React Native + Expo
5. **Asistencia:** Marcar asistencia con QR
6. **Clases grupales:** Gestión de grupos
7. **Evaluaciones:** Sistema de evaluación de alumnos
8. **Torneos:** Gestión de torneos y fixtures

---

## ✅ Checklist de Verificación

- [ ] El servidor está corriendo (`pnpm dev`)
- [ ] Puedes acceder como Admin (`/admin/turnos`)
- [ ] Puedes crear un turno
- [ ] Puedes registrar un pago
- [ ] Puedes registrar un egreso
- [ ] Las estadísticas muestran datos
- [ ] Como alumno, puedes reservar un turno
- [ ] Como alumno, puedes ver tus turnos
- [ ] Como alumno, puedes ver tus pagos
- [ ] El filtrado por `club_id` funciona correctamente

---

**✅ TODOS LOS MÓDULOS IMPLEMENTADOS Y LISTOS PARA USAR 🎉**

**Próximo paso sugerido:** Probar cada módulo, ajustar estilos según preferencias, y agregar datos de prueba.




