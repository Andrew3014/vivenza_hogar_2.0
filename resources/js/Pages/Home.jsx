import React, { useState, useMemo } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

import AppLayout from '@/Layouts/AppLayout';
import PropertyMap from '@/Components/Map/PropertyMap';
import FlashMessages from '@/Components/FlashMessages';
import { formatCurrency, transactionTypeLabel } from '@/utils';

function HouseIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1v-8.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function KeyIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <circle cx="8" cy="15" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M11 15h8.5v2.5M16 15v3M18.5 15V8.8A2.8 2.8 0 0 0 15.7 6H12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function CalendarIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
    );
}

function DocumentIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path d="M8 4.5h6.5L18.5 9v10.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.5 4.5V9h4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function SearchIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
            <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
    );
}

function BedIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path d="M4 12h16v6H4zm2-5h7a2 2 0 0 1 2 2v3H6V7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 18v2M20 18v2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
    );
}

function BathIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path d="M7 11h10a4 4 0 0 1 4 4v1H3v-1a4 4 0 0 1 4-4Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11V8.8A2.8 2.8 0 0 1 11.8 6h.4A2.8 2.8 0 0 1 15 8.8V11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 18h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
    );
}

function RulerIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
            <path d="M5 17.5V7.5A1.5 1.5 0 0 1 6.5 6h11A1.5 1.5 0 0 1 19 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5Z" fill="none" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M8 9h8M8 12h8M8 15h6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
    );
}

/**
 * Página principal.
 *
 * Props desde Laravel (PropertyController::index):
 * - properties: paginador con las publicaciones aprobadas
 * - locations: lista de ubicaciones
 * - filters: filtros aplicados en el servidor (type, transaction_type,
 *   min_price, max_price, featured, bedrooms, min_area, max_area, search)
 */
export default function Home({ properties = [], filters = {} }) {
    const { auth } = usePage().props;

    const propertyList = Array.isArray(properties)
        ? properties
        : properties?.data ?? [];

    const pagination = Array.isArray(properties)
        ? null
        : {
              current_page: properties?.current_page,
              last_page: properties?.last_page,
              prev_page_url: properties?.prev_page_url,
              next_page_url: properties?.next_page_url,
          };

    // Categoría activa desde la URL (para resaltar la tarjeta seleccionada)
    const activeCategory = useMemo(() => filters.transaction_type || filters.type || '', [filters]);

    // Estado inicial sincronizado con los filtros que ya aplicó el servidor.
    const [filtersState, setFiltersState] = useState({
        type: activeCategory,
        minPrice: filters.min_price || '',
        maxPrice: filters.max_price || '',
        bedrooms: filters.bedrooms || '',
        search: filters.search || '',
        minArea: filters.min_area || '',
        maxArea: filters.max_area || '',
        featured: filters.featured || false,
    });

    const [expandedFilters, setExpandedFilters] = useState(false);

    const handleFilterChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFiltersState({
            ...filtersState,
            [e.target.name]: value,
        });
    };

    const applyServerFilters = () => {
        router.get(
            route('properties.index'),
            {
                transaction_type: filtersState.type || undefined,
                min_price: filtersState.minPrice || undefined,
                max_price: filtersState.maxPrice || undefined,
                bedrooms: filtersState.bedrooms || undefined,
                min_area: filtersState.minArea || undefined,
                max_area: filtersState.maxArea || undefined,
                featured: filtersState.featured ? 1 : undefined,
                search: filtersState.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setFiltersState({
            type: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            search: '',
            minArea: '',
            maxArea: '',
            featured: false,
        });
        router.get(
            route('properties.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <AppLayout>
            <div>
                <div className="vz-container pt-6">
                    <FlashMessages />
                </div>

                {/* ================= CATEGORÍAS INMOBILIARIAS ================= */}
                <section className="vz-category-section">
                    <div className="vz-container">
                        <div className="vz-category-grid">
                            <Link
                                href={route('properties.index', { transaction_type: 'venta' })}
                                className={`vz-category-card vz-cat-venta ${activeCategory === 'venta' ? 'vz-cat-active' : ''}`}
                            >
                                <div className="vz-category-icon"><HouseIcon className="vz-category-svg" /></div>
                                <h3>Venta</h3>
                                <p>Compra casas, departamentos y terrenos.</p>
                            </Link>

                            <Link
                                href={route('properties.index', { transaction_type: 'alquiler' })}
                                className={`vz-category-card vz-cat-alquiler ${activeCategory === 'alquiler' ? 'vz-cat-active' : ''}`}
                            >
                                <div className="vz-category-icon"><KeyIcon className="vz-category-svg" /></div>
                                <h3>Alquiler</h3>
                                <p>Encuentra tu próximo hogar temporal.</p>
                            </Link>

                            <Link
                                href={route('properties.index', { transaction_type: 'alquiler_diario' })}
                                className={`vz-category-card vz-cat-diario ${activeCategory === 'alquiler_diario' ? 'vz-cat-active' : ''}`}
                            >
                                <div className="vz-category-icon"><CalendarIcon className="vz-category-svg" /></div>
                                <h3>Alquiler por días</h3>
                                <p>Alojamientos para vacaciones y viajes.</p>
                            </Link>

                            <Link
                                href={route('properties.index', { transaction_type: 'anticretico' })}
                                className={`vz-category-card vz-cat-anticretico ${activeCategory === 'anticretico' ? 'vz-cat-active' : ''}`}
                            >
                                <div className="vz-category-icon"><DocumentIcon className="vz-category-svg" /></div>
                                <h3>Anticrético</h3>
                                <p>Contratos inmobiliarios a largo plazo.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ================= HERO ================= */}
                <section className="vz-hero">
                    <div className="vz-container vz-hero-inner">
                        <div className="vz-hero-copy">
                            <span className="vz-hero-label">Propiedades elegidas para vivir mejor</span>
                            <h1 className="vz-hero-title">
                                <span className="vz-hero-mark"><HouseIcon className="vz-hero-svg" /></span>
                                Vivenza Inmobiliaria
                            </h1>
                            <p>Encuentra tu próximo hogar, invierte con confianza y descubre oportunidades inmobiliarias en Bolivia.</p>

                            <div className="vz-hero-actions">
                                <Link href={route('properties.index')} className="vz-btn-primary vz-hero-cta">
                                    Ver propiedades
                                </Link>
                                <Link href={route('plans.index')} className="vz-btn-secondary vz-hero-cta secondary">
                                    Ver planes
                                </Link>
                            </div>

                            <div className="vz-hero-stats">
                                <div className="vz-hero-stat">
                                    <strong>250+</strong>
                                    <span>propiedades</span>
                                </div>
                                <div className="vz-hero-stat">
                                    <strong>12 años</strong>
                                    <span>de experiencia</span>
                                </div>
                                <div className="vz-hero-stat">
                                    <strong>24/7</strong>
                                    <span>soporte</span>
                                </div>
                            </div>
                        </div>

                        <div className="vz-hero-panel">
                            <div className="vz-panel-card bottom">
                                <span className="vz-panel-kicker">Asesoría</span>
                                <h3>Compra o alquiler</h3>
                                <p>Guiado por especialistas del sector.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= BUSCADOR ================= */}
                <section className="vz-search">
                    <div className="vz-container">
                        <div className="grid md:grid-cols-4 gap-4">
                            <select
                                name="type"
                                value={filtersState.type}
                                onChange={handleFilterChange}
                                className="vz-input"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="venta">Venta</option>
                                <option value="alquiler">Alquiler</option>
                                <option value="anticretico">Anticrético</option>
                                <option value="alquiler_diario">Alquiler por días</option>
                            </select>

                            <input
                                type="text"
                                name="search"
                                value={filtersState.search}
                                onChange={handleFilterChange}
                                placeholder="Buscar ciudad, dirección o propiedad"
                                className="vz-input"
                            />

                            <select
                                name="bedrooms"
                                value={filtersState.bedrooms}
                                onChange={handleFilterChange}
                                className="vz-input"
                            >
                                <option value="">Dormitorios</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>

                            <button onClick={applyServerFilters} className="vz-btn-success">
                                <span className="vz-inline-icon-group">
                                    <SearchIcon className="vz-inline-icon" />
                                    <span>Buscar</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* ================= CONTENIDO ================= */}
                <section className="vz-container py-10">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* ================= SIDEBAR ================= */}
                        <aside>
                            <div className="vz-sidebar">
                                <h3 className="font-bold text-xl mb-5">Filtros</h3>

                                <label>Precio mínimo</label>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filtersState.minPrice}
                                    onChange={handleFilterChange}
                                    className="vz-input mb-3"
                                />

                                <label>Precio máximo</label>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filtersState.maxPrice}
                                    onChange={handleFilterChange}
                                    className="vz-input mb-4"
                                />

                                <h4 className="font-bold mt-5 mb-2">Tipo</h4>
                                <select
                                    name="type"
                                    value={filtersState.type}
                                    onChange={handleFilterChange}
                                    className="vz-input"
                                >
                                    <option value="">Todos</option>
                                    <option value="venta">Venta</option>
                                    <option value="alquiler">Alquiler</option>
                                    <option value="anticretico">Anticrético</option>
                                    <option value="alquiler_diario">Alquiler por días</option>
                                </select>

                                <button
                                    onClick={() => setExpandedFilters(!expandedFilters)}
                                    className="mt-5 font-bold"
                                >
                                    Más opciones ▼
                                </button>

                                {expandedFilters && (
                                    <div className="mt-4 space-y-3">
                                        <label>Área mínima (m²)</label>
                                        <input
                                            type="number"
                                            name="minArea"
                                            value={filtersState.minArea}
                                            onChange={handleFilterChange}
                                            className="vz-input"
                                        />

                                        <label>Área máxima (m²)</label>
                                        <input
                                            type="number"
                                            name="maxArea"
                                            value={filtersState.maxArea}
                                            onChange={handleFilterChange}
                                            className="vz-input"
                                        />

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={filtersState.featured}
                                                onChange={handleFilterChange}
                                                className="w-4 h-4"
                                            />
                                            Solo destacadas
                                        </label>
                                    </div>
                                )}

                                <button
                                    onClick={applyServerFilters}
                                    className="vz-btn-success w-full mt-5"
                                >
                                    Aplicar filtros
                                </button>

                                <button
                                    onClick={clearFilters}
                                    className="w-full mt-3 bg-gray-300 p-3 rounded"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </aside>

                        {/* ================= LISTADO ================= */}
                        <main className="lg:col-span-3">
                            <h2 className="text-3xl font-bold mb-6">Propiedades disponibles</h2>

                            {propertyList.length > 0 && (
                                <PropertyMap properties={propertyList} />
                            )}

                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-5">
                                    Resultados: {propertyList.length}
                                </h3>

                                <div className="vz-property-grid">
                                    {propertyList.map((property) => (
                                        <div key={property.id} className="vz-card">
                                            <div className="vz-property-image">
                                                {property.primary_image?.url || property.images?.[0]?.url ? (
                                                    <img
                                                        src={property.primary_image?.url || property.images?.[0]?.url}
                                                        alt={property.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="vz-property-placeholder">
                                                        <HouseIcon className="vz-property-placeholder-icon" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="vz-card-body">
                                                <p className="text-gray-500 text-sm mb-2">
                                                    {property.location?.city || 'Ubicación no disponible'}
                                                </p>

                                                <h3 className="font-bold text-xl mb-3">{property.title}</h3>

                                                <div className="flex gap-4 text-sm mb-4 vz-property-stats">
                                                    {property.bedrooms && (
                                                        <span className="vz-stat-item">
                                                            <BedIcon className="vz-stat-icon" />
                                                            <span>{property.bedrooms} Hab.</span>
                                                        </span>
                                                    )}
                                                    {property.bathrooms && (
                                                        <span className="vz-stat-item">
                                                            <BathIcon className="vz-stat-icon" />
                                                            <span>{property.bathrooms} Baños</span>
                                                        </span>
                                                    )}
                                                    {property.area && (
                                                        <span className="vz-stat-item">
                                                            <RulerIcon className="vz-stat-icon" />
                                                            <span>{property.area} m²</span>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <strong className="text-xl">
                                                            {formatCurrency(property.price, property.currency)}
                                                        </strong>
                                                        {property.transaction_type === 'alquiler' && (
                                                            <span className="text-xs text-gray-500"> /mes</span>
                                                        )}
                                                        {property.transaction_type === 'alquiler_diario' && (
                                                            <span className="text-xs text-gray-500"> /día</span>
                                                        )}
                                                    </div>

                                                    <Link
                                                        href={route('properties.show', property.id)}
                                                        className="vz-property-link"
                                                    >
                                                        Ver
                                                    </Link>
                                                </div>

                                                <p className="mt-3 text-xs text-gray-600">
                                                    {transactionTypeLabel(property.transaction_type)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Paginación */}
                                {pagination && pagination.last_page > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-10">
                                        {pagination.prev_page_url ? (
                                            <Link
                                                href={pagination.prev_page_url}
                                                className="vz-pagination-link"
                                            >
                                                Anterior
                                            </Link>
                                        ) : (
                                            <span className="px-4 py-2 text-gray-400">← Anterior</span>
                                        )}
                                        <span className="text-sm text-gray-600">
                                            Página {pagination.current_page} de {pagination.last_page}
                                        </span>
                                        {pagination.next_page_url ? (
                                            <Link
                                                href={pagination.next_page_url}
                                                className="vz-pagination-link"
                                            >
                                                Siguiente
                                            </Link>
                                        ) : (
                                            <span className="px-4 py-2 text-gray-400">Siguiente →</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </section>

                {/* ================= ESTADISTICAS ================= */}
                {propertyList.length > 0 && (
                    <section className="vz-container py-10">
                        <div className="vz-card">
                            <div className="vz-card-body grid md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <h3 className="text-3xl font-bold">{propertyList.length}</h3>
                                    <p>Propiedades encontradas</p>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold">
                                        {formatCurrency(
                                            Math.min(...propertyList.map((p) => p.price)),
                                            propertyList[0]?.currency
                                        )}
                                    </h3>
                                    <p>Precio menor</p>
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold">
                                        {formatCurrency(
                                            Math.max(...propertyList.map((p) => p.price)),
                                            propertyList[0]?.currency
                                        )}
                                    </h3>
                                    <p>Precio mayor</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ================= CTA ================= */}
                {!auth?.user && (
                    <section className="vz-hero">
                        <div className="vz-container text-center">
                            <h2 className="text-3xl font-bold mb-4">¿Eres agente inmobiliario?</h2>
                            <p className="mb-6">Publica tus propiedades y llega a más clientes.</p>

                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('plans.index')}
                                    className="vz-btn-secondary"
                                >
                                    Ver planes
                                </Link>

                                <Link href={route('register')} className="vz-btn-primary">
                                    Registrarse
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}
