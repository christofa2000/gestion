@echo off
echo ========================================
echo Instalando pnpm...
echo ========================================
npm install -g pnpm

echo.
echo ========================================
echo Instalando dependencias del proyecto...
echo ========================================
pnpm install

echo.
echo ========================================
echo Todo listo! Para ejecutar el proyecto:
echo ========================================
echo pnpm dev
echo.
echo O ejecuta: start-dev.bat
pause

