import React, { useEffect, useState } from "react";
import L from "leaflet";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
}) => {

  // 🔥 Unique ID for each map instance
  const uniqueId = React.useId(); 
  const mapId = `location-picker-${uniqueId}`;

  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    const leafletMap = L.map(mapId, {
      center: [12.9716, 77.5946],
      zoom: 13,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, [mapId]);

  // Fix resizing inside modal
  useEffect(() => {
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);

  // Click to pick location
  useEffect(() => {
    if (!map) return;

    map.on("click", async (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (marker) marker.remove();
      const newMarker = L.marker([lat, lng]).addTo(map);
      setMarker(newMarker);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      const address = data.display_name || "Unknown location";
      onLocationSelect(lat, lng, address);
    });
  }, [map, marker]);

  // Current location
  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (map) {
        map.setView([lat, lng], 15);

        if (marker) marker.remove();
        const newMarker = L.marker([lat, lng]).addTo(map);
        setMarker(newMarker);
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();

      const address = data.display_name || "Unknown location";

      onLocationSelect(lat, lng, address);
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleCurrentLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Use My Current Location
      </button>

      <div
        id={mapId}
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "12px",
        }}
      />
    </div>
  );
};
