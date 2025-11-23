# 📦 INSTRUCCIONES DE INSTALACIÓN Y VERIFICACIÓN

## 1️⃣ Instalar Dependencias

### Opción A: Desde la raíz del monorepo (Recomendado)

```bash
cd C:\Users\chris\OneDrive\Escritorio\Gestion
pnpm install
```

### Opción B: Instalar manualmente en apps/web

```bash
cd apps/web
npm install zustand lucide-react clsx tailwind-merge class-variance-authority
```

---

## 2️⃣ Verificar Instalación

### Comprobar que todos los paquetes estén instalados:

```bash
cd apps/web
npm list zustand lucide-react clsx tailwind-merge class-variance-authority
```

Deberías ver algo como:

```
@repo/web@0.1.0
├── zustand@4.5.0
├── lucide-react@0.344.0
├── clsx@2.1.0
├── tailwind-merge@2.2.0
└── class-variance-authority@0.7.0
```

---

## 3️⃣ Ejecutar en Modo Desarrollo

### Desde la raíz del monorepo:

```bash
pnpm dev
```

### O solo la app web:

```bash
cd apps/web
npm run dev
```

Deberías ver:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in Xs
```

---

## 4️⃣ Verificar que Todo Funciona

### Abrir el navegador en: `http://localhost:3000`

### Probar las siguientes rutas:

#### ✅ Rutas Públicas (sin login)
- [ ] `http://localhost:3000/` → Landing
- [ ] `http://localhost:3000/precios` → Precios
- [ ] `http://localhost:3000/contacto` → Contacto
- [ ] `http://localhost:3000/demo` → Demo

#### ✅ Rutas de Auth
- [ ] `http://localhost:3000/auth/login` → Login
- [ ] `http://localhost:3000/auth/register` → Registro
- [ ] `http://localhost:3000/auth/recover` → Recuperar

#### ✅ Login Mock y Acceso a Admin

1. Ir a `http://localhost:3000/auth/login`
2. Ingresar cualquier email/password (ej: `admin@club.com` / `123456`)
3. Click en "Iniciar Sesión"
4. Deberías ser redirigido a `http://localhost:3000/admin`
5. Ver el Dashboard con sidebar y topbar

#### ✅ Probar Navegación Admin
- [ ] `/admin` → Dashboard
- [ ] `/admin/clientes` → Lista de clientes
- [ ] `/admin/clientes/1` → Detalle de cliente
- [ ] `/admin/turnos` → Turnos
- [ ] `/admin/pagos` → Pagos
- [ ] `/admin/egresos` → Egresos
- [ ] `/admin/estadisticas` → Estadísticas
- [ ] `/admin/configuraciones` → Configuraciones
- [ ] `/admin/configuraciones/club` → Datos del club

#### ✅ Cambiar Tema
1. En el Admin, buscar el selector "Tema" en el topbar
2. Probar cambiar entre: Sky, Sport, Neutral
3. Verificar que los colores cambien en toda la app

#### ✅ Probar Rol Student

**Método 1: Consola del navegador**
1. Abrir DevTools (F12)
2. Ir a Console
3. Ejecutar:
   ```javascript
   localStorage.setItem("mock_user_role", "student");
   document.cookie = "mock_user_role=student; path=/; max-age=604800";
   ```
4. Refrescar la página
5. Deberías ser redirigido a `/student`

**Método 2: Logout y re-login**
1. Borrar las cookies manualmente
2. Ir a `/auth/login` nuevamente
3. Modificar el código del login para establecer rol "student"

#### ✅ Probar Navegación Student
- [ ] `/student` → Dashboard
- [ ] `/student/agenda` → Agenda
- [ ] `/student/turnos` → Mis Turnos
- [ ] `/student/pagos` → Mis Pagos
- [ ] `/student/perfil` → Perfil

---

## 5️⃣ Verificar Protección de Rutas

### Test 1: Acceso sin login
1. Borrar todas las cookies (DevTools → Application → Cookies → Clear)
2. Intentar acceder a `http://localhost:3000/admin`
3. **Esperado**: Redirige a `/auth/login`

### Test 2: Student intenta acceder a Admin
1. Login como student (ver paso anterior)
2. Intentar acceder a `http://localhost:3000/admin`
3. **Esperado**: Redirige a `/student`

### Test 3: Admin intenta acceder a Student
1. Login como admin
2. Intentar acceder a `http://localhost:3000/student`
3. **Esperado**: Redirige a `/admin`

---

## 6️⃣ Verificar Theming

### Comprobar que los 3 temas funcionan:

1. **Theme Sky**:
   - Fondo: Azul claro
   - Primario: Azul (#0284c7)
   - Look: SaaS moderno

2. **Theme Sport**:
   - Fondo: Naranja claro
   - Primario: Naranja (#ea580c)
   - Look: Deportivo

3. **Theme Neutral**:
   - Fondo: Gris claro
   - Primario: Gris oscuro (#404040)
   - Look: Corporativo

### Cambiar tema:
- **Admin**: Selector en topbar
- **Student**: Botón "Tema" en header

---

## 7️⃣ Verificar Responsividad

### Desktop (1920x1080)
- [ ] Sidebar visible en Admin
- [ ] 3-4 columnas en grids
- [ ] Bottom nav oculto en Student

### Tablet (768x1024)
- [ ] Sidebar visible pero más estrecho
- [ ] 2 columnas en grids
- [ ] Bottom nav visible en Student

### Mobile (375x667)
- [ ] Sidebar colapsado o oculto
- [ ] 1 columna en grids
- [ ] Bottom nav visible y usable

---

## 8️⃣ Revisar Console para Errores

### Abrir DevTools → Console

**NO deberías ver:**
- ❌ Errores de importación
- ❌ Errores de Hydration
- ❌ Warnings de React

**Es normal ver:**
- ℹ️ Warnings de Next.js sobre páginas sin contenido dinámico
- ℹ️ Logs de desarrollo

---

## 9️⃣ Verificar Build de Producción

```bash
cd apps/web
npm run build
```

**Esperado:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (X/X)
✓ Finalizing page optimization
```

**NO debería haber:**
- ❌ Type errors
- ❌ Build failures
- ❌ Missing dependencies

---

## 🔧 TROUBLESHOOTING

### Problema: "Module not found: Can't resolve 'zustand'"

**Solución:**
```bash
cd apps/web
npm install zustand
```

### Problema: "Cannot find module '@repo/ui'"

**Solución:**
```bash
cd ../../  # Ir a la raíz del monorepo
pnpm install
```

### Problema: Puerto 3000 ocupado

**Solución:**
```bash
# Cambiar puerto
PORT=3001 npm run dev

# O matar proceso en puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: Hydration Errors

**Solución:**
- Ya están añadidos `suppressHydrationWarning` en el layout raíz
- Si persisten, limpiar `.next`:
```bash
rm -rf .next
npm run dev
```

### Problema: Estilos no se aplican

**Solución:**
```bash
# Verificar que Tailwind esté corriendo
# Debería ver recompilación en consola al guardar archivos
# Si no, reiniciar el servidor:
Ctrl+C
npm run dev
```

---

## ✅ CHECKLIST DE VERIFICACIÓN COMPLETA

Marca cada item cuando funcione correctamente:

### Instalación
- [ ] Dependencias instaladas sin errores
- [ ] `pnpm dev` ejecuta sin problemas
- [ ] Puerto 3000 abierto y accesible

### Rutas Públicas
- [ ] Landing (/) funciona
- [ ] Precios funciona
- [ ] Contacto funciona
- [ ] Demo funciona

### Autenticación
- [ ] Login funciona
- [ ] Register funciona
- [ ] Recover funciona
- [ ] Redirección post-login funciona

### Admin
- [ ] Dashboard carga
- [ ] Sidebar visible con todos los items
- [ ] Topbar con selector de tema
- [ ] Todas las páginas cargan sin error
- [ ] Navegación funciona
- [ ] Cambio de tema funciona

### Student
- [ ] Dashboard carga
- [ ] Bottom nav visible
- [ ] Todas las páginas cargan
- [ ] Navegación funciona
- [ ] Cambio de tema funciona

### Protección
- [ ] Sin login → redirige a /auth/login
- [ ] Student no puede acceder a /admin
- [ ] Admin no puede acceder a /student

### UI/UX
- [ ] Colores se aplican correctamente
- [ ] 3 temas funcionan
- [ ] Responsive en mobile/tablet/desktop
- [ ] Sin errores en console
- [ ] Sin warnings de React

### Build
- [ ] Build de producción exitoso
- [ ] Sin errores de TypeScript
- [ ] Sin warnings críticos

---

## 📞 Si Todo Está ✅

**¡Felicitaciones! La estructura frontend está completamente funcional.**

Puedes proceder con el **PROMPT 4** para integrar:
- Supabase Auth
- Base de datos
- Queries reales
- Formularios con validación

---

## 📝 Notas Finales

- **Datos mock**: Todos los datos son estáticos por ahora
- **Auth mock**: Sistema temporal, reemplazar en PROMPT 4
- **Iconos**: SVG inline temporales, reemplazar con lucide-react
- **Gráficos**: Placeholders, agregar Recharts en PROMPT 4

**Estado**: ✅ Producción-ready (estructura y UI)
**Próximo paso**: 🔄 Integración con backend

---

*Última actualización: 23/11/2025*
*Versión: 1.0.0*

