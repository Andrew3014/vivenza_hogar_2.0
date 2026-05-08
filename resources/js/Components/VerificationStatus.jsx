import { Link } from '@inertiajs/react';

export default function VerificationStatus({ user }) {
    const verification = user?.verification;

    if (!verification) {
        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-bold text-blue-900">
                            📋 Tu cuenta no ha sido verificada
                        </p>
                        <p className="text-blue-700 text-sm mt-1">
                            Verifica tu identidad para que vendedores y compradores sepan que eres una persona real.
                        </p>
                    </div>
                </div>
                <Link
                    href="/verification"
                    className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    ✓ Verificar Ahora
                </Link>
            </div>
        );
    }

    if (verification.status === 'aprobado') {
        return (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-bold text-green-900">
                            ✅ Cuenta Verificada
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                            Tu identidad ha sido verificada correctamente. Los vendedores y compradores pueden confiar en ti.
                        </p>
                        <p className="text-green-600 text-xs mt-2">
                            Verificado por el equipo de Vivenza el{' '}
                            {new Date(verification.verified_at).toLocaleDateString('es-BO')}
                        </p>
                    </div>
                    <div className="text-3xl">🎉</div>
                </div>
            </div>
        );
    }

    if (verification.status === 'pendiente') {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-bold text-yellow-900">
                            ⏳ Verificación en Revisión
                        </p>
                        <p className="text-yellow-700 text-sm mt-1">
                            Tu verificación está siendo revisada por nuestro equipo. Esto puede tomar 24-48 horas.
                        </p>
                        <p className="text-yellow-600 text-xs mt-2">
                            Enviada el {new Date(verification.created_at).toLocaleDateString('es-BO')}
                        </p>
                    </div>
                    <div className="text-3xl">⏳</div>
                </div>
            </div>
        );
    }

    if (verification.status === 'rechazado') {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-bold text-red-900">
                            ✗ Verificación Rechazada
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                            {verification.rejection_reason || 'Tu verificación fue rechazada. Por favor intenta nuevamente.'}
                        </p>
                    </div>
                </div>
                <Link
                    href="/verification"
                    className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
                >
                    Intentar Nuevamente
                </Link>
            </div>
        );
    }

    return null;
}
