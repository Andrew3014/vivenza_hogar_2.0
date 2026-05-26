import React, { useState } from 'react';
import { FaWhatsapp, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { router } from '@inertiajs/react';

export default function WhatsAppSettings({ user, onSave }) {
    const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsapp_number || '');
    const [isVisible, setIsVisible] = useState(user?.whatsapp_visible || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validate WhatsApp number format
        const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
        if (whatsappNumber && cleanNumber.length < 10) {
            setError('Por favor ingresa un número de WhatsApp válido (mínimo 10 dígitos)');
            setLoading(false);
            return;
        }

        router.post(
            route('user.update-whatsapp'),
            {
                whatsapp_number: whatsappNumber,
                whatsapp_visible: isVisible && whatsappNumber
            },
            {
                onSuccess: () => {
                    setSuccess('✓ Número de WhatsApp actualizado correctamente');
                    setTimeout(() => setSuccess(''), 3000);
                    if (onSave) onSave();
                },
                onError: (errors) => {
                    setError(errors.whatsapp_number || 'Error al actualizar el número');
                },
                onFinish: () => setLoading(false)
            }
        );
    };

    const isVerified = user?.is_verified;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FaWhatsapp className="text-green-500" />
                Contacto por WhatsApp
            </h3>

            {!isVerified && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    ⚠️ Debes verificar tu cuenta antes de habilitar WhatsApp
                </div>
            )}

            {isVerified && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    Tu cuenta está verificada
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
                {/* WhatsApp Number Input */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de WhatsApp
                    </label>
                    <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+34 612 345 678"
                        disabled={!isVerified}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        Formato: +34 612 345 678 (incluye código de país)
                    </p>
                </div>

                {/* Visibility Toggle */}
                <div className="border-t pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isVisible && whatsappNumber}
                            onChange={(e) => setIsVisible(e.target.checked)}
                            disabled={!isVerified || !whatsappNumber}
                            className="w-5 h-5 text-green-500 rounded cursor-pointer disabled:opacity-50"
                        />
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            {isVisible && whatsappNumber ? (
                                <>
                                    <FaEye className="text-green-500" />
                                    Los usuarios verificados pueden ver mi número
                                </>
                            ) : (
                                <>
                                    <FaEyeSlash className="text-gray-400" />
                                    Mantener número privado
                                </>
                            )}
                        </span>
                    </label>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                        <strong>💡 Cómo funciona:</strong> Solo los usuarios verificados podrán ver y contactarte por WhatsApp. 
                        Recibirán un mensaje pre-escrito sobre la propiedad que consultaron.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        ❌ {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                        {success}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !isVerified}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>

            {/* Current Status */}
            {whatsappNumber && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Estado actual:</p>
                    <p className="text-sm font-mono text-gray-900">{whatsappNumber}</p>
                    <p className="text-xs text-gray-600 mt-2">
                        {isVisible ? '✓ Visible para usuarios verificados' : '🔒 Privado'}
                    </p>
                </div>
            )}
        </div>
    );
}
