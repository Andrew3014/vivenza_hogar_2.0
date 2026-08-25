import React, { useRef, useState, useEffect } from 'react';
import Modal from '@/Components/Modal';

export default function CameraCapture({ onCapture, title, description, cameraMode = 'environment' }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [status, setStatus] = useState('checking'); // checking | ready | error
    const [modalOpen, setModalOpen] = useState(false);
    const [noCamera, setNoCamera] = useState(false);
    const [error, setError] = useState(null);
    const [captured, setCaptured] = useState(null);
    const [starting, setStarting] = useState(false);
    const [videoReady, setVideoReady] = useState(false);

    // Al desmontar el componente, liberar la cámara siempre
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    // Detener cámara y liberar el stream
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Ref callback: al montar el video, asignar el stream si ya existe
    const setVideoRef = (el) => {
        videoRef.current = el;
        if (el && streamRef.current) {
            el.srcObject = streamRef.current;
        }
    };

    // Verificar disponibilidad de cámara
    const checkCamera = async () => {
        setStatus('checking');
        setNoCamera(false);
        setError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setNoCamera(true);
            setError('Esta función requiere una conexión segura (HTTPS) y un navegador con soporte de cámara.');
            setStatus('error');
            return;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasVideoInput = devices.some(device => device.kind === 'videoinput');

            if (!hasVideoInput) {
                setNoCamera(true);
                setError('No se detectó ninguna cámara en este equipo.');
                setStatus('error');
                return;
            }

            setStatus('ready');
        } catch (err) {
            console.error('Error checking camera:', err);
            setNoCamera(true);
            setError('No se pudo detectar la cámara del equipo.');
            setStatus('error');
        }
    };

    useEffect(() => {
        checkCamera();
    }, []);

    // Iniciar cámara con fallback: primero facingMode, luego cualquier cámara
    const startCamera = async () => {
        setStarting(true);
        setError(null);

        const tryGetStream = (videoConstraints) =>
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });

        try {
            let stream;
            try {
                stream = await tryGetStream({ facingMode: cameraMode });
            } catch (facingError) {
                // Algunos equipos (p. ej. laptops) no soportan facingMode; probar con cámara genérica
                stream = await tryGetStream(true);
            }
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Permiso denegado. Habilita el acceso a la cámara en los ajustes del navegador y vuelve a intentarlo.');
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setNoCamera(true);
                setError('No se detectó ninguna cámara en este equipo.');
            } else if (err.name === 'NotReadableError') {
                setError('La cámara está siendo usada por otra aplicación. Ciérrala e intenta nuevamente.');
            } else {
                setError('No se pudo acceder a la cámara. Por favor verifica los permisos y reintenta.');
            }
        } finally {
            setStarting(false);
        }
    };

    const openCamera = async () => {
        setCaptured(null);
        setError(null);
        setVideoReady(false);
        setModalOpen(true);
        await startCamera();
    };

    // Esperar a que el video tenga un frame decodificado antes de capturar.
    const waitForFrame = (video) => new Promise((resolve) => {
        if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
            if ('requestVideoFrameCallback' in video) {
                video.requestVideoFrameCallback(() => resolve());
            } else {
                resolve();
            }
            return;
        }

        let tries = 0;
        const check = () => {
            tries += 1;
            if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
                if ('requestVideoFrameCallback' in video) {
                    video.requestVideoFrameCallback(() => resolve());
                } else {
                    resolve();
                }
                return;
            }
            if (tries > 60) {
                resolve();
                return;
            }
            setTimeout(check, 50);
        };
        check();
    });

    // Capturar foto
    const capturePhoto = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
            setError('La cámara aún no está lista. Espera un momento y vuelve a intentarlo.');
            return;
        }

        try {
            await waitForFrame(video);

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                setError('No se pudo obtener la imagen de la cámara. Reintenta.');
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.9);

            if (!imageData || imageData.length < 500) {
                setError('No se pudo capturar la imagen. Intenta nuevamente.');
                return;
            }

            setError(null);
            setCaptured(imageData);
        } catch (err) {
            console.error('Error capturing photo:', err);
            setError('Ocurrió un error al capturar la foto. Intenta nuevamente.');
        }
    };

    // Confirmar foto capturada
    const confirmCapture = () => {
        if (captured) {
            stopCamera();
            onCapture(captured);
            setCaptured(null);
            setModalOpen(false);
        }
    };

    const retakePhoto = async () => {
        setCaptured(null);
        setError(null);
        // El stream sigue activo; solo se limpia la vista previa.
    };

    // Cerrar modal siempre libera la cámara
    const closeModal = () => {
        stopCamera();
        setCaptured(null);
        setError(null);
        setModalOpen(false);
    };

    // Sin cámara: la verificación es obligatoriamente con cámara, sin subir imágenes
    if (noCamera || (status === 'error' && error)) {
        return (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                <div className="flex gap-3">
                    <div className="text-3xl">📷</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-yellow-900 mb-2">Cámara no disponible</h3>
                        <p className="text-yellow-800">
                            La verificación requiere usar la cámara del equipo; no se permite subir imágenes.
                            Tu dispositivo actual no tiene cámara o no se pudo acceder a ella. Necesitas verificarte
                            usando un dispositivo con cámara (teléfono o computadora con webcam).
                        </p>
                        {error && (
                            <p className="text-yellow-700 text-sm mt-3">
                                <strong>Detalle:</strong> {error}
                            </p>
                        )}
                        <button
                            onClick={checkCamera}
                            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            🔄 Reintentar
                        </button>
                        <p className="text-yellow-700 text-sm mt-3">
                            <strong>Nota:</strong> Puedes continuar con tu cuenta ahora y verificarte más tarde desde otro dispositivo.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Comprobando disponibilidad
    if (status === 'checking') {
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

            <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="aspect-video flex flex-col items-center justify-center gap-4">
                    <div className="text-5xl">📷</div>
                    <button
                        onClick={openCamera}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                        📷 Abrir Cámara
                    </button>
                </div>
            </div>

            {/* Ventana emergente de captura */}
            <Modal show={modalOpen} maxWidth="lg" closeable onClose={closeModal}>
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{description}</p>
                        </div>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
                            title="Cerrar"
                        >
                            ✕
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                            {error}
                            <button
                                onClick={() => (captured ? retakePhoto() : startCamera())}
                                className="ml-3 text-red-700 font-semibold underline hover:text-red-900"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                        {!captured && (
                            <div className="relative aspect-video bg-black isolate">
                                <video
                                    ref={setVideoRef}
                                    autoPlay
                                    playsInline
                                    webkit-playsinline="true"
                                    muted
                                    disablePictureInPicture
                                    onLoadedData={() => setVideoReady(true)}
                                    onCanPlay={() => setVideoReady(true)}
                                    className="w-full h-full object-cover relative z-0"
                                />
                                {!videoReady && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 text-white text-sm">
                                        ⏳ Preparando cámara...
                                    </div>
                                )}
                                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                    <div className="border-4 border-yellow-400 rounded-lg w-4/5 h-4/5"></div>
                                </div>
                            </div>
                        )}

                        {captured && (
                            <div className="relative aspect-video isolate">
                                <img
                                    src={captured}
                                    alt="Captura"
                                    className="w-full h-full object-cover relative z-0"
                                />
                                <div className="absolute inset-0 z-10 flex items-start justify-end p-2 pointer-events-none">
                                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        ✓ Capturada
                                    </span>
                                </div>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="relative z-20 flex gap-3 mt-4">
                        {!captured && (
                            <>
                                <button
                                    onClick={capturePhoto}
                                    disabled={starting || !videoReady}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-4 rounded transition-colors"
                                >
                                    {videoReady ? '📸 Capturar Foto' : '⏳ Esperando cámara...'}
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded transition-colors"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}

                        {captured && (
                            <>
                                <button
                                    onClick={confirmCapture}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
                                >
                                    ✓ Confirmar
                                </button>
                                <button
                                    onClick={retakePhoto}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded transition-colors"
                                >
                                    ↩ Retomar
                                </button>
                            </>
                        )}
                    </div>

                    {!captured && (
                        <p className="text-gray-500 text-xs mt-3 text-center">
                            Presiona "Capturar Foto" y luego "Confirmar" para guardar la imagen.
                        </p>
                    )}

                    {captured && (
                        <p className="text-gray-500 text-xs mt-3 text-center">
                            Revisa la captura. Si se ve bien, presiona "Confirmar".
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
}
