import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CameraCapture from '@/Components/Verification/CameraCapture';

export default function VerifyIdentity({ verification = null }) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(1); // 1: documento frente, 2: documento atras, 3: selfie, 4: revisar
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState({
        documentFront: verification?.document_front_url || null,
        documentBack: verification?.document_back_url || null,
        faceSelfie: verification?.face_photo_url || null,
    });
    const [error, setError] = useState(null);

    const handlePhotoCaptured = (base64Image) => {
        if (step === 1) {
            setPhotos(prev => ({ ...prev, documentFront: base64Image }));
            setStep(2);
        } else if (step === 2) {
            setPhotos(prev => ({ ...prev, documentBack: base64Image }));
            setStep(3);
        } else if (step === 3) {
            setPhotos(prev => ({ ...prev, faceSelfie: base64Image }));
            setStep(4);
        }
    };

    const handleSubmit = async () => {
        if (!photos.documentFront || !photos.documentBack || !photos.faceSelfie) {
            setError('Todas las fotos son requeridas');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/verification/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    document_front: photos.documentFront,
                    document_back: photos.documentBack,
                    face_selfie: photos.faceSelfie,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                router.visit('/dashboard', { method: 'get' });
            } else {
                setError(data.message || 'Error al enviar la verificación');
            }
        } catch (err) {
            setError('Error de conexión. Por favor intenta de nuevo.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ✓ Verificación de Identidad
                        </h1>
                        <p className="text-gray-600">
                            Necesitamos verificar tu identidad para que vendedores y compradores sepan que eres una persona real.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8 flex gap-2">
                        {[1, 2, 3, 4].map(s => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full transition-colors ${
                                    s <= step ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700 font-medium">⚠️ {error}</p>
                        </div>
                    )}

                    {/* Camera or No Camera Message */}
                    {step <= 3 && (
                        <div className="mb-6">
                            {step === 1 && (
                                <CameraCapture
                                    onCapture={handlePhotoCaptured}
                                    title="1. Foto del Documento - Frente"
                                    description="Toma una foto clara del frente de tu cédula de identidad. Asegúrate que toda la información sea visible."
                                />
                            )}

                            {step === 2 && (
                                <CameraCapture
                                    onCapture={handlePhotoCaptured}
                                    title="2. Foto del Documento - Reverso"
                                    description="Ahora toma una foto del reverso de tu cédula de identidad."
                                />
                            )}

                            {step === 3 && (
                                <CameraCapture
                                    onCapture={handlePhotoCaptured}
                                    title="3. Foto de tu Rostro (Selfie)"
                                    description="Toma un selfie claro donde se vea tu rostro y coincida con la foto de tu cédula."
                                />
                            )}
                        </div>
                    )}

                    {/* Review Step */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-900">
                                    ✓ Todas las fotos han sido capturadas correctamente.
                                </p>
                            </div>

                            {/* Preview Photos */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Documento - Frente
                                    </label>
                                    <img
                                        src={photos.documentFront}
                                        alt="Documento Frente"
                                        className="w-full aspect-video object-cover rounded border-2 border-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Documento - Reverso
                                    </label>
                                    <img
                                        src={photos.documentBack}
                                        alt="Documento Reverso"
                                        className="w-full aspect-video object-cover rounded border-2 border-gray-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Tu Rostro
                                    </label>
                                    <img
                                        src={photos.faceSelfie}
                                        alt="Selfie"
                                        className="w-full aspect-video object-cover rounded border-2 border-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Information */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-2">Información importante:</h3>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>✓ Tus fotos serán revisadas por nuestro equipo.</li>
                                    <li>✓ El proceso de verificación puede tomar 24-48 horas.</li>
                                    <li>✓ Una vez verificado, se mostrará un badge en tu perfil.</li>
                                    <li>✓ Los vendedores y compradores podrán ver tu estado de verificación.</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={loading}
                                    className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded transition-colors"
                                >
                                    ← Volver
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded transition-colors"
                                >
                                    {loading ? 'Enviando...' : '✓ Enviar Verificación'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Skip Option */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600 text-sm mb-3">
                            Puedes continuar sin verificar ahora, pero los vendedores no sabrán que has sido verificado.
                        </p>
                        <button
                            onClick={() => router.visit('/dashboard')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            → Continuar sin verificar por ahora
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
