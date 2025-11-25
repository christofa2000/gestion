-- =============================================================================
-- MIGRACIÓN: Hacer club_id nullable en tabla users
-- =============================================================================
-- Propósito: Permitir crear usuarios ADMIN sin club asignado
-- Fecha: 2024
-- =============================================================================

-- Paso 1: Eliminar la restricción NOT NULL de club_id
ALTER TABLE users 
  ALTER COLUMN club_id DROP NOT NULL;

-- Paso 2: Actualizar la foreign key para permitir NULL
-- Primero eliminamos la constraint existente
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS users_club_id_fkey;

-- Luego la recreamos permitiendo NULL
ALTER TABLE users 
  ADD CONSTRAINT users_club_id_fkey 
  FOREIGN KEY (club_id) 
  REFERENCES clubs(id) 
  ON DELETE CASCADE;

-- Paso 3: Crear un índice parcial para club_id cuando no es NULL (opcional, para performance)
CREATE INDEX IF NOT EXISTS idx_users_club_id_not_null 
  ON users(club_id) 
  WHERE club_id IS NOT NULL;

-- Paso 4: Actualizar políticas RLS para permitir usuarios sin club_id
-- Actualizar política de SELECT para permitir usuarios ver su propio registro aunque no tengan club_id
DROP POLICY IF EXISTS "Usuarios pueden ver usuarios de su club" ON users;
CREATE POLICY "Usuarios pueden ver usuarios de su club"
    ON users FOR SELECT
    USING (
        public.is_super_admin() 
        OR 
        -- Usuarios pueden ver usuarios de su club (si tienen club_id)
        (club_id = public.user_club_id() AND public.user_club_id() IS NOT NULL)
        OR
        -- Usuarios pueden ver su propio registro (incluso si no tienen club_id)
        auth_user_id = auth.uid()
    );

-- Actualizar política de INSERT para permitir crear usuarios sin club_id (solo SUPER_ADMIN)
DROP POLICY IF EXISTS "SUPER_ADMIN y CLUB_ADMIN pueden crear usuarios" ON users;
CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear usuarios"
    ON users FOR INSERT
    WITH CHECK (
        -- SUPER_ADMIN puede crear usuarios con o sin club_id
        public.is_super_admin() 
        OR 
        -- CLUB_ADMIN solo puede crear usuarios con club_id de su club
        (club_id = public.user_club_id() AND public.user_club_id() IS NOT NULL AND public.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN'))
    );

-- Nota: El índice original idx_users_club_id seguirá funcionando para búsquedas con club_id

