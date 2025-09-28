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
      <Card key={assessment.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-medium truncate">
                {patient?.name || "Paciente não encontrado"}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant={assessment.isCompleted ? "default" : assessment.isSentToPatient ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {assessment.isCompleted ? "Concluída" : assessment.isSentToPatient ? "Enviada" : "Pendente"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span className="truncate">Criada: {format(new Date(assessment.createdAt), "dd/MM", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span className="truncate">Expira: {format(new Date(assessment.expiresAt), "dd/MM", { locale: ptBR })}</span>
            </div>
            {assessment.isSentToPatient && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3 w-3" />
                <span className="truncate">Enviada: {format(new Date(assessment.sentAt!), "dd/MM", { locale: ptBR })}</span>
              </div>
            )}
            {assessment.isCompleted && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                <span className="truncate">Concluída: {format(new Date(assessment.completedAt!), "dd/MM", { locale: ptBR })}</span>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Painel de Avaliações</h1>
        <p className="text-gray-600 mt-1">Gerencie todas as avaliações dos pacientes</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="pending" className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3" />
            Pendentes ({pendingAssessments.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2 text-xs">
            <AlertCircle className="h-3 w-3" />
            Enviadas ({sentAssessments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2 text-xs">
            <CheckCircle className="h-3 w-3" />
            Concluídas ({completedAssessments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Nenhuma avaliação pendente.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendingAssessments.map((assessment) => (
                <Card 
                  key={assessment.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-medium truncate">
                          {getPatient(assessment.patientId)?.name || "Paciente não encontrado"}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs mt-2">Pendente</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Criada: {format(new Date(assessment.createdAt), "dd/MM", { locale: ptBR })}</div>
                      <div>Expira: {format(new Date(assessment.expiresAt), "dd/MM", { locale: ptBR })}</div>
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Nenhuma avaliação enviada.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sentAssessments.map((assessment) => (
                <Card 
                  key={assessment.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-medium truncate">
                          {getPatient(assessment.patientId)?.name || "Paciente não encontrado"}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs mt-2">Enviada</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Criada: {format(new Date(assessment.createdAt), "dd/MM", { locale: ptBR })}</div>
                      <div>Enviada: {format(new Date(assessment.sentAt!), "dd/MM", { locale: ptBR })}</div>
                      <div>Expira: {format(new Date(assessment.expiresAt), "dd/MM", { locale: ptBR })}</div>
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Nenhuma avaliação concluída.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedAssessments.map((assessment) => (
                <Card 
                  key={assessment.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => setSelectedAssessment(assessment.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-medium truncate">
                          {getPatient(assessment.patientId)?.name || "Paciente não encontrado"}
                        </CardTitle>
                        <Badge variant="default" className="text-xs mt-2">Concluída</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Criada: {format(new Date(assessment.createdAt), "dd/MM", { locale: ptBR })}</div>
                      <div>Concluída: {format(new Date(assessment.completedAt!), "dd/MM", { locale: ptBR })}</div>
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