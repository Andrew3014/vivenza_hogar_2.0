import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { formatCurrency } from '@/utils';
import FlashMessages from '@/Components/FlashMessages';
import PropertyLocationPicker from '@/Components/Map/PropertyLocationPicker';

/**
 * Formulario compartido de propiedad (crear y editar).
 *
 * Props:
 * - property: objeto de la propiedad (null en modo creación)
 * - locations: ubicaciones disponibles
 * - subscription: suscripción activa del usuario (puede ser null)
 *
 * En modo edición las imágenes existentes se pueden quitar con el botón ✕
 * (se envía remove_image_ids) y se pueden agregar nuevas en el mismo envío.
 */
export default function PropertyForm({ property = null, locations = [], subscription = null }) {
    const isEditing = Boolean(property);

    const defaults = {
        location_id: '',
        title: '',
        description: '',
        price: '',
        type: 'venta',
        currency: 'BOB',
        anticretico_registered_ddrr: false,
        contract_duration_years: '',
        min_stay_days: '',
        requires_guarantee: false,
        guarantee_amount: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        latitude: '',
        longitude: '',
        is_featured: false,
        parking_spaces: '',
        furnished: 'no',
        images: [],
        remove_image_ids: [],
    };

    const initial = property ? {
        location_id: property.location_id ?? '',
        title: property.title ?? '',
        description: property.description ?? '',
        price: property.price ?? '',
        type: property.transaction_type ?? property.type ?? 'venta',
        currency: property.currency ?? 'BOB',
        anticretico_registered_ddrr: Boolean(property.anticretico_registered_ddrr),
        contract_duration_years: property.contract_duration_years ?? '',
        min_stay_days: property.min_stay_days ?? '',
        requires_guarantee: Boolean(property.requires_guarantee),
        guarantee_amount: property.guarantee_amount ?? '',
        bedrooms: property.bedrooms ?? '',
        bathrooms: property.bathrooms ?? '',
        area: property.area ?? '',
        latitude: property.latitude ?? '',
        longitude: property.longitude ?? '',
        is_featured: Boolean(property.is_featured),
        parking_spaces: property.parking_spaces ?? '',
        furnished: property.furnished ?? 'no',
        images: [],
        remove_image_ids: [],
    } : defaults;

    const [imagePreview, setImagePreview] = useState([]);

    const { data, setData, post, patch, processing, errors } = useForm(initial);

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('properties.update', property.id));
        } else {
            post(route('properties.store'));
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreview(previews);
        setData('images', files);
    };

    const toggleRemove = (imageId) => {
        const current = data.remove_image_ids;
        setData(
            'remove_image_ids',
            current.includes(imageId) ? current.filter(id => id !== imageId) : [...current, imageId]
        );
    };

    const existingImages = isEditing && Array.isArray(property.images) ? property.images : [];

    return (
        <div className="min-h-screen bg-gray-50 py-8 text-gray-900">
            <div className="max-w-5xl mx-auto px-4">
                <FlashMessages />

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{isEditing ? '✏️' : '📝'}</span>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {isEditing ? 'Editar Propiedad' : 'Publicar Nueva Propiedad'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {isEditing
                                    ? 'Actualiza los datos y las imágenes de tu publicación.'
                                    : `Tienes ${subscription?.properties_left ?? 0} propiedad(es) disponible(s)`}
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
                                    onChange={(e) => {
                                        const selected = locations.find((location) => String(location.id) === e.target.value);
                                        setData('location_id', e.target.value);
                                        if (selected?.latitude && selected?.longitude) {
                                            setData('latitude', selected.latitude);
                                            setData('longitude', selected.longitude);
                                        }
                                    }}
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

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    📍 Ubicación exacta en el mapa
                                </label>
                                <PropertyLocationPicker
                                    value={{ latitude: data.latitude, longitude: data.longitude }}
                                    onChange={({ latitude, longitude }) => {
                                        setData('latitude', latitude);
                                        setData('longitude', longitude);
                                    }}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Haz clic o arrastra el marcador. Se guardan las coordenadas exactas de la publicación.
                                </p>
                                {errors.latitude && <p className="text-red-600 text-sm mt-2">{errors.latitude}</p>}
                                {errors.longitude && <p className="text-red-600 text-sm mt-2">{errors.longitude}</p>}
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
                                        <option value="anticretico">Anticrético</option>
                                        <option value="alquiler_diario">Alquiler diario</option>
                                    </select>
                                    {errors.type && (
                                        <p className="text-red-600 text-sm mt-2">📌 {errors.type}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Precio ({data.currency}) <span className="text-red-500">*</span>
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
                                            💰 {formatCurrency(data.price, data.currency)}
                                        </p>
                                    )}
                                    {errors.price && (
                                        <p className="text-red-600 text-sm mt-2">📌 {errors.price}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Moneda</label>
                                <select
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                                    disabled={processing}
                                >
                                    <option value="BOB">Bolivianos (BOB)</option>
                                    <option value="USD">Dólares (USD)</option>
                                </select>
                            </div>

                            {data.type === 'anticretico' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg bg-amber-50 p-4">
                                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                        <input type="checkbox" checked={data.anticretico_registered_ddrr} onChange={(e) => setData('anticretico_registered_ddrr', e.target.checked)} />
                                        Documentación DDRR registrada
                                    </label>
                                    <input type="number" min="1" max="10" value={data.contract_duration_years} onChange={(e) => setData('contract_duration_years', e.target.value)} placeholder="Duración (años)" className="rounded border p-3" />
                                </div>
                            )}

                            {data.type === 'alquiler_diario' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-lg bg-sky-50 p-4">
                                    <input type="number" min="1" max="365" value={data.min_stay_days} onChange={(e) => setData('min_stay_days', e.target.value)} placeholder="Mínimo de noches" className="rounded border p-3" />
                                    <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                                        <input type="checkbox" checked={data.requires_guarantee} onChange={(e) => setData('requires_guarantee', e.target.checked)} />
                                        Requiere garantía
                                    </label>
                                    {data.requires_guarantee && <input type="number" min="0" value={data.guarantee_amount} onChange={(e) => setData('guarantee_amount', e.target.value)} placeholder="Monto de garantía" className="rounded border p-3" />}
                                </div>
                            )}

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

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    🚗 Estacionamientos
                                </label>
                                <input
                                    type="text"
                                    value={data.parking_spaces}
                                    onChange={(e) => setData('parking_spaces', e.target.value)}
                                    placeholder="Ej: 2, o Garaje privado"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={processing}
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.furnished === 'yes'}
                                    onChange={(e) => setData('furnished', e.target.checked ? 'yes' : 'no')}
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

                        {/* Imágenes existentes (solo edición) */}
                        {existingImages.length > 0 && (
                            <div className="mb-8">
                                <p className="font-semibold text-gray-900 mb-4">
                                    Imágenes actuales — marca ✕ para quitar
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {existingImages.map((image) => {
                                        const marked = data.remove_image_ids.includes(image.id);
                                        return (
                                            <div key={image.id} className={`relative group rounded-lg overflow-hidden bg-gray-100 ${marked ? 'opacity-40' : ''}`}>
                                                <img
                                                    src={image.url || image.image_url}
                                                    alt={image.name || image.alt_text || 'Propiedad'}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRemove(image.id)}
                                                        className={`px-3 py-1 rounded ${marked ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                                    >
                                                        {marked ? '↩ Restaurar' : '✕ Quitar'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {data.remove_image_ids.length > 0 && (
                                    <p className="text-red-600 text-sm mt-3">
                                        {data.remove_image_ids.length} imagen(es) se eliminarán al guardar.
                                    </p>
                                )}
                            </div>
                        )}

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
                                    {existingImages.length > 0 ? 'Agregar más imágenes' : 'Sube imágenes de tu propiedad'}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Arrastra y suelta o haz clic para seleccionar (máx. 5MB por imagen, hasta 8 en total)
                                </p>
                            </label>
                        </div>

                        {/* Previews de nuevas imágenes */}
                        {imagePreview.length > 0 && (
                            <div className="mt-6">
                                <p className="font-semibold text-gray-900 mb-4">
                                    {imagePreview.length} imagen(es) nueva(s) seleccionada(s)
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
                            {processing
                                ? '⏳ Guardando...'
                                : isEditing
                                    ? '💾 Guardar Cambios'
                                    : '✅ Publicar Propiedad'}
                        </button>
                        <Link
                            href={isEditing ? route('properties.show', property.id) : route('home')}
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
    );
}
