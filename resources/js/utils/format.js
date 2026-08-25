// Formatear moneda (USD o BOB)
export const formatCurrency = (amount, currency = 'BOB') => {
    const code = currency?.toUpperCase() === 'USD' ? 'USD' : 'BOB';
    return new Intl.NumberFormat(code === 'USD' ? 'en-US' : 'es-BO', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Formatear números con separador de miles
export const formatNumber = (number) => {
    return new Intl.NumberFormat('es-BO').format(number);
};

// Formatear fecha
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-BO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Slugify
export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Generar color basado en string (para avatares)
export const getColorFromString = (str) => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

// Capitalizar primera letra
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Obtener iniciales
export const getInitials = (name) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};
