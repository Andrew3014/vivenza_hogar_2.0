import { Link } from '@inertiajs/react';

function BrandMark() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="vz-auth-brand-icon">
            <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-7H9v7H5a1 1 0 0 1-1-1v-8.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function ChatIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 18.5 3.5 20V6a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7Z" />
            <path d="M8 9h8M8 12h6" />
        </svg>
    );
}

export default function GuestLayout({ children }) {
    return (
        <div className="vz-auth-shell">
            <div className="vz-auth-topbar">
                <div className="vz-auth-topbar-inner">
                    <Link href={route('home')} className="vz-auth-brand">
                        <BrandMark />
                        <span>Vivenza Inmobiliaria</span>
                    </Link>
                </div>
            </div>

            <main className="vz-auth-main">
                <div className="vz-auth-panel">
                    {children}
                </div>
            </main>

            <footer className="vz-auth-footer">
                <div className="vz-auth-footer-inner">
                    <p>© 2026 Vivenza Inmobiliaria. Todos los derechos reservados.</p>
                    <div className="vz-auth-footer-links">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                        <a href="https://wa.me/59169422021" className="vz-auth-support-link">
                            <ChatIcon className="vz-auth-support-icon" />
                            <span>Soporte</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
