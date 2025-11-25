-- =============================================================================
-- PROBAR CREAR ESTUDIANTE DIRECTAMENTE PARA DEBUGGEAR
-- =============================================================================

-- 1. Verificar políticas de students
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'students'
ORDER BY cmd, policyname;

-- 2. Verificar que las funciones helper funcionen en contexto de aplicación
-- (Esto simula lo que hace la aplicación)
SELECT 
    public.user_club_id() as club_id,
    public.user_role() as role,
    public.is_super_admin() as es_super_admin;

-- 3. Intentar crear un estudiante de prueba (simulando lo que hace la app)
-- Esto debería fallar si hay problemas de RLS
INSERT INTO students (
    club_id,
    nombre,
    apellido,
    telefono,
    email,
    estado
) VALUES (
    public.user_club_id(),  -- Usa la función helper
    'Test',
    'Estudiante',
    '1234567890',
    'test@example.com',
    'activo'
)
RETURNING id, nombre, apellido, club_id;

-- Si el INSERT anterior falla, probar con el club_id directo:
-- INSERT INTO students (
--     club_id,
--     nombre,
--     apellido,
--     telefono,
--     email,
--     estado
-- ) VALUES (
--     '11111111-1111-1111-1111-111111111111'::UUID,  -- Club ID directo
--     'Test',
--     'Estudiante',
--     '1234567890',
--     'test2@example.com',
--     'activo'
-- )
-- RETURNING id, nombre, apellido, club_id;

-- 4. Verificar si hay triggers que puedan estar causando problemas
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'students';

-- 5. Verificar permisos en la tabla students
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
    AND table_name = 'students'
    AND grantee IN ('authenticated', 'postgres', 'service_role');


