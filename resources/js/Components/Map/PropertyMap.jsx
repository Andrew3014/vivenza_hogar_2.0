import React, { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';

export default function PropertyMap({ properties = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !properties || properties.length === 0) return;

    // Lazy load Leaflet to avoid SSR issues
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

        const validProperties = properties.filter(
          p => p.location && p.location.latitude && p.location.longitude
        );

        if (validProperties.length === 0) return;

        // Calculate center
        const centerLat = validProperties.reduce((sum, p) => sum + parseFloat(p.location.latitude), 0) / validProperties.length;
        const centerLng = validProperties.reduce((sum, p) => sum + parseFloat(p.location.longitude), 0) / validProperties.length;

        // Create map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        mapInstanceRef.current = L.map(mapRef.current).setView([centerLat, centerLng], 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Add markers
        validProperties.forEach(property => {
          const lat = parseFloat(property.location.latitude);
          const lng = parseFloat(property.location.longitude);
          const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
          
          const popupContent = `
            <div class="p-2 min-w-max">
              <h3 class="font-bold text-gray-800 cursor-pointer hover:text-blue-600">${property.title}</h3>
              <p class="text-sm text-gray-600">${property.location.address || property.location.name}</p>
              <p class="text-sm font-semibold text-blue-600 mt-2">$${property.price.toLocaleString()}</p>
              <p class="text-xs text-gray-500 mt-1">Click para más detalles</p>
            </div>
          `;
          marker.bindPopup(popupContent);
          
          // Make marker clickable to go to property details
          marker.on('click', () => {
            router.visit(`/properties/${property.id}`);
          });
        });
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

  const validProperties = properties.filter(
    p => p.location && p.location.latitude && p.location.longitude
  );

  if (!properties || properties.length === 0 || validProperties.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No location data available</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-96 md:h-[500px]" />
    </div>
  );
}
