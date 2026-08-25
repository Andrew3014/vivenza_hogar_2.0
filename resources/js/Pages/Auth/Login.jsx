import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="vz-auth-icon">
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m5 7 7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="vz-auth-icon">
            <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M8 10V7.8A4 4 0 0 1 12 4a4 4 0 0 1 4 3.8V10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
    );
}

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

            <div className="vz-auth-header">
                <h1>Vivenza Inmobiliaria</h1>
                <p>Acceso a tu panel de control</p>
            </div>

            {status && (
                <div className="vz-auth-status">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="vz-auth-form">
                <div>
                    <InputLabel htmlFor="email" className="vz-auth-label">
                        <span className="vz-auth-label-wrap">
                            <MailIcon />
                            <span>Email</span>
                        </span>
                    </InputLabel>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="vz-auth-input"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@email.com"
                    />

                    <InputError message={errors.email} className="vz-auth-error" />
                </div>

                <div className="vz-auth-field">
                    <InputLabel htmlFor="password" className="vz-auth-label">
                        <span className="vz-auth-label-wrap">
                            <LockIcon />
                            <span>Contraseña</span>
                        </span>
                    </InputLabel>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="vz-auth-input"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="vz-auth-error" />
                </div>

                <div className="vz-auth-remember">
                    <label className="vz-auth-check">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span>Recuérdame</span>
                    </label>
                </div>

                <div className="vz-auth-actions">
                    {canResetPassword && (
                        <Link href={route('password.request')} className="vz-auth-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <PrimaryButton className="vz-auth-button" disabled={processing}>
                        {processing ? 'Ingresando...' : 'Ingresar'}
                    </PrimaryButton>
                </div>
            </form>

            <div className="vz-auth-register">
                <p>
                    ¿No tienes cuenta?{' '}
                    <Link href={route('register')} className="vz-auth-register-link">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}

Login.layout = (page) => <GuestLayout>{page}</GuestLayout>;
