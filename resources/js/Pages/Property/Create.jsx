import React, { useState } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatCurrency } from '@/utils';

/**
 * Página para Crear/Publicar Nueva Propiedad
 * 
 * Props desde Laravel:
 * - locations: Array de ubicaciones disponibles
 * - subscription: Info de suscripción del usuario actual (con can_featured, properties_left, etc)
 */
export default function PropertyCreate({ locations = [], subscription }) {
    const { auth } = usePage().props;
    const [imagePreview, setImagePreview] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        location_id: '',
        title: '',
        description: '',
        price: '',
        type: 'venta',
        bedrooms: '',
        bathrooms: '',
        area: '',
        is_featured: false,
        year_built: '',
        parking: '',
        security: '',
        is_furnished: false,
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('properties.store'));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
        setData('images', files);
    };

    // Sin suscripción activa
    if (!subscription) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center py-8">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-12 text-center">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Suscripción Requerida
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Necesitas una suscripción activa para publicar propiedades y acceder a todas nuestras herramientas.
                        </p>
                        <Link
                            href={route('plans.index')}
                            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all"
                        >
                            Ver Planes de Suscripción
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Suscripción activa pero sin propiedades disponibles
    if (subscription.properties_left <= 0) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center py-8">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-12 text-center">
                        <div className="text-6xl mb-6">📦</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Límite Alcanzado
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Has alcanzado el límite de propiedades para tu plan actual.
                        </p>
                        <p className="text-gray-600 mb-8">
                            Plan: <strong>{subscription.plan_name}</strong> ({subscription.properties_available} propiedades)
                        </p>
                        <Link
                            href={route('plans.index')}
                            className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all"
                        >
                            Mejorar Plan
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-4xl">📝</span>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Publicar Nueva Propiedad
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Tienes <strong className="text-blue-600">{subscription.properties_left}</strong> propiedad(es) disponible(s)
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Step 1: Información Básica */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                📍 Información Básica
                            </h2>

                            <div className="space-y-6">
                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        📍 Ubicación <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.location_id}
                                        onChange={(e) => setData('location_id', e.target.value)}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                            errors.location_id
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        disabled={processing}
                                    >
                                        <option value="">Selecciona una ubicación</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name} • {loc.city}, {loc.state}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.location_id && (
                                        <p className="text-red-600 text-sm mt-2">📌 {errors.location_id}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Título <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Ej: Casa moderna con jardín en Zona Sur"
                                        maxLength="100"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                            errors.title
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        disabled={processing}
                                    />
                                    <p className="text-gray-500 text-xs mt-2">
                                        {data.title.length}/100 caracteres
                                    </p>
                                    {errors.title && (
                                        <p className="text-red-600 text-sm mt-2">📌 {errors.title}</p>
                                    )}
                                </div>

                                {/* Type & Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Tipo de Operación <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.type
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            disabled={processing}
                                        >
                                            <option value="venta">🔨 Venta</option>
                                            <option value="alquiler">🏠 Alquiler</option>
                                        </select>
                                        {errors.type && (
                                            <p className="text-red-600 text-sm mt-2">📌 {errors.type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Precio (BOB) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="150000"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.price
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            disabled={processing}
                                        />
                                        {data.price && (
                                            <p className="text-blue-600 text-sm mt-2">
                                                💰 {formatCurrency(data.price)}
                                            </p>
                                        )}
                                        {errors.price && (
                                            <p className="text-red-600 text-sm mt-2">📌 {errors.price}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Descripción <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe tu propiedad en detalle. Incluye características especiales, amenidades, etc."
                                        maxLength="1000"
                                        rows="6"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                                            errors.description
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        disabled={processing}
                                    />
                                    <p className="text-gray-500 text-xs mt-2">
                                        {data.description.length}/1000 caracteres
                                    </p>
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-2">📌 {errors.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Características de la Propiedad */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                🏠 Características de la Propiedad
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {/* Bedrooms */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        🛏️ Habitaciones
                                    </label>
                                    <input
                                        type="number"
                                        value={data.bedrooms}
                                        onChange={(e) => setData('bedrooms', e.target.value)}
                                        placeholder="3"
                                        min="0"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Bathrooms */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        🚿 Baños
                                    </label>
                                    <input
                                        type="number"
                                        value={data.bathrooms}
                                        onChange={(e) => setData('bathrooms', e.target.value)}
                                        placeholder="2"
                                        min="0"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Area */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        📐 Área (m²)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.area}
                                        onChange={(e) => setData('area', e.target.value)}
                                        placeholder="250"
                                        min="0"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Year Built */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        📅 Año de Construcción
                                    </label>
                                    <input
                                        type="number"
                                        value={data.year_built}
                                        onChange={(e) => setData('year_built', e.target.value)}
                                        placeholder="2023"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Parking */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        🚗 Estacionamientos
                                    </label>
                                    <input
                                        type="number"
                                        value={data.parking}
                                        onChange={(e) => setData('parking', e.target.value)}
                                        placeholder="2"
                                        min="0"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Security */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        🔒 Seguridad
                                    </label>
                                    <input
                                        type="text"
                                        value={data.security}
                                        onChange={(e) => setData('security', e.target.value)}
                                        placeholder="Ej: 24/7, Guardianía"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_furnished}
                                        onChange={(e) => setData('is_furnished', e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        disabled={processing}
                                    />
                                    <span className="text-gray-700 font-medium">🪑 Propiedad amueblada</span>
                                </label>

                                {subscription?.can_featured && (
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="w-5 h-5 text-yellow-500 rounded focus:ring-2 focus:ring-yellow-400"
                                            disabled={processing}
                                        />
                                        <span className="text-gray-700 font-medium">⭐ Destacar esta propiedad</span>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            Premium
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Step 3: Galería de Imágenes */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                📸 Galería de Imágenes
                            </h2>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="image-input"
                                    disabled={processing}
                                />
                                <label htmlFor="image-input" className="cursor-pointer">
                                    <div className="text-5xl mb-4">📷</div>
                                    <p className="text-lg font-semibold text-gray-900 mb-1">
                                        Sube imágenes de tu propiedad
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Arrastra y suelta o haz clic para seleccionar (máx. 5MB por imagen)
                                    </p>
                                </label>
                            </div>

                            {/* Image Previews */}
                            {imagePreview.length > 0 && (
                                <div className="mt-6">
                                    <p className="font-semibold text-gray-900 mb-4">
                                        {imagePreview.length} imagen(es) seleccionada(s)
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {imagePreview.map((preview, idx) => (
                                            <div key={idx} className="relative group rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${idx + 1}`}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newPreviews = imagePreview.filter((_, i) => i !== idx);
                                                            setImagePreview(newPreviews);
                                                            const newFiles = data.images.filter((_, i) => i !== idx);
                                                            setData('images', newFiles);
                                                        }}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                            >
                                {processing ? '⏳ Publicando...' : '✅ Publicar Propiedad'}
                            </button>
                            <Link
                                href={route('home')}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-4 px-6 rounded-lg transition-all text-center text-lg"
                            >
                                ❌ Cancelar
                            </Link>
                        </div>
                    </form>

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
                        <h3 className="font-bold text-blue-900 mb-2">💡 Consejos para una buena descripción</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>✓ Sé específico sobre las características de la propiedad</li>
                            <li>✓ Menciona extras como piscina, jardín, garaje, etc.</li>
                            <li>✓ Incluye información sobre el barrio y proximidad a servicios</li>
                            <li>✓ Sube fotos de buena calidad desde diferentes ángulos</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
