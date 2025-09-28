import { useState, useEffect } from "react";
import { Patient } from "@/types/patient";
import { db } from "@/lib/database";

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Carregar pacientes do banco de dados
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const allPatients = await db.patients.toArray();
        setPatients(allPatients);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    loadPatients();
  }, []);

  const addPatient = (patient: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...patient,
      createdAt: new Date(),
    };
    
    db.patients.add(newPatient);
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    db.patients.update(id, updates);
    setPatients((prev) =>
      prev.map((patient) => (patient.id === id ? { ...patient, ...updates } : patient))
    );
  };

  const deletePatient = (id: string) => {
    db.patients.delete(id);
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  const getPatient = (id: string) => {
    return patients.find((patient) => patient.id === id);
  };

  return {
    patients,
    addPatient,
    updatePatient,
    deletePatient,
    getPatient,
  };
};