-- =============================================================================
-- SCRIPT PARA ARREGLAR PERMISOS DE FUNCIONES Y TABLAS
-- Ejecutar en Supabase SQL Editor
-- =============================================================================
-- Este script asegura que las funciones helper puedan acceder a la tabla users

-- 1. DAR PERMISOS EXPLICITOS A LA TABLA USERS
-- =============================================================================
GRANT ALL ON TABLE public.users TO authenticated;
GRANT SELECT ON TABLE public.users TO authenticated;

-- 2. ASEGURAR QUE LAS FUNCIONES TENGAN PERMISOS CORRECTOS
-- =============================================================================
-- Las funciones SECURITY DEFINER necesitan permisos del propietario
-- Asegurarse de que el rol postgres (o el rol propietario) tenga permisos

-- Dar permisos al rol que ejecuta las funciones (normalmente postgres)
GRANT ALL ON TABLE public.users TO postgres;
GRANT ALL ON TABLE public.students TO postgres;

-- 3. RECREAR LAS FUNCIONES CON PERMISOS EXPLICITOS
-- =============================================================================

-- Función para obtener el club_id del usuario autenticado
CREATE OR REPLACE FUNCTION public.user_club_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT club_id FROM users WHERE auth_user_id = auth.uid();
$$;

-- Función para obtener el rol del usuario autenticado
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM users WHERE auth_user_id = auth.uid();
$$;

-- Función para verificar si el usuario es SUPER_ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = auth.uid() 
        AND role = 'SUPER_ADMIN'
    );
$$;

-- Función para verificar si el usuario es CLUB_ADMIN de un club específico
CREATE OR REPLACE FUNCTION public.is_club_admin(target_club_id UUID)
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = auth.uid() 
        AND club_id = target_club_id 
        AND role IN ('SUPER_ADMIN', 'CLUB_ADMIN')
    );
$$;

-- 4. VERIFICAR QUE EL USUARIO ACTUAL TIENE REGISTRO EN USERS
-- =============================================================================
-- Ejecutar esto para verificar si tu usuario tiene registro:
-- SELECT * FROM users WHERE auth_user_id = auth.uid();

-- Si no tienes registro, créalo manualmente:
-- INSERT INTO users (auth_user_id, club_id, role, nombre, apellido, email)
-- VALUES (
--   auth.uid(),
--   'TU_CLUB_ID_AQUI',
--   'CLUB_ADMIN',
--   'Tu Nombre',
--   'Tu Apellido',
--   'tu@email.com'
-- );

-- 5. VERIFICAR PERMISOS FINALES
-- =============================================================================
SELECT 
    grantee, 
    table_name,
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('users', 'students')
    AND grantee IN ('authenticated', 'postgres')
ORDER BY table_name, grantee, privilege_type;

