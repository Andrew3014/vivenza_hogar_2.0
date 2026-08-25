import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    ...props
}) {
    const baseStyles = 'font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-[#c9a961] hover:bg-[#d4af70] text-[#1a1a1a] focus:ring-[#c9a961]',
        secondary: 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#f5f5f5] focus:ring-[#6b8e7f]',
        danger: 'bg-[#7a2d2d] hover:bg-[#8f3d3d] text-white focus:ring-[#7a2d2d]',
        success: 'bg-[#6b8e7f] hover:bg-[#8fb89f] text-white focus:ring-[#6b8e7f]',
        outline: 'border-2 border-[#c9a961] text-[#c9a961] hover:bg-[#2a2a2a] focus:ring-[#c9a961]',
    };

    const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const variantStyle = variants[variant] || variants.primary;
    const sizeStyle = sizes[size] || sizes.md;

    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    return (
        <button
            disabled={disabled}
            className={`${baseStyles} ${variantStyle} ${sizeStyle} ${disabledStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
