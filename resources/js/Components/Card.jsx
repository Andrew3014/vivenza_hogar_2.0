import React from 'react';

export default function Card({
    children,
    className = '',
    hover = false,
    border = true,
    shadow = true,
}) {
    const baseStyles = 'rounded-lg';
    const shadowStyle = shadow ? 'shadow-lg' : '';
    const borderStyle = border ? 'border border-gray-200' : '';
    const hoverStyle = hover ? 'hover:shadow-xl transition-shadow' : '';

    return (
        <div className={`bg-white ${baseStyles} ${shadowStyle} ${borderStyle} ${hoverStyle} ${className}`}>
            {children}
        </div>
    );
}
