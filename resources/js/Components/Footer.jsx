import React from 'react';
import { Link } from '@inertiajs/react';

/**
 * Footer - Pie de Página Reutilizable
 * 
 * Props:
 * - className: clases adicionales
 */
export default function Footer({ className = '' }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`bg-gray-900 text-gray-300 mt-12 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-2xl">🏠</span>
                            <span>Vivenza</span>
                        </h3>
                        <p className="text-sm leading-relaxed">
                            La plataforma inmobiliaria más moderna de Bolivia. Conecta compradores, vendedores y agentes con facilidad.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                📱 Facebook
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                🐦 Twitter
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                📸 Instagram
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4">📌 Enlaces Rápidos</h4>
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
                                <Link href={route('login')} className="hover:text-white transition-colors">
                                    Ingresar
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Agents */}
                    <div>
                        <h4 className="text-white font-bold mb-4">🏢 Para Agentes</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Publicar Propiedad
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Mi Panel
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Estadísticas
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    Soporte
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-4">📞 Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="tel:+59169422021" className="hover:text-white transition-colors">
                                    📱 +591 694 22021
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@vivenza.bo" className="hover:text-white transition-colors">
                                    📧 info@vivenza.bo
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    💬 WhatsApp
                                </a>
                            </li>
                            <li>
                                <span>📍 La Paz, Bolivia</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Legal Links */}
                        <div className="text-sm space-x-4">
                            <a href="#" className="hover:text-white transition-colors">
                                Términos de Servicio
                            </a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="hover:text-white transition-colors">
                                Privacidad
                            </a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="hover:text-white transition-colors">
                                Cookies
                            </a>
                        </div>

                        {/* Compliance */}
                        <div className="text-sm text-center">
                            <p>Plataforma verificada y regulada</p>
                        </div>

                        {/* Copyright */}
                        <div className="text-sm text-right">
                            <p>© {currentYear} Vivenza. Todos los derechos reservados.</p>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-700">
                        <p>Vivenza es una plataforma inmobiliaria operada desde Bolivia para conectar a compradores, vendedores y agentes.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
