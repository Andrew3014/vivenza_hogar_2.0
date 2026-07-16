# Compatibilidad de hosting y checklist de despliegue

## Compatibilidad técnica

| Componente | Proyecto | Requisito práctico para producción |
|---|---|---|
| PHP | Composer fija `^8.3` | PHP 8.3.x con `openssl`, `pdo_mysql`, `mbstring`, `tokenizer`, `xml`, `ctype`, `curl`, `fileinfo`, `gd` o ImageMagick y `zip`. |
| Laravel | 11.x | Compatible con PHP 8.3. Laravel 11 requiere PHP 8.2 o superior. |
| Base de datos | MySQL | El código usa funciones compatibles con MySQL 8.0+. Si el proveedor ofrece 8.4, también es compatible. Confirmar la versión exacta y no asumir que “MySQL 8” significa 8.4. |
| Node/Vite | Node 18+ durante build | No hace falta Node en runtime si se ejecuta `npm run build` antes de subir y se publica `public/build`. |
| Leaflet/OpenStreetMap | Frontend | Funciona en navegador; revisar límites de tiles públicos antes de producción. |
| Composer | Dependencias PHP | Ejecutar `composer install --no-dev --optimize-autoloader` en servidor o generar `vendor` en un entorno compatible. |

## BanaHosting o cPanel similar

El proyecto puede funcionar en hosting compartido si el plan permite:

1. Seleccionar PHP 8.3.
2. Crear una base MySQL y un usuario con permisos completos sobre esa base.
3. Usar SSH o Composer, o permitir subir la carpeta `vendor` generada con la misma versión de PHP.
4. Configurar el dominio para que apunte a la carpeta `public` de Laravel.
5. Ejecutar comandos Artisan y crear un cron.
6. Dar escritura a `storage` y `bootstrap/cache`.
7. Habilitar HTTPS, `pdo_mysql`, `fileinfo`, `mbstring`, `openssl`, `zip` y soporte de subida de archivos.

BanaHosting publica cPanel, SSH, Multi-PHP, MySQL 8 y cron en sus planes; aun así, antes de comprar hay que preguntar al soporte por PHP 8.3, la versión menor de MySQL, Composer/SSH y límites de procesos. Un VPS es preferible cuando se necesiten workers permanentes, Redis, WebSockets, procesamiento de imágenes o más tráfico.

## Despliegue recomendado

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

En producción:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com
DB_CONNECTION=mysql
FILESYSTEM_DISK=public
```

El `.env` real nunca debe subirse al repositorio. Deben configurarse manualmente `APP_KEY`, credenciales MySQL, correo, almacenamiento y claves de pagos.

## Cron y colas

El comando de expiración de suscripciones necesita un cron diario:

```cron
* * * * * cd /home/USUARIO/app && php artisan schedule:run >> /dev/null 2>&1
```

Si se habilitan notificaciones, pagos o procesamiento de imágenes en cola, el hosting debe soportar `queue:work` persistente. Si no lo soporta, usar un VPS o un proveedor externo de colas.

## Verificación previa a publicar

- `php -v` devuelve 8.3.x.
- `php -m` incluye todas las extensiones requeridas.
- `composer check-platform-reqs` no reporta errores.
- `php artisan migrate:status` funciona contra la base remota.
- `php artisan about` muestra entorno production y conexión MySQL.
- `npm run build` termina sin errores en local o CI.
- El dominio sirve `public/index.php`, no la raíz del repositorio.
- `.env`, `storage`, documentos KYC y logs no son accesibles públicamente.
- Se hizo una copia de seguridad antes de ejecutar migraciones.
