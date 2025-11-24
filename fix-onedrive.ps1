# Script para resolver problemas de OneDrive con Next.js
# Ejecutar como: .\fix-onedrive.ps1

Write-Host "Verificando problemas de OneDrive..." -ForegroundColor Cyan
Write-Host ""

$projectPath = $PSScriptRoot
$nextPath = Join-Path $projectPath "apps\web\.next"

# Verificar si el proyecto esta en OneDrive
$onedrivePaths = @(
    "$env:USERPROFILE\OneDrive",
    "$env:USERPROFILE\OneDrive - *",
    "$env:LOCALAPPDATA\OneDrive"
)

$isInOneDrive = $false
foreach ($path in $onedrivePaths) {
    if ($projectPath -like "$path*") {
        $isInOneDrive = $true
        Write-Host "ADVERTENCIA: El proyecto esta dentro de OneDrive: $path" -ForegroundColor Yellow
        break
    }
}

if ($isInOneDrive) {
    Write-Host ""
    Write-Host "SOLUCIONES RECOMENDADAS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Excluir la carpeta .next de OneDrive:" -ForegroundColor White
    Write-Host "   - Click derecho en la carpeta del proyecto > OneDrive > Administrar sincronizacion" -ForegroundColor Gray
    Write-Host "   - O configuracion de OneDrive > Cuenta > Elegir carpetas" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Agregar .next al archivo .gitignore (ya deberia estar)" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Mover el proyecto fuera de OneDrive (recomendado para desarrollo):" -ForegroundColor White
    Write-Host "   - Mover a: C:\Proyectos\Gestion (fuera de OneDrive)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Pausar sincronizacion temporalmente:" -ForegroundColor White
    Write-Host "   - Click derecho en el icono de OneDrive > Pausar sincronizacion" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "OK: El proyecto NO esta en OneDrive" -ForegroundColor Green
    Write-Host ""
    Write-Host "Si aun tienes problemas de permisos:" -ForegroundColor Yellow
    Write-Host "1. Ejecuta PowerShell como Administrador" -ForegroundColor White
    Write-Host "2. Verifica permisos de la carpeta: icacls `"$projectPath`"" -ForegroundColor White
    Write-Host ""
}

# Verificar si hay procesos bloqueando
Write-Host "Verificando procesos de Node.js..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "ADVERTENCIA: Hay procesos de Node.js ejecutandose:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "   - PID: $($_.Id) - Path: $($_.Path)" -ForegroundColor Gray
    }
    Write-Host ""
    $response = Read-Host "Deseas cerrarlos? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        $nodeProcesses | Stop-Process -Force
        Write-Host "OK: Procesos cerrados" -ForegroundColor Green
    }
} else {
    Write-Host "OK: No hay procesos de Node.js ejecutandose" -ForegroundColor Green
}

Write-Host ""
Write-Host "Limpiando carpeta .next..." -ForegroundColor Cyan
if (Test-Path $nextPath) {
    try {
        Remove-Item -Path $nextPath -Recurse -Force -ErrorAction Stop
        Write-Host "OK: Carpeta .next eliminada" -ForegroundColor Green
    } catch {
        Write-Host "ERROR: Error al eliminar: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Intenta ejecutar este script como Administrador" -ForegroundColor Yellow
    }
} else {
    Write-Host "OK: La carpeta .next no existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "Verificacion completada" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar: pnpm dev" -ForegroundColor Cyan
