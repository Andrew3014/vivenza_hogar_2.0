import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head } from '@inertiajs/react';

export default function AgentVerifications({ verifications = [] }) {
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedVerification, setSelectedVerification] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const filtered = verifications.filter(v => 
        statusFilter === 'all' || v.status === statusFilter
    );

    const stats = [
        { label: 'Total', value: verifications.length, color: 'bg-blue-50', icon: '📊' },
        { label: 'Pendientes', value: verifications.filter(v => v.status === 'pendiente').length, color: 'bg-yellow-50', icon: '⏳' },
        { label: 'Aprobadas', value: verifications.filter(v => v.status === 'aprobado').length, color: 'bg-green-50', icon: '✅' },
        { label: 'Rechazadas', value: verifications.filter(v => v.status === 'rechazado').length, color: 'bg-red-50', icon: '❌' },
    ];

    const handleApprove = (id) => {
        alert('✅ Verificación aprobada para usuario ID: ' + id);
        setSelectedVerification(null);
    };

    const handleReject = (id) => {
        if (!rejectionReason) {
            alert('⚠️ Por favor ingrese la razón del rechazo');
            return;
        }
        alert(`❌ Verificación rechazada: ${rejectionReason}`);
        setSelectedVerification(null);
        setRejectionReason('');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'aprobado': return 'bg-green-100 text-green-800';
            case 'rechazado': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'aprobado': return '✅';
            case 'rechazado': return '❌';
            default: return '⏳';
        }
    };

    return (
        <AgentLayout title="✅ Verificar Cuentas">
            <Head title="Verificaciones de Identidad - Vivenza" />

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className={`${stat.color} rounded-lg p-4 border border-gray-200`}>
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filtro de Estado */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <label className="block text-sm font-medium mb-2">Filtrar por estado:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="all">Todas las verificaciones</option>
                    <option value="pendiente">⏳ Pendientes de revisión</option>
                    <option value="aprobado">✅ Aprobadas</option>
                    <option value="rechazado">❌ Rechazadas</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Verificaciones */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y">
                            {filtered.length > 0 ? filtered.map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => setSelectedVerification(v)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                                        selectedVerification?.id === v.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{v.user?.name}</h3>
                                            <p className="text-sm text-gray-600">{v.user?.email}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Documento: {v.user?.document_number || 'N/A'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(v.status)}`}>
                                            {getStatusIcon(v.status)} {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-500">
                                    No hay verificaciones para mostrar
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel de Detalles */}
                {selectedVerification && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Detalles de Verificación</h2>

                        {/* Datos del Usuario */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="font-semibold">{selectedVerification.user?.name}</p>

                            <p className="text-sm text-gray-600 mt-3">Email</p>
                            <p className="font-semibold">{selectedVerification.user?.email}</p>

                            <p className="text-sm text-gray-600 mt-3">Teléfono</p>
                            <p className="font-semibold">{selectedVerification.user?.phone || 'N/A'}</p>

                            <p className="text-sm text-gray-600 mt-3">Documento</p>
                            <p className="font-semibold">{selectedVerification.user?.document_number || 'N/A'}</p>
                        </div>

                        {/* Documentos */}
                        <div className="mb-6 pb-6 border-b">
                            <h3 className="font-semibold mb-3">📄 Documentos</h3>
                            <div className="space-y-3">
                                {selectedVerification.document_front_url && (
                                    <div>
                                        <p className="text-xs text-gray-600">Frente del documento</p>
                                        <div className="mt-1 w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                            📸 Documento Frente
                                        </div>
                                    </div>
                                )}
                                {selectedVerification.document_back_url && (
                                    <div>
                                        <p className="text-xs text-gray-600">Reverso del documento</p>
                                        <div className="mt-1 w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                            📸 Documento Reverso
                                        </div>
                                    </div>
                                )}
                                {selectedVerification.face_photo_url && (
                                    <div>
                                        <p className="text-xs text-gray-600">Foto de rostro</p>
                                        <div className="mt-1 w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                            📸 Selfie
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Estado Actual</p>
                            <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(selectedVerification.status)}`}>
                                {getStatusIcon(selectedVerification.status)} {selectedVerification.status.charAt(0).toUpperCase() + selectedVerification.status.slice(1)}
                            </p>
                        </div>

                        {/* Acciones */}
                        {selectedVerification.status === 'pendiente' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setActionType('approve');
                                        handleApprove(selectedVerification.id);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    ✅ Aprobar Verificación
                                </button>
                                <button
                                    onClick={() => setActionType(actionType === 'reject' ? null : 'reject')}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    ❌ Rechazar Verificación
                                </button>
                            </div>
                        )}

                        {/* Formulario de Rechazo */}
                        {actionType === 'reject' && (
                            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                <label className="block text-sm font-medium mb-2">Razón del rechazo:</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explique por qué se rechaza la verificación..."
                                    className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm"
                                    rows="3"
                                />
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => handleReject(selectedVerification.id)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
                                    >
                                        Confirmar Rechazo
                                    </button>
                                    <button
                                        onClick={() => setActionType(null)}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedVerification.status !== 'pendiente' && (
                            <button
                                onClick={() => setSelectedVerification(null)}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg mt-4"
                            >
                                Cerrar
                            </button>
                        )}
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}
