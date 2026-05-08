import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Subscriptions({ subscriptions = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredSubscriptions = subscriptions
        .filter(sub => {
            const matchesSearch = sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPlan = planFilter === "all" || sub.plan === planFilter;
            const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
            return matchesSearch && matchesPlan && matchesStatus;
        });

    const getPlanBadgeColor = (plan) => {
        switch(plan) {
            case "basic": return "bg-gray-100 text-gray-800";
            case "premium": return "bg-blue-100 text-blue-800";
            case "enterprise": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPlanBadgeText = (plan) => {
        switch(plan) {
            case "basic": return "Basico";
            case "premium": return "Premium";
            case "enterprise": return "Enterprise";
            default: return plan;
        }
    };

    const getTotalRevenue = () => {
        return filteredSubscriptions.reduce((total, sub) => {
            const monthlyPrice = {
                basic: 29,
                premium: 79,
                enterprise: 199
            }[sub.plan] || 0;
            return total + monthlyPrice;
        }, 0);
    };

    const stats = [
        {
            label: "Total",
            value: filteredSubscriptions.length,
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            label: "Activos",
            value: filteredSubscriptions.filter(s => s.status === "active").length,
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            label: "Inactivos",
            value: filteredSubscriptions.filter(s => s.status === "inactive").length,
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
        {
            label: "Ingresos/Mes",
            value: "$" + getTotalRevenue(),
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <AdminLayout title="Gestion de Suscripciones">
            <Head title="Suscripciones - Admin" />

            <div className="mb-6">
                <p className="text-gray-600 text-sm">Gestiona las suscripciones activas de los agentes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4`}>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className={`${stat.color} text-2xl font-bold`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los planes</option>
                        <option value="basic">Basico</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredSubscriptions.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No se encontraron suscripciones</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-2 text-blue-600 hover:underline"
                            >
                                Limpiar busqueda
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                                    Usuario
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                                    Max. Propiedades
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">
                                    Inicio
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900">Fin</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSubscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">{sub.user?.name}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanBadgeColor(sub.plan)}`}>
                                            {getPlanBadgeText(sub.plan)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{sub.max_properties}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                sub.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {sub.status === "active" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(sub.start_date).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(sub.end_date).toLocaleDateString("es-ES")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
}