import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadSectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  gradcamUrl: string;
  originalImageUrl: string;
}

export const ImageUploadSection = ({ onAnalysisComplete }: ImageUploadSectionProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file (JPEG/PNG)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      toast({
        title: "Image uploaded",
        description: "Ready for AI analysis",
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call with 2-3 second delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock result - in production, this would come from your backend
    const mockResult: AnalysisResult = {
      diagnosis: Math.random() > 0.5 ? "Retinal Detachment Detected" : "No Retinal Detachment",
      confidence: Math.floor(Math.random() * 20 + 80), // 80-100%
      gradcamUrl: image || "", // In production, this would be a heatmap overlay
      originalImageUrl: image || "",
    };

    setIsAnalyzing(false);
    onAnalysisComplete(mockResult);
    
    toast({
      title: "Analysis Complete",
      description: "Results are ready for review",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Fundus Image Upload & Analysis</CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload a fundus photograph for AI-based retinal detachment detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8 transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-border"}
            ${image ? "border-solid" : ""}
          `}
        >
          {!image ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop a fundus image here, or click to browse
              </p>
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Select Image</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-secondary/20">
                <img
                  src={image}
                  alt="Uploaded fundus"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
              <div className="flex gap-2">
                <label htmlFor="file-upload-replace" className="flex-1">
                  <Button variant="outline" className="w-full cursor-pointer" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Replace Image
                    </span>
                  </Button>
                  <input
                    id="file-upload-replace"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {image && (
          <Button
            onClick={simulateAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Run AI Analysis
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
