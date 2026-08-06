import { useState } from 'react';
import AdminHeader from '@/Components/AdminHeader';
import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';

import {
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    CreditCardIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    XMarkIcon,
    Bars3Icon
} from '@heroicons/react/24/outline';


export default function AdminLayout({ children, title }) {

    const [sidebarOpen, setSidebarOpen] = useState(true);


    const menuItems = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: HomeIcon
        },
        {
            name: 'Usuarios',
            href: route('admin.users'),
            icon: UsersIcon
        },
        {
            name: 'Propiedades',
            href: route('admin.properties'),
            icon: BuildingOfficeIcon
        },
        {
            name: 'Suscripciones',
            href: route('admin.subscriptions'),
            icon: CreditCardIcon
        },
        {
            name: 'Reportes',
            href: route('admin.reports'),
            icon: ChartBarIcon
        },
        {
            name: 'Configuración',
            href: route('admin.settings'),
            icon: Cog6ToothIcon
        },
    ];


    return (

        <div className="v-layout flex">


            {/* SIDEBAR */}

            <aside
                className={`
                    v-sidebar
                    transition-all duration-300
                    ${sidebarOpen ? 'w-64' : 'w-20'}
                `}
            >


                {/* LOGO */}

                <div className="flex items-center justify-between mb-8">


                    {
                        sidebarOpen &&
                        <h1 className="text-xl font-bold">
                            VIVENZA
                        </h1>
                    }


                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-800"
                    >

                        {
                            sidebarOpen
                            ? <XMarkIcon className="w-5 h-5"/>
                            : <Bars3Icon className="w-5 h-5"/>
                        }

                    </button>


                </div>



                {/* MENU */}

                <nav className="space-y-2 flex-1">


                    {
                        menuItems.map((item)=>{

                            const Icon = item.icon;


                            return (

                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="v-menu-item"
                                >

                                    <Icon className="w-5 h-5 flex-shrink-0"/>


                                    {
                                        sidebarOpen &&
                                        <span>
                                            {item.name}
                                        </span>
                                    }


                                </Link>

                            );

                        })
                    }


                </nav>



                {/* FOOTER SIDEBAR */}

                <div className="mt-auto pt-5 border-t border-gray-700">


                    <Link
                        href={route('home')}
                        className="v-menu-item"
                    >

                        <HomeIcon className="w-5 h-5"/>


                        {
                            sidebarOpen &&
                            <span>
                                Ir a Inicio
                            </span>
                        }


                    </Link>


                </div>


            </aside>





            {/* CONTENIDO PRINCIPAL */}


            <section className="flex-1 flex flex-col">


                <AdminHeader />


                <main className="v-content flex-1 overflow-auto">


                    {
                        title &&
                        <h1 className="v-title">
                            {title}
                        </h1>
                    }


                    {children}


                </main>


                <Footer />


            </section>



        </div>

    );
}