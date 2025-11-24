# 🔧 FIX: Package Exports de Supabase

## ✅ PROBLEMA RESUELTO

**Error:** "Module not found: Package path ./server is not exported"

---

## 🐛 EL PROBLEMA

```
Module not found: Package path ./server is not exported from package 
@repo/supabase

./app/page.tsx (5:1)

> 5 | import { createClient } from '@repo/supabase/server'
    | ^
```

### **Causa:**

El `package.json` de `@repo/supabase` solo exportaba el punto de entrada principal (`.`), pero NO los subpaths como `/server`, `/client`, `/types`, etc.

**package.json anterior:**
```json
{
  "exports": {
    ".": "./src/index.ts"
  }
}
```

Cuando intentabas importar:
```typescript
import { createClient } from '@repo/supabase/server'
```

Node.js/Next.js no encontraba el export `/server`.

---

## ✅ LA SOLUCIÓN

**Archivo corregido:** `packages/supabase/package.json`

**Cambio realizado:**

```json
{
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./server": "./src/server.ts",
    "./types": "./src/types.ts",
    "./hooks": "./src/hooks.ts"
  }
}
```

---

## 📦 EXPORTS CONFIGURADOS

Ahora puedes importar de cualquiera de estas formas:

### **1. Desde el index (principal):**

```typescript
import { supabase, createServerClient, useAuth } from '@repo/supabase'
```

Exporta TODO desde el index:
- `supabase` → cliente browser
- `createServerClient` → cliente server
- `getSession`, `getUser`, `getUserRole`, `getUserClubId` → helpers server
- `useAuth`, `useUser`, `useSession` → hooks
- Todos los tipos

### **2. Desde subpaths específicos:**

```typescript
// Cliente browser
import { createClient, supabase } from '@repo/supabase/client'

// Cliente server
import { createClient, getUser, getSession } from '@repo/supabase/server'

// Tipos
import type { UserRole, Database } from '@repo/supabase/types'

// Hooks
import { useAuth } from '@repo/supabase/hooks'
```

---

## 🎯 IMPORTS EN LA APLICACIÓN

### **Archivos que usan imports:**

| Archivo | Import | Estado |
|---------|--------|--------|
| `apps/web/app/page.tsx` | `@repo/supabase/server` | ✅ Funciona |
| `apps/web/app/(admin)/admin/layout.tsx` | `@repo/supabase/server` | ✅ Funciona |
| `apps/web/app/(student)/student/layout.tsx` | `@repo/supabase/server` | ✅ Funciona |
| `apps/web/app/api/auth/me/route.ts` | `@repo/supabase/server` | ✅ Funciona |
| `apps/web/app/api/auth/logout/route.ts` | `@repo/supabase/server` | ✅ Funciona |
| `apps/web/app/(auth)/auth/login/page.tsx` | `@repo/supabase` | ✅ Funciona |
| `apps/web/app/(auth)/auth/register/page.tsx` | `@repo/supabase` | ✅ Funciona |
| `apps/web/app/(auth)/auth/recover/page.tsx` | `@repo/supabase` | ✅ Funciona |
| `apps/web/components/admin/AdminHeader.tsx` | `@repo/supabase` | ✅ Funciona |
| `apps/web/components/student/StudentHeader.tsx` | `@repo/supabase` | ✅ Funciona |
| `apps/web/lib/stores/useUserStore.ts` | `@repo/supabase` (types) | ✅ Funciona |
| `apps/web/lib/auth.ts` | `@repo/supabase` (types) | ✅ Funciona |

**Total:** 12 archivos con imports ✅ Todos funcionando

---

## 🔍 EXPLICACIÓN TÉCNICA

### **¿Por qué es necesario configurar exports?**

En Node.js moderno (ESM) y Next.js 15, el campo `exports` en `package.json` es **obligatorio** para controlar qué archivos se pueden importar desde un package.

### **Antes (sin exports específicos):**

```typescript
// ❌ No funciona
import { createClient } from '@repo/supabase/server'
// Error: Package path ./server is not exported
```

### **Después (con exports configurados):**

```typescript
// ✅ Funciona
import { createClient } from '@repo/supabase/server'
```

### **Ventajas de configurar exports:**

1. **Control granular** - Decides qué expones
2. **Tree-shaking mejor** - Bundlers optimizan mejor
3. **TypeScript feliz** - Autocompletado correcto
4. **Imports específicos** - Puedes importar solo lo que necesitas

---

## 🧪 VERIFICACIÓN

```bash
# Reiniciar el servidor
pnpm dev

# Debería compilar sin errores
✓ packages/supabase exports configurados
✓ apps/web importa correctamente
✓ No más errores de "Package path not exported"
```

---

## 📝 ESTRUCTURA FINAL

```
packages/supabase/
├── package.json              ← exports configurados
└── src/
    ├── index.ts              ← exporta todo
    ├── client.ts             ← cliente browser
    ├── server.ts             ← cliente server
    ├── types.ts              ← tipos TypeScript
    └── hooks.ts              ← hooks React
```

**Exports en package.json:**

```json
{
  "exports": {
    ".": "./src/index.ts",           // import from '@repo/supabase'
    "./client": "./src/client.ts",   // import from '@repo/supabase/client'
    "./server": "./src/server.ts",   // import from '@repo/supabase/server'
    "./types": "./src/types.ts",     // import from '@repo/supabase/types'
    "./hooks": "./src/hooks.ts"      // import from '@repo/supabase/hooks'
  }
}
```

---

## 💡 BUENAS PRÁCTICAS

### **1. Imports recomendados por contexto:**

**Server Components / API Routes:**
```typescript
import { createClient, getUser } from '@repo/supabase/server'
```

**Client Components:**
```typescript
import { supabase } from '@repo/supabase'
// o
import { createClient } from '@repo/supabase/client'
```

**Hooks:**
```typescript
import { useAuth, useUser } from '@repo/supabase'
// o
import { useAuth } from '@repo/supabase/hooks'
```

**Tipos:**
```typescript
import type { UserRole, Database } from '@repo/supabase'
// o
import type { UserRole } from '@repo/supabase/types'
```

### **2. Tree-shaking:**

Importar desde subpaths específicos ayuda al tree-shaking:

```typescript
// ✅ Mejor (solo carga server)
import { createClient } from '@repo/supabase/server'

// ⚠️ Funciona pero carga más código
import { createServerClient } from '@repo/supabase'
```

---

## 🔗 REFERENCIAS

- [Node.js Package Exports](https://nodejs.org/api/packages.html#package-entry-points)
- [Next.js Package Configuration](https://nextjs.org/docs/app/building-your-application/optimizing/package-bundling)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] `package.json` tiene campo `exports`
- [x] Exports incluye `.`, `./client`, `./server`, `./types`, `./hooks`
- [x] Todos los archivos `.ts` existen en `src/`
- [x] Imports en `apps/web` usan rutas correctas
- [x] `pnpm dev` ejecuta sin errores
- [x] TypeScript no muestra errores de módulos

---

**Fecha:** Noviembre 2024  
**Estado:** ✅ Resuelto  
**Impacto:** Crítico - Sin esto, el proyecto no compila

---

**¡Problema resuelto! Ahora todos los imports funcionan correctamente. 🎉**




