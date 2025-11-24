-- =============================================================================
-- SCRIPT DE PERMISOS PARA TABLA STUDENTS
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

-- Dar permisos a los usuarios autenticados sobre la tabla students
GRANT ALL ON TABLE public.students TO authenticated;

-- Dar permisos para usar la secuencia de IDs (si existe)
GRANT USAGE, SELECT ON SEQUENCE students_id_seq TO authenticated;

-- Desactivar Row Level Security temporalmente (solo para desarrollo)
-- IMPORTANTE: En producción, activar RLS y crear políticas adecuadas
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- Verificar permisos
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'students' 
    AND grantee = 'authenticated';

