import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    ChevronDownIcon, 
    HomeIcon, 
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function AdminHeader({ onMenuToggle }) {
    const { auth } = usePage().props;
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Side - Logo/Back */}
                <div className="flex items-center space-x-4">
                    <Link 
                        href={route('home')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        title="Volver a la página principal"
                    >
                        <HomeIcon className="w-4 h-4" />
                        <span>Inicio</span>
                    </Link>
                </div>

                {/* Right Side - User Menu */}
                <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                            Bienvenido, {auth.user.name.split(' ')[0]}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                            {auth.user.role === 'admin' ? 'Administrador' : auth.user.role}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition-colors shadow-sm"
                        title="Menú de usuario"
                    >
                        {auth.user.name.charAt(0).toUpperCase()}
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200 top-full">
                            {/* User Info */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <p className="text-sm font-semibold text-gray-900">{auth.user.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{auth.user.email}</p>
                                <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                                        {auth.user.role === 'admin' ? '👮 Administrador' : auth.user.role}
                                    </span>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                                <Link
                                    href={route('profile.edit')}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <UserCircleIcon className="w-4 h-4 mr-3" />
                                    Mi Perfil
                                </Link>

                                <Link
                                    href={route('admin.settings')}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                                    Configuración
                                </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-200 py-2">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                                    Cerrar Sesión
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
