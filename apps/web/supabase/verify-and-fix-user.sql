-- =============================================================================
-- SCRIPT PARA VERIFICAR Y CREAR USUARIO EN TABLA USERS
-- Ejecutar en Supabase SQL Editor DESPUÉS de autenticarte
-- =============================================================================

-- =============================================================================
-- 1. VERIFICAR USUARIO ACTUAL
-- =============================================================================

-- Ver si el usuario autenticado tiene registro en users
SELECT 
    'Usuario en auth.users' as tipo,
    au.id::text as id,
    au.email,
    au.raw_user_meta_data->>'role' as role_metadata,
    au.raw_user_meta_data->>'club_id' as club_id_metadata
FROM auth.users au
WHERE au.id = auth.uid()

UNION ALL

SELECT 
    'Usuario en public.users' as tipo,
    u.id::text as id,
    u.email,
    u.role as role_metadata,
    u.club_id::text as club_id_metadata
FROM users u
WHERE u.auth_user_id = auth.uid();

-- =============================================================================
-- 2. CREAR USUARIO SI NO EXISTE (AJUSTA LOS VALORES)
-- =============================================================================

-- IMPORTANTE: Este script requiere que estés autenticado
-- Si auth.uid() es null, usa la versión manual más abajo

DO $$
DECLARE
    v_auth_user_id UUID := auth.uid();
    v_club_id UUID;
    v_user_exists BOOLEAN;
    v_user_email TEXT;
BEGIN
    -- Verificar que hay un usuario autenticado
    IF v_auth_user_id IS NULL THEN
        RAISE EXCEPTION 'No hay usuario autenticado. Por favor, ejecuta este script después de autenticarte o usa la versión manual más abajo.';
    END IF;
    
    -- Verificar si el usuario ya existe
    SELECT EXISTS(SELECT 1 FROM users WHERE auth_user_id = v_auth_user_id) INTO v_user_exists;
    
    IF v_user_exists THEN
        RAISE NOTICE 'El usuario ya existe en la tabla users';
        RETURN;
    END IF;
    
    -- Obtener email del usuario
    SELECT email INTO v_user_email FROM auth.users WHERE id = v_auth_user_id;
    
    -- Obtener club_id del metadata o crear uno nuevo
    -- Opción 1: Si ya tienes un club, úsalo
    SELECT id INTO v_club_id FROM clubs LIMIT 1;
    
    -- Opción 2: Si no tienes club, crea uno nuevo
    IF v_club_id IS NULL THEN
        INSERT INTO clubs (nombre, activa)
        VALUES ('Mi Club', true)
        RETURNING id INTO v_club_id;
        
        RAISE NOTICE 'Club creado con id: %', v_club_id;
    END IF;
    
    -- Crear registro de usuario
    INSERT INTO users (
        auth_user_id,
        club_id,
        role,
        nombre,
        apellido,
        email,
        activo
    ) VALUES (
        v_auth_user_id,
        v_club_id,
        'CLUB_ADMIN', -- Cambia a 'SUPER_ADMIN' si necesitas permisos completos
        COALESCE((SELECT raw_user_meta_data->>'nombre' FROM auth.users WHERE id = v_auth_user_id), 'Admin'),
        COALESCE((SELECT raw_user_meta_data->>'apellido' FROM auth.users WHERE id = v_auth_user_id), 'Usuario'),
        v_user_email,
        true
    );
    
    RAISE NOTICE 'Usuario creado exitosamente con club_id: %', v_club_id;
END $$;

-- =============================================================================
-- 3. ACTUALIZAR METADATA DEL USUARIO EN AUTH
-- =============================================================================

-- Actualizar metadata en auth.users para que coincida con users
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'role', (SELECT role FROM users WHERE auth_user_id = auth.uid()),
    'club_id', (SELECT club_id::text FROM users WHERE auth_user_id = auth.uid())
)
WHERE id = auth.uid();

-- =============================================================================
-- 4. VERSIÓN MANUAL (Si el script automático falla)
-- =============================================================================

-- Si auth.uid() es null, ejecuta esto manualmente reemplazando:
-- - 'TU-AUTH-USER-ID-AQUI' con tu ID de usuario de auth.users
-- - 'TU-EMAIL-AQUI' con tu email
-- - 'TU-CLUB-ID-AQUI' con el ID de tu club (o déjalo null para crear uno nuevo)

/*
-- Paso 1: Obtener tu auth_user_id
SELECT id, email FROM auth.users WHERE email = 'tu@email.com';

-- Paso 2: Crear club si no existe (opcional)
INSERT INTO clubs (nombre, activa)
VALUES ('Mi Club', true)
ON CONFLICT DO NOTHING
RETURNING id;

-- Paso 3: Crear usuario manualmente
INSERT INTO users (
    auth_user_id,
    club_id,
    role,
    nombre,
    apellido,
    email,
    activo
) VALUES (
    'TU-AUTH-USER-ID-AQUI'::UUID, -- Reemplaza con tu auth.users.id
    COALESCE(
        'TU-CLUB-ID-AQUI'::UUID, -- Reemplaza con tu club_id o null
        (SELECT id FROM clubs LIMIT 1) -- O usa el primer club disponible
    ),
    'CLUB_ADMIN', -- o 'SUPER_ADMIN'
    'Tu Nombre',
    'Tu Apellido',
    'TU-EMAIL-AQUI', -- Reemplaza con tu email
    true
)
ON CONFLICT (auth_user_id) DO UPDATE SET
    role = EXCLUDED.role,
    club_id = EXCLUDED.club_id;
*/

-- =============================================================================
-- 5. VERIFICAR RESULTADO FINAL
-- =============================================================================

-- Verificar usuario actual (solo funciona si estás autenticado)
SELECT 
    u.id,
    u.auth_user_id,
    u.club_id,
    u.role,
    u.nombre,
    u.apellido,
    u.email,
    c.nombre as club_nombre,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN public.user_club_id()::text
        ELSE 'No autenticado'
    END as funcion_club_id,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN public.user_role()
        ELSE 'No autenticado'
    END as funcion_role,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN public.is_super_admin()::text
        ELSE 'No autenticado'
    END as es_super_admin
FROM users u
LEFT JOIN clubs c ON c.id = u.club_id
WHERE u.auth_user_id = COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::UUID)
   OR auth.uid() IS NULL; -- Si no hay auth, muestra todos (solo para debugging)

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================

