import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PropertyMapDetail from '@/Components/Map/PropertyMapDetail';
import ContactAgentViaWhatsApp from '@/Components/WhatsApp/ContactAgentViaWhatsApp';
import FlashMessages from '@/Components/FlashMessages';
import { formatCurrency, transactionTypeLabel, buildWhatsAppPropertyMessage } from '@/utils';

function HomeIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20h14V9.5" />
            <path d="M9 20v-6h6v6" />
        </svg>
    );
}

function CameraIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2l1.2-1.8A1.6 1.6 0 0 1 11 3.5h2a1.6 1.6 0 0 1 1.3.7L15.5 6h2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" />
            <circle cx="12" cy="12.5" r="3.8" />
        </svg>
    );
}

function StarIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="m12 2.7 2.7 5.6 6.2.9-4.5 4.4 1.1 6.1L12 0 6.5 19.7l1.1-6.1L3.1 9.2l6.2-.9L12 2.7Z" />
        </svg>
    );
}

function ChevronLeftIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function PinIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function BedIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h16v6H4zm2-5h7a2 2 0 0 1 2 2v3H6V7Z" />
            <path d="M4 18v2M20 18v2" />
        </svg>
    );
}

function BathIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11h10a4 4 0 0 1 4 4v1H3v-1a4 4 0 0 1 4-4Z" />
            <path d="M9 11V8.8A2.8 2.8 0 0 1 11.8 6h.4A2.8 2.8 0 0 1 15 8.8V11" />
            <path d="M7 18h10" />
        </svg>
    );
}

function RulerIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 17.5V7.5A1.5 1.5 0 0 1 6.5 6h11A1.5 1.5 0 0 1 19 7.5v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5Z" />
            <path d="M8 9h8M8 12h8M8 15h6" />
        </svg>
    );
}

function ChairIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10h10v5H7zm2-5h6v5H9zM5 15v2M19 15v2M7 17h10" />
        </svg>
    );
}

function CarIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 16V9.5A2.5 2.5 0 0 1 7.5 7h9A2.5 2.5 0 0 1 19 9.5V16" />
            <path d="M3.5 16h17a1.5 1.5 0 0 1 1.5 1.5v.5H2v-.5A1.5 1.5 0 0 1 3.5 16Z" />
            <circle cx="7.5" cy="16.5" r="1.8" />
            <circle cx="16.5" cy="16.5" r="1.8" />
        </svg>
    );
}

function HeartIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.25c-5.25-3.56-8.75-6.77-8.75-11A4.75 4.75 0 0 1 8 4.5c1.6 0 3.09.76 4 2.02A4.95 4.95 0 0 1 16 4.5a4.75 4.75 0 0 1 4.75 4.75c0 4.23-3.5 7.44-8.75 11Z" />
        </svg>
    );
}

function PencilIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </svg>
    );
}

function TrashIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16" />
            <path d="M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
            <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7" />
        </svg>
    );
}

function ShareIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.2 11.2 7.4-4.8M8.2 12.8l7.4 4.8" />
        </svg>
    );
}

function CopyIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
    );
}

function MailIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
        </svg>
    );
}

function PhoneIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.6 19.6 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 2.8A2 2 0 0 1 9.5 8L8 9.5a16 16 0 0 0 6.5 6.5L15.9 14a2 2 0 0 1 1.5-.9l2.8-.5A2 2 0 0 1 22 16.9Z" />
        </svg>
    );
}

function ChatIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 18.5 3.5 20V6a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7Z" />
            <path d="M8 9h8M8 12h6" />
        </svg>
    );
}

/**
 * Página de Detalle de Propiedad
 * 
 * Props desde Laravel:
 * - property: Objeto con información completa de la propiedad
 * - auth: Usuario autenticado (si existe)
 * - similarProperties: Propiedades similares (opcional)
 */
export default function PropertyShow({ property, similarProperties = [], isFavorite = false }) {
    const { auth } = usePage().props;
    const [mainImage, setMainImage] = useState(0);
    const [imageZoom, setImageZoom] = useState(false);
    const [favorited, setFavorited] = useState(isFavorite);
    const [favoriteProcessing, setFavoriteProcessing] = useState(false);

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

    const toggleFavorite = () => {
        const routeName = favorited ? 'favorites.destroy' : 'favorites.store';
        const nextValue = !favorited;
        const options = {
            preserveScroll: true,
            onStart: () => setFavoriteProcessing(true),
            onSuccess: () => setFavorited(nextValue),
            onFinish: () => setFavoriteProcessing(false),
        };

        if (favorited) {
            router.delete(route(routeName, property.id), options);
        } else {
            router.post(route(routeName, property.id), {}, options);
        }
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            router.delete(route('properties.destroy', property.id));
        }
    };

    return (
        <AppLayout>
            <div className="vz-property-shell">
                <div className="vz-container">
                    <FlashMessages />

                    <div className="vz-property-breadcrumb">
                        <Link href={route('home')} className="vz-property-breadcrumb-link">
                            <HomeIcon className="vz-property-breadcrumb-icon" />
                            <span>Inicio</span>
                        </Link>
                        <span className="vz-property-breadcrumb-separator">/</span>
                        <Link href={route('home')} className="vz-property-breadcrumb-link">
                            Propiedades
                        </Link>
                        <span className="vz-property-breadcrumb-separator">/</span>
                        <span className="vz-property-breadcrumb-current">{property.title}</span>
                    </div>

                    <div className="vz-property-layout">
                        <main className="vz-property-main">
                            <div className="vz-property-gallery-card">
                                <div
                                    className="vz-property-main-image"
                                    onMouseEnter={() => setImageZoom(true)}
                                    onMouseLeave={() => setImageZoom(false)}
                                >
                                    {images[mainImage]?.url ? (
                                        <img
                                            src={images[mainImage].url}
                                            alt={images[mainImage].name || 'Propiedad'}
                                            className={imageZoom ? 'vz-property-image zoomed' : 'vz-property-image'}
                                        />
                                    ) : (
                                        <div className="vz-property-placeholder-box">
                                            <CameraIcon className="vz-property-placeholder-icon" />
                                            <p>Sin imagen disponible</p>
                                        </div>
                                    )}

                                    {property.is_featured && (
                                        <div className="vz-property-featured-tag">
                                            <StarIcon className="vz-property-featured-icon" />
                                            <span>Destacado</span>
                                        </div>
                                    )}

                                    {images.length > 1 && (
                                        <div className="vz-property-image-counter">
                                            {mainImage + 1} / {images.length}
                                        </div>
                                    )}

                                    {mainImage > 0 && (
                                        <button
                                            onClick={() => setMainImage(mainImage - 1)}
                                            className="vz-property-gallery-button left"
                                            aria-label="Imagen anterior"
                                        >
                                            <ChevronLeftIcon className="vz-property-gallery-icon" />
                                        </button>
                                    )}

                                    {mainImage < images.length - 1 && (
                                        <button
                                            onClick={() => setMainImage(mainImage + 1)}
                                            className="vz-property-gallery-button right"
                                            aria-label="Siguiente imagen"
                                        >
                                            <ChevronRightIcon className="vz-property-gallery-icon" />
                                        </button>
                                    )}
                                </div>

                                {images.length > 1 && (
                                    <div className="vz-property-thumbnails">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setMainImage(index)}
                                                className={mainImage === index ? 'vz-property-thumb active' : 'vz-property-thumb'}
                                            >
                                                {image?.url ? (
                                                    <img src={image.url} alt={`Imagen ${index + 1}`} />
                                                ) : (
                                                    <div className="vz-property-thumb-placeholder">
                                                        <CameraIcon className="vz-property-thumb-icon" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="vz-property-details-card">
                                <div className="vz-property-detail-header">
                                    <h1>{property.title}</h1>
                                    <div className="vz-property-location-row">
                                        <PinIcon className="vz-property-location-icon" />
                                        <span>{property.location?.name}</span>
                                        <span className="vz-property-location-dot">•</span>
                                        <span>{property.location?.city}, {property.location?.state}</span>
                                    </div>
                                </div>

                                <div className="vz-property-price-row">
                                    <div>
                                        <p className="vz-property-label">Precio</p>
                                        <p className="vz-property-price">{formatCurrency(property.price, property.currency)}</p>
                                        {property.transaction_type === 'alquiler' && (
                                            <p className="vz-property-price-note">por mes</p>
                                        )}
                                        {property.transaction_type === 'alquiler_diario' && (
                                            <p className="vz-property-price-note">por día</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="vz-property-label">Tipo</p>
                                        <p className="vz-property-type">{transactionTypeLabel(property.transaction_type)}</p>
                                    </div>
                                </div>

                                <div className="vz-property-feature-grid">
                                    {property.bedrooms && (
                                        <div className="vz-property-feature-item">
                                            <BedIcon className="vz-property-feature-icon" />
                                            <p className="vz-property-feature-value">{property.bedrooms}</p>
                                            <p className="vz-property-feature-label">Habitaciones</p>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="vz-property-feature-item">
                                            <BathIcon className="vz-property-feature-icon" />
                                            <p className="vz-property-feature-value">{property.bathrooms}</p>
                                            <p className="vz-property-feature-label">Baños</p>
                                        </div>
                                    )}
                                    {property.area && (
                                        <div className="vz-property-feature-item">
                                            <RulerIcon className="vz-property-feature-icon" />
                                            <p className="vz-property-feature-value">{property.area}</p>
                                            <p className="vz-property-feature-label">Metros²</p>
                                        </div>
                                    )}
                                    {['yes', 'partial'].includes(property.furnished) && (
                                        <div className="vz-property-feature-item">
                                            <ChairIcon className="vz-property-feature-icon" />
                                            <p className="vz-property-feature-value">{property.furnished === 'yes' ? 'Sí' : 'Parcial'}</p>
                                            <p className="vz-property-feature-label">Amueblado</p>
                                        </div>
                                    )}
                                    {property.parking_spaces && (
                                        <div className="vz-property-feature-item">
                                            <CarIcon className="vz-property-feature-icon" />
                                            <p className="vz-property-feature-value">{property.parking_spaces}</p>
                                            <p className="vz-property-feature-label">Estacionamientos</p>
                                        </div>
                                    )}
                                </div>

                                <div className="vz-property-section">
                                    <h2>Descripción</h2>
                                    <p>{property.description}</p>
                                </div>

                                <div className="vz-property-section">
                                    <h2>
                                        <PinIcon className="vz-property-section-icon" />
                                        <span>Ubicación</span>
                                    </h2>
                                    <PropertyMapDetail property={property} />
                                </div>

                                <div className="vz-property-extra-box">
                                    <h3>Características Adicionales</h3>
                                    <div className="vz-property-extra-grid">
                                        {property.parking_spaces && (
                                            <div>
                                                <p className="vz-property-extra-label">Estacionamientos</p>
                                                <p className="vz-property-extra-value">{property.parking_spaces}</p>
                                            </div>
                                        )}
                                        {property.furnished && (
                                            <div>
                                                <p className="vz-property-extra-label">Amueblado</p>
                                                <p className="vz-property-extra-value">
                                                    {property.furnished === 'yes'
                                                        ? 'Sí'
                                                        : property.furnished === 'partial'
                                                            ? 'Parcial'
                                                            : 'No'}
                                                </p>
                                            </div>
                                        )}
                                        {property.transaction_type === 'anticretico' && (
                                            <>
                                                <div>
                                                    <p className="vz-property-extra-label">DDRR registrada</p>
                                                    <p className="vz-property-extra-value">{property.anticretico_registered_ddrr ? 'Sí' : 'No'}</p>
                                                </div>
                                                {property.contract_duration_years && (
                                                    <div>
                                                        <p className="vz-property-extra-label">Duración del contrato</p>
                                                        <p className="vz-property-extra-value">{property.contract_duration_years} año(s)</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {property.transaction_type === 'alquiler_diario' && (
                                            <>
                                                {property.min_stay_days && (
                                                    <div>
                                                        <p className="vz-property-extra-label">Estadía mínima</p>
                                                        <p className="vz-property-extra-value">{property.min_stay_days} día(s)</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="vz-property-extra-label">Requiere garantía</p>
                                                    <p className="vz-property-extra-value">{property.requires_guarantee ? 'Sí' : 'No'}</p>
                                                </div>
                                                {property.requires_guarantee && property.guarantee_amount && (
                                                    <div>
                                                        <p className="vz-property-extra-label">Monto de garantía</p>
                                                        <p className="vz-property-extra-value">{formatCurrency(property.guarantee_amount, property.currency)}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {property.amenities?.length > 0 && (
                                            <div>
                                                <p className="vz-property-extra-label">Amenidades</p>
                                                <p className="vz-property-extra-value">{property.amenities.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </main>

                        <aside className="vz-property-sidebar">
                            <div className="vz-property-action-card">
                                {auth?.user ? (
                                    <button
                                        type="button"
                                        onClick={toggleFavorite}
                                        disabled={favoriteProcessing}
                                        className={favorited ? 'vz-property-btn favorite active' : 'vz-property-btn favorite'}
                                    >
                                        <HeartIcon className="vz-property-action-icon" />
                                        <span>{favoriteProcessing ? 'Guardando...' : favorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}</span>
                                    </button>
                                ) : (
                                    <Link href={route('login')} className="vz-property-btn primary">
                                        <HeartIcon className="vz-property-action-icon" />
                                        <span>Inicia sesión para guardar</span>
                                    </Link>
                                )}
                                <p className="vz-property-meta-text">{property.favorites_count || 0} persona(s) guardaron esta propiedad</p>
                            </div>

                            {!isOwner && auth?.user && (
                                <div className="vz-property-card-compact">
                                    <ContactAgentViaWhatsApp
                                        agent={property.user}
                                        currentUser={auth.user}
                                        propertyTitle={property.title}
                                        showFullCard={true}
                                    />
                                </div>
                            )}

                            {!isOwner && (
                                <div className="vz-property-agent-card">
                                    <h3>Información del Agente</h3>

                                    <div className="vz-property-agent-head">
                                        <div className="vz-property-agent-avatar">
                                            {property.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="vz-property-agent-name">{property.user?.name}</p>
                                            <p className="vz-property-agent-email">{property.user?.email}</p>
                                        </div>
                                    </div>

                                    {property.user?.phone && (
                                        <div className="vz-property-info-box">
                                            <p className="vz-property-info-label">Teléfono</p>
                                            <a href={`tel:${property.user.phone}`} className="vz-property-contact-link">
                                                <PhoneIcon className="vz-property-contact-icon" />
                                                <span>{property.user.phone}</span>
                                            </a>
                                        </div>
                                    )}

                                    {!auth?.user && (
                                        <button onClick={handleWhatsAppContact} className="vz-property-btn whatsapp">
                                            <ChatIcon className="vz-property-action-icon" />
                                            <span>Contactar por WhatsApp</span>
                                        </button>
                                    )}

                                    <a href={`mailto:${property.user?.email}?subject=Consulta sobre: ${property.title}`} className="vz-property-btn email">
                                        <MailIcon className="vz-property-action-icon" />
                                        <span>Enviar Email</span>
                                    </a>
                                </div>
                            )}

                            {isOwner && (
                                <div className="vz-property-owner-card">
                                    <h3>Tus Acciones</h3>
                                    <Link href={route('properties.edit', property.id)} className="vz-property-btn owner primary">
                                        <PencilIcon className="vz-property-action-icon" />
                                        <span>Editar Propiedad</span>
                                    </Link>
                                    <button onClick={handleDelete} className="vz-property-btn owner danger">
                                        <TrashIcon className="vz-property-action-icon" />
                                        <span>Eliminar Propiedad</span>
                                    </button>
                                </div>
                            )}

                            <div className="vz-property-agent-card share">
                                <h3>Compartir</h3>
                                <div className="vz-property-share-list">
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
                                        className="vz-property-btn share-btn"
                                    >
                                        <ShareIcon className="vz-property-action-icon" />
                                        <span>Compartir</span>
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                                        className="vz-property-btn secondary"
                                    >
                                        <CopyIcon className="vz-property-action-icon" />
                                        <span>Copiar Enlace</span>
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {similarProperties.length > 0 && (
                        <div className="vz-property-related-section">
                            <h2>Propiedades Similares</h2>
                            <div className="vz-property-related-grid">
                                {similarProperties.slice(0, 3).map(relProp => (
                                    <Link key={relProp.id} href={route('properties.show', relProp.id)} className="vz-property-related-card">
                                        <div className="vz-property-related-image">
                                            {relProp.primary_image?.url || relProp.images?.[0]?.url ? (
                                                <img src={relProp.primary_image?.url || relProp.images?.[0]?.url} alt={relProp.title} />
                                            ) : (
                                                <div className="vz-property-related-placeholder">
                                                    <CameraIcon className="vz-property-placeholder-icon" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="vz-property-related-body">
                                            <h3>{relProp.title}</h3>
                                            <p>{formatCurrency(relProp.price)}</p>
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
