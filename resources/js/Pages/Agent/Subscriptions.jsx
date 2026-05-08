import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head } from '@inertiajs/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AgentSubscriptions({ subscriptions = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const filtered = subscriptions.filter(sub => {
        const matchesSearch = sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = planFilter === 'all' || sub.plan === planFilter;
        const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
        return matchesSearch && matchesPlan && matchesStatus;
    });

    // Calcular estadísticas
    const activeCount = subscriptions.filter(s => s.status === 'activa').length;
    const totalRevenue = subscriptions
        .filter(s => s.status === 'activa')
        .reduce((acc, s) => {
            let price = 0;
            if (s.plan === 'basico') price = 9.99;
            if (s.plan === 'premium') price = 29.99;
            if (s.plan === 'enterprise') price = 99.99;
            return acc + price;
        }, 0);

    const expirationDays = (expDate) => {
        const now = new Date();
        const exp = new Date(expDate);
        const diff = exp - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const stats = [
        { label: 'Total', value: subscriptions.length, color: 'bg-blue-50', icon: '💳' },
        { label: 'Activas', value: activeCount, color: 'bg-green-50', icon: '✅' },
        { label: 'Inactivas', value: subscriptions.filter(s => s.status !== 'activa').length, color: 'bg-gray-50', icon: '❌' },
        { label: 'Ingreso Mensual', value: `$${totalRevenue.toFixed(2)}`, color: 'bg-yellow-50', icon: '💰' },
    ];

    const getPlanDetails = (plan) => {
        const plans = {
            basico: { name: 'Plan Básico', price: 9.99, color: 'bg-blue-100', icon: '🏠' },
            premium: { name: 'Plan Premium', price: 29.99, color: 'bg-purple-100', icon: '⭐' },
            enterprise: { name: 'Enterprise', price: 99.99, color: 'bg-gold-100', icon: '👑' }
        };
        return plans[plan] || { name: 'Desconocido', price: 0, color: 'bg-gray-100', icon: '❓' };
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'activa': return { text: 'Activa', color: 'bg-green-100 text-green-800', icon: '✅' };
            case 'cancelada': return { text: 'Cancelada', color: 'bg-red-100 text-red-800', icon: '❌' };
            case 'expirada': return { text: 'Expirada', color: 'bg-gray-100 text-gray-800', icon: '⏰' };
            default: return { text: 'Pausada', color: 'bg-yellow-100 text-yellow-800', icon: '⏸️' };
        }
    };

    return (
        <AgentLayout title="💳 Suscripciones de Clientes">
            <Head title="Suscripciones - Vivenza" />

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
                            placeholder="Buscar cliente o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los planes</option>
                        <option value="basico">🏠 Básico ($9.99/mes)</option>
                        <option value="premium">⭐ Premium ($29.99/mes)</option>
                        <option value="enterprise">👑 Enterprise ($99.99/mes)</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="activa">✅ Activas</option>
                        <option value="cancelada">❌ Canceladas</option>
                        <option value="expirada">⏰ Expiradas</option>
                        <option value="pausada">⏸️ Pausadas</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Suscripciones */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Plan</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Expira</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.length > 0 ? filtered.map((sub) => {
                                    const daysLeft = expirationDays(sub.expiration_date);
                                    const planDetails = getPlanDetails(sub.plan);
                                    const statusBadge = getStatusBadge(sub.status);
                                    return (
                                        <tr
                                            key={sub.id}
                                            onClick={() => setSelectedSubscription(sub)}
                                            className={`hover:bg-gray-50 cursor-pointer transition ${
                                                selectedSubscription?.id === sub.id ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-semibold">{sub.user?.name}</div>
                                                <div className="text-gray-600">{sub.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded ${planDetails.color} text-xs font-semibold`}>
                                                    {planDetails.icon} {planDetails.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge.color}`}>
                                                    {statusBadge.icon} {statusBadge.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className={daysLeft > 7 ? 'text-green-600' : 'text-red-600'}>
                                                    {daysLeft > 0 ? `${daysLeft} días` : 'Vencida'}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            No hay suscripciones que coincidan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Panel de Detalles */}
                {selectedSubscription && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Detalles de Suscripción</h2>

                        {/* Cliente */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-semibold text-lg">{selectedSubscription.user?.name}</p>
                            <p className="text-sm text-gray-600">{selectedSubscription.user?.email}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedSubscription.user?.phone}</p>
                        </div>

                        {/* Plan */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Plan Contratado</p>
                            {(() => {
                                const planDetails = getPlanDetails(selectedSubscription.plan);
                                return (
                                    <div className={`${planDetails.color} p-4 rounded-lg mt-2`}>
                                        <p className="text-lg font-bold">{planDetails.icon} {planDetails.name}</p>
                                        <p className="text-2xl font-bold">${planDetails.price}/mes</p>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Fechas */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Inicio</p>
                            <p className="font-semibold">{new Date(selectedSubscription.start_date).toLocaleDateString('es-BO')}</p>

                            <p className="text-sm text-gray-600 mt-3">Renovación</p>
                            <p className="font-semibold">{new Date(selectedSubscription.expiration_date).toLocaleDateString('es-BO')}</p>

                            {(() => {
                                const daysLeft = expirationDays(selectedSubscription.expiration_date);
                                return (
                                    <div className={`mt-3 p-2 rounded text-sm font-semibold ${daysLeft > 7 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {daysLeft > 0 ? `⏳ Vence en ${daysLeft} días` : '⏰ Vencida'}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Estado */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Estado Actual</p>
                            {(() => {
                                const statusBadge = getStatusBadge(selectedSubscription.status);
                                return (
                                    <p className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.color}`}>
                                        {statusBadge.icon} {statusBadge.text}
                                    </p>
                                );
                            })()}
                        </div>

                        {/* Acciones */}
                        {selectedSubscription.status === 'activa' && (
                            <div className="space-y-2">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                                    📧 Contactar Cliente
                                </button>
                                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg">
                                    ⏸️ Pausar Suscripción
                                </button>
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg">
                                    ❌ Cancelar Suscripción
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedSubscription(null)}
                            className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}
