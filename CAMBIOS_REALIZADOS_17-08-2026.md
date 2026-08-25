# ✅ CAMBIOS REALIZADOS - VIVENZA HOGAR

**Fecha:** 17 de Agosto 2026
**Proyecto:** Sistema de Gestión de Propiedades Inmobiliarias
**Versión Stack:** Laravel 11 + React 18 + Vite 8 + Tailwind CSS 4 + Inertia v2

---

## 1. Problemas de la unión del trabajo del compañero

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

### 1.7 Las propiedades siempre caían en el placeholder
- **Problema:** `PropertyController::index` hacía un eager-load incorrecto (`images => first()`) y el frontend usaba `image.url` / `image.name`, campos que no existían en el modelo `PropertyImage` (que tiene `image_url` y `alt_text`).
- **Solución:** se eliminó el eager-load incorrecto, se creó la relación `primaryImage` (miniatura por anuncio) y `PropertyImage` expone los alias `url` y `name`. `PropertyCard`, `Home` y `Dashboard/User` ahora muestran la imagen real.

### 1.8 La edición de propiedades era mínima
- **Problema:** `Property/Edit` era un formulario básico sin todos los campos ni gestión de imágenes.
- **Solución:** se creó `PropertyForm.jsx` compartido por crear y editar (ubicación/mapa, tipo, precio, moneda, características, galería). En edición se pueden quitar imágenes existentes (`remove_image_ids`) y subir nuevas en el mismo envío; el backend borra el archivo físico y respeta el máximo de 8.

### 1.9 Borrado de imágenes físicas fallaba
- **Problema:** `updateImages` usaba `str_replace('/storage/', ...)` que fallaba con URLs completas, dejando archivos huérfanos.
- **Solución:** se usa `deleteStoredFile()` con `parse_url`, y `destroy()` también elimina los archivos físicos al borrar la propiedad.

### 1.10 Respuestas de consultas no funcionaban
- **Problema:** la bandeja del agente usaba `alert` y no llamaba a ningún endpoint real.
- **Solución:** se creó `InquiryController` con `reply()` (guarda en `messages` y marca `respondido`) y `markAsResponded()`, con rutas reales; la bandeja ahora responde y cambia estados contra el backend.

### 1.11 Mensajes flash invisibles
- **Problema:** Inertia v2 NO comparte `flash` por defecto (solo `errors`), por lo que ningún `->with('success'|'error')` del backend llegaba al frontend.
- **Solución:** `HandleInertiaRequests::share` ahora comparte `flash` (`success`, `error`, `warning`, `info`) manualmente, y se creó `FlashMessages.jsx` insertado en todas las pantallas que recibían flash pero no lo mostraban.

### 1.12 "Continuar sin verificar" daba 404
- **Problema:** `VerifyIdentity.jsx` navegaba a `/dashboard`, ruta que no existe (la real es `/panel`).
- **Solución:** ahora usa `router.visit(route('dashboard'))`.

### 1.13 Aviso de verificación falso
- **Problema:** `UserVerification` se creaba con estado `pendiente` al registrarse, así que el usuario veía "Verificación en revisión" sin haber subido fotos.
- **Solución:** el registro ya no crea verificación; esta se crea cuando el usuario envía sus fotos en `/verification`.

### 1.14 Estado de verificación no llegaba al frontend
- **Problema:** el dashboard reportaba "no verificada" de forma falsa porque la relación `verification` no se cargaba.
- **Solución:** `HandleInertiaRequests::share` carga `auth.user.verification` y `PropertyController::userProperties` hace `load('verification')`. Se eliminó además el bloque `VerificationStatus` duplicado dentro del dashboard (lo sustituye el aviso global).

### 1.15 Actualizar perfil daba error 500
- **Problema:** `PATCH /profile` fallaba siempre.
- **Solución:** se creó `app/Http/Requests/ProfileUpdateRequest.php` con las validaciones correctas (name/email obligatorios + unique; phone/city/state/bio opcionales).

### 1.16 `is_verified` nunca se serializaba
- **Problema:** `User.php` solo tenía el método `isVerified()`; el frontend lee `user.is_verified`, por lo que WhatsApp quedaba bloqueado para todos.
- **Solución:** se agregó `$appends = ['is_verified']` con su accessor.

### 1.17 `#[Hidden]` roto: contraseñas viajaban al frontend
- **Problema:** `User.php` usaba atributos PHP `#[Fillable]`/`#[Hidden]` (clases que no existen en Eloquent), así que `password` y `remember_token` se serializaban en cada respuesta Inertia.
- **Solución:** se reemplazaron por `protected $fillable` y `protected $hidden = ['password', 'remember_token']`.

### 1.18 Doble consulta de suscripción (condición de carrera)
- **Problema:** `PropertyController::store` consultaba la suscripción dos veces, con riesgo de condición de carrera.
- **Solución:** se consolidó en una sola búsqueda.

### 1.19 Botones sin backend
- **Problema:** en `Agent/Properties` los botones Ver/Editar/Eliminar no estaban conectados; en `Agent/Subscriptions` los botones Pausar/Cancelar apuntaban a endpoints inexistentes; `Admin/Settings` era un formulario con botón "Guardar" sin backend; `Payment/Index.jsx` era una página muerta.
- **Solución:** los botones del agente se conectaron a las rutas reales; Pausar/Cancelar se reemplazaron por "Contactar Cliente" (mailto) que no finge funcionalidad; `Admin/Settings` se reescribió como pantalla informativa; se eliminó `Payment/Index.jsx` (la real es `Payments/WhatsApp.jsx`).

### 1.20 Número de WhatsApp rechazaba espacios
- **Problema:** el regex no aceptaba espacios ni el campo `whatsapp_visible` se validaba como booleano.
- **Solución:** regex `/^\+?[0-9 ]{8,19}$/` con limpieza previa y `sometimes|boolean`.

### 1.21 Página de pago mal armada
- **Problema:** `Payments/WhatsApp.jsx` tenía navbar/footer sueltos y un botón "Reportar problema" muerto.
- **Solución:** se envolvió en `AppLayout` y el botón ahora abre WhatsApp con el mensaje usando `whatsappNumber`; se eliminó `showReportForm()` muerta.

### 1.22 Contactar propietario daba 500 sin ubicación
- **Problema:** `PaymentController::contactProperty` fallaba (500) cuando la propiedad no tenía ubicación, y la ruta usaba `{property}` con binding posicional roto.
- **Solución:** guarda null-safe contra `location` nulo y la ruta usa `{propertyId}`.

### 1.23 Panel admin sin moderación
- **Problema:** el panel admin no podía aprobar ni rechazar publicaciones.
- **Solución:** `Admin/Properties` agregó aprobar, rechazar (con confirmación y motivo opcional), despublicar y republicar contra `admin.properties.status`.

### 1.24 Componente huérfano y página de usuario muerta
- **Problema:** `Dashboard/Admin.jsx` apuntaba a rutas inexistentes, y `Admin/EditUser` era un placeholder.
- **Solución:** se eliminó `Dashboard/Admin.jsx` (el real es `Admin/Dashboard.jsx`); `Admin/EditUser` ahora es un formulario funcional (nombre, teléfono, rol, estado, contraseña opcional). `Admin/Users` conecta eliminar con `account_status = eliminado` y oculta eliminados.

---

## 2. Bugs corregidos del rediseño visual

### 2.1 Animación del menú desplegable (`app.css`)
- **Problema:** `animation: slideDown 5s` hacía que el dropdown del navbar tardara 5 segundos en aparecer.
- **Solución:** `animation: slideDown .2s ease`.

### 2.2 Botón de usuario (`app.css`)
- **Problema:** selector `.vz-btn-user-menu` duplicado y con `background: transparent !important` + `transition: none`, que bloqueaba el estilo hover y rompía el contraste.
- **Solución:** selector duplicado eliminado, `!important` y `transition: none` removidos, y se agregó un hover dorado sutil (`rgba(201, 169, 97, 0.12)`).

### 2.3 Estilo de iconos SVG
- **Problema:** las funciones de iconos (`PendingIcon`, `DocumentIcon`, `CheckIcon`, `XIcon`, etc.) solo aceptaban `className` y recibían `style={{ color: ... }}`, por lo que el color dorado/verde no se aplicaba.
- **Solución:** en `VerificationNotice.jsx`, `VerificationStatus.jsx` y `Dashboard/User.jsx` (14 iconos en el panel) las funciones ahora aceptan y aplican `style` al SVG.

---

## 3. Fix de cámara de verificación

**Causa raíz del bug corregido:**
- `stopCamera()` dentro de `capturePhoto` colapsaba el modal.
- El frame aún no estaba decodificado cuando se guardaba la foto (foto negra).
- El botón se re-etiquetaba como "Confirmar" en la misma posición → el siguiente clic avanzaba con foto vacía.

**Solución aplicada:**
- `capturePhoto` ahora es asíncrono con `waitForFrame` (verifica `videoWidth`/`videoHeight`/`readyState` + `requestVideoFrameCallback`, hasta 3 s de reintento).
- Ya no detiene la cámara al capturar; el retomar no reinicia el stream.
- Z-index explícito (`isolate`/`z-0`/`z-10`/`z-20`) para que el `<video>` no tape los botones.
- Sello "✓ Capturada" y textos de guía, `webkit-playsinline`.

---

## 4. Mapa interactivo mejorado (`PropertyMap.jsx`)

### 4.1 Problemas detectados en la versión anterior
- Marcadores idénticos para todas las propiedades (icono estándar de Leaflet) → imposible distinguir tipo de operación o tipo de inmueble.
- Popup inyectaba `property.title` sin escapar HTML → **riesgo de XSS** con títulos maliciosos.
- Sin leyenda para entender las marcas.
- `setView` fijo en lugar de `fitBounds` → no todas las marcas eran visibles al abrir el mapa.

### 4.2 Solución aplicada
- **Marcadores personalizados** (pin `divIcon`):
  - **Color por operación:** venta = verde, alquiler = azul, anticrético = dorado, alquiler por días = morado.
  - **Ícono por tipo físico inferido del título:** casa, departamento o terreno (con respaldo "propiedad").
- **Leyenda** superpuesta en el mapa que explica colores de operación e íconos de tipo.
- **Popup mejorado:** insignias de tipo + operación, título, dirección, precio y botón "Ver publicación →".
- **Navegación SPA:** clic en la marca o en el enlace del popup redirige a `/properties/{id}` vía Inertia (sin recarga).
- **Escape de HTML** en todos los textos del popup (mitiga XSS).
- **`fitBounds`** con padding para mostrar todas las marcas al abrir el mapa.
- **Filtros sincronizados:** el mapa recibe las propiedades ya filtradas por el servidor, por lo que al buscar por operación (venta, alquiler, etc.), texto, precio o zona solo aparecen las marcas que coinciden.