# 🚀 SETUP RÁPIDO - AUTENTICACIÓN

## 1️⃣ Instalar Dependencias

```bash
cd apps/web
pnpm install
```

Esto instalará automáticamente:
- `@supabase/supabase-js`
- `@supabase/ssr`
- `zustand` (store)
- `react-hook-form` (formularios)
- `zod` (validación)
- `@hookform/resolvers`

---

## 2️⃣ Configurar Variables de Entorno

Crear archivo `apps/web/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Site URL (para redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**¿Dónde obtener las keys?**
1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto (gratis)
3. Ve a **Settings → API**
4. Copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3️⃣ Crear Usuario de Prueba en Supabase

### Dashboard de Supabase:

1. Ve a **Authentication → Users**
2. Click **Add user**
3. Email: `admin@test.com`
4. Password: `test123456`
5. **Importante:** Deshabilitar "Send email confirmation"

### Agregar metadata (rol):

1. Click en el usuario creado
2. Ve a la pestaña **Raw User Meta Data**
3. Pega este JSON:

```json
{
  "role": "CLUB_ADMIN",
  "nombre": "Admin",
  "apellido": "Test",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

4. Click **Save**

### Crear usuario STUDENT:

Repetir el proceso con:

```json
{
  "role": "STUDENT",
  "nombre": "Juan",
  "apellido": "Pérez",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

Email: `student@test.com`, Password: `test123456`

---

## 4️⃣ Ejecutar Aplicación

Desde la raíz del proyecto:

```bash
pnpm dev
```

O desde `apps/web`:

```bash
cd apps/web
pnpm dev
```

Abre: http://localhost:3000/auth/login

---

## 5️⃣ Probar Login

### Como ADMIN:
- Email: `admin@test.com`
- Password: `test123456`
- **Resultado:** Redirige a `/admin` (dashboard)

### Como STUDENT:
- Email: `student@test.com`
- Password: `test123456`
- **Resultado:** Redirige a `/student` (portal alumno)

---

## 6️⃣ Verificar que Funciona

✅ **Login exitoso:**
- Ves el dashboard con sidebar (admin)
- O ves el portal con nav inferior (student)
- Header muestra tu nombre

✅ **Protección de rutas:**
- Admin no puede acceder a `/student`
- Student no puede acceder a `/admin`
- Sin login, redirige a `/auth/login`

✅ **Persistencia:**
- Recargar página mantiene sesión
- Cerrar tab pierde sesión (sessionStorage)

✅ **Logout:**
- Click en botón de logout
- Redirige a login
- No puede acceder a rutas protegidas

---

## 7️⃣ Probar Registro

1. Ve a `/auth/register`
2. Completa formulario
3. Se crea usuario con rol `STUDENT`
4. Recibes email de confirmación
5. Confirma email en inbox
6. Haz login con esas credenciales

---

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"

- ✅ Verifica que `.env.local` existe en `apps/web/`
- ✅ Verifica que las variables empiezan con `NEXT_PUBLIC_`
- ✅ Reinicia el servidor después de crear `.env.local`

### Error: "Invalid login credentials"

- ✅ Verifica email y password
- ✅ Asegúrate que el usuario existe en Supabase
- ✅ Verifica que email está confirmado

### Error: "Usuario sin rol asignado"

- ✅ Edita el usuario en Supabase
- ✅ Agrega `user_metadata` con el campo `role`
- ✅ Valores válidos: `SUPER_ADMIN`, `CLUB_ADMIN`, `PROFESSIONAL`, `STUDENT`

### El login funciona pero no redirige

- ✅ Verifica que `user_metadata.role` está configurado
- ✅ Revisa la consola del navegador por errores
- ✅ Verifica que el middleware se está ejecutando

### Session no persiste

- ✅ Verifica cookies en DevTools
- ✅ Asegúrate que `sessionStorage` está habilitado
- ✅ El store de Zustand usa `sessionStorage` (no persiste entre tabs)

---

## 📝 Notas Importantes

1. **Roles disponibles:**
   - `SUPER_ADMIN` → Acceso total
   - `CLUB_ADMIN` → Panel admin completo
   - `PROFESSIONAL` → Solo turnos y clientes
   - `STUDENT` → Portal de alumno

2. **Rutas protegidas:**
   - `/admin/*` → Admin, Professional
   - `/student/*` → Student
   - `/auth/*` → Solo no autenticados

3. **Persistencia:**
   - Se usa `sessionStorage` (se pierde al cerrar tab)
   - Para persistencia entre tabs, cambiar a `localStorage` en `useUserStore.ts`

4. **Seguridad:**
   - Middleware protege en server-side
   - Layouts verifican sesión
   - RLS de Supabase (pendiente configurar)

---

## ✅ Checklist de Verificación

- [ ] Dependencias instaladas (`pnpm install`)
- [ ] `.env.local` creado con keys de Supabase
- [ ] Usuario admin creado en Supabase con metadata
- [ ] Usuario student creado en Supabase con metadata
- [ ] `pnpm dev` ejecutándose sin errores
- [ ] Login como admin funciona → `/admin`
- [ ] Login como student funciona → `/student`
- [ ] Logout funciona correctamente
- [ ] Protección de rutas funciona
- [ ] Registro de nuevo usuario funciona

---

## 🎯 Siguiente Paso

Una vez que todo funcione:

1. **Configurar base de datos:** Aplicar schema SQL de Supabase
2. **Activar RLS:** Configurar policies por `club_id`
3. **Desarrollar módulos:** Clientes, Turnos, Pagos, etc.

**¡Listo para empezar a desarrollar! 🚀**




