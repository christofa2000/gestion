Contexto funcional de la app (muy importante)

Esta app de gestión tiene 3 partes bien diferenciadas y 3 tipos de usuarios:

ROLES

- SUPER_ADMIN → soy yo, el creador de la app. Tengo acceso global a todos los clubs/empresas, alumnos, sedes, pagos, etc. Solo yo puedo crear y gestionar usuarios ADMIN.
- ADMIN (CLUB_ADMIN) → personas de cada club/escuela/empresa que compran la app. Cada admin solo ve y gestiona los datos de SU club (multi-tenant, nada compartido entre clubs).
- ALUMNO (STUDENT) → clientes/alumnos cargados por cada admin. Solo ven su portal de alumnos, con info de sus clases/turnos/sedes.

PARTES DE LA APP

1. Página principal (landing / marketing)

- Es una página pública donde se explica de qué trata la app y se “vende” el sistema.
- En el header hay 2 botones:
  - Botón "ADMIN" → lleva al acceso de administradores (login).
  - Botón "ALUMNOS" → lleva al acceso de alumnos/clientes.
- El objetivo de esta página es marketing + explicación + captación de nuevos clientes (clubs/escuelas).

2. Panel de ADMIN (para cada club/empresa)

- Solo entra gente con usuario y contraseña ADMIN (CLUB_ADMIN), es decir, quienes compran la app y a quienes yo les creo el acceso.
- Cada ADMIN ve solo sus datos, nunca los de otros clubs (multi-tenant por club_id).
- Desde este panel el ADMIN puede:
  - Agregar / editar / borrar alumnos/clientes.
  - Crear y gestionar sedes (lugares donde se dan las clases).
  - Crear y gestionar profesionales/profes (entrenadores, docentes, etc.).
  - Registrar pagos de alumnos y ver historial de pagos.
  - Gestionar turnos, clases y actividades (agenda, horarios, cupos).
  - Ver sus estadísticas (turnos, pagos, etc.) solo de su club.

3. Portal de ALUMNOS (clientes de cada club)

- Solo pueden acceder alumnos que hayan sido cargados por el ADMIN de un club.
- Los alumnos se loguean o acceden con los datos que se definan según el flujo (ej: mail + contraseña o link).
- En el portal de alumnos pueden:
  - Ver las clases/actividades disponibles.
  - Elegir, reservar o ver sus turnos/clases (según funcionalidades implementadas).
  - Ver información de sedes (dónde se dan las clases).
  - Ver su información básica como alumno.

4. Rol del SUPER_ADMIN (yo, creador de la app)

- Tengo un acceso especial (SUPER_ADMIN) que no es visible para los clientes comunes.
- Puedo:
  - Ver todos los clubs/empresas y sus datos.
  - Crear nuevos usuarios ADMIN (clubes que compran la app).
  - Configurar o corregir datos globales.
- Ningún ADMIN puede crear otros ADMIN ni ver datos de otros clubs. Solo el SUPER_ADMIN tiene este poder.

Instrucciones para ti (modelo/IA)

- Siempre respetar esta separación de roles y partes de la app.
- Cuando crees nuevas pantallas, rutas o lógica:
  - Si es marketing/explicación → va a la landing (parte 1).
  - Si es gestión interna para clubs → va al panel ADMIN (parte 2).
  - Si es experiencia del alumno/cliente → va al portal ALUMNOS (parte 3).
- Nunca mezclar datos de distintos clubs: cada ADMIN solo ve lo suyo.
- Recordar que solo el SUPER_ADMIN puede crear y otorgar accesos ADMIN.
