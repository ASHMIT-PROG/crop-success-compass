
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Crop as CropIcon, Upload as UploadIcon } from "lucide-react";

interface PlantIdResult {
  name: string;
  suggestion: string;
}

function getCroppedImg(imageSrc: string, crop: any, zoom: number, aspect: number): Promise<Blob | null> {
  // This function uses the HTMLCanvasElement API to crop the image
  // Adapted for quick usage in this context
  // For real production use, this could be isolated in a util
  return new Promise((resolve) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = image.naturalWidth / image.width;
      const cropWidth = crop.width * scale;
      const cropHeight = crop.height * scale;

      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(
        image,
        crop.x * scale,
        crop.y * scale,
        crop.width * scale,
        crop.height * scale,
        0,
        0,
        cropWidth,
        cropHeight
      );
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
}

// Placeholder Plant ID API function
async function identifyPlantDummy(blob: Blob): Promise<PlantIdResult> {
  // Here we’d call the Plant ID API - for demo, we return a mock result after a delay
  await new Promise((r) => setTimeout(r, 1200));
  return {
    name: "Wheat",
    suggestion: "Identified as wheat based on leaf shape and color.",
  };
}

const PlantIdPage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [cropping, setCropping] = useState(false);
  const [result, setResult] = useState<PlantIdResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setResult(null);
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file.");
        setImageSrc(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixelsParam: any) => {
    setCroppedAreaPixels(croppedAreaPixelsParam);
  };

  const handleCropAndIdentify = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setCropping(true);
    setIsIdentifying(false);
    setResult(null);

    const croppedBlob = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      zoom,
      1 // aspect ratio: square (adjust if needed)
    );

    setCropping(false);
    if (!croppedBlob) {
      setUploadError("Failed to crop the image.");
      return;
    }
    setIsIdentifying(true);
    // Real API: send croppedBlob to the plant ID API here!
    const plant = await identifyPlantDummy(croppedBlob);
    setIsIdentifying(false);
    setResult(plant);
  };

  const reset = () => {
    setImageSrc(null);
    setResult(null);
    setCropping(false);
    setIsIdentifying(false);
    setUploadError(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-green-50 via-yellow-50 to-green-100 px-2 py-8">
      <Card className="w-full max-w-xl border-green-200 shadow-2xl bg-white/90">
        <CardHeader className="flex flex-row gap-2 items-center bg-gradient-to-r from-green-100 to-green-50 border-b border-green-100 rounded-t-xl">
          <ImageIcon className="text-green-600" />
          <CardTitle className="text-2xl font-extrabold text-green-900 tracking-tight font-playfair">
            Plant Identifier
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {!imageSrc ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-8">
              <label
                htmlFor="plant-upload"
                className="flex flex-col items-center p-4 border-2 border-dashed rounded-xl border-green-200 bg-green-50 hover:shadow cursor-pointer transition group"
              >
                <UploadIcon className="w-10 h-10 mb-2 text-green-400 group-hover:text-green-600" />
                <span className="font-bold text-green-700">Click to upload a plant photo</span>
                <span className="text-gray-400 text-sm mt-1">Accepted: JPEG/PNG, max 5MB</span>
                <input
                  ref={inputRef}
                  id="plant-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
              {uploadError && (
                <div className="text-sm text-red-500">{uploadError}</div>
              )}
            </div>
          ) : (
            <>
              <div className="relative w-full aspect-[4/3] bg-gray-100 border rounded-lg overflow-hidden flex items-center justify-center">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  showGrid={false}
                  cropShape="round"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-2">
                <div className="flex flex-row gap-3 items-center w-full">
                  <label className="text-sm font-medium w-24 text-green-700">
                    Zoom
                  </label>
                  <input
                    min={1}
                    max={5}
                    step={0.1}
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    type="range"
                    className="w-full"
                    disabled={cropping || isIdentifying}
                  />
                </div>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={reset}
                  disabled={cropping || isIdentifying}
                >
                  Upload another
                </Button>
              </div>
              <Button
                variant="default"
                size="lg"
                className="w-full font-bold mt-3 flex gap-2 items-center"
                onClick={handleCropAndIdentify}
                disabled={cropping || isIdentifying}
              >
                <CropIcon /> Crop & Identify
              </Button>
              {cropping && (
                <div className="w-full text-center py-3">
                  <span className="text-green-700 font-semibold">Processing...</span>
                </div>
              )}
            </>
          )}
          {isIdentifying && (
            <div className="flex flex-col items-center mt-3">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-green-700 mb-1"></div>
              <span className="text-green-700 mt-1">Identifying plant type...</span>
            </div>
          )}
          {result && (
            <div className="px-4 py-3 rounded-xl border border-green-100 bg-green-50 shadow flex flex-col items-center mt-3">
              <span className="font-semibold text-lg text-green-700">Result: {result.name}</span>
              <span className="text-green-800 text-base">{result.suggestion}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantIdPage;
