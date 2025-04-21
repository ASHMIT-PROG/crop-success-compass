
// This is a mock service that simulates the backend AI processing
// In a real implementation, this would be a Node.js backend using Gemini API

import { 
  cropDataExtract, 
  regionData, 
  monthToSeason, 
  seasonalEffects, 
  cropOptimalConditions,
  availableCrops
} from './mockData';

// Get region from coordinates (very simplified)
function getRegionFromCoordinates(lat: number, lon: number): string {
  // India regions - very simplified approximation
  if (lat > 28) return 'North India';
  if (lat < 15) return 'South India';
  if (lon > 85) return 'East India';
  if (lon < 75) return 'West India';
  return 'Central India';
}

// Calculate match percentage between actual and optimal values
function calculateMatchPercentage(actual: number, min: number, max: number): number {
  if (actual >= min && actual <= max) return 100;
  if (actual < min) {
    return Math.max(0, 100 - (min - actual) * 10);
  }
  return Math.max(0, 100 - (actual - max) * 10);
}

// Find alternative crop
function findAlternativeCrop(region: string, month: string, excludeCrop: string): string {
  const regionInfo = regionData[region as keyof typeof regionData] || regionData['North India'];
  const season = monthToSeason[month as keyof typeof monthToSeason] || 'Summer';
  
  const alternatives = availableCrops.filter(crop => 
    crop !== excludeCrop.toLowerCase() && 
    cropOptimalConditions[crop as keyof typeof cropOptimalConditions]?.seasons?.includes(season)
  );
  
  if (alternatives.length === 0) return 'Wheat'; // Default fallback
  
  // Select one based on regional suitability
  const regionalCrops = regionInfo.crops;
  const matchingCrop = alternatives.find(crop => regionalCrops.includes(crop));
  
  if (matchingCrop) {
    return matchingCrop.charAt(0).toUpperCase() + matchingCrop.slice(1);
  }
  
  // If no match, just pick the first alternative
  return alternatives[0].charAt(0).toUpperCase() + alternatives[0].slice(1);
}

export async function predictCropSuccess(cropName: string, location: { lat: number, lon: number }, month: string) {
  return new Promise<any>(resolve => {
    // Add a small delay to simulate API call
    setTimeout(() => {
      // Get region data based on coordinates
      const region = getRegionFromCoordinates(location.lat, location.lon);
      const regionInfo = regionData[region as keyof typeof regionData] || regionData['North India'];
      
      // Get season from month
      const season = monthToSeason[month as keyof typeof monthToSeason] || 'Summer';
      const seasonInfo = seasonalEffects[season as keyof typeof seasonalEffects];
      
      // Adjust conditions based on season
      const adjustedTemperature = regionInfo.temperature + (seasonInfo?.temperature || 0);
      const adjustedRainfall = regionInfo.rainfall + (seasonInfo?.rainfall || 0);
      const adjustedHumidity = 70 + (seasonInfo?.humidity || 0); // Base humidity value
      
      // Get optimal conditions for the crop
      const cropName_lower = cropName.toLowerCase();
      const defaultCropConditions = {
        temperature: { min: 18, max: 30 }, 
        rainfall: { min: 60, max: 300 },
        humidity: { min: 55, max: 90 }, 
        ph: { min: 5.5, max: 7.5 }
      };
      
      const cropCondition = Object.prototype.hasOwnProperty.call(cropOptimalConditions, cropName_lower) 
        ? cropOptimalConditions[cropName_lower as keyof typeof cropOptimalConditions]
        : defaultCropConditions;
      
      // Calculate match percentages for different factors
      const temperatureMatch = calculateMatchPercentage(adjustedTemperature, cropCondition.temperature.min, cropCondition.temperature.max);
      const rainfallMatch = calculateMatchPercentage(adjustedRainfall, cropCondition.rainfall.min, cropCondition.rainfall.max);
      const phMatch = calculateMatchPercentage(regionInfo.ph, cropCondition.ph?.min || 5.5, cropCondition.ph?.max || 7.5);
      const humidityMatch = calculateMatchPercentage(adjustedHumidity, cropCondition.humidity?.min || 55, cropCondition.humidity?.max || 90);
      
      // Season suitability
      const seasonMatch = ('seasons' in cropCondition && 
        Array.isArray(cropCondition.seasons) && 
        cropCondition.seasons.includes(season)) ? 100 : 50;
      
      // Soil suitability
      const soilMatch = ('soilTypes' in cropCondition && 
        Array.isArray(cropCondition.soilTypes) && 
        cropCondition.soilTypes.includes(regionInfo.soilType)) ? 100 : 60;
      
      // Overall success rate calculation
      const successRate = Math.round((
        temperatureMatch * 0.2 + 
        rainfallMatch * 0.2 + 
        phMatch * 0.15 + 
        humidityMatch * 0.15 +
        seasonMatch * 0.15 +
        soilMatch * 0.15
      ));
      
      // Determine if the crop is suitable
      const isSuitable = successRate >= 70;
      
      // Get yield percentage (simplified calculation)
      const yieldPercentage = Math.min(100, Math.round(successRate * 0.9));
      
      // Soil suitability based on pH match and region
      const soilSuitability = Math.round((phMatch * 0.6 + soilMatch * 0.4));
      
      // Climate compatibility based on temperature and rainfall
      const climateCompatibility = Math.round((temperatureMatch + rainfallMatch + seasonMatch) / 3);
      
      // Find alternative crop if not suitable
      const alternativeCrop = !isSuitable ? findAlternativeCrop(region, month, cropName_lower) : undefined;
      
      // Return the prediction results
      resolve({
        cropName,
        successRate,
        isSuitable,
        alternativeCrop,
        yieldPercentage,
        soilSuitability,
        climateCompatibility,
        details: {
          region,
          soilType: regionInfo.soilType,
          adjustedTemperature,
          adjustedRainfall,
          ph: regionInfo.ph,
          season
        }
      });
    }, 1500);
  });
}
