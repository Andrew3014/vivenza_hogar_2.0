import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    🏠 Vivenza Inmobiliaria
                </h1>
                <p className="text-gray-600">Acceso a tu panel de control</p>
            </div>

            {status && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="📧 Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 rounded-lg focus:ring-blue-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@email.com"
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 text-red-600" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-700 font-medium">
                            Recuérdame
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <PrimaryButton className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg" disabled={processing}>
                        {processing ? '⏳ Ingresando...' : '✅ Ingresar'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-blue-600 hover:text-blue-700"
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}

Login.layout = (page) => <GuestLayout>{page}</GuestLayout>;
