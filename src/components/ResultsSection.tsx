import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { AnalysisResult } from "./ImageUploadSection";
import { PatientFormData } from "./PatientInfoForm";

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

  const handleDownloadReport = () => {
    // In production, this would generate a PDF report
    const reportData = {
      patient: patientData,
      analysis: result,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `retinal-analysis-${patientData?.patientId || 'report'}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
                Analysis Results
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                AI-powered retinal detachment assessment
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
              <div className="text-sm text-muted-foreground mb-1">Confidence Score</div>
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
              <div className="text-sm text-muted-foreground mb-1">Clinical Recommendation</div>
              <div className="text-sm font-medium text-foreground">
                {isDetected
                  ? "Immediate ophthalmology consultation recommended"
                  : "Continue routine monitoring"}
              </div>
            </div>
          </div>

          {result.gradcamUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Grad-CAM Heatmap Overlay
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleGradcam}
                >
                  {showGradcam ? "Hide Overlay" : "Show Overlay"}
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
                      Highlighted regions indicate areas of interest identified by the AI model
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {patientData && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Report Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="ml-2 text-foreground">{patientData.patientName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-2 text-foreground">{patientData.patientId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 text-foreground">{patientData.examinationDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Referring Dr:</span>
                  <span className="ml-2 text-foreground">{patientData.referringDoctor}</span>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleDownloadReport} className="w-full bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
