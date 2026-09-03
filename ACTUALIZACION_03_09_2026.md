# ACTUALIZACIÓN 03/09/2026 - VIVENZA HOGAR

## 📋 Resumen de Cambios

### 🔧 **Fixes Críticos**
- **Dropdown Usuario**: Arreglado - ahora abre/cierra en **click** (no hover), no se cierra al mover mouse, cierra con click fuera/ESC
- **CORS Vite**: Configurado `server.cors.origin` para túneles

### 🔄 **Roles Reestructurados**
| Rol | Permisos |
|-----|---------|
| **Cliente** | Publica propiedades (requiere plan activo), favoritos, suscripciones |
| **Agente** | Verifica KYC, atiende mensajes, propiedades asignadas (Staff) |
| **Admin** | Acceso total: usuarios, propiedades, reportes, configuración |

### 🖼️ **Compresión Imágenes** (WebP 85%)
- `ImageCompressionService`: Convierte a WebP 85%, máx 1920px, thumbnails opcionales
- Aplicado automáticamente en subida de propiedades

### 🛠️ **Herramientas Admin** (Solo Admins)
- **Descargar Verificados**: ZIP por carpetas `{CI}_{Nombre}/` con datos, KYC e imágenes
- **Purgar Archivos**: Elimina físicos (imágenes + KYC), mantiene BD, doble confirmación

### 🎨 **UI/UX Mejoras**
- **UserMenu**: Click para abrir/cerrar (no hover), iconos Heroicons pequeños, responsive, accesible (ESC/Tab/ARIA)
- **Verificaciones**: Barra admin con 📥 Descargar / 🗑️ Purgar (doble confirmación)
- **CSS**: Contraste AA+, responsive mobile-first, sidebar colapsable, animaciones fade-in

### 🔄 **Roles Simplificados**
| Rol | Permisos |
|-----|----------|
| **Cliente** | Publica (con plan), favoritos, suscripciones |
| **Agente** | Verifica KYC, atiende mensajes (Staff) |
| **Admin** | Acceso total |

---

## 📁 Archivos Clave Modificados
- `app/Support/Roles.php` - Roles reestructurados
- `app/Models/User.php` - Permisos actualizados
- `app/Services/ImageCompressionService.php` **(nuevo)**
- `app/Http/Controllers/PropertyController.php` - Compresión auto
- `app/Http/Controllers/AdminController.php` - `downloadVerifiedData()`, `purgeVerifiedFiles()`
- `resources/js/Components/UserMenu.jsx` - **Reescrito completo**
- `resources/js/Pages/Agent/Verifications.jsx` - Barra admin 📥/🗑️
- `resources/css/app.css` - Contraste, responsive, animaciones
- `vite.config.js` - `server.origin` para túneles

---

## 🧪 Tests: ✅ 6/6 passing | Build: ✅ | Deploy: ✅

---

## 🚀 Para tu Compañero
```bash
git pull origin main
composer install && npm install && npm run build
php artisan migrate --force
php artisan db:seed --class=CochabambaTestSeeder
php artisan serve & npm run dev
```

**Credenciales:** `cliente.comprador.cbb@vivenza.test` / `password123` (y otros en seeder)