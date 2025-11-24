@echo off
echo ========================================
echo   Limpieza de Next.js - Fix OneDrive
echo ========================================
echo.

REM Cerrar procesos de Node.js que puedan estar bloqueando archivos
echo [1/3] Cerrando procesos de Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Eliminar carpetas de build
echo [2/3] Eliminando carpetas de build...
if exist "apps\web\.next" (
    echo   - Eliminando apps\web\.next...
    rmdir /s /q "apps\web\.next" 2>nul
    if exist "apps\web\.next" (
        echo   ⚠ No se pudo eliminar completamente. Intenta ejecutar como Administrador.
    ) else (
        echo   ✓ apps\web\.next eliminada
    )
) else (
    echo   ✓ apps\web\.next no existe
)

if exist "apps\web\out" (
    echo   - Eliminando apps\web\out...
    rmdir /s /q "apps\web\out" 2>nul
    echo   ✓ apps\web\out eliminada
)

echo.
echo [3/3] Limpieza completada!
echo.
echo ========================================
echo   Si el problema persiste:
echo   1. Excluye '.next' de OneDrive
echo   2. O mueve el proyecto fuera de OneDrive
echo ========================================
echo.
echo Ahora puedes ejecutar: pnpm dev
pause


