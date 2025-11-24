# 🔐 Solución Completa para Problemas de RLS

## Problema

Error: `new row violates row-level security policy for table "clubs"`

Este error ocurre cuando intentas crear/editar sedes, clientes o profesionales porque las políticas RLS están bloqueando las operaciones.

## Solución en 3 Pasos

### ✅ Paso 1: Ejecutar Script de Corrección de Políticas

1. Abre Supabase Dashboard → SQL Editor
2. Ejecuta el archivo: `fix-rls-policies.sql`

Este script corrige las políticas para permitir que `CLUB_ADMIN` y `SUPER_ADMIN` puedan crear/editar.

### ✅ Paso 2: Verificar/Crear Usuario en Tabla `users`

**IMPORTANTE**: Las políticas RLS requieren que el usuario tenga un registro en `users`.

1. Ejecuta el archivo: `verify-and-fix-user.sql`
2. Este script:
   - Verifica si tu usuario existe en `users`
   - Si no existe, lo crea automáticamente
   - Actualiza los metadata en `auth.users`

### ✅ Paso 3: Verificar que Todo Funcione

Ejecuta esta consulta para verificar:

```sql
-- Verificar usuario y permisos
SELECT 
    u.role,
    u.club_id,
    c.nombre as club_nombre,
    public.user_club_id() as funcion_club_id,
    public.user_role() as funcion_role
FROM users u
LEFT JOIN clubs c ON c.id = u.club_id
WHERE u.auth_user_id = auth.uid();
```

## Estructura de Permisos

### SUPER_ADMIN
- ✅ Acceso completo a todas las tablas
- ✅ Puede crear/editar/eliminar cualquier club, estudiante o profesional

### CLUB_ADMIN
- ✅ Puede crear/editar su propio club (sede)
- ✅ Puede crear/editar estudiantes de su club
- ✅ Puede crear/editar profesionales de su club
- ❌ No puede acceder a datos de otros clubs

## Troubleshooting

### Error: "function public.user_club_id() does not exist"

Ejecuta nuevamente el script `fix-rls-policies.sql` (las funciones helper están al final).

### Error: "permission denied for table users"

```sql
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
```

### Error: "new row violates row-level security policy"

1. ✅ Verifica que ejecutaste `fix-rls-policies.sql`
2. ✅ Verifica que ejecutaste `verify-and-fix-user.sql`
3. ✅ Verifica que tu usuario tiene `role = 'CLUB_ADMIN'` o `'SUPER_ADMIN'`
4. ✅ Verifica que el `club_id` en `users` coincide con el que intentas usar

### El usuario no tiene registro en `users`

Ejecuta manualmente:

```sql
-- Crear usuario manualmente (ajusta los valores)
INSERT INTO users (
    auth_user_id,
    club_id,
    role,
    nombre,
    apellido,
    email,
    activo
) VALUES (
    auth.uid(), -- Tu ID de usuario autenticado
    (SELECT id FROM clubs LIMIT 1), -- O crea un club primero
    'CLUB_ADMIN', -- o 'SUPER_ADMIN'
    'Tu Nombre',
    'Tu Apellido',
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    true
);
```

## Archivos de la Solución

1. **`fix-rls-policies.sql`** - Corrige las políticas RLS
2. **`verify-and-fix-user.sql`** - Verifica y crea usuario si no existe
3. **`FIX-RLS-INSTRUCCIONES.md`** - Instrucciones detalladas

## Orden de Ejecución

1. Primero: `fix-rls-policies.sql`
2. Segundo: `verify-and-fix-user.sql`
3. Tercero: Prueba crear una sede/cliente/profesional

## Notas Importantes

⚠️ **NO uses `fix-all-permissions.sql` en producción** - Este script desactiva RLS completamente y es solo para desarrollo.

✅ **Siempre usa RLS con políticas adecuadas** - Las políticas del script `fix-rls-policies.sql` son seguras y correctas.

