// Nombres y metadatos de los tipos de operación (`transaction_type`).
export const transactionTypes = {
    venta: { label: 'Venta', icon: '🔨' },
    alquiler: { label: 'Alquiler', icon: '🏠' },
    anticretico: { label: 'Anticrético', icon: '📄' },
    alquiler_diario: { label: 'Alquiler por días', icon: '🏨' },
};

export const transactionTypeLabel = (type) => {
    const meta = transactionTypes[type];
    return meta ? `${meta.icon} ${meta.label}` : (type || 'Sin tipo');
};
