# 🚀 GUÍA DE INSTALACIÓN COMPLETA

## Sistema Multi-Club - Plataforma de Gestión Deportiva

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.0.0 o superior
- **pnpm** 9.0.0 o superior
- **Git** (para clonar el repositorio)

### Verificar Instalación

```bash
node --version    # Debe mostrar v18.0.0 o superior
pnpm --version    # Debe mostrar 9.0.0 o superior
```

### Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm
```

---

## 📦 Estructura del Proyecto

Este es un **monorepo** con la siguiente estructura:

```
Gestion/
├── apps/
│   └── web/              # Aplicación Next.js
├── packages/
│   ├── ui/               # Componentes compartidos
│   ├── config/           # Configuración compartida
│   └── supabase/         # Cliente de Supabase
├── gestion/              # Documentación de Supabase
├── package.json          # Config del monorepo
├── pnpm-workspace.yaml   # Config de workspaces
└── turbo.json            # Config de Turborepo
```

---

## 🔧 Instalación Paso a Paso

### 1. Instalar Dependencias

Desde la **raíz del proyecto** (donde está el `package.json` principal):

```bash
pnpm install
```

Este comando instalará todas las dependencias de:
- `apps/web`
- `packages/ui`
- `packages/config`
- `packages/supabase`

**Tiempo estimado**: 2-3 minutos

### 2. Verificar Instalación

```bash
# Verificar que se crearon los node_modules
ls node_modules          # Debe mostrar carpetas
ls apps/web/node_modules # Debe mostrar carpetas

# Verificar que pnpm reconoce los workspaces
pnpm list --depth 0
```

---

## ⚙️ Configuración

### 1. Variables de Entorno (Opcional por ahora)

Por el momento, el proyecto usa **Mock Auth** y no requiere Supabase configurado.

Si quieres configurar Supabase, crea `.env.local` en `apps/web/`:

```bash
cd apps/web
cp env.example.txt .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_AUTH=true
```

---

## 🚀 Ejecutar el Proyecto

### Opción 1: Desde la Raíz (Recomendado)

```bash
# Ejecutar todas las apps del monorepo
pnpm dev
```

### Opción 2: Solo la Web App

```bash
cd apps/web
pnpm dev
```

El proyecto estará disponible en:
👉 **http://localhost:3000**

---

## ✅ Verificar que Todo Funciona

### 1. Abrir en el Navegador

```
http://localhost:3000
```

Deberías ver la **landing page** del sistema.

### 2. Probar las Rutas

#### Landing (Público)
- `http://localhost:3000` → Home
- `http://localhost:3000/precios` → Precios
- `http://localhost:3000/contacto` → Contacto
- `http://localhost:3000/demo` → Demo

#### Auth
- `http://localhost:3000/auth/login` → Login
- `http://localhost:3000/auth/register` → Registro

#### Panel Admin (requiere login)
- `http://localhost:3000/admin` → Dashboard Admin

#### Portal Alumnos (requiere login)
- `http://localhost:3000/student` → Dashboard Alumno

### 3. Probar Mock Auth

Para acceder a las rutas protegidas, usa el **Mock Auth**:

```bash
# Abrir DevTools (F12) → Console
# Ejecutar:
fetch('/api/mock-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'club_admin' })
})
```

Luego navega a:
- `http://localhost:3000/admin` → Deberías ver el panel de admin

Para probar como alumno:

```bash
fetch('/api/mock-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role: 'student' })
})
```

Luego navega a:
- `http://localhost:3000/student` → Deberías ver el portal de alumnos

---

## 🎨 Probar Sistema de Theming

### Cambiar el Tema

Edita `apps/web/app/layout.tsx`:

```tsx
// Cambiar de theme-neutral a theme-sport o theme-sky
<body className="theme-sport">  // o theme-sky, theme-neutral
  {children}
</body>
```

Guarda el archivo y el navegador recargará automáticamente.

### Temas Disponibles

1. **theme-neutral** (Gris corporativo)
2. **theme-sky** (Azul SaaS)
3. **theme-sport** (Naranja deportivo)

---

## 🧩 Estructura del Monorepo

### Apps

```bash
apps/web/              # Next.js App Router
├── app/               # Rutas y páginas
├── lib/               # Utilidades y stores
├── middleware.ts      # Middleware de auth
└── package.json       # Dependencias
```

### Packages

```bash
packages/ui/           # Componentes compartidos
├── src/
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
└── package.json

packages/config/       # Configuración
├── src/
│   ├── constants.ts
│   ├── roles.ts
│   ├── themes.ts
│   └── index.ts
└── package.json

packages/supabase/     # Cliente de Supabase
├── src/
│   ├── client.ts
│   ├── types.ts
│   ├── hooks.ts
│   └── index.ts
└── package.json
```

---

## 📝 Scripts Disponibles

### Desde la Raíz

```bash
pnpm dev              # Ejecutar todas las apps en desarrollo
pnpm build            # Build de todas las apps
pnpm lint             # Lint de todas las apps
pnpm clean            # Limpiar node_modules y builds
```

### Desde apps/web

```bash
cd apps/web
pnpm dev              # Ejecutar solo web
pnpm build            # Build solo web
pnpm start            # Ejecutar build en producción
pnpm lint             # Lint solo web
```

---

## 🔄 Hot Reload

Next.js tiene **Hot Module Replacement** activado:

- Cambios en archivos `.tsx` → Reload automático
- Cambios en `globals.css` → Reload automático
- Cambios en `packages/*` → Reload automático (gracias a Turborepo)

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@repo/ui'"

**Solución**:

```bash
# Desde la raíz
pnpm install

# Si persiste, limpiar y reinstalar
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf apps/*/.next
pnpm install
```

### Error: "Port 3000 is already in use"

**Solución**:

```bash
# Opción 1: Matar el proceso en el puerto 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Opción 2: Usar otro puerto
cd apps/web
pnpm dev -- -p 3001
```

### Error: "React Compiler not working"

**Verificar**:

```bash
# Verificar que está instalado
cd apps/web
pnpm list babel-plugin-react-compiler

# Si no está, instalarlo
pnpm add -D babel-plugin-react-compiler
```

### Tailwind no aplica estilos

**Verificar**:

1. Que `globals.css` está importado en `app/layout.tsx`
2. Que `tailwind.config.ts` tiene los paths correctos
3. Reiniciar el servidor de desarrollo

```bash
# Detener el servidor (Ctrl+C)
# Limpiar .next
rm -rf .next
# Volver a ejecutar
pnpm dev
```

### Error de TypeScript

**Verificar tipos**:

```bash
cd apps/web
pnpm tsc --noEmit
```

Si hay errores, corregirlos antes de continuar.

---

## 📚 Documentación Adicional

### Base de Datos

- **Instalación**: `/gestion/SUPABASE-SETUP.md`
- **Integración**: `/gestion/SUPABASE-INTEGRATION.md`
- **Diagrama**: `/gestion/DATABASE-DIAGRAM.md`
- **Schema SQL**: `/gestion/supabase-schema.sql`

### Frontend

- **README**: `/apps/web/README.md`
- **Estructura**: `/RESUMEN_ESTRUCTURA_FRONTEND.md`
- **Setup General**: `/SETUP.md`

---

## 🎯 Próximos Pasos

Una vez que el proyecto esté corriendo:

### 1. Configurar Base de Datos

Sigue las instrucciones en `/gestion/SUPABASE-SETUP.md`:

1. Crear proyecto en Supabase
2. Ejecutar `supabase-schema.sql`
3. Configurar variables de entorno
4. Integrar con Next.js

### 2. Desarrollar Funcionalidades

Los layouts y rutas principales ya están creados. Ahora puedes:

1. Implementar componentes de UI completos
2. Integrar con Supabase
3. Agregar formularios con validación
4. Implementar lógica de negocio

### 3. Personalizar

1. Cambiar el tema por defecto
2. Agregar logo del club
3. Personalizar colores
4. Agregar más componentes

---

## ✅ Checklist de Verificación

- [ ] Node.js 18+ instalado
- [ ] pnpm 9+ instalado
- [ ] `pnpm install` ejecutado sin errores
- [ ] `pnpm dev` ejecuta sin errores
- [ ] Navegador muestra http://localhost:3000
- [ ] Landing page se ve correctamente
- [ ] Mock auth funciona
- [ ] Panel admin accesible
- [ ] Portal alumno accesible
- [ ] Hot reload funciona
- [ ] Cambio de tema funciona

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa esta guía nuevamente
2. Verifica la sección de Troubleshooting
3. Revisa los logs en la terminal
4. Verifica la consola del navegador (F12)

---

## 🎉 ¡Listo!

Si completaste todos los pasos, ya tienes el proyecto funcionando correctamente.

**Comando para ejecutar**:

```bash
pnpm dev
```

**URL**:

```
http://localhost:3000
```

---

**Desarrollado con ❤️ para la gestión deportiva moderna**

*Última actualización: Noviembre 2025*




