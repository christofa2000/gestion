# 🔧 Solución: Error "permission denied for table users"

## Problema

Error al crear cliente:
```
Error: permission denied for table users
```

## Causa

Las funciones helper (`user_club_id()`, `user_role()`, `is_super_admin()`) intentan leer la tabla `users` pero no tienen permisos suficientes debido a RLS o falta de permisos explícitos.

## Solución

### Paso 1: Ejecutar Script de Corrección de Permisos

Ejecuta en Supabase SQL Editor el archivo: `fix-users-permissions.sql`

Este script:
- ✅ Otorga permisos explícitos de lectura en `users` a `authenticated`, `postgres` y `service_role`
- ✅ Recrea las funciones helper con `SET search_path = public` y `STABLE`
- ✅ Verifica que las funciones puedan ejecutarse

### Paso 2: Verificar que Funcione

Después de ejecutar el script, prueba crear un cliente nuevamente.

Si aún falla, ejecuta esta consulta para verificar:

```sql
-- Verificar que puedes leer tu propio usuario
SELECT 
    u.id,
    u.auth_user_id,
    u.club_id,
    u.role,
    u.email
FROM users u
WHERE u.auth_user_id = auth.uid();

-- Probar las funciones helper
SELECT 
    public.user_club_id() as club_id,
    public.user_role() as role,
    public.is_super_admin() as es_super_admin;
```

### Paso 3: Si Aún Falla - Verificar Políticas RLS

Ejecuta esto para ver las políticas de `users`:

```sql
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;
```

La política de SELECT debería ser:
```sql
CREATE POLICY "Usuarios pueden ver usuarios de su club"
    ON users FOR SELECT
    USING (public.is_super_admin() OR club_id = public.user_club_id());
```

**Problema potencial**: Esta política usa `public.user_club_id()` que a su vez necesita leer `users`, creando una dependencia circular.

### Solución Alternativa: Ajustar Política de SELECT

Si el problema persiste, necesitamos ajustar la política para que las funciones SECURITY DEFINER puedan leer sin restricciones:

```sql
-- Eliminar política existente
DROP POLICY IF EXISTS "Usuarios pueden ver usuarios de su club" ON users;

-- Crear nueva política que permite a funciones SECURITY DEFINER leer
CREATE POLICY "Usuarios pueden ver usuarios de su club"
    ON users FOR SELECT
    USING (
        -- SUPER_ADMIN puede ver todo
        public.is_super_admin() 
        OR 
        -- Usuarios pueden ver usuarios de su club
        -- Pero las funciones SECURITY DEFINER se ejecutan como postgres, así que necesitamos una excepción
        club_id = public.user_club_id()
        OR
        -- Permitir lectura si el usuario autenticado coincide
        auth_user_id = auth.uid()
    );
```

## Orden de Ejecución

1. ✅ Ejecuta `fix-rls-policies.sql` (si no lo hiciste)
2. ✅ Ejecuta `fix-users-permissions.sql`
3. ✅ Prueba crear un cliente
4. ✅ Si falla, ejecuta la solución alternativa de políticas

## Notas Importantes

- Las funciones `SECURITY DEFINER` se ejecutan con permisos del creador (normalmente `postgres`)
- RLS puede bloquear incluso a funciones `SECURITY DEFINER` si las políticas son muy restrictivas
- El `SET search_path = public` asegura que las funciones busquen en el schema correcto
- `STABLE` indica que la función no modifica datos y puede ser optimizada


