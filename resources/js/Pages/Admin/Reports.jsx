import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Reports({ reports = {} }) {
    const usersByRole = reports.users_by_role || [];
    const usersByStatus = reports.users_by_status || [];
    const verificationStatus = reports.verification_status || [];
    const propertiesByType = reports.properties_by_type || [];
    const propertiesByStatus = reports.properties_by_status || [];
    const premiumPublishers = reports.premium_publishers || [];

    return (
        <AdminLayout title="Reportes">
            <Head title="Reportes - Admin" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Usuarios por Rol</h3>
                    <ul className="space-y-2 text-gray-700">
                        {usersByRole.map((row) => (
                            <li key={row.role} className="flex items-center justify-between">
                                <span className="capitalize">{row.role}</span>
                                <strong>{row.total}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Publicaciones por Tipo</h3>
                    <ul className="space-y-2 text-gray-700">
                        {propertiesByType.map((row) => (
                            <li key={row.transaction_type || 'sin_tipo'} className="flex items-center justify-between">
                                <span className="capitalize">{row.transaction_type || 'sin tipo'}</span>
                                <strong>{row.total}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Estado de Verificación</h3>
                    <ul className="space-y-2 text-gray-700">
                        {verificationStatus.map((row) => (
                            <li key={row.status} className="flex items-center justify-between">
                                <span className="capitalize">{row.status}</span>
                                <strong>{row.total}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Publicadores Premium</h3>
                    <ul className="space-y-2 text-gray-700">
                        {premiumPublishers.map((user) => (
                            <li key={user.id} className="flex items-center justify-between">
                                <span>{user.name}</span>
                                <strong>{user.properties_count}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Usuarios</h3>
                    <ul className="space-y-2 text-gray-700">
                        {usersByStatus.map((row) => (
                            <li key={row.account_status} className="flex items-center justify-between">
                                <span className="capitalize">{row.account_status}</span>
                                <strong>{row.total}</strong>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Publicaciones</h3>
                    <ul className="space-y-2 text-gray-700">
                        {propertiesByStatus.map((row) => (
                            <li key={row.status} className="flex items-center justify-between">
                                <span className="capitalize">{row.status}</span>
                                <strong>{row.total}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
