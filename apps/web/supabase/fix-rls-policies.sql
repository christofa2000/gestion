-- =============================================================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS
-- Permite a SUPER_ADMIN y CLUB_ADMIN crear/editar clubs, students y professionals
-- =============================================================================
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

-- =============================================================================
-- 1. CORREGIR POLÍTICAS DE CLUBS (SEDES)
-- =============================================================================

-- Eliminar políticas existentes de INSERT y UPDATE
DROP POLICY IF EXISTS "SUPER_ADMIN puede insertar clubs" ON clubs;
DROP POLICY IF EXISTS "SUPER_ADMIN y CLUB_ADMIN pueden actualizar su club" ON clubs;

-- Nueva política: SUPER_ADMIN y CLUB_ADMIN pueden insertar clubs
-- Nota: CLUB_ADMIN solo puede insertar si el club_id coincide con el suyo
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden insertar clubs"
    ON clubs FOR INSERT
    WITH CHECK (
        public.is_super_admin() OR 
        (id = public.user_club_id() AND public.user_role() = 'CLUB_ADMIN')
    );

-- Nueva política: SUPER_ADMIN y CLUB_ADMIN pueden actualizar clubs
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar clubs"
    ON clubs FOR UPDATE
    USING (
        public.is_super_admin() OR 
        (id = public.user_club_id() AND public.user_role() = 'CLUB_ADMIN')
    )
    WITH CHECK (
        public.is_super_admin() OR 
        (id = public.user_club_id() AND public.user_role() = 'CLUB_ADMIN')
    );

-- =============================================================================
-- 2. CORREGIR POLÍTICAS DE STUDENTS (CLIENTES)
-- =============================================================================

-- Las políticas de students ya están bien, pero vamos a asegurarnos
-- Eliminar y recrear para asegurar consistencia
DROP POLICY IF EXISTS "SUPER_ADMIN, CLUB_ADMIN y PROFESSIONAL pueden crear estudiantes" ON students;
DROP POLICY IF EXISTS "SUPER_ADMIN, CLUB_ADMIN, PROFESSIONAL y el propio estudiante pueden actualizar" ON students;

-- Política de INSERT: SUPER_ADMIN y CLUB_ADMIN pueden crear estudiantes
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear estudiantes"
    ON students FOR INSERT
    WITH CHECK (
        public.is_super_admin() OR 
        (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN'))
    );

-- Política de UPDATE: SUPER_ADMIN, CLUB_ADMIN y el propio estudiante pueden actualizar
CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y el propio estudiante pueden actualizar"
    ON students FOR UPDATE
    USING (
        public.is_super_admin() OR 
        (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')) OR
        (id = public.user_student_id())
    )
    WITH CHECK (
        public.is_super_admin() OR 
        (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')) OR
        (id = public.user_student_id())
    );

-- =============================================================================
-- 3. CORREGIR POLÍTICAS DE PROFESSIONALS
-- =============================================================================

-- Las políticas ya están bien, pero vamos a asegurarnos
-- Eliminar y recrear para asegurar consistencia
DROP POLICY IF EXISTS "SUPER_ADMIN y CLUB_ADMIN pueden crear profesionales" ON professionals;
DROP POLICY IF EXISTS "SUPER_ADMIN, CLUB_ADMIN y el propio profesional pueden actualizar" ON professionals;

-- Política de INSERT: SUPER_ADMIN y CLUB_ADMIN pueden crear profesionales
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear profesionales"
    ON professionals FOR INSERT
    WITH CHECK (
        public.is_super_admin() OR 
        (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN'))
    );

-- Política de UPDATE: SUPER_ADMIN, CLUB_ADMIN y el propio profesional pueden actualizar
CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y el propio profesional pueden actualizar"
    ON professionals FOR UPDATE
    USING (
        public.is_super_admin() OR 
        (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')) OR
        (id = public.user_professional_id())
    )
    WITH CHECK (
        public.is_super_admin() OR 
        (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')) OR
        (id = public.user_professional_id())
    );

-- =============================================================================
-- 4. VERIFICAR QUE LAS FUNCIONES HELPER EXISTAN
-- =============================================================================

-- Asegurar que las funciones helper existan (si no existen, crearlas)
CREATE OR REPLACE FUNCTION public.user_club_id()
RETURNS UUID AS $$
    SELECT club_id FROM users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT AS $$
    SELECT role FROM users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = auth.uid() 
        AND role = 'SUPER_ADMIN'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_student_id()
RETURNS UUID AS $$
    SELECT s.id FROM students s
    INNER JOIN users u ON u.id = s.user_id
    WHERE u.auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_professional_id()
RETURNS UUID AS $$
    SELECT p.id FROM professionals p
    INNER JOIN users u ON u.id = p.user_id
    WHERE u.auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- =============================================================================
-- 5. VERIFICAR POLÍTICAS CREADAS
-- =============================================================================

-- Listar todas las políticas de clubs
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('clubs', 'students', 'professionals')
ORDER BY tablename, policyname;

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================

