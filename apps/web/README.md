# 🚀 Plataforma Multi-Club - Web App

Sistema de gestión de turnos, alumnos, pagos y actividades deportivas con arquitectura multi-tenant.

---

## 📋 Stack Tecnológico

- **Next.js 15** (App Router)
- **React 19** con **React Compiler** activado
- **TypeScript** estricto
- **Tailwind CSS** con sistema de theming por CSS variables
- **Supabase** (PostgreSQL + Auth + RLS)
- **pnpm** + **Turborepo** (monorepo)

---

## 🎨 Características

### ✅ Multi-Tenant Completo
- Cada club tiene sus datos aislados
- Sistema de theming personalizable (3 paletas: Sky, Sport, Neutral)
- Logo personalizado por club

### ✅ 4 Roles de Usuario
- **SUPER_ADMIN**: Administrador global
- **CLUB_ADMIN**: Administrador del club
- **PROFESSIONAL**: Instructor/Profesor
- **STUDENT**: Alumno/Cliente

### ✅ Módulos Implementados

#### Panel Admin
- 📊 **Dashboard**: Estadísticas y métricas en tiempo real
- 👥 **Clientes**: Gestión de alumnos (CRUD completo)
- 📅 **Turnos**: Programación y gestión de clases
- 💰 **Pagos**: Registro de ingresos y estado de cuenta
- 💸 **Egresos**: Control de gastos del club
- ⚙️ **Configuraciones**: Actividades, sedes, profesionales, usuarios

#### Portal Alumnos
- 📅 **Agenda**: Ver turnos disponibles y reservar
- 🎫 **Mis Turnos**: Gestión de reservas propias
- 💳 **Pagos**: Historial y estado de cuenta
- 👤 **Perfil**: Actualizar datos personales

#### Landing Marketing
- 🏠 **Home**: Landing comercial
- 💰 **Precios**: Planes y tarifas
- 📞 **Contacto**: Formulario de contacto
- 🎮 **Demo**: Solicitar demo

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

Desde la raíz del proyecto (donde está `package.json`):

```bash
pnpm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en `apps/web/`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mock Auth (temporal, remover cuando integres Supabase Auth)
NEXT_PUBLIC_MOCK_AUTH=true
```

### 3. Ejecutar el Proyecto

Desde la raíz del monorepo:

```bash
pnpm dev
```

O solo la web app:

```bash
cd apps/web
pnpm dev
```

El proyecto estará disponible en: **http://localhost:3000**

---

## 📁 Estructura de Carpetas

```
apps/web/
├── app/
│   ├── (admin)/              # Panel de administración
│   │   ├── admin/
│   │   │   ├── clientes/     # Gestión de alumnos
│   │   │   ├── turnos/       # Gestión de clases
│   │   │   ├── pagos/        # Gestión de pagos
│   │   │   ├── egresos/      # Gestión de gastos
│   │   │   ├── estadisticas/ # Dashboard y reportes
│   │   │   └── configuraciones/
│   │   │       ├── actividades/
│   │   │       ├── sedes/
│   │   │       ├── profesionales/
│   │   │       ├── usuarios/
│   │   │       ├── pagos/    # Config de categorías y métodos
│   │   │       └── club/     # Config general del club
│   │   ├── layout.tsx        # Layout con sidebar admin
│   │   └── page.tsx          # Redirect a /admin
│   │
│   ├── (student)/            # Portal de alumnos
│   │   ├── student/
│   │   │   ├── agenda/       # Ver y reservar turnos
│   │   │   ├── turnos/       # Mis reservas
│   │   │   ├── pagos/        # Mi estado de cuenta
│   │   │   └── perfil/       # Mi perfil
│   │   ├── layout.tsx        # Layout con bottom nav
│   │   └── page.tsx          # Redirect a /student/agenda
│   │
│   ├── (marketing)/          # Landing pública
│   │   ├── contacto/
│   │   ├── demo/
│   │   ├── precios/
│   │   ├── layout.tsx        # Layout marketing
│   │   └── page.tsx          # Home
│   │
│   ├── (auth)/               # Autenticación
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── recover/
│   │   └── layout.tsx
│   │
│   ├── api/                  # API Routes
│   │   └── mock-auth/        # Mock auth temporal
│   │
│   ├── globals.css           # Estilos globales + theming
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Root redirect
│
├── lib/
│   ├── stores/               # Zustand stores
│   │   ├── club-store.ts     # Estado del club
│   │   └── theme-store.ts    # Estado del theme
│   └── utils/
│       ├── auth-helpers.ts   # Helpers de autenticación
│       └── cn.ts             # Utility para clsx + tailwind-merge
│
├── middleware.ts             # Middleware de autenticación
├── next.config.js            # Config de Next.js + React Compiler
├── tailwind.config.ts        # Config de Tailwind + theming
├── tsconfig.json             # Config de TypeScript
└── package.json              # Dependencias
```

---

## 🎨 Sistema de Theming

### 3 Paletas Disponibles

#### 1. **theme-sky** (Look SaaS moderno)
- Azules claros (#0284c7, #bae6fd)
- Fondo suave (#f0f9ff)
- Ideal para: Aplicaciones corporativas

#### 2. **theme-sport** (Look deportivo)
- Naranjas vibrantes (#ea580c, #fed7aa)
- Fondo cálido (#fff7ed)
- Ideal para: Clubes deportivos energéticos

#### 3. **theme-neutral** (Look corporativo)
- Grises neutros (#404040, #d4d4d4)
- Fondo limpio (#f5f5f5)
- Ideal para: Aplicaciones profesionales

### Uso

```tsx
// En el layout.tsx
<body className="theme-sport">
  {children}
</body>

// O dinámicamente con Zustand
const { theme } = useThemeStore();
<body className={theme}>
  {children}
</body>
```

---

## 🔐 Autenticación

### Mock Auth (Temporal)

Por ahora usa un sistema de autenticación mock. Para hacer login:

```
POST /api/mock-auth
Body: { role: 'club_admin' | 'student' | 'professional' }
```

Esto seteará cookies para simular autenticación.

### Integración con Supabase (Próximo paso)

Ver documentación en `/gestion/SUPABASE-INTEGRATION.md`

---

## 🧩 Packages del Monorepo

### `@repo/ui`
Componentes reutilizables:
- Button, Input, Card
- AppSidebar (admin)
- StudentBottomNav (alumnos)
- ThemeSwitcher
- ClubLogo

### `@repo/config`
Constantes y configuración:
- Roles de usuario
- Themes disponibles
- Constantes de la app

### `@repo/supabase`
Cliente de Supabase y hooks:
- Client (browser y server)
- Types generados
- Custom hooks

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Ejecutar en modo desarrollo

# Build
pnpm build            # Compilar para producción

# Lint
pnpm lint             # Ejecutar ESLint

# Producción
pnpm start            # Ejecutar build en producción
```

---

## 🔧 Configuración Avanzada

### React Compiler

El React Compiler está **activado** en `next.config.js`:

```js
experimental: {
  reactCompiler: true,
}
```

Optimiza automáticamente los componentes sin necesidad de `useMemo` y `useCallback`.

### Tailwind CSS

Configurado con CSS variables para theming dinámico. Ver `globals.css` y `tailwind.config.ts`.

### TypeScript

Modo estricto habilitado. Ver `tsconfig.json`.

---

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecta el repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otros Providers

Compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

---

## 📚 Documentación Adicional

- **Base de Datos**: `/gestion/SUPABASE-SETUP.md`
- **Integración**: `/gestion/SUPABASE-INTEGRATION.md`
- **Diagrama ER**: `/gestion/DATABASE-DIAGRAM.md`
- **Estructura Frontend**: `/RESUMEN_ESTRUCTURA_FRONTEND.md`

---

## 🐛 Troubleshooting

### Error: "Module not found @repo/ui"

```bash
# Reinstalar dependencias
pnpm install

# Limpiar y reinstalar
rm -rf node_modules .next
pnpm install
```

### Error: "React Compiler not working"

Verificar que tienes instalado `babel-plugin-react-compiler`:

```bash
pnpm add -D babel-plugin-react-compiler
```

### Tailwind no aplica estilos

Verificar que `globals.css` está importado en `app/layout.tsx`:

```tsx
import "./globals.css";
```

---

## 🎯 Próximos Pasos

1. ✅ Estructura de carpetas creada
2. ✅ React Compiler activado
3. ✅ Tailwind configurado con theming
4. ✅ Layouts para Admin, Student y Marketing
5. ⏳ Integrar Supabase Auth
6. ⏳ Implementar queries de datos
7. ⏳ Crear componentes de UI completos
8. ⏳ Implementar formularios con validación
9. ⏳ Agregar tests

---

## 📄 Licencia

Este proyecto es parte de la plataforma de gestión multi-club.

---

**Desarrollado con ❤️ para la gestión deportiva moderna**

*Versión: 1.0.0*
