import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function PropertyMapDetail({ property }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !property || !property.location || !property.location.latitude || !property.location.longitude) return;

    const initializeMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        
        // Fix Leaflet icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        const latitude = parseFloat(property.location.latitude);
        const longitude = parseFloat(property.location.longitude);

        // Create map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], 15);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Add property marker
        const marker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
        const popupContent = `
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-gray-800 mb-1">${property.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${property.location.address || property.location.name}</p>
            <p class="text-xs text-gray-500">
              📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
            </p>
          </div>
        `;
        marker.bindPopup(popupContent).openPopup();

        // Add service radius circle
        L.circle([latitude, longitude], {
          color: 'rgba(59, 130, 246, 0.3)',
          weight: 2,
          fill: true,
          fillColor: 'rgba(59, 130, 246, 0.1)',
          fillOpacity: 0.2,
          radius: 5000,
        }).addTo(mapInstanceRef.current);
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
  }, [property]);

  if (!property || !property.location || !property.location.latitude || !property.location.longitude) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Location data not available</p>
      </div>
    );
  }

  const latitude = parseFloat(property.location.latitude);
  const longitude = parseFloat(property.location.longitude);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <div className="h-96 md:h-[500px] relative">
        <div ref={mapRef} className="w-full h-full" />
      </div>

      {/* Location info panel */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Ubicación</h4>
            <p className="text-gray-600 text-sm mb-3">{property.location.address || property.location.name}</p>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Latitud:</span> {latitude.toFixed(6)}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Longitud:</span> {longitude.toFixed(6)}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Información</h4>
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-semibold">Propiedad:</span> {property.title}
            </p>
            {property.location.city && (
              <p className="text-gray-600 text-sm mb-2">
                <span className="font-semibold">Ciudad:</span> {property.location.city}
              </p>
            )}
            {property.location.name && (
              <p className="text-gray-600 text-sm">
                <span className="font-semibold">Barrio:</span> {property.location.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
