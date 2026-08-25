// Catálogo único de planes para el frontend.
// Los ids coinciden con `subscriptions.plan` (basic, premium, enterprise).
export const plans = [
    {
        id: 'basic',
        name: 'Básico',
        price: 50,
        yearlyPrice: 500,
        max_properties: 5,
        can_featured: false,
        description: 'Perfecto para comenzar',
        highlighted: false,
        support: 'Email',
        statistics: null,
        features: [
            { name: 'Hasta 5 propiedades', included: true },
            { name: 'Publicación de propiedades', included: true },
            { name: 'Propiedades destacadas', included: false },
            { name: 'Soporte por email', included: true },
            { name: 'Estadísticas básicas', included: false },
            { name: 'App móvil', included: false },
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 150,
        yearlyPrice: 1500,
        max_properties: 20,
        can_featured: true,
        description: 'Para agentes inmobiliarios',
        highlighted: true,
        badge: 'Más Popular',
        support: 'Prioritario',
        statistics: 'Detalladas',
        features: [
            { name: 'Hasta 20 propiedades', included: true },
            { name: 'Publicación de propiedades', included: true },
            { name: 'Propiedades destacadas', included: true },
            { name: 'Soporte prioritario', included: true },
            { name: 'Estadísticas detalladas', included: true },
            { name: 'App móvil', included: false },
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 500,
        yearlyPrice: 5000,
        max_properties: 100,
        can_featured: true,
        description: 'Para agencias inmobiliarias',
        highlighted: false,
        support: '24/7',
        statistics: 'Avanzadas',
        features: [
            { name: 'Hasta 100 propiedades', included: true },
            { name: 'Publicación de propiedades', included: true },
            { name: 'Propiedades destacadas ilimitadas', included: true },
            { name: 'Soporte 24/7 telefónico', included: true },
            { name: 'Estadísticas avanzadas', included: true },
            { name: 'App Store iOS/Android', included: true },
        ],
    },
];

export const findPlan = (id) => plans.find((plan) => plan.id === id) || null;

// Nombre visible de un plan a partir del valor real en `subscriptions.plan`.
export const planName = (id) => findPlan(id)?.name || id;

// Precio mensual de un plan a partir del valor real en `subscriptions.plan`.
export const planPrice = (id) => findPlan(id)?.price || 0;
