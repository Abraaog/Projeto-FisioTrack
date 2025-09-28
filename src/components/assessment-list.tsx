import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssessmentDetail } from "@/components/assessment-detail";
import { useAssessments } from "@/hooks/useAssessments";
import { usePatients } from "@/hooks/usePatients";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

export function AssessmentList() {
  const { getPendingAssessments, getSentAssessments, getCompletedAssessments } = useAssessments();
  const { getPatient } = usePatients();
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);

  const pendingAssessments = getPendingAssessments();
  const sentAssessments = getSentAssessments();
  const completedAssessments = getCompletedAssessments();

  const renderAssessmentCard = (assessment: any) => {
    const patient = getPatient(assessment.patientId);
    
    return (
      <Card key={assessment.id} className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{patient?.name || "Paciente não encontrado"}</CardTitle>
            <Badge variant={assessment.isCompleted ? "default" : assessment.isSentToPatient ? "secondary" : "outline"}>
              {assessment.isCompleted ? "Concluída" : assessment.isSentToPatient ? "Enviada" : "Pendente"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Criada em: {format(new Date(assessment.createdAt), "PPP", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Expira em: {format(new Date(assessment.expiresAt), "PPP", { locale: ptBR })}</span>
            </div>
            {assessment.isSentToPatient && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Enviada em: {format(new Date(assessment.sentAt!), "PPP", { locale: ptBR })}</span>
              </div>
            )}
            {assessment.isCompleted && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Concluída em: {format(new Date(assessment.completedAt!), "PPP", { locale: ptBR })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (selectedAssessment) {
    return (
      <AssessmentDetail 
        assessmentId={selectedAssessment} 
        onBack={() => setSelectedAssessment(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Painel de Avaliações</h1>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({pendingAssessments.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Enviadas ({sentAssessments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluídas ({completedAssessments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma avaliação pendente.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingAssessments.map((assessment) => (
                <Card 
                  key={assessment.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getPatient(assessment.patientId)?.name || "Paciente não encontrado"}
                      </CardTitle>
                      <Badge variant="outline">Pendente</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Criada em: {format(new Date(assessment.createdAt), "PPP", { locale: ptBR })}</div>
                      <div>Expira em: {format(new Date(assessment.expiresAt), "PPP", { locale: ptBR })}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma avaliação enviada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sentAssessments.map((assessment) => (
                <Card 
                  key={assessment.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getPatient(assessment.patientId)?.name || "Paciente não encontrado"}
                      </CardTitle>
                      <Badge variant="secondary">Enviada</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Criada em: {format(new Date(assessment.createdAt), "PPP", { locale: ptBR })}</div>
                      <div>Enviada em: {format(new Date(assessment.sentAt!), "PPP", { locale: ptBR })}</div>
                      <div>Expira em: {format(new Date(assessment.expiresAt), "PPP", { locale: ptBR })}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma avaliação concluída.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedAssessments.map((assessment) => (
                <Card 
                  key={assessment.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getPatient(assessment.patientId)?.name || "Paciente não encontrado"}
                      </CardTitle>
                      <Badge variant="default">Concluída</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>Criada em: {format(new Date(assessment.createdAt), "PPP", { locale: ptBR })}</div>
                      <div>Concluída em: {format(new Date(assessment.completedAt!), "PPP", { locale: ptBR })}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}