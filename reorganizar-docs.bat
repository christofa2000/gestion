@echo off
echo ========================================
echo Reorganizando documentacion...
echo ========================================
echo.

REM Crear carpeta docs
if not exist docs mkdir docs

REM Mover archivos de documentacion de Supabase
echo Moviendo documentacion de Supabase...
move gestion\supabase-schema.sql docs\ 2>nul
move gestion\SUPABASE-SETUP.md docs\ 2>nul
move gestion\SUPABASE-INTEGRATION.md docs\ 2>nul
move gestion\DATABASE-DIAGRAM.md docs\ 2>nul
move gestion\README-SUPABASE.md docs\ 2>nul

echo.
echo ========================================
echo Limpiando proyecto Next.js viejo...
echo ========================================
echo.

cd gestion

REM Eliminar proyecto Next.js viejo
if exist node_modules rmdir /s /q node_modules
if exist src rmdir /s /q src
if exist public rmdir /s /q public
if exist .next rmdir /s /q .next
del package.json 2>nul
del package-lock.json 2>nul
del next.config.ts 2>nul
del tsconfig.json 2>nul
del eslint.config.mjs 2>nul
del next-env.d.ts 2>nul
del postcss.config.mjs 2>nul
del README.md 2>nul

cd ..

echo.
echo ========================================
echo Eliminando carpeta gestion vacia...
echo ========================================
rmdir gestion 2>nul

echo.
echo ========================================
echo LISTO!
echo ========================================
echo.
echo La documentacion ahora esta en: docs/
echo.
echo Archivos movidos:
echo   - docs/supabase-schema.sql
echo   - docs/SUPABASE-SETUP.md
echo   - docs/SUPABASE-INTEGRATION.md
echo   - docs/DATABASE-DIAGRAM.md
echo   - docs/README-SUPABASE.md
echo.
pause




