import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAssessments } from "@/hooks/useAssessments";
import { usePatients } from "@/hooks/usePatients";
import { toast } from "sonner";

export function Assessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAssessmentById, completeAssessment } = useAssessments();
  const { getPatient } = usePatients();
  const [painLevel, setPainLevel] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assessment = getAssessmentById(id || "");
  const patient = assessment ? getPatient(assessment.patientId) : null;

  // Verificar se a avaliação existe
  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Avaliação Não Encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Esta avaliação não existe ou não está mais disponível.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se a avaliação já foi completada
  if (assessment.isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Avaliação Já Respondida</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Esta avaliação já foi respondida. Obrigado!
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se a avaliação expirou
  if (new Date() > new Date(assessment.expiresAt)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Avaliação Expirada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Esta avaliação expirou e não pode mais ser respondida.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para o início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      completeAssessment(assessment.id, assessment.patientId, painLevel, notes, 'patient');
      
      toast.success("Avaliação enviada com sucesso!", {
        description: "Obrigado por compartilhar seu nível de dor.",
      });
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("Erro ao enviar avaliação", {
        description: "Não foi possível enviar sua resposta. Tente novamente.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Avaliação de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-center block">Qual seu nível de dor hoje?</Label>
              <div className="pt-4">
                <Slider
                  value={[painLevel]}
                  onValueChange={([value]) => setPainLevel(value)}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 - Sem Dor</span>
                <span className="font-medium">{painLevel}</span>
                <span>10 - Muita Dor</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre sua dor..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Resposta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Assessment;