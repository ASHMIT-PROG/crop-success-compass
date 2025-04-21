
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

// Sample locations for demonstration
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

const MapSelector = ({ onLocationSelect }: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lon: number} | null>(null);
  const [searchResults, setSearchResults] = useState<typeof sampleLocations>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // Filter sample locations based on search query
    const results = sampleLocations.filter(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setShowResults(true);
  };

  const handleSelectLocation = (location: typeof sampleLocations[0]) => {
    setSelectedLocation({ lat: location.lat, lon: location.lon });
    setLocationName(location.name);
    onLocationSelect(location.lat, location.lon, location.name);
    setShowResults(false);
  };

  const handleMapClick = (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    const clickedName = `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    setLocationName(clickedName);
    onLocationSelect(lat, lon, clickedName);
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {searchResults.map((location, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectLocation(location)}
                >
                  {location.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={handleSearch} variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <Card className="overflow-hidden border rounded-md h-[300px] w-full relative">
        {/* Simplified map visualization for prototype */}
        <div className="absolute inset-0 bg-blue-50 flex flex-col">
          <div className="flex-1 relative">
            {/* Map of India outline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-blue-100 rounded-lg" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
            </div>
            
            {/* Sample locations */}
            {sampleLocations.map((loc, index) => (
              <button
                key={index}
                className={`absolute w-3 h-3 rounded-full transition-all transform hover:scale-150 ${
                  selectedLocation && selectedLocation.lat === loc.lat && selectedLocation.lon === loc.lon
                    ? 'bg-green-600 w-4 h-4'
                    : 'bg-red-500'
                }`}
                style={{
                  left: `${((loc.lon - 68) / (98 - 68)) * 100}%`,
                  top: `${((8 - loc.lat) / (8 - 38)) * 100}%`,
                }}
                onClick={() => handleSelectLocation(loc)}
                title={loc.name}
              ></button>
            ))}
            
            {/* Click handlers */}
            <div 
              className="absolute inset-0" 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const lon = 68 + (x / rect.width) * (98 - 68);
                const lat = 8 + (y / rect.height) * (38 - 8);
                handleMapClick(lat, lon);
              }}
            />
            
            {/* Selected location marker */}
            {selectedLocation && (
              <div 
                className="absolute w-5 h-5 bg-green-600 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{
                  left: `${((selectedLocation.lon - 68) / (98 - 68)) * 100}%`,
                  top: `${((8 - selectedLocation.lat) / (8 - 38)) * 100}%`,
                }}
              />
            )}
          </div>
          
          <div className="bg-white p-2 text-xs text-gray-500 border-t">
            Simplified map for demo. Click anywhere to select a location.
          </div>
        </div>
      </Card>
      
      {locationName && (
        <div className="flex items-center text-sm">
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

export default MapSelector;
