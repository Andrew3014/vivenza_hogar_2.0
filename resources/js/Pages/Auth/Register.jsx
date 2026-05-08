import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

Register.layout = page => <GuestLayout>{page}</GuestLayout>;

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    🏠 Vivenza Inmobiliaria
                </h1>
                <p className="text-gray-600">Crea tu cuenta ahora</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="👤 Nombre" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-gray-300 rounded-lg focus:ring-blue-500"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                    />

                    <InputError message={errors.name} className="mt-2 text-red-600" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="📧 Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 rounded-lg focus:ring-blue-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-red-600" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="🔐 Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-gray-300 rounded-lg focus:ring-blue-500"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <InputError message={errors.password} className="mt-2 text-red-600" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="✓ Confirmar Contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-gray-300 rounded-lg focus:ring-blue-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="••••••••"
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-red-600"
                    />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    <PrimaryButton className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg" disabled={processing}>
                        {processing ? '⏳ Registrando...' : '✅ Registrarse'}
                    </PrimaryButton>

                    <Link
                        href={route('login')}
                        className="text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
