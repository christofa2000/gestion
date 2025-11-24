-- =============================================================================
-- CREAR USUARIO MANUALMENTE
-- Ejecuta este script DESPUÉS de obtener tu auth_user_id
-- =============================================================================

-- =============================================================================
-- PASO 1: Obtener tu auth_user_id
-- =============================================================================

-- Ejecuta esto primero para obtener tu ID de usuario:
SELECT 
    id as auth_user_id,
    email,
    raw_user_meta_data->>'role' as role_metadata,
    raw_user_meta_data->>'club_id' as club_id_metadata
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Copia el 'auth_user_id' (columna id) del resultado anterior

-- =============================================================================
-- PASO 2: Crear o obtener club_id
-- =============================================================================

-- Opción A: Si ya tienes un club, obtén su ID:
SELECT id as club_id, nombre FROM clubs LIMIT 1;

-- Opción B: Si no tienes club, crea uno:
INSERT INTO clubs (nombre, activa, theme)
VALUES ('Mi Club', true, 'theme-sky')
RETURNING id as club_id, nombre;

-- Copia el 'club_id' del resultado

-- =============================================================================
-- PASO 3: Crear usuario en tabla users
-- =============================================================================

-- IMPORTANTE: Reemplaza estos valores:
-- - 'TU-AUTH-USER-ID-AQUI' con el auth_user_id del Paso 1
-- - 'TU-CLUB-ID-AQUI' con el club_id del Paso 2
-- - 'tu@email.com' con tu email
-- - 'Tu Nombre' y 'Tu Apellido' con tus datos

INSERT INTO users (
    auth_user_id,
    club_id,
    role,
    nombre,
    apellido,
    email,
    activo
) VALUES (
    'TU-AUTH-USER-ID-AQUI'::UUID, -- ⬅️ REEMPLAZA ESTO
    'TU-CLUB-ID-AQUI'::UUID,      -- ⬅️ REEMPLAZA ESTO
    'CLUB_ADMIN',                  -- o 'SUPER_ADMIN' para permisos completos
    'Tu Nombre',                   -- ⬅️ REEMPLAZA ESTO
    'Tu Apellido',                 -- ⬅️ REEMPLAZA ESTO
    'tu@email.com',                -- ⬅️ REEMPLAZA ESTO
    true
)
ON CONFLICT (auth_user_id) DO UPDATE SET
    role = EXCLUDED.role,
    club_id = EXCLUDED.club_id,
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    email = EXCLUDED.email;

-- =============================================================================
-- PASO 4: Actualizar metadata en auth.users
-- =============================================================================

-- Actualizar metadata para que coincida con users
-- Reemplaza 'TU-AUTH-USER-ID-AQUI' con tu auth_user_id

UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
    'role', (SELECT role FROM users WHERE auth_user_id = 'TU-AUTH-USER-ID-AQUI'::UUID),
    'club_id', (SELECT club_id::text FROM users WHERE auth_user_id = 'TU-AUTH-USER-ID-AQUI'::UUID)
)
WHERE id = 'TU-AUTH-USER-ID-AQUI'::UUID; -- ⬅️ REEMPLAZA ESTO

-- =============================================================================
-- PASO 5: Verificar resultado
-- =============================================================================

-- Verificar que el usuario se creó correctamente
-- Reemplaza 'TU-AUTH-USER-ID-AQUI' con tu auth_user_id

SELECT 
    u.id,
    u.auth_user_id,
    u.club_id,
    u.role,
    u.nombre,
    u.apellido,
    u.email,
    u.activo,
    c.nombre as club_nombre
FROM users u
LEFT JOIN clubs c ON c.id = u.club_id
WHERE u.auth_user_id = 'TU-AUTH-USER-ID-AQUI'::UUID; -- ⬅️ REEMPLAZA ESTO

-- =============================================================================
-- EJEMPLO COMPLETO (Reemplaza con tus valores reales)
-- =============================================================================

/*
-- Ejemplo con valores reales:
INSERT INTO users (
    auth_user_id,
    club_id,
    role,
    nombre,
    apellido,
    email,
    activo
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID,
    '11111111-1111-1111-1111-111111111111'::UUID,
    'CLUB_ADMIN',
    'Juan',
    'Pérez',
    'juan@example.com',
    true
)
ON CONFLICT (auth_user_id) DO UPDATE SET
    role = EXCLUDED.role,
    club_id = EXCLUDED.club_id;
*/

