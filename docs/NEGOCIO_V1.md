# NEGOCIO_V1 — Sistema multi-club (Gestión alumnos / turnos)

## Roles

- `SUPER_ADMIN`
  - Es el dueño de la plataforma.
  - Crea clubes.
  - Crea usuarios `CLUB_ADMIN` para cada club.
  - Puede ver todo (todos los clubes).

- `CLUB_ADMIN`
  - Administra SOLO su club (`club_id`).
  - Crea y gestiona:
    - Alumnos (`STUDENT`)
    - Profesionales / entrenadores
  - Maneja turnos, pagos, reportes de su club.

- `STUDENT`
  - Alumno/a de un club.
  - Solo ve su portal:
    - Clases, horarios, pagos, datos personales.
  - No puede crear ni editar otros usuarios.

---

## Apps / Rutas principales

- Landing pública
  - Ruta: `/`
  - Contenido: marketing + botones
    - “Soy Admin” → `/admin`
    - “Soy Alumno” → `/student`

- Portal Superadmin
  - Ruta: `/superadmin`
  - Acceso: solo `SUPER_ADMIN`

- Portal Admin de Club
  - Ruta: `/admin`
  - Acceso: `CLUB_ADMIN` (y opcionalmente `SUPER_ADMIN` viendo como admin)

- Portal Alumnos
  - Ruta: `/student`
  - Acceso: `STUDENT`

---

## Reglas de negocio base

1. **Creación de clubes y admins**
   - Solo `SUPER_ADMIN` puede:
     - Crear un registro en `clubs`.
     - Crear el usuario `CLUB_ADMIN` asociado a ese club.
   - Al crear un nuevo usuario:
     - Se genera usuario en Supabase Auth (email + password).
     - Se guarda su perfil en `users` / `profiles` con:
       - `role`
       - `club_id` (si aplica)
     - Se envía email con:
       - Link de verificación (Supabase)
       - Usuario (email) + instrucciones para el password.

2. **Creación de alumnos y profesionales**
   - Solo `CLUB_ADMIN` puede crear:
     - Alumnos (`STUDENT`) de su propio club.
     - Profesionales/entrenadores asociados a su club.
   - Siempre se respeta `club_id` del admin que realiza la acción.

3. **Acceso por rol**
   - `SUPER_ADMIN`
     - Puede listar todos los clubes.
     - Puede ver todos los admins y alumnos.

   - `CLUB_ADMIN`
     - Solo ve datos filtrados por su `club_id`.
     - No puede cambiar su propio `role`.

   - `STUDENT`
     - Solo ve sus propios datos y sus clases.
     - No puede ver otros alumnos.

4. **Multi-tenant (muy importante)**
   - Toda consulta sensible (alumnos, pagos, turnos, etc.) se filtra por:
     - `club_id` del usuario autenticado
     - o por su `user_id` si es alumno.

---

## Casos de uso V1 (orden de implementación)

1. **Caso 1 — SUPER_ADMIN crea un nuevo club + usuario admin**
   - Inputs:
     - datos del club (nombre, ciudad, etc.)
     - datos del admin (nombre, email)
   - Resultado:
     - Registro en `clubs`
     - Usuario `CLUB_ADMIN` creado (Auth + tabla `users`)
     - Email de verificación enviado.

2. **Caso 2 — CLUB_ADMIN crea un alumno**
   - Inputs:
     - datos del alumno (nombre, email, etc.)
   - Resultado:
     - Usuario `STUDENT` creado (Auth + `users`)
     - Asignado al `club_id` del admin logueado.
     - Email enviado al alumno.

3. **Caso 3 — STUDENT ve su portal**
   - El alumno inicia sesión.
   - Es redirigido a `/student`.
   - Ve solo su información y sus clases.

> Toda la lógica nueva del backend debe seguir ESTOS casos y reglas. Nada por fuera.
