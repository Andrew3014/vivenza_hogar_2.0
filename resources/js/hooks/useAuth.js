import { usePage } from '@inertiajs/react';

export default function useAuth() {
    const { auth } = usePage().props;

    return {
        user: auth?.user,
        isAuthenticated: !!auth?.user,
        isAdmin: auth?.user?.role === 'admin',
        isAgente: auth?.user?.role === 'agente',
        isCliente: auth?.user?.role === 'cliente',
    };
}
