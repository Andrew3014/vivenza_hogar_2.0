import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessages from '@/Components/FlashMessages';
import { Head, Link, router } from '@inertiajs/react';
import { CheckIcon, XMarkIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Properties({ properties = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const filteredProperties = properties
        .filter(property => {
            const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                property.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
            const matchesType = typeFilter === 'all' || property.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });

    const changeStatus = (property, status) => {
        if (status === 'rechazado' && !window.confirm(`¿Rechazar "${property.title}"? El usuario será notificado.`)) {
            return;
        }
        router.patch(route('admin.properties.status', property.id), {
            status,
        }, {
            preserveScroll: true,
        });
    };

    const typeClass = (type) => (
        type === 'venta' ? 'vz-admin-pill-blue' : 'vz-admin-pill-success'
    );

    const statusClass = (status) => {
        if (status === 'aprobado') return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
        if (status === 'pendiente') return 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/20';
        return 'bg-red-500/10 text-red-300 border border-red-500/20';
    };

    const statusLabel = (status) => {
        if (status === 'aprobado') return 'Aprobado';
        if (status === 'pendiente') return 'Pendiente';
        return 'Rechazado';
    };

    return (
        <AdminLayout title="Gestión de Propiedades">
            <Head title="Propiedades - Admin" />

            <FlashMessages />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-[#d8d2c4]">Revisa y aprueba las propiedades publicadas en la plataforma</p>
                </div>

                <div className="vz-admin-panel">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-[#a6a29a]" />
                            <input
                                type="text"
                                placeholder="Buscar propiedad o agente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] pl-10 pr-4 py-2.5 text-sm text-[#f5f1e7] placeholder:text-[#8f8a82] outline-none transition focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-2.5 text-sm text-[#f5f1e7] outline-none transition focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="aprobado">Aprobado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="rechazado">Rechazado</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-2.5 text-sm text-[#f5f1e7] outline-none transition focus:border-[#c9a961] focus:ring-2 focus:ring-[#c9a961]/20"
                        >
                            <option value="all">Todos los tipos</option>
                            <option value="venta">Venta</option>
                            <option value="alquiler">Alquiler</option>
                        </select>
                    </div>
                </div>

                <div className="vz-admin-stats-grid">
                    <div className="vz-admin-stat-card">
                        <div className="vz-admin-stat-top">
                            <div>
                                <p className="vz-admin-stat-label">Total</p>
                                <p className="vz-admin-stat-value">{properties.length}</p>
                            </div>
                            <div className="vz-admin-stat-icon text-[#c9a961]">P</div>
                        </div>
                    </div>
                    <div className="vz-admin-stat-card">
                        <div className="vz-admin-stat-top">
                            <div>
                                <p className="vz-admin-stat-label">Aprobadas</p>
                                <p className="vz-admin-stat-value">{properties.filter(p => p.status === 'aprobado').length}</p>
                            </div>
                            <div className="vz-admin-stat-icon text-[#34d399]">A</div>
                        </div>
                    </div>
                    <div className="vz-admin-stat-card">
                        <div className="vz-admin-stat-top">
                            <div>
                                <p className="vz-admin-stat-label">Pendientes</p>
                                <p className="vz-admin-stat-value">{properties.filter(p => p.status === 'pendiente').length}</p>
                            </div>
                            <div className="vz-admin-stat-icon text-[#fbbf24]">P</div>
                        </div>
                    </div>
                    <div className="vz-admin-stat-card">
                        <div className="vz-admin-stat-top">
                            <div>
                                <p className="vz-admin-stat-label">Rechazadas</p>
                                <p className="vz-admin-stat-value">{properties.filter(p => p.status === 'rechazado').length}</p>
                            </div>
                            <div className="vz-admin-stat-icon text-[#f87171]">R</div>
                        </div>
                    </div>
                </div>

                {filteredProperties.length === 0 ? (
                    <div className="vz-admin-panel text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a961]/30 bg-[#c9a961]/10 text-[#c9a961]">
                            <MagnifyingGlassIcon className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-medium text-[#f5f1e7]">No se encontraron propiedades</p>
                    </div>
                ) : (
                    <div className="vz-admin-panel overflow-hidden p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-0">
                                <thead className="bg-[#121212] text-left">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8d2c4]">Título</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8d2c4]">Agente</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8d2c4]">Precio</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8d2c4]">Tipo</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8d2c4]">Estado</th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#d8d2c4]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProperties.map((property) => (
                                        <tr key={property.id} className="border-t border-[#2a2a2a] bg-[#1b1b1b]/60 transition hover:bg-[#1d1d1d]">
                                            <td className="px-6 py-4 text-sm font-medium text-[#f5f1e7]">{property.title}</td>
                                            <td className="px-6 py-4 text-sm text-[#d6d3d1]">{property.user?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-[#f5f1e7]">${property.price?.toLocaleString() || '0'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`vz-admin-pill ${typeClass(property.type)}`}>
                                                    {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`vz-admin-pill ${statusClass(property.status)}`}>
                                                    {statusLabel(property.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={route('properties.show', property.id)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#111111] px-2.5 py-1.5 text-xs font-medium text-[#c9a961] transition hover:border-[#c9a961]/60 hover:bg-[#1d1d1d]"
                                                        title="Ver propiedad"
                                                    >
                                                        <EyeIcon className="h-3.5 w-3.5" />
                                                        Ver
                                                    </Link>
                                                    {property.status === 'pendiente' && (
                                                        <>
                                                            <button
                                                                onClick={() => changeStatus(property, 'aprobado')}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
                                                                title="Aprobar propiedad"
                                                            >
                                                                <CheckIcon className="h-3.5 w-3.5" />
                                                                Aprobar
                                                            </button>
                                                            <button
                                                                onClick={() => changeStatus(property, 'rechazado')}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-400 hover:bg-red-500/20"
                                                                title="Rechazar propiedad"
                                                            >
                                                                <XMarkIcon className="h-3.5 w-3.5" />
                                                                Rechazar
                                                            </button>
                                                        </>
                                                    )}
                                                    {property.status === 'aprobado' && (
                                                        <button
                                                            onClick={() => changeStatus(property, 'rechazado')}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-400 hover:bg-red-500/20"
                                                            title="Despublicar propiedad"
                                                        >
                                                            <XMarkIcon className="h-3.5 w-3.5" />
                                                            Despublicar
                                                        </button>
                                                    )}
                                                    {property.status === 'rechazado' && (
                                                        <button
                                                            onClick={() => changeStatus(property, 'aprobado')}
                                                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-500/20"
                                                            title="Republicar propiedad"
                                                        >
                                                            <CheckIcon className="h-3.5 w-3.5" />
                                                            Republicar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
