import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
}) => {

  // 🔥 Unique ID for each map instance
  const uniqueId = React.useId(); 
  const mapId = `location-picker-${uniqueId.replace(/:/g, '')}`; // Sanitize ID for Leaflet

  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Initialize map
  useEffect(() => {
    // Check if map container exists
    const container = document.getElementById(mapId);
    if (!container) return;

    // Prevent multiple initializations
    if (map) return;

    const leafletMap = L.map(mapId, {
      center: [12.9716, 77.5946],
      zoom: 13,
      zoomControl: false, // We'll add it in a better position if needed, or stick to default
    });

    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
      setMap(null);
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

    const handleClick = async (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      updateLocation(lat, lng);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, marker]);

  const updateLocation = async (lat: number, lng: number) => {
    if (!map) return;

    if (marker) marker.remove();
    const newMarker = L.marker([lat, lng]).addTo(map);
    setMarker(newMarker);
    
    // Center map on new marker
    map.flyTo([lat, lng], 16);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const address = data.display_name || "Unknown location";
      onLocationSelect(lat, lng, address);
      setSearchQuery(address.split(',')[0]); // Set simple name in search bar
    } catch (error) {
      console.error("Error fetching address:", error);
      onLocationSelect(lat, lng, "Unknown location");
    }
  };

  // Current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await updateLocation(lat, lng);
        setIsSearching(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setIsSearching(false);
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        await updateLocation(lat, lng);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search for a location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isSearching} variant="secondary">
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>
        <Button 
          onClick={handleCurrentLocation}
          variant="outline"
          className="flex items-center gap-2"
          title="Use current location"
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">My Location</span>
        </Button>
      </div>

      <Card className="overflow-hidden border-2 border-muted shadow-sm">
        <div
          id={mapId}
          style={{
            height: "450px",
            width: "100%",
            zIndex: 0
          }}
          className="bg-muted/20"
        />
      </Card>
      
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        <span>Click on the map to place a pin precisely</span>
      </div>
    </div>
  );
};
