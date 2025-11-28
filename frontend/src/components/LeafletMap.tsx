import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Incident {
  id: number;
  lat: number;
  lng: number;
  title?: string;
  severity?: string;
  type?: string;
}

interface LeafletMapProps {
  incidents: Incident[];
  heatmap?: boolean;
  center?: [number, number];
  zoom?: number;
}

const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // @ts-ignore - leaflet.heat extends L but types might be missing
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

export const LeafletMap = ({ incidents, heatmap = false, center = [40.7589, -73.9851], zoom = 13 }: LeafletMapProps) => {
  const heatPoints: [number, number, number][] = incidents.map((incident) => [
    incident.lat,
    incident.lng,
    incident.severity === "high" ? 1 : incident.severity === "medium" ? 0.6 : 0.3, // Intensity based on severity
  ]);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {heatmap ? (
        <HeatmapLayer points={heatPoints} />
      ) : (
        incidents.map((incident) => (
          <Marker key={incident.id} position={[incident.lat, incident.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{incident.title || "Incident"}</h3>
                <p className="text-sm capitalize">Type: {incident.type}</p>
                <p className="text-sm capitalize">Severity: {incident.severity}</p>
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
};
