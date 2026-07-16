import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function PropertyEdit({ property, locations = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        location_id: property.location_id ?? '',
        title: property.title ?? '',
        description: property.description ?? '',
        price: property.price ?? '',
        transaction_type: property.transaction_type ?? property.type ?? 'venta',
        currency: property.currency ?? 'USD',
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('properties.update', property.id));
    };

    return (
        <AppLayout>
            <Head title={`Editar ${property.title}`} />
            <form onSubmit={submit} className="mx-auto max-w-3xl space-y-4 p-6">
                <input value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Título" className="w-full rounded border p-2" />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Descripción" className="w-full rounded border p-2" rows={6} />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                <div className="grid gap-4 md:grid-cols-3">
                    <input type="number" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="Precio" className="rounded border p-2" />
                    <select value={data.transaction_type} onChange={(e) => setData('transaction_type', e.target.value)} className="rounded border p-2">
                        <option value="venta">Venta</option>
                        <option value="alquiler">Alquiler</option>
                        <option value="anticretico">Anticrético</option>
                        <option value="alquiler_diario">Alquiler diario</option>
                    </select>
                    <select value={data.currency} onChange={(e) => setData('currency', e.target.value)} className="rounded border p-2">
                        <option value="USD">USD</option>
                        <option value="BOB">BOB</option>
                    </select>
                </div>
                <select value={data.location_id} onChange={(e) => setData('location_id', e.target.value)} className="w-full rounded border p-2">
                    {locations.map((location) => <option key={location.id} value={location.id}>{location.name} — {location.city}</option>)}
                </select>
                <button disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white">Guardar cambios</button>
            </form>
        </AppLayout>
    );
}
