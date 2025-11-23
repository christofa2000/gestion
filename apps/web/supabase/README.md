# 🗄️ Documentación de Supabase

Esta carpeta contiene toda la documentación relacionada con la base de datos Supabase del proyecto.

---

## 📚 Archivos Disponibles

### `supabase-schema.sql`
**Script SQL ejecutable completo** con:
- 16 tablas completamente relacionadas
- Row Level Security (RLS) habilitado
- 70+ policies por rol
- Triggers automáticos
- Seeds con datos de ejemplo
- Funciones auxiliares

**Cómo usar:**
1. Abre Supabase Dashboard
2. Ve a SQL Editor
3. Copia y pega el contenido de este archivo
4. Ejecuta (⏎ Run)

---

### `SUPABASE-SETUP.md`
**Guía completa de instalación** paso a paso:
- Requisitos previos
- Instalación del schema
- Configuración de Storage
- Testing del sistema
- Queries útiles
- Troubleshooting

---

### `SUPABASE-INTEGRATION.md`
**Guía de integración con Next.js**:
- Configuración inicial
- Cliente de Supabase (browser y server)
- Tipos TypeScript generados
- Funciones CRUD completas
- Hooks personalizados
- Server Components
- API Routes
- Realtime subscriptions

---

### `DATABASE-DIAGRAM.md`
**Diagrama ER visual completo**:
- Arquitectura multi-tenant
- Relaciones entre tablas
- Índices y triggers
- Políticas RLS
- Métricas calculables

---

### `README-SUPABASE.md`
**Documentación general**:
- Índice de toda la documentación
- Resumen del modelo de datos
- Instrucciones de uso
- Enlaces a recursos

---

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

```bash
# Leer primero
cat supabase/SUPABASE-SETUP.md

# Ejecutar schema SQL en Supabase Dashboard
# (copiar y pegar supabase-schema.sql)
```

### 2. Configurar Variables de Entorno

Crea `.env.local` en la raíz de `apps/web/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### 3. Integrar con Next.js

```bash
# Leer la guía
cat supabase/SUPABASE-INTEGRATION.md

# Generar tipos TypeScript
npx supabase gen types typescript --project-id "tu-project-id" > lib/supabase/types.ts
```

---

## 📊 Modelo de Datos

### 16 Tablas Implementadas

| Categoría | Tablas |
|-----------|--------|
| **Core** | clubs, users, students, professionals |
| **Operaciones** | branches, activities, time_slots, bookings |
| **Finanzas** | payments, payment_categories, payment_methods |
| **Gastos** | expenses, expense_categories |
| **Config** | notification_settings, first_contact_sources |
| **Relaciones** | professional_activities |

---

## 🔐 Roles y Permisos

| Rol | Acceso |
|-----|--------|
| `SUPER_ADMIN` | Todos los clubs |
| `CLUB_ADMIN` | Solo su club (completo) |
| `PROFESSIONAL` | Turnos y alumnos asignados |
| `STUDENT` | Solo sus propios datos |

---

## 🎯 Próximos Pasos

1. ✅ Ejecutar `supabase-schema.sql` en Supabase
2. ✅ Configurar variables de entorno
3. ✅ Generar tipos TypeScript
4. ✅ Implementar queries en `lib/supabase/`
5. ✅ Integrar con componentes de React

---

## 📖 Documentación Completa

Para más detalles, revisa cada archivo en orden:

1. **SUPABASE-SETUP.md** → Instalación
2. **DATABASE-DIAGRAM.md** → Arquitectura
3. **SUPABASE-INTEGRATION.md** → Integración
4. **supabase-schema.sql** → Script ejecutable

---

**Desarrollado con ❤️ para la gestión deportiva moderna**

