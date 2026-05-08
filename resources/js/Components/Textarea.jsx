import React from 'react';

export default function Textarea({
    label,
    error,
    icon,
    rows = 4,
    className = '',
    required = false,
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
            
            <textarea
                rows={rows}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${
                    error ? 'border-red-500' : ''
                } ${className}`}
                required={required}
                {...props}
            />

            {error && (
                <p className="text-red-600 text-sm mt-1">
                    ✕ {error}
                </p>
            )}
        </div>
    );
}
