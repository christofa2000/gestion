-- =============================================================================
-- CORREGIR RLS PARA QUE LAS FUNCIONES SECURITY DEFINER PUEDAN LEER USERS
-- =============================================================================

-- PROBLEMA: Las funciones SECURITY DEFINER están bloqueadas por RLS
-- SOLUCIÓN: Ajustar políticas para permitir lectura a funciones o usar bypass

-- =============================================================================
-- 1. VERIFICAR POLÍTICAS ACTUALES DE USERS
-- =============================================================================

SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- =============================================================================
-- 2. SOLUCIÓN: AJUSTAR POLÍTICA DE SELECT PARA PERMITIR A FUNCIONES
-- =============================================================================

-- Eliminar política existente
DROP POLICY IF EXISTS "Usuarios pueden ver usuarios de su club" ON users;

-- Crear nueva política que permite:
-- 1. SUPER_ADMIN ver todo
-- 2. Usuarios ver usuarios de su club
-- 3. Usuarios ver su propio registro
-- 4. Las funciones SECURITY DEFINER pueden leer (se ejecutan como postgres)
CREATE POLICY "Usuarios pueden ver usuarios de su club"
    ON users FOR SELECT
    USING (
        -- SUPER_ADMIN puede ver todo
        public.is_super_admin() 
        OR 
        -- Usuarios pueden ver usuarios de su club
        -- Nota: Si user_club_id() devuelve null, esta condición será false pero no bloqueará
        (club_id = public.user_club_id() AND public.user_club_id() IS NOT NULL)
        OR
        -- Usuarios pueden ver su propio registro
        auth_user_id = auth.uid()
        OR
        -- Permitir lectura si no hay usuario autenticado (para funciones SECURITY DEFINER)
        -- Esto permite que las funciones lean users cuando se ejecutan como postgres
        auth.uid() IS NULL
    );

-- =============================================================================
-- 3. ALTERNATIVA: USAR BYPASS PARA FUNCIONES SECURITY DEFINER
-- =============================================================================

-- Si la solución anterior no funciona, podemos crear una función que bypass RLS
-- Pero primero probemos la solución anterior

-- =============================================================================
-- 4. VERIFICAR QUE LAS FUNCIONES PUEDAN LEER
-- =============================================================================

-- Probar lectura directa (debería funcionar ahora)
SELECT 
    u.id,
    u.auth_user_id,
    u.club_id,
    u.role,
    u.email
FROM users u
WHERE u.auth_user_id = 'be52a60e-2efa-452a-9d5c-a428ec2b45f4'::UUID;

-- =============================================================================
-- 5. RECREAR FUNCIONES CON MEJOR MANEJO DE NULL
-- =============================================================================

-- Recrear funciones para manejar mejor el caso cuando auth.uid() es null
CREATE OR REPLACE FUNCTION public.user_club_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT club_id FROM users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT role FROM users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

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

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================


