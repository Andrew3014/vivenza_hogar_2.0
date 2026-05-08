import React from 'react';

export default function Alert({
    children,
    type = 'info',
    title = '',
    dismissible = true,
    onDismiss = null,
}) {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    const types = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: 'ℹ️',
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: '✅',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: '⚠️',
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: '❌',
        },
    };

    const style = types[type] || types.info;

    return (
        <div className={`${style.bg} border ${style.border} rounded-lg p-4 mb-4`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <span className="text-xl">{style.icon}</span>
                    <div>
                        {title && <h4 className={`font-bold ${style.text}`}>{title}</h4>}
                        <p className={style.text}>{children}</p>
                    </div>
                </div>
                {dismissible && (
                    <button
                        onClick={handleDismiss}
                        className={`text-lg hover:opacity-70 transition-opacity ${style.text}`}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
