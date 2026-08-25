import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cards = [
        {
            label: 'Total Usuarios',
            value: stats.total_users,
            accent: 'var(--oro-principal)',
            icon: 'U'
        },
        {
            label: 'Propiedades Activas',
            value: stats.total_properties,
            accent: 'var(--verde-claro)',
            icon: 'H'
        },
        {
            label: 'Suscripciones Activas',
            value: stats.active_subscriptions,
            accent: '#8fb89f',
            icon: 'S'
        },
        {
            label: 'Ingresos Mensuales',
            value: '$' + stats.monthly_revenue,
            accent: '#d4af70',
            icon: '$'
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="vz-admin-stats-grid">
                {cards.map((card, index) => (
                    <div key={index} className="vz-admin-stat-card">
                        <div className="vz-admin-stat-top">
                            <div>
                                <p className="vz-admin-stat-label">{card.label}</p>
                                <p className="vz-admin-stat-value">{card.value}</p>
                            </div>
                            <div className="vz-admin-stat-icon" style={{ background: `${card.accent}1A`, color: card.accent, borderColor: `${card.accent}55` }}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="vz-admin-panels-grid">
                <div className="vz-admin-panel">
                    <h3 className="vz-admin-panel-title">Usuarios Recientes</h3>
                    <div className="vz-admin-list">
                        {stats.recent_users && stats.recent_users.slice(0, 5).map((user) => (
                            <div key={user.id} className="vz-admin-list-item">
                                <div>
                                    <p className="vz-admin-list-name">{user.name}</p>
                                    <p className="vz-admin-list-meta">{user.email}</p>
                                </div>
                                <span className="vz-admin-pill vz-admin-pill-blue capitalize">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="vz-admin-panel">
                    <h3 className="vz-admin-panel-title">Propiedades Destacadas</h3>
                    <div className="vz-admin-list">
                        {stats.featured_properties && stats.featured_properties.slice(0, 5).map((property) => (
                            <div key={property.id} className="vz-admin-list-item">
                                <div>
                                    <p className="vz-admin-list-name">{property.title}</p>
                                    <p className="vz-admin-list-meta">${property.price.toLocaleString()}</p>
                                </div>
                                <span className={`vz-admin-pill ${property.status === 'aprobado' ? 'vz-admin-pill-success' : 'vz-admin-pill-warning'}`}>
                                    {property.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
