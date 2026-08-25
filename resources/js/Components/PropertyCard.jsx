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

    const imageUrl = property.primary_image?.url || property.images?.[0]?.url || '/placeholder.png';
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
            <div className={`rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group ${className} ${
                variant === 'featured' ? 'ring-2 ring-blue-500' : ''
            }`}>
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-300 h-48">
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            📷
                        </div>
                    )}

                    {/* Featured Badge */}
                    {property.is_featured && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Destacado
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

                    {/* Hover Overlay with View Button */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                        <Link
                            href={route('properties.show', property.id)}
                            className="bg-white text-gray-900 font-bold py-2 px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Ver Detalle
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-white">
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                        <Link href={route('properties.show', property.id)}>
                            {property.title}
                        </Link>
                    </h3>

                    {/* Price */}
                    <div className="text-2xl font-bold text-blue-600 mb-3">
                        {formatCurrency(property.price, property.currency)}
                        {transactionType === 'alquiler' && <span className="text-sm text-gray-600">/mes</span>}
                        {transactionType === 'alquiler_diario' && <span className="text-sm text-gray-600">/día</span>}
                    </div>

                    {/* Location */}
                    <p className="text-sm text-gray-600 mb-3">
                        📍 {property.location?.city}, {property.location?.state}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                        {property.bedrooms && <span>🛏️ {property.bedrooms}</span>}
                        {property.bathrooms && <span>🚿 {property.bathrooms}</span>}
                        {property.area && <span>📐 {property.area}m²</span>}
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center justify-between">
                        <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                            {transactionTypeLabel(transactionType)}
                        </span>
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex gap-2 mt-4">
                            <Link
                                href={route('properties.show', property.id)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 rounded text-sm transition-colors"
                            >
                                👁️ Ver
                            </Link>
                            <Link
                                href={route('properties.edit', property.id)}
                                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-center font-bold py-2 rounded text-sm transition-colors"
                            >
                                ✏️ Editar
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-center font-bold py-2 rounded text-sm transition-colors"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // List View
    if (variant === 'list') {
        return (
            <div className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex gap-4 ${className}`}>
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-300">
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📷</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                            <Link href={route('properties.show', property.id)}>
                                {property.title}
                            </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            📍 {property.location?.city}, {property.location?.state}
                        </p>
                    </div>

                    {/* Details Row */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                        {property.bedrooms && <span>🛏️ {property.bedrooms} hab.</span>}
                        {property.bathrooms && <span>🚿 {property.bathrooms} baños</span>}
                        {property.area && <span>📐 {property.area}m²</span>}
                        <span>{transactionTypeLabel(transactionType)}</span>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(property.price, property.currency)}
                        </div>
                        {transactionType === 'alquiler' && (
                            <span className="text-xs text-gray-600">/mes</span>
                        )}
                        {transactionType === 'alquiler_diario' && (
                            <span className="text-xs text-gray-600">/día</span>
                        )}
                    </div>
                    <Link
                        href={route('properties.show', property.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                    >
                        Ver →
                    </Link>
                </div>
            </div>
        );
    }
}
