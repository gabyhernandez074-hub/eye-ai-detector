import { useState } from "react";
import { PatientInfoForm, PatientFormData } from "@/components/PatientInfoForm";
import { ImageUploadSection, AnalysisResult } from "@/components/ImageUploadSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Retinal Detachment AI Detection
              </h1>
              <p className="text-sm text-muted-foreground">
                Clinical Decision Support System
              </p>
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
