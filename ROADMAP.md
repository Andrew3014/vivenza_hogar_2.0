# 🚀 ROADMAP DE DESARROLLO - Vivenza Hogar 2.0

> **Próximas mejoras y funcionalidades** (Excluye diseño frontend - cargo del compañero)

---

## 📊 Resumen del Proyecto Actual

**Status:** ✅ Plataforma funcional en desarrollo
**Base de Datos:** 100% MySQL 8.4+
**Stack:** Laravel 11 + React 18 + Vite + Tailwind CSS
**Versión:** v1.0.0 (Producción Ready)

---

## 🎯 PRÓXIMAS MEJORAS (Priorizado)

### **FASE 0: ESTRUCTURA SEGURA Y BASE ACTUAL**
**Prioridad:** 🔴 CRÍTICA | **Estimado:** 1-2 días

**Objetivo:** dejar el proyecto sólido antes de tocar la interfaz o extender negocio.

**Tareas:**
- [ ] Verificar `.env`, MySQL y migraciones en local
- [ ] Alinear modelos con columnas reales de la base
- [ ] Definir estados y tipos como constantes o enums centralizados
- [ ] Separar lo que ya funciona de lo que sigue pendiente
- [ ] Agregar seeders mínimos para pruebas locales

**Resultado esperado:**
- Arranque predecible en una máquina nueva
- Menos desalineación entre migraciones, modelos y UI
- Base lista para ampliar KYC, propiedades y notificaciones sin romper lo existente

### **FASE 1: BACKEND & CORE (Semanas 1-3)**

#### 1.1 Sistema de Verificación ✅ COMPLETADO
- ✅ Captura de cámara (documento + selfie)
- ✅ Almacenamiento de fotos en storage público
- ✅ Panel de agentes para revisar verificaciones
- ✅ Estados: pendiente, aprobado, rechazado
- **Status:** 100% listo para usar

#### 1.2 Notificaciones en Tiempo Real (SIGUIENTE)
**Prioridad:** 🔴 ALTA | **Estimado:** 1 semana

**Tareas:**
- [ ] Implementar Laravel Broadcasting (Pusher o Ably)
- [ ] Crear sistema de notificaciones por email
- [ ] Notificación cuando agente recibe consulta
- [ ] Notificación cuando cuenta es verificada
- [ ] Notificación cuando propiedad es aprobada
- [ ] Real-time badge counter en UI

**Archivos a crear:**
```
app/Events/PropertyInquiryCreated.php
app/Events/VerificationApproved.php
app/Events/PropertyApproved.php
app/Notifications/InquiryReceivedNotification.php
database/migrations/*_create_notifications_table.php
```

**Endpoints:**
- `POST /notifications/mark-read/{id}`
- `DELETE /notifications/{id}`
- `GET /api/notifications`

**Estado actual del repo:**
- La tabla `notifications` ya existe.
- Falta el modelo, los eventos y los disparadores de negocio.

---

#### 1.3 Sistema de Mensajería Mejorado
**Prioridad:** 🟡 MEDIA | **Estimado:** 1.5 semanas

**Tareas:**
- [ ] Crear tabla `messages` con conversaciones
- [ ] Chat en tiempo real entre usuarios
- [ ] Historial de mensajes
- [ ] Estado de lectura (read/unread)
- [ ] Búsqueda de conversaciones
- [ ] Marcar como spam/bloquear usuario

**Estructura:**
```php
// Database
conversations: id, user1_id, user2_id, created_at
messages: id, conversation_id, sender_id, content, read_at
```

**Componentes React:**
```
Pages/Chat/Index.jsx          // Lista de conversaciones
Pages/Chat/Conversation.jsx   // Conversación abierta
Components/MessageInput.jsx   // Input con envío
```

---

#### 1.4 Sistema de Pagos y Suscripciones Mejorado
**Prioridad:** 🔴 ALTA | **Estimado:** 2 semanas

**Tareas:**
- [ ] Integración con Stripe o PayU
- [ ] Planes automáticos renovables
- [ ] Cancelación de suscripción
- [ ] Historial de pagos
- [ ] Facturación automática
- [ ] Reembolsos y créditos

**Endpoints:**
```
POST /api/subscriptions/checkout
POST /api/subscriptions/cancel
POST /api/webhooks/stripe
GET /api/invoices
```

**Modelos:**
```php
Payment - id, user_id, amount, status, stripe_id
Invoice - id, user_id, pdf_path, amount
```

---

### **FASE 2: ADMIN PANEL (Semanas 4-5)**

#### 2.1 Dashboard Administrativo Completo
**Prioridad:** 🟡 MEDIA | **Estimado:** 1.5 semanas

**Tareas:**
- [ ] Estadísticas globales (usuarios, propiedades, ingresos)
- [ ] Gráficos de crecimiento mensual
- [ ] Top agentes por propiedades vendidas
- [ ] Gestión de usuarios (ban, editar, borrar)
- [ ] Visualización de reportes

**Páginas:**
```
Pages/Admin/Dashboard.jsx      // Panel principal
Pages/Admin/Users.jsx          // Gestión usuarios
Pages/Admin/Properties.jsx     // Gestión propiedades
Pages/Admin/Analytics.jsx      // Reportes y gráficos
```

#### 2.2 Moderación de Contenido
**Prioridad:** 🟡 MEDIA | **Estimado:** 1 semana

**Tareas:**
- [ ] Aprobar/rechazar propiedades con razón
- [ ] Borrar propiedades inapropiadas
- [ ] Sistema de reportes de usuarios
- [ ] Log de acciones administrativas
- [ ] Auditoría de cambios

---

### **FASE 3: BÚSQUEDA AVANZADA (Semanas 6-7)**

#### 3.1 Filtros Inteligentes
**Prioridad:** 🟡 MEDIA | **Estimado:** 1 semana

**Tareas:**
- [ ] Búsqueda geoespacial (radio en km)
- [ ] Filtros por año construcción
- [ ] Filtros por amenidades (piscina, garaje, etc)
- [ ] Rango de precios dinámico
- [ ] Búsqueda por nombre de vecindario
- [ ] Guardar búsquedas favoritas

**Backend:**
```php
// Scope en Property model
->whereBetweenGeoDistance('lat', 'lng', $lat, $lng, $radius)
->whereHas('amenities', function($q) { ... })
```

#### 3.2 Motor de Recomendaciones
**Prioridad:** 🟢 BAJA | **Estimado:** 1.5 semanas

**Tareas:**
- [ ] Propiedades similares basadas en búsqueda
- [ ] Recomendaciones personalizadas
- [ ] Historial de búsquedas
- [ ] Alertas de nuevas propiedades

---

### **FASE 4: MOBILE & PERFORMANCE (Semanas 8-10)**

#### 4.1 Optimización de Performance
**Prioridad:** 🔴 ALTA | **Estimado:** 1 semana

**Tareas:**
- [ ] Lazy loading de imágenes
- [ ] Compresión de imágenes (WebP)
- [ ] Caché de queries (Redis)
- [ ] Paginación en listados
- [ ] Code splitting en React
- [ ] Service Workers para PWA

**Packages:**
```bash
npm install sharp                 # Compresión imágenes
npm install workbox-webpack       # PWA
```

#### 4.2 App Móvil (React Native o Flutter)
**Prioridad:** 🟢 BAJA | **Estimado:** 3+ semanas

**Tareas:**
- [ ] Setup React Native
- [ ] Autenticación
- [ ] Listado de propiedades
- [ ] Búsqueda con mapas
- [ ] Push notifications

---

### **FASE 5: INTEGRACIONES (Semanas 11-12)**

#### 5.1 Mapas Avanzados
**Prioridad:** 🟡 MEDIA | **Estimado:** 1 semana

**Tareas:**
- [ ] Cluster de marcadores
- [ ] Rutas (Google Maps Directions API)
- [ ] Calor map de precios
- [ ] Street View integrado
- [ ] Tiempo de viaje a puntos de interés

#### 5.2 APIs Externas
**Prioridad:** 🟢 BAJA | **Estimado:** 1 semana

**Integraciones:**
- [ ] Weather API (clima de zona)
- [ ] Crime data API (seguridad)
- [ ] School/Hospital API (servicios cercanos)
- [ ] Zillow/Trulia para valuación

---

## 📋 BACKLOG ADICIONAL

### Gobierno por Rol
- **Administrador:** control total de usuarios, publicaciones, suscripciones, reportes, moderación, configuración general, auditoría y soporte operativo.
- **Agente:** revisión y verificación de usuarios, validación de documentos, aprobación o rechazo de verificaciones, seguimiento de cuentas y apoyo en incidencias.
- **Cliente / Vendedor:** publicación de propiedades, edición, consultas, notificaciones y seguimiento de su plan.

### Recomendación para publicaciones de planes altos
- No conviene fijarlas siempre de forma manual en primer lugar.
- Mejor usar un ranking dinámico con esta prioridad:
   1. Plan activo más alto: `enterprise` > `premium` > `basic`
   2. Publicaciones destacadas (`is_featured`)
   3. Publicaciones con mejor rendimiento: vistas, consultas y favoritos
   4. Fecha de publicación reciente
- Así la publicación premium sigue arriba de forma estable, pero el listado sigue pareciendo natural y justo.
- Si quieres máxima visibilidad comercial, combina `featured_until` con el ranking, no solo un pin fijo.

### Funcionalidades Importantes
- [ ] Two-factor authentication (2FA)
- [ ] Dark mode
- [ ] Exportar propiedades a PDF
- [ ] Compartir propiedades por email
- [ ] Video tours (hosting de videos)
- [ ] Virtual tours (360°)
- [ ] Documentos legales (contratos)
- [ ] Historial de precios

### Estructura Bolivia primero
- [ ] Expandir `properties` para `anticretico` y `alquiler_diario`
- [ ] Agregar campos legales para anticrético: DDRR, duración contractual
- [ ] Agregar campos operativos para alquiler diario: mínimo de noches, garantía
- [ ] Unificar el flujo KYC con CI, selfies y estado de verificación
- [ ] Separar claramente `venta`, `anticretico`, `alquiler` y `alquiler_diario` en UI y backend

### Mejoras de Seguridad
- [ ] Rate limiting en APIs
- [ ] CORS mejorado
- [ ] Validación de imágenes (virus scan)
- [ ] Encriptación de datos sensibles
- [ ] Audit logging completo

### Ideas extra que sí aportan valor
- [ ] Bandeja de notificaciones por tipo: cuenta, publicación, plan, soporte y verificación
- [ ] Alertas automáticas cuando falten datos obligatorios en una publicación
- [ ] Mensajes al usuario cuando su verificación fue rechazada con motivo claro
- [ ] Historial de cambios de estado de la cuenta y de cada publicación
- [ ] Exportación CSV/PDF para admin de usuarios, propiedades y verificaciones

### DevOps & Deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Automated backups
- [ ] Disaster recovery plan
- [ ] Monitoring (Sentry, NewRelic)

---

## 🔧 TECH DEBT & MANTENIMIENTO

### Prioritario (Próximas 2 semanas)
1. **Agregar tests unitarios** (Jest + PHPUnit)
   - Tests para modelos
   - Tests para controladores
   - Tests de integración
2. **Code documentation** (PHPDoc + JSDoc)
3. **Performance profiling** (Laravel Debugbar)

### Medio Plazo (Próximas 4 semanas)
1. **Refactoring de componentes** (atomicidad)
2. **Standardizar estructura de carpetas**
3. **Actualizar dependencies**
4. **Mejorar manejo de errores**

---

## 📅 TIMELINE ESTIMADO

```
MAYO 2026:
├─ Semana 1-2: Notificaciones en tiempo real
├─ Semana 3-4: Sistema de pagos
└─ Semana 5: Admin panel básico

JUNIO 2026:
├─ Semana 1-2: Búsqueda avanzada
├─ Semana 3-4: Optimización performance
└─ Semana 5: PWA y offline mode

JULIO 2026:
├─ Semana 1-2: Mobile app (React Native)
├─ Semana 3: Integraciones externas
└─ Semana 4: Testing y QA

AGOSTO 2026:
├─ Semana 1-2: Refinamiento y bugs
├─ Semana 3: Deployment a producción
└─ Semana 4: Monitoreo y optimización
```

---

## 🎯 MÉTRICAS DE ÉXITO

**User Engagement:**
- ✅ Tasa de conversión > 5%
- ✅ Promedio 10+ propiedades por agente
- ✅ Retención de 70% mensual

**Performance:**
- ✅ Carga < 2 segundos
- ✅ Lighthouse score > 90
- ✅ 99.9% uptime

**Business:**
- ✅ 500+ propiedades en catálogo (mes 1)
- ✅ 50+ agentes activos (mes 2)
- ✅ 100 consultas/día (mes 3)

---

## 👥 RESPONSABILIDADES

| Rol | Tareas |
|-----|--------|
| **Backend Dev** | APIs, bases de datos, lógica |
| **Frontend Dev** | UI, componentes, diseño (compañero) |
| **DevOps** | Despliegue, monitoreo, infraestructura |
| **QA/Testing** | Tests, reportes de bugs |
| **Product Manager** | Prioridades, timeline, stakeholders |

---

## 📞 CONTACTO & ISSUES

**Reportar bugs:** GitHub Issues
**Sugerencias:** Discusiones en GitHub
**Urgencias:** Contactar a Andrew (andrew3014)

---

**Última actualización:** 26 de Mayo de 2026
**Próxima revisión:** 9 de Junio de 2026
