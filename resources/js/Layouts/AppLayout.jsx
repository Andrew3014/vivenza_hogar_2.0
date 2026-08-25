import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import VerificationNotice from '@/Components/VerificationNotice';

function UserIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="8" r="4" />
        </svg>
    );
}

function ChevronDownIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function DashboardIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13.5h7V20H4zM13 4h7v7h-7zm0 10h7v6h-7zM4 4h7v7H4z" />
        </svg>
    );
}

function HeartIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.25c-5.25-3.56-8.75-6.77-8.75-11A4.75 4.75 0 0 1 8 4.5c1.6 0 3.09.76 4 2.02A4.95 4.95 0 0 1 16 4.5a4.75 4.75 0 0 1 4.75 4.75c0 4.23-3.5 7.44-8.75 11Z" />
        </svg>
    );
}

function SettingsIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.3 3.6a1 1 0 0 1 1.4 0l.8.8a1 1 0 0 0 1.4 0l.8-.8a1 1 0 0 1 1.4 0l.7.7a1 1 0 0 1 0 1.4l-.8.8a1 1 0 0 0 0 1.4l.8.8a1 1 0 0 1 0 1.4l-.7.7a1 1 0 0 1-1.4 0l-.8-.8a1 1 0 0 0-1.4 0l-.8.8a1 1 0 0 1-1.4 0l-.7-.7a1 1 0 0 1 0-1.4l.8-.8a1 1 0 0 0 0-1.4l-.8-.8a1 1 0 0 1 0-1.4l.7-.7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function CardIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function LogoutIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

export default function AppLayout({ children }) {

    const { auth } = usePage().props;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);


    const isAdmin = auth?.user?.role === 'admin';

    const canPublish = ['agente', 'cliente']
        .includes(auth?.user?.role);



    return (

        <div className="flex flex-col min-h-screen">


            {/* ================= NAVBAR ================= */}


            <nav className="vz-navbar">


                <div className="vz-container vz-navbar-container">



                    {/* LOGO */}


                    <Link
                        href={route('home')}
                        className="vz-logo"
                    >

                        VIVENZA

                    </Link>





                    {/* DESKTOP MENU */}


                    <div className="vz-menu-desktop">



                        <Link
                            href={route('home')}
                            className="vz-nav-link"
                        >
                            Inicio
                        </Link>





                        {!auth?.user ? (


                            <>


                                <Link
                                    href={route('plans.index')}
                                    className="vz-nav-link"
                                >
                                    Planes
                                </Link>




                                <Link
                                    href={route('login')}
                                    className="vz-btn-signin"
                                >
                                    Ingresar
                                </Link>



                            </>



                        ) : (


                            <>



                                <Link
                                    href={route('home')}
                                    className="vz-nav-link"
                                >
                                    Propiedades
                                </Link>





                                {canPublish && (


                                    <Link
                                        href={route('properties.create')}
                                        className="vz-nav-link"
                                    >
                                        Publicar
                                    </Link>


                                )}






                                {isAdmin && (


                                    <Link
                                        href={route('admin.dashboard')}
                                        className="vz-nav-link-admin"
                                    >
                                        Admin
                                    </Link>


                                )}






{/* USER MENU */}
<div 
    className="vz-user-wrapper"
    onMouseEnter={() => setUserMenuOpen(true)}
    onMouseLeave={() => setUserMenuOpen(false)}
>

    <button
        type="button"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="vz-btn-user-menu"
        aria-label="Menú de usuario"
    >
        <UserIcon className="vz-menu-icon" />
        <span>{auth.user.name}</span>
        <ChevronDownIcon className="vz-menu-chevron" />
    </button>


    {userMenuOpen && (

        <div className="vz-dropdown">

            <Link
                href={route('dashboard')}
                className="vz-dropdown-item"
            >
                <DashboardIcon className="vz-dropdown-icon" />
                <span>Mi Panel</span>
            </Link>


            <Link
                href={route('favorites.index')}
                className="vz-dropdown-item"
            >
                <HeartIcon className="vz-dropdown-icon" />
                <span>Favoritos</span>
            </Link>


            <Link
                href={route('profile.edit')}
                className="vz-dropdown-item"
            >
                <SettingsIcon className="vz-dropdown-icon" />
                <span>Perfil</span>
            </Link>


            <Link
                href={route('payment.index')}
                className="vz-dropdown-item"
            >
                <CardIcon className="vz-dropdown-icon" />
                <span>Suscripción</span>
            </Link>


            <div className="vz-dropdown-divider"></div>


            <Link
                href={route('logout')}
                method="post"
                as="button"
                className="vz-dropdown-item vz-dropdown-logout"
            >
                <LogoutIcon className="vz-dropdown-icon" />
                <span>Cerrar Sesión</span>
            </Link>

        </div>

    )}

</div>



                            </>



                        )}





                    </div>







                    {/* MOBILE BUTTON */}



                    <button

                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }

                        className="vz-mobile-menu-btn"

                        aria-label="Abrir menú"

                    >

                        ☰


                    </button>





                </div>



            </nav>







            {/* ================= MOBILE MENU ================= */}



            {mobileMenuOpen && (



                <div className="vz-mobile-menu">





                    <Link

                        href={route('home')}

                        className="vz-mobile-link"

                    >

                        Inicio


                    </Link>







                    {!auth?.user ? (



                        <>



                            <Link

                                href={route('plans.index')}

                                className="vz-mobile-link"

                            >

                                Planes


                            </Link>





                            <Link

                                href={route('login')}

                                className="vz-btn-signin"

                            >

                                Ingresar


                            </Link>




                        </>




                    ) : (



                        <>





                            <Link

                                href={route('dashboard')}

                                className="vz-mobile-link"

                            >

                                📊 Mi Panel


                            </Link>






                            {canPublish && (



                                <Link

                                    href={route('properties.create')}

                                    className="vz-mobile-link"

                                >

                                    📝 Publicar


                                </Link>


                            )}







                            {isAdmin && (



                                <Link

                                    href={route('admin.dashboard')}

                                    className="vz-mobile-link-admin"

                                >

                                    🔐 Admin


                                </Link>



                            )}







                            <Link

                                href={route('payment.index')}

                                className="vz-mobile-link"

                            >

                                💳 Suscripción


                            </Link>







                            <Link

                                href={route('profile.edit')}

                                className="vz-mobile-link"

                            >

                                ⚙️ Perfil


                            </Link>






                            <hr className="vz-divider"/>







                            <Link

                                href={route('logout')}

                                method="post"

                                as="button"

                                className="vz-mobile-link vz-danger-link"

                            >

                                🚪 Salir


                            </Link>




                        </>



                    )}




                </div>




            )}









            {/* ================= MAIN ================= */}



            <main className="vz-main">


                <div className="vz-container pt-6">
                    <VerificationNotice />
                </div>


                {children}


            </main>









            {/* ================= FOOTER ================= */}



            <footer className="vz-footer">



                <div className="vz-container vz-footer-grid">





                    <div>


                        <h3>

                            VIVENZA

                        </h3>


                        <p>

                            Plataforma inmobiliaria premium de Bolivia.
                            Conectando propiedades exclusivas con inversores sofisticados.

                        </p>


                    </div>







                    <div>


                        <h4>

                            Inicio

                        </h4>


                        <Link

                            href={route('plans.index')}

                            className="vz-footer-link"

                        >

                            Planes


                        </Link>




                        <Link

                            href={route('home')}

                            className="vz-footer-link"

                        >

                            Propiedades


                        </Link>



                    </div>







                    <div>



                        <h4>

                            Para Agentes

                        </h4>





                        <Link

                            href={route('plans.index')}

                            className="vz-footer-link"

                        >

                            Plan Premium


                        </Link>





                        <Link

                            href={route('properties.create')}

                            className="vz-footer-link"

                        >

                            Publicar Propiedad


                        </Link>



                    </div>








                    <div>


                        <h4>

                            Contacto

                        </h4>




                        <p>

                            📱 
                            <a
                                href="tel:+59169422021"
                                className="vz-link-gold"
                            >
                                +591 6942 2021
                            </a>

                        </p>





                        <p>

                            💬

                            <a

                                href="https://wa.me/59169422021"

                                className="vz-link-gold"

                            >

                                WhatsApp

                            </a>


                        </p>



                    </div>




                </div>








                <div className="vz-footer-bottom">


                    © 2026 Vivenza Inmobiliaria.
                    Todos los derechos reservados.


                </div>





            </footer>





        </div>


    );

}