import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    MagnifyingGlassIcon,
    CreditCardIcon,
    CheckCircleIcon,
    XCircleIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { planPrice } from "@/utils";

export default function Subscriptions({ subscriptions = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredSubscriptions = subscriptions.filter((sub) => {
        const matchesSearch =
            sub.user?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            sub.user?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesPlan =
            planFilter === "all" || sub.plan === planFilter;

        const matchesStatus =
            statusFilter === "all" || sub.status === statusFilter;

        return matchesSearch && matchesPlan && matchesStatus;
    });

    const getPlanBadgeColor = (plan) => {
        switch (plan) {
            case "basic":
                return "vz-badge-basic";
            case "premium":
                return "vz-badge-premium";
            case "enterprise":
                return "vz-badge-enterprise";
            default:
                return "vz-badge-basic";
        }
    };

    const getPlanBadgeText = (plan) => {
        switch (plan) {
            case "basic":
                return "Basico";
            case "premium":
                return "Premium";
            case "enterprise":
                return "Enterprise";
            default:
                return plan;
        }
    };

    const getTotalRevenue = () => {
        return filteredSubscriptions.reduce((total, sub) => {
            return total + planPrice(sub.plan);
        }, 0);
    };

    const stats = [
        {
            label: "Total",
            value: filteredSubscriptions.length,
            icon: CreditCardIcon,
            className: "vz-stat-gold",
        },
        {
            label: "Activos",
            value: filteredSubscriptions.filter(
                (s) => s.status === "active"
            ).length,
            icon: CheckCircleIcon,
            className: "vz-stat-success",
        },
        {
            label: "Inactivos",
            value: filteredSubscriptions.filter(
                (s) => s.status !== "active"
            ).length,
            icon: XCircleIcon,
            className: "vz-stat-danger",
        },
        {
            label: "Ingresos/Mes",
            value: "$" + getTotalRevenue(),
            icon: CurrencyDollarIcon,
            className: "vz-stat-purple",
        },
    ];

    return (
        <AdminLayout title="Gestion de Suscripciones">
            <Head title="Suscripciones - Admin" />

            <div className="vz-page-intro">
                <p>
                    Gestiona las suscripciones activas de los agentes
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
            <div className="vz-admin-panel mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="relative">
                        <MagnifyingGlassIcon
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                            style={{
                                color: "var(--gris-texto)",
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="vz-form-input pl-10"
                        />
                    </div>

                    <select
                        value={planFilter}
                        onChange={(e) =>
                            setPlanFilter(e.target.value)
                        }
                        className="vz-form-input"
                    >
                        <option value="all">
                            Todos los planes
                        </option>

                        <option value="basic">
                            Basico
                        </option>

                        <option value="premium">
                            Premium
                        </option>

                        <option value="enterprise">
                            Enterprise
                        </option>
                    </select>

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

                        <option value="active">
                            Activo
                        </option>

                        <option value="expired">
                            Expirado
                        </option>

                        <option value="cancelled">
                            Cancelado
                        </option>
                    </select>

                </div>
            </div>

            {/* TABLA */}
            <div className="vz-table-card">

                {filteredSubscriptions.length === 0 ? (
                    <div className="p-8 text-center">

                        <CreditCardIcon
                            className="w-12 h-12 mx-auto mb-3"
                            style={{
                                color: "var(--oro-principal)",
                            }}
                        />

                        <p
                            style={{
                                color: "var(--gris-texto)",
                            }}
                        >
                            No se encontraron suscripciones
                        </p>

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className="vz-btn-link mt-2"
                            >
                                Limpiar busqueda
                            </button>
                        )}

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="vz-table">

                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Plan</th>
                                    <th>Max. Propiedades</th>
                                    <th>Estado</th>
                                    <th>Inicio</th>
                                    <th>Fin</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSubscriptions.map((sub) => (
                                    <tr key={sub.id}>

                                        <td>
                                            <div>
                                                <strong className="vz-table-primary">
                                                    {sub.user?.name}
                                                </strong>

                                                {sub.user?.email && (
                                                    <span className="vz-table-secondary">
                                                        {sub.user.email}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={`vz-status-badge ${getPlanBadgeColor(
                                                    sub.plan
                                                )}`}
                                            >
                                                {getPlanBadgeText(
                                                    sub.plan
                                                )}
                                            </span>
                                        </td>

                                        <td>
                                            <strong className="vz-number-highlight">
                                                {sub.max_properties}
                                            </strong>
                                        </td>

                                        <td>
                                            <span
                                                className={`vz-status-badge ${
                                                    sub.status === "active"
                                                        ? "vz-status-active"
                                                        : "vz-status-inactive"
                                                }`}
                                            >
                                                {sub.status === "active"
                                                    ? "Activo"
                                                    : sub.status === "expired"
                                                    ? "Expirado"
                                                    : "Cancelado"}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(
                                                sub.start_date
                                            ).toLocaleDateString("es-ES")}
                                        </td>

                                        <td>
                                            {new Date(
                                                sub.end_date
                                            ).toLocaleDateString("es-ES")}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}