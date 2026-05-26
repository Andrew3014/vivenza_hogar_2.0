# 💻 GUÍA RÁPIDA - DESARROLLO LOCAL

**Para**: Desarrolladores que quieren trabajar en el proyecto localmente

---

## ⚠️ IMPORTANTE - BASE DE DATOS

**Este proyecto es 100% MySQL 8.4+**

- ✅ Base de datos: MySQL (obligatoria)
- ❌ PostgreSQL: NO se utiliza
- ✅ Todos los datos ya han sido migrados a MySQL
- ✅ Migraciones Laravel diseñadas solo para MySQL

**Asegúrate que tu servidor MySQL esté corriendo antes de continuar.**

---

## ⚡ INSTALACIÓN RÁPIDA (5 minutos)

### Windows (PowerShell - Como Admin)
```powershell
cd c:\laragon\www\vivenza_hogar

# Ejecutar script automático
.\instalacion.ps1

# O manual:
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
php artisan migrate
```

### Mac/Linux (Terminal)
```bash
cd /ruta/del/proyecto

# Ejecutar script automático
bash instalacion.sh

# O manual:
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
php artisan migrate
```

---

## 🚀 EJECUTAR EL PROYECTO

### Opción 1: Servidor de Desarrollo Concurrente (RECOMENDADO)
```bash
php artisan dev

# Ejecuta en paralelo:
# - Laravel server (http://localhost:8000)
# - Vite dev server (http://localhost:5173)
# - Queue listener
# - Pail logs viewer
```

### Opción 2: Servidores Separados (Debugging)
**Terminal 1 - Laravel:**
```bash
php artisan serve
# http://localhost:8000
```

**Terminal 2 - Vite:**
```bash
npm run dev
# http://localhost:5173
```

**Terminal 3 - Queue (si necesitas):**
```bash
php artisan queue:listen
```

---

## 🛠️ DESARROLLO DIARIO

### Crear un Componente React
```bash
# Crear archivo
touch resources/js/Components/MyComponent.jsx

# Contenido básico:
```jsx
export default function MyComponent({ prop1, prop2 }) {
    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-bold">{prop1}</h2>
            <p>{prop2}</p>
        </div>
    );
}
```

### Crear una Página
```bash
touch resources/js/Pages/MyPage.jsx
```

```jsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout'; // Usar layout existente

export default function MyPage({ myData }) {
    return (
        <AppLayout title="Mi Página">
            <Head title="Mi Página" />
            
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold">{myData.title}</h1>
                {/* Tu contenido aquí */}
            </div>
        </AppLayout>
    );
}
```

### Crear un Controlador
```bash
php artisan make:controller MyController
```

```php
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class MyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('MyPage', [
            'myData' => [
                'title' => 'Hola Mundo'
            ]
        ]);
    }
}
```

### Agregar una Ruta
```php
// routes/web.php
Route::get('/my-route', [\App\Http\Controllers\MyController::class, 'index']);
```

### Crear un Modelo
```bash
php artisan make:model MyModel -m  # -m para crear migración también
```

---

## 🔧 COMANDOS ÚTILES

### Desarrollo
```bash
php artisan serve                   # Iniciar servidor Laravel
npm run dev                        # Iniciar Vite dev server
npm run build                      # Build para producción
php artisan dev                    # Ambos servidores simultáneamente
```

### Base de Datos
```bash
php artisan migrate                # Ejecutar migraciones
php artisan migrate:fresh          # Reset BD (CUIDADO!)
php artisan migrate:rollback       # Deshacer última migración
php artisan db:seed                # Ejecutar seeders
php artisan make:migration create_my_table  # Nueva migración
```

### Modelos & Controladores
```bash
php artisan make:model MyModel     # Crear modelo
php artisan make:controller MyController  # Crear controlador
php artisan make:request MyRequest # Crear form request
php artisan make:middleware MyMiddleware  # Crear middleware
```

### Caché & Config
```bash
php artisan cache:clear            # Limpiar todas las cachés
php artisan config:clear           # Limpiar config cache
php artisan view:clear             # Limpiar view cache
php artisan optimize:clear         # Limpiar todo
```

### Testing
```bash
php artisan test                   # Ejecutar todos los tests
php artisan test tests/Feature     # Ejecutar tests de Feature
php artisan test --filter=TestName # Ejecutar un test específico
```

### IDE & Code Style
```bash
./vendor/bin/pint                  # Formatear PHP automáticamente
npm run lint                       # Linting (si está configurado)
```

### Tinker (REPL Interactivo)
```bash
php artisan tinker

# Dentro de tinker:
>>> User::all()
>>> User::find(1)
>>> Property::where('status', 'aprobado')->count()
>>> DB::table('users')->truncate()
```

---

## 🔍 DEBUGGING

### Ver Logs en Tiempo Real
```bash
# Terminal separada
tail -f storage/logs/laravel.log  # Mac/Linux
Get-Content -Tail 50 -Wait storage/logs/laravel.log  # Windows

# O usar Pail (recomendado):
php artisan pail
```

### Debugging en Código PHP
```php
// Usar dd() = dump and die
dd($myVar);

// O usar dump() = solo dump
dump($myVar);
var_dump($myVar);

// En Laravel helper:
\Log::info('Mi mensaje', ['data' => $data]);
```

### Debugging en React
```javascript
// Consola del navegador (F12)
console.log('Mi variable:', myVar);
console.error('Error:', error);
console.table(arrayData);

// React DevTools browser extension (recomendado)
// Buscar en Chrome Store: React Developer Tools
```

### Network Inspector
1. Abre navegador (F12)
2. Pestaña "Network"
3. Realiza acciones en la app
4. Observa XHR requests y responses

---

## 🎨 TAILWIND CSS QUICK TIPS

### Clases Útiles Más Comunes
```jsx
// Padding & Margin
<div className="p-4 m-2 pt-8 mb-4">

// Display & Layout
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">

// Texto
<h1 className="text-4xl font-bold text-gray-900">
<p className="text-sm text-gray-600">

// Colores
<div className="bg-blue-500 text-white">
<button className="bg-red-600 hover:bg-red-700">

// Responsive
<div className="block md:flex lg:grid">

// Sombras & Bordes
<div className="shadow-lg rounded-lg border border-gray-200">
```

### Hot Module Replacement
El cambio automático de estilos y componentes está activado:
1. Edita `resources/js/Components/MyComponent.jsx`
2. Guarda (Ctrl+S)
3. El navegador se actualiza automáticamente
4. No pierdes el estado de la aplicación

---

## 🔐 PRUEBAS DE AUTENTICACIÓN

### Registrar Usuario
```
GET  /register    → Página de registro
POST /register    → Crear cuenta
```

### Login
```
GET  /login       → Página de login
POST /login       → Autenticarse
```

### Test en Tinker
```bash
php artisan tinker

# Crear usuario de prueba
>>> $user = User::factory()->create(['email' => 'test@test.com']);
>>> $user->password = 'password123';
>>> $user->save();

# Login programático
>>> auth()->login($user);
>>> auth()->user();
```

---

## 📝 ESTRUCTURA DE CARPETAS PARA DESARROLLO

Mantén esta estructura:
```
resources/js/
├── Components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Navigation.jsx
│   └── [componentes reutilizables]
├── Layouts/
│   ├── AppLayout.jsx          # Para páginas autenticadas
│   ├── GuestLayout.jsx        # Para público
│   └── AdminLayout.jsx        # Para admin
├── Pages/
│   ├── Home.jsx
│   ├── Properties/
│   │   ├── Index.jsx
│   │   └── Create.jsx
│   ├── Admin/
│   │   └── Dashboard.jsx
│   └── [más páginas]
└── utils/
    ├── api.js                 # Funciones API
    └── helpers.js             # Funciones auxiliares
```

---

## 🚨 ERRORES COMUNES

### "Class not found"
```bash
composer dump-autoload -o
```

### "Tailwind styles not loading"
```bash
npm run build
php artisan cache:clear
# Recarga navegador (Ctrl+Shift+R)
```

### "Cannot find module ./Pages/..."
Verificar que:
1. El archivo existe en `resources/js/Pages/`
2. El nombre exacto coincide (caso sensible)
3. Guarda los cambios

### "CORS Error"
- Si el frontend corre en puerto diferente al backend
- Usar Inertia helpers en lugar de fetch directo
- No suele ser problema con Inertia

### "Database connection refused"
```bash
# Verificar BD disponible
php artisan migrate

# En tinker:
php artisan tinker
>>> DB::connection()->getPdo();
```

---

## 📚 RECURSOS ÚTILES

- **Laravel Docs:** https://laravel.com/docs
- **Inertia Docs:** https://inertiajs.com/
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev

---

## ✅ CHECKLIST ANTES DE COMMIT

- [ ] Ejecuté `npm run build` sin errores
- [ ] Ejecuté `./vendor/bin/pint` para formatear
- [ ] Probé los cambios en navegador
- [ ] Sin error en consola del navegador (F12)
- [ ] Sin error en `storage/logs/laravel.log`
- [ ] Tests pasan (si creé) con `php artisan test`
- [ ] Cambios reflejan en `.env.example` si aplica

```bash
# Workflow típico
1. php artisan serve &
2. npm run dev &
3. [edita código]
4. npm run build
5. ./vendor/bin/pint
6. php artisan test
7. git add .
8. git commit -m "Mi cambio"
```

---

**¡Listo para desarrollar! 🚀**
