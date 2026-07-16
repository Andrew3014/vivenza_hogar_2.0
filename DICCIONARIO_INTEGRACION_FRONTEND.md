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
| `GET` | `/my-properties` | autenticado | Sus publicaciones. |
| `GET` | `/verification` | autenticado | Estado y formulario KYC. |
| `POST` | `/verification/submit` | autenticado | Enviar documento frente/reverso y selfie en base64. |
| `GET` | `/agent/verificaciones` | `agente` | Bandeja de verificaciones pendientes. |
| `POST` | `/agent/verificaciones/{userId}/aprobar` | `agente` | Aprobar KYC. |
| `POST` | `/agent/verificaciones/{userId}/rechazar` | `agente` | Rechazar KYC con `reason`. |
| `GET` | `/admin/usuarios` | `admin` | Gestión de cuentas. |
| `POST` | `/admin/usuarios` | `admin` | Crear empleado o usuario. |
| `PATCH` | `/admin/usuarios/{user}` | `admin` | Cambiar rol, estado, datos o contraseña. |
| `PATCH` | `/admin/propiedades/{property}` | `admin` | Corregir datos editoriales. |
| `PATCH` | `/admin/propiedades/{property}/status` | `admin` | Aprobar/rechazar/retornar a pendiente. |
| `GET` | `/admin/reportes` | `admin` | Indicadores agrupados para el panel. |

Las mismas acciones de verificación del administrador están disponibles bajo `/admin/verificaciones/*`.

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

## Usuario y verificación

Campos útiles para UI: `name`, `email`, `phone`, `role`, `account_status`, `is_account_verified`, `account_verified_at`, `document_number`, `document_extension`, `avatar_url`, `bio`, `city`, `state`, `whatsapp_number`, `whatsapp_visible`.

Estados de cuenta: `activo`, `suspendido`, `eliminado`.

Estados KYC (`user_verifications.status`): `pendiente`, `aprobado`, `rechazado`. Al aprobar/rechazar, backend sincroniza `users.is_account_verified` y `users.account_verified_at`.

## Planes y límites

`subscriptions.status = active` y `end_date >= ahora` definen una suscripción activa. La publicación debe respetar `max_properties`; el destacado solo se permite cuando `can_featured = true`.

Prioridad de catálogo: plan activo (`enterprise` > `premium` > `basic`), destacado vigente, rendimiento y fecha. El frontend no debe ordenar manualmente reemplazando el orden recibido.

## Respuestas y errores

- Inertia devuelve props con nombres estables (`properties`, `locations`, `filters`, `stats`, `reports`).
- Validación: HTTP 422 con claves de campo.
- No autenticado: 302 a login / 401 en llamadas JSON.
- Sin permisos: HTTP 403.
- Publicación inexistente o no visible: HTTP 404.

## Responsabilidades del agente

Además de verificar identidad, el agente puede operar una bandeja de soporte, revisar publicaciones antes de escalar, responder consultas, detectar duplicados o fraude, solicitar correcciones y dejar notas internas. Las decisiones de rol, suspensión, planes y configuración quedan reservadas al administrador.
