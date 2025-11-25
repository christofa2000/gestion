-- =============================================================================
-- MIGRACIÓN: Revertir club_id nullable en tabla users
-- =============================================================================
-- Propósito: Volver a hacer club_id obligatorio en la tabla users
-- Fecha: 2024
-- =============================================================================

-- Paso 1: Eliminar usuarios que tengan club_id NULL (si los hay)
-- IMPORTANTE: Esto eliminará usuarios sin club asignado
DELETE FROM users WHERE club_id IS NULL;

-- Paso 2: Restaurar la restricción NOT NULL de club_id
ALTER TABLE users 
  ALTER COLUMN club_id SET NOT NULL;

-- Paso 3: Eliminar el índice parcial si existe
DROP INDEX IF EXISTS idx_users_club_id_not_null;

-- Paso 4: Restaurar políticas RLS originales
DROP POLICY IF EXISTS "Usuarios pueden ver usuarios de su club" ON users;
CREATE POLICY "Usuarios pueden ver usuarios de su club"
    ON users FOR SELECT
    USING (public.is_super_admin() OR club_id = public.user_club_id());

DROP POLICY IF EXISTS "SUPER_ADMIN y CLUB_ADMIN pueden crear usuarios" ON users;
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear usuarios"
    ON users FOR INSERT
    WITH CHECK (public.is_super_admin() OR (club_id = public.user_club_id() AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')));

