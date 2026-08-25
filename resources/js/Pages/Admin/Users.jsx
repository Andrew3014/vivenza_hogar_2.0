import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FlashMessages from '@/Components/FlashMessages';
import { Head, Link, router } from '@inertiajs/react';
import {
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    UsersIcon,
    UserGroupIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function Users({ users = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const activeUsers = users.filter(
        user => user.account_status !== 'eliminado'
    );

    const filteredUsers = activeUsers
        .filter(user => {
            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                user.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesRole =
                roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }

            if (sortBy === 'email') {
                return a.email.localeCompare(b.email);
            }

            if (sortBy === 'role') {
                return a.role.localeCompare(b.role);
            }

            if (sortBy === 'newest') {
                return (
                    new Date(b.created_at) -
                    new Date(a.created_at)
                );
            }

            return 0;
        });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'vz-badge-admin';

            case 'agente':
                return 'vz-badge-agent';

            case 'cliente':
                return 'vz-badge-client';

            default:
                return 'vz-badge-client';
        }
    };

    const getRoleBadgeText = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin';

            case 'agente':
                return 'Agente';

            case 'cliente':
                return 'Cliente';

            default:
                return role;
        }
    };

    return (
        <AdminLayout title="Gestión de Usuarios">
            <Head title="Usuarios - Admin" />

            <FlashMessages />

            <div className="space-y-6">

                {/* ENCABEZADO */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div className="vz-page-intro">
                        <p>
                            Gestiona los usuarios de la plataforma
                        </p>
                    </div>

                    <Link
                        href={route('admin.users.create')}
                        className="vz-btn"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nuevo Usuario
                    </Link>

                </div>

                {/* FILTROS */}
                <div className="vz-admin-panel">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="relative">

                            <MagnifyingGlassIcon
                                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2"
                                style={{
                                    color: 'var(--gris-texto)',
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="vz-form-input pl-10"
                            />

                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value)
                            }
                            className="vz-form-input"
                        >
                            <option value="all">
                                Todos los roles
                            </option>

                            <option value="admin">
                                Administrador
                            </option>

                            <option value="agente">
                                Agente
                            </option>

                            <option value="cliente">
                                Cliente
                            </option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value)
                            }
                            className="vz-form-input"
                        >
                            <option value="name">
                                Ordenar por nombre
                            </option>

                            <option value="email">
                                Ordenar por email
                            </option>

                            <option value="role">
                                Ordenar por rol
                            </option>

                            <option value="newest">
                                Más recientes
                            </option>
                        </select>

                    </div>

                </div>

                {/* ESTADÍSTICAS */}
                <div className="vz-admin-stats-grid">

                    <div className="vz-admin-stat-card">

                        <div className="vz-admin-stat-top">

                            <div>
                                <p className="vz-admin-stat-label">
                                    Total
                                </p>

                                <p className="vz-admin-stat-value">
                                    {activeUsers.length}
                                </p>
                            </div>

                            <div className="vz-admin-stat-icon vz-stat-gold">
                                <UsersIcon className="h-6 w-6" />
                            </div>

                        </div>

                    </div>

                    <div className="vz-admin-stat-card">

                        <div className="vz-admin-stat-top">

                            <div>
                                <p className="vz-admin-stat-label">
                                    Resultado
                                </p>

                                <p className="vz-admin-stat-value">
                                    {filteredUsers.length}
                                </p>
                            </div>

                            <div className="vz-admin-stat-icon vz-stat-success">
                                <UserGroupIcon className="h-6 w-6" />
                            </div>

                        </div>

                    </div>

                    <div className="vz-admin-stat-card">

                        <div className="vz-admin-stat-top">

                            <div>
                                <p className="vz-admin-stat-label">
                                    Rol
                                </p>

                                <p className="vz-admin-stat-value capitalize">
                                    {roleFilter === 'all'
                                        ? 'Todos'
                                        : roleFilter}
                                </p>
                            </div>

                            <div className="vz-admin-stat-icon vz-stat-purple">
                                <ShieldCheckIcon className="h-6 w-6" />
                            </div>

                        </div>

                    </div>

                </div>

                {/* SIN RESULTADOS */}
                {filteredUsers.length === 0 ? (

                    <div className="vz-admin-panel text-center">

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <MagnifyingGlassIcon className="h-8 w-8" />
                        </div>

                        <p className="text-lg font-medium">
                            No se encontraron usuarios que coincidan
                            con tu búsqueda
                        </p>

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="vz-btn-link mt-4"
                            >
                                Limpiar búsqueda
                            </button>
                        )}

                    </div>

                ) : (

                    /* TABLA */
                    <div className="vz-table-card">

                        <div className="overflow-x-auto">

                            <table className="vz-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Nombre
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Rol
                                        </th>

                                        <th>
                                            Teléfono
                                        </th>

                                        <th>
                                            Registrado
                                        </th>

                                        <th>
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredUsers.map((user) => (

                                        <tr key={user.id}>

                                            <td>
                                                <strong className="vz-table-primary">
                                                    {user.name}
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="vz-table-secondary">
                                                    {user.email}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`vz-status-badge ${getRoleBadgeColor(
                                                        user.role
                                                    )}`}
                                                >
                                                    {getRoleBadgeText(
                                                        user.role
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {user.phone || '-'}
                                            </td>

                                            <td>
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString(
                                                    'es-ES'
                                                )}
                                            </td>

                                            <td>

                                                <div className="flex items-center gap-2">

                                                    {/* EDITAR */}
                                                    <Link
                                                        href={route(
                                                            'admin.users.edit',
                                                            user.id
                                                        )}
                                                        className="vz-table-action"
                                                        title="Editar usuario"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Link>

                                                    {/* ELIMINAR */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    `¿Estás seguro de que deseas eliminar a ${user.name}?`
                                                                )
                                                            ) {
                                                                router.patch(
                                                                    route(
                                                                        'admin.users.update',
                                                                        user.id
                                                                    ),
                                                                    {
                                                                        account_status:
                                                                            'eliminado',
                                                                    },
                                                                    {
                                                                        preserveScroll:
                                                                            true,
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        className="vz-table-action vz-table-action-danger"
                                                        title="Eliminar usuario"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>

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