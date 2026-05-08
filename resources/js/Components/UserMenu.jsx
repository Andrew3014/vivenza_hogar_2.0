import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function UserMenu() {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
            >
                <span>{auth.user.name}</span>
                <ChevronDownIcon 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{auth.user.name}</p>
                        <p className="text-xs text-gray-500">{auth.user.email}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                            {auth.user.role === 'agente' ? 'Agente' : auth.user.role === 'admin' ? 'Administrador' : 'Comprador'}
                        </p>
                    </div>

                    <div className="py-2">
                        <Link
                            href={route('profile.edit')}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => setIsOpen(false)}
                        >
                            Mi Perfil
                        </Link>

                        {auth.user.role === 'agente' && (
                            <>
                                <Link
                                    href={route('properties.index')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Mis Propiedades
                                </Link>
                                <Link
                                    href={route('properties.create')}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    + Nueva Propiedad
                                </Link>
                            </>
                        )}

                        {auth.user.role === 'admin' && (
                            <>
                                <div className="border-t border-gray-200 my-2"></div>
                                <Link
                                    href={route('admin.dashboard')}
                                    className="block px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    🔧 Panel Admin
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 py-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
