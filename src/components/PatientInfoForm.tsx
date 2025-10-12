import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const patientFormSchema = z.object({
  patientName: z.string().min(1, "Patient name is required").max(100),
  patientId: z.string().min(1, "Patient ID is required").max(50),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  clinicalNotes: z.string().max(500).optional(),
  referringDoctor: z.string().min(1, "Referring doctor is required").max(100),
  examinationDate: z.string().min(1, "Examination date is required"),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;

interface PatientInfoFormProps {
  onSubmit: (data: PatientFormData) => void;
  defaultValues?: Partial<PatientFormData>;
}

export const PatientInfoForm = ({ onSubmit, defaultValues }: PatientInfoFormProps) => {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      patientName: defaultValues?.patientName || "",
      patientId: defaultValues?.patientId || "",
      age: defaultValues?.age || "",
      gender: defaultValues?.gender || "",
      clinicalNotes: defaultValues?.clinicalNotes || "",
      referringDoctor: defaultValues?.referringDoctor || "",
      examinationDate: defaultValues?.examinationDate || new Date().toISOString().split("T")[0],
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Información del Paciente</CardTitle>
        <CardDescription className="text-muted-foreground">
          Ingrese los datos del paciente para el examen de retina
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Paciente</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento de Identificación</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card z-50">
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referringDoctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Médico</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Juan López" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examinationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Examen</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clinicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones Clínicas (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese observaciones clínicas relevantes o historial del paciente..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Guardar Información del Paciente
            </button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
