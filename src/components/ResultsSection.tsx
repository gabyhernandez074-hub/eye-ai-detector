import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "./ImageUploadSection";
import { PatientFormData } from "./PatientInfoForm";
import jsPDF from "jspdf";

interface ResultsSectionProps {
  result: AnalysisResult | null;
  patientData: PatientFormData | null;
  showGradcam: boolean;
  onToggleGradcam: () => void;
}

export const ResultsSection = ({ result, patientData, showGradcam, onToggleGradcam }: ResultsSectionProps) => {
  if (!result) return null;

  const isDetected = result.diagnosis.toLowerCase().includes("detected");
  const confidenceColor = result.confidence >= 90 ? "success" : result.confidence >= 75 ? "warning" : "destructive";

  const handleDownloadReport = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header
    pdf.setFillColor(41, 128, 185);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.text('Detección de Desprendimiento de Retina con IA', pageWidth / 2, 15, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('Sistema de Apoyo Diagnóstico para Decisiones Clínicas', pageWidth / 2, 22, { align: 'center' });
    
    let yPosition = 45;
    
    // Patient Information
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text('Información del Paciente', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    if (patientData) {
      pdf.text(`Nombre del Paciente: ${patientData.patientName}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Documento de Identificación: ${patientData.patientId}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Edad: ${patientData.age}`, 20, yPosition);
      yPosition += 7;
      const genderMap: Record<string, string> = {
        male: 'Masculino',
        female: 'Femenino',
        other: 'Otro'
      };
      pdf.text(`Sexo: ${genderMap[patientData.gender] || patientData.gender}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Fecha de Examen: ${patientData.examinationDate}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`Médico: ${patientData.referringDoctor}`, 20, yPosition);
      yPosition += 7;
      if (patientData.clinicalNotes) {
        const notes = patientData.clinicalNotes.length > 80 
          ? patientData.clinicalNotes.substring(0, 80) + '...' 
          : patientData.clinicalNotes;
        pdf.text(`Observaciones Clínicas: ${notes}`, 20, yPosition);
        yPosition += 7;
      }
    }
    
    yPosition += 5;
    
    // Add uploaded image if available (before results)
    if (result.originalImageUrl) {
      pdf.setFontSize(14);
      pdf.text('Imagen de Fondo de Ojo', 20, yPosition);
      yPosition += 10;
      
      try {
        const imgData = result.originalImageUrl;
        // Smaller image: 100x60
        pdf.addImage(imgData, 'JPEG', 20, yPosition, 100, 60);
        yPosition += 70;
      } catch (error) {
        pdf.setFontSize(10);
        pdf.text('La imagen no pudo incluirse en el reporte', 20, yPosition);
        yPosition += 10;
      }
    }
    
    // Analysis Results
    pdf.setFontSize(14);
    pdf.text('Resultados del Análisis', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Diagnóstico: ${result.diagnosis}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Nivel de Confianza: ${result.confidence}%`, 20, yPosition);
    yPosition += 7;
    
    const recommendation = isDetected
      ? "Se recomienda consulta inmediata con oftalmología"
      : "Continuar monitoreo de rutina";
    pdf.text(`Recomendación Médica de IA: ${recommendation}`, 20, yPosition);
    yPosition += 10;
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    const footerY = pdf.internal.pageSize.getHeight() - 20;
    pdf.text('Generado por Sistema de Detección de Desprendimiento de Retina con IA', pageWidth / 2, footerY, { align: 'center' });
    pdf.text(`Fecha del Reporte: ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, footerY + 5, { align: 'center' });
    pdf.text('Solo para fines de investigación y educación. No destinado para diagnóstico clínico.', pageWidth / 2, footerY + 10, { align: 'center' });
    
    // Save PDF
    pdf.save(`retinal-analysis-${patientData?.patientId || 'report'}-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-4">
      <Card className={isDetected ? "border-warning" : "border-success"}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                {isDetected ? (
                  <AlertCircle className="h-5 w-5 text-warning" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
                Resultados del Análisis
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Evaluación de desprendimiento de retina con IA
              </CardDescription>
            </div>
            <Badge variant={isDetected ? "default" : "secondary"} className={isDetected ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground"}>
              {result.diagnosis}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Nivel de Confianza</div>
              <div className="text-2xl font-bold text-foreground">{result.confidence}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    confidenceColor === "success" ? "bg-success" : 
                    confidenceColor === "warning" ? "bg-warning" : "bg-destructive"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Recomendación Clínica</div>
              <div className="text-sm font-medium text-foreground">
                {isDetected
                  ? "Se recomienda consulta inmediata con oftalmología"
                  : "Continuar monitoreo de rutina"}
              </div>
            </div>
          </div>

          {result.gradcamUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Mapa de Calor Grad-CAM
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleGradcam}
                >
                  {showGradcam ? "Ocultar Mapa" : "Mostrar Mapa"}
                </Button>
              </div>
              
              {showGradcam && (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={result.gradcamUrl}
                    alt="Grad-CAM heatmap"
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-xs text-white">
                      Las regiones resaltadas indican áreas de interés identificadas por el modelo de IA
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {patientData && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Resumen del Reporte</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Paciente:</span>
                  <span className="ml-2 text-foreground">{patientData.patientName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Documento:</span>
                  <span className="ml-2 text-foreground">{patientData.patientId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="ml-2 text-foreground">{patientData.examinationDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Médico:</span>
                  <span className="ml-2 text-foreground">{patientData.referringDoctor}</span>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleDownloadReport} className="w-full bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Descargar Reporte
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
