import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PropertyMap from '@/Components/Map/PropertyMap';
import { formatCurrency } from '@/utils';

/**
 * Página Principal - Listado de Propiedades
 * 
 * Props desde Laravel:
 * - properties: Array de propiedades aprobadas
 * - stats: Estadísticas del sitio
 * - auth: Información del usuario autenticado
 */
export default function Home({ properties = [] }) {
    const { auth } = usePage().props;

    const propertyList = Array.isArray(properties)
        ? properties
        : (properties && Array.isArray(properties.data) ? properties.data : []);

    const [filters, setFilters] = useState({
        type: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        search: '',
    });

    const [expandedFilters, setExpandedFilters] = useState(false);

    // Filtrar propiedades según los filtros
    const filteredProperties = propertyList.filter(property => {
        if (filters.type && property.type !== filters.type) return false;
        if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
        if (filters.bedrooms && property.bedrooms !== parseInt(filters.bedrooms)) return false;
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                property.title.toLowerCase().includes(searchLower) ||
                property.location?.city.toLowerCase().includes(searchLower) ||
                property.location?.name.toLowerCase().includes(searchLower) ||
                property.description?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyServerFilters = () => {
        router.get(route('properties.index'), {
            transaction_type: filters.type || undefined,
            min_price: filters.minPrice || undefined,
            max_price: filters.maxPrice || undefined,
            bedrooms: filters.bedrooms || undefined,
            search: filters.search || undefined,
        }, { preserveState: true, replace: true, preserveScroll: true });
    };

    // Contar filtros activos
    const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section with Title */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            🏠 Vivenza Inmobiliaria
                        </h1>
                        <p className="text-xl text-blue-100">
                            Encuentra tu próximo hogar o invierte con confianza
                        </p>
                    </div>
                </section>

                {/* Main Search Bar */}
                <section className="bg-gray-900 text-white py-4 sticky top-0 z-40 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row gap-3 items-center">
                            {/* Tipo Propiedad */}
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="px-3 py-2 rounded text-sm text-gray-900 bg-white"
                            >
                                <option value="">Comprar</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                                <option value="anticretico">Anticrético</option>
                                <option value="alquiler_diario">Alquiler diario</option>
                            </select>

                            {/* Búsqueda por dirección/ciudad/título */}
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Dirección, ciudad o propiedad..."
                                className="flex-1 px-4 py-2 rounded text-sm text-gray-900 bg-white border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
                            />

                            {/* Precio */}
                            <select
                                className="px-3 py-2 rounded text-sm text-gray-900 bg-white"
                                defaultValue="Precio"
                            >
                                <option disabled>Precio</option>
                                <option value="">Cualquier precio</option>
                                <option value="0-100000">Hasta 100k</option>
                                <option value="100000-500000">100k - 500k</option>
                                <option value="500000+">Más de 500k</option>
                            </select>

                            {/* Dormitorios */}
                            <select
                                name="bedrooms"
                                value={filters.bedrooms}
                                onChange={handleFilterChange}
                                className="px-3 py-2 rounded text-sm text-gray-900 bg-white"
                            >
                                <option value="">Dormitorios</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>

                            {/* Botón Buscar */}
                            <button type="button" onClick={applyServerFilters} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-sm">
                                🔍 Buscar
                            </button>
                        </div>
                    </div>
                </section>

                {/* Main Content with Sidebar */}
                <section className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:col-span-1">
                            {/* Search Summary Card */}
                            <div className="mb-8 p-4 bg-white rounded shadow">
                                <h3 className="font-bold text-gray-900 mb-3">Búsqueda Activa</h3>
                                <div className="space-y-2 text-sm">
                                    {activeFiltersCount === 0 ? (
                                        <p className="text-gray-600">Sin filtros aplicados</p>
                                    ) : (
                                        <>
                                            {filters.search && (
                                                <div>
                                                    <span className="text-gray-600">Búsqueda:</span>
                                                    <span className="font-semibold text-gray-900 ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                                        {filters.search}
                                                    </span>
                                                </div>
                                            )}
                                            {filters.type && (
                                                <div>
                                                    <span className="text-gray-600">Tipo:</span>
                                                    <span className="font-semibold text-gray-900 ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                                        {{ venta: 'Venta', alquiler: 'Alquiler', anticretico: 'Anticrético', alquiler_diario: 'Alquiler diario' }[filters.type] || filters.type}
                                                    </span>
                                                </div>
                                            )}
                                            {filters.bedrooms && (
                                                <div>
                                                    <span className="text-gray-600">Dormitorios:</span>
                                                    <span className="font-semibold text-gray-900 ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                                        {filters.bedrooms}+
                                                    </span>
                                                </div>
                                            )}
                                            {(filters.minPrice || filters.maxPrice) && (
                                                <div>
                                                    <span className="text-gray-600">Rango de precio:</span>
                                                    <span className="font-semibold text-gray-900 ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                                                        {filters.minPrice ? `$${filters.minPrice}` : '$0'} - {filters.maxPrice ? `$${filters.maxPrice}` : 'Sin límite'}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded">
                                    <p className="text-sm font-semibold text-blue-900">
                                        {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''} encontrada{filteredProperties.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6 bg-white p-4 rounded">
                                <h3 className="font-bold text-gray-900 mb-4">Precio</h3>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Precio mínimo"
                                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-gray-900 text-sm"
                                />
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                    placeholder="Precio máximo"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm"
                                />
                            </div>

                            {/* Property Type Filter */}
                            <div className="mb-6 bg-white p-4 rounded">
                                <h3 className="font-bold text-gray-900 mb-4">Tipo de Propiedad</h3>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="venta">Venta</option>
                                    <option value="alquiler">Alquiler</option>
                                    <option value="anticretico">Anticrético</option>
                                    <option value="alquiler_diario">Alquiler diario</option>
                                </select>
                            </div>

                            {/* Bedrooms Filter */}
                            <div className="mb-6 bg-white p-4 rounded">
                                <h3 className="font-bold text-gray-900 mb-4">Dormitorios</h3>
                                <select
                                    name="bedrooms"
                                    value={filters.bedrooms}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>

                            {/* More Filters Toggle */}
                            <div className="bg-white p-4 rounded">
                                <button
                                    onClick={() => setExpandedFilters(!expandedFilters)}
                                    className="w-full text-left font-bold text-gray-900 py-2"
                                >
                                    Más opciones
                                </button>
                                {expandedFilters && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600">Área mínima (m²)</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600">Año de construcción</label>
                                            <input
                                                type="number"
                                                placeholder="2020"
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm mt-1"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Clear Filters Button */}
                            <button
                                type="button"
                                onClick={applyServerFilters}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Aplicar filtros
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilters({ type: '', minPrice: '', maxPrice: '', bedrooms: '', search: '' })}
                                className="w-full mt-6 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded"
                            >
                                Limpiar todos los filtros
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Section Title and Description */}
                            <div className="mb-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                    Encuentra propiedades únicas
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Explora nuestro catálogo de propiedades diseñadas para elegancia y exclusividad.
                                </p>
                            </div>

                            {/* Map Section */}
                            {filteredProperties.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        📍 Ubicación de Propiedades
                                    </h3>
                                    <PropertyMap properties={filteredProperties} />
                                </div>
                            )}

                            {/* Results Count */}
                            <div className="mb-6 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Propiedades Disponibles
                                </h3>
                                <span className="text-gray-600 font-semibold">
                                    {filteredProperties.length} resultado{filteredProperties.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Properties Grid */}
                            {filteredProperties.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {filteredProperties.map((property) => (
                                        <div key={property.id} className="rounded overflow-hidden">
                                            {/* Image Container */}
                                            <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-5xl">📷</span>
                                                </div>

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="text-xs font-bold">
                                                        {{ venta: 'Venta', alquiler: 'Alquiler', anticretico: 'Anticrético', alquiler_diario: 'Alquiler diario' }[property.transaction_type || property.type] || property.type}
                                                    </span>
                                                </div>

                                                {property.is_featured && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="text-xs font-bold">
                                                            ⭐ Destacado
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 bg-white">
                                                {/* Location */}
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {property.location?.city}, {property.location?.state}
                                                </p>

                                                {/* Title */}
                                                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
                                                    {property.title}
                                                </h3>

                                                {/* Features */}
                                                <div className="flex gap-4 mb-3 text-sm text-gray-700">
                                                    {property.bedrooms && (
                                                        <span>{property.bedrooms} Hab.</span>
                                                    )}
                                                    {property.bathrooms && (
                                                        <span>{property.bathrooms} Baños</span>
                                                    )}
                                                    {property.area && (
                                                        <span>{property.area} m²</span>
                                                    )}
                                                </div>

                                                {/* Price and Button */}
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-gray-900">
                                                        {formatCurrency(property.price)}
                                                    </span>
                                                    <Link
                                                        href={route('properties.show', property.id)}
                                                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                                    >
                                                        Ver →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        No hay propiedades disponibles
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Intenta cambiar los filtros o vuelve más tarde
                                    </p>
                                    <button
                                        onClick={() => setFilters({ type: '', minPrice: '', maxPrice: '', bedrooms: '', search: '' })}
                                        className="text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}

                            {/* Statistics Section */}
                            {filteredProperties.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 px-6 bg-white rounded">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-900 mb-1">
                                            {filteredProperties.length}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Propiedades Encontradas
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-900 mb-1">
                                            {formatCurrency(Math.min(...filteredProperties.map(p => p.price)))}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Precio Menor
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-gray-900 mb-1">
                                            {formatCurrency(Math.max(...filteredProperties.map(p => p.price)))}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Precio Mayor
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Section */}
                            {filteredProperties.length > 0 && (
                                <div className="mt-8 py-12 px-6 bg-white rounded">
                                    <div className="flex gap-6">
                                        <div className="w-32 h-32 rounded overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                                <span className="text-4xl">🏡</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                Experiencia en propiedades
                                            </h3>
                                            <p className="text-gray-600">
                                                Explora propiedades excepcionales con elegancia y exclusividad. Te ayudamos a encontrar el hogar perfecto para ti.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth?.user && (
                    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-8">
                        <div className="max-w-4xl mx-auto px-4 text-center">
                            <h2 className="text-3xl font-bold mb-3">
                                ¿Eres agente inmobiliario?
                            </h2>
                            <p className="text-lg text-blue-100 mb-6">
                                Publica tus propiedades y llega a miles de clientes potenciales
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('plans.index')}
                                    className="bg-white text-blue-600 font-bold py-2 px-6 rounded"
                                >
                                    Ver Planes 📦
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-blue-700 text-white font-bold py-2 px-6 rounded hover:bg-blue-800"
                                >
                                    Registrarse Ahora
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
