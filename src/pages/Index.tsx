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
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Gerencie seus pacientes e avaliações</p>
        </div>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto sm:max-w-none sm:ml-0">
            <TabsTrigger value="patients" className="flex items-center gap-2 text-sm sm:text-base">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center gap-2 text-sm sm:text-base">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="mt-6 sm:mt-8">
            <PatientList />
          </TabsContent>

          <TabsContent value="assessments" className="mt-6 sm:mt-8">
            <AssessmentList />
          </TabsContent>
        </Tabs>

        <div className="mt-8 sm:mt-12">
          <MadeWithDyad />
        </div>
      </main>
    </div>
  );
};

export default Index;