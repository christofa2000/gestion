# 🐛 ERRORES COMUNES Y SOLUCIONES

## 📖 Guía de Troubleshooting

---

## ✅ ERROR: "Package path not exported"

### **Síntomas:**
```
Module not found: Package path ./server is not exported from package @repo/supabase
```

### **Causa:**
El `package.json` de `@repo/supabase` no tenía configurados los exports de subpaths.

### **Solución:**
✅ **Ya resuelto** - Se configuró el campo `exports` en `package.json`.

**Archivo corregido:** `packages/supabase/package.json`

Ahora puedes importar:
```typescript
import { createClient } from '@repo/supabase/server'
import { supabase } from '@repo/supabase/client'
import type { UserRole } from '@repo/supabase/types'
```

Ver: `FIX-EXPORTS-SUPABASE.md` para más detalles.

---

## ✅ ERROR: "Expression expected" (JSX en comentarios)

### **Síntomas:**
```
Expression expected
packages/supabase/src/server.ts:24
```

El error apunta a una línea dentro de un comentario que contiene JSX.

### **Causa:**
React 19 + nuevo compilador parsea JSX dentro de comentarios JSDoc.

### **Solución:**
✅ **Ya resuelto** - Se eliminó el JSX de los comentarios.

**Archivos corregidos:**
- `packages/supabase/src/server.ts`
- `packages/supabase/src/hooks.ts`

Ver: `FIX-JSX-EN-COMENTARIOS.md` para más detalles.

**Regla:** NO usar JSX en comentarios JSDoc con React 19.

---

## ✅ ERROR: "Two parallel pages resolve to same path"

### **Síntomas:**
```
You cannot have two parallel pages that resolve to the same path. 
Please check /(admin)/page and /(marketing)/page.
```

### **Causa:**
Múltiples archivos `page.tsx` en route groups que resuelven a la misma URL.

### **Solución:**
✅ **Ya resuelto** - Se eliminaron los archivos duplicados.

Ver: `PROBLEMA-RESUELTO.md` para más detalles.

---

## ❌ ERROR: "pnpm: command not found"

### **Síntomas:**
```powershell
pnpm : El término 'pnpm' no se reconoce...
```

### **Causa:**
pnpm no está instalado globalmente.

### **Solución:**

```powershell
# PowerShell como Administrador
npm install -g pnpm

# Verificar instalación
pnpm --version
```

O instalar con npm:
```bash
npm install -g pnpm
```

---

## ❌ ERROR: "Missing Supabase environment variables"

### **Síntomas:**
```
Error: Missing Supabase environment variables
```

### **Causa:**
No existe el archivo `.env.local` con las credenciales.

### **Solución:**

**Opción 1 - Automática:**
```bash
setup-env.bat
```

**Opción 2 - Manual:**

Crear `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ecduvjddxyfyelqgmxii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZHV2amRkeHlmeWVscWdteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MzkwNjQsImV4cCI6MjA3OTUxNTA2NH0.rOPL94S197YRGvWPgNwqh9YiGmPpwMdPUZLL-hJLtw0
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Importante:** Reiniciar el servidor después de crear `.env.local`

---

## ❌ ERROR: "Invalid login credentials"

### **Síntomas:**
Al hacer login: "Email o contraseña incorrectos"

### **Causa:**
1. Usuario no existe en Supabase
2. Contraseña incorrecta
3. Email no confirmado

### **Solución:**

#### **1. Crear usuario en Supabase:**

Dashboard → Authentication → Users → Add user

```
Email: admin@test.com
Password: test123456
☐ Send email confirmation (desmarcar)
```

#### **2. Agregar User Metadata:**

Click en el usuario → Raw User Meta Data:

```json
{
  "role": "CLUB_ADMIN",
  "nombre": "Admin",
  "apellido": "Test",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

#### **3. Verificar email confirmado:**

En el dashboard, asegúrate que "Email Confirmed At" tiene fecha.

---

## ❌ ERROR: "Usuario sin rol asignado"

### **Síntomas:**
Después del login: "Usuario sin rol asignado. Contacta al administrador."

### **Causa:**
El `user_metadata` no tiene el campo `role`.

### **Solución:**

Editar usuario en Supabase → User Metadata:

```json
{
  "role": "CLUB_ADMIN",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

**Roles válidos:**
- `SUPER_ADMIN`
- `CLUB_ADMIN`
- `PROFESSIONAL`
- `STUDENT`

---

## ❌ ERROR: "permission denied for schema auth"

### **Síntomas:**
```
ERROR: 42501: permission denied for schema auth
```

Al ejecutar el schema SQL en Supabase.

### **Causa:**
Foreign key directa a `auth.users` que Supabase no permite.

### **Solución:**
✅ **Ya resuelto** - Se eliminó el `REFERENCES auth.users(id)`.

**Cambio:**
```sql
-- Antes ❌
auth_user_id UUID REFERENCES auth.users(id)

-- Ahora ✅
auth_user_id UUID UNIQUE NOT NULL
```

La relación se mantiene con `UNIQUE NOT NULL` y RLS policies usando `auth.uid()`.

Ver: `FIX-PERMISOS-AUTH-SCHEMA.md` para más detalles.

---

## ❌ ERROR: "relation 'first_contact_sources' does not exist"

### **Síntomas:**
```
ERROR: 42P01: relation "first_contact_sources" does not exist
```

Al ejecutar el schema SQL en Supabase.

### **Causa:**
Orden incorrecto de creación de tablas. La tabla `students` intenta referenciar `first_contact_sources` antes de que exista.

### **Solución:**
✅ **Ya resuelto** - Se corrigió el orden en `supabase-schema.sql`.

Ahora el orden correcto es:
1. `first_contact_sources` (se crea primero)
2. `students` (se crea después)

Ver: `FIX-ORDEN-TABLAS-SQL.md` para más detalles.

---

## ❌ ERROR: "relation 'clubs' does not exist"

### **Síntomas:**
```
ERROR: relation "public.clubs" does not exist
```

### **Causa:**
El schema SQL no se ha aplicado en Supabase.

### **Solución:**

1. Ve a: https://supabase.com/dashboard/project/ecduvjddxyfyelqgmxii/editor
2. SQL Editor → New Query
3. Copia el contenido de: `apps/web/supabase/supabase-schema.sql`
4. Click "Run"

Esto crea todas las tablas, índices, RLS policies, etc.

---

## ❌ ERROR: "Module not found" o errores de imports

### **Síntomas:**
```
Module not found: Can't resolve '@repo/supabase'
Module not found: Can't resolve 'lucide-react'
```

### **Causa:**
Dependencias no instaladas o cache corrupto.

### **Solución:**

```bash
# Limpiar node_modules y reinstalar
pnpm clean
pnpm install

# Si persiste:
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# En Windows:
rmdir /s /q node_modules
del pnpm-lock.yaml
pnpm install
```

---

## ❌ ERROR: Middleware no redirige correctamente

### **Síntomas:**
- Admin puede acceder a `/student`
- Student puede acceder a `/admin`
- Sin login puedes ver rutas protegidas

### **Causa:**
1. Sesión no está en cookies
2. Middleware no configurado correctamente
3. Role no está en `user_metadata`

### **Solución:**

#### **1. Verificar sesión:**

Abre DevTools → Application → Cookies → localhost:3000

Busca cookies de Supabase:
- `sb-<project-id>-auth-token`
- `sb-<project-id>-auth-token-code-verifier`

#### **2. Verificar metadata:**

```typescript
// En la consola del navegador después del login
localStorage.getItem('user-storage')
```

Debe mostrar el `role` correcto.

#### **3. Limpiar sesión:**

```bash
# En DevTools → Application
- Clear Storage
- Delete all cookies
- Clear Local Storage
- Clear Session Storage

# Luego hacer login nuevamente
```

---

## ❌ ERROR: La sesión no persiste al recargar

### **Síntomas:**
Haces login, recargas la página (F5), y te redirige al login otra vez.

### **Causa:**
Cookies de Supabase no se están guardando correctamente.

### **Solución:**

#### **1. Verificar que estás en localhost:**

Las cookies funcionan mejor en `http://localhost:3000` que en `http://127.0.0.1:3000`.

#### **2. Verificar configuración de cookies:**

En `packages/supabase/src/server.ts`, las cookies deben estar configuradas correctamente (ya lo están en este proyecto).

#### **3. Probar en navegador privado:**

A veces extensiones bloquean cookies. Prueba en modo incógnito.

---

## ❌ ERROR: TypeScript "Cannot find module"

### **Síntomas:**
```typescript
Cannot find module '@repo/supabase' or its corresponding type declarations
Cannot find module 'lucide-react'
```

### **Causa:**
1. Dependencias no instaladas
2. TypeScript no encuentra las rutas
3. Cache de VSCode/Cursor

### **Solución:**

```bash
# 1. Reinstalar dependencias
pnpm install

# 2. Reiniciar TypeScript server en VSCode/Cursor
# Cmd/Ctrl + Shift + P
# > TypeScript: Restart TS Server

# 3. Verificar tsconfig.json tiene paths correctos
```

En `apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/*", "./lib/*", "./components/*"]
    }
  }
}
```

---

## ❌ ERROR: Build falla en producción

### **Síntomas:**
```
pnpm build
❌ Type error: ...
```

### **Causa:**
Errores de TypeScript o problemas de compilación.

### **Solución:**

```bash
# Ver errores completos
pnpm build --debug

# Verificar tipos
pnpm type-check

# Limpiar y rebuilding
pnpm clean
pnpm install
pnpm build
```

---

## ❌ ERROR: Página en blanco después del login

### **Síntomas:**
Login exitoso pero la página queda en blanco o muestra error 500.

### **Causa:**
Error en el layout o componente del dashboard.

### **Solución:**

#### **1. Ver errores en consola:**

Abre DevTools → Console y Network tabs.

#### **2. Verificar que el usuario tiene los datos completos:**

Dashboard Supabase → Authentication → User:

```json
{
  "role": "CLUB_ADMIN",
  "nombre": "Admin",
  "apellido": "Test",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

#### **3. Ver logs del servidor:**

En la terminal donde corre `pnpm dev` verás errores server-side.

---

## 🆘 CHECKLIST DE DEBUGGING

Cuando algo no funciona, verifica en orden:

- [ ] **Variables de entorno:** `.env.local` existe y tiene las keys correctas
- [ ] **Dependencias:** `pnpm install` ejecutado sin errores
- [ ] **Servidor corriendo:** `pnpm dev` sin errores
- [ ] **Schema aplicado:** Tablas creadas en Supabase
- [ ] **Usuario creado:** Existe en Supabase con metadata correcta
- [ ] **Email confirmado:** Usuario tiene email confirmado
- [ ] **Cookies habilitadas:** DevTools muestra cookies de Supabase
- [ ] **Consola limpia:** No hay errores en DevTools Console
- [ ] **Network OK:** No hay errores 500 o 401 en Network tab

---

## 📚 MÁS AYUDA

| Problema | Ver |
|----------|-----|
| Setup inicial | `README-IMPORTANTE.md` |
| Configuración Supabase | `CONFIGURAR-AHORA.md` |
| Login no funciona | `SETUP-AUTH-RAPIDO.md` (sección Troubleshooting) |
| Arquitectura | `AUTENTICACION-COMPLETA.md` |
| Estructura de rutas | `PROBLEMA-RESUELTO.md` |

---

**Si ninguna solución funciona:**

1. Lee los mensajes de error completos
2. Busca en la documentación: `INDICE-DOCUMENTACION.md`
3. Revisa la consola del navegador y terminal
4. Verifica que seguiste todos los pasos de setup

---

**¡La mayoría de problemas se resuelven con un `pnpm install` y reiniciar el servidor! 🔄**

