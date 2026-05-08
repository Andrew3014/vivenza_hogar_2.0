import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatCurrency } from '@/utils';

/**
 * Página de Planes y Suscripciones
 * 
 * Muestra los planes disponibles con opción de compra via WhatsApp
 */
export default function PlansIndex({ userPlans = null }) {
    const { auth } = usePage().props;
    const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' o 'yearly'

    const plans = [
        {
            id: 'basico',
            name: '🚀 Básico',
            price: 50,
            yearlyPrice: 500, // 2 meses gratis
            max_properties: 5,
            can_featured: false,
            description: 'Perfecto para comenzar',
            highlighted: false,
            features: [
                { name: 'Hasta 5 propiedades', included: true },
                { name: 'Publicación de propiedades', included: true },
                { name: 'Propiedades destacadas', included: false },
                { name: 'Soporte por email', included: true },
                { name: 'Estadísticas básicas', included: false },
                { name: 'AppStore', included: false },
            ]
        },
        {
            id: 'profesional',
            name: '💼 Profesional',
            price: 150,
            yearlyPrice: 1500, // 2 meses gratis
            max_properties: 20,
            can_featured: true,
            description: 'Para agentes inmobiliarios',
            highlighted: true,
            badge: 'Más Popular',
            features: [
                { name: 'Hasta 20 propiedades', included: true },
                { name: 'Publicación de propiedades', included: true },
                { name: 'Propiedades destacadas (5)', included: true },
                { name: 'Soporte prioritario', included: true },
                { name: 'Estadísticas detalladas', included: true },
                { name: 'AppStore', included: false },
            ]
        },
        {
            id: 'enterprise',
            name: '🏢 Enterprise',
            price: 500,
            yearlyPrice: 5000, // 2 meses gratis
            max_properties: 100,
            can_featured: true,
            description: 'Para agencias inmobiliarias',
            highlighted: false,
            features: [
                { name: 'Hasta 100 propiedades', included: true },
                { name: 'Publicación de propiedades', included: true },
                { name: 'Propiedades destacadas ilimitadas', included: true },
                { name: 'Soporte 24/7 telefónico', included: true },
                { name: 'Estadísticas avanzadas', included: true },
                { name: 'App Store (iOS/Android)', included: true },
            ]
        }
    ];

    const getPrice = (plan) => {
        if (billingPeriod === 'yearly') {
            return plan.yearlyPrice;
        }
        return plan.price;
    };

    const handleBuyClick = (planId) => {
        if (!auth?.user) {
            // Redirigir a login
            window.location.href = route('login');
            return;
        }
        
        // Construir mensaje de WhatsApp
        const plan = plans.find(p => p.id === planId);
        const message = `Hola, quisiera contratar el plan ${plan.name} (${formatCurrency(getPrice(plan))}/mes)`;
        const whatsappUrl = `https://wa.me/59169422021?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            📦 Planes de Suscripción
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Elige el plan perfecto para tus necesidades inmobiliarias
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-4 bg-white rounded-full p-1 shadow-lg">
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                    billingPeriod === 'monthly'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                📅 Mensual
                            </button>
                            <button
                                onClick={() => setBillingPeriod('yearly')}
                                className={`px-6 py-2 rounded-full font-semibold transition-all relative ${
                                    billingPeriod === 'yearly'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                📅 Anual
                                <span className="absolute -top-2 -right-8 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Ahorra 17%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                                    plan.highlighted
                                        ? 'ring-2 ring-blue-600 md:scale-105 shadow-2xl'
                                        : 'shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="bg-green-500 text-white font-bold px-4 py-1 rounded-full text-sm">
                                            ⭐ {plan.badge}
                                        </div>
                                    </div>
                                )}

                                {/* Background */}
                                <div className="bg-white h-full flex flex-col">
                                    {/* Header */}
                                    <div
                                        className={`p-8 text-center ${
                                            plan.highlighted
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                                                : 'bg-gray-50 border-b border-gray-100'
                                        }`}
                                    >
                                        <h3
                                            className={`text-3xl font-bold mb-2 ${
                                                plan.highlighted ? 'text-white' : 'text-gray-900'
                                            }`}
                                        >
                                            {plan.name}
                                        </h3>
                                        <p
                                            className={`text-sm ${
                                                plan.highlighted ? 'text-blue-100' : 'text-gray-600'
                                            }`}
                                        >
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Price Section */}
                                    <div className="px-8 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-5xl font-bold text-blue-600">
                                                {formatCurrency(getPrice(plan)).replace(' BOB', '')}
                                            </span>
                                            <span className="text-gray-600 font-semibold">
                                                {billingPeriod === 'yearly' ? '/año' : '/mes'}
                                            </span>
                                        </div>
                                        {billingPeriod === 'yearly' && (
                                            <p className="text-sm text-green-600 font-semibold mt-2">
                                                Equivalente a {formatCurrency(getPrice(plan) / 12)}/mes
                                            </p>
                                        )}
                                    </div>

                                    {/* Properties Limit */}
                                    <div className="px-8 py-4 text-center border-t border-blue-100">
                                        <p className="text-sm text-gray-600">
                                            Hasta <span className="font-bold text-lg text-blue-600">{plan.max_properties}</span> propiedades
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="px-8 py-8 flex-grow">
                                        <p className="text-sm font-semibold text-gray-900 mb-4">
                                            ✨ Características:
                                        </p>
                                        <div className="space-y-4">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <span className={`text-lg flex-shrink-0 ${
                                                        feature.included ? '✅' : '❌'
                                                    }`}></span>
                                                    <span className={`text-sm ${
                                                        feature.included
                                                            ? 'text-gray-700 font-medium'
                                                            : 'text-gray-400 line-through'
                                                    }`}>
                                                        {feature.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="px-8 pb-8">
                                        <button
                                            onClick={() => handleBuyClick(plan.id)}
                                            className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 text-lg ${
                                                plan.highlighted
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                        >
                                            💬 Comprar Plan
                                        </button>
                                        <p className="text-xs text-gray-500 text-center mt-3">
                                            Te contactaremos por WhatsApp
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            📊 Comparativa de Planes
                        </h2>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                                                Características
                                            </th>
                                            {plans.map(plan => (
                                                <th
                                                    key={plan.id}
                                                    className="px-6 py-4 text-center text-sm font-bold text-gray-900"
                                                >
                                                    {plan.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">Propiedades</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="px-6 py-4 text-center text-gray-700">
                                                    <span className="font-bold text-lg text-blue-600">
                                                        {plan.max_properties}
                                                    </span>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">Destacadas</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="px-6 py-4 text-center text-2xl">
                                                    {plan.id === 'basico' && '❌'}
                                                    {plan.id === 'profesional' && '✅ 5/mes'}
                                                    {plan.id === 'enterprise' && '✅ Ilimitadas'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">Soporte</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="px-6 py-4 text-center text-gray-700">
                                                    {plan.id === 'basico' && 'Email'}
                                                    {plan.id === 'profesional' && 'Prioritario'}
                                                    {plan.id === 'enterprise' && '24/7'}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-gray-900">Estadísticas</td>
                                            {plans.map(plan => (
                                                <td key={plan.id} className="px-6 py-4 text-center text-2xl">
                                                    {plan.id === 'basico' && '❌'}
                                                    {plan.id === 'profesional' && '✅ Detalladas'}
                                                    {plan.id === 'enterprise' && '✅ Avanzadas'}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            ❓ Preguntas Frecuentes
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    💳 ¿Cómo funciona el pago?
                                </h3>
                                <p className="text-gray-600">
                                    Te contactaremos por WhatsApp para procesar tu pago de forma segura. Aceptamos transferencias bancarias, depósitos y otros métodos locales.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    🔄 ¿Puedo cambiar de plan?
                                </h3>
                                <p className="text-gray-600">
                                    Sí, puedes actualizar o cambiar tu plan en cualquier momento. Te ayudaremos con la transición.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    ❌ ¿Hay descuentos por cancelación?
                                </h3>
                                <p className="text-gray-600">
                                    Si necesitas cancelar, puedes hacerlo en cualquier momento. No hay penalización ni contratos a largo plazo.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    ⭐ ¿Qué son las propiedades destacadas?
                                </h3>
                                <p className="text-gray-600">
                                    Las propiedades destacadas aparecen en primer lugar en búsquedas y obtienen 5x más visibilidad en la plataforma.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    📝 ¿Incluye apoyo en la redacción?
                                </h3>
                                <p className="text-gray-600">
                                    El equipo del plan Enterprise recibe asistencia personalizada para optimizar sus listados.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                    📱 ¿Hay aplicación móvil?
                                </h3>
                                <p className="text-gray-600">
                                    El plan Enterprise incluye acceso a nuestra aplicación iOS y Android para gestionar propiedades sobre la marcha.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            🚀 ¿Listo para comenzar?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8">
                            Únete a cientos de agentes inmobiliarios que ya están vendiendo más propiedades
                        </p>
                        <button
                            onClick={() => {
                                if (!auth?.user) {
                                    window.location.href = route('login');
                                } else {
                                    const profesional = plans.find(p => p.id === 'profesional');
                                    const message = `Hola, quisiera contratar el plan ${profesional.name}`;
                                    const whatsappUrl = `https://wa.me/59169422021?text=${encodeURIComponent(message)}`;
                                    window.open(whatsappUrl, '_blank');
                                }
                            }}
                            className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all text-lg"
                        >
                            💬 Hablar con Ventas
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
