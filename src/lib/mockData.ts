
// This file contains mock data sets for the crop prediction tool

// Dataset extract (just a small sample for the UI to show)
export const cropDataExtract = [
  { n: 90, p: 42, k: 43, temperature: 20.87, humidity: 82.00, ph: 6.50, rainfall: 202.93, label: 'rice' },
  { n: 85, p: 58, k: 41, temperature: 21.77, humidity: 80.31, ph: 7.03, rainfall: 226.65, label: 'rice' },
  { n: 60, p: 55, k: 44, temperature: 23.00, humidity: 82.32, ph: 7.84, rainfall: 263.96, label: 'rice' },
  { n: 71, p: 54, k: 16, temperature: 22.61, humidity: 63.69, ph: 5.74, rainfall: 87.75, label: 'maize' },
  { n: 61, p: 44, k: 17, temperature: 26.10, humidity: 71.57, ph: 6.93, rainfall: 102.26, label: 'maize' },
  { n: 80, p: 43, k: 16, temperature: 23.55, humidity: 71.59, ph: 6.65, rainfall: 66.71, label: 'maize' },
];

// Mock location-based soil and climate data for India
export const regionData = {
  'North India': { 
    soilType: 'Alluvial', 
    ph: 6.8, 
    rainfall: 180, 
    temperature: 22,
    crops: ['wheat', 'rice', 'sugarcane', 'cotton']
  },
  'South India': { 
    soilType: 'Red', 
    ph: 5.9, 
    rainfall: 250, 
    temperature: 28,
    crops: ['rice', 'coconut', 'coffee', 'spices']
  },
  'East India': { 
    soilType: 'Laterite', 
    ph: 6.2, 
    rainfall: 300, 
    temperature: 25,
    crops: ['rice', 'jute', 'tea', 'maize']
  },
  'West India': { 
    soilType: 'Black', 
    ph: 7.1, 
    rainfall: 120, 
    temperature: 24,
    crops: ['cotton', 'groundnut', 'sugarcane', 'jowar']
  },
  'Central India': { 
    soilType: 'Black', 
    ph: 7.5, 
    rainfall: 150, 
    temperature: 26,
    crops: ['soybean', 'wheat', 'cotton', 'pulses']
  },
};

// Mock data for seasonal effects on crop parameters
export const seasonalEffects = {
  'Winter': { temperature: -5, rainfall: -30, humidity: -10 },
  'Summer': { temperature: +8, rainfall: -15, humidity: -20 },
  'Monsoon': { temperature: +2, rainfall: +70, humidity: +30 },
  'Post-Monsoon': { temperature: +4, rainfall: +10, humidity: +15 },
};

// Map months to seasons in India
export const monthToSeason = {
  'January': 'Winter',
  'February': 'Winter',
  'March': 'Summer',
  'April': 'Summer',
  'May': 'Summer',
  'June': 'Monsoon',
  'July': 'Monsoon',
  'August': 'Monsoon',
  'September': 'Monsoon',
  'October': 'Post-Monsoon',
  'November': 'Post-Monsoon',
  'December': 'Winter',
};

// Optimal growing conditions for various crops
export const cropOptimalConditions = {
  'rice': { 
    temperature: { min: 20, max: 27 }, 
    rainfall: { min: 150, max: 300 },
    humidity: { min: 80, max: 90 }, 
    ph: { min: 5.5, max: 7.5 },
    n: { min: 70, max: 100 },
    p: { min: 35, max: 60 },
    k: { min: 35, max: 45 },
    seasons: ['Monsoon', 'Summer'],
    soilTypes: ['Alluvial', 'Clay', 'Clay Loam']
  },
  'maize': { 
    temperature: { min: 18, max: 27 }, 
    rainfall: { min: 60, max: 110 },
    humidity: { min: 55, max: 75 }, 
    ph: { min: 5.5, max: 7.0 },
    seasons: ['Monsoon', 'Summer'],
    soilTypes: ['Loamy', 'Sandy Loam']
  },
  'wheat': { 
    temperature: { min: 15, max: 24 }, 
    rainfall: { min: 75, max: 150 },
    humidity: { min: 60, max: 80 }, 
    ph: { min: 6.0, max: 7.5 },
    seasons: ['Winter', 'Post-Monsoon'],
    soilTypes: ['Loamy', 'Clay Loam']
  },
  'cotton': { 
    temperature: { min: 21, max: 30 }, 
    rainfall: { min: 60, max: 110 },
    humidity: { min: 50, max: 70 }, 
    ph: { min: 5.8, max: 8.0 },
    seasons: ['Monsoon'],
    soilTypes: ['Black', 'Alluvial']
  },
  'sugarcane': { 
    temperature: { min: 20, max: 35 }, 
    rainfall: { min: 100, max: 175 },
    humidity: { min: 70, max: 85 }, 
    ph: { min: 6.0, max: 8.0 },
    seasons: ['Summer'],
    soilTypes: ['Loamy', 'Clay Loam']
  },
  'groundnut': { 
    temperature: { min: 20, max: 30 }, 
    rainfall: { min: 50, max: 125 },
    humidity: { min: 60, max: 75 }, 
    ph: { min: 5.5, max: 7.0 },
    seasons: ['Summer', 'Monsoon'],
    soilTypes: ['Sandy Loam', 'Loamy']
  },
  'jute': { 
    temperature: { min: 24, max: 35 }, 
    rainfall: { min: 150, max: 250 },
    humidity: { min: 80, max: 90 }, 
    ph: { min: 6.0, max: 7.5 },
    seasons: ['Monsoon'],
    soilTypes: ['Alluvial', 'Clay Loam']
  },
};

// Available crops for selection
export const availableCrops = [
  'rice', 'maize', 'wheat', 'cotton', 
  'sugarcane', 'groundnut', 'jute', 'coffee',
  'tea', 'pulses', 'soybeans', 'barley'
];
