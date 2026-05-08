import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function EditUser() {
    return (
        <AdminLayout title="Editar Usuario">
            <Head title="Editar Usuario - Admin" />

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Página de edición de usuario (en desarrollo)</p>
            </div>
        </AdminLayout>
    );
}
