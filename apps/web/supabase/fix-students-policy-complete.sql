-- =============================================================================
-- CORREGIR COMPLETAMENTE LAS POLÍTICAS DE STUDENTS
-- =============================================================================

-- Eliminar todas las políticas existentes de students
DROP POLICY IF EXISTS "Usuarios pueden ver estudiantes de su club" ON students;
DROP POLICY IF EXISTS "SUPER_ADMIN, CLUB_ADMIN y PROFESSIONAL pueden crear estudiantes" ON students;
DROP POLICY IF EXISTS "SUPER_ADMIN y CLUB_ADMIN pueden crear estudiantes" ON students;
DROP POLICY IF EXISTS "SUPER_ADMIN, CLUB_ADMIN, PROFESSIONAL y el propio estudiante pueden actualizar" ON students;
DROP POLICY IF EXISTS "SUPER_ADMIN, CLUB_ADMIN y el propio estudiante pueden actualizar" ON students;
DROP POLICY IF EXISTS "SUPER_ADMIN y CLUB_ADMIN pueden eliminar estudiantes" ON students;

-- =============================================================================
-- CREAR POLÍTICAS NUEVAS Y CORRECTAS
-- =============================================================================

-- 1. SELECT: Usuarios pueden ver estudiantes de su club
CREATE POLICY "Usuarios pueden ver estudiantes de su club"
    ON students FOR SELECT
    USING (
        -- SUPER_ADMIN puede ver todo
        public.is_super_admin() 
        OR 
        -- Usuarios pueden ver estudiantes de su club
        club_id = public.user_club_id()
        OR
        -- El estudiante puede ver sus propios datos
        id = public.user_student_id()
        OR
        -- Permitir lectura cuando auth.uid() es NULL (funciones SECURITY DEFINER)
        auth.uid() IS NULL
    );

-- 2. INSERT: SUPER_ADMIN y CLUB_ADMIN pueden crear estudiantes
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear estudiantes"
    ON students FOR INSERT
    WITH CHECK (
        -- SUPER_ADMIN puede crear en cualquier club
        public.is_super_admin() 
        OR 
        -- CLUB_ADMIN puede crear estudiantes en su club
        (
            club_id = public.user_club_id() 
            AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')
            AND public.user_club_id() IS NOT NULL
        )
        OR
        -- Permitir cuando auth.uid() es NULL (para funciones SECURITY DEFINER)
        auth.uid() IS NULL
    );

-- 3. UPDATE: SUPER_ADMIN, CLUB_ADMIN y el propio estudiante pueden actualizar
CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y el propio estudiante pueden actualizar"
    ON students FOR UPDATE
    USING (
        public.is_super_admin() 
        OR 
        (
            club_id = public.user_club_id() 
            AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')
            AND public.user_club_id() IS NOT NULL
        )
        OR
        id = public.user_student_id()
        OR
        auth.uid() IS NULL
    )
    WITH CHECK (
        public.is_super_admin() 
        OR 
        (
            club_id = public.user_club_id() 
            AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')
            AND public.user_club_id() IS NOT NULL
        )
        OR
        id = public.user_student_id()
        OR
        auth.uid() IS NULL
    );

-- 4. DELETE: SUPER_ADMIN y CLUB_ADMIN pueden eliminar estudiantes
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar estudiantes"
    ON students FOR DELETE
    USING (
        public.is_super_admin() 
        OR 
        (
            club_id = public.user_club_id() 
            AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')
            AND public.user_club_id() IS NOT NULL
        )
        OR
        auth.uid() IS NULL
    );

-- =============================================================================
-- VERIFICAR POLÍTICAS CREADAS
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
-- PROBAR CREAR UN ESTUDIANTE
-- =============================================================================

-- Esto debería funcionar ahora si estás autenticado como CLUB_ADMIN
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

