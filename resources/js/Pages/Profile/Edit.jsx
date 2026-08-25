import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import WhatsAppSettings from '@/Components/WhatsApp/WhatsAppSettings';

export default function Edit({ mustVerifyEmail, status, user }) {
    return (
        <AppLayout
            header={
                <h2 className="vz-page-title">Perfil</h2>
            }
        >
            <Head title="Perfil" />

            <div className="vz-profile-shell">
                <div className="vz-profile-container">
                    <div className="vz-profile-panel">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="vz-profile-panel">
                        <WhatsAppSettings user={user} className="max-w-xl" />
                    </div>

                    <div className="vz-profile-panel">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="vz-profile-panel vz-profile-panel-danger">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
