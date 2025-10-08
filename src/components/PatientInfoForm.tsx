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
        <CardTitle className="text-foreground">Patient Information</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter patient details for retinal examination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Patient ID / Document Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PT-12345" {...field} />
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
                    <FormLabel>Age</FormLabel>
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
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card z-50">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    <FormLabel>Referring Doctor</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Smith" {...field} />
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
                    <FormLabel>Examination Date</FormLabel>
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
                  <FormLabel>Clinical Notes / Observations (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any relevant clinical observations or patient history..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
