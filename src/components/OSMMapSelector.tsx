
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

// Fix marker icon issue with leaflet in react
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

interface OSMMapSelectorProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

function LocationMarker({ onSelect }: { onSelect: (lat: number, lon: number, name: string) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng, `Location at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);
    }
  });

  return position ? (
    <Marker position={position}></Marker>
  ) : null;
}

const sampleLocations = [
  { name: "New Delhi, India", lat: 28.6139, lon: 77.2090 },
  { name: "Mumbai, India", lat: 19.0760, lon: 72.8777 },
  { name: "Bangalore, India", lat: 12.9716, lon: 77.5946 },
  { name: "Hyderabad, India", lat: 17.3850, lon: 78.4867 },
  { name: "Chennai, India", lat: 13.0827, lon: 80.2707 },
  { name: "Kolkata, India", lat: 22.5726, lon: 88.3639 },
  { name: "Punjab, India", lat: 31.1471, lon: 75.3412 },
  { name: "Gujarat, India", lat: 22.2587, lon: 71.1924 },
  { name: "Rajasthan, India", lat: 27.0238, lon: 74.2179 }
];

const OSMMapSelector = ({ onLocationSelect }: OSMMapSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof sampleLocations>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("");

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    // Search demo: match from sample locations
    const results = sampleLocations.filter((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleSelectLocation = (loc: typeof sampleLocations[0]) => {
    setSelectedLocation({ lat: loc.lat, lon: loc.lon });
    setLocationName(loc.name);
    onLocationSelect(loc.lat, loc.lon, loc.name);
    setSearchResults([]);
  };

  const handleMapClick = (lat: number, lon: number, name?: string) => {
    setSelectedLocation({ lat, lon });
    const nm = name || `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    setLocationName(nm);
    onLocationSelect(lat, lon, nm);
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city/region in India"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((loc, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectLocation(loc)}
                >
                  {loc.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleSearch} variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md overflow-hidden border relative" style={{ height: 250 }}>
        <MapContainer
          center={selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : [22.5, 78.96]}
          zoom={selectedLocation ? 7 : 5}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lon]}></Marker>
          )}
          <LocationMarker onSelect={(lat, lon, name) => handleMapClick(lat, lon, name)} />
        </MapContainer>
        <div className="absolute bottom-0 left-0 bg-white/90 text-xs p-1 rounded-tl-md">
          Click map to select location, or search above.
        </div>
      </div>
      {locationName && (
        <div className="flex items-center text-sm mt-1">
          <MapPin className="mr-1 h-4 w-4 text-green-600" />
          <span className="truncate">Selected: {locationName}</span>
          {selectedLocation && (
            <span className="ml-2 text-xs text-gray-500">
              ({selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default OSMMapSelector;
