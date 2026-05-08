import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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

    return (
        <AdminLayout title="Gestión de Propiedades">
            <Head title="Propiedades - Admin" />

            {/* Header */}
            <div className="mb-6">
                <p className="text-gray-600 text-sm">Revisa y aprueba las propiedades publicadas en la plataforma</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar propiedad o agente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="aprobado">✅ Aprobado</option>
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="rechazado">❌ Rechazado</option>
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="venta">🏠 Venta</option>
                        <option value="alquiler">🏢 Alquiler</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-3xl font-bold text-gray-900">{properties.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Aprobadas</p>
                    <p className="text-3xl font-bold text-green-600">{properties.filter(p => p.status === 'aprobado').length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-600">{properties.filter(p => p.status === 'pendiente').length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Rechazadas</p>
                    <p className="text-3xl font-bold text-red-600">{properties.filter(p => p.status === 'rechazado').length}</p>
                </div>
            </div>

            {/* Table */}
            {filteredProperties.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-600 text-lg">No se encontraron propiedades</p>
                </div>
            ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Agente</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProperties.map((property) => (
                            <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{property.user?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">${property.price?.toLocaleString() || '0'}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        property.type === 'venta' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {property.type === 'venta' ? '🏠 Venta' : '🏢 Alquiler'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {property.status === 'aprobado' ? (
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                            <span>✅ Aprobado</span>
                                        </span>
                                    ) : property.status === 'pendiente' ? (
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                            <span>⏳ Pendiente</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                            <span>❌ Rechazado</span>
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center space-x-3">
                                        <Link href={route('properties.show', property.id)} className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded transition-colors" title="Ver propiedad">
                                            👁️ Ver
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </AdminLayout>
    );
}
