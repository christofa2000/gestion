-- =============================================================================
-- VERIFICAR SI EL USUARIO EXISTE EN LA TABLA USERS
-- =============================================================================

-- 1. Ver tu usuario autenticado actual
SELECT 
    'Usuario autenticado' as tipo,
    auth.uid()::text as id,
    (SELECT email FROM auth.users WHERE id = auth.uid()) as email;

-- 2. Ver si existe en la tabla users
SELECT 
    'Usuario en tabla users' as tipo,
    u.id::text,
    u.auth_user_id::text,
    u.club_id::text,
    u.role,
    u.nombre,
    u.apellido,
    u.email,
    u.activo
FROM users u
WHERE u.auth_user_id = auth.uid();

-- 3. Ver todos los usuarios en auth.users (últimos 5)
SELECT 
    'Todos los usuarios auth' as tipo,
    id::text as auth_user_id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Ver todos los usuarios en tabla users (últimos 5)
SELECT 
    'Todos los usuarios en users' as tipo,
    id::text,
    auth_user_id::text,
    club_id::text,
    role,
    nombre,
    email
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- 5. Comparar: ¿coincide tu auth.uid() con algún auth_user_id en users?
SELECT 
    'Comparación' as tipo,
    au.id::text as auth_users_id,
    u.auth_user_id::text as users_auth_user_id,
    CASE 
        WHEN au.id = u.auth_user_id THEN '✅ COINCIDE'
        ELSE '❌ NO COINCIDE'
    END as estado,
    u.role,
    u.club_id::text
FROM auth.users au
LEFT JOIN users u ON u.auth_user_id = au.id
WHERE au.email = 'christofa2000@gmail.com'  -- Tu email
ORDER BY au.created_at DESC
LIMIT 1;


