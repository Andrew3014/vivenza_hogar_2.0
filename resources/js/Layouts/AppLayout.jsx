import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const isAdmin = auth?.user?.role === 'admin';
    const isAgente = auth?.user?.role === 'agente';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-2">
                            <span className="text-2xl">🏠</span>
                            <span className="font-bold text-xl text-blue-600 hidden sm:inline">
                                Vivenza
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                href={route('home')}
                                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                            >
                                Inicio
                            </Link>

                            {!auth?.user ? (
                                <>
                                    <Link
                                        href={route('plans.index')}
                                        className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                                    >
                                        📦 Planes
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                    >
                                        Ingresar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('home')}
                                        className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                                    >
                                        📌 Propiedades
                                    </Link>

                                    {isAgente && (
                                        <Link
                                            href={route('properties.create')}
                                            className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                                        >
                                            📝 Publicar
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link
                                            href={route('admin.dashboard')}
                                            className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                                        >
                                            🔐 Admin
                                        </Link>
                                    )}

                                    {/* User Menu Desktop */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <span className="text-lg">👤</span>
                                            <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                                                {auth.user.name}
                                            </span>
                                            <span className="text-xs">▼</span>
                                        </button>

                                        {userMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                                <Link
                                                    href={route('dashboard')}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    📊 Mi Panel
                                                </Link>
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    ⚙️ Configuración
                                                </Link>
                                                <Link
                                                    href={route('payment.index')}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    💳 Mi Suscripción
                                                </Link>
                                                <hr className="my-2" />
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                                >
                                                    🚪 Cerrar Sesión
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden pb-4 space-y-2">
                            <Link
                                href={route('home')}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                            >
                                Inicio
                            </Link>

                            {!auth?.user ? (
                                <>
                                    <Link
                                        href={route('plans.index')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        📦 Planes
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="block px-4 py-2 bg-blue-600 text-white font-bold rounded transition-colors"
                                    >
                                        Ingresar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        📊 Mi Panel
                                    </Link>

                                    {isAgente && (
                                        <Link
                                            href={route('properties.create')}
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            📝 Publicar Propiedad
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link
                                            href={route('admin.dashboard')}
                                            className="block px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors font-semibold"
                                        >
                                            🔐 Administración
                                        </Link>
                                    )}

                                    <Link
                                        href={route('payment.index')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        💳 Mi Suscripción
                                    </Link>
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        ⚙️ Configuración
                                    </Link>
                                    <hr className="my-2" />
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors font-semibold"
                                    >
                                        🚪 Cerrar Sesión
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Sobre Nosotros */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="text-2xl">🏠</span>
                                Vivenza
                            </h3>
                            <p className="text-sm leading-relaxed">
                                La plataforma inmobiliaria más moderna de Bolivia. Conecta compradores, vendedores y agentes con facilidad.
                            </p>
                        </div>

                        {/* Enlaces Rápidos */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Enlaces Rápidos</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href={route('home')} className="hover:text-white transition-colors">
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('plans.index')} className="hover:text-white transition-colors">
                                        Planes
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Contacto
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Para Agentes */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Para Agentes</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href={route('plans.index')} className="hover:text-white transition-colors">
                                        Planes Premium
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Herramientas
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white transition-colors">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contacto */}
                        <div>
                            <h4 className="text-white font-bold mb-4">Contacto</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="tel:+59169422021" className="hover:text-white transition-colors">
                                        📱 +591 6942 2021
                                    </a>
                                </li>
                                <li>
                                    <a href="https://wa.me/59169422021" className="hover:text-white transition-colors">
                                        💬 WhatsApp
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@vivenza.bo" className="hover:text-white transition-colors">
                                        📧 info@vivenza.bo
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                            <p>
                                © 2026 Vivenza Inmobiliaria. Todos los derechos reservados.
                            </p>
                            <div className="flex gap-6 mt-4 md:mt-0">
                                <a href="#" className="hover:text-white transition-colors">
                                    Privacidad
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Términos
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Cookies
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Click outside to close menus */}
            {(mobileMenuOpen || userMenuOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setMobileMenuOpen(false);
                        setUserMenuOpen(false);
                    }}
                />
            )}
        </div>
    );
}
