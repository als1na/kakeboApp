import { ReflectionQuestions } from "@/components/reflection/ReflectionQuestions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReflectionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reflexión Mensual</h1>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Preguntas de Conciencia Financiera</CardTitle>
          <CardDescription>
            Tómate un tiempo para reflexionar sobre tus hábitos y progreso financiero.
            El método Kakebo enfatiza la conciencia como clave para una mejor salud financiera.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReflectionQuestions />
        </CardContent>
      </Card>
    </div>
  );
}
