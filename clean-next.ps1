# Script PowerShell para limpiar Next.js y resolver problemas de OneDrive
# Ejecutar como: .\clean-next.ps1

Write-Host "🧹 Limpiando archivos de Next.js..." -ForegroundColor Cyan

# Cambiar al directorio del proyecto web
$webDir = Join-Path $PSScriptRoot "apps\web"
if (-not (Test-Path $webDir)) {
    Write-Host "❌ No se encontró el directorio apps\web" -ForegroundColor Red
    exit 1
}

Set-Location $webDir

# Intentar eliminar .next con diferentes métodos
$nextDir = Join-Path $webDir ".next"
if (Test-Path $nextDir) {
    Write-Host "Eliminando carpeta .next..." -ForegroundColor Yellow
    
    # Método 1: Eliminación normal
    try {
        Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
        Write-Host "✅ Carpeta .next eliminada exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Error al eliminar (método 1): $($_.Exception.Message)" -ForegroundColor Yellow
        
        # Método 2: Cerrar procesos de Node.js que puedan estar bloqueando
        Write-Host "Cerrando procesos de Node.js..." -ForegroundColor Yellow
        Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        # Método 3: Eliminar con cmd /c (a veces funciona mejor)
        try {
            cmd /c "rmdir /s /q `"$nextDir`""
            Write-Host "✅ Carpeta .next eliminada con método alternativo" -ForegroundColor Green
        } catch {
            Write-Host "❌ No se pudo eliminar la carpeta. Intenta:" -ForegroundColor Red
            Write-Host "   1. Cerrar OneDrive temporalmente" -ForegroundColor Yellow
            Write-Host "   2. Ejecutar este script como Administrador" -ForegroundColor Yellow
            Write-Host "   3. Eliminar manualmente: $nextDir" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✅ La carpeta .next no existe" -ForegroundColor Green
}

# Eliminar carpeta out si existe
$outDir = Join-Path $webDir "out"
if (Test-Path $outDir) {
    Remove-Item -Path $outDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Carpeta out eliminada" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Limpieza completada" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Si el problema persiste:" -ForegroundColor Cyan
Write-Host "   - Excluye la carpeta '.next' de la sincronización de OneDrive" -ForegroundColor White
Write-Host "   - O mueve el proyecto fuera de OneDrive" -ForegroundColor White
Write-Host ""
Write-Host "Ahora puedes ejecutar: pnpm dev" -ForegroundColor Cyan

Set-Location $PSScriptRoot



