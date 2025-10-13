import { useState } from "react";
import { PatientInfoForm, PatientFormData } from "@/components/PatientInfoForm";
import { ImageUploadSection, AnalysisResult } from "@/components/ImageUploadSection";
import { ResultsSection } from "@/components/ResultsSection";
import { Activity, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import javerianaLogo from "@/assets/javeriana-logo.png";

const Index = () => {
  const [patientData, setPatientData] = useState<PatientFormData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showGradcam, setShowGradcam] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");
  const [formKey, setFormKey] = useState(0);

  const handlePatientSubmit = (data: PatientFormData) => {
    setPatientData(data);
    setActiveTab("analysis");
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setShowGradcam(true);
    setActiveTab("results");
  };

  const handleNewDiagnosis = () => {
    setPatientData(null);
    setAnalysisResult(null);
    setShowGradcam(false);
    setActiveTab("patient");
    setFormKey(prev => prev + 1); // Force form to remount and clear all fields
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
                  Detección de Desprendimiento de Retina con IA
                </h1>
                <p className="text-sm text-secondary font-medium">
                  Sistema de Apoyo Diagnóstico para Decisiones Clínicas
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="patient">Información del Paciente</TabsTrigger>
              <TabsTrigger value="analysis">Análisis de IA</TabsTrigger>
              <TabsTrigger value="results" disabled={!analysisResult}>
                Resultados
              </TabsTrigger>
            </TabsList>
            <Button 
              onClick={handleNewDiagnosis}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Nuevo Diagnóstico
            </Button>
          </div>

          <TabsContent value="patient" className="space-y-6">
            <PatientInfoForm
              key={formKey}
              onSubmit={handlePatientSubmit}
              defaultValues={patientData || undefined}
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <ImageUploadSection onAnalysisComplete={handleAnalysisComplete} />
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

      {/* Developer Credits Section */}
      <section className="border-t-2 border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Equipo de Desarrollo</h2>
            <p className="text-muted-foreground">
              Proyecto de Bioingeniería - Pontificia Universidad Javeriana (2025)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Student 1 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                SA
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-1">
                Simón Ávila Morales
              </h3>
              <p className="text-sm text-primary text-center font-medium">
                Estudiante de Bioingeniería
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                avilasimon@javeriana.edu.co
              </p>
            </div>

            {/* Student 2 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                AR
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-1">
                Andrés Felipe Rosero Chamorro
              </h3>
              <p className="text-sm text-secondary text-center font-medium">
                Estudiante de Bioingeniería
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                andres_rosero@javeriana.edu.co
              </p>
            </div>

            {/* Student 3 */}
            <div className="bg-card rounded-xl p-6 shadow-lg border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                LH
              </div>
              <h3 className="text-lg font-bold text-foreground text-center mb-1">
                Laura Gabriela Hernández Orjuela
              </h3>
              <p className="text-sm text-accent text-center font-medium">
                Estudiante de Bioingeniería
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                laurahernandezo@javeriana.edu.co
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-medium text-primary">Proyecto de Bioingeniería</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground text-center">
            Esta herramienta es solo para fines de investigación y educación. No está diseñada para diagnóstico clínico.
            Siempre consulte con un profesional de la salud calificado.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
