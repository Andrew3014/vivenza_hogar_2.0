import React from 'react';
import { FaWhatsapp, FaCheckCircle, FaLock } from 'react-icons/fa';

export default function ContactAgentViaWhatsApp({
    agent,
    currentUser,
    propertyTitle,
    showFullCard = true
}) {
    // Check if both users are verified
    const agentVerified = agent?.is_verified;
    const userVerified = currentUser?.is_verified;
    const agentHasWhatsApp = agent?.whatsapp_number && agent?.whatsapp_visible;

    if (!agentHasWhatsApp) {
        return null;
    }

    // Generate WhatsApp message with property info
    const generateMessage = () => {
        const message = `Hola ${agent.name}, estoy interesado en la propiedad "${propertyTitle}". Me gustaría obtener más información.`;
        return encodeURIComponent(message);
    };

    const whatsappUrl = `https://wa.me/${agent.whatsapp_number.replace(/[^0-9+]/g, '')}?text=${generateMessage()}`;

    if (!userVerified) {
        // Show locked message if user is not verified
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 text-red-700">
                    <FaLock className="text-lg" />
                    <div>
                        <p className="font-semibold">Contacto por WhatsApp Deshabilitado</p>
                        <p className="text-sm text-red-600">Verifica tu cuenta para contactar al agente directamente</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${showFullCard ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-6' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FaWhatsapp className="text-green-500 text-xl" />
                        Contactar por WhatsApp
                    </h3>

                    {/* Agent info with verification badge */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm text-gray-600">Agente de Ventas</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">{agent.name}</p>
                                    {agentVerified && (
                                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                            <FaCheckCircle className="text-xs" />
                                            Verificado
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp number */}
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Número de WhatsApp</p>
                            <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded text-gray-900 block">
                                {agent.whatsapp_number}
                            </code>
                        </div>

                        {/* Your verification status */}
                        <div className="border-t pt-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tu estado</p>
                            <div className="flex items-center gap-2 text-green-700">
                                <FaCheckCircle className="text-green-500" />
                                <span className="text-sm font-medium">
                                    Cuenta Verificada ✓
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                🔐 Ambos usuarios están verificados para máxima confianza y seguridad
                            </p>
                        </div>
                    </div>

                    {/* Message preview */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Mensaje que se enviará:</p>
                        <p className="text-sm text-gray-700 italic">
                            "Hola {agent.name}, estoy interesado en la propiedad &quot;{propertyTitle}&quot;. Me gustaría obtener más información."
                        </p>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    <FaWhatsapp className="text-xl" />
                    Abrir WhatsApp
                </a>

                {/* Copy number button */}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(agent.whatsapp_number);
                        alert('Número de WhatsApp copiado al portapapeles');
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200"
                    title="Copiar número de WhatsApp"
                >
                    Copiar #
                </button>
            </div>

            {/* Security notice */}
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-xs text-blue-700">
                <p>
                    <strong>💡 Información de seguridad:</strong> Al estar ambos verificados, puedes confiar en que la comunicación es segura.
                    Nuca compartas contraseñas o información sensible por WhatsApp.
                </p>
            </div>
        </div>
    );
}
