
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CropForm from "@/components/CropForm";
import PredictionResult from "@/components/PredictionResult";
import { predictCropSuccess } from "@/lib/mockPredictionService";
import { DatasetInfo } from "@/components/InfoCard";
import { Leaf, BarChart, CloudRain } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [predictionResults, setPredictionResults] = useState<any>(null);

  const handleFormSubmit = async (data: {
    crop: string;
    location: { lat: number; lon: number };
    month: string;
  }) => {
    setIsLoading(true);
    setShowResults(false);
    
    try {
      // In a real app, this would call your Node.js backend
      // which would then use the Gemini API
      const results = await predictCropSuccess(
        data.crop,
        data.location,
        data.month
      );
      
      setPredictionResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error getting prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-3xl font-bold text-green-800">
              FarmSight AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered predictions to help farmers make informed planting decisions,
            maximize yields and prevent losses.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="bg-green-50 border-b border-green-100">
                <CardTitle className="text-green-800">Enter Farm Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CropForm onSubmit={handleFormSubmit} />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DatasetInfo />
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 text-green-600 mr-2" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
                    <li>Enter your crop choice and farm location</li>
                    <li>Select the planned seeding month</li>
                    <li>Our AI analyzes soil & climate compatibility</li>
                    <li>Receive success rate prediction and recommendations</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                  <p className="mt-3 font-medium text-green-800">Analyzing crop data...</p>
                </div>
              </div>
            ) : null}

            <PredictionResult 
              isVisible={showResults} 
              results={predictionResults} 
            />

            {!showResults && !isLoading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="h-16 w-16 text-green-200 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No Prediction Yet</h3>
                  <p className="text-gray-400">
                    Fill out the form and submit to see crop success prediction
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
