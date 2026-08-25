import React, { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';

// Paleta por tipo de operación (transaction_type).
const TRANSACTION_COLORS = {
    venta: '#16a34a',
    alquiler: '#2563eb',
    anticretico: '#c9a961',
    alquiler_diario: '#7c3aed',
};

const TRANSACTION_LABELS = {
    venta: 'Venta',
    alquiler: 'Alquiler',
    anticretico: 'Anticrético',
    alquiler_diario: 'Alquiler por días',
};

// Iconos SVG (stroke blanco) por tipo físico inferido del título.
const TYPE_ICON_PATHS = {
    casa: 'M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-7.5Z',
    departamento: 'M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M5 21h14M9 9h.5M14.5 9h.5M9 13h.5M14.5 13h.5M9 17h.5M14.5 17h.5',
    terreno: 'M4 20h16M4 20L12 6l8 14M8 20l4-8 4 8',
};

const TYPE_LABELS = {
    casa: 'Casa',
    departamento: 'Departamento',
    terreno: 'Terreno',
    propiedad: 'Propiedad',
};

// Inferir tipo físico (casa / departamento / terreno) a partir del título.
const inferPropertyType = (title = '') => {
    const t = title.toLowerCase();
    if (/(casa|chalet|vivienda|chalé)/.test(t)) return 'casa';
    if (/(departamento|depto|dpto|depa|apartamento|flat)/.test(t)) return 'departamento';
    if (/(terreno|lote|parcela|solar)/.test(t)) return 'terreno';
    return 'propiedad';
};

// Escapar texto para inyectar de forma segura en popups/tooltips.
const escapeHtml = (value) => {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    })[char]);
};

const coordinatesFor = (property) => ({
    latitude: property.latitude ?? property.location?.latitude,
    longitude: property.longitude ?? property.location?.longitude,
});

const hasCoordinates = (property) => {
    const { latitude, longitude } = coordinatesFor(property);
    return latitude !== null && latitude !== undefined
        && longitude !== null && longitude !== undefined;
};

// Marcador personalizado: pin de color según operación + ícono según tipo físico.
const buildMarkerIcon = (L, property) => {
    const transactionColor = TRANSACTION_COLORS[property.transaction_type] || '#64748b';
    const physicalType = inferPropertyType(property.title);
    const iconPath = TYPE_ICON_PATHS[physicalType] || 'M12 12h.01';

    const html = `
        <div class="vz-map-marker" style="--vz-marker-color:${transactionColor}">
            <div class="vz-map-marker-pin">
                <svg viewBox="0 0 24 24" class="vz-map-marker-icon" aria-hidden="true">
                    <path d="${iconPath}" fill="none" stroke="#fff" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div class="vz-map-marker-arrow"></div>
        </div>
    `;

    return L.divIcon({
        className: '',
        html,
        iconSize: [34, 44],
        iconAnchor: [17, 42],
        popupAnchor: [0, -36],
    });
};

const buildPopupContent = (property) => {
    const physicalType = inferPropertyType(property.title);
    const transactionLabel = TRANSACTION_LABELS[property.transaction_type] || property.transaction_type || '';
    const address = property.location?.address
        || property.location?.name
        || property.location?.city
        || '';
    const price = Number(property.price || 0).toLocaleString(property.currency === 'USD' ? 'en-US' : 'es-BO');
    const currency = property.currency === 'USD' ? 'USD' : 'BOB';

    return `
        <div class="vz-map-popup">
            <div class="vz-map-popup-badges">
                <span class="vz-badge vz-badge-type">${TYPE_LABELS[physicalType]}</span>
                <span class="vz-badge vz-badge-operation">${escapeHtml(transactionLabel)}</span>
            </div>
            <h3 class="vz-map-popup-title">${escapeHtml(property.title)}</h3>
            ${address ? `<p class="vz-map-popup-address">📍 ${escapeHtml(address)}</p>` : ''}
            <p class="vz-map-popup-price">${price} ${escapeHtml(currency)}</p>
            <a href="/properties/${property.id}" class="vz-map-popup-link">Ver publicación →</a>
        </div>
    `;
};

export default function PropertyMap({ properties = [] }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || !properties || properties.length === 0) return;

        const initializeMap = async () => {
            try {
                const L = (await import('leaflet')).default;

                const validProperties = properties.filter(hasCoordinates);
                if (validProperties.length === 0) return;

                // Centro del mapa: promedio de las coordenadas.
                const centerLat = validProperties.reduce((sum, p) => sum + parseFloat(coordinatesFor(p).latitude), 0) / validProperties.length;
                const centerLng = validProperties.reduce((sum, p) => sum + parseFloat(coordinatesFor(p).longitude), 0) / validProperties.length;

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                }

                mapInstanceRef.current = L.map(mapRef.current).setView([centerLat, centerLng], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 19,
                }).addTo(mapInstanceRef.current);

                const bounds = [];
                validProperties.forEach(property => {
                    const { latitude, longitude } = coordinatesFor(property);
                    const lat = parseFloat(latitude);
                    const lng = parseFloat(longitude);

                    const marker = L.marker([lat, lng], {
                        icon: buildMarkerIcon(L, property),
                        title: property.title,
                    }).addTo(mapInstanceRef.current);

                    marker.bindPopup(buildPopupContent(property), {
                        minWidth: 220,
                        maxWidth: 260,
                    });

                    marker.on('click', () => {
                        router.visit(`/properties/${property.id}`);
                    });

                    bounds.push([lat, lng]);
                });

                // Navegación SPA desde el enlace interno del popup.
                mapInstanceRef.current.on('popupopen', () => {
                    const link = document.querySelector('.leaflet-popup-content .vz-map-popup-link');
                    if (!link) return;
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        router.visit(link.getAttribute('href'));
                    });
                });

                // Ajustar el zoom para que todas las marcas queden visibles.
                if (bounds.length > 1) {
                    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
                } else {
                    mapInstanceRef.current.setView(bounds[0], 14);
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initializeMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [properties]);

    const validCount = properties.filter(hasCoordinates).length;

    if (!properties || properties.length === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <p className="text-gray-500">No hay propiedades para mostrar.</p>
            </div>
        );
    }

    if (validCount === 0) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Las propiedades actuales no tienen ubicación en el mapa.</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
                <div ref={mapRef} className="w-full h-96 md:h-[500px]" />

                {/* Leyenda */}
                <div className="vz-map-legend">
                    <p className="vz-map-legend-title">Operación</p>
                    <div className="vz-map-legend-row">
                        {Object.entries(TRANSACTION_COLORS).map(([key, color]) => (
                            <span key={key} className="vz-map-legend-item">
                                <span className="vz-map-legend-dot" style={{ background: color }} />
                                {TRANSACTION_LABELS[key]}
                            </span>
                        ))}
                    </div>
                    <p className="vz-map-legend-title">Tipo de inmueble</p>
                    <div className="vz-map-legend-row">
                        {Object.entries(TYPE_LABELS).filter(([key]) => key !== 'propiedad').map(([key, label]) => (
                            <span key={key} className="vz-map-legend-item">
                                <svg viewBox="0 0 24 24" className="vz-map-legend-icon" aria-hidden="true">
                                    <path d={TYPE_ICON_PATHS[key]} fill="none" stroke="currentColor" strokeWidth="1.8"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
