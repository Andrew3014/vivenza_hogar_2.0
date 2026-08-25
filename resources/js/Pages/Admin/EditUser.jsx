import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const roleLabels = {
    admin: 'Administrador',
    agente: 'Agente',
    cliente: 'Comprador',
};

const statusLabels = {
    activo: 'Activo',
    suspendido: 'Suspendido',
    eliminado: 'Eliminado',
};

export default function EditUser({ user }) {
    const { flash } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        phone: user.phone || '',
        role: user.role || 'cliente',
        account_status: user.account_status || 'activo',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout title="Editar Usuario">
            <Head title="Editar Usuario - Admin" />

            <div className="max-w-2xl">

                {/* MENSAJE DE ÉXITO */}
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* MENSAJE DE ERROR */}
                {flash?.error && (
                    <div className="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
                        {flash.error}
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="v-card"
                >

                    {/* NOMBRE */}
                    <div className="v-form-group">
                        <InputLabel
                            htmlFor="name"
                            value="Nombre Completo"
                            className="v-label"
                        />

                        <TextInput
                            id="name"
                            type="text"
                            className="v-input mt-1"
                            value={data.name}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.name}
                            className="mt-2"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="v-form-group">
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="v-label"
                        />

                        <TextInput
                            id="email"
                            type="email"
                            className="v-input mt-1"
                            value={user.email}
                            disabled
                        />

                        <p className="text-sm text-gray-500 mt-1">
                            El email no se puede cambiar desde este panel.
                        </p>
                    </div>

                    {/* TELÉFONO */}
                    <div className="v-form-group">
                        <InputLabel
                            htmlFor="phone"
                            value="Teléfono"
                            className="v-label"
                        />

                        <TextInput
                            id="phone"
                            type="text"
                            className="v-input mt-1"
                            value={data.phone}
                            onChange={(e) =>
                                setData('phone', e.target.value)
                            }
                        />

                        <InputError
                            message={errors.phone}
                            className="mt-2"
                        />
                    </div>

                    {/* ROL */}
                    <div className="v-form-group">
                        <InputLabel
                            htmlFor="role"
                            value="Rol"
                            className="v-label"
                        />

                        <select
                            id="role"
                            className="v-input mt-1"
                            value={data.role}
                            onChange={(e) =>
                                setData('role', e.target.value)
                            }
                        >
                            {Object.entries(roleLabels).map(
                                ([value, label]) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                )
                            )}
                        </select>

                        <InputError
                            message={errors.role}
                            className="mt-2"
                        />
                    </div>

                    {/* ESTADO DE CUENTA */}
                    <div className="v-form-group">
                        <InputLabel
                            htmlFor="account_status"
                            value="Estado de la Cuenta"
                            className="v-label"
                        />

                        <select
                            id="account_status"
                            className="v-input mt-1"
                            value={data.account_status}
                            onChange={(e) =>
                                setData(
                                    'account_status',
                                    e.target.value
                                )
                            }
                        >
                            {Object.entries(statusLabels).map(
                                ([value, label]) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                )
                            )}
                        </select>

                        <InputError
                            message={errors.account_status}
                            className="mt-2"
                        />
                    </div>

                    {/* CAMBIAR CONTRASEÑA */}
                    <div className="pt-4 mt-4 border-t border-gray-200">

                        <p className="font-semibold text-gray-900 mb-1">
                            Cambiar contraseña
                        </p>

                        <p className="text-sm text-gray-500 mb-4">
                            Deja estos campos vacíos si no deseas cambiar
                            la contraseña.
                        </p>

                        {/* NUEVA CONTRASEÑA */}
                        <div className="v-form-group">
                            <InputLabel
                                htmlFor="password"
                                value="Nueva Contraseña"
                                className="v-label"
                            />

                            <TextInput
                                id="password"
                                type="password"
                                className="v-input mt-1"
                                value={data.password}
                                onChange={(e) =>
                                    setData(
                                        'password',
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* CONFIRMAR CONTRASEÑA */}
                        <div className="v-form-group mt-4">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmar Contraseña"
                                className="v-label"
                            />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                className="v-input mt-1"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                            />

                            <InputError
                                message={
                                    errors.password_confirmation
                                }
                                className="mt-2"
                            />
                        </div>

                    </div>

                    {/* ACCIONES */}
                    <div className="flex items-center gap-4 pt-4">

                        <PrimaryButton
                            disabled={processing}
                        >
                            {processing
                                ? 'Guardando...'
                                : 'Guardar Cambios'}
                        </PrimaryButton>

                        <Link
                            href={route('admin.users')}
                            className="px-4 py-2 rounded-lg"
                        >
                            Volver
                        </Link>

                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}