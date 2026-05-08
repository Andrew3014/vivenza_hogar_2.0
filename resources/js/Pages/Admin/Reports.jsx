import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Reports() {
    return (
        <AdminLayout title="Reportes">
            <Head title="Reportes - Admin" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Propiedades por Mes</h3>
                    <p className="text-gray-600">Gráfico de propiedades publicadas (en desarrollo)</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Ingresos por Suscripción</h3>
                    <p className="text-gray-600">Gráfico de ingresos (en desarrollo)</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Usuarios Activos</h3>
                    <p className="text-gray-600">Gráfico de crecimiento de usuarios (en desarrollo)</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">⭐ Propiedades Destacadas</h3>
                    <p className="text-gray-600">Análisis de propiedades destacadas (en desarrollo)</p>
                </div>
            </div>
        </AdminLayout>
    );
}
