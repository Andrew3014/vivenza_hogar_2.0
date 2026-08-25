import { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    MagnifyingGlassIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    CheckCircleIcon,
    BookmarkIcon,
    XCircleIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

export default function AgentMessages({ inquiries = [] }) {
    const { flash } = usePage().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);

    const filtered = inquiries.filter((inq) => {
        const matchesSearch =
            inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.property?.title
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            inq.inquiry_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = [
        {
            label: 'Total',
            value: inquiries.length,
            icon: ChatBubbleLeftRightIcon,
            className: 'vz-stat-gold',
        },
        {
            label: 'Pendientes',
            value: inquiries.filter(
                (i) => i.inquiry_status === 'pendiente'
            ).length,
            icon: ClockIcon,
            className: 'vz-stat-warning',
        },
        {
            label: 'Respondidos',
            value: inquiries.filter(
                (i) => i.inquiry_status === 'respondido'
            ).length,
            icon: CheckCircleIcon,
            className: 'vz-stat-success',
        },
        {
            label: 'Finalizados',
            value: inquiries.filter(
                (i) => i.inquiry_status === 'finalizado'
            ).length,
            icon: BookmarkIcon,
            className: 'vz-stat-purple',
        },
    ];

    const handleSendReply = () => {
        if (!replyMessage.trim()) {
            alert('⚠️ Por favor escriba un mensaje');
            return;
        }

        if (!selectedInquiry) return;

        setSending(true);

        router.post(
            route('agent.messages.reply', selectedInquiry.id),
            {
                message_body: replyMessage.trim(),
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSending(false);
                    setReplyMessage('');
                    setSelectedInquiry(null);
                },
            }
        );
    };

    const handleChangeStatus = (status) => {
        if (!selectedInquiry) return;

        setSending(true);

        router.post(
            route('agent.messages.status', selectedInquiry.id),
            {
                inquiry_status: status,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSending(false);
                    setSelectedInquiry(null);
                },
            }
        );
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'alta':
                return 'vz-status-danger';

            case 'media':
                return 'vz-status-warning';

            default:
                return 'vz-status-active';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pendiente':
                return 'vz-status-warning';

            case 'respondido':
                return 'vz-status-active';

            case 'finalizado':
                return 'vz-status-purple';

            case 'rechazado':
                return 'vz-status-danger';

            default:
                return 'vz-status-inactive';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pendiente':
                return 'Pendiente';

            case 'respondido':
                return 'Respondido';

            case 'finalizado':
                return 'Finalizado';

            case 'rechazado':
                return 'Rechazado';

            default:
                return status || 'Sin estado';
        }
    };

    return (
        <AgentLayout title="Mensajes y Contactos">
            <Head title="Mensajes - Vivenza" />

            {/* MENSAJES FLASH */}
            {flash?.success && (
                <div className="vz-alert vz-alert-success mb-6">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="vz-alert vz-alert-danger mb-6">
                    {flash.error}
                </div>
            )}

            <div className="space-y-6">

                {/* INTRODUCCIÓN */}
                <div className="vz-page-intro">
                    <p>
                        Gestiona las consultas y mensajes recibidos de los
                        compradores interesados en tus propiedades.
                    </p>
                </div>

                {/* ESTADÍSTICAS */}
                <div className="vz-admin-stats-grid">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="vz-admin-stat-card"
                            >
                                <div className="vz-admin-stat-top">

                                    <div>
                                        <p className="vz-admin-stat-label">
                                            {stat.label}
                                        </p>

                                        <p className="vz-admin-stat-value">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`vz-admin-stat-icon ${stat.className}`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FILTROS */}
                <div className="vz-admin-panel">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* BUSCADOR */}
                        <div className="relative">

                            <MagnifyingGlassIcon
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                style={{
                                    color: 'var(--gris-texto)',
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Buscar por nombre, email o propiedad..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="vz-form-input pl-10"
                            />

                        </div>

                        {/* ESTADO */}
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="vz-form-input"
                        >
                            <option value="all">
                                Todos los estados
                            </option>

                            <option value="pendiente">
                                Pendientes
                            </option>

                            <option value="respondido">
                                Respondidos
                            </option>

                            <option value="finalizado">
                                Finalizados
                            </option>

                            <option value="rechazado">
                                Rechazados
                            </option>
                        </select>

                    </div>

                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LISTA DE CONSULTAS */}
                    <div className="lg:col-span-2">

                        <div className="vz-table-card overflow-hidden">

                            <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="vz-admin-stat-icon vz-stat-gold">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <h2 className="vz-admin-panel-title">
                                            Consultas recibidas
                                        </h2>

                                        <p className="vz-table-secondary">
                                            {filtered.length} resultado
                                            {filtered.length !== 1
                                                ? 's'
                                                : ''}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            <div className="divide-y divide-[rgba(255,255,255,0.08)] max-h-[600px] overflow-y-auto">

                                {filtered.length > 0 ? (
                                    filtered.map((inq) => (
                                        <div
                                            key={inq.id}
                                            onClick={() =>
                                                setSelectedInquiry(inq)
                                            }
                                            className={`
                                                p-5 cursor-pointer transition
                                                hover:bg-[rgba(255,255,255,0.025)]
                                                ${
                                                    selectedInquiry?.id ===
                                                    inq.id
                                                        ? 'bg-[rgba(201,169,97,0.07)] border-l-4 border-[var(--oro-principal)]'
                                                        : ''
                                                }
                                            `}
                                        >

                                            {/* CABECERA */}
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                <div>

                                                    <h3 className="vz-table-primary">
                                                        {inq.name}
                                                    </h3>

                                                    <p className="vz-table-secondary">
                                                        {inq.email}
                                                    </p>

                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    <span
                                                        className={`vz-status-badge ${getStatusClass(
                                                            inq.inquiry_status
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            inq.inquiry_status
                                                        )}
                                                    </span>

                                                    <span
                                                        className={`vz-status-badge ${getPriorityClass(
                                                            inq.priority
                                                        )}`}
                                                    >
                                                        {inq.priority
                                                            ? inq.priority.toUpperCase()
                                                            : 'BAJO'}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* PROPIEDAD */}
                                            <div className="mt-3">

                                                <p className="vz-table-primary">
                                                    🏠{' '}
                                                    {inq.property?.title ||
                                                        'Propiedad no disponible'}
                                                </p>

                                            </div>

                                            {/* MENSAJE */}
                                            <p className="vz-table-secondary mt-2 line-clamp-2">
                                                {inq.message}
                                            </p>

                                            {/* VERIFICACIÓN */}
                                            {inq.buyer_verified && (
                                                <span className="vz-status-badge vz-status-active mt-3 inline-flex">
                                                    Comprador verificado
                                                </span>
                                            )}

                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center">

                                        <div className="vz-admin-stat-icon vz-stat-gold mx-auto mb-4">
                                            <MagnifyingGlassIcon className="w-8 h-8" />
                                        </div>

                                        <p className="vz-admin-panel-title">
                                            No hay consultas
                                        </p>

                                        <p className="vz-table-secondary mt-2">
                                            No se encontraron consultas que
                                            coincidan con los filtros.
                                        </p>

                                        {(searchTerm ||
                                            statusFilter !== 'all') && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setStatusFilter('all');
                                                }}
                                                className="vz-btn-link mt-3"
                                            >
                                                Limpiar filtros
                                            </button>
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* PANEL DE DETALLES */}
                    {selectedInquiry ? (

                        <div className="vz-admin-panel">

                            {/* CABECERA */}
                            <div className="flex items-center justify-between mb-6">

                                <div className="flex items-center gap-3">

                                    <div className="vz-admin-stat-icon vz-stat-gold">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    </div>

                                    <div>
                                        <h2 className="vz-admin-panel-title">
                                            Detalles de Consulta
                                        </h2>

                                        <p className="vz-table-secondary">
                                            Información del contacto
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* DATOS DEL COMPRADOR */}
                            <div className="pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)]">

                                <p className="vz-table-secondary">
                                    Nombre
                                </p>

                                <p className="vz-table-primary mt-1">
                                    {selectedInquiry.name}
                                </p>

                                <p className="vz-table-secondary mt-4">
                                    Email
                                </p>

                                <p className="vz-table-primary mt-1 break-all">
                                    {selectedInquiry.email}
                                </p>

                                <p className="vz-table-secondary mt-4">
                                    Teléfono del Vendedor
                                </p>

                                <p className="vz-table-primary mt-1">
                                    {selectedInquiry.seller_phone ||
                                        'No proporcionado'}
                                </p>

                                <p className="vz-table-secondary mt-4">
                                    Canal de Contacto
                                </p>

                                <p className="vz-table-primary mt-1 capitalize">
                                    {selectedInquiry.contact_via || 'N/A'}
                                </p>

                                {selectedInquiry.buyer_verified && (
                                    <span className="vz-status-badge vz-status-active mt-4 inline-flex">
                                        Comprador verificado
                                    </span>
                                )}

                            </div>

                            {/* PROPIEDAD */}
                            <div className="pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)]">

                                <p className="vz-table-secondary">
                                    Propiedad
                                </p>

                                <p className="vz-table-primary mt-1">
                                    {selectedInquiry.property?.title ||
                                        'Propiedad no disponible'}
                                </p>

                                <p className="vz-table-secondary mt-2">
                                    Precio
                                </p>

                                <p className="text-[var(--oro-claro)] font-semibold mt-1">
                                    Bs.{' '}
                                    {selectedInquiry.property?.price ??
                                        'N/A'}
                                </p>

                            </div>

                            {/* MENSAJE ORIGINAL */}
                            <div className="pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)]">

                                <p className="vz-table-secondary mb-2">
                                    Mensaje Original
                                </p>

                                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.025)] p-4 text-sm text-[#d8d2c4]">
                                    {selectedInquiry.message}
                                </div>

                            </div>

                            {/* ESTADO */}
                            <div className="pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)]">

                                <p className="vz-table-secondary mb-2">
                                    Estado
                                </p>

                                <span
                                    className={`vz-status-badge ${getStatusClass(
                                        selectedInquiry.inquiry_status
                                    )}`}
                                >
                                    {getStatusText(
                                        selectedInquiry.inquiry_status
                                    )}
                                </span>

                            </div>

                            {/* RESPUESTA */}
                            <div>

                                <label className="vz-form-label">
                                    Tu Respuesta
                                </label>

                                <textarea
                                    value={replyMessage}
                                    onChange={(e) =>
                                        setReplyMessage(e.target.value)
                                    }
                                    placeholder="Escriba su respuesta aquí..."
                                    className="vz-form-input mt-2 min-h-[120px] resize-y"
                                    rows="4"
                                />

                            </div>

                            {/* BOTONES */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                                <button
                                    type="button"
                                    onClick={handleSendReply}
                                    disabled={sending}
                                    className="vz-btn"
                                >
                                    <span className="inline-flex items-center justify-center gap-2">
                                        <PaperAirplaneIcon className="w-5 h-5" />

                                        {sending
                                            ? 'Enviando...'
                                            : 'Enviar Respuesta'}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleChangeStatus(
                                            selectedInquiry.inquiry_status ===
                                                'respondido'
                                                ? 'finalizado'
                                                : 'respondido'
                                        )
                                    }
                                    disabled={sending}
                                    className="vz-btn"
                                >
                                    <span className="inline-flex items-center justify-center gap-2">

                                        {selectedInquiry.inquiry_status ===
                                        'respondido' ? (
                                            <>
                                                <BookmarkIcon className="w-5 h-5" />
                                                Marcar Finalizado
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="w-5 h-5" />
                                                Marcar Respondido
                                            </>
                                        )}

                                    </span>
                                </button>

                            </div>

                            {/* CERRAR */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedInquiry(null);
                                    setReplyMessage('');
                                }}
                                className="vz-btn-secondary w-full mt-3"
                            >
                                <span className="inline-flex items-center justify-center gap-2">
                                    <XCircleIcon className="w-5 h-5" />
                                    Cerrar
                                </span>
                            </button>

                        </div>

                    ) : (

                        /* SIN CONSULTA SELECCIONADA */
                        <div className="vz-admin-panel flex flex-col items-center justify-center text-center min-h-[400px]">

                            <div className="vz-admin-stat-icon vz-stat-gold mb-4">
                                <ChatBubbleLeftRightIcon className="w-10 h-10" />
                            </div>

                            <h2 className="vz-admin-panel-title">
                                Selecciona una consulta
                            </h2>

                            <p className="vz-table-secondary mt-2 max-w-sm">
                                Selecciona un mensaje de la lista para ver
                                los detalles y responder al comprador.
                            </p>

                        </div>

                    )}

                </div>

            </div>
        </AgentLayout>
    );
}