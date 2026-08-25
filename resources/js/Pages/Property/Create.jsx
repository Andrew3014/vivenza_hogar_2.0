import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PropertyForm from '@/Components/PropertyForm';

/**
 * Página para Crear/Publicar Nueva Propiedad
 *
 * Props desde Laravel:
 * - locations: Array de ubicaciones disponibles
 * - subscription: Info de suscripción del usuario actual (con can_featured, properties_left, etc)
 */
export default function PropertyCreate({ locations = [], subscription }) {
    // Sin suscripción activa
    if (!subscription) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center py-8 text-gray-900">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-12 text-center">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Suscripción Requerida
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Necesitas una suscripción activa para publicar propiedades y acceder a todas nuestras herramientas.
                        </p>
                        <Link
                            href={route('plans.index')}
                            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all"
                        >
                            Ver Planes de Suscripción
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    // Suscripción activa pero sin propiedades disponibles
    if (subscription.properties_left <= 0) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center py-8 text-gray-900">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-12 text-center">
                        <div className="text-6xl mb-6">📦</div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Límite Alcanzado
                        </h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Has alcanzado el límite de propiedades para tu plan actual.
                        </p>
                        <p className="text-gray-600 mb-8">
                            Plan: <strong>{subscription.plan}</strong> ({subscription.properties_left} propiedades disponibles)
                        </p>
                        <Link
                            href={route('plans.index')}
                            className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all"
                        >
                            Mejorar Plan
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PropertyForm locations={locations} subscription={subscription} />
        </AppLayout>
    );
}
