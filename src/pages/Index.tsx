import { useState } from "react";
import { PatientInfoForm, PatientFormData } from "@/components/PatientInfoForm";
import { ImageUploadSection, AnalysisResult } from "@/components/ImageUploadSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import javerianaLogo from "@/assets/javeriana-logo.png";

const Index = () => {
  const [patientData, setPatientData] = useState<PatientFormData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showGradcam, setShowGradcam] = useState(false);

  const handlePatientSubmit = (data: PatientFormData) => {
    setPatientData(data);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setShowGradcam(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={javerianaLogo} 
                alt="Pontificia Universidad Javeriana" 
                className="h-16 w-auto"
              />
              <div className="border-l-2 border-primary/30 pl-4">
                <h1 className="text-xl font-bold text-primary">
                  Retinal Detachment AI Detection
                </h1>
                <p className="text-sm text-secondary font-medium">
                  Clinical Decision Support System
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI Powered</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResult}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient" className="space-y-6">
            <PatientInfoForm
              onSubmit={handlePatientSubmit}
              defaultValues={patientData || undefined}
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ImageUploadSection onAnalysisComplete={handleAnalysisComplete} />
              
              {analysisResult && (
                <ResultsSection
                  result={analysisResult}
                  patientData={patientData}
                  showGradcam={showGradcam}
                  onToggleGradcam={() => setShowGradcam(!showGradcam)}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultsSection
              result={analysisResult}
              patientData={patientData}
              showGradcam={showGradcam}
              onToggleGradcam={() => setShowGradcam(!showGradcam)}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            This tool is for research and educational purposes only. Not intended for clinical diagnosis.
            Always consult with a qualified healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
