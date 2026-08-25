import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PropertyCard from '@/Components/PropertyCard';
import FlashMessages from '@/Components/FlashMessages';

export default function FavoritesIndex({ properties }) {
    const removeFavorite = (propertyId) => {
        router.delete(route('favorites.destroy', propertyId), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Mis favoritos" />

            <section className="max-w-7xl mx-auto px-4 py-10 text-gray-900 min-h-screen bg-gray-50">
                <FlashMessages />

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis favoritos</h1>
                        <p className="mt-2 text-gray-600">
                            Propiedades guardadas en tu cuenta para consultarlas después.
                        </p>
                    </div>
                    <Link
                        href={route('properties.index')}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Explorar propiedades →
                    </Link>
                </div>

                {properties.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.data.map((property) => (
                                <div key={property.id} className="relative">
                                    <PropertyCard property={property} />
                                    <button
                                        type="button"
                                        onClick={() => removeFavorite(property.id)}
                                        className="absolute top-3 left-3 z-10 bg-white/95 text-red-700 hover:bg-red-50 border border-red-200 rounded-full px-3 py-1 text-sm font-semibold shadow"
                                        aria-label={`Quitar ${property.title} de favoritos`}
                                    >
                                        ♥ Quitar
                                    </button>
                                </div>
                            ))}
                        </div>

                        {(properties.prev_page_url || properties.next_page_url) && (
                            <div className="flex justify-center items-center gap-4 mt-10">
                                {properties.prev_page_url ? (
                                    <Link
                                        href={properties.prev_page_url}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                    >
                                        ← Anterior
                                    </Link>
                                ) : (
                                    <span className="px-4 py-2 text-gray-400">← Anterior</span>
                                )}
                                <span className="text-sm text-gray-600">
                                    Página {properties.current_page} de {properties.last_page}
                                </span>
                                {properties.next_page_url ? (
                                    <Link
                                        href={properties.next_page_url}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                                    >
                                        Siguiente →
                                    </Link>
                                ) : (
                                    <span className="px-4 py-2 text-gray-400">Siguiente →</span>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow p-10 text-center">
                        <div className="text-5xl mb-4">♡</div>
                        <h2 className="text-xl font-bold text-gray-900">Aún no guardaste propiedades</h2>
                        <p className="text-gray-600 mt-2 mb-6">
                            Abre una publicación y usa el botón “Guardar en favoritos”.
                        </p>
                        <Link
                            href={route('properties.index')}
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                        >
                            Ver propiedades
                        </Link>
                    </div>
                )}
            </section>
        </AppLayout>
    );
}
