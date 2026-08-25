import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Bars3Icon,
    XMarkIcon,
    ChartBarIcon,
    HomeIcon,
    CheckBadgeIcon,
    CreditCardIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import VerificationNotice from '@/Components/VerificationNotice';

export default function AgentLayout({ title, children }) {

    const [mobileOpen, setMobileOpen] = useState(false);

    const { url } = usePage();

    const menuItems = [
        {
            label: 'Dashboard',
            url: '/panel',
            icon: ChartBarIcon
        },
        {
            label: 'Mis Propiedades',
            url: '/agent/propiedades',
            icon: HomeIcon
        },
        {
            label: 'Verificar Cuentas',
            url: '/agent/verificaciones',
            icon: CheckBadgeIcon
        },
        {
            label: 'Suscripciones',
            url: '/agent/suscripciones',
            icon: CreditCardIcon
        },
        {
            label: 'Mensajes',
            url: '/agent/mensajes',
            icon: ChatBubbleLeftRightIcon
        },
    ];

    return (
        <div className="v-layout">

            {/* HEADER */}
            <header className="v-header">

                <Link
                    href="/"
                    className="v-logo"
                >
                    <span className="flex items-center gap-2">
                        <HomeIcon className="w-6 h-6" />
                        <span>VIVENZA</span>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="vz-mobile-menu-btn md:hidden"
                    aria-label={
                        mobileOpen
                            ? 'Cerrar menú'
                            : 'Abrir menú'
                    }
                >
                    {mobileOpen ? (
                        <XMarkIcon className="w-7 h-7" />
                    ) : (
                        <Bars3Icon className="w-7 h-7" />
                    )}
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

                        {menuItems.map((item) => {

                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                                        v-menu-item
                                        ${
                                            url === item.url
                                                ? 'v-menu-active'
                                                : ''
                                        }
                                    `}
                                >
                                    <Icon
                                        className="w-5 h-5 shrink-0"
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            );

                        })}

                    </nav>

                </aside>

                {/* CONTENIDO */}
                <main className="v-content">

                    {title && (
                        <h1 className="v-title">
                            {title}
                        </h1>
                    )}

                    <VerificationNotice />

                    {children}

                </main>

            </div>

        </div>
    );
}