# LISTA DE CORRECCION DESPUES DE LA UNION

## Contexto
Después de unir el trabajo del compañero (nueva base visual: `AppLayout`, `AdminLayout`, `AgentLayout`, `Navbar`, categorías, buscador, panel de administración, formulario de publicación ampliado) con la base local, se detectaron varios problemas de conexión entre el backend y el frontend. Este documento explica cada problema encontrado y cómo se resolvió.

---

## 1. Problemas de coherencia backend-frontend

### 1.1 Filtro de alquiler diario roto
- **Problema:** el filtro usaba `alquiler_dias` pero el backend maneja `alquiler_diario`, por lo que el filtro nunca encontraba resultados.
- **Solución:** se unificó a `alquiler_diario` en toda la cadena (filtros, formulario y rutas).

### 1.2 Catálogos de planes duplicados e inconsistentes
- **Problema:** el backend y el frontend tenían cada uno su propio catálogo de planes con nombres distintos (`basico` vs `basic`), precios y límites que no coincidían.
- **Solución:** se creó una única fuente de verdad en `app/Support/Plans.php` (planes `basic`, `premium`, `enterprise` con `price`, `max_properties`, `can_featured`) y su espejo en `resources/js/utils/plans.js`. `PaymentController::getPlans()` deriva del catálogo único y el plan por defecto pasó de `basico` a `basic`.

### 1.3 Formulario de publicación con campos que no existían en el backend
- **Problema:** `Create.jsx` enviaba campos inexistentes (`year_built`, `parking`, `security`, `is_furnished`) y el backend los ignoraba, rompiendo guardado y edición.
- **Solución:** se alineó el formulario con los campos reales (`parking_spaces`, `furnished`, etc.), se eliminaron los campos fantasmas y se creó `PropertyForm.jsx` compartido entre crear y editar. El backend valida los campos reales y persiste hasta 8 imágenes.

### 1.4 Home y detalle no mostraban los datos reales
- **Problema:** la portada usaba filtros simulados en el cliente en vez del backend, y la página de detalle mostraba campos que no existían en el servidor.
- **Solución:** `Home.jsx` se reescribió para que los filtros (tipo, precio, dormitorios, área, destacadas, búsqueda) sean servidos por el backend con paginación y moneda real. `Show.jsx` muestra los campos reales (parqueos, amoblado, anticrético/DDRR/duración, alquiler diario/garantía, amenities) y conecta el botón eliminar.

### 1.5 Reportes del panel admin sin datos
- **Problema:** la vista de reportes del administrador no recibía datos del backend.
- **Solución:** se conectó `Admin/Dashboard` a los datos reales (propiedades por tipo, ingreso mensual sumando `Plans::price` de suscripciones activas).

### 1.6 Mensaje de límite de plan incorrecto
- **Problema:** la pantalla de publicar propiedad mostraba un mensaje de límite con campos que el servidor no enviaba.
- **Solución:** se corrigió para usar los campos reales que devuelve el backend (`plan_name`, `properties_left`).

---

## 2. Problemas de imágenes y consultas

### 2.1 Las propiedades siempre caían en el placeholder
- **Problema:** `PropertyController::index` hacía un eager-load incorrecto (`images => first()`) y el frontend usaba `image.url` / `image.name`, campos que no existían en el modelo `PropertyImage` (que tiene `image_url` y `alt_text`).
- **Solución:** se eliminó el eager-load incorrecto, se creó la relación `primaryImage` (miniatura por anuncio) y `PropertyImage` expone los alias `url` y `name`. `PropertyCard`, `Home` y `Dashboard/User` ahora muestran la imagen real.

### 2.2 La edición de propiedades era mínima
- **Problema:** `Property/Edit` era un formulario básico sin todos los campos ni gestión de imágenes.
- **Solución:** se creó `PropertyForm.jsx` compartido por crear y editar (ubicación/mapa, tipo, precio, moneda, características, galería). En edición se pueden quitar imágenes existentes (`remove_image_ids`) y subir nuevas en el mismo envío; el backend borra el archivo físico y respeta el máximo de 8.

### 2.3 Borrado de imágenes físicas fallaba
- **Problema:** `updateImages` usaba `str_replace('/storage/', ...)` que fallaba con URLs completas, dejando archivos huérfanos.
- **Solución:** se usa `deleteStoredFile()` con `parse_url`, y `destroy()` también elimina los archivos físicos al borrar la propiedad.

### 2.4 Respuestas de consultas no funcionaban
- **Problema:** la bandeja del agente usaba `alert` y no llamaba a ningún endpoint real.
- **Solución:** se creó `InquiryController` con `reply()` (guarda en `messages` y marca `respondido`) y `markAsResponded()`, con rutas reales; la bandeja ahora responde y cambia estados contra el backend.

---

## 3. Problemas de mensajes flash y verificación

### 3.1 Mensajes flash invisibles
- **Problema:** Inertia v2 NO comparte `flash` por defecto (solo `errors`), por lo que ningún `->with('success'|'error')` del backend llegaba al frontend.
- **Solución:** `HandleInertiaRequests::share` ahora comparte `flash` (`success`, `error`, `warning`, `info`) manualmente, y se creó `FlashMessages.jsx` insertado en todas las pantallas que recibían flash pero no lo mostraban.

### 3.2 "Continuar sin verificar" daba 404
- **Problema:** `VerifyIdentity.jsx` navegaba a `/dashboard`, ruta que no existe (la real es `/panel`).
- **Solución:** ahora usa `router.visit(route('dashboard'))`.

### 3.3 Aviso de verificación falso
- **Problema:** `UserVerification` se creaba con estado `pendiente` al registrarse, así que el usuario veía "Verificación en revisión" sin haber subido fotos.
- **Solución:** el registro ya no crea verificación; esta se crea cuando el usuario envía sus fotos en `/verification`.

### 3.4 Estado de verificación no llegaba al frontend
- **Problema:** el dashboard reportaba "no verificada" de forma falsa porque la relación `verification` no se cargaba.
- **Solución:** `HandleInertiaRequests::share` carga `auth.user.verification` y `PropertyController::userProperties` hace `load('verification')`. Se eliminó además el bloque `VerificationStatus` duplicado dentro del dashboard (lo sustituye el aviso global).

---

## 4. Problemas del perfil de usuario y seguridad

### 4.1 Actualizar perfil daba error 500
- **Problema:** `PATCH /profile` fallaba siempre.
- **Solución:** se creó `app/Http/Requests/ProfileUpdateRequest.php` con las validaciones correctas (name/email obligatorios + unique; phone/city/state/bio opcionales).

### 4.2 `is_verified` nunca se serializaba
- **Problema:** `User.php` solo tenía el método `isVerified()`; el frontend lee `user.is_verified`, por lo que WhatsApp quedaba bloqueado para todos.
- **Solución:** se agregó `$appends = ['is_verified']` con su accessor.

### 4.3 `#[Hidden]` roto: contraseñas viajaban al frontend
- **Problema:** `User.php` usaba atributos PHP `#[Fillable]`/`#[Hidden]` (clases que no existen en Eloquent), así que `password` y `remember_token` se serializaban en cada respuesta Inertia.
- **Solución:** se reemplazaron por `protected $fillable` y `protected $hidden = ['password', 'remember_token']`.

### 4.4 Doble consulta de suscripción (condición de carrera)
- **Problema:** `PropertyController::store` consultaba la suscripción dos veces, con riesgo de condición de carrera.
- **Solución:** se consolidó en una sola búsqueda.

---

## 5. Problemas de botones, páginas y WhatsApp

### 5.1 Botones sin backend
- **Problema:** en `Agent/Properties` los botones Ver/Editar/Eliminar no estaban conectados; en `Agent/Subscriptions` los botones Pausar/Cancelar apuntaban a endpoints inexistentes; `Admin/Settings` era un formulario con botón "Guardar" sin backend; `Payment/Index.jsx` era una página muerta.
- **Solución:** los botones del agente se conectaron a las rutas reales; Pausar/Cancelar se reemplazaron por "Contactar Cliente" (mailto) que no finge funcionalidad; `Admin/Settings` se reescribió como pantalla informativa; se eliminó `Payment/Index.jsx` (la real es `Payments/WhatsApp.jsx`).

### 5.2 Número de WhatsApp rechazaba espacios
- **Problema:** el regex no aceptaba espacios ni el campo `whatsapp_visible` se validaba como booleano.
- **Solución:** regex `/^\+?[0-9 ]{8,19}$/` con limpieza previa y `sometimes|boolean`.

### 5.3 Página de pago mal armada
- **Problema:** `Payments/WhatsApp.jsx` tenía navbar/footer sueltos y un botón "Reportar problema" muerto.
- **Solución:** se envolvió en `AppLayout` y el botón ahora abre WhatsApp con el mensaje usando `whatsappNumber`; se eliminó `showReportForm()` muerta.

### 5.4 Contactar propietario daba 500 sin ubicación
- **Problema:** `PaymentController::contactProperty` fallaba (500) cuando la propiedad no tenía ubicación, y la ruta usaba `{property}` con binding posicional roto.
- **Solución:** guarda null-safe contra `location` nulo y la ruta usa `{propertyId}`.

---

## 6. Problemas del panel de administración

### 6.1 Acciones de aprobar/rechazar inexistentes
- **Problema:** el panel admin no podía moderar publicaciones.
- **Solución:** `Admin/Properties` agregó aprobar, rechazar (con confirmación y motivo opcional), despublicar y republicar contra `admin.properties.status`.

### 6.2 Componente huérfano y página de usuario muerta
- **Problema:** `Dashboard/Admin.jsx` apuntaba a rutas inexistentes, y `Admin/EditUser` era un placeholder.
- **Solución:** se eliminó `Dashboard/Admin.jsx` (el real es `Admin/Dashboard.jsx`); `Admin/EditUser` ahora es un formulario funcional (nombre, teléfono, rol, estado, contraseña opcional). `Admin/Users` conecta eliminar con `account_status = eliminado` y oculta eliminados.