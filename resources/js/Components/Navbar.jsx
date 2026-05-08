import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

/**
 * Navbar - Barra de Navegación Reutilizable
 * 
 * Props:
 * - sticky: boolean (fijar en top)
 * - className: clases adicionales
 */
export default function Navbar({ sticky = true, className = '' }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const isAdmin = auth?.user?.role === 'admin';
    const isAgente = auth?.user?.role === 'agente';

    return (
        <nav className={`bg-white shadow-lg ${sticky ? 'sticky top-0 z-50' : ''} ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href={route('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
                            🏠 Inicio
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
                                        <div 
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10"
                                            onMouseLeave={() => setUserMenuOpen(false)}
                                        >
                                            <Link
                                                href={route('dashboard')}
                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                            >
                                                📊 Mi Panel
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                                            >
                                                ⚙️ Configuración
                                            </Link>
                                            <Link
                                                href={route('payment.index')}
                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
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
                        className="md:hidden p-2 rounded hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
                        <Link
                            href={route('home')}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-semibold"
                        >
                            🏠 Inicio
                        </Link>

                        {!auth?.user ? (
                            <>
                                <Link
                                    href={route('plans.index')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-semibold"
                                >
                                    📦 Planes
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="block px-4 py-2 bg-blue-600 text-white font-bold rounded transition-colors text-center"
                                >
                                    Ingresar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-semibold"
                                >
                                    📊 Mi Panel
                                </Link>

                                {isAgente && (
                                    <Link
                                        href={route('properties.create')}
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-semibold"
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
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-semibold"
                                >
                                    💳 Mi Suscripción
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-semibold"
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
    );
}
