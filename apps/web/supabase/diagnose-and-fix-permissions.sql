-- =============================================================================
-- SCRIPT DE DIAGNOSTICO Y SOLUCION COMPLETA
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

-- PASO 1: VERIFICAR SI EL USUARIO ACTUAL TIENE REGISTRO EN USERS
-- =============================================================================
SELECT 
    'Usuario actual:' as info,
    auth.uid() as user_id,
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid()) 
        THEN 'SI tiene registro en users'
        ELSE 'NO tiene registro en users - ESTE ES EL PROBLEMA'
    END as estado;

-- PASO 2: VER PERMISOS ACTUALES
-- =============================================================================
SELECT 
    'Permisos en users:' as info,
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users' 
    AND grantee = 'authenticated';

SELECT 
    'Permisos en students:' as info,
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'students' 
    AND grantee = 'authenticated';

-- PASO 3: DAR PERMISOS COMPLETOS (EJECUTAR SIEMPRE)
-- =============================================================================
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.clubs TO authenticated;

-- Desactivar RLS temporalmente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- PASO 4: CREAR REGISTRO EN USERS SI NO EXISTE
-- =============================================================================
-- IMPORTANTE: Reemplaza los valores con tus datos reales
-- Primero necesitas saber tu auth.uid() y tener un club_id válido

-- Opción A: Si ya tienes un club creado, usa este:
/*
INSERT INTO users (auth_user_id, club_id, role, nombre, apellido, email)
SELECT 
    auth.uid(),
    (SELECT id FROM clubs LIMIT 1), -- Usa el primer club disponible
    'CLUB_ADMIN',
    'Admin',
    'Usuario',
    (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE auth_user_id = auth.uid()
);
*/

-- Opción B: Si necesitas crear un club primero:
/*
-- 1. Crear club
INSERT INTO clubs (nombre, theme, activa)
VALUES ('Mi Club', 'theme-sky', true)
RETURNING id;

-- 2. Crear usuario (usa el id del club creado arriba)
INSERT INTO users (auth_user_id, club_id, role, nombre, apellido, email)
VALUES (
    auth.uid(),
    'ID_DEL_CLUB_CREADO_ARRIBA',
    'CLUB_ADMIN',
    'Admin',
    'Usuario',
    (SELECT email FROM auth.users WHERE id = auth.uid())
);
*/

-- PASO 5: VERIFICAR QUE TODO ESTA BIEN
-- =============================================================================
SELECT 
    'Verificacion final:' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid()) 
        THEN 'OK - Usuario tiene registro'
        ELSE 'ERROR - Usuario NO tiene registro'
    END as usuario,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.role_table_grants 
            WHERE table_name = 'users' 
                AND grantee = 'authenticated'
                AND privilege_type = 'INSERT'
        )
        THEN 'OK - Tiene permisos INSERT en users'
        ELSE 'ERROR - No tiene permisos INSERT en users'
    END as permisos_users,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.role_table_grants 
            WHERE table_name = 'students' 
                AND grantee = 'authenticated'
                AND privilege_type = 'INSERT'
        )
        THEN 'OK - Tiene permisos INSERT en students'
        ELSE 'ERROR - No tiene permisos INSERT en students'
    END as permisos_students;


