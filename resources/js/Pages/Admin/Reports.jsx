import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    ChartBarIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    StarIcon,
    UsersIcon,
    BuildingOffice2Icon,
} from '@heroicons/react/24/outline';

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

                {/* USUARIOS POR ROL */}
                <div className="v-card">
                    <div className="flex items-center gap-3 mb-4">
                        <ChartBarIcon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">
                            Usuarios por Rol
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {usersByRole.map((row) => (
                            <li
                                key={row.role}
                                className="flex items-center justify-between"
                            >
                                <span className="capitalize">
                                    {row.role}
                                </span>

                                <strong>
                                    {row.total}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* PUBLICACIONES POR TIPO */}
                <div className="v-card">
                    <div className="flex items-center gap-3 mb-4">
                        <CurrencyDollarIcon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">
                            Publicaciones por Tipo
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {propertiesByType.map((row) => (
                            <li
                                key={
                                    row.transaction_type ||
                                    'sin_tipo'
                                }
                                className="flex items-center justify-between"
                            >
                                <span className="capitalize">
                                    {row.transaction_type ||
                                        'sin tipo'}
                                </span>

                                <strong>
                                    {row.total}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ESTADO DE VERIFICACIÓN */}
                <div className="v-card">
                    <div className="flex items-center gap-3 mb-4">
                        <UserGroupIcon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">
                            Estado de Verificación
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {verificationStatus.map((row) => (
                            <li
                                key={row.status}
                                className="flex items-center justify-between"
                            >
                                <span className="capitalize">
                                    {row.status}
                                </span>

                                <strong>
                                    {row.total}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* PUBLICADORES PREMIUM */}
                <div className="v-card">
                    <div className="flex items-center gap-3 mb-4">
                        <StarIcon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">
                            Publicadores Premium
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {premiumPublishers.map((user) => (
                            <li
                                key={user.id}
                                className="flex items-center justify-between"
                            >
                                <span>
                                    {user.name}
                                </span>

                                <strong>
                                    {user.properties_count}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ESTADO DE USUARIOS */}
                <div className="v-card">
                    <div className="flex items-center gap-3 mb-4">
                        <UsersIcon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">
                            Estado de Usuarios
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {usersByStatus.map((row) => (
                            <li
                                key={row.account_status}
                                className="flex items-center justify-between"
                            >
                                <span className="capitalize">
                                    {row.account_status}
                                </span>

                                <strong>
                                    {row.total}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ESTADO DE PUBLICACIONES */}
                <div className="v-card">
                    <div className="flex items-center gap-3 mb-4">
                        <BuildingOffice2Icon className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">
                            Estado de Publicaciones
                        </h3>
                    </div>

                    <ul className="space-y-2">
                        {propertiesByStatus.map((row) => (
                            <li
                                key={row.status}
                                className="flex items-center justify-between"
                            >
                                <span className="capitalize">
                                    {row.status}
                                </span>

                                <strong>
                                    {row.total}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </AdminLayout>
    );
}