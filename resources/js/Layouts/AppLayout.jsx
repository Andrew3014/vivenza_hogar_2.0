import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

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
    className="relative"
    onMouseEnter={() => setUserMenuOpen(true)}
    onMouseLeave={() => setUserMenuOpen(false)}
>

    <button
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="vz-btn-user-menu"
    >
        👤 {auth.user.name} ▼
    </button>


    {userMenuOpen && (

        <div className="vz-dropdown">

            <Link
                href={route('dashboard')}
                className="vz-dropdown-item"
            >
                📊 Mi Panel
            </Link>


            <Link
                href={route('favorites.index')}
                className="vz-dropdown-item"
            >
                ♥ Favoritos
            </Link>


            <Link
                href={route('profile.edit')}
                className="vz-dropdown-item"
            >
                ⚙️ Perfil
            </Link>


            <Link
                href={route('payment.index')}
                className="vz-dropdown-item"
            >
                💳 Suscripción
            </Link>


            <div className="vz-dropdown-divider"></div>


            <Link
                href={route('logout')}
                method="post"
                as="button"
                className="vz-dropdown-item vz-dropdown-logout"
            >
                🚪 Cerrar Sesión
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