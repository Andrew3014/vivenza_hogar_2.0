import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    HomeIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function AgentProperties({ properties = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const handleDelete = (prop) => {
        if (
            window.confirm(
                `¿Eliminar la propiedad "${prop.title}"? Esta acción no se puede deshacer.`
            )
        ) {
            router.delete(route('properties.destroy', prop.id));
        }
    };

    const filtered = properties.filter((prop) => {
        const matchesSearch =
            prop.title
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            prop.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            prop.status === statusFilter;

        const matchesType =
            typeFilter === 'all' ||
            prop.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const stats = [
        {
            label: 'Total',
            value: properties.length,
            icon: HomeIcon,
            className: 'vz-stat-gold',
        },
        {
            label: 'Aprobadas',
            value: properties.filter(
                (p) => p.status === 'aprobado'
            ).length,
            icon: CheckCircleIcon,
            className: 'vz-stat-success',
        },
        {
            label: 'Pendientes',
            value: properties.filter(
                (p) => p.status === 'pendiente'
            ).length,
            icon: ClockIcon,
            className: 'vz-stat-warning',
        },
        {
            label: 'Rechazadas',
            value: properties.filter(
                (p) => p.status === 'rechazado'
            ).length,
            icon: XCircleIcon,
            className: 'vz-stat-danger',
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'aprobado':
                return 'vz-status-active';

            case 'pendiente':
                return 'vz-status-warning';

            case 'rechazado':
                return 'vz-status-danger';

            default:
                return 'vz-status-inactive';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'aprobado':
                return 'Aprobado';

            case 'pendiente':
                return 'Pendiente';

            case 'rechazado':
                return 'Rechazado';

            default:
                return status || 'Sin estado';
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'venta':
                return 'Venta';

            case 'alquiler':
                return 'Alquiler';

            default:
                return type || 'Sin tipo';
        }
    };

    return (
        <AgentLayout title="Mis Propiedades">
            <Head title="Mis Propiedades - Vivenza" />

            <div className="space-y-6">

                {/* INTRODUCCIÓN */}
                <div className="vz-page-intro">
                    <p>
                        Gestiona tus propiedades, consulta su estado y
                        administra tus publicaciones.
                    </p>
                </div>

                {/* ESTADÍSTICAS */}
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

                {/* FILTROS */}
                <div className="vz-admin-panel">

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
                                placeholder="Buscar propiedad..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="vz-form-input pl-10"
                            />

                        </div>

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

                            <option value="aprobado">
                                Aprobado
                            </option>

                            <option value="pendiente">
                                Pendiente
                            </option>

                            <option value="rechazado">
                                Rechazado
                            </option>
                        </select>

                        {/* TIPO */}
                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="vz-form-input"
                        >
                            <option value="all">
                                Todos los tipos
                            </option>

                            <option value="venta">
                                Venta
                            </option>

                            <option value="alquiler">
                                Alquiler
                            </option>
                        </select>

                    </div>

                </div>

                {/* TABLA */}
                <div className="vz-table-card overflow-hidden">

                    {filtered.length === 0 ? (

                        <div className="p-10 text-center">

                            <div className="vz-admin-stat-icon vz-stat-gold mx-auto mb-4">
                                <MagnifyingGlassIcon className="w-8 h-8" />
                            </div>

                            <p className="vz-admin-panel-title">
                                No se encontraron propiedades
                            </p>

                            <p className="vz-table-secondary mt-2">
                                No hay propiedades que coincidan con
                                los filtros seleccionados.
                            </p>

                            {(searchTerm ||
                                statusFilter !== 'all' ||
                                typeFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                        setTypeFilter('all');
                                    }}
                                    className="vz-btn-link mt-3"
                                >
                                    Limpiar filtros
                                </button>
                            )}

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="vz-table">

                                <thead>
                                    <tr>

                                        <th>
                                            Título
                                        </th>

                                        <th>
                                            Tipo
                                        </th>

                                        <th>
                                            Precio
                                        </th>

                                        <th>
                                            Estado
                                        </th>

                                        <th>
                                            Acciones
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {filtered.map((prop) => (

                                        <tr key={prop.id}>

                                            {/* TÍTULO */}
                                            <td>

                                                <div>

                                                    <strong className="vz-table-primary">
                                                        {prop.title}
                                                    </strong>

                                                    {prop.description && (
                                                        <span className="vz-table-secondary line-clamp-1">
                                                            {prop.description}
                                                        </span>
                                                    )}

                                                </div>

                                            </td>

                                            {/* TIPO */}
                                            <td>

                                                <span className="vz-status-badge vz-badge-basic">
                                                    {getTypeText(prop.type)}
                                                </span>

                                            </td>

                                            {/* PRECIO */}
                                            <td>

                                                <strong className="vz-number-highlight">
                                                    {prop.price} BOB
                                                </strong>

                                            </td>

                                            {/* ESTADO */}
                                            <td>

                                                <span
                                                    className={`vz-status-badge ${getStatusClass(
                                                        prop.status
                                                    )}`}
                                                >
                                                    {getStatusText(
                                                        prop.status
                                                    )}
                                                </span>

                                            </td>

                                            {/* ACCIONES */}
                                            <td>

                                                <div className="flex items-center gap-2">

                                                    {/* VER */}
                                                    <Link
                                                        href={route(
                                                            'properties.show',
                                                            prop.id
                                                        )}
                                                        className="vz-table-action"
                                                        title="Ver propiedad"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </Link>

                                                    {/* EDITAR */}
                                                    <Link
                                                        href={route(
                                                            'properties.edit',
                                                            prop.id
                                                        )}
                                                        className="vz-table-action"
                                                        title="Editar propiedad"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </Link>

                                                    {/* ELIMINAR */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(prop)
                                                        }
                                                        className="vz-table-action vz-table-action-danger"
                                                        title="Eliminar propiedad"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>
        </AgentLayout>
    );
}