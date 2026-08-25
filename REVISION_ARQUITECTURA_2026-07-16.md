# Revisión de arquitectura — 16 de julio de 2026

## Conclusión

La base ya soporta el contexto boliviano y tiene tres roles operativos. La separación recomendada queda así:

1. `cliente`: comprador, arrendatario o cliente/vendedor que publica.
2. `agente`: soporte operativo, atención de consultas y revisión manual de verificaciones.
3. `admin`: gobierno total y creación de cuentas internas.

No conviene crear un cuarto rol para “vendedor”: es una capacidad del cliente, no una responsabilidad administrativa distinta. Si en el futuro una inmobiliaria necesita equipos, se puede agregar `agency_id` y una tabla de membresías sin romper `users.role`.

## Correcciones aplicadas

- Cliente y agente pueden crear y administrar sus propias publicaciones; antes solo podía publicar `agente`.
- Las operaciones de agente quedaron separadas de las rutas de publicación para que el cliente no vea verificaciones, suscripciones globales ni mensajes internos.
- Verificaciones aprobadas/rechazadas ahora sincronizan el estado de cuenta (`is_account_verified`, `account_verified_at`).
- Agente y administrador pueden resolver verificaciones; la acción ya no depende de una policy inexistente.
- El administrador tiene endpoints para crear/editar usuarios, corregir publicaciones y cambiar su estado editorial.
- Se eliminaron endpoints públicos de diagnóstico que exponían usuarios y datos internos.
- Se centralizaron roles y tipos de transacción en `app/Support`, evitando repetir literales en middleware y controladores.
- Se agregó `DICCIONARIO_INTEGRACION_FRONTEND.md` como contrato para el trabajo de React.

## Riesgos que deben resolverse antes de producción

- Configurar políticas explícitas para propiedad/usuario y pruebas de autorización; no confiar solo en que una ruta esté oculta en la UI.
- Cambiar documentos KYC de URLs públicas a almacenamiento privado con URLs temporales y políticas de retención.
- Registrar auditoría (`actor`, acción, entidad, valores anteriores/nuevos, IP) para verificaciones, suspensiones y moderación.
- Sustituir el ingreso simulado de `monthly_revenue` por pagos conciliados y una tabla de transacciones.
- Agregar índices compuestos para catálogo (`status`, `transaction_type`, `location_id`, `created_at`) cuando el volumen lo justifique.
- Añadir pruebas Feature para cada rol y cada transición de estado antes de conectar pagos o despliegue.

## Evolución recomendada sin romper la base

Mantener `users` como identidad y agregar tablas nuevas para capacidades que crecerán: `agencies`, `agency_members`, `audit_logs`, `property_reports`, `payments` y `notifications`. Las nuevas capacidades deben relacionarse por `user_id` y no convertir `role` en una lista de permisos.

La siguiente fase debería ser seguridad y pruebas; después pagos, notificaciones y búsqueda avanzada. La interfaz puede avanzar en paralelo usando el diccionario de integración.
