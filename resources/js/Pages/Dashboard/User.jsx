import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import AppLayout from '@/Layouts/AppLayout';
import { formatCurrency } from '@/utils';

function WelcomeIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M5 11.5 12 5l7 6.5V18a1 1 0 0 1-1 1h-4v-6H10v6H6a1 1 0 0 1-1-1v-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SubscriptionIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M5 8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5v7A2.5 2.5 0 0 1 16.5 18h-9A2.5 2.5 0 0 1 5 15.5v-7Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 10h8M8 13h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    );
}

function PropertyIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M4 11.5 12 5l8 6.5V18a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PendingIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7.5v5l3.5 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlusIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function EyeIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function PencilIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M4 16.5v3.5h3.5L17 7.4 13.6 4 4 13.6V16.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="m13.6 4 3.4 3.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    );
}

function TrashIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M5 7h14M9 7V5h6v2M7 7l1 12h8l1-12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function GridIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <rect x="4" y="4" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <rect x="14" y="4" width="6" height="4" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <rect x="14" y="12" width="6" height="8" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <rect x="4" y="12" width="6" height="8" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        </svg>
    );
}

function TableIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5v-9Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M5 10h14M10 5v14M14 5v14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    );
}

function InfoIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 10.5v6M12 7.5h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function HouseIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1v-8.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ArrowRightIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * Dashboard del Usuario - Mis Propiedades
 *
 * Props desde Laravel:
 * - user: Usuario autenticado
 * - properties: Array de propiedades del usuario
 * - subscription: Info de suscripción activa
 */
export default function UserDashboard({ user, properties = [], subscription }) {
    const { auth, flash } = usePage().props;
    const [viewMode, setViewMode] = useState('grid');
    const [filterStatus, setFilterStatus] = useState('all');

    const Layout = auth?.user?.role === 'agente' ? AgentLayout : AppLayout;

    const filteredProperties = filterStatus === 'all'
        ? properties
        : properties.filter(p => p.status === filterStatus);

    const pendingCount = properties.filter(p => p.status === 'pendiente').length;
    const approvedCount = properties.filter(p => p.status === 'aprobado').length;
    const rejectedCount = properties.filter(p => p.status === 'rechazado').length;

    const getStatusBadge = (status) => {
        const statusConfig = {
            pendiente: {
                bg: 'rgba(201, 169, 97, 0.16)',
                text: 'var(--oro-principal)',
                border: 'rgba(201, 169, 97, 0.45)',
                label: 'Pendiente',
                icon: <PendingIcon className="h-3.5 w-3.5" />,
            },
            aprobado: {
                bg: 'rgba(107, 142, 127, 0.17)',
                text: 'var(--verde-claro)',
                border: 'rgba(107, 142, 127, 0.38)',
                label: 'Aprobado',
                icon: <CheckIcon className="h-3.5 w-3.5" />,
            },
            rechazado: {
                bg: 'rgba(238, 77, 77, 0.11)',
                text: '#fca5a5',
                border: 'rgba(239, 68, 68, 0.36)',
                label: 'Rechazado',
                icon: <TrashIcon className="h-3.5 w-3.5" />,
            },
        };

        return statusConfig[status] || statusConfig.pendiente;
    };

    const handleDelete = (propertyId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            router.delete(route('properties.destroy', propertyId));
        }
    };

    return (
        <Layout title="Dashboard">
            <div
                className="min-h-screen py-8"
                style={{
                    background: 'linear-gradient(180deg, var(--negro-profundo) 0%, var(--negro-oscuro) 100%)',
                    color: 'var(--blanco-crema)',
                }}
            >
                <div className="mx-auto max-w-7xl px-4">
                    {flash?.success && (
                        <div
                            className="mb-6 flex items-center gap-3 rounded-xl border p-4"
                            style={{
                                background: 'rgba(107, 142, 127, 0.12)',
                                borderColor: 'rgba(107, 142, 127, 0.35)',
                                color: 'var(--verde-claro)',
                            }}
                        >
                            <CheckIcon className="h-5 w-5" />
                            <p>{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div
                            className="mb-6 flex items-center gap-3 rounded-xl border p-4"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderColor: 'rgba(239, 68, 68, 0.35)',
                                color: '#fca5a5',
                            }}
                        >
                            <TrashIcon className="h-5 w-5" />
                            <p>{flash.error}</p>
                        </div>
                    )}

                    <div className="mb-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <span
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
                                        style={{
                                            background: 'rgba(201, 169, 97, 0.1)',
                                            borderColor: 'rgba(201, 169, 97, 0.35)',
                                            color: 'var(--oro-principal)',
                                        }}
                                    >
                                        <WelcomeIcon className="h-5 w-5" />
                                    </span>
                                    <span
                                        className="text-xs font-semibold uppercase tracking-[0.2em]"
                                        style={{ color: 'var(--oro-principal)' }}
                                    >
                                        Dashboard
                                    </span>
                                </div>
                                <h1 className="mb-2 text-4xl font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                    ¡Bienvenido, {user.name}!
                                </h1>
                                <p style={{ color: 'var(--gris-texto)' }}>
                                    Gestiona tus propiedades y suscripción desde aquí
                                </p>
                            </div>
                            {subscription && (
                                <Link
                                    href={route('properties.create')}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--verde-claro), var(--verde-salvia))',
                                        color: 'var(--negro-profundo)',
                                        boxShadow: '0 12px 30px rgba(107, 142, 127, 0.25)',
                                    }}
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Nueva Propiedad
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div
                            className="rounded-xl border p-6 shadow-lg"
                            style={{
                                background: 'rgba(42, 42, 42, 0.8)',
                                borderColor: 'rgba(201, 169, 97, 0.35)',
                                borderLeft: '4px solid var(--oro-principal)',
                            }}
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <SubscriptionIcon className="h-4 w-4" style={{ color: 'var(--oro-principal)' }} />
                                <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--gris-texto)' }}>
                                    Suscripción
                                </h3>
                            </div>
                            {subscription ? (
                                <>
                                    <p className="mb-3 text-2xl font-bold" style={{ color: 'var(--oro-principal)' }}>
                                        {subscription.plan_name}
                                    </p>
                                    <p className="mb-2 text-xs" style={{ color: 'var(--gris-texto)' }}>
                                        Vence: <span className="font-semibold">{new Date(subscription.end_date).toLocaleDateString('es-ES')}</span>
                                    </p>
                                    <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                        <div className="h-full w-2/3" style={{ background: 'linear-gradient(90deg, var(--verde-claro), var(--verde-salvia))' }} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="mb-3 text-sm" style={{ color: 'var(--gris-texto)' }}>Sin suscripción activa</p>
                                    <Link href={route('plans.index')} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--oro-principal)' }}>
                                        Ver Planes
                                        <ArrowRightIcon className="h-3.5 w-3.5" />
                                    </Link>
                                </>
                            )}
                        </div>

                        <div
                            className="rounded-xl border p-6 shadow-lg"
                            style={{
                                background: 'rgba(42, 42, 42, 0.8)',
                                borderColor: 'rgba(201, 169, 97, 0.35)',
                                borderLeft: '4px solid var(--verde-salvia)',
                            }}
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <PropertyIcon className="h-4 w-4" style={{ color: 'var(--verde-claro)' }} />
                                <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--gris-texto)' }}>
                                    Total Propiedades
                                </h3>
                            </div>
                            <p className="text-3xl font-bold" style={{ color: 'var(--verde-claro)' }}>{properties.length}</p>
                            {subscription && (
                                <p className="mt-2 text-xs" style={{ color: 'var(--gris-texto)' }}>
                                    Máximo: {subscription.max_properties}
                                </p>
                            )}
                        </div>

                        <div
                            className="rounded-xl border p-6 shadow-lg"
                            style={{
                                background: 'rgba(42, 42, 42, 0.8)',
                                borderColor: 'rgba(107, 142, 127, 0.35)',
                                borderLeft: '4px solid var(--verde-salvia)',
                            }}
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <CheckIcon className="h-4 w-4" style={{ color: 'var(--verde-claro)' }} />
                                <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--gris-texto)' }}>
                                    Aprobadas
                                </h3>
                            </div>
                            <p className="text-3xl font-bold" style={{ color: 'var(--verde-claro)' }}>{approvedCount}</p>
                            <p className="mt-2 text-xs" style={{ color: 'var(--gris-texto)' }}>
                                {approvedCount > 0 ? 'Visibles en plataforma' : 'Ninguna aprobada'}
                            </p>
                        </div>

                        <div
                            className="rounded-xl border p-6 shadow-lg"
                            style={{
                                background: 'rgba(42, 42, 42, 0.8)',
                                borderColor: 'rgba(201, 169, 97, 0.35)',
                                borderLeft: '4px solid var(--oro-principal)',
                            }}
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <PendingIcon className="h-4 w-4" style={{ color: 'var(--oro-principal)' }} />
                                <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--gris-texto)' }}>
                                    Pendientes
                                </h3>
                            </div>
                            <p className="text-3xl font-bold" style={{ color: 'var(--oro-principal)' }}>{pendingCount}</p>
                            <p className="mt-2 text-xs" style={{ color: 'var(--gris-texto)' }}>
                                {pendingCount > 0 ? 'Esperando moderación' : 'Todas revisadas'}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border shadow-lg" style={{ background: 'rgba(42, 42, 42, 0.8)', borderColor: 'rgba(201, 169, 97, 0.25)' }}>
                        <div className="border-b p-6" style={{ borderColor: 'rgba(201, 169, 97, 0.18)' }}>
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <h2 className="text-2xl font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                    Mis Propiedades
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                                        style={
                                            viewMode === 'grid'
                                                ? {
                                                    background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                                                    color: 'var(--negro-profundo)',
                                                }
                                                : {
                                                    background: 'rgba(255,255,255,0.06)',
                                                    color: 'var(--gris-texto)',
                                                }
                                        }
                                    >
                                        <GridIcon className="h-4 w-4" />
                                        Grid
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                                        style={
                                            viewMode === 'table'
                                                ? {
                                                    background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                                                    color: 'var(--negro-profundo)',
                                                }
                                                : {
                                                    background: 'rgba(255,255,255,0.06)',
                                                    color: 'var(--gris-texto)',
                                                }
                                        }
                                    >
                                        <TableIcon className="h-4 w-4" />
                                        Tabla
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFilterStatus('all')}
                                    className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                                    style={
                                        filterStatus === 'all'
                                            ? {
                                                background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                                                color: 'var(--negro-profundo)',
                                            }
                                            : {
                                                background: 'rgba(255,255,255,0.04)',
                                                color: 'var(--gris-texto)',
                                            }
                                    }
                                >
                                    Todas ({properties.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterStatus('aprobado')}
                                    className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                                    style={
                                        filterStatus === 'aprobado'
                                            ? {
                                                background: 'linear-gradient(135deg, var(--verde-claro), var(--verde-salvia))',
                                                color: 'var(--negro-profundo)',
                                            }
                                            : {
                                                background: 'rgba(255,255,255,0.04)',
                                                color: 'var(--gris-texto)',
                                            }
                                    }
                                >
                                    Aprobadas ({approvedCount})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterStatus('pendiente')}
                                    className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                                    style={
                                        filterStatus === 'pendiente'
                                            ? {
                                                background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                                                color: 'var(--negro-profundo)',
                                            }
                                            : {
                                                background: 'rgba(255,255,255,0.04)',
                                                color: 'var(--gris-texto)',
                                            }
                                    }
                                >
                                    Pendientes ({pendingCount})
                                </button>
                                {rejectedCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setFilterStatus('rechazado')}
                                        className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                                        style={
                                            filterStatus === 'rechazado'
                                                ? {
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#fca5a5',
                                                }
                                                : {
                                                    background: 'rgba(255,255,255,0.04)',
                                                    color: 'var(--gris-texto)',
                                                }
                                        }
                                    >
                                        Rechazadas ({rejectedCount})
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredProperties.length > 0 ? (
                            <>
                                {viewMode === 'grid' && (
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                            {filteredProperties.map(property => {
                                                const statusConfig = getStatusBadge(property.status);

                                                return (
                                                    <div
                                                        key={property.id}
                                                        className="overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-1"
                                                        style={{
                                                            background: 'rgba(26, 26, 26, 0.8)',
                                                            borderColor: 'rgba(201, 169, 97, 0.22)',
                                                            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                                                        }}
                                                    >
                                                        <div className="relative h-44 overflow-hidden bg-[#2a2a2a]">
                                                            {property.primary_image?.url ? (
                                                                <img src={property.primary_image.url} alt={property.title} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center" style={{ color: 'var(--oro-principal)' }}>
                                                                    <HouseIcon className="h-12 w-12" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                        </div>

                                                        <div className="space-y-4 p-4">
                                                            <h3 className="line-clamp-2 text-lg font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                                                {property.title}
                                                            </h3>

                                                            <p className="text-2xl font-bold" style={{ color: 'var(--oro-principal)' }}>
                                                                {formatCurrency(property.price, property.currency)}
                                                            </p>

                                                            <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                                                                {property.location?.city}
                                                            </p>

                                                            <span
                                                                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                                                                style={{
                                                                    background: statusConfig.bg,
                                                                    color: statusConfig.text,
                                                                    borderColor: statusConfig.border,
                                                                }}
                                                            >
                                                                {statusConfig.icon}
                                                                {statusConfig.label}
                                                            </span>

                                                            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--gris-texto)' }}>
                                                                {property.type === 'venta' ? <span>Venta</span> : <span>Alquiler</span>}
                                                                {property.bedrooms && <span>{property.bedrooms} hab.</span>}
                                                                {property.bathrooms && <span>{property.bathrooms} baños</span>}
                                                                {property.area && <span>{property.area} m²</span>}
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-2">
                                                                <Link
                                                                    href={route('properties.show', property.id)}
                                                                    className="inline-flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-bold"
                                                                    style={{ background: 'rgba(201, 169, 97, 0.12)', color: 'var(--oro-principal)' }}
                                                                >
                                                                    <EyeIcon className="h-3.5 w-3.5" />
                                                                    Ver
                                                                </Link>
                                                                <Link
                                                                    href={route('properties.edit', property.id)}
                                                                    className="inline-flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-bold"
                                                                    style={{ background: 'rgba(107, 142, 127, 0.12)', color: 'var(--verde-claro)' }}
                                                                >
                                                                    <PencilIcon className="h-3.5 w-3.5" />
                                                                    Editar
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(property.id)}
                                                                    className="inline-flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-bold"
                                                                    style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5' }}
                                                                >
                                                                    <TrashIcon className="h-3.5 w-3.5" />
                                                                    Borrar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {viewMode === 'table' && (
                                    <div className="overflow-x-auto p-6">
                                        <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(201,169,97,0.18)' }}>
                                            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <tr>
                                                    {['Título', 'Precio', 'Tipo', 'Ubicación', 'Estado', 'Acciones'].map(header => (
                                                        <th key={header} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--gris-texto)' }}>
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProperties.map(property => {
                                                    const statusConfig = getStatusBadge(property.status);

                                                    return (
                                                        <tr key={property.id} style={{ borderTop: '1px solid rgba(201,169,97,0.12)' }}>
                                                            <td className="px-5 py-4 text-sm font-semibold" style={{ color: 'var(--blanco-crema)' }}>
                                                                {property.title}
                                                            </td>
                                                            <td className="px-5 py-4 text-sm font-bold" style={{ color: 'var(--oro-principal)' }}>
                                                                {formatCurrency(property.price)}
                                                            </td>
                                                            <td className="px-5 py-4 text-sm" style={{ color: 'var(--gris-texto)' }}>
                                                                {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                                                            </td>
                                                            <td className="px-5 py-4 text-sm" style={{ color: 'var(--gris-texto)' }}>
                                                                {property.location?.city}
                                                            </td>
                                                            <td className="px-5 py-4 text-sm">
                                                                <span
                                                                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                                                                    style={{
                                                                        background: statusConfig.bg,
                                                                        color: statusConfig.text,
                                                                        borderColor: statusConfig.border,
                                                                    }}
                                                                >
                                                                    {statusConfig.icon}
                                                                    {statusConfig.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 text-sm">
                                                                <div className="flex gap-2">
                                                                    <Link
                                                                        href={route('properties.show', property.id)}
                                                                        className="inline-flex items-center justify-center rounded-md p-2"
                                                                        style={{ background: 'rgba(201,169,97,0.12)', color: 'var(--oro-principal)' }}
                                                                        title="Ver"
                                                                    >
                                                                        <EyeIcon className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                    <Link
                                                                        href={route('properties.edit', property.id)}
                                                                        className="inline-flex items-center justify-center rounded-md p-2"
                                                                        style={{ background: 'rgba(107,142,127,0.12)', color: 'var(--verde-claro)' }}
                                                                        title="Editar"
                                                                    >
                                                                        <PencilIcon className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDelete(property.id)}
                                                                        className="inline-flex items-center justify-center rounded-md p-2"
                                                                        style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}
                                                                        title="Eliminar"
                                                                    >
                                                                        <TrashIcon className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="mb-4 flex justify-center" style={{ color: 'var(--oro-principal)' }}>
                                    <HouseIcon className="h-14 w-14" />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold" style={{ color: 'var(--blanco-crema)' }}>Sin propiedades</h3>
                                <p className="mb-6" style={{ color: 'var(--gris-texto)' }}>
                                    {filterStatus !== 'all'
                                        ? `No tienes propiedades ${filterStatus}`
                                        : subscription
                                            ? 'Aún no has publicado ninguna propiedad'
                                            : 'Necesitas una suscripción para publicar propiedades'}
                                </p>
                                {subscription && (
                                    <Link
                                        href={route('properties.create')}
                                        className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-bold"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--verde-claro), var(--verde-salvia))',
                                            color: 'var(--negro-profundo)',
                                        }}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        Publicar Mi Primera Propiedad
                                    </Link>
                                )}
                                {!subscription && (
                                    <Link
                                        href={route('plans.index')}
                                        className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-bold"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                                            color: 'var(--negro-profundo)',
                                        }}
                                    >
                                        <SubscriptionIcon className="h-4 w-4" />
                                        Ver Planes de Suscripción
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        className="mt-8 rounded-xl border p-6"
                        style={{
                            background: 'rgba(201, 169, 97, 0.08)',
                            borderLeft: '4px solid var(--oro-principal)',
                            borderColor: 'rgba(201, 169, 97, 0.22)',
                        }}
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <InfoIcon className="h-5 w-5" style={{ color: 'var(--oro-principal)' }} />
                            <h3 className="text-lg font-bold" style={{ color: 'var(--blanco-crema)' }}>¿Cómo funciona?</h3>
                        </div>
                        <ul className="space-y-2 text-sm" style={{ color: 'var(--gris-texto)' }}>
                            <li><strong style={{ color: 'var(--oro-principal)' }}>Pendiente:</strong> Tu propiedad está siendo revisada por nuestro equipo de moderación.</li>
                            <li><strong style={{ color: 'var(--verde-claro)' }}>Aprobado:</strong> Tu propiedad es visible para todos los usuarios.</li>
                            <li><strong style={{ color: '#fca5a5' }}>Rechazado:</strong> Verifica que tu propiedad cumpla con nuestros estándares.</li>
                            <li>Puedes editar tus propiedades en cualquier momento.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
