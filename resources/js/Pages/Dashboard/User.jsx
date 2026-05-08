import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AgentLayout from '@/Layouts/AgentLayout';
import VerificationStatus from '@/Components/VerificationStatus';
import { formatCurrency } from '@/utils';

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
    const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
    const [filterStatus, setFilterStatus] = useState('all');

    // Filtrar propiedades por estado
    const filteredProperties = filterStatus === 'all' 
        ? properties 
        : properties.filter(p => p.status === filterStatus);

    // Contar propiedades por estado
    const pendingCount = properties.filter(p => p.status === 'pendiente').length;
    const approvedCount = properties.filter(p => p.status === 'aprobado').length;
    const rejectedCount = properties.filter(p => p.status === 'rechazado').length;

    // Funciones para el estado
    const getStatusBadge = (status) => {
        const statusConfig = {
            pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'Pendiente' },
            aprobado: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Aprobado' },
            rechazado: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Rechazado' },
        };
        const config = statusConfig[status] || statusConfig.pendiente;
        return config;
    };

    const handleDelete = (propertyId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            router.delete(route('properties.destroy', propertyId));
        }
    };

    return (
        <AgentLayout title="📊 Dashboard">
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <span className="text-2xl">✅</span>
                            <p className="text-green-800">{flash.success}</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    👋 ¡Bienvenido, {user.name}!
                                </h1>
                                <p className="text-gray-600">
                                    Gestiona tus propiedades y suscripción desde aquí
                                </p>
                            </div>
                            {subscription && (
                                <Link
                                    href={route('properties.create')}
                                    className="bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg text-white font-bold py-3 px-8 rounded-lg transition-all"
                                >
                                    📝 Nueva Propiedad
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="mb-8">
                        <VerificationStatus user={user} />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Subscription Card */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
                            <h3 className="text-gray-600 text-sm font-semibold mb-2">📦 Suscripción</h3>
                            {subscription ? (
                                <>
                                    <p className="text-2xl font-bold text-blue-600 mb-3">
                                        {subscription.plan_name}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">
                                        Vence: <span className="font-semibold">{new Date(subscription.end_date).toLocaleDateString('es-ES')}</span>
                                    </p>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-2/3"></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-600 text-sm mb-3">Sin suscripción activa</p>
                                    <Link
                                        href={route('plans.index')}
                                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                    >
                                        Ver Planes →
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Total Properties */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
                            <h3 className="text-gray-600 text-sm font-semibold mb-2">🏠 Total Propiedades</h3>
                            <p className="text-3xl font-bold text-purple-600">
                                {properties.length}
                            </p>
                            {subscription && (
                                <p className="text-xs text-gray-600 mt-2">
                                    Máximo: {subscription.properties_available}
                                </p>
                            )}
                        </div>

                        {/* Approved Properties */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
                            <h3 className="text-gray-600 text-sm font-semibold mb-2">✅ Aprobadas</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {approvedCount}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                {approvedCount > 0 ? 'Visibles en plataforma' : 'Ninguna aprobada'}
                            </p>
                        </div>

                        {/* Pending Properties */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-600">
                            <h3 className="text-gray-600 text-sm font-semibold mb-2">⏳ Pendientes</h3>
                            <p className="text-3xl font-bold text-yellow-600">
                                {pendingCount}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                {pendingCount > 0 ? 'Esperando moderación' : 'Todas revisadas'}
                            </p>
                        </div>
                    </div>

                    {/* Properties Section */}
                    <div className="bg-white rounded-lg shadow-lg">
                        {/* Header with Controls */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    🏘️ Mis Propiedades
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                            viewMode === 'grid'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        📊 Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                            viewMode === 'table'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        📋 Tabla
                                    </button>
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                                        filterStatus === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Todas ({properties.length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus('aprobado')}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                                        filterStatus === 'aprobado'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    ✅ Aprobadas ({approvedCount})
                                </button>
                                <button
                                    onClick={() => setFilterStatus('pendiente')}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all ${
                                        filterStatus === 'pendiente'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    ⏳ Pendientes ({pendingCount})
                                </button>
                                {rejectedCount > 0 && (
                                    <button
                                        onClick={() => setFilterStatus('rechazado')}
                                        className={`px-4 py-2 rounded-full font-semibold transition-all ${
                                            filterStatus === 'rechazado'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        ❌ Rechazadas ({rejectedCount})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        {filteredProperties.length > 0 ? (
                            <>
                                {/* Grid View */}
                                {viewMode === 'grid' && (
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredProperties.map(property => {
                                                const statusConfig = getStatusBadge(property.status);
                                                return (
                                                    <div
                                                        key={property.id}
                                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                                    >
                                                        {/* Image */}
                                                        <div className="bg-gray-300 h-40 flex items-center justify-center relative group">
                                                            <span className="text-4xl">📷</span>
                                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-4">
                                                            {/* Title */}
                                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                                                {property.title}
                                                            </h3>

                                                            {/* Price */}
                                                            <p className="text-2xl font-bold text-blue-600 mb-3">
                                                                {formatCurrency(property.price)}
                                                            </p>

                                                            {/* Location */}
                                                            <p className="text-sm text-gray-600 mb-3">
                                                                📍 {property.location?.city}
                                                            </p>

                                                            {/* Status Badge */}
                                                            <div className="mb-4">
                                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                                                                    <span>{statusConfig.icon}</span>
                                                                    {statusConfig.label}
                                                                </span>
                                                            </div>

                                                            {/* Type & Features */}
                                                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
                                                                {property.type === 'venta' ? (
                                                                    <span>🔨 Venta</span>
                                                                ) : (
                                                                    <span>🏠 Alquiler</span>
                                                                )}
                                                                {property.bedrooms && <span>🛏️ {property.bedrooms}</span>}
                                                                {property.bathrooms && <span>🚿 {property.bathrooms}</span>}
                                                                {property.area && <span>📐 {property.area}m²</span>}
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex gap-2">
                                                                <Link
                                                                    href={route('properties.show', property.id)}
                                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-center text-sm transition-colors"
                                                                >
                                                                    👁️ Ver
                                                                </Link>
                                                                <Link
                                                                    href={route('properties.edit', property.id)}
                                                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded text-center text-sm transition-colors"
                                                                >
                                                                    ✏️ Editar
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(property.id)}
                                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-center text-sm transition-colors"
                                                                >
                                                                    🗑️ Eliminar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Table View */}
                                {viewMode === 'table' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Título</th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Precio</th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tipo</th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ubicación</th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredProperties.map(property => {
                                                    const statusConfig = getStatusBadge(property.status);
                                                    return (
                                                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                                <span className="line-clamp-2">{property.title}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                                                {formatCurrency(property.price)}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                {property.type === 'venta' ? '🔨 Venta' : '🏠 Alquiler'}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                {property.location?.city}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                                                                    {statusConfig.icon} {statusConfig.label}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <div className="flex gap-2">
                                                                    <Link
                                                                        href={route('properties.show', property.id)}
                                                                        title="Ver"
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                                                    >
                                                                        👁️
                                                                    </Link>
                                                                    <Link
                                                                        href={route('properties.edit', property.id)}
                                                                        title="Editar"
                                                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                                                    >
                                                                        ✏️
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(property.id)}
                                                                        title="Eliminar"
                                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                                                                    >
                                                                        🗑️
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
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sin propiedades</h3>
                                <p className="text-gray-600 mb-6">
                                    {filterStatus !== 'all'
                                        ? `No tienes propiedades ${filterStatus}`
                                        : subscription
                                            ? 'Aún no has publicado ninguna propiedad'
                                            : 'Necesitas una suscripción para publicar propiedades'}
                                </p>
                                {subscription && (
                                    <Link
                                        href={route('properties.create')}
                                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        📝 Publicar Mi Primera Propiedad
                                    </Link>
                                )}
                                {!subscription && (
                                    <Link
                                        href={route('plans.index')}
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    >
                                        📦 Ver Planes de Suscripción
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
                        <h3 className="font-bold text-blue-900 mb-3">💡 ¿Cómo funciona?</h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>✓ <strong>Pendiente:</strong> Tu propiedad está siendo revisada por nuestro equipo de moderación</li>
                            <li>✓ <strong>Aprobado:</strong> Tu propiedad es visible para todos los usuarios</li>
                            <li>✓ <strong>Rechazado:</strong> Verifica que tu propiedad cumpla con nuestros standards</li>
                            <li>✓ Puedes editar tus propiedades en cualquier momento</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AgentLayout>
    );
}
