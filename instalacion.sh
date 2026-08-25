#!/bin/bash

# VIVENZA HOGAR - Automated Installation Script
# Para Windows usar: instalacion.ps1 en su lugar

set -e

echo "🚀 VIVENZA HOGAR - Instalación Automatizada"
echo "==========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar requisitos
echo -e "\n${YELLOW}Verificando requisitos...${NC}"

if ! command -v php &> /dev/null; then
    print_error "PHP no está instalado"
    exit 1
fi
PHP_VERSION=$(php -v | head -1)
print_status "PHP: $PHP_VERSION"

if ! command -v composer &> /dev/null; then
    print_error "Composer no está instalado"
    exit 1
fi
print_status "Composer instalado"

if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
NODE_VERSION=$(node -v)
print_status "Node.js: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
NPM_VERSION=$(npm -v)
print_status "npm: $NPM_VERSION"

# Instalación
echo -e "\n${YELLOW}Iniciando instalación...${NC}\n"

# 1. Instalar dependencias PHP
echo "1️⃣  Instalando dependencias PHP..."
composer install --optimize-autoloader --no-dev
print_status "Dependencias PHP instaladas"

# 2. Copiar .env si no existe
echo -e "\n2️⃣  Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_status ".env creado desde .env.example"
else
    print_warning ".env ya existe, omitiendo copia"
fi

# 3. Generar key
echo "Generando APP_KEY..."
php artisan key:generate
print_status "APP_KEY generado"

# 4. Instalar dependencias Node
echo -e "\n3️⃣  Instalando dependencias Node.js..."
npm install
print_status "Dependencias npm instaladas"

# 5. Compilar assets
echo -e "\n4️⃣  Compilando assets..."
npm run build
print_status "Assets compilados exitosamente"

# 6. Ask about database setup
echo -e "\n5️⃣  Base de Datos"
read -p "¿Deseas ejecutar las migraciones? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    php artisan migrate
    print_status "Migraciones ejecutadas"
    
    read -p "¿Deseas ejecutar los seeders? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        php artisan db:seed
        print_status "Base de datos poblada con datos iniciales"
    fi
else
    print_warning "Recuerda ejecutar 'php artisan migrate' después"
fi

# 7. Cache
echo -e "\n6️⃣  Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
print_status "Caché configurado"

# 8. Storage link
echo -e "\n7️⃣  Configurando almacenamiento..."
php artisan storage:link 2>/dev/null || true
print_status "Storage link creado"

# Done
echo -e "\n${GREEN}✅ ¡Instalación completada exitosamente!${NC}"
echo -e "\n${YELLOW}Próximos pasos:${NC}"
echo "1. Edita .env con tus datos reales (BD, SMTP, etc.)"
echo "2. Ejecuta 'php artisan serve' para desarrollo local"
echo "3. O configura un web server (Nginx/Apache)"
echo ""
echo "Para más información, ver DEPLOYMENT_GUIDE.md"
