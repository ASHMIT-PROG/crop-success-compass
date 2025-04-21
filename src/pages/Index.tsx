import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CropForm from "@/components/CropForm";
import PredictionResult from "@/components/PredictionResult";
import { predictCropSuccess } from "@/lib/mockPredictionService";
import { DatasetInfo } from "@/components/InfoCard";
import { Leaf, BarChart, CloudRain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [predictionResults, setPredictionResults] = useState<any>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (data: {
    crop: string;
    location: { lat: number; lon: number };
    month: string;
  }) => {
    setIsLoading(true);
    setShowResults(false);

    try {
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
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(108deg,#f2f58b_18%,#94c514ad_92%)] px-3 py-8 animate-fade-in">
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl bg-white/90 backdrop-blur-2xl border border-green-100 p-0 md:p-8 transition-all duration-300 hover:shadow-[0_8px_48px_-8px_rgba(53,125,80,0.13)]">
        <div className="flex justify-end mb-2">
          <button
            className="flex items-center gap-2 bg-yellow-200 hover:bg-yellow-300 text-green-900 font-semibold py-2 px-4 rounded-lg shadow transition-all border border-green-100"
            onClick={() => navigate("/plant-id")}
            aria-label="Go to plant identifier"
          >
            <ImageIcon className="w-6 h-6" /> Plant Identifier
          </button>
        </div>
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3 animate-scale-in">
            <Leaf className="h-10 w-10 text-green-600 mr-2 drop-shadow-lg" />
            <h1 className="text-4xl font-extrabold text-green-900 tracking-tight font-playfair transition-all duration-500 hover-scale">
              FarmSight AI
            </h1>
          </div>
          <div className="flex justify-center">
            <p className="text-lg md:text-xl text-green-700/80 bg-green-50/80 rounded-xl px-6 py-3 max-w-2xl shadow hover:shadow-md transition-all duration-200 border border-green-100">
              AI-powered predictions to help farmers make <span className="font-semibold text-primary">informed planting decisions</span>, maximize yields and prevent losses.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <Card className="hover:shadow-xl hover:scale-[1.01] transition-all duration-200 border-green-200 border-2 rounded-2xl bg-white/90">
              <CardHeader className="bg-gradient-to-r from-green-50 via-white to-blue-50 border-b border-green-100 rounded-t-2xl">
                <CardTitle className="text-green-900 text-2xl">Enter Farm Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CropForm onSubmit={handleFormSubmit} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <DatasetInfo />
              <Card className="h-full hover:shadow-lg transition-all border-green-100 rounded-xl bg-green-50/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 text-green-500 mr-2" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ol className="space-y-2 text-base text-green-800/90 list-decimal pl-5 font-medium">
                    <li>Enter your crop choice and farm location</li>
                    <li>Select the planned seeding month</li>
                    <li>Our AI analyzes soil &amp; climate compatibility</li>
                    <li>Receive success rate prediction and recommendations</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/85 rounded-2xl z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-green-700 mb-1"></div>
                  <p className="mt-3 font-semibold text-green-900 tracking-wide text-lg">
                    Analyzing crop data...
                  </p>
                </div>
              </div>
            ) : null}

            <PredictionResult
              isVisible={showResults}
              results={predictionResults}
            />

            {!showResults && !isLoading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-10 animate-fade-in">
                  <Leaf className="h-20 w-20 text-green-200 mx-auto mb-5 drop-shadow" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Prediction Yet</h3>
                  <p className="text-gray-400 text-base">
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
