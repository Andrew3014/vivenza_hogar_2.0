import React from 'react';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

/**
 * Mini WhatsApp contact button for property cards
 * Shows when agent is verified and has WhatsApp visible
 */
export default function WhatsAppContactButton({
    agent,
    currentUser,
    propertyTitle,
    className = ''
}) {
    const agentHasWhatsApp = agent?.whatsapp_number && agent?.whatsapp_visible;
    const agentVerified = agent?.is_verified;
    const userVerified = currentUser?.is_verified;

    if (!agentHasWhatsApp || !userVerified) {
        return null;
    }

    const generateMessage = () => {
        const message = `Hola ${agent.name}, estoy interesado en la propiedad "${propertyTitle}". Me gustaría obtener más información.`;
        return encodeURIComponent(message);
    };

    const whatsappUrl = `https://wa.me/${agent.whatsapp_number.replace(/[^0-9+]/g, '')}?text=${generateMessage()}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg ${className}`}
            title={`Contactar a ${agent.name} por WhatsApp`}
        >
            <FaWhatsapp className="text-lg" />
            <span>WhatsApp</span>
            {agentVerified && (
                <FaCheckCircle className="text-sm ml-1" title="Agente Verificado" />
            )}
        </a>
    );
}
