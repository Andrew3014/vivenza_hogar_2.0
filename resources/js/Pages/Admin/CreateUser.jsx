import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        role: 'cliente',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout title="Crear Nuevo Usuario">
            <Head title="Crear Usuario - Admin" />

            <div className="max-w-2xl">
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
                            onChange={(e) => setData('name', e.target.value)}
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
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />

                        <InputError
                            message={errors.email}
                            className="mt-2"
                        />
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
                            onChange={(e) => setData('phone', e.target.value)}
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
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="cliente">Comprador</option>
                            <option value="agente">Agente</option>
                            <option value="admin">Administrador</option>
                        </select>

                        <InputError
                            message={errors.role}
                            className="mt-2"
                        />
                    </div>

                    {/* CONTRASEÑA */}
                    <div className="v-form-group">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="v-label"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            className="v-input mt-1"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* CONFIRMAR CONTRASEÑA */}
                    <div className="v-form-group">
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
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* BOTÓN */}
                    <div className="flex items-center gap-4 pt-4">
                        <PrimaryButton
                            disabled={processing}
                        >
                            {processing ? 'Creando...' : 'Crear Usuario'}
                        </PrimaryButton>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}