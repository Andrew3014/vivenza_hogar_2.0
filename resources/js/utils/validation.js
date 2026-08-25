// Validar email
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validar teléfono
export const validatePhone = (phone) => {
    const regex = /^(\+591|0)?[1-9]\d{7,8}$/;
    return regex.test(phone.replace(/\D/g, ''));
};

// Validar URL
export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Validar precio
export const validatePrice = (price) => {
    return !isNaN(price) && parseFloat(price) > 0;
};

// Validar área
export const validateArea = (area) => {
    return !isNaN(area) && parseFloat(area) > 0;
};

// Validar contraseña (mínimo 8 caracteres)
export const validatePassword = (password) => {
    return password.length >= 8;
};

// Validar campo requerido
export const validateRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
};

// Obtener errores de validación
export const getValidationErrors = (data, validators) => {
    const errors = {};
    
    Object.keys(validators).forEach(field => {
        const validator = validators[field];
        const error = validator(data[field]);
        if (error) {
            errors[field] = error;
        }
    });

    return errors;
};
