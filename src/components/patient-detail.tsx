import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, FileText, TrendingUp } from "lucide-react";
import { usePatients } from "@/hooks/usePatients";
import { usePainRecords } from "@/hooks/usePainRecords";
import { useAssessments } from "@/hooks/useAssessments";
import { PainLevelChart } from "@/components/pain-level-chart";
import { PainRecordForm } from "@/components/pain-record-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient } = usePatients();
  const { getPainRecordsByPatient, addPainRecord } = usePainRecords();
  const { createAssessment, getPatientResponses } = useAssessments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const patient = getPatient(id || "");
  const painRecords = getPainRecordsByPatient(id || "");
  const assessmentResponses = getPatientResponses(id || "");

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Paciente não encontrado</h2>
          <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  const handleAddPainRecord = (data: { date: Date; painLevel: number; notes?: string }) => {
    addPainRecord({
      patientId: patient.id,
      ...data,
    });
    setIsDialogOpen(false);
  };

  const handleCreateAssessment = () => {
    try {
      const assessment = createAssessment(patient);
      toast.success("Avaliação criada com sucesso!");
      navigate(`/assessment/${assessment.id}`);
    } catch (error) {
      toast.error("Erro ao criar avaliação", {
        description: "Não foi possível criar a avaliação. Tente novamente.",
      });
    }
  };

  // Combinar registros de dor e respostas de avaliação para o gráfico
  const allDataPoints = [
    ...painRecords.map(record => ({
      date: record.date,
      painLevel: record.painLevel,
      type: 'registro' as const,
      notes: record.notes
    })),
    ...assessmentResponses.map(response => ({
      date: response.submittedAt,
      painLevel: response.painLevel,
      type: 'avaliação' as const,
      notes: response.notes
    }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com botão voltar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Informações do paciente */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <p className="text-gray-600 mt-1">
                  Cadastrado em {format(new Date(patient.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button onClick={handleCreateAssessment} className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Criar Avaliação
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar Dor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Registrar Nível de Dor</DialogTitle>
                    </DialogHeader>
                    <PainRecordForm onSubmit={handleAddPainRecord} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Email:</span>
                <Badge variant="secondary" className="truncate">{patient.email}</Badge>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Telefone:</span>
                <Badge variant="secondary" className="truncate">{patient.phone}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Progresso */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Painel de Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allDataPoints.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Nenhum dado de progresso disponível.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Crie uma avaliação ou registre um nível de dor para começar.
                </p>
              </div>
            ) : (
              <>
                <div className="h-64 w-full mb-6">
                  <PainLevelChart painRecords={allDataPoints} />
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Histórico de Avaliações</h3>
                  <div className="space-y-3">
                    {allDataPoints
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((data, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-medium">
                                {format(new Date(data.date), "dd/MM/yyyy", { locale: ptBR })}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Nível de dor: <span className="font-medium">{data.painLevel}/10</span>
                              </p>
                            </div>
                            <Badge
                              variant={
                                data.painLevel < 4
                                  ? "default"
                                  : data.painLevel < 7
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {data.painLevel < 4
                                ? "Leve"
                                : data.painLevel < 7
                                ? "Moderada"
                                : "Intensa"}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            Tipo: {data.type === 'registro' ? 'Registro Manual' : 'Avaliação Online'}
                          </div>
                          {data.notes && (
                            <div>
                              <Separator className="my-2" />
                              <p className="text-sm">{data.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PatientDetail;