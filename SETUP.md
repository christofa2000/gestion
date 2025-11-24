# 🚀 Guía de Instalación y Configuración

Esta guía te ayudará a configurar el proyecto desde cero.

## ✅ Prerequisitos

### 1. Node.js (versión 18 o superior)

Verifica si ya tienes Node.js instalado:

```bash
node --version
```

Si no lo tienes o tienes una versión inferior a 18, descárgalo desde: https://nodejs.org/

### 2. pnpm (gestor de paquetes)

Este proyecto **requiere pnpm** para funcionar correctamente.

**Instalar pnpm globalmente:**

```bash
npm install -g pnpm@9
```

O usando PowerShell (Windows):

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

Verifica la instalación:

```bash
pnpm --version
```

## 📦 Instalación del Proyecto

### Paso 1: Instalar Dependencias

Desde la raíz del proyecto, ejecuta:

```bash
pnpm install
```

Este comando instalará todas las dependencias del monorepo incluyendo:
- Next.js 15
- React 18
- Supabase cliente
- Tailwind CSS
- TypeScript
- Turborepo

### Paso 2: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:

```bash
copy apps\web\.env.local.example apps\web\.env.local
```

2. Edita `apps/web/.env.local` y añade tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **Nota:** Si aún no tienes un proyecto en Supabase:
> 1. Ve a https://supabase.com
> 2. Crea una cuenta gratuita
> 3. Crea un nuevo proyecto
> 4. Copia las credenciales desde Project Settings > API

### Paso 3: Ejecutar en Modo Desarrollo

```bash
pnpm dev
```

Esto iniciará:
- Next.js en `http://localhost:3000`
- Turborepo en modo watch para compilar los paquetes automáticamente

## 🌐 Acceder a la Aplicación

Una vez que el servidor esté corriendo:

- **Página principal:** http://localhost:3000
- **Panel Admin:** http://localhost:3000/admin
- **Portal Estudiante:** http://localhost:3000/student
- **Login:** http://localhost:3000/auth/login

## 🎨 Cambiar el Tema

Para cambiar el tema de la aplicación, edita `apps/web/app/layout.tsx`:

```tsx
// Cambia "theme-neutral" por "theme-sky" o "theme-sport"
<body className="theme-neutral">
```

Temas disponibles:
- `theme-sky` - Azules modernos (look SaaS)
- `theme-sport` - Naranja deportivo
- `theme-neutral` - Grises corporativos

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev          # Inicia todos los proyectos en modo desarrollo

# Build
pnpm build        # Construye todos los proyectos para producción

# Linting
pnpm lint         # Ejecuta ESLint en todos los proyectos

# Limpieza
pnpm clean        # Limpia node_modules y archivos de build

# Formateo
pnpm format       # Formatea el código con Prettier
```

## 🐛 Solución de Problemas

### Error: "pnpm no se reconoce como comando"

**Solución:** Instala pnpm globalmente (ver Prerequisitos).

### Error: "Missing Supabase environment variables"

**Solución:** Verifica que existe el archivo `apps/web/.env.local` con las variables correctas.

### Error de compilación en TypeScript

**Solución:** Asegúrate de que todas las dependencias estén instaladas:

```bash
pnpm install
```

### Puerto 3000 ya en uso

**Solución:** Puedes cambiar el puerto:

```bash
cd apps/web
pnpm dev -- -p 3001
```

## 📝 Próximos Pasos

1. ✅ Configurar base de datos en Supabase
2. ✅ Implementar autenticación
3. ✅ Crear módulos de gestión
4. ✅ Agregar sistema de reservas
5. ✅ Implementar dashboard

## 🆘 Ayuda

Si tienes problemas, consulta:
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Turborepo](https://turbo.build/repo/docs)
- Archivo `.cursorrules` en la raíz del proyecto




