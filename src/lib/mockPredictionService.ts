import {
  cropDataExtract,
  regionData,
  monthToSeason,
  seasonalEffects,
  cropOptimalConditions,
  availableCrops
} from './mockData';

function getRegionFromCoordinates(lat: number, lon: number): string {
  if (lat > 28) return 'North India';
  if (lat < 15) return 'South India';
  if (lon > 85) return 'East India';
  if (lon < 75) return 'West India';
  return 'Central India';
}

function calculateMatchPercentage(actual: number, min: number, max: number): number {
  if (actual >= min && actual <= max) return 100;
  if (actual < min) {
    return Math.max(0, 100 - (min - actual) * 10);
  }
  return Math.max(0, 100 - (actual - max) * 10);
}

function findAlternativeCrop(region: string, month: string, excludeCrop: string): string {
  const regionInfo = regionData[region as keyof typeof regionData] || regionData['North India'];
  const season = monthToSeason[month as keyof typeof monthToSeason] || 'Summer';
  
  const alternatives = availableCrops.filter(crop => 
    crop !== excludeCrop.toLowerCase() && 
    cropOptimalConditions[crop as keyof typeof cropOptimalConditions]?.seasons?.includes(season)
  );
  
  if (alternatives.length === 0) return 'Wheat';
  
  const regionalCrops = regionInfo.crops;
  const matchingCrop = alternatives.find(crop => regionalCrops.includes(crop));
  
  if (matchingCrop) {
    return matchingCrop.charAt(0).toUpperCase() + matchingCrop.slice(1);
  }
  
  return alternatives[0].charAt(0).toUpperCase() + alternatives[0].slice(1);
}

function getSoilCompatibilityScore(cropName: string): { score: number, rating: string, avgRainfall: number, avgHumidity: number } {
  const cropRows = cropDataExtract.filter(row => row.label.toLowerCase() === cropName.toLowerCase());
  if (!cropRows.length) return { score: 5, rating: "Average", avgRainfall: 100, avgHumidity: 60 };
  
  const sumRainfall = cropRows.reduce((sum, row) => sum + Number(row.rainfall), 0);
  const sumHumidity = cropRows.reduce((sum, row) => sum + Number(row.humidity), 0);
  const avgRainfall = sumRainfall / cropRows.length;
  const avgHumidity = sumHumidity / cropRows.length;

  let rainfallScore = Math.max(0, Math.min(5, (avgRainfall - 50) / (300 - 50) * 5));
  let humidityScore = Math.max(0, Math.min(5, (avgHumidity - 50) / (90 - 50) * 5));
  const score = Math.round((rainfallScore + humidityScore) * 10) / 2 / 10;

  let rating = "Average";
  if (score >= 7) rating = "Good";
  else if (score < 5) rating = "Poor";
  return { score, rating, avgRainfall, avgHumidity };
}

export async function predictCropSuccess(cropName: string, location: { lat: number, lon: number }, month: string) {
  return new Promise<any>(resolve => {
    setTimeout(() => {
      const region = getRegionFromCoordinates(location.lat, location.lon);
      const regionInfo = regionData[region as keyof typeof regionData] || regionData['North India'];
      const season = monthToSeason[month as keyof typeof monthToSeason] || 'Summer';
      const seasonInfo = seasonalEffects[season as keyof typeof seasonalEffects];
      const adjustedTemperature = regionInfo.temperature + (seasonInfo?.temperature || 0);
      const adjustedRainfall = regionInfo.rainfall + (seasonInfo?.rainfall || 0);
      const adjustedHumidity = 70 + (seasonInfo?.humidity || 0);

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

      const temperatureMatch = calculateMatchPercentage(adjustedTemperature, cropCondition.temperature.min, cropCondition.temperature.max);
      const rainfallMatch = calculateMatchPercentage(adjustedRainfall, cropCondition.rainfall.min, cropCondition.rainfall.max);
      const phMatch = calculateMatchPercentage(regionInfo.ph, cropCondition.ph?.min || 5.5, cropCondition.ph?.max || 7.5);
      const humidityMatch = calculateMatchPercentage(adjustedHumidity, cropCondition.humidity?.min || 55, cropCondition.humidity?.max || 90);
      const seasonMatch = ('seasons' in cropCondition &&
        Array.isArray(cropCondition.seasons) &&
        cropCondition.seasons.includes(season)) ? 100 : 50;
      const soilMatch = ('soilTypes' in cropCondition &&
        Array.isArray(cropCondition.soilTypes) &&
        cropCondition.soilTypes.includes(regionInfo.soilType)) ? 100 : 60;
      const successRate = Math.round((
        temperatureMatch * 0.2 +
        rainfallMatch * 0.2 +
        phMatch * 0.15 +
        humidityMatch * 0.15 +
        seasonMatch * 0.15 +
        soilMatch * 0.15
      ));
      const isSuitable = successRate >= 70;
      const yieldPercentage = Math.min(100, Math.round(successRate * 0.9));
      const soilSuitability = Math.round((phMatch * 0.6 + soilMatch * 0.4));
      const climateCompatibility = Math.round((temperatureMatch + rainfallMatch + seasonMatch) / 3);
      const alternativeCrop = !isSuitable ? findAlternativeCrop(region, month, cropName_lower) : undefined;

      const soilComp = getSoilCompatibilityScore(cropName_lower);

      resolve({
        cropName,
        successRate,
        isSuitable,
        alternativeCrop,
        yieldPercentage,
        soilSuitability,
        climateCompatibility,
        soilCompatibilityScore: soilComp.score,
        soilCompatibilityRating: soilComp.rating,
        details: {
          region,
          soilType: regionInfo.soilType,
          adjustedTemperature,
          adjustedRainfall,
          ph: regionInfo.ph,
          season,
          soilCompatibilityScore: soilComp.score,
          soilCompatibilityRating: soilComp.rating,
          soilAvgRainfall: soilComp.avgRainfall,
          soilAvgHumidity: soilComp.avgHumidity
        }
      });
    }, 1500);
  });
}
