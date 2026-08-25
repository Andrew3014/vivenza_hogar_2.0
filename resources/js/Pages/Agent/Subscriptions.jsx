import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    CreditCardIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { findPlan, planPrice } from '@/utils';

export default function AgentSubscriptions({ subscriptions = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const filtered = subscriptions.filter((sub) => {
        const matchesSearch =
            sub.user?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            sub.user?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesPlan =
            planFilter === 'all' || sub.plan === planFilter;

        const matchesStatus =
            statusFilter === 'all' || sub.status === statusFilter;

        return matchesSearch && matchesPlan && matchesStatus;
    });

    /* ================================
       ESTADÍSTICAS
    ================================= */

    const activeCount = subscriptions.filter(
        (s) => s.status === 'active'
    ).length;

    const inactiveCount = subscriptions.filter(
        (s) => s.status !== 'active'
    ).length;

    const totalRevenue = subscriptions
        .filter((s) => s.status === 'active')
        .reduce(
            (acc, s) => acc + planPrice(s.plan),
            0
        );

    const expirationDays = (expDate) => {
        const now = new Date();
        const exp = new Date(expDate);

        const diff = exp - now;

        return Math.ceil(
            diff / (1000 * 60 * 60 * 24)
        );
    };

    const formatRevenue = (amount) =>
        `$${amount.toFixed(2)}`;

    const stats = [
        {
            label: 'Total',
            value: subscriptions.length,
            icon: CreditCardIcon,
            className: 'vz-stat-gold',
        },
        {
            label: 'Activas',
            value: activeCount,
            icon: CheckCircleIcon,
            className: 'vz-stat-success',
        },
        {
            label: 'Inactivas',
            value: inactiveCount,
            icon: XCircleIcon,
            className: 'vz-stat-danger',
        },
        {
            label: 'Ingreso Mensual',
            value: formatRevenue(totalRevenue),
            icon: CurrencyDollarIcon,
            className: 'vz-stat-purple',
        },
    ];

    /* ================================
       PLAN
    ================================= */

    const getPlanDetails = (plan) => {
        const catalog = findPlan(plan);

        if (catalog) {
            return {
                name: catalog.name,
                price: catalog.price,
                className:
                    plan === 'premium'
                        ? 'vz-badge-premium'
                        : plan === 'enterprise'
                        ? 'vz-badge-enterprise'
                        : 'vz-badge-basic',
            };
        }

        return {
            name: 'Desconocido',
            price: 0,
            className: 'vz-badge-basic',
        };
    };

    /* ================================
       ESTADO
    ================================= */

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return {
                    text: 'Activa',
                    className: 'vz-status-active',
                };

            case 'cancelled':
                return {
                    text: 'Cancelada',
                    className: 'vz-status-inactive',
                };

            case 'expired':
                return {
                    text: 'Expirada',
                    className: 'vz-status-inactive',
                };

            default:
                return {
                    text: 'Desconocido',
                    className: 'vz-status-inactive',
                };
        }
    };

    return (
        <AgentLayout title="Suscripciones de Clientes">
            <Head title="Suscripciones - Vivenza" />

            {/* =====================================
                INTRODUCCIÓN
            ====================================== */}

            <div className="vz-page-intro">
                <p>
                    Gestiona las suscripciones de tus clientes
                </p>
            </div>

            {/* =====================================
                ESTADÍSTICAS
            ====================================== */}

            <div className="vz-admin-stats-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="vz-admin-stat-card"
                        >
                            <div className="vz-admin-stat-top">

                                <div>
                                    <p className="vz-admin-stat-label">
                                        {stat.label}
                                    </p>

                                    <p className="vz-admin-stat-value">
                                        {stat.value}
                                    </p>
                                </div>

                                <div
                                    className={`vz-admin-stat-icon ${stat.className}`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* =====================================
                FILTROS
            ====================================== */}

            <div className="vz-admin-panel mb-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* BUSCADOR */}

                    <div className="relative">

                        <MagnifyingGlassIcon
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{
                                color: 'var(--gris-texto)',
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Buscar cliente o email..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="vz-form-input pl-10"
                        />

                    </div>

                    {/* PLAN */}

                    <select
                        value={planFilter}
                        onChange={(e) =>
                            setPlanFilter(e.target.value)
                        }
                        className="vz-form-input"
                    >
                        <option value="all">
                            Todos los planes
                        </option>

                        <option value="basic">
                            Básico
                        </option>

                        <option value="premium">
                            Premium
                        </option>

                        <option value="enterprise">
                            Enterprise
                        </option>
                    </select>

                    {/* ESTADO */}

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="vz-form-input"
                    >
                        <option value="all">
                            Todos los estados
                        </option>

                        <option value="active">
                            Activas
                        </option>

                        <option value="cancelled">
                            Canceladas
                        </option>

                        <option value="expired">
                            Expiradas
                        </option>
                    </select>

                </div>

            </div>

            {/* =====================================
                CONTENIDO
            ====================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* =================================
                    TABLA
                ================================== */}

                <div className="lg:col-span-2">

                    <div className="vz-table-card">

                        {filtered.length === 0 ? (

                            <div className="p-8 text-center">

                                <CreditCardIcon
                                    className="w-12 h-12 mx-auto mb-3"
                                    style={{
                                        color: 'var(--oro-principal)',
                                    }}
                                />

                                <p
                                    style={{
                                        color: 'var(--gris-texto)',
                                    }}
                                >
                                    No hay suscripciones que
                                    coincidan con los filtros
                                </p>

                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearchTerm('')
                                        }
                                        className="vz-btn-link mt-2"
                                    >
                                        Limpiar búsqueda
                                    </button>
                                )}

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="vz-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Cliente
                                            </th>

                                            <th>
                                                Plan
                                            </th>

                                            <th>
                                                Estado
                                            </th>

                                            <th>
                                                Expira
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filtered.map((sub) => {

                                            const daysLeft =
                                                expirationDays(
                                                    sub.end_date
                                                );

                                            const planDetails =
                                                getPlanDetails(
                                                    sub.plan
                                                );

                                            const statusBadge =
                                                getStatusBadge(
                                                    sub.status
                                                );

                                            return (

                                                <tr
                                                    key={sub.id}
                                                    onClick={() =>
                                                        setSelectedSubscription(
                                                            sub
                                                        )
                                                    }
                                                    className={
                                                        selectedSubscription?.id ===
                                                        sub.id
                                                            ? 'vz-table-row-selected'
                                                            : ''
                                                    }
                                                >

                                                    {/* CLIENTE */}

                                                    <td>

                                                        <div>

                                                            <strong className="vz-table-primary">
                                                                {
                                                                    sub
                                                                        .user
                                                                        ?.name
                                                                }
                                                            </strong>

                                                            {sub.user
                                                                ?.email && (
                                                                <span className="vz-table-secondary">
                                                                    {
                                                                        sub
                                                                            .user
                                                                            .email
                                                                    }
                                                                </span>
                                                            )}

                                                        </div>

                                                    </td>

                                                    {/* PLAN */}

                                                    <td>

                                                        <span
                                                            className={`vz-status-badge ${planDetails.className}`}
                                                        >
                                                            {
                                                                planDetails.name
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* ESTADO */}

                                                    <td>

                                                        <span
                                                            className={`vz-status-badge ${statusBadge.className}`}
                                                        >
                                                            {
                                                                statusBadge.text
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* EXPIRACIÓN */}

                                                    <td>

                                                        <span
                                                            className={
                                                                daysLeft > 7
                                                                    ? 'vz-text-success'
                                                                    : 'vz-text-danger'
                                                            }
                                                        >
                                                            {daysLeft > 0
                                                                ? `${daysLeft} días`
                                                                : 'Vencida'}
                                                        </span>

                                                    </td>

                                                </tr>

                                            );

                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

                {/* =================================
                    DETALLES
                ================================== */}

                {selectedSubscription && (

                    <div className="vz-admin-panel">

                        <div className="flex items-center justify-between mb-6">

                            <h2 className="vz-admin-panel-title">
                                Detalles de Suscripción
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedSubscription(null)
                                }
                                className="vz-btn-link"
                            >
                                Cerrar
                            </button>

                        </div>

                        {/* CLIENTE */}

                        <div className="mb-6 pb-6 border-b border-[var(--borde)]">

                            <p className="vz-form-label">
                                Cliente
                            </p>

                            <p className="vz-table-primary mt-1">
                                {
                                    selectedSubscription.user
                                        ?.name
                                }
                            </p>

                            <p className="vz-table-secondary">
                                {
                                    selectedSubscription.user
                                        ?.email
                                }
                            </p>

                            {selectedSubscription.user?.phone && (
                                <p className="vz-table-secondary mt-1">
                                    {
                                        selectedSubscription.user
                                            .phone
                                    }
                                </p>
                            )}

                        </div>

                        {/* PLAN */}

                        <div className="mb-6 pb-6 border-b border-[var(--borde)]">

                            <p className="vz-form-label">
                                Plan Contratado
                            </p>

                            {(() => {

                                const planDetails =
                                    getPlanDetails(
                                        selectedSubscription.plan
                                    );

                                return (

                                    <div className="mt-3 p-4 rounded-lg border border-[rgba(201,169,97,0.18)] bg-[rgba(201,169,97,0.05)]">

                                        <span
                                            className={`vz-status-badge ${planDetails.className}`}
                                        >
                                            {planDetails.name}
                                        </span>

                                        <p className="vz-admin-stat-value mt-3">
                                            ${planDetails.price}
                                            <span className="text-sm ml-1">
                                                /mes
                                            </span>
                                        </p>

                                    </div>

                                );

                            })()}

                        </div>

                        {/* FECHAS */}

                        <div className="mb-6 pb-6 border-b border-[var(--borde)]">

                            <p className="vz-form-label">
                                Inicio
                            </p>

                            <p className="vz-table-primary mt-1">
                                {new Date(
                                    selectedSubscription.start_date
                                ).toLocaleDateString('es-BO')}
                            </p>

                            <p className="vz-form-label mt-4">
                                Renovación
                            </p>

                            <p className="vz-table-primary mt-1">
                                {new Date(
                                    selectedSubscription.end_date
                                ).toLocaleDateString('es-BO')}
                            </p>

                            {(() => {

                                const daysLeft =
                                    expirationDays(
                                        selectedSubscription.end_date
                                    );

                                return (

                                    <div
                                        className={`mt-4 ${
                                            daysLeft > 7
                                                ? 'vz-alert-success'
                                                : 'vz-alert-danger'
                                        }`}
                                    >
                                        {daysLeft > 0
                                            ? `Vence en ${daysLeft} días`
                                            : 'Vencida'}
                                    </div>

                                );

                            })()}

                        </div>

                        {/* ESTADO */}

                        <div className="mb-6">

                            <p className="vz-form-label">
                                Estado Actual
                            </p>

                            {(() => {

                                const statusBadge =
                                    getStatusBadge(
                                        selectedSubscription.status
                                    );

                                return (

                                    <span
                                        className={`vz-status-badge mt-2 ${statusBadge.className}`}
                                    >
                                        {statusBadge.text}
                                    </span>

                                );

                            })()}

                        </div>

                        {/* CONTACTAR */}

                        {selectedSubscription.status ===
                            'active' && (

                            <a
                                href={`mailto:${selectedSubscription.user?.email}?subject=${encodeURIComponent(
                                    'Tu suscripción en Vivenza'
                                )}`}
                                className="vz-btn w-full text-center"
                            >
                                Contactar Cliente
                            </a>

                        )}

                    </div>

                )}

            </div>

        </AgentLayout>
    );
}