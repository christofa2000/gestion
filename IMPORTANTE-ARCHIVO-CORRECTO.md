# ⚠️ IMPORTANTE: ARCHIVO CORRECTO DEL SCHEMA SQL

## 🎯 USA ESTE ARCHIVO

```
✅ apps/web/supabase/supabase-schema.sql
```

**Este es el archivo correcto con el orden CORRECTO de las tablas.**

---

## ❌ NO USES ESTOS (ARCHIVOS VIEJOS ELIMINADOS)

```
❌ gestion/supabase-schema.sql (ELIMINADO)
❌ gestion/*.md (ELIMINADOS)
```

Estos archivos eran duplicados viejos de una reorganización anterior.

---

## ✅ EL ORDEN ESTÁ CORRECTO

En el archivo correcto (`apps/web/supabase/supabase-schema.sql`):

```sql
-- Línea 149
-- 1.7. FIRST_CONTACT_SOURCES (se crea PRIMERO) ✅
CREATE TABLE first_contact_sources (...);

-- Línea 164  
-- 1.8. STUDENTS (se crea DESPUÉS) ✅
CREATE TABLE students (
    ...
    source_id UUID REFERENCES first_contact_sources(id), -- ✅ Ahora funciona
    ...
);
```

---

## 🚀 CÓMO APLICAR EL SCHEMA

### **1. Cerrar el archivo viejo:**

Si tienes abierto `gestion/supabase-schema.sql`, **CIÉRRALO**.

### **2. Abrir el archivo correcto:**

```
apps/web/supabase/supabase-schema.sql
```

### **3. Copiar TODO el contenido:**

`Ctrl + A` → `Ctrl + C`

### **4. Ir a Supabase Dashboard:**

https://supabase.com/dashboard/project/ecduvjddxyfyelqgmxii/editor

### **5. SQL Editor → New Query**

### **6. Pegar y ejecutar:**

`Ctrl + V` → Click "Run"

---

## ✅ RESULTADO ESPERADO

```
✓ 16 tablas creadas (incluyendo first_contact_sources y students)
✓ Sin errores de "relation does not exist"
✓ Todos los foreign keys funcionando
✓ Índices creados
✓ Triggers activos
✓ RLS policies aplicadas
```

---

## 📁 ESTRUCTURA CORRECTA

```
Gestion/
├── apps/
│   └── web/
│       └── supabase/
│           ├── supabase-schema.sql    ← ✅ ESTE ES EL CORRECTO
│           ├── DATABASE-DIAGRAM.md
│           ├── README-SUPABASE.md
│           ├── SUPABASE-INTEGRATION.md
│           └── SUPABASE-SETUP.md
│
└── gestion/                            ← ❌ CARPETA VIEJA (vacía ahora)
    └── node_modules/                   ← Eliminar manualmente si queda
```

---

## 🗑️ LIMPIAR CARPETA VIEJA (OPCIONAL)

Si la carpeta `gestion/` todavía existe con `node_modules`:

**Windows:**
```cmd
rmdir /s gestion
```

**PowerShell:**
```powershell
Remove-Item -Path gestion -Recurse -Force
```

---

## 📝 RESUMEN

| Archivo | Estado | Usar |
|---------|--------|------|
| `apps/web/supabase/supabase-schema.sql` | ✅ Correcto | ✅ SÍ |
| `gestion/supabase-schema.sql` | ❌ Viejo (eliminado) | ❌ NO |

---

## 🎯 VERIFICACIÓN RÁPIDA

Para confirmar que estás viendo el archivo correcto:

1. **Busca la línea 149:**
   - ✅ Debe decir: `-- 1.7. FIRST_CONTACT_SOURCES`
   - ❌ Si dice: `-- 1.7. STUDENTS` → Archivo incorrecto

2. **Busca la línea 164:**
   - ✅ Debe decir: `-- 1.8. STUDENTS`
   - ❌ Si dice: `-- 1.8. FIRST_CONTACT_SOURCES` → Archivo incorrecto

3. **Verifica la ruta del archivo:**
   - ✅ Debe ser: `apps\web\supabase\supabase-schema.sql`
   - ❌ Si es: `gestion\supabase-schema.sql` → Archivo incorrecto (ya eliminado)

---

**¡Usa el archivo correcto y el schema se aplicará sin errores! 🎉**




