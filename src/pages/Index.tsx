import { PatientList } from "@/components/patient-list";
import { AssessmentList } from "@/components/assessment-list";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="mt-6">
            <PatientList />
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
            <AssessmentList />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Index;