-- =============================================================================
-- ELIMINAR POLÍTICA CONFLICTIVA Y ASEGURAR QUE TODAS USEN FUNCIONES HELPER
-- =============================================================================

-- PROBLEMA: Hay una política "super_admin_manage_students" que usa auth.users
-- directamente en lugar de public.users, causando conflictos

-- =============================================================================
-- 1. ELIMINAR POLÍTICA CONFLICTIVA
-- =============================================================================

DROP POLICY IF EXISTS "super_admin_manage_students" ON students;

-- =============================================================================
-- 2. VERIFICAR QUE NO QUEDEN POLÍTICAS CONFLICTIVAS
-- =============================================================================

SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'students'
ORDER BY cmd, policyname;

-- =============================================================================
-- 3. ASEGURAR QUE LAS FUNCIONES HELPER FUNCIONEN CORRECTAMENTE
-- =============================================================================

-- Verificar que las funciones puedan leer users
SELECT 
    public.user_club_id() as club_id,
    public.user_role() as role,
    public.is_super_admin() as es_super_admin;

-- =============================================================================
-- 4. PROBAR CREAR ESTUDIANTE AHORA
-- =============================================================================

-- Esto debería funcionar ahora
INSERT INTO students (
    club_id,
    nombre,
    apellido,
    telefono,
    email,
    estado
) VALUES (
    '11111111-1111-1111-1111-111111111111'::UUID,
    'Test',
    'Estudiante',
    '1234567890',
    'test@example.com',
    'activo'
)
RETURNING id, nombre, apellido, club_id;

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================

