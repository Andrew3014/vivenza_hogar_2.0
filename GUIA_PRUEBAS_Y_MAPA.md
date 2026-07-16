# Guía de pruebas, datos y mapa

## 1. Preparar el entorno local

Desde la raíz del proyecto, solo en una base local de pruebas:

```bash
composer install
npm install
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
npm run dev
php artisan serve
```

`migrate:fresh` borra las tablas existentes. Para no borrar datos de un entorno compartido, usa únicamente:

```bash
php artisan db:seed --class=DemoScenarioSeeder
```

El seeder `DemoScenarioSeeder` es repetible: no crea duplicados si se ejecuta varias veces.

## 2. Cuentas de prueba

Todas usan la contraseña `VivenzaDemo123!` y tienen el correo verificado.

| Rol | Email | Qué probar |
|---|---|---|
| Administrador | `admin.demo@vivenza.test` | `/admin/dashboard`, usuarios, verificaciones, moderación y reportes. |
| Agente | `agente.demo@vivenza.test` | `/agent/verificaciones`, mensajes, suscripción Premium y publicaciones propias. |
| Cliente/vendedor | `cliente.demo@vivenza.test` | `/publicar`, favoritos/consultas y publicación con plan Basic. Su KYC empieza pendiente. |

El escenario incluye cuatro publicaciones aprobadas: venta, alquiler, anticrético y alquiler diario, distribuidas en La Paz, Santa Cruz y Cochabamba. También incluye coordenadas puntuales distintas de las coordenadas generales del barrio para validar el mapa.

## 3. Datos que debe ingresar un vendedor

### Identidad y contacto

- Nombre legal y nombre visible.
- Email, teléfono y WhatsApp.
- Número de CI y extensión/departamento (`document_extension`).
- Ciudad y departamento.
- Documento frontal, reverso y selfie para KYC.
- Biografía o presentación comercial.

### Publicación común

- Tipo de operación: `venta`, `alquiler`, `anticretico` o `alquiler_diario`.
- Título corto y descriptivo.
- Descripción de al menos 20 caracteres.
- Precio y moneda (`BOB` o `USD`).
- Barrio/zona, ciudad y departamento.
- Coordenadas exactas (`latitude`, `longitude`) seleccionadas en el mapa.
- Dormitorios, baños, superficie en m².
- Estacionamientos, amueblado, amenidades y reglas.
- Fotografías optimizadas y ordenadas.

### Campos condicionales

| Operación | Campos adicionales |
|---|---|
| Anticrético | `anticretico_registered_ddrr`, `contract_duration_years`, documentación legal y condiciones de devolución. |
| Alquiler diario | `min_stay_days`, `requires_guarantee`, `guarantee_amount`, disponibilidad y reglas de check-in/check-out. |
| Alquiler mensual | Garantía, adelanto, servicios incluidos y duración mínima. |
| Venta | Situación legal, gravámenes, servicios básicos, superficie de terreno/construcción y año de construcción. |

Antes de publicar, el frontend debe mostrar un resumen para confirmar precio, moneda, ubicación y datos legales. El backend siempre inicia la publicación en `pendiente`.

## 4. Comportamiento esperado de filtros

El usuario debe poder combinar filtros sin perder la sección seleccionada:

- Operación: venta, alquiler, anticrético o alquiler diario.
- Ubicación: país, departamento, ciudad, barrio y radio alrededor del mapa.
- Precio mínimo/máximo y moneda.
- Dormitorios, baños, superficie mínima/máxima y estacionamientos.
- Amueblado, amenidades, DDRR y garantía.
- Disponibilidad, publicación verificada y fecha de actualización.

La URL debe conservar los filtros para compartir o volver atrás. En producción los filtros deben ejecutarse en backend con paginación; filtrar únicamente los 12 resultados ya cargados en React no escala.

## 5. Mapa y coordenadas

La aplicación usa Leaflet + OpenStreetMap. El flujo recomendado es:

1. El vendedor selecciona primero ciudad/barrio.
2. El mapa centra esa zona.
3. Hace clic en el punto exacto o arrastra el marcador.
4. Se guardan `properties.latitude` y `properties.longitude`.
5. El catálogo usa esas coordenadas; si faltan, usa las coordenadas generales de `locations`.
6. El detalle muestra el marcador, copia `latitud, longitud` y abre Google Maps.
7. El catálogo muestra todas las propiedades aprobadas que coinciden con la sección/filtros seleccionados.

La URL de Google Maps se genera así:

```text
https://www.google.com/maps/search/?api=1&query={latitude},{longitude}
```

No se debe mostrar la dirección exacta de una vivienda sensible sin autorización del propietario; se puede mostrar una zona aproximada en la vista pública y reservar el punto exacto para usuarios autenticados.

## 6. Evaluación de la base SQL

### Está lista para pruebas y un MVP

- Relaciones principales y claves foráneas están presentes.
- Propiedades soportan las cuatro operaciones bolivianas.
- Hay estados para cuentas, KYC, publicaciones y suscripciones.
- Favoritos e investigaciones tienen restricciones e índices básicos.
- Coordenadas y moneda ya están modeladas.

### Aún no es una base “definitiva” para alto crecimiento

- `users.role`, `properties.status`, `notifications.type` y varios estados son `ENUM`; cada nuevo valor exige migración. Para crecimiento conviene migrar a tablas catálogo o `VARCHAR` con constantes/checks.
- `properties.type` y `properties.transaction_type` están duplicados por compatibilidad. Debe quedar `transaction_type` como fuente única y retirar `type` después de migrar clientes.
- Falta una tabla de pagos/facturas con proveedor, moneda, referencia, reembolso y conciliación.
- Las verificaciones guardan URLs; en producción deben usar almacenamiento privado, URLs temporales, cifrado y política de retención.
- Falta auditoría de acciones administrativas y cambios de estado.
- `locations` necesita un índice/unique para evitar duplicar barrio-ciudad y una estrategia de geocodificación.
- El flujo de imágenes del formulario todavía debe conectarse al backend para validar tamaño, formato, antivirus y generar WebP/miniaturas.
- Para el catálogo grande se necesitan índices compuestos y filtros geoespaciales por bounding box/radio.

Conclusión: la base es suficientemente estable para que frontend avance y para pruebas de negocio, pero no debe declararse “production-ready” para pagos, KYC real o miles de publicaciones hasta completar los puntos anteriores.

## 7. Criterio de entrega al frontend

El compañero puede empezar ya con el frontend usando:

- [DICCIONARIO_INTEGRACION_FRONTEND.md](DICCIONARIO_INTEGRACION_FRONTEND.md)
- [REVISION_ARQUITECTURA_2026-07-16.md](REVISION_ARQUITECTURA_2026-07-16.md)
- Las cuentas y propiedades de esta guía.

El selector de mapa ya está conectado al formulario de creación. Debe tratar como tareas de la siguiente iteración: integrarlo también en edición, refinar filtros avanzados con URL/backend, subir imágenes realmente y añadir estados visuales completos para KYC/moderación.
