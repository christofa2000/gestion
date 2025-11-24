-- =============================================================================
-- CORREGIR PERMISOS DE LECTURA EN TABLA USERS
-- Las funciones helper necesitan poder leer la tabla users
-- =============================================================================

-- =============================================================================
-- PROBLEMA: Las funciones SECURITY DEFINER necesitan leer users pero RLS lo bloquea
-- SOLUCIÓN: Otorgar permisos explícitos y asegurar que las funciones funcionen
-- =============================================================================

-- =============================================================================
-- 1. OTORGAR PERMISOS EXPLÍCITOS
-- =============================================================================

-- Otorgar permisos de lectura a usuarios autenticados
GRANT SELECT ON public.users TO authenticated;

-- Otorgar permisos al rol postgres (que usa SECURITY DEFINER)
GRANT SELECT ON public.users TO postgres;

-- Otorgar permisos al rol service_role (por si acaso)
GRANT SELECT ON public.users TO service_role;

-- =============================================================================
-- 2. RECREAR FUNCIONES HELPER CON PERMISOS EXPLÍCITOS
-- =============================================================================

-- Recrear función user_club_id con SET search_path y permisos explícitos
CREATE OR REPLACE FUNCTION public.user_club_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT club_id FROM users WHERE auth_user_id = auth.uid();
$$;

-- Recrear función user_role con SET search_path y permisos explícitos
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role FROM users WHERE auth_user_id = auth.uid();
$$;

-- Recrear función is_super_admin con SET search_path y permisos explícitos
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = auth.uid() 
        AND role = 'SUPER_ADMIN'
    );
$$;

-- Recrear función user_student_id con SET search_path y permisos explícitos
CREATE OR REPLACE FUNCTION public.user_student_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT s.id FROM students s
    INNER JOIN users u ON u.id = s.user_id
    WHERE u.auth_user_id = auth.uid();
$$;

-- Recrear función user_professional_id con SET search_path y permisos explícitos
CREATE OR REPLACE FUNCTION public.user_professional_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT p.id FROM professionals p
    INNER JOIN users u ON u.id = p.user_id
    WHERE u.auth_user_id = auth.uid();
$$;

-- =============================================================================
-- 3. VERIFICAR QUE LAS FUNCIONES PUEDAN LEER USERS
-- =============================================================================

-- Probar las funciones (solo funciona si estás autenticado)
-- Si estas consultas fallan, hay un problema de permisos
SELECT 
    public.user_club_id() as club_id,
    public.user_role() as role,
    public.is_super_admin() as es_super_admin;

-- =============================================================================
-- 4. VERIFICAR POLÍTICAS RLS DE USERS
-- =============================================================================

-- Las políticas RLS deberían permitir que las funciones lean users
-- Verificar que la política de SELECT existe y es correcta
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- =============================================================================
-- 5. SI AÚN HAY PROBLEMAS: DESACTIVAR RLS TEMPORALMENTE PARA DEBUGGING
-- =============================================================================

-- ⚠️ SOLO PARA DEBUGGING - NO USAR EN PRODUCCIÓN
-- Si las funciones siguen fallando, puede ser necesario ajustar las políticas

-- Verificar si RLS está bloqueando las funciones
-- Las funciones SECURITY DEFINER deberían poder leer users sin problemas de RLS
-- porque se ejecutan con permisos del creador (postgres)

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================
