import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={`vz-form-section ${className}`}>
            <header>
                <h2 className="vz-form-title">Información del perfil</h2>

                <p className="vz-form-copy">
                    Actualiza tu nombre y correo para mantener tu cuenta al día.
                </p>
            </header>

            <form onSubmit={submit} className="vz-form-grid">
                <div>
                    <InputLabel htmlFor="name" value="Nombre" className="vz-form-label" />

                    <TextInput
                        id="name"
                        className="vz-form-input"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="vz-form-error" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="vz-form-label" />

                    <TextInput
                        id="email"
                        type="email"
                        className="vz-form-input"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="vz-form-error" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="vz-notice-banner vz-notice-warning">
                        <p>
                            Tu correo aún no está verificado.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="vz-inline-link"
                            >
                                Reenviar correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="vz-notice-success">
                                Se envió un nuevo enlace de verificación a tu correo.
                            </div>
                        )}
                    </div>
                )}

                <div className="vz-form-actions">
                    <PrimaryButton className="vz-primary-btn" disabled={processing}>Guardar</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="vz-form-success">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
