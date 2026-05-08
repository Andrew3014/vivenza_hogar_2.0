import React, { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ onCapture, title, description }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasCamera, setHasCamera] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);

    // Verificar disponibilidad de cámara
    useEffect(() => {
        const checkCamera = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasVideoInput = devices.some(device => device.kind === 'videoinput');
                setHasCamera(hasVideoInput);
            } catch (err) {
                console.error('Error checking camera:', err);
                setHasCamera(false);
            }
        };

        checkCamera();
    }, []);

    // Iniciar cámara
    const startCamera = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('No se pudo acceder a la cámara. Por favor verifica los permisos.');
            setHasCamera(false);
        }
    };

    // Detener cámara
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsCameraActive(false);
        }
    };

    // Capturar foto
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            stopCamera();
        }
    };

    // Confirmar foto capturada
    const confirmCapture = () => {
        if (capturedImage) {
            onCapture(capturedImage);
            setCapturedImage(null);
        }
    };

    // Si no hay cámara
    if (hasCamera === false) {
        return (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex gap-3">
                    <div className="text-3xl">📷</div>
                    <div>
                        <h3 className="font-bold text-yellow-900 mb-2">Cámara no disponible</h3>
                        <p className="text-yellow-800">
                            Tu dispositivo actual no tiene cámara. Necesitas verificar tu identidad usando un dispositivo 
                            con cámara (teléfono o computadora con webcam).
                        </p>
                        <p className="text-yellow-700 text-sm mt-3">
                            <strong>Nota:</strong> Puedes continuar con tu cuenta ahora y verificarte más tarde desde otro dispositivo.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Si está cargando la disponibilidad
    if (hasCamera === null) {
        return (
            <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-3xl mb-2">⏳</div>
                <p className="text-gray-600">Detectando cámara...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{description}</p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="bg-gray-100 rounded-lg overflow-hidden">
                {!capturedImage && !isCameraActive && (
                    <div className="aspect-video flex flex-col items-center justify-center gap-4">
                        <div className="text-5xl">📷</div>
                        <button
                            onClick={startCamera}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
                        >
                            Abrir Cámara
                        </button>
                    </div>
                )}

                {isCameraActive && !capturedImage && (
                    <div className="relative aspect-video">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="border-4 border-yellow-400 rounded-lg w-4/5 h-4/5"></div>
                        </div>
                    </div>
                )}

                {capturedImage && (
                    <div className="aspect-video">
                        <img
                            src={capturedImage}
                            alt="Captura"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-3 mt-4">
                {isCameraActive && !capturedImage && (
                    <>
                        <button
                            onClick={capturePhoto}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            📸 Capturar
                        </button>
                        <button
                            onClick={stopCamera}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Cancelar
                        </button>
                    </>
                )}

                {capturedImage && (
                    <>
                        <button
                            onClick={confirmCapture}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            ✓ Confirmar
                        </button>
                        <button
                            onClick={() => {
                                setCapturedImage(null);
                                startCamera();
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Retomar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
