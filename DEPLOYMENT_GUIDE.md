# 🚀 GUÍA DE DESPLIEGUE A PRODUCCIÓN - VIVENZA HOGAR

**Estado:** Listo para despliegue empresarial tras seguir estos pasos
**Actualizado:** 3 de Abril 2026

---

## ✅ CAMBIOS REALIZADOS

1. ✅ Resolved Tailwind CSS incompatibility (`^3.2.1` → `^4.0.0`)
2. ✅ Eliminadas carpetas de backup innecesarias:
   - `resources/js/Components copy/`
   - `resources/js/Layouts copy/`
   - `resources/js/Pages copy/`
   - `resources/js/utils copy/`

---

## 📋 REQUISITOS DEL SERVIDOR

### Software Requerido:
- **PHP:** 8.3 o superior
- **Node.js:** 18+ o 20+ (LTS recomendado)
- **npm:** 9+ o **pnpm** como alternativa
- **Composer:** 2.6+
- **MySQL/PostgreSQL:** 8+
- **Git:** último flujo

### Comandos para Verificar:
```bash
php -v          # Debe ser 8.3+
node -v         # Debe ser 18.0.0+
npm -v          # Debe ser 9.0.0+
composer -v     # Debe ser 2.6+
```

---

## 🔧 PASOS DE INSTALACIÓN EN SERVIDOR

### Paso 1: Clonar el Repositorio
```bash
cd /var/www/html  # O tu directorio de apps
git clone <tu-repo-privado> vivenza_hogar
cd vivenza_hogar
```

### Paso 2: Instalar Dependencias PHP
```bash
composer install --optimize-autoloader --no-dev
```

### Paso 3: Configurar Variables de Entorno
```bash
cp .env.example .env
php artisan key:generate
```

**Editar `.env` con datos reales:**
```env
APP_NAME=VivenzaHogar
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=vivenza_hogar_prod
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_password_seguro

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_email
MAIL_PASSWORD=tu_password

SESSION_DRIVER=database
CACHE_DRIVER=redis  # Redis recomendado en producción
QUEUE_CONNECTION=database

LOG_CHANNEL=stack
LOG_LEVEL=warning
```

### Paso 4: Instalar Dependencias Node.js
```bash
npm install
```

### Paso 5: Compilar Assets
```bash
npm run build
```

**Verificar que no haya errores:**
```
✓ built in XXXms
```

### Paso 6: Ejecutar Migraciones de Base de Datos
```bash
php artisan migrate --force
```

**Optional - Si necesitas seeding de datos iniciales:**
```bash
php artisan db:seed
```

### Paso 7: Cachear Configuración
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Paso 8: Configurar Permisos de Carpetas
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache public
```

### Paso 9: Configurar Web Server

#### Para Nginx:
```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    root /var/www/html/vivenza_hogar/public;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastname;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Para Apache (con mod_rewrite):
```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /var/www/html/vivenza_hogar/public

    <Directory /var/www/html/vivenza_hogar>
        AllowOverride All
        Require all granted
        
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteRule ^ index.php [L]
        </IfModule>
    </Directory>

    <Directory /var/www/html/vivenza_hogar/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/vivenza_hogar_error.log
    CustomLog ${APACHE_LOG_DIR}/vivenza_hogar_access.log combined
</VirtualHost>
```

### Paso 10: Configurar SSL (Recomendado)
```bash
# Con Certbot (Let's Encrypt)
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com
sudo certbot renew --dry-run
```

### Paso 11: Configurar Queue Worker (Opcional pero Recomendado)
```bash
# Si usas base de datos para queue:
php artisan queue:listen
```

**Con Supervisor (para background permanente):**
```ini
[program:vivenza-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/vivenza_hogar/artisan queue:work --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/html/vivenza_hogar/storage/logs/queue.log
```

### Paso 12: Configurar Task Scheduler
```bash
# Crontab entry:
* * * * * cd /var/www/html/vivenza_hogar && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔒 CONFIGURACIÓN DE SEGURIDAD

### 1. Firewall & Puertos
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. Rate Limiting (.env)
```env
RATE_LIMIT_ENABLED=true
SESSION_SECURE_COOKIES=true
SESSION_HTTP_ONLY=true
```

### 3. Headers de Seguridad (middleware)
Ya están configurados en `bootstrap/app.php`

### 4. Backup Automático
```bash
# Script backup diario
0 2 * * * mysqldump -u user -p password vivenza_hogar_prod | gzip > /backups/vivenza_hogar_$(date +\%Y\%m\%d).sql.gz
```

---

## 📊 MONITOREO EN PRODUCCIÓN

### Logs
```bash
# Monitorear errores en tiempo real:
tail -f storage/logs/laravel.log

# Verificar errores del servidor:
tail -f /var/log/nginx/error.log  # Nginx
# o
tail -f /var/log/apache2/error.log  # Apache
```

### Health Check
```bash
# Acceder a:
https://tu-dominio.com/up

# Debe retornar 200 OK
```

### Base de Datos
```bash
# Verificar migraciones:
php artisan migrate:status

# Verificar salud de BD:
php artisan tinker
>>> DB::connection()->getPdo();
# Debe ejecutar sin error
```

---

## 🚨 TROUBLESHOOTING COMÚN

### Error: "Class not found"
```bash
composer dump-autoload -o
php artisan cache:clear
```

### Error: "Tailwind styles not loading"
```bash
npm run build
php artisan cache:clear
```

### Error de permisos en storage
```bash
chmod -R 777 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

### Base de datos no conecta
```bash
# Verificar conexión
php artisan tinker
>>> DB::connection()->getPdo();
```

### Assets 404 en producción
```bash
php artisan storage:link  # Si usas storage para assets
php artisan view:clear
npm run build
```

---

## ✅ CHECKLIST FINAL PRE-LANZAMIENTO

- [ ] PHP 8.3+ instalado en servidor
- [ ] Node.js 18+ instalado en servidor
- [ ] .env configurado correctamente
- [ ] Base de datos creada y accesible
- [ ] `composer install` exitoso
- [ ] `npm install` exitoso
- [ ] `php artisan key:generate` ejecutado
- [ ] `npm run build` sin errores
- [ ] `php artisan migrate --force` exitoso
- [ ] Permisos de carpetas correctos
- [ ] Web server (Nginx/Apache) configurado
- [ ] SSL instalado y funcionando
- [ ] Queue worker corriendo (si aplica)
- [ ] Task scheduler configurado
- [ ] Backups configurados
- [ ] Logs funcionando
- [ ] Health check accesible (/up)
- [ ] Test de login funcionando
- [ ] Test de creación de propiedades
- [ ] Test de suscripciones
- [ ] Monitoreo activado
- [ ] Alertas de errores configuradas
- [ ] Base de datos versionada en Git

---

## 📞 SOPORTE RECOMENDADO

### Proveedores de Hosting Recomendados:
1. **DigitalOcean** - Droplets con Laravel pre-instalado
2. **Linode** - Servidores escalables
3. **Hostinger** - Buena relación precio/rendimiento
4. **AWS** - Para aplicaciones empresariales

### Dominios & Email:
- **Namecheap** - Dominios económicos
- **Google Domains** - Confiable y simple
- **SendGrid** - Email transaccional
- **Mailgun** - Alternativa a SendGrid

---

## 📈 OPTIMIZACIONES ADICIONALES

### 1. Redis para caché
```bash
sudo apt-get install redis-server
# En .env:
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

### 2. CDN para Assets
Considerar Cloudflare o CloudFront para servir assets estáticos

### 3. Compresión Gzip
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json application/javascript;
```

### 4. Versionado de Assets
Ya está configurado en Vite, assets tendrán hash único

---

**¡Listo para desplegar a producción! 🎉**

Para preguntas o problemas, consulta la documentación oficial:
- Laravel: https://laravel.com/docs
- Inertia: https://inertiajs.com/
- React: https://react.dev
- Tailwind: https://tailwindcss.com
