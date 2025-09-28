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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPatient(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPatient ? "Editar Paciente" : "Adicionar Novo Paciente"}
              </DialogTitle>
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
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum paciente cadastrado ainda.</p>
          <p className="text-sm mt-2">Clique no botão acima para adicionar seu primeiro paciente.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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