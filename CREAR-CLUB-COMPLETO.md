# 🏢 Crear Club Completo con Usuario Admin

## 📋 Resumen

Cuando creas un nuevo club desde el panel SUPER_ADMIN, ahora se crea automáticamente:

1. ✅ **El club** en la tabla `clubs`
2. ✅ **El usuario en Supabase Auth** con email y contraseña
3. ✅ **El registro en la tabla `users`** vinculado al club con rol `CLUB_ADMIN`

Esto permite que el nuevo cliente pueda:
- Acceder a la app con su email y contraseña
- Gestionar sus sedes, alumnos, profesores y actividades
- Registrar pagos y ver estadísticas

---

## 🔧 Configuración Requerida

### 1. Agregar SERVICE_ROLE_KEY al `.env.local`

Para que el servidor pueda crear usuarios en Supabase Auth, necesitas agregar la **Service Role Key**:

```bash
# En apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui  # ← AGREGAR ESTA LÍNEA
```

**⚠️ IMPORTANTE:** 
- La Service Role Key tiene permisos completos de administrador
- **NUNCA** la expongas en el cliente (frontend)
- Solo se usa en Server Actions y API Routes
- Guárdala de forma segura

### 2. Obtener la Service Role Key

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Settings → API**
3. Busca la sección **Project API keys**
4. Copia la **`service_role`** key (no la `anon` key)
5. Pégalo en tu `.env.local` como `SUPABASE_SERVICE_ROLE_KEY`

---

## 🚀 Cómo Usar

### Desde el Panel SUPER_ADMIN

1. **Accede a:** `/superadmin/clubs/nuevo`
2. **Completa el formulario:**
   - **Datos del Club:**
     - Nombre del club
     - Email del club (opcional)
     - Teléfono (opcional)
     - Dirección (opcional)
     - Tema (Sky/Sport/Neutral)
   
   - **Usuario Administrador:**
     - Nombre
     - Apellido
     - Email (será el email de login)
     - Contraseña (mínimo 6 caracteres)
     - Teléfono (opcional)

3. **Click en "Crear Club y Usuario Admin"**

4. **Resultado:**
   - Se crea el club
   - Se crea el usuario en Auth
   - Se vincula el usuario al club
   - El nuevo admin puede hacer login inmediatamente

---

## 🔄 Flujo Completo

```
SUPER_ADMIN crea club
    ↓
1. Se crea registro en tabla `clubs`
    ↓
2. Se crea usuario en `auth.users` (Supabase Auth)
   - Email confirmado automáticamente
   - Metadata con role: CLUB_ADMIN y club_id
    ↓
3. Se crea registro en tabla `users`
   - Vinculado al club creado
   - Rol: CLUB_ADMIN
   - Activo: true
    ↓
Nuevo CLUB_ADMIN puede hacer login
    ↓
Accede a /admin y gestiona su club
```

---

## ✅ Verificación

Después de crear un club, verifica que todo esté correcto:

### 1. Verificar el Club

```sql
SELECT * FROM clubs 
WHERE nombre = 'Nombre del Club Creado';
```

### 2. Verificar el Usuario en Auth

En Supabase Dashboard → Authentication → Users:
- Debe aparecer el email del admin
- Debe tener metadata con `role: CLUB_ADMIN` y `club_id`

### 3. Verificar el Registro en `users`

```sql
SELECT 
    u.*,
    c.nombre as club_nombre
FROM users u
JOIN clubs c ON c.id = u.club_id
WHERE u.email = 'email-del-admin@ejemplo.com';
```

Debe mostrar:
- `role` = `CLUB_ADMIN`
- `club_id` = ID del club creado
- `activo` = `true`

---

## 🐛 Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY no está configurada"

**Solución:**
1. Agrega `SUPABASE_SERVICE_ROLE_KEY` a tu `.env.local`
2. Reinicia el servidor de desarrollo (`pnpm dev`)

### Error: "Error al crear el usuario"

**Posibles causas:**
- El email ya está registrado en Supabase Auth
- La Service Role Key es incorrecta
- Problemas de conexión con Supabase

**Solución:**
- Verifica que el email no exista previamente
- Verifica que la Service Role Key sea correcta
- Revisa los logs del servidor para más detalles

### El club se crea pero el usuario no

**Solución:**
- El sistema automáticamente elimina el club si falla la creación del usuario
- Si el club existe pero no el usuario, elimina el club manualmente y vuelve a intentar

---

## 📝 Notas Importantes

1. **Seguridad:**
   - La Service Role Key solo se usa en Server Actions
   - Nunca se expone al cliente
   - Solo SUPER_ADMIN puede ejecutar esta acción

2. **Email del Admin:**
   - El email se confirma automáticamente (no requiere verificación)
   - El admin puede cambiar su contraseña después del primer login

3. **Rollback Automático:**
   - Si falla cualquier paso, se revierten los cambios anteriores
   - No quedan datos inconsistentes

---

## 🎯 Próximos Pasos

Después de crear el club, el nuevo CLUB_ADMIN puede:

1. **Hacer login** con su email y contraseña
2. **Acceder a `/admin`** y ver su dashboard
3. **Crear sedes** desde `/admin/sedes/nueva`
4. **Crear alumnos** desde `/admin/clientes/nuevo`
5. **Crear profesionales** desde `/admin/profesionales/nuevo`
6. **Registrar pagos** desde `/admin/pagos/nuevo`
7. **Gestionar turnos** desde `/admin/turnos`

---

**Fecha:** $(date)
**Estado:** ✅ Implementado y funcionando

