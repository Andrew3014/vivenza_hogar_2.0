import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="vz-auth-icon">
            <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
    );
}

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

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="vz-auth-icon">
            <path d="M5 12.5 9.5 17 19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

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

            <div className="vz-auth-header">
                <h1>Vivenza Inmobiliaria</h1>
                <p>Crea tu cuenta ahora</p>
            </div>

            <form onSubmit={submit} className="vz-auth-form">
                <div>
                    <InputLabel htmlFor="name" className="vz-auth-label">
                        <span className="vz-auth-label-wrap">
                            <UserIcon />
                            <span>Nombre</span>
                        </span>
                    </InputLabel>

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="vz-auth-input"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                    />

                    <InputError message={errors.name} className="vz-auth-error" />
                </div>

                <div className="vz-auth-field">
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
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <InputError message={errors.password} className="vz-auth-error" />
                </div>

                <div className="vz-auth-field">
                    <InputLabel htmlFor="password_confirmation" className="vz-auth-label">
                        <span className="vz-auth-label-wrap">
                            <CheckIcon />
                            <span>Confirmar contraseña</span>
                        </span>
                    </InputLabel>

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="vz-auth-input"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="vz-auth-error"
                    />
                </div>

                <div className="vz-auth-actions">
                    <PrimaryButton className="vz-auth-button" disabled={processing}>
                        {processing ? 'Registrando...' : 'Registrarse'}
                    </PrimaryButton>

                    <Link href={route('login')} className="vz-auth-link">
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
