// Construir URL de WhatsApp
export const buildWhatsAppUrl = (message, phoneNumber = '59169422021') => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

// Construir mensaje para WhatsApp de propiedades
export const buildWhatsAppPropertyMessage = (property, userName) => {
    return `Hola! 👋\n\nMe interesa la siguiente propiedad:\n\n📍 ${property.title}\n💰 ${property.price.toLocaleString()} BOB\n📐 ${property.area}m²\n🏘️ ${property.location?.city}\n\nMi nombre es ${userName}.\n\n¿Puedes brindarme más información?`;
};

// Construir mensaje de consulta general
export const buildWhatsAppMessage = (type, data = {}) => {
    const messages = {
        subscription: `Hola! 👋 Me interesa contratar un plan de suscripción. ¿Cuáles son las opciones disponibles?`,
        support: `Hola! 👋 Necesito soporte técnico. ${data.issue || ''}`,
        inquiry: `Hola! 👋 Tengo una consulta sobre una propiedad. ${data.description || ''}`,
    };

    return messages[type] || messages.support;
};

// Obtener enlace de teléfono
export const getPhoneLink = (phone) => {
    return `tel:${phone}`;
};

// Obtener enlace de email
export const getEmailLink = (email, subject = '', body = '') => {
    return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
};
