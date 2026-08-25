import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PropertyForm from '@/Components/PropertyForm';

export default function PropertyEdit({ property, locations = [], subscription = null }) {
    return (
        <AppLayout>
            <Head title={`Editar ${property.title}`} />
            <PropertyForm property={property} locations={locations} subscription={subscription} />
        </AppLayout>
    );
}
