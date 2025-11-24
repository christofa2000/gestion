# ⚡ CONFIGURACIÓN RÁPIDA - 2 MINUTOS

## 🎯 YA TIENES LAS CREDENCIALES DE SUPABASE

Tu proyecto ya está configurado con:

- **Project URL:** https://ecduvjddxyfyelqgmxii.supabase.co
- **Project ID:** ecduvjddxyfyelqgmxii
- **Region:** South America

---

## 🚀 PASOS PARA EMPEZAR

### **Opción 1: Script Automático (Windows)**

```bash
# Desde la raíz del proyecto
setup-env.bat
```

Esto creará automáticamente `apps/web/.env.local` con las credenciales correctas.

---

### **Opción 2: Manual**

1. **Crear archivo** `apps/web/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ecduvjddxyfyelqgmxii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZHV2amRkeHlmeWVscWdteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MzkwNjQsImV4cCI6MjA3OTUxNTA2NH0.rOPL94S197YRGvWPgNwqh9YiGmPpwMdPUZLL-hJLtw0

# Site URL (para redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. **Copiar el contenido de arriba** al archivo

---

## 🏃 EJECUTAR LA APLICACIÓN

```bash
pnpm dev
```

Abre: **http://localhost:3000**

---

## ✅ VERIFICAR QUE FUNCIONA

La página principal mostrará:

✅ **"✅ Supabase Conectado"** → Todo OK  
⚠️ **"Conexión OK - Tabla 'clubs' pendiente de crear"** → Normal, aún no aplicaste el schema  
❌ **"❌ Error de Conexión"** → Verifica las variables de entorno

---

## 📝 SIGUIENTE PASO: APLICAR SCHEMA SQL

Una vez que veas la página funcionando:

### 1. **Ve al dashboard de Supabase:**

https://supabase.com/dashboard/project/ecduvjddxyfyelqgmxii

### 2. **Ve a SQL Editor**

### 3. **Ejecuta el schema:**

El archivo está en: `apps/web/supabase/supabase-schema.sql`

O copia este comando completo:

```sql
-- Ver contenido del schema en apps/web/supabase/supabase-schema.sql
-- Ejecutar todo el archivo en SQL Editor
```

### 4. **Crear usuario de prueba:**

Ve a **Authentication → Users → Add user**

**Admin:**

- Email: `admin@test.com`
- Password: `test123456`
- Desmarcar "Send email confirmation"
- En **User Metadata** (Raw JSON):

```json
{
  "role": "CLUB_ADMIN",
  "nombre": "Admin",
  "apellido": "Test",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

**Student:**

- Email: `student@test.com`
- Password: `test123456`
- Desmarcar "Send email confirmation"
- En **User Metadata**:

```json
{
  "role": "STUDENT",
  "nombre": "Juan",
  "apellido": "Pérez",
  "club_id": "00000000-0000-0000-0000-000000000001"
}
```

---

## 🎉 PROBAR LOGIN

### Como Admin:

```
URL: http://localhost:3000/auth/login
Email: admin@test.com
Password: test123456
→ Redirige a /admin
```

### Como Student:

```
URL: http://localhost:3000/auth/login
Email: student@test.com
Password: test123456
→ Redirige a /student
```

---

## 🐛 PROBLEMAS COMUNES

### Error: "Missing Supabase environment variables"

- ✅ Verifica que `.env.local` existe en `apps/web/`
- ✅ Reinicia el servidor (`Ctrl+C` y `pnpm dev`)

### Error: "relation 'clubs' does not exist"

- ✅ Es normal si aún no aplicaste el schema SQL
- ✅ La página igual mostrará "Conexión OK"
- ✅ Aplica el schema desde Supabase dashboard

### El login no funciona

- ✅ Verifica que creaste el usuario en Supabase
- ✅ Verifica que agregaste el `user_metadata` con el campo `role`
- ✅ Verifica que desmarcaste "Send email confirmation"

---

## 📊 RESUMEN DE ESTADO

✅ **Proyecto Next.js** → Creado  
✅ **Monorepo configurado** → pnpm workspaces  
✅ **Autenticación completa** → Login, Register, Recover  
✅ **Middleware de protección** → Por roles  
✅ **Layouts Admin y Student** → Con sesión  
✅ **Componentes UI** → Header, Sidebar, Nav  
⏳ **Schema SQL** → Pendiente aplicar  
⏳ **Usuarios de prueba** → Pendiente crear  
⏳ **Módulos de negocio** → Pendiente desarrollar

---

## 🎯 CHECKLIST

- [ ] Ejecutar `setup-env.bat` o crear `.env.local` manual
- [ ] Ejecutar `pnpm dev`
- [ ] Ver página principal con estado de Supabase
- [ ] Aplicar schema SQL en Supabase dashboard
- [ ] Crear usuarios admin y student
- [ ] Probar login como admin → `/admin`
- [ ] Probar login como student → `/student`
- [ ] ¡Empezar a desarrollar!

---

## 📚 DOCUMENTACIÓN COMPLETA

- **Configuración rápida:** Este archivo
- **Autenticación completa:** `AUTENTICACION-COMPLETA.md`
- **Setup detallado:** `SETUP-AUTH-RAPIDO.md`
- **Schema SQL:** `apps/web/supabase/supabase-schema.sql`
- **Índice general:** `INDICE-DOCUMENTACION.md`

---

**¡Todo listo para empezar! 🚀**

**Tu proyecto está configurado con:**

- ✅ Next.js 15 + React 19
- ✅ Supabase conectado
- ✅ Autenticación completa
- ✅ Multi-tenant ready
- ✅ TypeScript strict
- ✅ Tailwind CSS + theming



