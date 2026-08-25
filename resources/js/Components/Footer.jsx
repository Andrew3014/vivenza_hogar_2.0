import React from 'react';
import { Link } from '@inertiajs/react';

function HouseIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20h14V9.5" />
            <path d="M9 20v-6h6v6" />
        </svg>
    );
}

function PinIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function MobileIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="7" y="2.5" width="10" height="19" rx="2" />
            <path d="M11 18h2" />
        </svg>
    );
}

function MailIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
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

function CompassIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <path d="m15.5 8.5-2.3 6.3-6.3 2.3 2.3-6.3 6.3-2.3Z" />
        </svg>
    );
}

function ArrowRightIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m13 5 7 7-7 7" />
        </svg>
    );
}

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
                            <HouseIcon className="vz-footer-icon" />
                            <span>Vivenza</span>
                        </h3>
                        <p className="text-sm leading-relaxed">
                            La plataforma inmobiliaria más moderna de Bolivia. Conecta compradores, vendedores y agentes con facilidad.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                                <CompassIcon className="vz-social-icon" />
                                <span>Facebook</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                                <ChatIcon className="vz-social-icon" />
                                <span>Twitter</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                                <PinIcon className="vz-social-icon" />
                                <span>Instagram</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 inline-flex items-center gap-2">
                            <CompassIcon className="vz-footer-section-icon" />
                            <span>Enlaces Rápidos</span>
                        </h4>
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
                                <a href="#" className="hover:text-white transition-colors inline-flex items-center gap-2">
                                    <ArrowRightIcon className="vz-footer-mini-icon" />
                                    <span>Contacto</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* For Agents */}
                    <div>
                        <h4 className="text-white font-bold mb-4 inline-flex items-center gap-2">
                            <HouseIcon className="vz-footer-section-icon" />
                            <span>Para Agentes</span>
                        </h4>
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
                        <h4 className="text-white font-bold mb-4 inline-flex items-center gap-2">
                            <MobileIcon className="vz-footer-section-icon" />
                            <span>Contacto</span>
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="tel:+59169422021" className="hover:text-white transition-colors inline-flex items-center gap-2">
                                    <MobileIcon className="vz-footer-mini-icon" />
                                    <span>+591 694 22021</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@vivenza.bo" className="hover:text-white transition-colors inline-flex items-center gap-2">
                                    <MailIcon className="vz-footer-mini-icon" />
                                    <span>info@vivenza.bo</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors inline-flex items-center gap-2">
                                    <ChatIcon className="vz-footer-mini-icon" />
                                    <span>WhatsApp</span>
                                </a>
                            </li>
                            <li>
                                <span className="inline-flex items-center gap-2">
                                    <PinIcon className="vz-footer-mini-icon" />
                                    <span>La Paz, Bolivia</span>
                                </span>
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
