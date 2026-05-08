import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Logo Bar */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href={route('home')} className="flex items-center gap-2">
                        <span className="text-3xl">🏠</span>
                        <span className="font-bold text-2xl text-blue-600">
                            Vivenza Inmobiliaria
                        </span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 space-y-3 md:space-y-0">
                        <p>
                            © 2026 Vivenza Inmobiliaria. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-blue-600 transition-colors">
                                Privacidad
                            </a>
                            <a href="#" className="hover:text-blue-600 transition-colors">
                                Términos
                            </a>
                            <a href="https://wa.me/59169422021" className="hover:text-blue-600 transition-colors">
                                💬 Soporte
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
