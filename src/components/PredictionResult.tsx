
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Leaf, BarChart, ThermometerSun } from "lucide-react";

type PredictionResultProps = {
  isVisible: boolean;
  results: {
    cropName: string;
    successRate: number;
    isSuitable: boolean;
    alternativeCrop?: string;
    yieldPercentage: number;
    soilSuitability: number;
    climateCompatibility: number;
  } | null;
};

const PredictionResult = ({ isVisible, results }: PredictionResultProps) => {
  if (!isVisible || !results) return null;

  return (
    <Card className="w-full transition-all duration-500 ease-in-out">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-green-800">
            Crop Success Prediction: {results.cropName.charAt(0).toUpperCase() + results.cropName.slice(1)}
          </CardTitle>
          <Badge variant={results.isSuitable ? "default" : "destructive"} className={`px-3 py-1 ${results.isSuitable ? 'bg-green-600' : 'bg-red-600'}`}>
            {results.isSuitable ? (
              <><Check className="h-4 w-4 mr-1" /> Suitable</>
            ) : (
              <><AlertTriangle className="h-4 w-4 mr-1" /> Not Recommended</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <h3 className="text-md font-semibold flex items-center">
                <Leaf className="h-4 w-4 mr-2 text-green-600" />
                Success Rate
              </h3>
              <span className="font-bold text-lg">{results.successRate}%</span>
            </div>
            <Progress value={results.successRate} className="h-2 bg-gray-200" indicatorClassName={
              results.successRate > 70 ? "bg-green-600" :
              results.successRate > 40 ? "bg-yellow-500" : "bg-red-500"
            } />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-md font-semibold flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-blue-600" />
                  Expected Yield
                </h3>
                <span className="font-bold">{results.yieldPercentage}%</span>
              </div>
              <Progress value={results.yieldPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="text-md font-semibold flex items-center">
                  <ThermometerSun className="h-4 w-4 mr-2 text-amber-600" />
                  Soil Suitability
                </h3>
                <span className="font-bold">{results.soilSuitability}%</span>
              </div>
              <Progress value={results.soilSuitability} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
            </div>
          </div>

          {!results.isSuitable && results.alternativeCrop && (
            <>
              <Separator />
              <div className="pt-2">
                <h3 className="text-md font-semibold mb-2 text-green-700">Recommended Alternative:</h3>
                <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 font-medium">{results.alternativeCrop}</p>
                  <p className="text-sm text-green-600 mt-1">This crop has a higher success rate in your selected conditions.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
