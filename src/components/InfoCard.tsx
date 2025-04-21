
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThermometerSun, Droplet, CloudRain, Database } from "lucide-react";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const InfoCard = ({ title, children, icon }: InfoCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
};

export const DatasetInfo = () => {
  return (
    <InfoCard 
      title="About Our Dataset" 
      icon={<Database className="h-5 w-5 text-blue-500" />}
    >
      <p className="text-sm text-gray-600">
        Our AI model is trained on a comprehensive agricultural dataset containing soil nutrient levels, climate conditions, and crop outcomes from various regions.
      </p>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-start">
          <ThermometerSun className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">Temperature Data</h4>
            <p className="text-xs text-gray-500">Optimal growing temperatures for each crop variety</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Droplet className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">Humidity Levels</h4>
            <p className="text-xs text-gray-500">Impact of air moisture on crop growth</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CloudRain className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium">Rainfall Patterns</h4>
            <p className="text-xs text-gray-500">Historical precipitation data by region</p>
          </div>
        </div>
      </div>
    </InfoCard>
  );
};
