import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictRetinalDetachment } from "@/services/apiService";

interface ImageUploadSectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  diagnosis: string;
  confidence: number;
  classIndex: number;
  predictionProbabilities: {
    Healthy: number;
    "Retinal detachment": number;
  };
  recommendation: {
    severity: string;
    urgency: string;
    action: string;
  };
  metadata: {
    processingTimeMs: number;
    device: string;
    timestamp: string;
  };
  visualization?: {
    originalImage: string;
    heatmap: string;
    overlay: string;
  };
  // Legacy fields for backwards compatibility
  gradcamUrl?: string;
  originalImageUrl?: string;
}

export const ImageUploadSection = ({ onAnalysisComplete }: ImageUploadSectionProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileChange = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de archivo inválido",
        description: "Por favor cargue un archivo de imagen válido (JPEG/PNG/WebP)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB as per API spec)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo de archivo es 10MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      toast({
        title: "Imagen cargada",
        description: "Lista para análisis de IA",
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

  const runAnalysis = async () => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ninguna imagen",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Call the actual API
      const response = await predictRetinalDetachment(imageFile, true);
      
      // Transform API response to match our AnalysisResult interface
      const result: AnalysisResult = {
        diagnosis: response.data.diagnosis,
        confidence: Math.round(response.data.confidence * 100) / 100, // Round to 2 decimals
        classIndex: response.data.class_index,
        predictionProbabilities: response.data.prediction_probabilities,
        recommendation: response.data.recommendation,
        metadata: {
          processingTimeMs: response.data.metadata.processing_time_ms,
          device: response.data.metadata.device,
          timestamp: response.data.metadata.timestamp,
        },
        visualization: response.data.visualization ? {
          originalImage: response.data.visualization.original_image,
          heatmap: response.data.visualization.heatmap,
          overlay: response.data.visualization.overlay,
        } : undefined,
        // Backwards compatibility
        gradcamUrl: response.data.visualization?.overlay || image || "",
        originalImageUrl: response.data.visualization?.original_image || image || "",
      };

      onAnalysisComplete(result);
      
      toast({
        title: "Análisis Completo",
        description: "Los resultados están listos para revisar",
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Error en el Análisis",
        description: error instanceof Error ? error.message : "No se pudo procesar la imagen. Por favor intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Carga y Análisis de Imagen de Fondo de Ojo</CardTitle>
        <CardDescription className="text-muted-foreground">
          Cargue una fotografía de fondo de ojo para detección de desprendimiento de retina basado en IA
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
                Arrastre y suelte una imagen de fondo de ojo aquí, o haga clic para buscar
              </p>
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Seleccionar Imagen</span>
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
                      Reemplazar Imagen
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
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando Imagen...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Ejecutar Análisis de IA
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
