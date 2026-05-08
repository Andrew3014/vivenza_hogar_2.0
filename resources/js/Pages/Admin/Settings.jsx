import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Settings() {
    return (
        <AdminLayout title="Configuración">
            <Head title="Configuración - Admin" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Configuración del Sistema</h3>
                        
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="ml-3 text-gray-900 font-medium">Mantenimiento habilitado</span>
                                </label>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="flex items-center">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="ml-3 text-gray-900 font-medium">Notificaciones por email</span>
                                </label>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <label className="block">
                                    <span className="text-gray-900 font-medium mb-2 block">Comisión por suscripción (%)</span>
                                    <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                </label>
                            </div>
                        </div>

                        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
