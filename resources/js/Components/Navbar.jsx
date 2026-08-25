import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

/**
 * Navbar - Barra de Navegación Reutilizable con estilos VIVENZA
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
        <nav className={`vz-navbar ${className}`}>
            <div className="vz-container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '70px'
                }}>
                    {/* Logo */}
                    <Link 
                        href={route('home')} 
                        className="vz-logo"
                        style={{ textDecoration: 'none' }}
                    >
                        VIVENZA
                    </Link>

                    {/* Desktop Navigation */}
                    <div style={{
                        display: 'none',
                        '@media (min-width: 768px)': {
                            display: 'flex'
                        },
                        alignItems: 'center',
                        gap: '32px'
                    }} className="desktop-nav">
                        <Link
                            href={route('home')}
                            className="vz-nav-link"
                            style={{ 
                                textDecoration: 'none',
                                color: 'var(--gris-texto)',
                                fontWeight: '500',
                                fontSize: '14px',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            Inicio
                        </Link>

                        {!auth?.user ? (
                            <>
                                <Link
                                    href={route('plans.index')}
                                    className="vz-nav-link"
                                    style={{ 
                                        textDecoration: 'none',
                                        color: 'var(--gris-texto)',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    Planes
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="vz-btn-signin"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Ingresar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('home')}
                                    className="vz-nav-link"
                                    style={{ 
                                        textDecoration: 'none',
                                        color: 'var(--gris-texto)',
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        transition: 'color 0.3s ease'
                                    }}
                                >
                                    Propiedades
                                </Link>

                                {isAgente && (
                                    <Link
                                        href={route('properties.create')}
                                        className="vz-nav-link"
                                        style={{ 
                                            textDecoration: 'none',
                                            color: 'var(--gris-texto)',
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            transition: 'color 0.3s ease'
                                        }}
                                    >
                                        Publicar
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        style={{ 
                                            textDecoration: 'none',
                                            color: '#ff6b6b',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            transition: 'color 0.3s ease'
                                        }}
                                    >
                                        Admin
                                    </Link>
                                )}

                                {/* User Menu Desktop */}
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            background: 'var(--gris-oscuro)',
                                            color: 'var(--gris-texto)',
                                            padding: '10px 16px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--gris-oscuro)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                        onMouseEnter={() => setUserMenuOpen(true)}
                                    >
                                        <span>👤</span>
                                        <span className="hidden sm:inline">{auth.user.name}</span>
                                        <span>▼</span>
                                    </button>

                                    {userMenuOpen && (
                                        <div 
                                            style={{
                                                position: 'absolute',
                                                right: '0',
                                                marginTop: '8px',
                                                width: '224px',
                                                background: 'var(--negro-oscuro)',
                                                borderRadius: '8px',
                                                border: '1px solid var(--gris-oscuro)',
                                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                                                paddingTop: '8px',
                                                paddingBottom: '8px',
                                                zIndex: '10'
                                            }}
                                            onMouseLeave={() => setUserMenuOpen(false)}
                                        >
                                            <Link
                                                href={route('dashboard')}
                                                className="vz-menu-item"
                                                style={{
                                                    display: 'block',
                                                    paddingLeft: '16px',
                                                    paddingRight: '16px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    color: 'var(--gris-texto)',
                                                    transition: 'all 0.3s ease',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Mi Panel
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="vz-menu-item"
                                                style={{
                                                    display: 'block',
                                                    paddingLeft: '16px',
                                                    paddingRight: '16px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    color: 'var(--gris-texto)',
                                                    transition: 'all 0.3s ease',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Configuración
                                            </Link>
                                            <Link
                                                href={route('payment.index')}
                                                className="vz-menu-item"
                                                style={{
                                                    display: 'block',
                                                    paddingLeft: '16px',
                                                    paddingRight: '16px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    color: 'var(--gris-texto)',
                                                    transition: 'all 0.3s ease',
                                                    textDecoration: 'none',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Mi Suscripción
                                            </Link>
                                            <hr style={{
                                                margin: '8px 0',
                                                borderColor: 'var(--gris-oscuro)',
                                                backgroundColor: 'var(--gris-oscuro)'
                                            }} />
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="vz-menu-item-danger"
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    paddingLeft: '16px',
                                                    paddingRight: '16px',
                                                    paddingTop: '10px',
                                                    paddingBottom: '10px',
                                                    color: '#ff6b6b',
                                                    transition: 'all 0.3s ease',
                                                    border: 'none',
                                                    background: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Cerrar Sesión
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
                        style={{
                            display: 'none',
                            '@media (max-width: 768px)': {
                                display: 'block'
                            },
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--gris-texto)',
                            transition: 'all 0.3s ease'
                        }}
                        className="mobile-menu-btn"
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
                    <div style={{
                        paddingBottom: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        borderTop: '1px solid var(--gris-oscuro)',
                        paddingTop: '16px'
                    }}>
                        <Link
                            href={route('home')}
                            className="vz-mobile-link"
                            style={{
                                display: 'block',
                                paddingLeft: '16px',
                                paddingRight: '16px',
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                color: 'var(--gris-texto)',
                                borderRadius: '6px',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Inicio
                        </Link>

                        {!auth?.user ? (
                            <>
                                <Link
                                    href={route('plans.index')}
                                    className="vz-mobile-link"
                                    style={{
                                        display: 'block',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        color: 'var(--gris-texto)',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Planes
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="vz-btn-signin"
                                    style={{ 
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'block'
                                    }}
                                >
                                    Ingresar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="vz-mobile-link"
                                    style={{
                                        display: 'block',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        color: 'var(--gris-texto)',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Mi Panel
                                </Link>

                                {isAgente && (
                                    <Link
                                        href={route('properties.create')}
                                        className="vz-mobile-link"
                                        style={{
                                            display: 'block',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            color: 'var(--gris-texto)',
                                            borderRadius: '6px',
                                            transition: 'all 0.3s ease',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Publicar Propiedad
                                    </Link>
                                )}

                                {isAdmin && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="vz-mobile-link-admin"
                                        style={{
                                            display: 'block',
                                            paddingLeft: '16px',
                                            paddingRight: '16px',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                            color: '#ff6b6b',
                                            borderRadius: '6px',
                                            transition: 'all 0.3s ease',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Administración
                                    </Link>
                                )}

                                <Link
                                    href={route('payment.index')}
                                    className="vz-mobile-link"
                                    style={{
                                        display: 'block',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        color: 'var(--gris-texto)',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Mi Suscripción
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="vz-mobile-link"
                                    style={{
                                        display: 'block',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        color: 'var(--gris-texto)',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Configuración
                                </Link>
                                <hr style={{
                                    margin: '8px 0',
                                    borderColor: 'var(--gris-oscuro)',
                                    backgroundColor: 'var(--gris-oscuro)'
                                }} />
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="vz-mobile-link-danger"
                                    style={{
                                        textAlign: 'left',
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        paddingTop: '10px',
                                        paddingBottom: '10px',
                                        color: '#ff6b6b',
                                        borderRadius: '6px',
                                        transition: 'all 0.3s ease',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        border: 'none',
                                        background: 'none',
                                        cursor: 'pointer',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Cerrar Sesión
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-nav {
                        display: flex !important;
                    }
                    .mobile-menu-btn {
                        display: none !important;
                    }
                }

                @media (max-width: 767px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: block !important;
                    }
                }

                .vz-nav-link:hover {
                    color: var(--oro-claro) !important;
                }

                .vz-menu-item:hover {
                    background-color: var(--verde-salvia) !important;
                    color: white !important;
                }

                .vz-menu-item-danger:hover {
                    background-color: rgba(255, 107, 107, 0.1) !important;
                }

                .vz-mobile-link:hover {
                    background-color: var(--verde-salvia) !important;
                    color: white !important;
                }

                .vz-mobile-link-admin:hover {
                    background-color: rgba(255, 107, 107, 0.1) !important;
                }

                .mobile-menu-btn:hover {
                    background-color: var(--gris-oscuro) !important;
                }

                .hidden {
                    display: none;
                }

                @media (min-width: 640px) {
                    .sm\:inline {
                        display: inline;
                    }
                }
            `}</style>
        </nav>
    );
}