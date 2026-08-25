import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function WhatsAppPayments({ user, subscription, whatsappNumber, plans }) {
    return (
        <AppLayout>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-900">
            {/* Header */}
            <section className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    💚 Contáctanos por WhatsApp
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Recibe atención personalizada sobre suscripciones, propiedades y soporte
                </p>
            </section>

            {/* User Info */}
            <section className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    👤 Tus datos
                </h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-gray-600">Nombre:</p>
                        <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                    </div>
                    {subscription && (
                        <div>
                            <p className="text-gray-600">Plan actual:</p>
                            <p className="text-lg font-semibold text-green-600">
                                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Plans Section */}
            <section className="max-w-6xl mx-auto px-4 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
                    📦 Nuestros Planes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(plans).map(([key, plan]) => (
                        <div 
                            key={key}
                            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {plan.name}
                            </h3>
                            
                            <div className="text-4xl font-bold text-green-600 mb-6">
                                {plan.price} <span className="text-lg text-gray-600">BOB/mes</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-gray-700">
                                    <span className="mr-3">✅</span>
                                    Máx. {plan.max_properties} propiedades
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="mr-3">{plan.can_featured ? '✅' : '❌'}</span>
                                    Propiedades destacadas
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <span className="mr-3">✅</span>
                                    Soporte prioritario
                                </li>
                            </ul>

                            <Link
                                href={route('payment.subscription', { plan: key })}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                            >
                                📱 Contactar vía WhatsApp
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="max-w-4xl mx-auto px-4 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    ⚡ Acciones rápidas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Support */}
                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                        <h3 className="text-xl font-bold text-blue-900 mb-3">
                            🆘 Soporte
                        </h3>
                        <p className="text-blue-800 mb-4">
                            ¿Tienes dudas? Nuestro equipo está disponible
                        </p>
                        <Link
                            href={route('payment.support')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Contactar soporte
                        </Link>
                    </div>

                    {/* Report Issue */}
                    <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-300">
                        <h3 className="text-xl font-bold text-orange-900 mb-3">
                            🐛 Reportar problema
                        </h3>
                        <p className="text-orange-800 mb-4">
                            Encontraste un error? Cuéntanos los detalles por WhatsApp
                        </p>
                        <a
                            href={whatsappNumber
                                ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Quiero reportar un problema en Vivenza: ')}`
                                : '#'
                            }
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Reportar ahora
                        </a>
                    </div>
                </div>
            </section>

            {/* WhatsApp Info */}
            <section className="bg-green-600 text-white rounded-lg p-8 max-w-2xl mx-auto mb-12">
                <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">💬</span>
                    <h2 className="text-2xl font-bold">¿Por qué WhatsApp?</h2>
                </div>
                
                <ul className="space-y-3 ml-12">
                    <li>✅ Respuesta rápida de nuestro equipo</li>
                    <li>✅ Sin costos de comunicación</li>
                    <li>✅ Funciona en cualquier dispositivo</li>
                    <li>✅ Historial de conversación guardado</li>
                    <li>✅ Comparte imágenes y documentos fácilmente</li>
                </ul>
            </section>

            {/* CTA */}
            <section className="text-center py-12 bg-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    ¿Listo para comenzar?
                </h2>
                <p className="text-gray-600 mb-6">
                    Elige cualquiera de nuestros planes y contacta a nuestro equipo
                </p>
                <Link
                    href={route('payment.subscription', { plan: 'basic' })}
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                >
                    Ir a WhatsApp 💚
                </Link>
            </section>
        </div>
        </AppLayout>
    );
}
