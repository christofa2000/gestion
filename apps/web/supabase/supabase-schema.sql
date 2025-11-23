-- =============================================================================
-- MODELO DE DATOS COMPLETO - PLATAFORMA MULTI-CLUB
-- Sistema de gestión de turnos, alumnos, pagos y actividades deportivas
-- =============================================================================
-- Arquitectura: Multi-tenant con RLS
-- Base de datos: PostgreSQL + Supabase
-- Roles: SUPER_ADMIN | CLUB_ADMIN | PROFESSIONAL | STUDENT
-- =============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para geolocalización (opcional)

-- =============================================================================
-- 1. TABLAS PRINCIPALES
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1.1. CLUBS (Tabla principal multi-tenant)
-- -----------------------------------------------------------------------------
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    logo_url TEXT,
    theme VARCHAR(50) DEFAULT 'theme-sky' CHECK (theme IN ('theme-sky', 'theme-sport', 'theme-neutral')),
    direccion TEXT,
    telefono VARCHAR(50),
    email VARCHAR(255),
    activa BOOLEAN DEFAULT true,
    configuracion JSONB DEFAULT '{}', -- Para configuraciones adicionales
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clubs_activa ON clubs(activa);
CREATE INDEX idx_clubs_nombre ON clubs(nombre);

-- -----------------------------------------------------------------------------
-- 1.2. USERS (Extensión de auth.users de Supabase)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'CLUB_ADMIN', 'PROFESSIONAL', 'STUDENT')),
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    activo BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_users_club_id ON users(club_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 1.3. BRANCHES (Sedes/Sucursales)
-- -----------------------------------------------------------------------------
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    geo_lat FLOAT,
    geo_lng FLOAT,
    foto_url TEXT,
    activa BOOLEAN DEFAULT true,
    capacidad_maxima INTEGER,
    horario_apertura TIME,
    horario_cierre TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_branches_club_id ON branches(club_id);
CREATE INDEX idx_branches_activa ON branches(activa);

-- -----------------------------------------------------------------------------
-- 1.4. ACTIVITIES (Actividades/Deportes)
-- -----------------------------------------------------------------------------
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_minutos INTEGER NOT NULL DEFAULT 60,
    color VARCHAR(50) DEFAULT '#3B82F6', -- Color para UI (hex)
    activa BOOLEAN DEFAULT true,
    icono VARCHAR(100), -- Nombre del icono (ej: 'futbol', 'natacion')
    orden INTEGER DEFAULT 0, -- Para ordenamiento
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_club_id ON activities(club_id);
CREATE INDEX idx_activities_activa ON activities(activa);
CREATE INDEX idx_activities_orden ON activities(orden);

-- -----------------------------------------------------------------------------
-- 1.5. PROFESSIONALS (Profesionales/Instructores)
-- -----------------------------------------------------------------------------
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Vinculación opcional con users
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    foto_url TEXT,
    especialidad TEXT,
    biografia TEXT,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'licencia')),
    fecha_ingreso DATE,
    salario_base DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_professionals_club_id ON professionals(club_id);
CREATE INDEX idx_professionals_user_id ON professionals(user_id);
CREATE INDEX idx_professionals_estado ON professionals(estado);
CREATE INDEX idx_professionals_email ON professionals(email);

-- -----------------------------------------------------------------------------
-- 1.6. PROFESSIONAL_ACTIVITIES (Relación N:N entre profesionales y actividades)
-- -----------------------------------------------------------------------------
CREATE TABLE professional_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(professional_id, activity_id)
);

CREATE INDEX idx_professional_activities_club_id ON professional_activities(club_id);
CREATE INDEX idx_professional_activities_professional_id ON professional_activities(professional_id);
CREATE INDEX idx_professional_activities_activity_id ON professional_activities(activity_id);

-- -----------------------------------------------------------------------------
-- 1.7. STUDENTS (Alumnos/Clientes)
-- -----------------------------------------------------------------------------
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Vinculación opcional con users
    numero_cliente VARCHAR(50) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    apodo VARCHAR(100),
    telefono VARCHAR(50),
    email VARCHAR(255),
    contacto_emergencia VARCHAR(255),
    telefono_emergencia VARCHAR(50),
    fecha_nacimiento DATE,
    genero VARCHAR(50) CHECK (genero IN ('masculino', 'femenino', 'otro', 'prefiero_no_decir')),
    tipo_documento VARCHAR(50) DEFAULT 'DNI',
    numero_documento VARCHAR(50),
    ocupacion VARCHAR(255),
    obra_social VARCHAR(255),
    certificado_medico_url TEXT,
    certificado_vencimiento DATE,
    observaciones TEXT,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'rechazado', 'pendiente')),
    direccion TEXT,
    codigo_postal VARCHAR(20),
    ciudad VARCHAR(100),
    provincia VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Argentina',
    foto_url TEXT,
    source_id UUID REFERENCES first_contact_sources(id) ON DELETE SET NULL, -- Fuente de contacto
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_students_club_id ON students(club_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_estado ON students(estado);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_numero_cliente ON students(numero_cliente);
CREATE INDEX idx_students_numero_documento ON students(numero_documento);
CREATE INDEX idx_students_certificado_vencimiento ON students(certificado_vencimiento);

-- -----------------------------------------------------------------------------
-- 1.8. FIRST_CONTACT_SOURCES (Fuentes de primer contacto)
-- -----------------------------------------------------------------------------
CREATE TABLE first_contact_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_first_contact_sources_club_id ON first_contact_sources(club_id);

-- -----------------------------------------------------------------------------
-- 1.9. TIME_SLOTS (Turnos/Clases programadas)
-- -----------------------------------------------------------------------------
CREATE TABLE time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    cupo_maximo INTEGER NOT NULL DEFAULT 20,
    cupo_actual INTEGER DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'cancelado', 'completado', 'en_curso')),
    sala VARCHAR(100), -- Nombre de sala/cancha
    notas TEXT,
    es_recurrente BOOLEAN DEFAULT false,
    recurrencia_patron VARCHAR(100), -- 'weekly', 'daily', etc.
    recurrencia_hasta DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (hora_fin > hora_inicio),
    CHECK (cupo_actual <= cupo_maximo)
);

CREATE INDEX idx_time_slots_club_id ON time_slots(club_id);
CREATE INDEX idx_time_slots_activity_id ON time_slots(activity_id);
CREATE INDEX idx_time_slots_branch_id ON time_slots(branch_id);
CREATE INDEX idx_time_slots_professional_id ON time_slots(professional_id);
CREATE INDEX idx_time_slots_fecha ON time_slots(fecha);
CREATE INDEX idx_time_slots_estado ON time_slots(estado);
CREATE INDEX idx_time_slots_fecha_estado ON time_slots(fecha, estado); -- Índice compuesto para búsquedas frecuentes

-- -----------------------------------------------------------------------------
-- 1.10. BOOKINGS (Reservas de turnos)
-- -----------------------------------------------------------------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'reservado' CHECK (estado IN ('reservado', 'cancelado', 'ausente', 'presente', 'confirmado')),
    metodo_reserva VARCHAR(50) DEFAULT 'web' CHECK (metodo_reserva IN ('web', 'admin', 'app_movil', 'telefono')),
    notas TEXT,
    cancelado_por UUID REFERENCES users(id) ON DELETE SET NULL,
    cancelado_en TIMESTAMPTZ,
    motivo_cancelacion TEXT,
    confirmado BOOLEAN DEFAULT false,
    confirmado_en TIMESTAMPTZ,
    asistencia_registrada BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slot_id, student_id) -- Un estudiante no puede reservar dos veces el mismo turno
);

CREATE INDEX idx_bookings_club_id ON bookings(club_id);
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_student_id ON bookings(student_id);
CREATE INDEX idx_bookings_estado ON bookings(estado);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- -----------------------------------------------------------------------------
-- 1.11. PAYMENT_CATEGORIES (Categorías de pago)
-- -----------------------------------------------------------------------------
CREATE TABLE payment_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    monto_default DECIMAL(10, 2),
    tipo VARCHAR(50) DEFAULT 'mensual' CHECK (tipo IN ('mensual', 'semanal', 'por_clase', 'matricula', 'otro')),
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_categories_club_id ON payment_categories(club_id);
CREATE INDEX idx_payment_categories_activa ON payment_categories(activa);

-- -----------------------------------------------------------------------------
-- 1.12. PAYMENT_METHODS (Medios de pago)
-- -----------------------------------------------------------------------------
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    requiere_comprobante BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_club_id ON payment_methods(club_id);
CREATE INDEX idx_payment_methods_activo ON payment_methods(activo);

-- -----------------------------------------------------------------------------
-- 1.13. PAYMENTS (Pagos/Ingresos)
-- -----------------------------------------------------------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES payment_categories(id) ON DELETE CASCADE,
    medio_pago_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
    periodo_inicio DATE,
    periodo_fin DATE,
    comprobante_url TEXT,
    numero_recibo VARCHAR(100),
    detalle TEXT,
    estado VARCHAR(50) DEFAULT 'completado' CHECK (estado IN ('completado', 'pendiente', 'anulado')),
    registrado_por UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_club_id ON payments(club_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_categoria_id ON payments(categoria_id);
CREATE INDEX idx_payments_medio_pago_id ON payments(medio_pago_id);
CREATE INDEX idx_payments_fecha_pago ON payments(fecha_pago);
CREATE INDEX idx_payments_estado ON payments(estado);

-- -----------------------------------------------------------------------------
-- 1.14. EXPENSE_CATEGORIES (Categorías de gastos)
-- -----------------------------------------------------------------------------
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expense_categories_club_id ON expense_categories(club_id);
CREATE INDEX idx_expense_categories_activa ON expense_categories(activa);

-- -----------------------------------------------------------------------------
-- 1.15. EXPENSES (Gastos/Egresos)
-- -----------------------------------------------------------------------------
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    detalle TEXT NOT NULL,
    comprobante_url TEXT,
    numero_comprobante VARCHAR(100),
    proveedor VARCHAR(255),
    registrado_por UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expenses_club_id ON expenses(club_id);
CREATE INDEX idx_expenses_categoria_id ON expenses(categoria_id);
CREATE INDEX idx_expenses_fecha ON expenses(fecha);

-- -----------------------------------------------------------------------------
-- 1.16. NOTIFICATION_SETTINGS (Configuración de notificaciones)
-- -----------------------------------------------------------------------------
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    notificar_turnos BOOLEAN DEFAULT true,
    notificar_cancelaciones BOOLEAN DEFAULT true,
    notificar_pagos BOOLEAN DEFAULT true,
    notificar_recordatorios BOOLEAN DEFAULT true,
    canal_email BOOLEAN DEFAULT true,
    canal_sms BOOLEAN DEFAULT false,
    canal_push BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id) -- Un estudiante solo puede tener una configuración
);

CREATE INDEX idx_notification_settings_club_id ON notification_settings(club_id);
CREATE INDEX idx_notification_settings_student_id ON notification_settings(student_id);

-- =============================================================================
-- 2. TRIGGERS PARA UPDATED_AT
-- =============================================================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_categories_updated_at BEFORE UPDATE ON payment_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_categories_updated_at BEFORE UPDATE ON expense_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_first_contact_sources_updated_at BEFORE UPDATE ON first_contact_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 3. TRIGGER PARA ACTUALIZAR CUPO_ACTUAL EN TIME_SLOTS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_time_slot_cupo()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.estado = 'reservado') OR 
       (TG_OP = 'UPDATE' AND NEW.estado = 'reservado' AND OLD.estado != 'reservado') THEN
        -- Incrementar cupo
        UPDATE time_slots 
        SET cupo_actual = cupo_actual + 1 
        WHERE id = NEW.slot_id;
    ELSIF (TG_OP = 'DELETE' AND OLD.estado = 'reservado') OR 
          (TG_OP = 'UPDATE' AND OLD.estado = 'reservado' AND NEW.estado != 'reservado') THEN
        -- Decrementar cupo
        UPDATE time_slots 
        SET cupo_actual = cupo_actual - 1 
        WHERE id = COALESCE(NEW.slot_id, OLD.slot_id);
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_slot_cupo_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_time_slot_cupo();

-- =============================================================================
-- 4. FUNCIONES AUXILIARES
-- =============================================================================

-- Función para obtener el club_id del usuario autenticado
CREATE OR REPLACE FUNCTION auth.user_club_id()
RETURNS UUID AS $$
    SELECT club_id FROM users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Función para obtener el rol del usuario autenticado
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
    SELECT role FROM users WHERE auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Función para verificar si el usuario es SUPER_ADMIN
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = auth.uid() 
        AND role = 'SUPER_ADMIN'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Función para verificar si el usuario es CLUB_ADMIN de un club específico
CREATE OR REPLACE FUNCTION auth.is_club_admin(target_club_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users 
        WHERE auth_user_id = auth.uid() 
        AND club_id = target_club_id 
        AND role IN ('SUPER_ADMIN', 'CLUB_ADMIN')
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Función para obtener el student_id del usuario autenticado
CREATE OR REPLACE FUNCTION auth.user_student_id()
RETURNS UUID AS $$
    SELECT s.id FROM students s
    INNER JOIN users u ON u.id = s.user_id
    WHERE u.auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Función para obtener el professional_id del usuario autenticado
CREATE OR REPLACE FUNCTION auth.user_professional_id()
RETURNS UUID AS $$
    SELECT p.id FROM professionals p
    INNER JOIN users u ON u.id = p.user_id
    WHERE u.auth_user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) - HABILITAR EN TODAS LAS TABLAS
-- =============================================================================

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE first_contact_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 6. POLICIES RLS - CLUBS
-- =============================================================================

-- Políticas para CLUBS
CREATE POLICY "SUPER_ADMIN puede ver todos los clubs"
    ON clubs FOR SELECT
    USING (auth.is_super_admin());

CREATE POLICY "Usuarios pueden ver su propio club"
    ON clubs FOR SELECT
    USING (id = auth.user_club_id());

CREATE POLICY "SUPER_ADMIN puede insertar clubs"
    ON clubs FOR INSERT
    WITH CHECK (auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar su club"
    ON clubs FOR UPDATE
    USING (auth.is_super_admin() OR (id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "Solo SUPER_ADMIN puede eliminar clubs"
    ON clubs FOR DELETE
    USING (auth.is_super_admin());

-- =============================================================================
-- 7. POLICIES RLS - USERS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver usuarios de su club"
    ON users FOR SELECT
    USING (auth.is_super_admin() OR club_id = auth.user_club_id());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear usuarios"
    ON users FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')));

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON users FOR UPDATE
    USING (auth_user_id = auth.uid() OR auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "Solo SUPER_ADMIN y CLUB_ADMIN pueden eliminar usuarios"
    ON users FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 8. POLICIES RLS - BRANCHES
-- =============================================================================

CREATE POLICY "Usuarios pueden ver sedes de su club"
    ON branches FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear sedes"
    ON branches FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar sedes"
    ON branches FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'SUPER_ADMIN')));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar sedes"
    ON branches FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 9. POLICIES RLS - ACTIVITIES
-- =============================================================================

CREATE POLICY "Usuarios pueden ver actividades de su club"
    ON activities FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear actividades"
    ON activities FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar actividades"
    ON activities FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar actividades"
    ON activities FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 10. POLICIES RLS - PROFESSIONALS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver profesionales de su club"
    ON professionals FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear profesionales"
    ON professionals FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y el propio profesional pueden actualizar"
    ON professionals FOR UPDATE
    USING (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN') OR
        (id = auth.user_professional_id())
    );

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar profesionales"
    ON professionals FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 11. POLICIES RLS - PROFESSIONAL_ACTIVITIES
-- =============================================================================

CREATE POLICY "Usuarios pueden ver asignaciones de su club"
    ON professional_activities FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear asignaciones"
    ON professional_activities FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar asignaciones"
    ON professional_activities FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 12. POLICIES RLS - STUDENTS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver estudiantes de su club"
    ON students FOR SELECT
    USING (
        club_id = auth.user_club_id() OR 
        auth.is_super_admin() OR
        (id = auth.user_student_id()) -- El estudiante puede ver sus propios datos
    );

CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y PROFESSIONAL pueden crear estudiantes"
    ON students FOR INSERT
    WITH CHECK (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'PROFESSIONAL'))
    );

CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN, PROFESSIONAL y el propio estudiante pueden actualizar"
    ON students FOR UPDATE
    USING (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'PROFESSIONAL')) OR
        (id = auth.user_student_id())
    );

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar estudiantes"
    ON students FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 13. POLICIES RLS - FIRST_CONTACT_SOURCES
-- =============================================================================

CREATE POLICY "Usuarios pueden ver fuentes de contacto de su club"
    ON first_contact_sources FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear fuentes"
    ON first_contact_sources FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar fuentes"
    ON first_contact_sources FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar fuentes"
    ON first_contact_sources FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 14. POLICIES RLS - TIME_SLOTS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver turnos de su club"
    ON time_slots FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y PROFESSIONAL pueden crear turnos"
    ON time_slots FOR INSERT
    WITH CHECK (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'PROFESSIONAL'))
    );

CREATE POLICY "SUPER_ADMIN, CLUB_ADMIN y PROFESSIONAL pueden actualizar turnos"
    ON time_slots FOR UPDATE
    USING (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'PROFESSIONAL'))
    );

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar turnos"
    ON time_slots FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 15. POLICIES RLS - BOOKINGS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver reservas de su club"
    ON bookings FOR SELECT
    USING (
        club_id = auth.user_club_id() OR 
        auth.is_super_admin() OR
        (student_id = auth.user_student_id()) -- El estudiante puede ver sus propias reservas
    );

CREATE POLICY "Todos los usuarios autenticados pueden crear reservas de su club"
    ON bookings FOR INSERT
    WITH CHECK (
        auth.is_super_admin() OR 
        club_id = auth.user_club_id()
    );

CREATE POLICY "Usuarios pueden actualizar reservas según su rol"
    ON bookings FOR UPDATE
    USING (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() IN ('CLUB_ADMIN', 'PROFESSIONAL')) OR
        (student_id = auth.user_student_id() AND estado IN ('reservado', 'confirmado')) -- Estudiante solo puede cancelar
    );

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar reservas"
    ON bookings FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 16. POLICIES RLS - PAYMENT_CATEGORIES
-- =============================================================================

CREATE POLICY "Usuarios pueden ver categorías de pago de su club"
    ON payment_categories FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear categorías de pago"
    ON payment_categories FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar categorías de pago"
    ON payment_categories FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar categorías de pago"
    ON payment_categories FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 17. POLICIES RLS - PAYMENT_METHODS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver medios de pago de su club"
    ON payment_methods FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear medios de pago"
    ON payment_methods FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar medios de pago"
    ON payment_methods FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar medios de pago"
    ON payment_methods FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 18. POLICIES RLS - PAYMENTS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver pagos de su club"
    ON payments FOR SELECT
    USING (
        club_id = auth.user_club_id() OR 
        auth.is_super_admin() OR
        (student_id = auth.user_student_id()) -- El estudiante puede ver sus propios pagos
    );

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear pagos"
    ON payments FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar pagos"
    ON payments FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar pagos"
    ON payments FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 19. POLICIES RLS - EXPENSE_CATEGORIES
-- =============================================================================

CREATE POLICY "Usuarios pueden ver categorías de gastos de su club"
    ON expense_categories FOR SELECT
    USING (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear categorías de gastos"
    ON expense_categories FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar categorías de gastos"
    ON expense_categories FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar categorías de gastos"
    ON expense_categories FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 20. POLICIES RLS - EXPENSES
-- =============================================================================

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden ver gastos"
    ON expenses FOR SELECT
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden crear gastos"
    ON expenses FOR INSERT
    WITH CHECK (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden actualizar gastos"
    ON expenses FOR UPDATE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar gastos"
    ON expenses FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 21. POLICIES RLS - NOTIFICATION_SETTINGS
-- =============================================================================

CREATE POLICY "Usuarios pueden ver configuraciones de su club"
    ON notification_settings FOR SELECT
    USING (
        club_id = auth.user_club_id() OR 
        auth.is_super_admin() OR
        (student_id = auth.user_student_id())
    );

CREATE POLICY "Todos pueden crear configuraciones"
    ON notification_settings FOR INSERT
    WITH CHECK (club_id = auth.user_club_id() OR auth.is_super_admin());

CREATE POLICY "Usuarios pueden actualizar sus propias configuraciones"
    ON notification_settings FOR UPDATE
    USING (
        auth.is_super_admin() OR 
        (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN') OR
        (student_id = auth.user_student_id())
    );

CREATE POLICY "SUPER_ADMIN y CLUB_ADMIN pueden eliminar configuraciones"
    ON notification_settings FOR DELETE
    USING (auth.is_super_admin() OR (club_id = auth.user_club_id() AND auth.user_role() = 'CLUB_ADMIN'));

-- =============================================================================
-- 22. SEEDS INICIALES
-- =============================================================================

-- ----------------------
-- 22.1. CLUB DE EJEMPLO
-- ----------------------
INSERT INTO clubs (id, nombre, logo_url, theme, direccion, telefono, email, activa)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Club Deportivo Ejemplo',
    'https://example.com/logo.png',
    'theme-sport',
    'Av. Libertador 1234, CABA, Argentina',
    '+54 11 1234-5678',
    'info@clubejemplo.com',
    true
);

-- ----------------------
-- 22.2. SEDES
-- ----------------------
INSERT INTO branches (id, club_id, nombre, direccion, telefono, geo_lat, geo_lng, activa)
VALUES 
(
    '22222222-2222-2222-2222-222222222221',
    '11111111-1111-1111-1111-111111111111',
    'Sede Central',
    'Av. Libertador 1234, CABA',
    '+54 11 1234-5678',
    -34.5833,
    -58.4167,
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Sede Norte',
    'Av. Cabildo 2500, CABA',
    '+54 11 8765-4321',
    -34.5600,
    -58.4500,
    true
);

-- ----------------------
-- 22.3. ACTIVIDADES
-- ----------------------
INSERT INTO activities (id, club_id, nombre, descripcion, duracion_minutos, color, activa, icono, orden)
VALUES 
(
    '33333333-3333-3333-3333-333333333331',
    '11111111-1111-1111-1111-111111111111',
    'Fútbol',
    'Entrenamiento de fútbol para todas las edades',
    90,
    '#10B981',
    true,
    'football',
    1
),
(
    '33333333-3333-3333-3333-333333333332',
    '11111111-1111-1111-1111-111111111111',
    'Natación',
    'Clases de natación nivel principiante a avanzado',
    60,
    '#3B82F6',
    true,
    'swimming',
    2
),
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Tenis',
    'Clases particulares y grupales de tenis',
    60,
    '#F59E0B',
    true,
    'tennis',
    3
);

-- ----------------------
-- 22.4. PROFESIONALES
-- ----------------------
INSERT INTO professionals (id, club_id, nombre, apellido, telefono, email, estado, fecha_ingreso)
VALUES 
(
    '44444444-4444-4444-4444-444444444441',
    '11111111-1111-1111-1111-111111111111',
    'Juan',
    'Pérez',
    '+54 11 2222-3333',
    'juan.perez@clubejemplo.com',
    'activo',
    '2024-01-15'
),
(
    '44444444-4444-4444-4444-444444444442',
    '11111111-1111-1111-1111-111111111111',
    'María',
    'González',
    '+54 11 4444-5555',
    'maria.gonzalez@clubejemplo.com',
    'activo',
    '2024-02-01'
);

-- ----------------------
-- 22.5. ASIGNACIÓN PROFESIONALES-ACTIVIDADES
-- ----------------------
INSERT INTO professional_activities (club_id, professional_id, activity_id)
VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444441',
    '33333333-3333-3333-3333-333333333331'
),
(
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444442',
    '33333333-3333-3333-3333-333333333332'
);

-- ----------------------
-- 22.6. FUENTES DE CONTACTO
-- ----------------------
INSERT INTO first_contact_sources (id, club_id, nombre, descripcion, activa)
VALUES 
(
    '55555555-5555-5555-5555-555555555551',
    '11111111-1111-1111-1111-111111111111',
    'Instagram',
    'Contacto vía Instagram',
    true
),
(
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111111',
    'Google',
    'Búsqueda en Google',
    true
),
(
    '55555555-5555-5555-5555-555555555553',
    '11111111-1111-1111-1111-111111111111',
    'Referido',
    'Recomendación de otro alumno',
    true
);

-- ----------------------
-- 22.7. ESTUDIANTES
-- ----------------------
INSERT INTO students (id, club_id, numero_cliente, nombre, apellido, telefono, email, fecha_nacimiento, genero, tipo_documento, numero_documento, estado, source_id)
VALUES 
(
    '66666666-6666-6666-6666-666666666661',
    '11111111-1111-1111-1111-111111111111',
    'CLI-001',
    'Carlos',
    'Rodríguez',
    '+54 11 6666-7777',
    'carlos.rodriguez@email.com',
    '1995-05-15',
    'masculino',
    'DNI',
    '35123456',
    'activo',
    '55555555-5555-5555-5555-555555555551'
),
(
    '66666666-6666-6666-6666-666666666662',
    '11111111-1111-1111-1111-111111111111',
    'CLI-002',
    'Ana',
    'Martínez',
    '+54 11 8888-9999',
    'ana.martinez@email.com',
    '1998-08-22',
    'femenino',
    'DNI',
    '38987654',
    'activo',
    '55555555-5555-5555-5555-555555555552'
);

-- ----------------------
-- 22.8. CATEGORÍAS DE PAGO
-- ----------------------
INSERT INTO payment_categories (id, club_id, nombre, descripcion, monto_default, tipo, activa)
VALUES 
(
    '77777777-7777-7777-7777-777777777771',
    '11111111-1111-1111-1111-111111111111',
    '1 vez por semana',
    'Cuota mensual para 1 clase semanal',
    15000.00,
    'mensual',
    true
),
(
    '77777777-7777-7777-7777-777777777772',
    '11111111-1111-1111-1111-111111111111',
    '2 veces por semana',
    'Cuota mensual para 2 clases semanales',
    25000.00,
    'mensual',
    true
),
(
    '77777777-7777-7777-7777-777777777773',
    '11111111-1111-1111-1111-111111111111',
    'Libre (ilimitado)',
    'Cuota mensual ilimitada',
    40000.00,
    'mensual',
    true
);

-- ----------------------
-- 22.9. MEDIOS DE PAGO
-- ----------------------
INSERT INTO payment_methods (id, club_id, nombre, descripcion, requiere_comprobante, activo)
VALUES 
(
    '88888888-8888-8888-8888-888888888881',
    '11111111-1111-1111-1111-111111111111',
    'Efectivo',
    'Pago en efectivo',
    false,
    true
),
(
    '88888888-8888-8888-8888-888888888882',
    '11111111-1111-1111-1111-111111111111',
    'Transferencia',
    'Transferencia bancaria',
    true,
    true
),
(
    '88888888-8888-8888-8888-888888888883',
    '11111111-1111-1111-1111-111111111111',
    'Tarjeta',
    'Pago con tarjeta de crédito/débito',
    false,
    true
);

-- ----------------------
-- 22.10. CATEGORÍAS DE GASTOS
-- ----------------------
INSERT INTO expense_categories (id, club_id, nombre, descripcion, activa)
VALUES 
(
    '99999999-9999-9999-9999-999999999991',
    '11111111-1111-1111-1111-111111111111',
    'Mantenimiento',
    'Gastos de mantenimiento de instalaciones',
    true
),
(
    '99999999-9999-9999-9999-999999999992',
    '11111111-1111-1111-1111-111111111111',
    'Equipamiento',
    'Compra de equipamiento deportivo',
    true
),
(
    '99999999-9999-9999-9999-999999999993',
    '11111111-1111-1111-1111-111111111111',
    'Servicios',
    'Servicios varios (luz, agua, internet, etc)',
    true
);

-- ----------------------
-- 22.11. TURNOS DE EJEMPLO
-- ----------------------
INSERT INTO time_slots (id, club_id, activity_id, branch_id, professional_id, fecha, hora_inicio, hora_fin, cupo_maximo, estado)
VALUES 
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333331',
    '22222222-2222-2222-2222-222222222221',
    '44444444-4444-4444-4444-444444444441',
    CURRENT_DATE + INTERVAL '1 day',
    '18:00',
    '19:30',
    20,
    'activo'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333332',
    '22222222-2222-2222-2222-222222222221',
    '44444444-4444-4444-4444-444444444442',
    CURRENT_DATE + INTERVAL '2 days',
    '17:00',
    '18:00',
    15,
    'activo'
),
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444441',
    CURRENT_DATE + INTERVAL '3 days',
    '19:00',
    '20:00',
    10,
    'activo'
);

-- =============================================================================
-- 23. DIAGRAMA ER (ENTIDAD-RELACIÓN)
-- =============================================================================

/*
╔════════════════════════════════════════════════════════════════════════════╗
║                    DIAGRAMA ENTIDAD-RELACIÓN (ER)                          ║
║            Sistema Multi-Tenant de Gestión Deportiva                       ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────┐
│   CLUBS     │ (Tabla principal multi-tenant)
├─────────────┤
│ id (PK)     │
│ nombre      │
│ logo_url    │
│ theme       │
│ direccion   │
│ activa      │
└──────┬──────┘
       │
       │ (1:N) Un club tiene muchos...
       │
       ├──────────────────────────────────┬───────────────────────────┐
       │                                  │                           │
       ▼                                  ▼                           ▼
┌─────────────┐                   ┌─────────────┐            ┌─────────────┐
│   USERS     │                   │  BRANCHES   │            │ ACTIVITIES  │
├─────────────┤                   ├─────────────┤            ├─────────────┤
│ id (PK)     │                   │ id (PK)     │            │ id (PK)     │
│ club_id(FK) │                   │ club_id(FK) │            │ club_id(FK) │
│ auth_user_id│                   │ nombre      │            │ nombre      │
│ role        │                   │ direccion   │            │ duracion    │
│ nombre      │                   │ geo_lat/lng │            │ color       │
│ email       │                   │ foto_url    │            │ activa      │
└──────┬──────┘                   └──────┬──────┘            └──────┬──────┘
       │                                 │                          │
       │                                 │                          │
       ▼                                 │                          │
┌─────────────┐                          │                          │
│PROFESSIONALS│◄─────────────────────────┘                          │
├─────────────┤          (N:1)                                      │
│ id (PK)     │                                                     │
│ club_id(FK) │                                                     │
│ user_id(FK) │                                                     │
│ nombre      │                                                     │
│ estado      │                                                     │
└──────┬──────┘                                                     │
       │                                                            │
       │ (N:N) ◄────────────────────────────────────────────────────┘
       │                    PROFESSIONAL_ACTIVITIES
       │                    (Tabla intermedia)
       │
       ▼
┌─────────────┐
│ TIME_SLOTS  │ (Turnos programados)
├─────────────┤
│ id (PK)     │
│ club_id(FK) │
│ activity(FK)│
│ branch(FK)  │
│ profess(FK) │
│ fecha       │
│ hora_inicio │
│ cupo_max    │
│ estado      │
└──────┬──────┘
       │
       │ (1:N)
       │
       ▼
┌─────────────┐          ┌─────────────┐
│  BOOKINGS   │◄─────────│  STUDENTS   │
├─────────────┤  (N:1)   ├─────────────┤
│ id (PK)     │          │ id (PK)     │
│ club_id(FK) │          │ club_id(FK) │
│ slot_id(FK) │          │ user_id(FK) │
│ student(FK) │──────────│ nombre      │
│ estado      │          │ email       │
│ metodo      │          │ documento   │
│ notas       │          │ obra_social │
└─────────────┘          │ estado      │
                         └──────┬──────┘
                                │
                                │ (1:N)
                                │
                    ┌───────────┴──────────┐
                    ▼                      ▼
             ┌─────────────┐      ┌─────────────────────┐
             │  PAYMENTS   │      │NOTIFICATION_SETTINGS│
             ├─────────────┤      ├─────────────────────┤
             │ id (PK)     │      │ student_id (FK)     │
             │ club_id(FK) │      │ notificar_turnos    │
             │ student(FK) │      │ notificar_pagos     │
             │ categoria   │      │ canal_email         │
             │ medio_pago  │      └─────────────────────┘
             │ monto       │
             │ fecha_pago  │
             └──────┬──────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌─────────────────┐   ┌──────────────────┐
│PAYMENT_CATEGORIES│   │ PAYMENT_METHODS  │
├─────────────────┤   ├──────────────────┤
│ id (PK)         │   │ id (PK)          │
│ club_id (FK)    │   │ club_id (FK)     │
│ nombre          │   │ nombre           │
│ monto_default   │   │ requiere_comprob │
└─────────────────┘   └──────────────────┘


┌─────────────┐          ┌─────────────────┐
│  EXPENSES   │◄─────────│EXPENSE_CATEGORIES│
├─────────────┤  (N:1)   ├─────────────────┤
│ id (PK)     │          │ id (PK)         │
│ club_id(FK) │          │ club_id (FK)    │
│ categoria   │──────────│ nombre          │
│ monto       │          │ activa          │
│ fecha       │          └─────────────────┘
│ detalle     │
└─────────────┘

┌──────────────────────┐
│FIRST_CONTACT_SOURCES │
├──────────────────────┤
│ id (PK)              │
│ club_id (FK)         │
│ nombre               │
│ activa               │
└──────────────────────┘

RELACIONES PRINCIPALES:
═══════════════════════

1. CLUBS (1) ──→ (N) USERS, BRANCHES, ACTIVITIES, PROFESSIONALS, STUDENTS
   - Multi-tenancy: Todas las tablas están aisladas por club_id

2. PROFESSIONALS (N) ←→ (N) ACTIVITIES
   - A través de PROFESSIONAL_ACTIVITIES (tabla intermedia)

3. TIME_SLOTS depende de: ACTIVITY + BRANCH + PROFESSIONAL
   - Un turno específico requiere una actividad, sede y profesional

4. BOOKINGS conecta: STUDENTS ←→ TIME_SLOTS
   - Reserva de un alumno en un turno específico

5. PAYMENTS vincula: STUDENTS con PAYMENT_CATEGORIES y PAYMENT_METHODS
   - Registro de pagos de alumnos

6. STUDENTS pueden tener:
   - Múltiples BOOKINGS (reservas)
   - Múltiples PAYMENTS (pagos)
   - Una configuración de NOTIFICATION_SETTINGS

ÍNDICES CLAVE:
═════════════
- club_id en TODAS las tablas (multi-tenant)
- Foreign keys para integridad referencial
- Campos de búsqueda: email, estado, fecha
- Índices compuestos: (fecha, estado) en time_slots

RLS (Row Level Security):
═════════════════════════
✓ SUPER_ADMIN: Acceso total a todos los clubs
✓ CLUB_ADMIN: Acceso total a su club
✓ PROFESSIONAL: Acceso a turnos y alumnos asignados
✓ STUDENT: Solo lectura de sus propios datos y reservas

CASCADAS:
═════════
- Todas las FK con ON DELETE CASCADE
- Garantiza limpieza automática al eliminar club/usuario
*/

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================

-- INSTRUCCIONES DE USO:
-- 1. Ejecutar este script en el SQL Editor de Supabase
-- 2. Verificar que todas las tablas se crearon correctamente
-- 3. Verificar que RLS está habilitado en todas las tablas
-- 4. Crear usuarios de prueba en Supabase Auth
-- 5. Insertar registros en la tabla 'users' vinculando auth_user_id
-- 6. Probar las policies desde diferentes roles

-- NOTAS IMPORTANTES:
-- - Este esquema es compatible con Supabase y PostgreSQL 14+
-- - Requiere la extensión uuid-ossp
-- - Las policies RLS protegen todos los datos por club_id
-- - Los triggers mantienen updated_at actualizado automáticamente
-- - El trigger de bookings actualiza cupo_actual en time_slots
-- - Los seeds proporcionan datos iniciales para testing

-- PRÓXIMOS PASOS:
-- 1. Configurar Storage buckets para:
--    - logos de clubs
--    - fotos de profesionales
--    - fotos de estudiantes
--    - certificados médicos
--    - comprobantes de pago
-- 2. Crear funciones Edge para:
--    - Envío de notificaciones
--    - Generación de reportes
--    - Cálculos financieros
-- 3. Configurar triggers para:
--    - Notificar reservas nuevas
--    - Alertar certificados vencidos
--    - Recordatorios de turnos

