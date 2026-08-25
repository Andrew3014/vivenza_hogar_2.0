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
                    setSuccess('Número de WhatsApp actualizado correctamente');
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
        <div className="vz-whatsapp-card">
            <h3 className="vz-whatsapp-title">
                <FaWhatsapp className="vz-whatsapp-icon" />
                Contacto por WhatsApp
            </h3>

            {!isVerified && (
                <div className="vz-notice-banner vz-notice-warning">
                    Debes verificar tu cuenta antes de habilitar WhatsApp.
                </div>
            )}

            {isVerified && (
                <div className="vz-notice-banner vz-notice-success">
                    <FaCheckCircle className="vz-whatsapp-verified" />
                    Tu cuenta está verificada.
                </div>
            )}

            <form onSubmit={handleSave} className="vz-whatsapp-form">
                <div>
                    <label className="vz-form-label">Número de WhatsApp</label>
                    <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+34 612 345 678"
                        disabled={!isVerified}
                        className="vz-form-input"
                    />
                    <p className="vz-form-hint">
                        Formato: +34 612 345 678 (incluye código de país)
                    </p>
                </div>

                <div className="vz-whatsapp-toggle-wrap">
                    <label className="vz-whatsapp-toggle">
                        <input
                            type="checkbox"
                            checked={isVisible && whatsappNumber}
                            onChange={(e) => setIsVisible(e.target.checked)}
                            disabled={!isVerified || !whatsappNumber}
                        />
                        <span className="vz-whatsapp-toggle-copy">
                            {isVisible && whatsappNumber ? (
                                <>
                                    <FaEye className="vz-whatsapp-visibility" />
                                    Los usuarios verificados pueden ver mi número
                                </>
                            ) : (
                                <>
                                    <FaEyeSlash className="vz-whatsapp-visibility" />
                                    Mantener número privado
                                </>
                            )}
                        </span>
                    </label>
                </div>

                <div className="vz-whatsapp-tip">
                    <p>
                        <strong>Cómo funciona:</strong> solo los usuarios verificados podrán ver y contactarte por WhatsApp.
                    </p>
                </div>

                {error && (
                    <div className="vz-form-message vz-form-message-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="vz-form-message vz-form-message-success">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !isVerified}
                    className="vz-primary-btn vz-primary-btn-full"
                >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>

            {whatsappNumber && (
                <div className="vz-whatsapp-status">
                    <p className="vz-whatsapp-status-label">Estado actual:</p>
                    <p className="vz-whatsapp-status-value">{whatsappNumber}</p>
                    <p className="vz-whatsapp-status-meta">
                        {isVisible ? 'Visible para usuarios verificados' : 'Privado'}
                    </p>
                </div>
            )}
        </div>
    );
}
