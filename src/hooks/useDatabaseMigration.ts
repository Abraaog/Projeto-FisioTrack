import { useEffect } from "react";
import { db } from "@/lib/database";
import { usePatients } from "./usePatients";
import { usePainRecords } from "./usePainRecords";
import { useAssessments } from "./useAssessments";
import { toast } from "sonner";

export const useDatabaseMigration = () => {
  const { patients: localStoragePatients } = usePatients();
  const { painRecords: localStoragePainRecords } = usePainRecords();
  const { assessments: localStorageAssessments, responses: localStorageResponses } = useAssessments();

  useEffect(() => {
    const migrateData = async () => {
      try {
        // Verificar se já foi migrado
        const migrationKey = "fisiotrack-migrated-to-database";
        const hasMigrated = localStorage.getItem(migrationKey);
        
        if (hasMigrated) return;

        console.log("Iniciando migração de dados para o banco de dados...");

        // Migrar pacientes
        if (localStoragePatients.length > 0) {
          await db.patients.bulkAdd(localStoragePatients);
          console.log(`Migrados ${localStoragePatients.length} pacientes`);
        }

        // Migrar registros de dor
        if (localStoragePainRecords.length > 0) {
          await db.painRecords.bulkAdd(localStoragePainRecords);
          console.log(`Migrados ${localStoragePainRecords.length} registros de dor`);
        }

        // Migrar avaliações
        if (localStorageAssessments.length > 0) {
          await db.assessments.bulkAdd(localStorageAssessments);
          console.log(`Migrados ${localStorageAssessments.length} avaliações`);
        }

        // Migrar respostas de avaliação
        if (localStorageResponses.length > 0) {
          await db.assessmentResponses.bulkAdd(localStorageResponses);
          console.log(`Migrados ${localStorageResponses.length} respostas de avaliação`);
        }

        // Marcar como migrado
        localStorage.setItem(migrationKey, "true");
        
        console.log("Migração concluída com sucesso!");
        toast.success("Dados migrados para o banco de dados com sucesso!");
      } catch (error) {
        console.error("Erro durante a migração:", error);
        toast.error("Erro ao migrar dados", {
          description: "Alguns dados podem não ter sido migrados corretamente."
        });
      }
    };

    migrateData();
  }, [localStoragePatients, localStoragePainRecords, localStorageAssessments, localStorageResponses]);
};