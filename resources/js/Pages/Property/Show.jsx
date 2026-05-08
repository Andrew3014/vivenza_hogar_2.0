import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PropertyMapDetail from '@/Components/Map/PropertyMapDetail';
import { formatCurrency, buildWhatsAppPropertyMessage } from '@/utils';

/**
 * Página de Detalle de Propiedad
 * 
 * Props desde Laravel:
 * - property: Objeto con información completa de la propiedad
 * - auth: Usuario autenticado (si existe)
 * - relatedProperties: Propiedades similares (opcional)
 */
export default function PropertyShow({ property, relatedProperties = [] }) {
    const { auth } = usePage().props;
    const [mainImage, setMainImage] = useState(0);
    const [imageZoom, setImageZoom] = useState(false);

    // Validar si el usuario es el propietario
    const isOwner = auth?.user?.id === property.user_id;

    // Obtener galería de imágenes
    const images = property.images?.length > 0 
        ? property.images 
        : [{ url: null, name: 'Imagen por defecto' }];

    // Construir mensaje de WhatsApp
    const handleWhatsAppContact = () => {
        const message = buildWhatsAppPropertyMessage(property, auth?.user?.name || 'Cliente');
        window.location.href = `https://wa.me/59169422021?text=${encodeURIComponent(message)}`;
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                        <Link href={route('home')} className="text-blue-600 hover:text-blue-700">
                            Inicio
                        </Link>
                        <span>/</span>
                        <Link href={route('home')} className="text-blue-600 hover:text-blue-700">
                            Propiedades
                        </Link>
                        <span>/</span>
                        <span className="font-semibold text-gray-900">{property.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Image Gallery */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                                {/* Main Image */}
                                <div
                                    className="relative bg-gray-200 aspect-video flex items-center justify-center overflow-hidden cursor-zoom-in"
                                    onMouseEnter={() => setImageZoom(true)}
                                    onMouseLeave={() => setImageZoom(false)}
                                >
                                    {images[mainImage]?.url ? (
                                        <img
                                            src={images[mainImage].url}
                                            alt={images[mainImage].name || 'Propiedad'}
                                            className={`w-full h-full object-cover transition-transform duration-300 ${
                                                imageZoom ? 'scale-110' : 'scale-100'
                                            }`}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-8xl">📷</span>
                                            <p className="mt-4 text-xl text-gray-500">Sin imagen disponible</p>
                                        </div>
                                    )}

                                    {/* Featured Badge */}
                                    {property.is_featured && (
                                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg">
                                            ⭐ Destacado
                                        </div>
                                    )}

                                    {/* Image Counter */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {mainImage + 1} / {images.length}
                                        </div>
                                    )}

                                    {/* Previous Button */}
                                    {mainImage > 0 && (
                                        <button
                                            onClick={() => setMainImage(mainImage - 1)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                                        >
                                            ‹
                                        </button>
                                    )}

                                    {/* Next Button */}
                                    {mainImage < images.length - 1 && (
                                        <button
                                            onClick={() => setMainImage(mainImage + 1)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                                        >
                                            ›
                                        </button>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {images.length > 1 && (
                                    <div className="p-4 bg-gray-100 flex gap-4 overflow-x-auto">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setMainImage(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                    mainImage === index
                                                        ? 'border-blue-600 ring-2 ring-blue-400'
                                                        : 'border-gray-300 hover:border-blue-400'
                                                }`}
                                            >
                                                {image?.url ? (
                                                    <img
                                                        src={image.url}
                                                        alt={`Imagen ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-2xl">
                                                        📷
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Property Details */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                {/* Header */}
                                <div className="mb-8 pb-8 border-b border-gray-200">
                                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                        {property.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-lg text-gray-600">
                                        <span>📍</span>
                                        <span>{property.location?.name}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>{property.location?.city}, {property.location?.state}</span>
                                    </div>
                                </div>

                                {/* Price & Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-2">Precio</p>
                                        <p className="text-4xl font-bold text-blue-600">
                                            {formatCurrency(property.price)}
                                        </p>
                                        {property.type === 'alquiler' && (
                                            <p className="text-gray-600 text-sm mt-2">por mes</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm font-semibold mb-2">Tipo</p>
                                        <p className="text-3xl font-bold">
                                            {property.type === 'venta' ? '🔨 Venta' : '🏠 Alquiler'}
                                        </p>
                                    </div>
                                </div>

                                {/* Property Features Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-8">
                                    {property.bedrooms && (
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🛏️</div>
                                            <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                                            <p className="text-sm text-gray-600">Habitaciones</p>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🚿</div>
                                            <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                                            <p className="text-sm text-gray-600">Baños</p>
                                        </div>
                                    )}
                                    {property.area && (
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">📐</div>
                                            <p className="text-2xl font-bold text-gray-900">{property.area}</p>
                                            <p className="text-sm text-gray-600">Metros²</p>
                                        </div>
                                    )}
                                    {property.is_furnished && (
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">🪑</div>
                                            <p className="text-2xl font-bold text-gray-900">Sí</p>
                                            <p className="text-sm text-gray-600">Amueblado</p>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Descripción
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                        {property.description}
                                    </p>
                                </div>

                                {/* Location Map */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        📍 Ubicación
                                    </h2>
                                    <PropertyMapDetail property={property} />
                                </div>

                                {/* Additional Details */}
                                {(property.year_built || property.parking || property.security) && (
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                                            Características Adicionales
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {property.year_built && (
                                                <div>
                                                    <p className="text-gray-600 font-semibold">Año de Construcción</p>
                                                    <p className="text-lg text-gray-900">{property.year_built}</p>
                                                </div>
                                            )}
                                            {property.parking && (
                                                <div>
                                                    <p className="text-gray-600 font-semibold">Estacionamientos</p>
                                                    <p className="text-lg text-gray-900">{property.parking}</p>
                                                </div>
                                            )}
                                            {property.security && (
                                                <div>
                                                    <p className="text-gray-600 font-semibold">Seguridad</p>
                                                    <p className="text-lg text-gray-900">✅ {property.security}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Agent Card */}
                            {!isOwner && (
                                <div className="bg-white rounded-lg shadow-lg p-8 mb-8 sticky top-4">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        Información del Agente
                                    </h3>

                                    {/* Agent Avatar */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {property.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{property.user?.name}</p>
                                            <p className="text-sm text-gray-600">{property.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    {property.user?.phone && (
                                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                                            <a href={`tel:${property.user.phone}`} className="text-lg font-semibold text-blue-600 hover:text-blue-700">
                                                {property.user.phone}
                                            </a>
                                        </div>
                                    )}

                                    {/* WhatsApp Button */}
                                    <button
                                        onClick={handleWhatsAppContact}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg mb-4 flex items-center justify-center gap-2 text-lg"
                                    >
                                        <span>💬</span>
                                        Contactar por WhatsApp
                                    </button>

                                    {/* Email Button */}
                                    <a
                                        href={`mailto:${property.user?.email}?subject=Consulta sobre: ${property.title}`}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center block mb-4"
                                    >
                                        📧 Enviar Email
                                    </a>

                                    {/* Also show auth check */}
                                    {!auth?.user && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                                            <p className="text-sm text-yellow-900">
                                                <strong>Nota:</strong> Inicia sesión para guardar en favoritos
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Owner View Card */}
                            {isOwner && (
                                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-8 mb-8">
                                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                                        Tus Acciones
                                    </h3>
                                    <Link
                                        href={route('properties.edit', property.id)}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center mb-3"
                                    >
                                        ✏️ Editar Propiedad
                                    </Link>
                                    <button
                                        className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
                                    >
                                        🗑️ Eliminar Propiedad
                                    </button>
                                </div>
                            )}

                            {/* Share Card */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    Compartir
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: property.title,
                                                    text: `${property.title} - ${formatCurrency(property.price)}`,
                                                    url: window.location.href,
                                                });
                                            }
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        📱 Compartir
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        📋 Copiar Enlace
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Properties */}
                    {relatedProperties.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Propiedades Similares
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedProperties.slice(0, 3).map(relProp => (
                                    <Link
                                        key={relProp.id}
                                        href={route('properties.show', relProp.id)}
                                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                                    >
                                        <div className="bg-gray-300 h-48 flex items-center justify-center">
                                            <span className="text-5xl">📷</span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                                {relProp.title}
                                            </h3>
                                            <p className="text-xl font-bold text-blue-600">
                                                {formatCurrency(relProp.price)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
