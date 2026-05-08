import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AgentLayout({ title, children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        { label: 'Dashboard', url: '/panel', icon: '📊' },
        { label: 'Mis Propiedades', url: '/agent/propiedades', icon: '🏠' },
        { label: 'Verificar Cuentas', url: '/agent/verificaciones', icon: '✅' },
        { label: 'Suscripciones de Clientes', url: '/agent/suscripciones', icon: '💳' },
        { label: 'Mensajes/Contactos', url: '/agent/mensajes', icon: '💬' },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-blue-600">
                                🏠 VIVENZA
                            </Link>
                        </div>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-gray-600"
                        >
                            {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${mobileOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-900 text-white min-h-screen`}>
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-8">Panel de Agente</h2>
                        <nav className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                                >
                                    {item.icon} {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
                    {children}
                </main>
            </div>
        </div>
    );
}
