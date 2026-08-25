import React from 'react';

export default function Select({
    label,
    error,
    options = [],
    icon,
    className = '',
    required = false,
    placeholder,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {icon && <span className="mr-1">{icon}</span>}
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}
            
            <select
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500' : ''
                } ${className}`}
                required={required}
                {...props}
            >
                {placeholder && (
                    <option value="">
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-red-600 text-sm mt-1">
                    ✕ {error}
                </p>
            )}
        </div>
    );
}
