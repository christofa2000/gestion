# 🔧 Instrucciones para Corregir Políticas RLS

## Problema

Estás recibiendo el error: `new row violates row-level security policy for table "clubs"`

Esto ocurre porque las políticas RLS actuales solo permiten a `SUPER_ADMIN` crear clubs, pero necesitas que `CLUB_ADMIN` también pueda crear/editar sedes, clientes y profesionales.

## Solución

### Paso 1: Ejecutar el Script SQL

1. Ve a tu proyecto en Supabase Dashboard
2. Abre el **SQL Editor**
3. Copia y pega el contenido del archivo `fix-rls-policies.sql`
4. Ejecuta el script

Este script:
- ✅ Corrige las políticas de `clubs` para permitir que `CLUB_ADMIN` cree/edite su propio club
- ✅ Asegura que las políticas de `students` y `professionals` permitan a `CLUB_ADMIN` crear/editar
- ✅ Verifica que las funciones helper existan

### Paso 2: Verificar que el Usuario Tenga Registro en `users`

Las políticas RLS dependen de que el usuario autenticado tenga un registro en la tabla `users` con:
- `auth_user_id` vinculado al usuario de Supabase Auth
- `club_id` correcto
- `role` = `CLUB_ADMIN` o `SUPER_ADMIN`

**Verificar usuario actual:**

```sql
-- Ver tu usuario actual
SELECT 
    u.id,
    u.auth_user_id,
    u.club_id,
    u.role,
    u.nombre,
    u.email,
    au.email as auth_email
FROM users u
LEFT JOIN auth.users au ON au.id = u.auth_user_id
WHERE u.auth_user_id = auth.uid();
```

**Si no tienes registro, créalo:**

```sql
-- Crear registro de usuario (ajusta los valores)
INSERT INTO users (
    auth_user_id,
    club_id,
    role,
    nombre,
    apellido,
    email,
    activo
) VALUES (
    auth.uid(), -- ID del usuario autenticado
    'tu-club-id-aqui', -- UUID del club
    'CLUB_ADMIN', -- o 'SUPER_ADMIN'
    'Tu Nombre',
    'Tu Apellido',
    'tu@email.com',
    true
);
```

### Paso 3: Verificar Políticas Creadas

Ejecuta esta consulta para ver todas las políticas:

```sql
SELECT 
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('clubs', 'students', 'professionals')
ORDER BY tablename, policyname;
```

## Estructura de Permisos Después del Fix

### SUPER_ADMIN
- ✅ Puede crear/editar/eliminar cualquier club, estudiante o profesional
- ✅ Acceso completo a todas las tablas

### CLUB_ADMIN
- ✅ Puede crear/editar su propio club (sede)
- ✅ Puede crear/editar estudiantes de su club
- ✅ Puede crear/editar profesionales de su club
- ❌ No puede acceder a datos de otros clubs

### PROFESSIONAL
- ✅ Puede ver estudiantes y profesionales de su club
- ✅ Puede crear estudiantes (según políticas actuales)
- ❌ No puede crear/editar clubs

### STUDENT
- ✅ Puede ver/editar sus propios datos
- ❌ No puede crear/editar clubs, estudiantes o profesionales

## Troubleshooting

### Error: "function public.user_club_id() does not exist"

Ejecuta las funciones helper del script `fix-rls-policies.sql` nuevamente.

### Error: "permission denied for table users"

Asegúrate de que el usuario tenga permisos en la tabla `users`:

```sql
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
```

### Error: "new row violates row-level security policy"

1. Verifica que el usuario tenga un registro en `users`
2. Verifica que el `club_id` en `users` coincida con el `club_id` que intentas usar
3. Verifica que el `role` sea `CLUB_ADMIN` o `SUPER_ADMIN`

## Notas Importantes

⚠️ **En desarrollo**: Si necesitas desactivar RLS temporalmente para testing, usa el script `fix-all-permissions.sql`, pero **NO lo uses en producción**.

✅ **En producción**: Siempre usa RLS con políticas adecuadas como las del script `fix-rls-policies.sql`.

