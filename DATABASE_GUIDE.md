# 🗄️ CONFIGURACIÓN DE BASE DE DATOS - Vivenza Hogar

## 📌 ESTADO ACTUAL

**Base de Datos:** 100% MySQL 8.4+
**PostgreSQL:** ❌ NO se utiliza
**Fecha de Actualización:** 26 de Mayo 2026

---

## ✅ MIGRACIÓN DE DATOS

### Contexto
Originalmente, Vivenza Hogar utilizaba PostgreSQL como base de datos. Se realizó una **migración completa de datos** a MySQL para:

1. ✅ Reducir complejidad
2. ✅ Evitar confusiones entre sistemas
3. ✅ Optimizar para hosting compartido (que soporta MySQL mejor)
4. ✅ Mejorar compatibilidad con frameworks Laravel

### Proceso Realizado
```
PostgreSQL (Original)
        ↓
  [Exportación de datos]
        ↓
  MySQL 8.4+  ← ACTUAL
```

### Resultados
- ✅ Todos los datos importados correctamente
- ✅ Relaciones y constraints intactos
- ✅ Índices optimizados
- ✅ Zero downtime en migración
- ✅ Ningún dato fue perdido

---

## 🔧 CONFIGURACIÓN MySQL

### Variables de Entorno (.env)

```env
# OBLIGATORIO - MySQL
DB_CONNECTION=mysql
DB_HOST=localhost              # O tu IP de servidor MySQL
DB_PORT=3306                   # Puerto estándar MySQL
DB_DATABASE=vivenza_hogar      # Nombre de base de datos
DB_USERNAME=root               # Usuario MySQL
DB_PASSWORD=tu_password        # Contraseña MySQL
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci
```

### Verificar Conexión

**Laravel Tinker:**
```bash
php artisan tinker

# En el console:
DB::connection()->getDatabaseName()  # Debe retornar: vivenza_hogar
DB::table('users')->count()          # Debe retornar número de usuarios
```

**Desde MySQL Client:**
```bash
mysql -u root -p
mysql> USE vivenza_hogar;
mysql> SHOW TABLES;
mysql> SELECT COUNT(*) FROM users;
```

---

## 📊 SCHEMA DE BASE DE DATOS

### Tablas Principales

```sql
-- Usuarios
users                      -- Registros de usuarios
user_verifications         -- Verificación de identidad
user_favorites            -- Propiedades favoritas

-- Propiedades
properties                 -- Catálogo de propiedades
property_images           -- Imágenes de propiedades
locations                 -- Ubicaciones/Barrios

-- Negocio
subscriptions             -- Suscripciones de agentes
inquiries                 -- Consultas de clientes
messages                  -- Mensajería entre usuarios

-- Sistema
password_reset_tokens     -- Tokens para reset
jobs                      -- Cola de trabajos
cache                     -- Cache de Laravel
```

### Relaciones Principales

```
users (1) ──→ (Many) properties
users (1) ──→ (Many) subscriptions
users (1) ──→ (One)  user_verifications

properties (Many) ──→ (1) locations
properties (Many) ──→ (Many) property_images
properties (Many) ──→ (Many) users (favorites)

subscriptions (Many) ──→ (1) users
inquiries (Many) ──→ (1) users
inquiries (Many) ──→ (1) properties
```

---

## 🔐 CREDENCIALES POR ENTORNO

### Desarrollo Local (Laragon)
```env
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=           # Sin contraseña (por defecto en Laragon)
```

### Staging
```env
DB_HOST=staging-mysql.tuservidor.com
DB_USERNAME=vivenza_staging
DB_PASSWORD=***           # Guardar en .env local
DB_DATABASE=vivenza_staging
```

### Producción (Hostinger/Similar)
```env
DB_HOST=mysql-tuhost.hostinger.com
DB_USERNAME=vivenza_prod_user
DB_PASSWORD=***           # Guardar en .env local (NUNCA en git)
DB_DATABASE=vivenza_hogar_prod
```

---

## 📈 OPTIMIZACIÓN MYSQL

### Índices Creados Automáticamente
```sql
-- Migraciones Laravel
SHOW INDEXES FROM users;
SHOW INDEXES FROM properties;
SHOW INDEXES FROM subscriptions;
```

### Query Optimization
```php
// ✅ BUENO: Use select() para campos específicos
User::select('id', 'name', 'email')
    ->with('verification')
    ->paginate();

// ❌ MALO: Traer todos los campos
User::all();  // Carga datos innecesarios

// ✅ BUENO: Eager loading
Property::with('location', 'images')->get();

// ❌ MALO: Lazy loading (N+1 problem)
Property::all();
foreach ($properties as $property) {
    echo $property->location->name;  // ¡Query por cada propiedad!
}
```

---

## 🛠️ MANTENIMIENTO MYSQL

### Backup Regular
```bash
# Backup manual
mysqldump -u root -p vivenza_hogar > backup_$(date +%Y%m%d).sql

# Restaurar
mysql -u root -p vivenza_hogar < backup_20260526.sql

# Backup automático (cron job)
0 2 * * * mysqldump -u root -p vivenza_hogar | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### Limpieza de Caché
```bash
php artisan cache:clear
php artisan config:cache
php artisan route:cache
```

### Verificar Integridad
```bash
php artisan migrate:status
php artisan db:seed  # Para repoblar datos de test
```

---

## ❌ ¿QUÉ PASÓ CON POSTGRESQL?

**Respuesta clara:** 
- ❌ PostgreSQL ya NO se utiliza
- ❌ Ninguna parte del código soporta PostgreSQL
- ❌ Todas las migraciones son solo para MySQL
- ✅ Los datos fueron importados y están en MySQL
- ✅ El proyecto es 100% MySQL desde v1.0.0

**Si alguien pregunta por PostgreSQL:**
> "Vivenza usa exclusivamente MySQL 8.4+. Migramos todos los datos de PostgreSQL a MySQL para simplificar el stack. El proyecto ya no soporta PostgreSQL."

---

## 🚨 TROUBLESHOOTING

### Error: "SQLSTATE[HY000]: General error: 1030"
```
Solución: Verificar que MySQL esté corriendo
# En Windows:
net start MySQL80  # O tu versión

# En Linux:
sudo systemctl start mysql
```

### Error: "Connection refused"
```
Solución: Verificar credentials en .env
php artisan tinker
DB::connection()->getPdo()
```

### Error: "No database selected"
```
Solución: Asegurar que DB_DATABASE está correcto
# Crear base de datos si no existe:
mysql -u root -p -e "CREATE DATABASE vivenza_hogar CHARACTER SET utf8mb4;"
```

---

## 📞 REFERENCIAS

**MySQL Documentation:** https://dev.mysql.com/doc/
**Laravel Database:** https://laravel.com/docs/11/database
**MySQL Tuning:** https://dev.mysql.com/doc/refman/8.4/en/optimization.html

---

**Última actualización:** 26 de Mayo 2026
**Responsable:** Equipo de Backend
