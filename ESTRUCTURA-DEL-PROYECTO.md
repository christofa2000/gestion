# 📁 ESTRUCTURA DEL PROYECTO - EXPLICACIÓN

## 🤔 ¿Qué es cada carpeta?

---

## ✅ **TU APLICACIÓN REAL**

### `apps/web/` ← **ESTA ES TU APP**

```
apps/web/
├── app/                    ← Rutas de Next.js (App Router)
│   ├── (admin)/           ← Panel de administración
│   ├── (student)/         ← Portal de alumnos
│   ├── (marketing)/       ← Landing pública
│   └── (auth)/            ← Autenticación
├── lib/                    ← Utilidades
├── middleware.ts           ← Protección de rutas
├── next.config.js          ← Config de Next.js
├── tailwind.config.ts      ← Config de Tailwind
└── package.json            ← Dependencias
```

**Esto es lo que ejecutas con `pnpm dev`**

---

## ✅ **PACKAGES COMPARTIDOS**

### `packages/ui/` ← Componentes compartidos

```
packages/ui/
├── src/
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
└── package.json
```

### `packages/config/` ← Configuración

```
packages/config/
├── src/
│   ├── constants.ts
│   ├── roles.ts
│   ├── themes.ts
│   └── index.ts
└── package.json
```

### `packages/supabase/` ← Cliente de Supabase

```
packages/supabase/
├── src/
│   ├── client.ts
│   ├── types.ts
│   ├── hooks.ts
│   └── index.ts
└── package.json
```

---

## ⚠️ **CARPETA PROBLEMÁTICA**

### `gestion/` ← **MEZCLA CONFUSA**

Esta carpeta contiene **DOS cosas diferentes**:

#### ❌ NO SE USA: Proyecto Next.js Viejo

```
gestion/
├── src/app/              ← Proyecto Next.js antiguo (IGNORAR)
├── package.json          ← Del proyecto viejo (IGNORAR)
├── node_modules/         ← Del proyecto viejo (IGNORAR)
└── ...                   ← Todo esto NO SE USA
```

**Problema**: Esto confunde porque parece otra app, pero NO se usa.

#### ✅ SÍ SE USA: Documentación de Supabase

```
gestion/
├── supabase-schema.sql        ← Script SQL (IMPORTANTE) ✅
├── SUPABASE-SETUP.md          ← Guía de instalación ✅
├── SUPABASE-INTEGRATION.md    ← Guía de integración ✅
├── DATABASE-DIAGRAM.md        ← Diagrama ER ✅
└── README-SUPABASE.md         ← Documentación ✅
```

**Estos archivos SÍ son importantes** pero están mezclados con código viejo.

---

## 🎯 **¿QUÉ HACER?**

### ✨ Opción Recomendada: Reorganizar

Ejecuta el script:

```bash
reorganizar-docs.bat
```

Esto hará:
1. ✅ Crear carpeta `docs/`
2. ✅ Mover archivos de documentación a `docs/`
3. ✅ Eliminar proyecto Next.js viejo
4. ✅ Eliminar carpeta `gestion/` vacía

**Resultado**:

```
Gestion/
├── apps/
│   └── web/              ← Tu app Next.js
├── packages/
│   ├── ui/
│   ├── config/
│   └── supabase/
├── docs/                 ← Toda la documentación ✨ NUEVO
│   ├── supabase-schema.sql
│   ├── SUPABASE-SETUP.md
│   ├── SUPABASE-INTEGRATION.md
│   ├── DATABASE-DIAGRAM.md
│   └── README-SUPABASE.md
├── README.md
├── package.json
└── ...
```

---

## 📊 **COMPARACIÓN**

### ❌ Estructura Actual (Confusa)

```
Gestion/
├── apps/web/           ← ✅ Tu app (SE USA)
├── packages/           ← ✅ Compartidos (SE USA)
└── gestion/            ← ⚠️ Mezcla confusa
    ├── src/            ← ❌ Proyecto viejo (NO SE USA)
    ├── node_modules/   ← ❌ Dependencias viejas (NO SE USA)
    └── *.md, *.sql     ← ✅ Documentación (SÍ SE USA)
```

**Problema**: No se sabe qué es qué

### ✅ Estructura Propuesta (Clara)

```
Gestion/
├── apps/web/           ← ✅ Tu app
├── packages/           ← ✅ Compartidos
└── docs/               ← ✅ Documentación
    ├── supabase-schema.sql
    └── *.md
```

**Ventaja**: Todo está claro y organizado

---

## 🔍 **¿POR QUÉ PASÓ ESTO?**

### Historia del Proyecto

1. **Inicio**: Se creó un proyecto Next.js en `gestion/`
   ```bash
   npx create-next-app gestion
   ```

2. **Evolución**: Se decidió hacer un monorepo
   - Se creó `apps/web/` con la estructura correcta
   - Se movió el código a `apps/web/`
   - Se dejó `gestion/` con el proyecto viejo

3. **Documentación**: Se agregó documentación de Supabase
   - Se guardó en `gestion/` porque ya existía la carpeta
   - Ahora está mezclada con código viejo

4. **Resultado**: Carpeta confusa con código viejo + documentación

---

## ✅ **RESUMEN PARA TI**

### Tu App REAL está en:

```
apps/web/  ← ESTA es tu aplicación Next.js
```

### La carpeta `gestion/` contiene:

```
✅ Documentación importante (*.md, *.sql)
❌ Proyecto Next.js viejo que NO se usa
```

### Recomendación:

```bash
# Ejecutar script de reorganización
reorganizar-docs.bat

# O manualmente:
# 1. Crear carpeta docs/
# 2. Mover archivos .md y .sql a docs/
# 3. Eliminar carpeta gestion/
```

---

## 🚀 **DESPUÉS DE REORGANIZAR**

### Estructura Final

```
Gestion/
├── apps/
│   └── web/              ← Tu aplicación Next.js
│       └── ...
│
├── packages/
│   ├── ui/               ← Componentes compartidos
│   ├── config/           ← Configuración
│   └── supabase/         ← Cliente de Supabase
│
├── docs/                 ← Documentación de Supabase
│   ├── supabase-schema.sql
│   ├── SUPABASE-SETUP.md
│   └── ...
│
├── README.md
├── INICIO-RAPIDO.md
├── GUIA-INSTALACION.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Cómo ejecutar:

```bash
# Nada cambia, sigue siendo:
pnpm install
pnpm dev
```

### Dónde está cada cosa:

```
TU APP:           apps/web/
COMPONENTES:      packages/ui/
CONFIGURACIÓN:    packages/config/
SUPABASE CLIENT:  packages/supabase/
DOCUMENTACIÓN:    docs/           ← NUEVO
BASE DE DATOS:    docs/supabase-schema.sql
```

---

## 💡 **CONCLUSIÓN**

### Respuesta corta:

La carpeta `gestion/` **NO es parte de tu app**.

Contiene:
- ❌ Un proyecto Next.js viejo que NO se usa
- ✅ Documentación de Supabase que SÍ se usa

### Acción recomendada:

1. Ejecuta `reorganizar-docs.bat`
2. Verifica que todo siga funcionando con `pnpm dev`
3. Disfruta de una estructura más clara

---

**¿Preguntas?**

- ¿Qué ejecuto? → `apps/web/` con `pnpm dev`
- ¿Dónde está la documentación? → En `gestion/*.md` (moverlo a `docs/`)
- ¿Puedo borrar `gestion/`? → Sí, después de mover los `.md` y `.sql`

---

**Desarrollado con ❤️ para una estructura de proyecto limpia y clara**

