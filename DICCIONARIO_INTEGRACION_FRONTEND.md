# Diccionario de integración frontend — Vivenza Hogar

Este documento es el contrato de trabajo entre Laravel/Inertia y React. El frontend debe consumir los nombres de rutas y campos de aquí; no debe duplicar reglas de negocio.

## Roles y responsabilidades

| Valor en `users.role` | Nombre visible | Puede hacer |
|---|---|---|
| `cliente` | Cliente / vendedor | Buscar, guardar favoritos, enviar consultas, contratar un plan y publicar sus propios inmuebles con un plan activo. |
| `agente` | Agente de operaciones | Todo lo del cliente, además de revisar verificaciones, atender consultas, apoyar a usuarios y escalar incidencias. No administra cuentas ni configuración global. |
| `admin` | Administrador | Control total: usuarios, empleados, publicaciones, verificaciones, planes, reportes, correcciones y configuración. |

La cuenta se identifica por `role`; el estado operativo se identifica por `account_status`. No se debe usar el rol para representar una cuenta suspendida.

## Rutas principales

Todas las rutas protegidas necesitan sesión y email verificado. Las rutas de escritura usan CSRF cuando se llaman desde Inertia.

| Método | Ruta | Rol | Uso |
|---|---|---|---|
| `GET` | `/properties` | público | Listado paginado y filtros. |
| `GET` | `/properties/{property}` | público | Detalle de una publicación aprobada. |
| `GET` | `/publicar` | `cliente`, `agente` | Formulario de publicación; requiere plan activo. |
| `POST` | `/properties` | `cliente`, `agente` | Crear publicación, queda `pendiente`. |
| `PATCH` | `/properties/{property}` | propietario | Editar su publicación. |
| `DELETE` | `/properties/{property}` | propietario | Eliminar su publicación. |
| `GET` | `/panel` | autenticado | Panel personal (`dashboard`). Redirige a `Dashboard/User` con resumen de suscripción normalizado (`plan_name`, `properties_left`). |
| `GET` | `/my-properties` | autenticado | Sus publicaciones. |
| `GET` | `/mis-favoritos` | autenticado | Listado paginado de las propiedades guardadas por la cuenta. Nombre: `favorites.index`. |
| `POST` | `/properties/{property}/favorite` | autenticado | Guardar una publicación aprobada. Es idempotente. Nombre: `favorites.store`. |
| `DELETE` | `/properties/{property}/favorite` | autenticado | Quitar únicamente el favorito de la cuenta actual. Nombre: `favorites.destroy`. |
| `GET` | `/verification` | autenticado | Estado y formulario KYC. |
| `POST` | `/verification/submit` | autenticado | Enviar documento frente/reverso y selfie en base64. |
| `GET` | `/agent/verificaciones` | `agente` | Bandeja de verificaciones pendientes. |
| `POST` | `/agent/verificaciones/{userId}/aprobar` | `agente` | Aprobar KYC. |
| `POST` | `/agent/verificaciones/{userId}/rechazar` | `agente` | Rechazar KYC con `reason`. |
| `GET` | `/agent/mensajes` | `agente` | Bandeja de consultas (`agent.messages.index`). |
| `POST` | `/agent/mensajes/{inquiry}/responder` | `agente` | Guarda `message_body` en `messages` y pasa la consulta a `respondido` (`agent.messages.reply`). |
| `POST` | `/agent/mensajes/{inquiry}/estado` | `agente` | Cambia `inquiry_status` (`pendiente`, `respondido`, `finalizado`, `rechazado`) (`agent.messages.status`). |
| `GET` | `/admin/usuarios` | `admin` | Gestión de cuentas. |
| `GET` | `/admin/usuarios/crear` | `admin` | Formulario de creación. |
| `POST` | `/admin/usuarios` | `admin` | Crear empleado o usuario. |
| `GET` | `/admin/usuarios/{user}/editar` | `admin` | Pantalla de edición (`Admin/EditUser`). No expone credenciales. |
| `PATCH` | `/admin/usuarios/{user}` | `admin` | Cambiar rol, estado, datos o contraseña. |
| `PATCH` | `/admin/propiedades/{property}` | `admin` | Corregir datos editoriales. |
| `PATCH` | `/admin/propiedades/{property}/status` | `admin` | Aprobar/rechazar/retornar a pendiente. |
| `GET` | `/admin/reportes` | `admin` | Indicadores agrupados para el panel. |

Las mismas acciones de verificación del administrador están disponibles bajo `/admin/verificaciones/*`. Las rutas de aprobar/rechazar reciben `{userId}` (el `user_id` del registro, no el `id` de `user_verifications`); el frontend debe enviar `verification.user_id`.

## Mensajes flash

Inertia comparte por defecto `flash` (`success`, `error`) vía `HandleInertiaRequests`. Las pantallas renderizan `Components/FlashMessages.jsx` (`<FlashMessages />`); el controlador solo debe hacer `redirect(...)->with('success'|'error', 'mensaje')`. No usar `alert()` del navegador.

## Aviso global de verificación

`Components/VerificationNotice.jsx` se renderiza dentro de `AppLayout` y `AgentLayout` (no es necesario agregarlo página por página). Estados:

- Sin registro `user_verifications`: botones "Verificar ahora" (a `/verification`) y "Después" (guarda `sessionStorage.vz_skip_verification_{user.id}` para no volver a mostrar en la sesión).
- `pendiente`: aviso informativo "en revisión", sin acciones.
- `rechazado`: muestra `rejection_reason` y botón "Intentar de nuevo" (a `/verification`).
- `aprobado` o rol `admin`: no se muestra nada.

`auth.user` llega con la relación `verification` cargada (`HandleInertiaRequests::share`). `PropertyController::userProperties` también hace `$user->load('verification')` para que el panel no reporte "no verificada" de forma falsa.

## Publicación (`properties`)

Campos mínimos para crear:

```json
{
  "location_id": 1,
  "title": "Casa en Equipetrol",
  "description": "Descripción de al menos 20 caracteres",
  "price": 85000,
  "transaction_type": "venta",
  "currency": "USD"
}
```

`transaction_type` acepta: `venta`, `alquiler`, `anticretico`, `alquiler_diario`.

Reglas condicionales:

- `anticretico`: `anticretico_registered_ddrr` (boolean) y `contract_duration_years` (1–10).
- `alquiler_diario`: `min_stay_days` (1–365), `requires_guarantee` y, si corresponde, `guarantee_amount`.
- Para los demás tipos esos campos se limpian en backend, aunque el cliente envíe un valor anterior.
- `currency` acepta `USD` o `BOB`.
- Toda publicación nueva inicia en `status = pendiente`; únicamente personal autorizado puede aprobarla.

Estados de publicación: `pendiente`, `aprobado`, `rechazado`.

### Imágenes de publicación

El modelo `PropertyImage` guarda `image_url` y `alt_text`. Para consumo del frontend expone los alias `url` y `name`:

```json
{
  "id": 1,
  "image_url": "/storage/properties/1/xxx.jpg",
  "alt_text": "Casa en Equipetrol",
  "url": "/storage/properties/1/xxx.jpg",
  "name": "Casa en Equipetrol"
}
```

- En listados (`Home`, `PropertyCard`, `Dashboard/User`) el backend entrega `primary_image` (primera imagen por anuncio, con `oldestOfMany`); el frontend usa `property.primary_image?.url`.
- En el detalle (`Property/Show`) se entrega el array completo `images` para la galería.
- Máximo 8 imágenes por anuncio (`PropertyController::storeImages`).

### Formulario compartido de propiedad

`Property/Create` y `Property/Edit` usan el mismo componente `Components/PropertyForm.jsx`; no hay dos formularios que puedan divergir.

- `POST /properties` (crear) y `PATCH /properties/{property}` (editar) aceptan los mismos campos, incluido `images` (nuevas, hasta 8 en total) y `remove_image_ids` (array de ids de imágenes existentes a eliminar).
- En modo edición la galería muestra las imágenes actuales con botón ✕ (se agrega a `remove_image_ids`, con "Restaurar") y permite agregar nuevas en el mismo envío.
- Backend borra también el archivo físico (`Storage::disk('public')`) al eliminar una imagen y solo afecta imágenes de esa propiedad.
- `Property/Edit` carga `property.images` para la galería.

## Favoritos

La tabla `favorites` almacena `user_id`, `property_id` y fechas. Su clave única compuesta impide que una cuenta guarde dos veces la misma propiedad; las claves foráneas eliminan automáticamente los favoritos si se borra la cuenta o la publicación.

En el detalle `Property/Show`, Laravel entrega:

```json
{
  "property": {
    "id": 1,
    "favorites_count": 3
  },
  "isFavorite": true
}
```

El botón debe usar `favorites.store` cuando `isFavorite` sea falso y `favorites.destroy` cuando sea verdadero. La pantalla `Favorites/Index` recibe `properties` con el formato normal del paginador de Laravel (`data`, `current_page`, `last_page`, `prev_page_url`, `next_page_url`). Solo lista publicaciones aprobadas.

No hay que importar un SQL separado para esta función: la migración `2026_03_21_054233_create_favorites_table.php` se ejecuta con `php artisan migrate`. El escenario `DemoScenarioSeeder` deja al usuario `cliente.demo@vivenza.test` con una propiedad favorita para probar la interfaz.

## Usuario y verificación

Campos útiles para UI: `name`, `email`, `phone`, `role`, `account_status`, `is_account_verified`, `account_verified_at`, `document_number`, `document_extension`, `avatar_url`, `bio`, `city`, `state`, `whatsapp_number`, `whatsapp_visible`.

Estados de cuenta: `activo`, `suspendido`, `eliminado`.

Estados KYC (`user_verifications.status`): `pendiente`, `aprobado`, `rechazado`. Al aprobar/rechazar, backend sincroniza `users.is_account_verified` y `users.account_verified_at`.

### Verificación obligatoriamente con cámara

El KYC (`Auth/VerifyIdentity`) captura frente/reverso de documento y selfie **solo con la cámara** del equipo (`getUserMedia` + canvas); no existe entrada de archivos para esta pantalla y no se debe agregar. La cuenta puede crearse y usarse sin verificar, pero la verificación requiere un equipo con cámara:

- Documento (frente y reverso): `cameraMode="environment"` (cámara trasera).
- Selfie: `cameraMode="user"` (cámara frontal).
- Sin cámara o sin permisos: se muestra el estado "Cámara no disponible" con reintento; el usuario puede diferir la verificación a otro dispositivo.
- `VerificationController::submit` solo acepta strings base64 (`document_front`, `document_back`, `face_selfie`).

## Planes y límites

`subscriptions.status = active` y `end_date >= ahora` definen una suscripción activa. La publicación debe respetar `max_properties`; el destacado solo se permite cuando `can_featured = true`.

El catálogo de planes es único y no debe duplicarse en cada pantalla:

- Backend: `app/Support/Plans.php` (clases `basic`, `premium`, `enterprise` con `price`, `max_properties`, `can_featured`).
- Frontend: `resources/js/utils/plans.js` exporta `plans`, `findPlan`, `planName` y `planPrice`; `resources/js/utils/transactionTypes.js` exporta el catálogo de `transaction_type`.
- `PaymentController::getPlans()` se deriva de `app/Support/Plans`. El plan por defecto de `payment.subscription` es `basic`.

Valores reales en BD:

- `subscriptions.plan`: `basic`, `premium`, `enterprise`.
- `subscriptions.status`: `active`, `expired`, `cancelled`.
- Columna de vencimiento: `end_date` (no `expiration_date`).
- En las pantallas de planes y suscripciones se usa `findPlan`/`planPrice`; no se comparan ids inexistentes (`basico`, `profesional`).

Prioridad de catálogo: plan activo (`enterprise` > `premium` > `basic`), destacado vigente, rendimiento y fecha. El frontend no debe ordenar manualmente reemplazando el orden recibido.

## Consultas de contacto (`inquiries`)

La bandeja `agent.messages.index` entrega `inquiries` con `user`, `property`, `message`, `contact_via`, `seller_phone`, `buyer_verified`, `inquiry_status` y `priority`.

- `inquiry_status`: `pendiente`, `respondido`, `finalizado`, `rechazado`.
- `priority`: `baja`, `media`, `alta`.
- `contact_via`: `whatsapp`, `mensaje`, `email`.
- `seller_phone` es el teléfono del vendedor (dueño de la publicación), no del comprador.

## Respuestas y errores

- Inertia devuelve props con nombres estables (`properties`, `locations`, `filters`, `stats`, `reports`).
- Validación: HTTP 422 con claves de campo.
- No autenticado: 302 a login / 401 en llamadas JSON.
- Sin permisos: HTTP 403.
- Publicación inexistente o no visible: HTTP 404.

## Responsabilidades del agente

Además de verificar identidad, el agente puede operar una bandeja de soporte, revisar publicaciones antes de escalar, responder consultas, detectar duplicados o fraude, solicitar correcciones y dejar notas internas. Las decisiones de rol, suspensión, planes y configuración quedan reservadas al administrador.
