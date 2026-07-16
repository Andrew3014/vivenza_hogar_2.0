# 🏠 VIVENZA HOGAR - Sistema de Gestión de Propiedades

> **Plataforma web moderna para agencias inmobiliarias** - Diseñada para despliegue empresarial con suscripciones, favoritos e inqueries.

[![Laravel 11](https://img.shields.io/badge/Laravel-11-F05340?style=flat-square&logo=laravel)](https://laravel.com)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

---

## 📋 DOCUMENTACIÓN IMPORTANTE

Esta carpeta contiene documentación técnica completa:

| Archivo | Descripción | Para quién |
|---------|-------------|-----------|
| **[QUICK_START.md](QUICK_START.md)** | 🚀 Guía de 5 minutos para empezar | Desarrolladores |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | 📦 Despliegue a producción paso a paso | DevOps/Sysadmins |
| **[DATABASE_GUIDE.md](DATABASE_GUIDE.md)** | 🗄️ Configuración MySQL 100% | DBAs/Backend |
| **[ROADMAP.md](ROADMAP.md)** | 🚀 Próximas mejoras y timeline | Tech Leads/PMs |
| **[REVISION_ARQUITECTURA_2026-07-16.md](REVISION_ARQUITECTURA_2026-07-16.md)** | Revisión de roles, riesgos y estabilidad | Equipo técnico |
| **[DICCIONARIO_INTEGRACION_FRONTEND.md](DICCIONARIO_INTEGRACION_FRONTEND.md)** | Rutas, campos, estados y reglas para React | Frontend/Backend |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | 🏗️ Documentación técnica y diseño | Tech Leads/Arquitectos |
| **[ANALYSIS_COMPATIBILITY.md](ANALYSIS_COMPATIBILITY.md)** | ⚠️ Análisis de compatibilidad v.11.0 | Tech Leads |

**👉 COMIENZA AQUÍ: [QUICK_START.md](QUICK_START.md)**

⚠️ **IMPORTANTE:** Este proyecto usa **100% MySQL 8.4+** (sin PostgreSQL). Ver [DATABASE_GUIDE.md](DATABASE_GUIDE.md)

---

## ✨ CARACTERÍSTICAS

### Gobierno por roles
- `cliente`: comprador, arrendatario o cliente/vendedor; puede publicar con un plan activo.
- `agente`: soporte operativo y revisión manual de verificaciones.
- `admin`: usuarios, publicaciones, planes, reportes, configuración y cuentas internas.

Contrato de rutas y campos para el frontend: [DICCIONARIO_INTEGRACION_FRONTEND.md](DICCIONARIO_INTEGRACION_FRONTEND.md).

### 🏠 Para Agentes Inmobiliarios
- ✅ Crear y gestionar propiedades
- ✅ Subir múltiples imágenes
- ✅ Planes de suscripción con límites
- ✅ Recibir consultas de clientes
- 🔄 Dashboard con estadísticas (próx)

### 🔍 Para Compradores/Arrendatarios  
- ✅ Buscar por ubicación, precio, tipo
- ✅ Filtrar por características
- ✅ Guardar favoritos
- ✅ Enviar consultas a agentes
- 🔔 Notificaciones (próx)

### 👨‍💼 Para Administradores
- 🔄 Panel de control (en desarrollo)
- 🔄 Aprobación de propiedades (próx)
- 🔄 Gestión de suscripciones (próx)
- 🔄 Reportes y análisis (próx)

---

## 🚀 INICIO RÁPIDO

### Requisitos
- PHP 8.3+
- Node.js 18+ LTS
- npm 9+
- MySQL 8.4+ (base de datos obligatoria)

### Antes de entrar a la interfaz
1. Verifica que `php`, `composer`, `node`, `npm` y `mysql` respondan en la terminal.
2. Crea o revisa el archivo `.env` y confirma que `DB_CONNECTION=mysql` apunte a tu base local.
3. Ejecuta `composer install` y `npm install` para restaurar dependencias.
4. Genera la clave de Laravel con `php artisan key:generate`.
5. Crea la base de datos y corre `php artisan migrate`.
6. Si quieres datos de prueba, ejecuta `php artisan db:seed`.
7. Levanta el frontend y backend con `php artisan dev` o con `php artisan serve` + `npm run dev`.

### Instalación (30 segundos)

**Windows (PowerShell Admin):**
```powershell
cd c:\laragon\www\vivenza_hogar
.\instalacion.ps1
```

**Mac/Linux:**
```bash
cd /ruta/del/proyecto
bash instalacion.sh
```

**Manual:**
```bash
composer install && npm install && npm run build && php artisan migrate
```

### Ejecutar
```bash
php artisan dev    # Inicia todo automáticamente
```

Accede a `http://localhost:8000`

---

## 🏗️ TECH STACK

**Backend:** Laravel 11 (PHP 8.3) + Sanctum
**Frontend:** React 18 + Inertia.js
**Build:** Vite 8
**Styling:** Tailwind CSS v4
**Database:** MySQL 8.4+ (100% MySQL, sin PostgreSQL)
**ORM:** Eloquent

---

## 📊 STATUS ACTUAL

| Componente | Status | Prioridad |
|-----------|--------|-----------|
| Autenticación | ✅ Listo | P0 |
| CRUD Propiedades | ✅ Listo | P0 |
| Suscripciones | ✅ Básico | P0 |
| Búsqueda | ✅ Básica | P1 |
| Admin Panel | ⏳ Desarrollo | P1 |
| Notificaciones | ⏳ Planificado | P2 |
| App Móvil | ⏳ Planificado | P3 |

### Brechas detectadas frente al contexto boliviano
- El esquema actual de `properties` todavía solo contempla `venta` y `alquiler`.
- Falta extender la base para `anticretico` y `alquiler_diario` con campos específicos como DDRR, duración contractual, estadía mínima y garantía.
- KYC ya existe de forma parcial con `user_verifications`, pero aún no cubre todo el flujo legal/comercial que describes en la interfaz.

**Estimación para producción:** Listo para despliegue

---

## ⚠️ CAMBIOS REALIZADOS (3 Abril 2026)

✅ **Resuelto:** Incompatibilidad Tailwind CSS (`@tailwindcss/vite@4` ↔️ `tailwindcss@3`)
✅ **Limpieza:** Eliminadas carpetas de backup innecesarias
✅ **Documentación:** Creados 4 documentos técnicos completos

---

## 🔧 COMANDOS ÚTILES

```bash
# Desarrollo
php artisan serve              # Servidor Laravel
npm run dev                   # Vite dev server
php artisan dev               # Ambos juntos ⭐

# Base de datos
php artisan migrate           # Ejecutar migraciones
php artisan tinker            # Console PHP interactivo

# Producción
npm run build                 # Compilar assets
./vendor/bin/pint             # Formatear código
php artisan test              # Ejecutar tests

# Más comandos en QUICK_START.md
```

---

## 🔒 Seguridad

✅ CSRF Protection
✅ Password Hashing (Bcrypt)
✅ SQL Injection Prevention
✅ XSS Protection
✅ API Tokens (Sanctum)
✅ Role-based Access Control

---

## 📁 Estructura

```
vivenza_hogar/
├── app/              # Lógica PHP (Modelos, Controllers)
├── config/           # Configuración
├── database/         # Migraciones, Seeders
├── resources/js/     # Componentes React
├── routes/           # Definición de rutas
├── storage/          # Archivos, Logs
└── tests/            # Tests automatizados
```

---

## 📚 Documentación

- **[QUICK_START.md](QUICK_START.md)** — Para empezar a desarrollar
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** — Para desplegar a producción
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Diseño técnico detallado
- **[ANALYSIS_COMPATIBILITY.md](ANALYSIS_COMPATIBILITY.md)** — Análisis de compatibilidad

---

## 🤝 Contribuir

1. Crea rama: `git checkout -b feature/mi-feature`
2. Haz cambios
3. Formatea: `./vendor/bin/pint`
4. Tests: `php artisan test`
5. Commit y push

---

## 📞 Soporte

- **Documentación:** VER ARCHIVOS DE ESTE DIRECTORIO
- **Laravel:** https://laravel.com/docs
- **React:** https://react.dev
- **Inertia:** https://inertiajs.com/

---

## 📝 Licencia

Proyecto privado para VIVENZA HOGAR. Derechos reservados 2026.

---

**Última actualización:** 3 de Abril 2026 ✅

👉 **[COMIENZA EN QUICK_START.md](QUICK_START.md)**

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
