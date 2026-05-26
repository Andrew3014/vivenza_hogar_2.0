# 🏗️ ARQUITECTURA DEL PROYECTO VIVENZA HOGAR

**Tipo:** Full-Stack Web Application
**Framework Backend:** Laravel 11
**Framework Frontend:** React 18 + Inertia.js
**Build Tool:** Vite
**Styling:** Tailwind CSS v4
**Database:** MySQL 8.4+ (100% MySQL)
**Autenticación:** Laravel Sanctum
**API:** Laravel Eloquent ORM

---

## 📐 ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Inertia)                 │
│                         React 18                              │
│                    Components + Pages                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/JSON
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND ROUTING (Inertia)                      │
│         Maneja navegación sin recargar página                │
└────────────────────┬────────────────────────────────────────┘
                     │ API Requests
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           BACKEND (Laravel 11)                               │
│  Controllers → Middleware → Models → Database                │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         DATABASE (MySQL 8.4+)                                │
│  Users, Properties, Locations, Subscriptions, etc.           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE CARPETAS

### Backend (PHP/Laravel)

```
app/
├── Console/           # Artisan Commands
│   └── Commands/
├── Http/
│   ├── Controllers/   # Lógica de negocios
│   │   ├── Auth/      # Autenticación
│   │   ├── PropertyController.php
│   │   ├── PaymentController.php
│   │   └── ProfileController.php
│   ├── Middleware/    # Middlewares personalizados
│   └── Requests/      # Form Requests (validaciones)
├── Models/            # Modelos Eloquent
│   ├── User.php
│   ├── Property.php
│   ├── Subscription.php
│   ├── Location.php
│   ├── PropertyImage.php
│   ├── Favorite.php
│   └── Inquiry.php
└── Providers/         # Service Providers

database/
├── migrations/        # Esquema de BD
├── factories/         # Data factories para testing
└── seeders/          # Datos iniciales

routes/
├── web.php           # Rutas del sitio web (Inertia)
├── auth.php          # Rutas de autenticación
└── console.php       # Comandos artisan

config/               # Configuración de la app
bootstrap/            # Bootstrap de aplicación
```

### Frontend (React)

```
resources/
├── css/
│   └── app.css       # Estilos Tailwind
├── views/            # Blade templates (fallback)
└── js/
    ├── app.jsx       # Entry point React
    ├── bootstrap.js  # Configuración inicial
    ├── Components/   # Componentes reutilizables
    │   └── [componentes compartidos]
    ├── Layouts/      # Layouts principales
    │   └── [layouts de páginas]
    ├── Pages/        # Páginas (cada una es una ruta)
    │   ├── Home.jsx
    │   ├── Properties/
    │   ├── Admin/
    │   └── [más páginas]
    ├── hooks/        # Custom React hooks
    └── utils/        # Funciones utilitarias
```

---

## 🗄️ MODELO DE DATOS

### Tablas Principales

#### Users
```sql
users
├── id (PK)
├── name
├── email (UNIQUE)
├── phone (NULLABLE)
├── password (HASHED)
├── role (enum: admin, agent, buyer)
├── email_verified_at
└── timestamps
```

#### Properties
```sql
properties
├── id (PK)
├── user_id (FK → users)
├── location_id (FK → locations)
├── title
├── description
├── price (decimal)
├── type (enum: venta, alquiler)
├── status (enum: pendiente, aprobado, rechazado)
├── is_featured (boolean)
├── bedrooms (nullable)
├── bathrooms (nullable)
├── area (decimal, nullable)
└── timestamps
    (Índices: user_id, location_id, price, type, status)
```

#### Locations
```sql
locations
├── id (PK)
├── name
├── city
└── timestamps
```

#### PropertyImages
```sql
property_images
├── id (PK)
├── property_id (FK → properties)
├── image_path
└── timestamps
```

#### Subscriptions
```sql
subscriptions
├── id (PK)
├── user_id (FK → users)
├── plan (enum: basic, premium, enterprise)
├── max_properties (integer)
├── status (enum: active, expired, cancelled)
├── start_date
├── end_date
└── timestamps
```

#### Favorites
```sql
favorites
├── id (PK)
├── user_id (FK → users)
├── property_id (FK → properties)
└── timestamps
```

#### Inquiries
```sql
inquiries
├── id (PK)
├── user_id (FK → users)
├── property_id (FK → properties)
├── message (text)
├── status (enum: pending, responded)
└── timestamps
```

---

## 🔐 FLUJO DE AUTENTICACIÓN

```
┌─ Usuario escribe email/password
│  └─► POST /register o /login
│      └─► RegisteredUserController / LoginController
│         └─► Validar datos
│            └─► Hash password
│               └─► Crear sesión (Sanctum)
│                  └─► Retornar usuario + token
└─ Frontend almacena token en axios (bootstrap.js)
   └─► Proximas requests incluyen token automáticamente
      └─► RoleMiddleware valida permisos por rol
         └─► Ejecutar lógica de controlador
             └─► Retornar response a React via Inertia
```

### Roles Implementados:
- **admin** - Control total, moderación
- **agent** - Puede crear/editar propiedades (con suscripción)
- **buyer** - Ver propiedades, hacer favoritos

---

## 🚀 FLUJO DE UNA PETICIÓN

### Ejemplo: Crear una propiedad

1. **Frontend (React)**
   ```javascript
   // Pages/Properties/Create.jsx
   const handleSubmit = (data) => {
       post('/properties', data) // Inertia helper
   }
   ```

2. **Routing (Laravel)**
   ```php
   // routes/web.php
   Route::post('/properties', [PropertyController::class, 'store'])->middleware('auth')
   ```

3. **Middleware**
   ```php
   // Verifica que usuario esté autenticado
   // Aplica RoleMiddleware si está definido
   // Ejecuta HandleInertiaRequests (inyecta datos a React)
   ```

4. **Controller**
   ```php
   // PropertyController.php
   public function store(Request $request) {
       $validated = $request->validate([...]);
       $user = auth()->user();
       
       if (!$user->hasActiveSubscription()) {
           return back()->with('error', '...');
       }
       
       $property = Property::create([
           'user_id' => auth()->id(),
           ...$validated
       ]);
       
       return redirect('/properties');
   }
   ```

5. **Model (Eloquent)**
   ```php
   // Property.php
   class Property extends Model {
       protected $fillable = [...]
       public function user() { return $this->belongsTo(User::class); }
       public function images() { return $this->hasMany(PropertyImage::class); }
   }
   ```

6. **Database**
   - INSERT en tabla properties
   - Laravel retorna el modelo creado

7. **Response**
   - Inertia renderiza la página con los nuevos datos
   - React actualiza el estado sin recargar

---

## 🔄 RELACIONES ELOQUENT

```
User (1) ──── (*) Property
   │           │
   │           └── (*) PropertyImage
   │           └── (*) Inquiry
   │
   ├── (*) Subscription
   │
   └── (*) Favorite ──── (*) Property

Location (1) ──── (*) Property
```

---

## 🛠️ STACK TECNOLÓGICO COMPLETO

### Backend
| Componente | Paquete | Versión | Propósito |
|-----------|---------|---------|-----------|
| Framework | laravel/framework | ^11.0 | Full-stack web framework |
| Auth | laravel/sanctum | ^4.0 | API tokens & session auth |
| Helpers | tightenco/ziggy | ^2.0 | Routing helpers en JS |
| REPL | laravel/tinker | ^3.0 | CLI interactivo |

### Frontend
| Componente | Paquete | Versión | Propósito |
|-----------|---------|---------|-----------|
| Lib. UI | @inertiajs/react | ^2.0 | Server-side rendering |
| Framework | react | ^18.2.0 | UI library |
| DOM | react-dom | ^18.2.0 | ReactDOM |
| Components | @headlessui/react | ^2.0.0 | Unstyled, accessible components |
| HTTP | axios | ^1.11.0 | HTTP requests |

### Build & Styles
| Componente | Paquete | Versión | Propósito |
|-----------|---------|---------|-----------|
| Build | vite | ^8.0.0 | Fast bundler |
| React Plugin | @vitejs/plugin-react | ^5.0.0 | JSX support |
| Laravel Plugin | laravel-vite-plugin | ^3.0.0 | Laravel integration |
| CSS Framework | tailwindcss | ^4.0.0 | Utility-first CSS |
| Tailwind Vite | @tailwindcss/vite | ^4.0.0 | Vite plugin |
| Tailwind Forms | @tailwindcss/forms | ^0.5.3 | Form styles |
| CSS Processing | postcss | ^8.4.31 | CSS transformations |
| Autoprefixer | autoprefixer | ^10.4.12 | Browser prefixes |

### Development
| Componente | Paquete | Versión | Propósito |
|-----------|---------|---------|-----------|
| Task Runner | concurrently | ^9.0.1 | Ejecutar múltiples comandos |
| Linter | laravel/pint | ^1.27 | PHP code style fixer |
| Testing | phpunit/phpunit | ^12.5.12 | Unit testing |
| Mocking | mockery/mockery | ^1.6 | Test mocking |
| Error Handler | nunomaduro/collision | ^8.6 | Better error reporting |
| Faker | fakerphp/faker | ^1.23 | Test data generation |

---

## 🔐 SEGURIDAD IMPLEMENTADA

✅ **CSRF Protection** - Middleware automático en Laravel
✅ **Password Hashing** - Bcrypt (config app.php)
✅ **SQL Injection Prevention** - Prepared statements (Eloquent)
✅ **XSS Protection** - React escapa automáticamente
✅ **Rate Limiting** - Configurable en kernel
✅ **Sanctum Tokens** - API tokens seguros
✅ **Role-based Access Control** - RoleMiddleware
✅ **Mass Assignment Protection** - $fillable/$guarded

---

## 📊 ESTADÍSTICAS DEL PROYECTO

- **Modelos:** 7 (User, Property, Location, PropertyImage, Subscription, Favorite, Inquiry)
- **Controladores:** 4 principales (Auth, Property, Payment, Profile)
- **Migraciones:** 12 archivos
- **Componentes React:** ~15-20
- **Rutas:** ~25 endpoints
- **Líneas de código (Backend):** ~2000
- **Líneas de código (Frontend):** ~3000

---

## 🔄 CI/CD RECOMENDADO

Implementar GitHub Actions para:
1. Run tests automaticamente
2. Linting y formateo
3. Build assets
4. Deploy a servidor

```yaml
# .github/workflows/tests.yml
- Ejecutar phpunit
- Ejecutar eslint
- Build npm
- Deploy si todo pasa
```

---

## 📈 ESCALABILIDAD

El proyecto está diseñado para escalar:

✅ **Database:** Índices optimizados
✅ **Caché:** Redis support
✅ **Queue:** Background jobs
✅ **CDN:** Assets estáticos
✅ **Load Balancing:** Sin dependencias sticky
✅ **API:** RESTful bien estructurada

---

**Diagram ASCII actualizado:** ✅
**Documentación técnica:** ✅
**Pronto para producción:** ✅
