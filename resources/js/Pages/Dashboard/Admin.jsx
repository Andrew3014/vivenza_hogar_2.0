import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatCurrency } from '@/utils';

/**
 * Panel Administrativo - Gestión de Plataforma
 * 
 * Props desde Laravel:
 * - statistics: Estadísticas generales (totalUsers, totalProperties, etc)
 * - users: Array de usuarios
 * - properties: Array de propiedades
 * - subscriptions: Array de suscripciones
 */
export default function AdminDashboard({ statistics, users = [], properties = [], subscriptions = [] }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'properties', 'subscriptions', 'users'
    const [propertyFilter, setPropertyFilter] = useState('pendiente');
    const [expandedUser, setExpandedUser] = useState(null);

    // Filtrar propiedades
    const filteredProperties = propertyFilter === 'todas'
        ? properties
        : properties.filter(p => p.status === propertyFilter);

    // Acciones de propiedades
    const handlePropertyApprove = (propertyId) => {
        router.patch(route('admin.properties.approve', propertyId), {}, {
            onSuccess: () => {
                // Flash message mostrado automáticamente
            }
        });
    };

    const handlePropertyReject = (propertyId) => {
        if (window.confirm('¿Rechazar esta propiedad? El usuario será notificado.')) {
            router.patch(route('admin.properties.reject', propertyId), {}, {
                onSuccess: () => {
                    // Flash message mostrado automáticamente
                }
            });
        }
    };

    // Acciones de suscripciones
    const handleSubscriptionActivate = (subscriptionId) => {
        router.patch(route('admin.subscriptions.activate', subscriptionId), {}, {
            onSuccess: () => {
                // Flash message mostrado automáticamente
            }
        });
    };

    const handleSubscriptionCancel = (subscriptionId) => {
        if (window.confirm('¿Cancelar esta suscripción? El usuario perderá acceso a publicar propiedades.')) {
            router.patch(route('admin.subscriptions.cancel', subscriptionId), {}, {
                onSuccess: () => {
                    // Flash message mostrado automáticamente
                }
            });
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <p className="text-green-800 font-semibold">{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <span className="text-2xl">❌</span>
                            <p className="text-red-800 font-semibold">{flash.error}</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            🔐 Panel Administrativo
                        </h1>
                        <p className="text-gray-600">Gestión completa de la plataforma</p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 mb-8 overflow-x-auto">
                        {[
                            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                            { id: 'properties', label: '🏠 Propiedades', icon: '🏠' },
                            { id: 'subscriptions', label: '📦 Suscripciones', icon: '📦' },
                            { id: 'users', label: '👥 Usuarios', icon: '👥' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <>
                            {/* Statistics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
                                    <h3 className="text-gray-600 text-sm font-semibold mb-2">👥 Total Usuarios</h3>
                                    <p className="text-4xl font-bold text-blue-600">{statistics.totalUsers}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {statistics.activeUsers} activos
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
                                    <h3 className="text-gray-600 text-sm font-semibold mb-2">🏠 Total Propiedades</h3>
                                    <p className="text-4xl font-bold text-purple-600">{statistics.totalProperties}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {statistics.approvedProperties} aprobadas
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
                                    <h3 className="text-gray-600 text-sm font-semibold mb-2">📦 Suscripciones Activas</h3>
                                    <p className="text-4xl font-bold text-green-600">{statistics.activeSubscriptions}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Ingresos: {formatCurrency(statistics.revenue)}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-600">
                                    <h3 className="text-gray-600 text-sm font-semibold mb-2">⏳ Pendientes</h3>
                                    <p className="text-4xl font-bold text-yellow-600">{statistics.pendingProperties}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Requieren aprobación
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Acciones Rápidas</h3>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setActiveTab('properties')}
                                            className="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition-colors"
                                        >
                                            <p className="font-bold text-yellow-900">⏳ {statistics.pendingProperties} Propiedades Pendientes</p>
                                            <p className="text-sm text-yellow-700">Revisar y aprobar propiedades</p>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('subscriptions')}
                                            className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                                        >
                                            <p className="font-bold text-red-900">⚠️ {statistics.expiringSubscriptions} Suscripciones Venciendo</p>
                                            <p className="text-sm text-red-700">Gestionar suscripciones próximas a vencer</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Estadísticas Recientes</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Usuarios este mes:</span>
                                            <span className="font-bold text-blue-600">+{statistics.newUsersThisMonth}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Propiedades publicadas:</span>
                                            <span className="font-bold text-purple-600">+{statistics.newPropertiesThisMonth}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nuevas suscripciones:</span>
                                            <span className="font-bold text-green-600">+{statistics.newSubscriptionsThisMonth}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Properties Tab */}
                    {activeTab === 'properties' && (
                        <div className="bg-white rounded-lg shadow-lg">
                            {/* Header with Filters */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        🏠 Gestión de Propiedades
                                    </h2>
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                                        {filteredProperties.length} resultados
                                    </span>
                                </div>

                                {/* Filter Buttons */}
                                <div className="flex gap-2 flex-wrap">
                                    {['todas', 'pendiente', 'aprobado', 'rechazado'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setPropertyFilter(status)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                                propertyFilter === status
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {status === 'todas' ? 'Todas' :
                                             status === 'pendiente' ? '⏳ Pendientes' :
                                             status === 'aprobado' ? '✅ Aprobadas' :
                                             '❌ Rechazadas'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Table */}
                            {filteredProperties.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Propiedad</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Agente</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Precio</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ubicación</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredProperties.map(property => (
                                                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-bold text-gray-900 line-clamp-1">
                                                                {property.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500">ID: {property.id}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {property.user?.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {property.user?.email}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                                        {formatCurrency(property.price)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {property.location?.city}, {property.location?.state}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                                            property.status === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                            property.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {property.status === 'aprobado' ? '✅' :
                                                             property.status === 'pendiente' ? '⏳' :
                                                             '❌'}
                                                            {property.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={route('properties.show', property.id)}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                                            >
                                                                Ver
                                                            </Link>
                                                            {property.status === 'pendiente' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handlePropertyApprove(property.id)}
                                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                                                    >
                                                                        ✅ Aprobar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handlePropertyReject(property.id)}
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                                                    >
                                                                        ❌ Rechazar
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-2xl mb-2">📭</p>
                                    <p className="text-gray-600">No hay propiedades para mostrar</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Subscriptions Tab */}
                    {activeTab === 'subscriptions' && (
                        <div className="bg-white rounded-lg shadow-lg">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    📦 Gestión de Suscripciones
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Total: {subscriptions.length} suscripciones
                                </p>
                            </div>

                            {/* Grid of Subscriptions */}
                            {subscriptions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                    {subscriptions.map(subscription => (
                                        <div
                                            key={subscription.id}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                                        >
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">
                                                        {subscription.user?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {subscription.user?.email}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    subscription.status === 'activo'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {subscription.status === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                                                </span>
                                            </div>

                                            {/* Plan Info */}
                                            <div className="mb-4 pb-4 border-b border-gray-200">
                                                <p className="text-sm text-gray-600 mb-1">Plan</p>
                                                <p className="font-bold text-lg text-blue-600">
                                                    {subscription.plan_name}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    💰 {formatCurrency(subscription.price)} / mes
                                                </p>
                                            </div>

                                            {/* Dates */}
                                            <div className="space-y-2 text-sm mb-4">
                                                <div>
                                                    <p className="text-gray-600">Inicio</p>
                                                    <p className="font-semibold">
                                                        {new Date(subscription.start_date).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Vencimiento</p>
                                                    <p className="font-semibold">
                                                        {new Date(subscription.end_date).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Properties Available */}
                                            <div className="mb-4 pb-4 border-b border-gray-200">
                                                <p className="text-sm text-gray-600">Propiedades disponibles</p>
                                                <p className="font-bold text-lg">
                                                    {subscription.properties_left} / {subscription.properties_available}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {subscription.status === 'inactivo' ? (
                                                    <button
                                                        onClick={() => handleSubscriptionActivate(subscription.id)}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                                    >
                                                        ✅ Activar
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSubscriptionCancel(subscription.id)}
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                                    >
                                                        ❌ Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-2xl mb-2">📦</p>
                                    <p className="text-gray-600">No hay suscripciones registradas</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-lg shadow-lg">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    👥 Gestión de Usuarios
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    Total: {users.length} usuarios
                                </p>
                            </div>

                            {/* Users Table */}
                            {users.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nombre</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rol</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Propiedades</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Suscripción</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Registrado</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map(user => (
                                                <React.Fragment key={user.id}>
                                                    <tr className="hover:bg-gray-50 transition-colors cursor-pointer">
                                                        <td className="px-6 py-4">
                                                            <button
                                                                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                                                className="flex items-center gap-2 hover:text-blue-600"
                                                            >
                                                                <span className="text-xl">👤</span>
                                                                <p className="font-bold text-gray-900">{user.name}</p>
                                                                <span className="text-gray-400">
                                                                    {expandedUser === user.id ? '▼' : '▶'}
                                                                </span>
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                user.role === 'admin'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : user.role === 'agente'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {user.role === 'admin' ? '🔐 Admin' :
                                                                 user.role === 'agente' ? '🏢 Agente' :
                                                                 '👤 Cliente'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                            {user.properties_count || 0}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            {user.subscription ? (
                                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                                    user.subscription.status === 'activo'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {user.subscription.plan_name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-500 text-xs">Sin suscripción</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {new Date(user.created_at).toLocaleDateString('es-ES')}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={route('users.show', user.id)}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-bold transition-colors"
                                                                >
                                                                    Ver
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded Row */}
                                                    {expandedUser === user.id && (
                                                        <tr className="bg-gray-50">
                                                            <td colSpan="7" className="px-6 py-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 mb-3">
                                                                            Información Personal
                                                                        </h4>
                                                                        <div className="space-y-2 text-sm">
                                                                            <p><strong>Teléfono:</strong> {user.phone || 'No registrado'}</p>
                                                                            <p><strong>Registro:</strong> {new Date(user.created_at).toLocaleString('es-ES')}</p>
                                                                            <p><strong>Último acceso:</strong> {user.last_login ? new Date(user.last_login).toLocaleString('es-ES') : 'Nunca'}</p>
                                                                        </div>
                                                                    </div>
                                                                    {user.subscription && (
                                                                        <div>
                                                                            <h4 className="font-bold text-gray-900 mb-3">
                                                                                Suscripción
                                                                            </h4>
                                                                            <div className="space-y-2 text-sm">
                                                                                <p><strong>Plan:</strong> {user.subscription.plan_name}</p>
                                                                                <p><strong>Precio:</strong> {formatCurrency(user.subscription.price)}</p>
                                                                                <p><strong>Vence:</strong> {new Date(user.subscription.end_date).toLocaleDateString('es-ES')}</p>
                                                                                <p><strong>Estado:</strong> {user.subscription.status === 'activo' ? '✅ Activo' : '❌ Inactivo'}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-2xl mb-2">👥</p>
                                    <p className="text-gray-600">No hay usuarios registrados</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
