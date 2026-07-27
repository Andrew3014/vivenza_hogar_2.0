# Revisión de seguridad y estabilidad — 2026-07-27

## Resultado

El flujo de favoritos quedó listo para integración: las rutas requieren sesión, solo se pueden guardar publicaciones aprobadas, cada cuenta tiene su propia colección y la base de datos impide duplicados.

La compilación frontend pasó después de fijar las dependencias compatibles:

- React 18.3.1 + React DOM 18.3.1.
- React Leaflet 4.2.1 (compatible con React 18; React Leaflet 5 exigía React 19).
- Vite 8.0.1; requiere Node 20.19+ o 22.12+ durante el build.
- `react-icons` quedó declarado porque ya era usado por WhatsApp.
- `npm ci` limpio y `npm run build` terminaron correctamente.
- `npm audit --omit=dev` reportó 0 vulnerabilidades de producción. El audit completo todavía muestra vulnerabilidades en herramientas de desarrollo; deben revisarse antes de usar esas herramientas en CI.

No fue posible ejecutar PHPUnit en este equipo porque no hay PHP ni `vendor`; el proyecto debe validarse en un entorno con PHP 8.3, Composer instalado y MySQL/SQLite disponible.

## Controles implementados

- Middleware `auth` y `verified` en las rutas de favoritos.
- Restricción de publicación aprobada en el backend, no solo en React.
- Operaciones de guardar/quitar limitadas al usuario autenticado.
- Restricción única `favorites(user_id, property_id)`.
- Claves foráneas con borrado en cascada.
- Transacción para insertar/eliminar y actualizar `favorites_count`.
- `loadCount('favorites')` en el detalle para mostrar un conteo real aunque una eliminación administrativa haya dejado un contador antiguo.
- Pruebas de feature para invitado, duplicados, eliminación propia y publicación no aprobada.

## Puntos que el equipo debe mantener

1. No aceptar `user_id` desde formularios de favoritos; siempre debe salir de `auth()->user()`.
2. No permitir favoritos para propiedades `pendiente` o `rechazado`.
3. No reemplazar la restricción única con una validación solamente en JavaScript.
4. Usar las rutas Ziggy `favorites.store`, `favorites.destroy` y `favorites.index`; no construir URLs duplicadas.
5. Mantener `npm ci` usando el `package-lock.json`; no actualizar React o Leaflet por separado.
6. En producción ejecutar el build con Node compatible y publicar `public/build`; el servidor solo necesita PHP.
7. Configurar `APP_DEBUG=false`, HTTPS, `APP_KEY`, credenciales fuera de Git y permisos de escritura solo en `storage`/`bootstrap/cache`.
8. Antes de migrar en hosting, hacer backup de MySQL y ejecutar primero en staging.

## Siguientes controles recomendados antes de producción

- Ejecutar PHPUnit y `php artisan migrate:fresh --seed` en CI.
- Añadir rate limiting a login, verificación, consultas y carga de documentos.
- Validar tamaño, MIME, extensión y almacenamiento privado de documentos KYC.
- Configurar backups automáticos y monitoreo de errores.
- Revisar las vulnerabilidades de `npm audit` de desarrollo antes de habilitar un pipeline que use esos paquetes.
- Para mucho tráfico, mover colas, imágenes y mapas a servicios dedicados; hosting compartido sirve para el MVP si cumple PHP 8.3, MySQL 8, Composer/SSH y cron.
