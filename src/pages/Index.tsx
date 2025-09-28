import { PatientList } from "@/components/patient-list";
import { AssessmentList } from "@/components/assessment-list";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText } from "lucide-react";
import { Header } from "@/components/header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Gerencie seus pacientes e avaliações</p>
        </div>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
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
      </main>
    </div>
  );
};

export default Index;