import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head } from '@inertiajs/react';
import { MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AgentProperties({ properties = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const filtered = properties.filter(prop => {
        const matchesSearch = prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prop.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
        const matchesType = typeFilter === 'all' || prop.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const stats = [
        { label: 'Total', value: properties.length, color: 'bg-blue-50', icon: '🏠' },
        { label: 'Aprobadas', value: properties.filter(p => p.status === 'aprobado').length, color: 'bg-green-50', icon: '✅' },
        { label: 'Pendientes', value: properties.filter(p => p.status === 'pendiente').length, color: 'bg-yellow-50', icon: '⏳' },
        { label: 'Rechazadas', value: properties.filter(p => p.status === 'rechazado').length, color: 'bg-red-50', icon: '❌' },
    ];

    return (
        <AgentLayout title="🏘️ Mis Propiedades">
            <Head title="Mis Propiedades - Vivenza" />

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className={`${stat.color} rounded-lg p-4 border border-gray-200`}>
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar propiedad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="aprobado">✅ Aprobado</option>
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="rechazado">❌ Rechazado</option>
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="venta">💰 Venta</option>
                        <option value="alquiler">🔑 Alquiler</option>
                    </select>
                </div>
            </div>

            {/* Tabla de Propiedades */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Título</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Tipo</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Precio</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filtered.length > 0 ? filtered.map((prop) => (
                            <tr key={prop.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium">{prop.title}</td>
                                <td className="px-6 py-4 text-sm">
                                    {prop.type === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">{prop.price} BOB</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        prop.status === 'aprobado' ? 'bg-green-100 text-green-800' :
                                        prop.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {prop.status === 'aprobado' ? '✅ Aprobado' :
                                         prop.status === 'pendiente' ? '⏳ Pendiente' : '❌ Rechazado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800"><EyeIcon className="w-4 h-4 inline" /> Ver</button>
                                    <button className="text-green-600 hover:text-green-800"><PencilIcon className="w-4 h-4 inline" /> Editar</button>
                                    <button className="text-red-600 hover:text-red-800"><TrashIcon className="w-4 h-4 inline" /> Eliminar</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    No hay propiedades que coincidan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AgentLayout>
    );
}
