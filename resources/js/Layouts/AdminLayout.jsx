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
        { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
        { name: 'Usuarios', href: route('admin.users'), icon: UsersIcon },
        { name: 'Propiedades', href: route('admin.properties'), icon: BuildingOfficeIcon },
        { name: 'Suscripciones', href: route('admin.subscriptions'), icon: CreditCardIcon },
        { name: 'Reportes', href: route('admin.reports'), icon: ChartBarIcon },
        { name: 'Configuración', href: route('admin.settings'), icon: Cog6ToothIcon },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h1 className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>VIVENZA</h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-gray-800 rounded"
                    >
                        {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="mt-6 space-y-2 px-2 flex-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span className={!sidebarOpen && 'hidden'}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-700">
                    <a href={route('home')} className="flex items-center space-x-3 px-4 py-2 text-sm rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300">
                        <HomeIcon className="w-5 h-5" />
                        <span className={!sidebarOpen && 'hidden'}>Ir a Inicio</span>
                    </a>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <AdminHeader />

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        </div>
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
