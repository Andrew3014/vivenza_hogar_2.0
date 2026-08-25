import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

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

function DocumentIcon({ className = '', style }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
            <path d="M8 4.5h6.5L18.5 9v10.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.5 4.5V9h4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

/**
 * Aviso global de verificación de cuenta.
 *
 * Se muestra a cualquier usuario autenticado (excepto administradores) que
 * aún no tenga su identidad verificada, con dos opciones:
 * - "Verificar ahora": lleva a la página de verificación (Auth/VerifyIdentity)
 * - "Después": oculta el aviso hasta el próximo inicio de sesión (sessionStorage)
 *
 * Estados cubiertos:
 * - Sin verificación previa  -> botón principal + "Después"
 * - Pendiente de revisión    -> aviso informativo (sin ocultar)
 * - Rechazada                -> motivo + "Intentar de nuevo"
 * - Aprobada                 -> no se muestra nada
 */
export default function VerificationNotice() {
    const { auth } = usePage().props;
    const [dismissed, setDismissed] = useState(false);

    const user = auth?.user;
    if (!user || user.role === 'admin' || user.is_account_verified) {
        return null;
    }

    const storageKey = `vz_skip_verification_${user.id}`;

    if (dismissed || sessionStorage.getItem(storageKey) === '1') {
        return null;
    }

    const verification = user.verification;
    const status = verification?.status;

    if (status === 'aprobado') {
        return null;
    }

    const dismiss = () => {
        sessionStorage.setItem(storageKey, '1');
        setDismissed(true);
    };

    if (status === 'pendiente') {
        return (
            <div
                className="mb-6 rounded-xl border p-4"
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
                                Verificación en revisión
                            </p>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                            Tu solicitud de verificación está siendo revisada por nuestro equipo. Esto puede tomar 24-48 horas.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="mb-6 rounded-xl border p-4"
            style={{
                background: 'rgba(201, 169, 97, 0.08)',
                borderColor: 'rgba(201, 169, 97, 0.24)',
                borderLeft: '4px solid var(--oro-principal)',
            }}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <DocumentIcon className="h-4 w-4" style={{ color: 'var(--oro-principal)' }} />
                        <p className="font-bold" style={{ color: 'var(--blanco-crema)' }}>
                            Verifica tu cuenta
                        </p>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--gris-texto)' }}>
                        {status === 'rechazado'
                            ? `Tu verificación fue rechazada: ${verification.rejection_reason || 'intenta nuevamente con fotos más claras.'}`
                            : 'Verifica tu identidad para que vendedores y compradores sepan que eres una persona real y habilites tu número de WhatsApp.'}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
                <Link
                    href="/verification"
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all"
                    style={{
                        background: 'linear-gradient(135deg, var(--oro-claro), var(--oro-principal))',
                        color: 'var(--negro-profundo)',
                    }}
                >
                    <CheckIcon className="h-4 w-4" />
                    {status === 'rechazado' ? 'Intentar de nuevo' : 'Verificar ahora'}
                    <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <button
                    type="button"
                    onClick={dismiss}
                    className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition-all"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        borderColor: 'rgba(201, 169, 97, 0.22)',
                        color: 'var(--gris-texto)',
                    }}
                >
                    Después
                </button>
            </div>
        </div>
    );
}
