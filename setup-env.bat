@echo off
echo ========================================
echo Configurando variables de entorno
echo ========================================
echo.

cd apps\web

echo Creando archivo .env.local...
(
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=https://ecduvjddxyfyelqgmxii.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZHV2amRkeHlmeWVscWdteGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MzkwNjQsImV4cCI6MjA3OTUxNTA2NH0.rOPL94S197YRGvWPgNwqh9YiGmPpwMdPUZLL-hJLtw0
echo.
echo # Site URL ^(para redirects^)
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
) > .env.local

echo.
echo ✓ Archivo .env.local creado exitosamente
echo.
echo Ubicacion: apps\web\.env.local
echo.
echo ========================================
echo Ahora puedes ejecutar: pnpm dev
echo ========================================
echo.
pause




