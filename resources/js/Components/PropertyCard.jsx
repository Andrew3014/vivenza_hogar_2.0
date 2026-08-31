import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { formatCurrency, transactionTypeLabel } from '@/utils';

/**
 * PropertyCard - Componente Reutilizable para Mostrar Propiedades
 * 
 * Props:
 * - property: Objeto con datos de la propiedad
 * - variant: 'grid' | 'list' | 'featured' (por defecto: 'grid')
 * - showActions: boolean (mostrar botones de editar/eliminar)
 * - onDelete: función cuando se elimina
 * - className: clases adicionales
 */
export default function PropertyCard({ 
    property, 
    variant = 'grid',
    showActions = false,
    onDelete = null,
    className = ''
}) {
    const [imageError, setImageError] = useState(false);

    const imageUrl = property.primary_image?.url 
    || property.primaryImage?.url 
    || property.images?.[0]?.url 
    || property.images?.[0]?.image_url
    || '/placeholder.png';
    const transactionType = property.transaction_type || property.type;

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
            router.delete(route('properties.destroy', property.id), {
                onSuccess: () => {
                    if (onDelete) onDelete(property.id);
                }
            });
        }
    };

    const getStatusBadge = () => {
        const statusConfig = {
            pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
            aprobado: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
            rechazado: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' },
        };
        const config = statusConfig[property.status] || statusConfig.pendiente;
        return config;
    };

    // Grid View (por defecto)
    if (variant === 'grid' || variant === 'featured') {
        return (
            <Link
                href={route('properties.show', property.id)}
                className={`vz-property-card group ${variant === 'featured' ? 'ring-2 ring-amber-400' : ''} ${className}`}
            >
                {/* Image */}
                <div className="vz-property-image relative overflow-hidden">
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-700 to-gray-800">
                            📷
                        </div>
                    )}

                    {/* Featured Badge */}
                    {property.is_featured && (
                        <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <span aria-hidden="true">⭐</span>
                            <span>Destacado</span>
                        </div>
                    )}

                    {/* Status Badge */}
                    {showActions && (
                        <div className="absolute top-3 left-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge().bg} ${getStatusBadge().text}`}>
                                {getStatusBadge().icon}
                            </span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="w-full bg-white/90 backdrop-blur-sm text-gray-900 font-semibold py-2 px-4 rounded text-center text-sm transition-all duration-200">
                            Ver detalles →
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="vz-card-body p-4 bg-white dark:bg-gray-800">
                    {/* Title - con truncado y tooltip */}
                    <h3 className="vz-card-title font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 hover:text-amber-500 transition-colors group-hover:text-amber-500" title={property.title}>
                        {property.title}
                    </h3>

                    {/* Price */}
                    <div className="vz-card-price text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3">
                        {formatCurrency(property.price, property.currency)}
                        {transactionType === 'alquiler' && <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/mes</span>}
                        {transactionType === 'alquiler_diario' && <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/día</span>}
                    </div>

                    {/* Location */}
                    <p className="vz-card-subtitle text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1" title={`${property.location?.city}, ${property.location?.state}`}>
                        <span aria-hidden="true">📍</span>
                        <span className="truncate">{property.location?.city}, {property.location?.state}</span>
                    </p>

                    {/* Features - responsive */}
                    <div className="vz-card-specs flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        {property.bedrooms && (
                            <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                                <span aria-hidden="true">🛏️</span>
                                <span>{property.bedrooms}</span>
                            </span>
                        )}
                        {property.bathrooms && (
                            <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                                <span aria-hidden="true">🚿</span>
                                <span>{property.bathrooms}</span>
                            </span>
                        )}
                        {property.area && (
                            <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                                <span aria-hidden="true">📐</span>
                                <span>{property.area}m²</span>
                            </span>
                        )}
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center justify-between">
                        <span className="vz-badge-type inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {transactionTypeLabel(transactionType)}
                        </span>
                    </div>

                    {/* Actions - solo en variant featured o showActions */}
                    {showActions && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <Link
                                href={route('properties.show', property.id)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 rounded text-sm transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                👁️ Ver
                            </Link>
                            <Link
                                href={route('properties.edit', property.id)}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center font-bold py-2 rounded text-sm transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                ✏️ Editar
                            </Link>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center font-bold py-2 rounded text-sm transition-colors"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </Link>
        );
    }

    // List View
    if (variant === 'list') {
        return (
            <Link
                href={route('properties.show', property.id)}
                className={`vz-property-card-list bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition-shadow p-4 flex gap-4 ${className}`}
            >
                {/* Image */}
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-gradient-to-br from-gray-700 to-gray-800">📷</div>
                    )}
                    {property.is_featured && (
                        <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Destacado
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-amber-500 transition-colors" title={property.title}>
                            {property.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate" title={`${property.location?.city}, ${property.location?.state}`}>
                            📍 {property.location?.city}, {property.location?.state}
                        </p>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {property.bedrooms && <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded"><span>🛏️</span> {property.bedrooms} hab.</span>}
                        {property.bathrooms && <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded"><span>🚿</span> {property.bathrooms} baños</span>}
                        {property.area && <span className="flex items-center gap-1 whitespace-nowrap bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded"><span>📐</span> {property.area}m²</span>}
                        <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800">
                            {transactionTypeLabel(transactionType)}
                        </span>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end justify-between ml-4 min-w-[140px]">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {formatCurrency(property.price, property.currency)}
                        </div>
                        {transactionType === 'alquiler' && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">/mes</span>
                        )}
                        {transactionType === 'alquiler_diario' && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">/día</span>
                        )}
                    </div>
                    <span className="mt-3 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors w-full text-center">
                        Ver →
                    </span>
                </div>
            </Link>
        );
    }
}