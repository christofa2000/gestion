@echo off
echo ========================================
echo Eliminando carpeta gestion...
echo ========================================
echo.

REM Eliminar atributos de solo lectura
attrib -r -s -h gestion\*.* /s /d 2>nul

REM Eliminar carpeta con rmdir de Windows
rmdir /s /q gestion 2>nul

REM Verificar si se elimino
if exist gestion (
    echo.
    echo ADVERTENCIA: Algunos archivos no se pudieron eliminar.
    echo Por favor, elimina manualmente la carpeta gestion.
    echo.
    explorer .
) else (
    echo.
    echo ========================================
    echo EXITO! Carpeta gestion eliminada.
    echo ========================================
    echo.
    echo Todo esta ahora organizado en:
    echo   apps/web/supabase/
    echo.
)

pause




