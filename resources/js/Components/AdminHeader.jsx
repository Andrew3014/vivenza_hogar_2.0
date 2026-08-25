import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
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
        <header className="vz-admin-header">
            <div className="vz-admin-header-inner">
                <div className="vz-admin-header-left">
                    <Link
                        href={route('home')}
                        className="vz-admin-back-link"
                        title="Volver a la página principal"
                    >
                        <HomeIcon className="w-4 h-4" />
                        <span>Inicio</span>
                    </Link>
                </div>

                <div className="vz-admin-header-right" ref={dropdownRef}>
                    <div className="vz-admin-user-copy">
                        <p className="vz-admin-user-name">
                            Bienvenido, {auth.user.name.split(' ')[0]}
                        </p>
                        <p className="vz-admin-user-role">
                            {auth.user.role === 'admin' ? 'Administrador' : auth.user.role}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="vz-admin-user-button"
                        title="Menú de usuario"
                    >
                        {auth.user.name.charAt(0).toUpperCase()}
                    </button>

                    {isUserMenuOpen && (
                        <div className="vz-admin-dropdown">
                            <div className="vz-admin-dropdown-header">
                                <p className="vz-admin-dropdown-name">{auth.user.name}</p>
                                <p className="vz-admin-dropdown-email">{auth.user.email}</p>
                                <div className="vz-admin-dropdown-role-wrap">
                                    <span className="vz-admin-dropdown-role">
                                        {auth.user.role === 'admin' ? 'Administrador' : auth.user.role}
                                    </span>
                                </div>
                            </div>

                            <div className="vz-admin-dropdown-body">
                                <Link
                                    href={route('profile.edit')}
                                    className="vz-admin-dropdown-item"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <UserCircleIcon className="w-4 h-4 mr-3" />
                                    Mi Perfil
                                </Link>

                                <Link
                                    href={route('admin.settings')}
                                    className="vz-admin-dropdown-item"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                                    Configuración
                                </Link>
                            </div>

                            <div className="vz-admin-dropdown-footer">
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="vz-admin-dropdown-logout"
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
        </header>
    );
}
