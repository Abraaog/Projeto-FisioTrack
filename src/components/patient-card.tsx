import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Patient } from "@/types/patient";
import { useNavigate } from "react-router-dom";

interface PatientCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
}

export function PatientCard({ patient, onEdit, onDelete }: PatientCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium truncate">{patient.name}</CardTitle>
            <p className="text-sm text-gray-500 truncate mt-1">{patient.email}</p>
          </div>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/patient/${patient.id}`)}
              className="h-8 w-8"
              aria-label="Ver detalhes"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(patient)}
              className="h-8 w-8"
              aria-label="Editar paciente"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(patient.id)}
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              aria-label="Excluir paciente"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center text-sm text-gray-600">
          <span className="truncate">{patient.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}