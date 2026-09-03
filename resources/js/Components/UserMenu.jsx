import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDownIcon, HomeIcon, HeartIcon, Cog6ToothIcon, CreditCardIcon, ArrowRightOnRectangleIcon, UserCircleIcon, CogIcon, MagnifyingGlassIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function UserMenu() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const isAdmin = auth?.user?.role === 'admin';
    const isAgent = auth?.user?.role === 'agente';
    const isClient = auth?.user?.role === 'cliente';

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    // Ref para evitar cerrar durante clicks internos
    const isClickingInsideRef = useRef(false);

    // Cerrar al hacer click fuera - USAR CLICK EN LUGAR DE MOUSEDOWN
    useEffect(() => {
        function handleClickOutside(event) {
            // Ignorar si el click fue dentro del dropdown o en el botón
            if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
                return;
            }
            if (buttonRef.current && buttonRef.current.contains(event.target)) {
                return;
            }
            setIsOpen(false);
        }

        // Usar 'click' en lugar de 'mousedown' para permitir clicks en enlaces
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Cerrar con tecla ESC
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Manejar teclado para accesibilidad
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleDropdown();
        }
        if (event.key === 'Escape') {
            closeDropdown();
        }
    };

    const userInitials = auth?.user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?';

    const roleLabels = {
        admin: 'Administrador',
        agente: 'Agente',
        cliente: 'Cliente',
    };

    const roleIcons = {
        admin: <CogIcon className="w-4 h-4" />,
        agente: <DocumentTextIcon className="w-4 h-4" />,
        cliente: <HomeIcon className="w-4 h-4" />,
    };

    const roleColors = {
        admin: 'bg-red-100 text-red-700',
        agente: 'bg-blue-100 text-blue-700',
        cliente: 'bg-green-100 text-green-700',
    };

    const menuItems = [
        { label: 'Mi Panel', href: route('dashboard'), icon: <HomeIcon className="w-4 h-4" />, roles: ['cliente', 'agente', 'admin'] },
        { label: 'Mis Favoritos', href: route('favorites.index'), icon: <HeartIcon className="w-4 h-4" />, roles: ['cliente', 'agente', 'admin'] },
        { label: 'Mi Perfil', href: route('profile.edit'), icon: <UserCircleIcon className="w-4 h-4" />, roles: ['cliente', 'agente', 'admin'] },
        { label: 'Suscripción', href: route('plans.index'), icon: <CreditCardIcon className="w-4 h-4" />, roles: ['cliente', 'agente'] },
        { label: 'Mis Propiedades', href: route('properties.index'), icon: <DocumentTextIcon className="w-4 h-4" />, roles: ['cliente', 'agente'] },
        { label: 'Publicar Propiedad', href: route('properties.create'), icon: <MagnifyingGlassIcon className="w-4 h-4" />, roles: ['cliente'] },
        { label: 'Panel Admin', href: route('admin.dashboard'), icon: <CogIcon className="w-4 h-4" />, roles: ['admin'] },
    ].filter(item => item.roles.includes(auth?.user?.role));

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    const userInitials = auth?.user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?';

    const roleLabels = {
        admin: 'Administrador',
        agente: 'Agente',
        cliente: 'Cliente',
    };

    const roleIcons = {
        admin: <CogIcon className="w-4 h-4" />,
        agente: <DocumentTextIcon className="w-4 h-4" />,
        cliente: <HomeIcon className="w-4 h-4" />,
    };

    const roleColors = {
        admin: 'bg-red-100 text-red-700',
        agente: 'bg-blue-100 text-blue-700',
        cliente: 'bg-green-100 text-green-700',
    };

    const menuItems = [
        { label: 'Mi Panel', href: route('dashboard'), icon: <HomeIcon className="w-4 h-4" />, roles: ['cliente', 'agente', 'admin'] },
        { label: 'Mis Favoritos', href: route('favorites.index'), icon: <HeartIcon className="w-4 h-4" />, roles: ['cliente', 'agente', 'admin'] },
        { label: 'Mi Perfil', href: route('profile.edit'), icon: <UserCircleIcon className="w-4 h-4" />, roles: ['cliente', 'agente', 'admin'] },
        { label: 'Suscripción', href: route('plans.index'), icon: <CreditCardIcon className="w-4 h-4" />, roles: ['cliente', 'agente'] },
        { label: 'Mis Propiedades', href: route('properties.index'), icon: <DocumentTextIcon className="w-4 h-4" />, roles: ['cliente', 'agente'] },
        { label: 'Publicar Propiedad', href: route('properties.create'), icon: <MagnifyingGlassIcon className="w-4 h-4" />, roles: ['cliente'] },
        { label: 'Panel Admin', href: route('admin.dashboard'), icon: <CogIcon className="w-4 h-4" />, roles: ['admin'] },
    ].filter(item => item.roles.includes(auth?.user?.role));

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setIsOpen(!isOpen);
                    }
                    if (event.key === 'Escape') {
                        setIsOpen(false);
                    }
                }
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Menú de usuario"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label={`Menú de usuario: ${auth.user?.name}`}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-semibold">
                        {userInitials}
                    </div>
                    <span className="hidden sm:block truncate max-w-[120px]">{auth.user.name}</span>
                    <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-500`}
                        aria-hidden="true"
                    />
                </div>
            </button>

            {isOpen && (
                <>
                    {/* Overlay para cerrar en móvil */}
                    <div
                        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-56 lg:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden animate-fade-in"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        {/* Header del usuario */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center text-sm font-semibold">
                                    {userInitials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${{
                                    admin: 'bg-red-100 text-red-700',
                                    agente: 'bg-blue-100 text-blue-700',
                                    cliente: 'bg-green-100 text-green-700',
                                }[auth?.user?.role]}`}>
                                    {roleIcons[auth?.user?.role]}
                                    {roleLabels[auth?.user?.role]}
                                </span>
                            </div>
                        </div>

                        <nav className="py-1" role="menu" aria-label="Opciones de cuenta">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    role="menuitem"
                                    tabIndex={-1}
                                >
                                    <span className="flex-shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true">
                                        {item.icon}
                                    </span>
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                            <form method="POST" action={route('logout')}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    role="menuitem"
                                    tabIndex={-1}
                                >
                                    <XMarkIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </form>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
}