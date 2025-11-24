# 🚀 Cómo Usar el Módulo de Clientes

## ⚡ Inicio Rápido (5 minutos)

### 1️⃣ Asegúrate que el servidor esté corriendo

```bash
pnpm dev
```

### 2️⃣ Accede al sistema

Abre tu navegador en:

```
http://localhost:3000/auth/login
```

Inicia sesión con un usuario que tenga rol **`CLUB_ADMIN`** o **`PROFESSIONAL`**.

### 3️⃣ Ve al módulo de Clientes

En el sidebar del admin, click en **"Clientes"** o ve directamente a:

```
http://localhost:3000/admin/clientes
```

---

## 📋 Funcionalidades Disponibles

### ✅ Ver lista de clientes

- Verás todos los clientes de tu club
- Puedes buscar por nombre, apellido, email o número
- Puedes filtrar por estado (activo, inactivo, pendiente, rechazado)
- Hay paginación automática cada 20 clientes

### ✅ Crear nuevo cliente

1. Click en el botón **"Nuevo Cliente"** (arriba a la derecha)
2. Llena el formulario:
   - **Requerido:** Nombre, Apellido
   - **Requerido:** Al menos Teléfono o Email
   - **Opcional:** Todo lo demás
3. Click en **"Crear Cliente"**
4. Serás redirigido al detalle del cliente recién creado

### ✅ Ver detalle de un cliente

- Click en el ícono de ojo 👁️ en la tabla
- Verás toda la información del cliente
- Secciones: Datos personales, Contacto, Observaciones
- Placeholders para turnos y pagos (próximos módulos)

### ✅ Editar un cliente

- Desde la lista: click en el ícono de lápiz ✏️
- Desde el detalle: click en el botón **"Editar"**
- Modifica los campos que necesites
- Click en **"Actualizar Cliente"**

### ✅ Filtrar y buscar

**Campo de búsqueda:**
- Escribe nombre, apellido, email o número de cliente
- Presiona Enter o cambia el filtro de estado

**Filtro por estado:**
- Selecciona: Todos, Activo, Inactivo, Pendiente, Rechazado
- El filtro se aplica automáticamente

**Limpiar filtros:**
- Click en el botón "Limpiar" (aparece si hay filtros activos)

---

## 🎯 Casos de Uso Comunes

### Caso 1: Registrar un nuevo alumno

```
1. Click "Nuevo Cliente"
2. Completa:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: +54 11 1234-5678
   - Email: juan@example.com
   - Estado: Activo (por defecto)
3. Click "Crear Cliente"
4. ¡Listo! Ya puedes asignarle turnos y pagos.
```

### Caso 2: Buscar un cliente por nombre

```
1. En /admin/clientes
2. Escribe en el campo de búsqueda: "Juan"
3. Presiona Enter
4. Se filtrarán todos los clientes con "Juan" en nombre, apellido o email
```

### Caso 3: Ver clientes inactivos

```
1. En /admin/clientes
2. En el select de estado, elige "Inactivo"
3. Se mostrarán solo los clientes inactivos
```

### Caso 4: Marcar un cliente como rechazado

```
1. Entra al detalle del cliente (click en 👁️)
2. Click en "Editar"
3. Cambia el estado a "Rechazado"
4. Opcional: agrega una observación explicando por qué
5. Click "Actualizar Cliente"
```

---

## 📊 Campos del Formulario

### Datos Personales
- **Nombre** * - Requerido
- **Apellido** * - Requerido
- **Apodo** - Opcional (ej: "Juancho")
- **Número de Cliente** - Autogenerado si se deja vacío
- **Fecha de Nacimiento** - Opcional
- **Género** - Opcional (Masculino, Femenino, Otro, Prefiero no decir)

### Información de Contacto
- **Teléfono** * - Al menos teléfono o email es obligatorio
- **Email** * - Al menos teléfono o email es obligatorio
- **Contacto de Emergencia** - Opcional (nombre)
- **Teléfono de Emergencia** - Opcional

### Documentación
- **Tipo de Documento** - Default: DNI
- **Número de Documento** - Opcional
- **Ocupación** - Opcional
- **Obra Social** - Opcional

### Dirección
- **Dirección** - Opcional (calle y número)
- **Código Postal** - Opcional
- **Ciudad** - Opcional
- **Provincia** - Opcional

### Estado y Observaciones
- **Estado** - Default: Activo (Activo, Inactivo, Pendiente, Rechazado)
- **Observaciones** - Opcional (notas libres sobre el cliente)

---

## 🎨 Badges de Estado

Los estados se muestran con colores:

- 🟢 **Activo** - Verde (el cliente está activo)
- ⚪ **Inactivo** - Gris (temporalmente inactivo)
- 🟡 **Pendiente** - Amarillo (esperando aprobación/documentación)
- 🔴 **Rechazado** - Rojo (cliente rechazado)

---

## 🔒 Seguridad

### ¿Qué puedo ver?

Solo puedes ver y gestionar clientes de **tu propio club**.

Si intentas acceder a un cliente de otro club (por ejemplo, cambiando manualmente el ID en la URL), obtendrás un **error 404**.

### ¿Quién puede acceder?

Roles con acceso al módulo de clientes:
- ✅ `SUPER_ADMIN` (administrador global)
- ✅ `CLUB_ADMIN` (administrador del club)
- ✅ `PROFESSIONAL` (profesores/entrenadores)

Los alumnos (`STUDENT`) **NO** tienen acceso a este módulo.

---

## 💡 Tips

### Tip 1: Usa el apodo
Si tus clientes tienen sobrenombres comunes, usa el campo "Apodo" para encontrarlos más fácilmente.

### Tip 2: Observaciones útiles
Usa el campo de observaciones para:
- Preferencias del cliente
- Historial médico relevante
- Notas sobre pagos
- Cualquier información útil

### Tip 3: Contacto de emergencia
Siempre que sea posible, pide el contacto de emergencia. Es crucial en caso de accidentes.

### Tip 4: Filtros en la URL
Los filtros se guardan en la URL. Puedes:
- **Guardar bookmarks** de búsquedas frecuentes
- **Compartir links** con filtros específicos

Ejemplo:
```
/admin/clientes?search=juan&estado=activo
```

### Tip 5: Número de cliente
Si no especificas un número de cliente, el sistema puede autogenerarlo. Si tu club usa un sistema de numeración específico, ingrésalo manualmente.

---

## 🐛 Problemas Comunes

### No veo ningún cliente

**Posibles causas:**
1. No hay clientes creados aún → Click en "Nuevo Cliente"
2. Los filtros están muy restrictivos → Click en "Limpiar filtros"
3. El usuario no tiene `club_id` configurado → Verificar en Supabase

### El botón "Crear Cliente" no funciona

**Verifica:**
1. Que hayas llenado los campos requeridos (nombre, apellido, teléfono o email)
2. Que el email tenga formato válido
3. Abre la consola del navegador (F12) para ver errores

### No puedo editar un cliente

**Verifica:**
1. Que el cliente pertenezca a tu club
2. Que tengas permisos (rol CLUB_ADMIN o PROFESSIONAL)
3. Que no haya errores de validación en el formulario

---

## 📱 Responsivo

El módulo funciona perfectamente en:
- 💻 **Desktop** - Vista completa con sidebar
- 📱 **Mobile** - Tabla adaptada, sidebar colapsable
- 📱 **Tablet** - Vista optimizada

---

## 🚀 Próximos Pasos

Una vez que tengas clientes creados, podrás:
1. **Asignarles turnos** (módulo de Turnos)
2. **Registrar pagos** (módulo de Pagos)
3. **Ver estadísticas** (módulo de Estadísticas)
4. **Asignar profesionales** (módulo de Profesionales)

---

## 📞 ¿Necesitas Ayuda?

### Documentación completa:
- `MODULO-CLIENTES.md` - Documentación técnica detallada
- `RESUMEN-MODULO-CLIENTES.md` - Resumen ejecutivo

### Troubleshooting:
- `ERRORES-COMUNES.md` - Soluciones a errores frecuentes
- `LISTO-PARA-USAR.md` - Guía general del proyecto

---

## ✅ Checklist de Verificación

Antes de usar el módulo en producción, verifica:

- [ ] El servidor está corriendo (`pnpm dev`)
- [ ] Tienes acceso al sistema con rol CLUB_ADMIN o PROFESSIONAL
- [ ] Puedes acceder a `/admin/clientes`
- [ ] Puedes crear un cliente de prueba
- [ ] El cliente aparece en la lista
- [ ] Puedes editarlo
- [ ] Los filtros funcionan
- [ ] La paginación funciona (si tienes >20 clientes)

---

**¡Todo listo! Ya puedes gestionar tus clientes. 🎉**




