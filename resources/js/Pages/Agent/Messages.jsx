import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head } from '@inertiajs/react';
import { MagnifyingGlassIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function AgentMessages({ inquiries = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [replyStatus, setReplyStatus] = useState('pendiente');

    const filtered = inquiries.filter(inq => {
        const matchesSearch = inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inq.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inq.inquiry_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = [
        { label: 'Total', value: inquiries.length, color: 'bg-blue-50', icon: '💬' },
        { label: 'Nuevos', value: inquiries.filter(i => i.inquiry_status === 'nuevo').length, color: 'bg-purple-50', icon: '🆕' },
        { label: 'En Proceso', value: inquiries.filter(i => i.inquiry_status === 'en_proceso').length, color: 'bg-yellow-50', icon: '⏳' },
        { label: 'Respondidos', value: inquiries.filter(i => i.inquiry_status === 'respondido').length, color: 'bg-green-50', icon: '✅' },
    ];

    const handleSendReply = () => {
        if (!replyMessage.trim()) {
            alert('⚠️ Por favor escriba un mensaje');
            return;
        }
        alert(`✅ Mensaje enviado a ${selectedInquiry.name}`);
        setReplyMessage('');
        setSelectedInquiry(null);
    };

    const handleMarkAsResponded = (id) => {
        alert(`✅ Consulta marcada como respondida`);
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'alto': return 'bg-red-100 text-red-800';
            case 'medio': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'nuevo': return 'bg-purple-100 text-purple-800';
            case 'en_proceso': return 'bg-yellow-100 text-yellow-800';
            case 'respondido': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AgentLayout title="💬 Mensajes y Contactos">
            <Head title="Mensajes - Vivenza" />

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

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o propiedad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="nuevo">🆕 Nuevos</option>
                        <option value="en_proceso">⏳ En Proceso</option>
                        <option value="respondido">✅ Respondidos</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Consultas */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y max-h-[600px] overflow-y-auto">
                            {filtered.length > 0 ? filtered.map((inq) => (
                                <div
                                    key={inq.id}
                                    onClick={() => setSelectedInquiry(inq)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                                        selectedInquiry?.id === inq.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{inq.name}</h3>
                                            <p className="text-sm text-gray-600">{inq.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(inq.inquiry_status)}`}>
                                                {inq.inquiry_status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(inq.priority)}`}>
                                                {inq.priority?.toUpperCase() || 'BAJO'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                        🏠 {inq.property?.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                        {inq.message}
                                    </p>
                                    {inq.buyer_verified && (
                                        <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            ✅ Comprador verificado
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-500">
                                    No hay consultas que coincidan
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel de Detalles y Respuesta */}
                {selectedInquiry && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Detalles de Consulta</h2>

                        {/* Datos del Comprador */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="font-semibold">{selectedInquiry.name}</p>

                            <p className="text-sm text-gray-600 mt-3">Email</p>
                            <p className="font-semibold">{selectedInquiry.email}</p>

                            <p className="text-sm text-gray-600 mt-3">Teléfono Comprador</p>
                            <p className="font-semibold">{selectedInquiry.seller_phone || 'No proporcionado'}</p>

                            {selectedInquiry.buyer_verified && (
                                <div className="mt-3 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    ✅ Comprador Verificado
                                </div>
                            )}
                        </div>

                        {/* Propiedad */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Propiedad</p>
                            <p className="font-semibold text-blue-600">{selectedInquiry.property?.title}</p>
                            <p className="text-sm text-gray-600 mt-1">${selectedInquiry.property?.price} BOB</p>
                        </div>

                        {/* Mensaje Original */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600 font-semibold mb-2">Mensaje Original</p>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                {selectedInquiry.message}
                            </div>
                        </div>

                        {/* Estado y Contacto */}
                        <div className="mb-6 pb-6 border-b">
                            <p className="text-sm text-gray-600">Estado</p>
                            <p className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedInquiry.inquiry_status)}`}>
                                {selectedInquiry.inquiry_status.replace('_', ' ').toUpperCase()}
                            </p>
                        </div>

                        {/* Formulario de Respuesta */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tu Respuesta</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Escriba su respuesta aquí..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    rows="4"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleSendReply}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    💬 Enviar
                                </button>
                                <button
                                    onClick={() => handleMarkAsResponded(selectedInquiry.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                                >
                                    {selectedInquiry.inquiry_status === 'respondido' ? '✅ Respondido' : '⏳ Marcar Respondido'}
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AgentLayout>
    );
}
