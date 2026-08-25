import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    Cog6ToothIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function Settings() {
    return (
        <AdminLayout title="Configuración">
            <Head title="Configuración - Admin" />

            <div className="max-w-2xl">

                <div className="v-card">

                    <div className="flex items-start gap-4">

                        <div className="shrink-0">
                            <Cog6ToothIcon className="w-8 h-8" />
                        </div>

                        <div className="flex-1">

                            <h3 className="text-lg font-semibold mb-2">
                                Configuración del Sistema
                            </h3>

                            <p className="text-gray-600 mb-4">
                                Esta sección está en preparación. Los parámetros
                                globales del sistema (mantenimiento, notificaciones
                                y comisiones) se habilitarán en una próxima versión.
                            </p>

                            <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-800">

                                <InformationCircleIcon className="w-5 h-5 shrink-0" />

                                <p>
                                    Para ajustar comisiones o planes, contacta al
                                    administrador técnico o edita el catálogo en{' '}
                                    <code className="bg-blue-100 px-1 rounded">
                                        app/Support/Plans.php
                                    </code>.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}