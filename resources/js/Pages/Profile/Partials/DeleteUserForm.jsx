import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`vz-form-section ${className}`}>
            <header>
                <h2 className="vz-form-title vz-form-title-danger">Eliminar cuenta</h2>

                <p className="vz-form-copy">
                    Esta acción eliminará permanentemente tu cuenta y todos los datos asociados.
                    Antes de continuar, asegúrate de guardar cualquier información importante.
                </p>
            </header>

            <DangerButton className="vz-danger-btn" onClick={confirmUserDeletion}>
                Eliminar cuenta
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="vz-modal-form">
                    <h2 className="vz-modal-title">¿Estás seguro de eliminar tu cuenta?</h2>

                    <p className="vz-form-copy">
                        Esta acción es irreversible. Ingresa tu contraseña para confirmar la eliminación permanente.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="vz-form-input vz-form-input-modal"
                            isFocused
                            placeholder="Contraseña"
                        />

                        <InputError message={errors.password} className="vz-form-error" />
                    </div>

                    <div className="vz-modal-actions">
                        <SecondaryButton onClick={closeModal} className="vz-secondary-btn">
                            Cancelar
                        </SecondaryButton>

                        <DangerButton className="vz-danger-btn" disabled={processing}>
                            Eliminar cuenta
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
