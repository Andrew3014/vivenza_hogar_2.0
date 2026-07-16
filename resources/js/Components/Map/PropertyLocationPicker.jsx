import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [-16.5256, -68.1673];

export default function PropertyLocationPicker({ value = {}, onChange }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const leafletRef = useRef(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        let cancelled = false;

        const initialize = async () => {
            const L = (await import('leaflet')).default;
            if (cancelled || !mapRef.current) return;
            leafletRef.current = L;

            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            const latitude = Number(value.latitude) || DEFAULT_CENTER[0];
            const longitude = Number(value.longitude) || DEFAULT_CENTER[1];
            const map = L.map(mapRef.current).setView([latitude, longitude], value.latitude && value.longitude ? 16 : 13);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            const updateMarker = (event) => {
                const { lat, lng } = event.latlng;
                if (!markerRef.current) {
                    markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
                    markerRef.current.on('dragend', (dragEvent) => {
                        const position = dragEvent.target.getLatLng();
                        onChangeRef.current?.({ latitude: position.lat.toFixed(8), longitude: position.lng.toFixed(8) });
                    });
                } else {
                    markerRef.current.setLatLng([lat, lng]);
                }
                onChangeRef.current?.({ latitude: lat.toFixed(8), longitude: lng.toFixed(8) });
            };

            map.on('click', updateMarker);
            if (value.latitude && value.longitude) updateMarker({ latlng: { lat: latitude, lng: longitude } });
        };

        initialize();

        return () => {
            cancelled = true;
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
        // The map is initialized once; form changes are propagated through clicks/dragging.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const latitude = Number(value.latitude);
        const longitude = Number(value.longitude);
        if (!mapInstanceRef.current || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

        mapInstanceRef.current.setView([latitude, longitude], 16);
        if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
        } else if (leafletRef.current) {
            markerRef.current = leafletRef.current.marker([latitude, longitude], { draggable: true }).addTo(mapInstanceRef.current);
            markerRef.current.on('dragend', (event) => {
                const position = event.target.getLatLng();
                onChangeRef.current?.({ latitude: position.lat.toFixed(8), longitude: position.lng.toFixed(8) });
            });
        }
    }, [value.latitude, value.longitude]);

    return <div ref={mapRef} className="h-80 w-full overflow-hidden rounded-lg border border-gray-300" />;
}
