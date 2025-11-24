# 🚀 INICIO RÁPIDO

## Instrucciones para ejecutar el proyecto

---

## ⚡ Opción 1: Script Automático (Windows)

### 1. Instalar pnpm y dependencias

Haz doble clic en:

```
install-and-run.bat
```

Esto hará:
- ✅ Instalar pnpm globalmente
- ✅ Instalar todas las dependencias del proyecto
- ✅ Configurar el monorepo

**Tiempo estimado**: 2-3 minutos

### 2. Ejecutar el proyecto

Haz doble clic en:

```
start-dev.bat
```

O desde la terminal:

```bash
pnpm dev
```

El proyecto estará disponible en:
👉 **http://localhost:3000**

---

## 🔧 Opción 2: Manual

### 1. Instalar pnpm

```bash
npm install -g pnpm
```

### 2. Instalar dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

### 3. Ejecutar el servidor

```bash
pnpm dev
```

Abre tu navegador en:
👉 **http://localhost:3000**

---

## ✅ Verificar que Funciona

### Rutas Públicas (sin login)

- **Home**: http://localhost:3000
- **Precios**: http://localhost:3000/precios
- **Contacto**: http://localhost:3000/contacto
- **Demo**: http://localhost:3000/demo

### Login Temporal (Mock Auth)

Para acceder a las rutas protegidas:

1. Abre DevTools (F12) → Console
2. Ejecuta:

```javascript
// Para entrar como Admin
fetch('/api/mock-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'club_admin' })
}).then(() => location.href = '/admin')
```

```javascript
// Para entrar como Alumno
fetch('/api/mock-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'student' })
}).then(() => location.href = '/student')
```

### Rutas Protegidas

**Panel Admin**:
- http://localhost:3000/admin
- http://localhost:3000/admin/clientes
- http://localhost:3000/admin/turnos
- http://localhost:3000/admin/pagos
- http://localhost:3000/admin/configuraciones

**Portal Alumnos**:
- http://localhost:3000/student
- http://localhost:3000/student/agenda
- http://localhost:3000/student/turnos
- http://localhost:3000/student/pagos

---

## 🎨 Cambiar el Tema

Edita `apps/web/app/layout.tsx`:

```tsx
// Línea 16 - Cambiar el className
<body className="theme-sport">  // Opciones: theme-sky, theme-sport, theme-neutral
```

Guarda y el navegador recargará automáticamente.

---

## 🐛 Si Algo No Funciona

### Error: "pnpm no se reconoce"

Ejecuta primero:

```bash
npm install -g pnpm
```

### Error: "Port 3000 already in use"

Cierra otros procesos en el puerto 3000 o usa otro puerto:

```bash
pnpm dev -- -p 3001
```

### Limpiar y Reinstalar

```bash
# Borrar carpetas generadas
rmdir /s /q node_modules
rmdir /s /q apps\web\node_modules
rmdir /s /q apps\web\.next

# Reinstalar
pnpm install
```

---

## 📚 Documentación Completa

- **Guía Completa**: `GUIA-INSTALACION.md`
- **Web App**: `apps/web/README.md`
- **Base de Datos**: `gestion/SUPABASE-SETUP.md`
- **Integración**: `gestion/SUPABASE-INTEGRATION.md`

---

## 🎯 Stack Tecnológico

- ✅ **Next.js 15** con App Router
- ✅ **React 19** con React Compiler
- ✅ **TypeScript** estricto
- ✅ **Tailwind CSS** con theming
- ✅ **pnpm** + **Turborepo**
- ✅ **Supabase** ready

---

## ✨ Comandos Útiles

```bash
# Desarrollo
pnpm dev              # Ejecutar en desarrollo

# Build
pnpm build            # Compilar para producción

# Lint
pnpm lint             # Verificar código

# Limpiar
pnpm clean            # Limpiar builds
```

---

## 🎉 ¡Todo Listo!

Si ves la landing page en http://localhost:3000, **¡el proyecto está funcionando correctamente!**

**Próximos pasos**:

1. Explora las diferentes rutas
2. Prueba el Mock Auth para acceder a Admin y Student
3. Cambia el tema para ver diferentes estilos
4. Revisa la documentación completa
5. Configura Supabase cuando estés listo

---

**Desarrollado con ❤️ para la gestión deportiva moderna**




