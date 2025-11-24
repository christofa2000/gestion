# 🔧 Solución: Error EPERM con OneDrive y Next.js

## Problema
Next.js intenta escribir archivos de trace en `.next/trace`, pero OneDrive bloquea el acceso causando el error:
```
Error: EPERM: operation not permitted, open '...\.next\trace'
```

## Solución Rápida

### Opción 1: Script de Limpieza (Recomendado)
Ejecuta uno de estos scripts antes de `pnpm dev`:

**PowerShell:**
```powershell
.\clean-next.ps1
```

**CMD/Batch:**
```cmd
clean-next.bat
```

Luego ejecuta:
```bash
pnpm dev
```

### Opción 2: Excluir `.next` de OneDrive (Permanente)

1. Click derecho en la carpeta `apps/web/.next`
2. Selecciona **OneDrive** → **Liberar espacio** (si está sincronizada)
3. O configura OneDrive para excluir `.next`:
   - Configuración de OneDrive → Sincronización → Avanzado
   - Agregar carpeta a excluir: `apps/web/.next`

### Opción 3: Mover Proyecto Fuera de OneDrive

Si el proyecto está en `OneDrive/Escritorio/`, muévelo a:
- `C:\Proyectos\Gestion\` (recomendado)
- O cualquier carpeta local fuera de OneDrive

## Prevención

El archivo `.gitignore` ya incluye `.next/`, así que no se sincronizará con Git. 
Pero OneDrive puede intentar sincronizarlo si está en su carpeta.

**Recomendación:** Excluir `.next` de OneDrive o mover el proyecto fuera de OneDrive para desarrollo.

## Archivos Creados

- `clean-next.ps1` - Script PowerShell para limpiar
- `clean-next.bat` - Script Batch para limpiar

Ambos scripts:
- Cierran procesos de Node.js que puedan estar bloqueando
- Eliminan `.next` y `out`
- Proporcionan instrucciones si fallan



