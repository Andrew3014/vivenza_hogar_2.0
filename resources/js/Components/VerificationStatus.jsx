import { Link } from '@inertiajs/react';

function DocumentIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M8 4.5h6.5L18.5 9v10.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.5 4.5V9h4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PendingIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7.5v5l3.5 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function XIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
    );
}

function ArrowRightIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function VerificationStatus({ user }) {
    const verification = user?.verification;

    if (!verification) {
        return (
            <div
                className="rounded-xl border p-4"
                style={{
                    background: 'rgba(201, 169, 97, 0.08)',
                    borderColor: 'rgba(201, 169, 97, 0.26)',
                    borderLeft: '4px solid var(--oro-principal)',
                }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <DocumentIcon className="h-4 w-4" style={{ color: 'var(--oro-principal)' }} />
                            <p className="font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                Tu cuenta no ha sido verificada
                            </p>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                            Verifica tu identidad para que vendedores y compradores sepan que eres una persona real.
                        </p>
                    </div>
                </div>
                <Link
                    href="/verification"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all"
                    style={{
                        background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                        color: 'var(--negro-profundo)',
                    }}
                >
                    <CheckIcon className="h-4 w-4" />
                    Verificar Ahora
                    <ArrowRightIcon className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    if (verification.status === 'aprobado') {
        return (
            <div
                className="rounded-xl border p-4"
                style={{
                    background: 'rgba(107, 142, 127, 0.10)',
                    borderColor: 'rgba(107, 142, 127, 0.35)',
                    borderLeft: '4px solid var(--verde-salvia)',
                }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <CheckIcon className="h-4 w-4" style={{ color: 'var(--verde-claro)' }} />
                            <p className="font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                Cuenta Verificada
                            </p>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                            Tu identidad ha sido verificada correctamente. Los vendedores y compradores pueden confiar en ti.
                        </p>
                        <p className="mt-2 text-xs" style={{ color: 'var(--verde-claro)' }}>
                            Verificado por el equipo de Vivenza el{' '}
                            {new Date(verification.verified_at).toLocaleDateString('es-BO')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (verification.status === 'pendiente') {
        return (
            <div
                className="rounded-xl border p-4"
                style={{
                    background: 'rgba(201, 169, 97, 0.08)',
                    borderColor: 'rgba(201, 169, 97, 0.26)',
                    borderLeft: '4px solid var(--oro-principal)',
                }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <PendingIcon className="h-4 w-4" style={{ color: 'var(--oro-principal)' }} />
                            <p className="font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                Verificación en Revisión
                            </p>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                            Tu verificación está siendo revisada por nuestro equipo. Esto puede tomar 24-48 horas.
                        </p>
                        <p className="mt-2 text-xs" style={{ color: 'var(--oro-claro)' }}>
                            Enviada el {new Date(verification.created_at).toLocaleDateString('es-BO')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (verification.status === 'rechazado') {
        return (
            <div
                className="rounded-xl border p-4"
                style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                    borderLeft: '4px solid #fca5a5',
                }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <XIcon className="h-4 w-4" style={{ color: '#fca5a5' }} />
                            <p className="font-bold" style={{ color: 'var(--blanco-crema)' }}>
                                Verificación Rechazada
                            </p>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                            {verification.rejection_reason || 'Tu verificación fue rechazada. Por favor intenta nuevamente.'}
                        </p>
                    </div>
                </div>
                <Link
                    href="/verification"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.28))',
                        color: '#fca5a5',
                        border: '1px solid rgba(239,68,68,0.28)',
                    }}
                >
                    Intentar Nuevamente
                    <ArrowRightIcon className="h-4 w-4" />
                </Link>
            </div>
        );
    }

    return null;
}
