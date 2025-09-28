import { useState } from "react";
import { PatientCard } from "@/components/patient-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Patient } from "@/types/patient";
import { usePatients } from "@/hooks/usePatients";
import { PatientForm } from "@/components/ui/patient-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";

export function PatientList() {
  const { patients, addPatient, updatePatient, deletePatient } = usePatients();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const handleAddPatient = (patientData: Omit<Patient, "id" | "createdAt">) => {
    addPatient(patientData);
    setIsDialogOpen(false);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsDialogOpen(true);
  };

  const handleUpdatePatient = (patientData: Omit<Patient, "id" | "createdAt">) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, patientData);
      setIsDialogOpen(false);
      setEditingPatient(null);
    }
  };

  const handleDeletePatient = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
      deletePatient(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPatient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Pacientes</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Gerencie seus pacientes e suas avaliações</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPatient(null)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Adicionar Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? "Editar Paciente" : "Adicionar Novo Paciente"}
              </DialogTitle>
              <DialogDescription>
                {editingPatient 
                  ? "Atualize as informações do paciente abaixo."
                  : "Preencha os campos abaixo para adicionar um novo paciente."
                }
              </DialogDescription>
            </DialogHeader>
            <PatientForm
              onSubmit={editingPatient ? handleUpdatePatient : handleAddPatient}
              initialData={editingPatient || undefined}
              submitButtonText={editingPatient ? "Atualizar" : "Adicionar"}
            />
          </DialogContent>
        </Dialog>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum paciente cadastrado</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Clique no botão acima para adicionar seu primeiro paciente.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={handleEditPatient}
              onDelete={handleDeletePatient}
            />
          ))}
        </div>
      )}
    </div>
  );
}