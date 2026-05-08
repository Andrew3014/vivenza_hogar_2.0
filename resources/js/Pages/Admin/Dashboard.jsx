import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cards = [
        {
            label: 'Total Usuarios',
            value: stats.total_users,
            color: 'bg-blue-500',
            icon: '👥'
        },
        {
            label: 'Propiedades Activas',
            value: stats.total_properties,
            color: 'bg-green-500',
            icon: '🏠'
        },
        {
            label: 'Suscripciones Activas',
            value: stats.active_subscriptions,
            color: 'bg-purple-500',
            icon: '💳'
        },
        {
            label: 'Ingresos Mensuales',
            value: '$' + stats.monthly_revenue,
            color: 'bg-yellow-500',
            icon: '💰'
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{card.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                            </div>
                            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Usuarios Recientes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuarios Recientes</h3>
                    <div className="space-y-3">
                        {stats.recent_users && stats.recent_users.slice(0, 5).map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Propiedades Destacadas */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Propiedades Destacadas</h3>
                    <div className="space-y-3">
                        {stats.featured_properties && stats.featured_properties.slice(0, 5).map((property) => (
                            <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="font-medium text-gray-900">{property.title}</p>
                                    <p className="text-sm text-gray-500">${property.price.toLocaleString()}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                    property.status === 'aprobado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {property.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
