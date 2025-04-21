
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OSMMapSelector from './OSMMapSelector';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const cropOptions = [
  'rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas',
  'mothbeans', 'mungbean', 'blackgram', 'lentil', 'pomegranate',
  'banana', 'mango', 'grapes', 'watermelon', 'muskmelon',
  'apple', 'orange', 'papaya', 'coconut', 'cotton',
  'jute', 'coffee'
];

type CropFormProps = {
  onSubmit: (data: {
    crop: string;
    location: { lat: number; lon: number };
    month: string;
  }) => void;
};

const CropForm = ({ onSubmit }: CropFormProps) => {
  const [crop, setCrop] = useState<string>('');
  const [customCrop, setCustomCrop] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [month, setMonth] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (!crop && !customCrop) {
      setError('Please select or enter a crop');
      return;
    }
    if (!location) {
      setError('Please select a location');
      return;
    }
    if (!month) {
      setError('Please select a seeding month');
      return;
    }
    setError('');
    onSubmit({
      crop: crop || customCrop,
      location,
      month
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="crop">Crop</Label>
            <Select value={crop} onValueChange={(value) => {
              setCrop(value);
              setCustomCrop('');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {cropOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-2">
              <Label htmlFor="customCrop">Or enter custom crop name</Label>
              <Input
                id="customCrop"
                value={customCrop}
                onChange={(e) => {
                  setCustomCrop(e.target.value);
                  setCrop('');
                }}
                placeholder="Enter crop name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <OSMMapSelector
              onLocationSelect={(lat, lon, name) => {
                setLocation({ lat, lon });
                setLocationName(name);
              }}
            />
            {locationName && (
              <div className="text-sm text-muted-foreground mt-2">
                Selected: {locationName}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Seeding Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-sm font-medium text-destructive">{error}</div>}

          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Predict Crop Success
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropForm;
