# 🔧 Solución: Error "null value in column auth_user_id"

## Problema

Error al ejecutar `verify-and-fix-user.sql`:
```
ERROR: 23502: null value in column "auth_user_id" of relation "users" violates not-null constraint
```

## Causa

El script intenta usar `auth.uid()` pero no hay un usuario autenticado en el contexto de ejecución del SQL Editor de Supabase.

## Solución: Usar Script Manual

Como el SQL Editor de Supabase no siempre tiene contexto de autenticación, usa el script manual:

### Paso 1: Obtener tu Auth User ID

Ejecuta en Supabase SQL Editor:

```sql
SELECT 
    id as auth_user_id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**Copia el `id` (auth_user_id) del usuario que quieres crear.**

### Paso 2: Crear o Obtener Club ID

**Si ya tienes un club:**

```sql
SELECT id as club_id, nombre FROM clubs LIMIT 1;
```

**Si no tienes club, créalo:**

```sql
INSERT INTO clubs (nombre, activa, theme)
VALUES ('Mi Club', true, 'theme-sky')
RETURNING id as club_id, nombre;
```

**Copia el `club_id`.**

### Paso 3: Crear Usuario Manualmente

Ejecuta este script reemplazando los valores:

```sql
-- IMPORTANTE: Reemplaza estos valores
INSERT INTO users (
    auth_user_id,
    club_id,
    role,
    nombre,
    apellido,
    email,
    activo
) VALUES (
    'TU-AUTH-USER-ID-AQUI'::UUID,  -- ⬅️ Pega el id del Paso 1
    'TU-CLUB-ID-AQUI'::UUID,       -- ⬅️ Pega el club_id del Paso 2
    'CLUB_ADMIN',                   -- o 'SUPER_ADMIN' para permisos completos
    'Tu Nombre',
    'Tu Apellido',
    'tu@email.com',                 -- ⬅️ Tu email
    true
)
ON CONFLICT (auth_user_id) DO UPDATE SET
    role = EXCLUDED.role,
    club_id = EXCLUDED.club_id,
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    email = EXCLUDED.email;
```

### Paso 4: Actualizar Metadata en auth.users

```sql
-- Reemplaza 'TU-AUTH-USER-ID-AQUI' con tu auth_user_id
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'role', (SELECT role FROM users WHERE auth_user_id = 'TU-AUTH-USER-ID-AQUI'::UUID),
    'club_id', (SELECT club_id::text FROM users WHERE auth_user_id = 'TU-AUTH-USER-ID-AQUI'::UUID)
)
WHERE id = 'TU-AUTH-USER-ID-AQUI'::UUID;
```

### Paso 5: Verificar

```sql
-- Reemplaza 'TU-AUTH-USER-ID-AQUI' con tu auth_user_id
SELECT 
    u.id,
    u.auth_user_id,
    u.club_id,
    u.role,
    u.nombre,
    u.apellido,
    u.email,
    c.nombre as club_nombre
FROM users u
LEFT JOIN clubs c ON c.id = u.club_id
WHERE u.auth_user_id = 'TU-AUTH-USER-ID-AQUI'::UUID;
```

## Script Completo Listo para Usar

He creado el archivo `create-user-manual.sql` con todos los pasos detallados. Sigue las instrucciones paso a paso.

## Alternativa: Usar la API desde tu App

Si prefieres, puedes crear el usuario desde tu aplicación Next.js después del login:

```typescript
// En tu código después del login
const { data: { user } } = await supabase.auth.getUser()
if (user) {
  // Crear registro en users
  await supabase.from('users').insert({
    auth_user_id: user.id,
    club_id: 'tu-club-id',
    role: 'CLUB_ADMIN',
    nombre: 'Tu Nombre',
    apellido: 'Tu Apellido',
    email: user.email,
    activo: true
  })
}
```

## Verificación Final

Después de crear el usuario, verifica que las políticas RLS funcionen:

1. ✅ Ejecuta `fix-rls-policies.sql` (si no lo hiciste)
2. ✅ Crea el usuario con el script manual
3. ✅ Intenta crear una sede/cliente/profesional desde tu app

Si todo está bien, deberías poder crear sin errores de RLS.

