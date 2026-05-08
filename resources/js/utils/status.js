// Obtener clase de status de propiedad
export const getPropertyStatusClass = (status) => {
    const classes = {
        pendiente: 'bg-yellow-100 text-yellow-800',
        aprobado: 'bg-green-100 text-green-800',
        rechazado: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};

// Obtener etiqueta de status
export const getPropertyStatusLabel = (status) => {
    const labels = {
        pendiente: '⏳ Pendiente',
        aprobado: '✅ Aprobado',
        rechazado: '❌ Rechazado',
    };
    return labels[status] || status;
};

// Obtener clase de status de suscripción
export const getSubscriptionStatusClass = (status) => {
    const classes = {
        active: 'bg-green-100 text-green-800',
        expired: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};

// Obtener etiqueta de status
export const getSubscriptionStatusLabel = (status) => {
    const labels = {
        active: '✅ Activa',
        expired: '❌ Expirada',
        cancelled: '⊘ Cancelada',
    };
    return labels[status] || status;
};

// Obtener ícono de tipo de propiedad
export const getPropertyTypeIcon = (type) => {
    const icons = {
        venta: '🔨',
        alquiler: '🏠',
        casa: '🏡',
        apartamento: '🏢',
        terreno: '📍',
        comercial: '🏪',
    };
    return icons[type] || '🏠';
};

// Obtener clase de rol
export const getRoleClass = (role) => {
    const classes = {
        admin: 'bg-red-100 text-red-800',
        agente: 'bg-blue-100 text-blue-800',
        cliente: 'bg-green-100 text-green-800',
    };
    return classes[role] || 'bg-gray-100 text-gray-800';
};

// Obtener etiqueta de rol
export const getRoleLabel = (role) => {
    const labels = {
        admin: '🔐 Administrador',
        agente: '👨‍💼 Agente',
        cliente: '👤 Cliente',
    };
    return labels[role] || role;
};
