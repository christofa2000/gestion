-- =============================================================================
-- SCRIPT COMPLETO DE PERMISOS PARA DESARROLLO
-- Ejecutar en Supabase SQL Editor
-- =============================================================================
-- Este script da permisos completos a usuarios autenticados y desactiva RLS
-- IMPORTANTE: Solo para desarrollo. En producción, usar RLS con políticas adecuadas.

-- 1. PERMISOS PARA TABLA USERS
-- =============================================================================
GRANT ALL ON TABLE public.users TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 2. PERMISOS PARA TABLA STUDENTS
-- =============================================================================
GRANT ALL ON TABLE public.students TO authenticated;

-- 3. PERMISOS PARA OTRAS TABLAS PRINCIPALES
-- =============================================================================
GRANT ALL ON TABLE public.clubs TO authenticated;
GRANT ALL ON TABLE public.branches TO authenticated;
GRANT ALL ON TABLE public.activities TO authenticated;
GRANT ALL ON TABLE public.professionals TO authenticated;
GRANT ALL ON TABLE public.time_slots TO authenticated;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.expenses TO authenticated;
GRANT ALL ON TABLE public.payment_methods TO authenticated;
GRANT ALL ON TABLE public.payment_categories TO authenticated;
GRANT ALL ON TABLE public.expense_categories TO authenticated;
GRANT ALL ON TABLE public.first_contact_sources TO authenticated;

-- 4. DESACTIVAR RLS TEMPORALMENTE (SOLO PARA DESARROLLO)
-- =============================================================================
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.first_contact_sources DISABLE ROW LEVEL SECURITY;

-- 5. VERIFICAR PERMISOS
-- =============================================================================
SELECT 
    table_name,
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'authenticated'
    AND table_schema = 'public'
ORDER BY table_name, privilege_type;

-- 6. VERIFICAR ESTADO DE RLS
-- =============================================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;


