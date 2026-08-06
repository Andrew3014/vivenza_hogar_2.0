import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AgentLayout({ title, children }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const { url } = usePage();

    const menuItems = [
        {
            label: 'Dashboard',
            url: '/panel',
            icon: '📊'
        },
        {
            label: 'Mis Propiedades',
            url: '/agent/propiedades',
            icon: '🏠'
        },
        {
            label: 'Verificar Cuentas',
            url: '/agent/verificaciones',
            icon: '✅'
        },
        {
            label: 'Suscripciones',
            url: '/agent/suscripciones',
            icon: '💳'
        },
        {
            label: 'Mensajes',
            url: '/agent/mensajes',
            icon: '💬'
        },
    ];


    return (
        <div className="v-layout">

            {/* HEADER */}
            <header className="v-header">

                <Link href="/" className="v-logo">
                    🏠 VIVENZA
                </Link>


                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden text-gray-700"
                >
                    {
                        mobileOpen
                        ? <XMarkIcon className="w-7 h-7" />
                        : <Bars3Icon className="w-7 h-7" />
                    }
                </button>

            </header>


            <div className="flex">


                {/* SIDEBAR */}
                <aside
                    className={`
                        v-sidebar
                        ${mobileOpen ? 'block' : 'hidden'}
                        md:block
                    `}
                >

                    <h2 className="v-sidebar-title">
                        Panel de Agente
                    </h2>


                    <nav className="space-y-2">

                        {menuItems.map((item) => (

                            <Link
                                key={item.url}
                                href={item.url}
                                className={`
                                    v-menu-item
                                    ${
                                        url === item.url
                                        ? 'v-menu-active'
                                        : ''
                                    }
                                `}
                            >

                                <span className="mr-2">
                                    {item.icon}
                                </span>

                                {item.label}

                            </Link>

                        ))}

                    </nav>

                </aside>



                {/* CONTENIDO */}
                <main className="v-content">

                    {
                        title &&
                        <h1 className="v-title">
                            {title}
                        </h1>
                    }


                    {children}

                </main>


            </div>

        </div>
    );
}