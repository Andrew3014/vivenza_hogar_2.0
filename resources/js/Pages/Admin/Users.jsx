import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function Users({ users = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    // Filter and search logic
    const filteredUsers = users
        .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'email') return a.email.localeCompare(b.email);
            if (sortBy === 'role') return a.role.localeCompare(b.role);
            if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
            return 0;
        });

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'agente': return 'bg-blue-100 text-blue-800';
            case 'cliente': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleBadgeText = (role) => {
        switch(role) {
            case 'admin': return '👮 Admin';
            case 'agente': return '🏢 Agente';
            case 'cliente': return '👤 Cliente';
            default: return role;
        }
    };

    return (
        <AdminLayout title="Gestión de Usuarios">
            <Head title="Usuarios - Admin" />

            {/* Header with Create Button */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Gestiona los usuarios de la plataforma</p>
                </div>
                <Link
                    href={route('admin.users.create')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nuevo Usuario
                </Link>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos los roles</option>
                        <option value="admin">👮 Administrador</option>
                        <option value="agente">🏢 Agente</option>
                        <option value="cliente">👤 Cliente</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="name">Ordenar por nombre</option>
                        <option value="email">Ordenar por email</option>
                        <option value="role">Ordenar por rol</option>
                        <option value="newest">Más recientes</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Total de Usuarios</p>
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Resultado de Búsqueda</p>
                    <p className="text-3xl font-bold text-blue-600">{filteredUsers.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-gray-600 text-sm">Rol Seleccionado</p>
                    <p className="text-3xl font-bold text-gray-900 capitalize">
                        {roleFilter === 'all' ? 'Todos' : roleFilter}
                    </p>
                </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-gray-600 text-lg">No se encontraron usuarios que coincidan con tu búsqueda</p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Teléfono</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Registrado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                            {getRoleBadgeText(user.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center space-x-3">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded transition-colors"
                                                title="Editar usuario"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.name}?`)) {
                                                        // Implement delete
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded transition-colors"
                                                title="Eliminar usuario"
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
        </AdminLayout>
    );
}
