# VIVENZA HOGAR - Automated Installation Script for Windows
# Ejecutar en PowerShell como admin

Write-Host "🚀 VIVENZA HOGAR - Instalación Automatizada (Windows)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Función para imprimir con color
function Write-Status {
    Write-Host "✓ $args" -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host "✗ $args" -ForegroundColor Red
}

function Write-Warning-Custom {
    Write-Host "⚠ $args" -ForegroundColor Yellow
}

# Verificar si ejecuta como admin
if (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] 'Administrator')) {
    Write-Error-Custom "Este script debe ejecutarse como administrador"
    exit 1
}

# Verificar requisitos
Write-Host "`nVerificando requisitos..." -ForegroundColor Yellow

if (-Not (Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "PHP no está instalado o no está en PATH"
    exit 1
}
$phpVersion = php -v | Select-Object -First 1
Write-Status "PHP: $phpVersion"

if (-Not (Get-Command composer -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "Composer no está instalado o no está en PATH"
    exit 1
}
Write-Status "Composer instalado"

if (-Not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "Node.js no está instalado o no está en PATH"
    exit 1
}
$nodeVersion = node -v
Write-Status "Node.js: $nodeVersion"

if (-Not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error-Custom "npm no está instalado o no está en PATH"
    exit 1
}
$npmVersion = npm -v
Write-Status "npm: $npmVersion"

# Instalación
Write-Host "`nIniciando instalación...`n" -ForegroundColor Yellow

# 1. Instalar dependencias PHP
Write-Host "1️⃣  Instalando dependencias PHP..." -ForegroundColor White
composer install --optimize-autoloader --no-dev
Write-Status "Dependencias PHP instaladas"

# 2. Copiar .env
Write-Host "`n2️⃣  Configurando variables de entorno..." -ForegroundColor White
if (-Not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Status ".env creado desde .env.example"
} else {
    Write-Warning-Custom ".env ya existe, omitiendo copia"
}

# 3. Generar key
Write-Host "Generando APP_KEY..." -ForegroundColor White
php artisan key:generate
Write-Status "APP_KEY generado"

# 4. Instalar dependencias Node
Write-Host "`n3️⃣  Instalando dependencias Node.js..." -ForegroundColor White
npm install
Write-Status "Dependencias npm instaladas"

# 5. Compilar assets
Write-Host "`n4️⃣  Compilando assets..." -ForegroundColor White
npm run build
Write-Status "Assets compilados exitosamente"

# 6. Database setup
Write-Host "`n5️⃣  Base de Datos" -ForegroundColor White
$response = Read-Host "¿Deseas ejecutar las migraciones? (s/n)"
if ($response -eq 's' -or $response -eq 'S') {
    php artisan migrate
    Write-Status "Migraciones ejecutadas"
    
    $response2 = Read-Host "¿Deseas ejecutar los seeders? (s/n)"
    if ($response2 -eq 's' -or $response2 -eq 'S') {
        php artisan db:seed
        Write-Status "Base de datos poblada con datos iniciales"
    }
} else {
    Write-Warning-Custom "Recuerda ejecutar 'php artisan migrate' después"
}

# 7. Cache
Write-Host "`n6️⃣  Optimizando aplicación..." -ForegroundColor White
php artisan config:cache
php artisan route:cache
php artisan view:cache
Write-Status "Caché configurado"

# 8. Storage link
Write-Host "`n7️⃣  Configurando almacenamiento..." -ForegroundColor White
php artisan storage:link 2>$null
Write-Status "Storage link creado"

# Done
Write-Host "`n✅ ¡Instalación completada exitosamente!`n" -ForegroundColor Green
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Edita .env con tus datos reales (BD, SMTP, etc.)"
Write-Host "2. Ejecuta 'php artisan serve' para desarrollo local"
Write-Host "3. O configura un web server (IIS/Nginx/Apache)"
Write-Host ""
Write-Host "Para más información, ver DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
