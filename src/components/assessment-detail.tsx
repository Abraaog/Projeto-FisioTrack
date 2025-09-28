import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Send, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssessments } from "@/hooks/useAssessments";
import { usePatients } from "@/hooks/usePatients";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AssessmentDetailProps {
  assessmentId: string;
  onBack?: () => void;
}

export function AssessmentDetail({ assessmentId, onBack }: AssessmentDetailProps) {
  const navigate = useNavigate();
  const { getAssessmentById, updateAssessment, sendAssessmentToPatient, completeAssessment, getAssessmentResponse } = useAssessments();
  const { getPatient } = usePatients();
  
  const [isEditing, setIsEditing] = useState(false);
  const [painLevel, setPainLevel] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const assessment = getAssessmentById(assessmentId);
  const patient = assessment ? getPatient(assessment.patientId) : null;
  const response = assessment ? getAssessmentResponse(assessment.id) : null;

  if (!assessment || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Avaliação não encontrada</h2>
        <Button onClick={() => navigate("/")}>Voltar para a lista</Button>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    if (response) {
      setPainLevel(response.painLevel);
      setNotes(response.notes || "");
    }
  };

  const handleSave = () => {
    if (isEditing) {
      completeAssessment(assessment.id, assessment.patientId, painLevel, notes, 'therapist');
      setIsEditing(false);
      toast.success("Avaliação atualizada com sucesso!");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (response) {
      setPainLevel(response.painLevel);
      setNotes(response.notes || "");
    }
  };

  const handleSendToPatient = async () => {
    setIsSending(true);
    try {
      sendAssessmentToPatient(assessment.id);
      toast.success("Avaliação enviada para o paciente com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error("Erro ao enviar avaliação", {
        description: "Não foi possível enviar a avaliação. Tente novamente.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = () => {
    if (assessment.isCompleted) {
      return <Badge variant="default">Concluída</Badge>;
    } else if (assessment.isSentToPatient) {
      return <Badge variant="secondary">Enviada</Badge>;
    } else {
      return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack || (() => navigate(-1))}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {!assessment.isCompleted && !assessment.isSentToPatient && (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Registrar Dor
              </Button>
            )}
            {!assessment.isSentToPatient && !assessment.isCompleted && (
              <Button onClick={handleSendToPatient} disabled={isSending}>
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Enviando..." : "Enviar para Paciente"}
              </Button>
            )}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Avaliação de {patient.name}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Paciente: {patient.name}</span>
              <span>Criada em: {format(new Date(assessment.createdAt), "PPP", { locale: ptBR })}</span>
              <span>Expira em: {format(new Date(assessment.expiresAt), "PPP", { locale: ptBR })}</span>
            </div>
          </CardHeader>
          <CardContent>
            {assessment.isCompleted ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Registro de Dor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nível de Dor</Label>
                      <p className="text-lg font-medium">{response?.painLevel}/10</p>
                    </div>
                    <div>
                      <Label>Registrado por</Label>
                      <p className="text-sm">
                        {response?.submittedBy === 'patient' ? 'Paciente' : 'Fisioterapeuta'}
                      </p>
                    </div>
                  </div>
                  {response?.notes && (
                    <div className="mt-4">
                      <Label>Observações</Label>
                      <p className="text-sm mt-1">{response.notes}</p>
                    </div>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground">
                    Registrado em: {format(new Date(response?.submittedAt || assessment.createdAt), "PPp", { locale: ptBR })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum registro de dor cadastrado ainda.
                {!assessment.isSentToPatient && (
                  <p className="text-sm mt-2">Clique em "Registrar Dor" para adicionar um registro.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nível de Dor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Nível de Dor: {painLevel}/10</Label>
                  <Slider
                    value={[painLevel]}
                    onValueChange={([value]) => setPainLevel(value)}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sem dor</span>
                    <span>Dor intensa</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Adicione observações sobre o nível de dor..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Registro
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}