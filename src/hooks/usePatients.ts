import { useState, useEffect } from "react";
import { Patient } from "@/types/patient";

const PATIENTS_STORAGE_KEY = "fisiotrack-patients";

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  // Load patients from localStorage on initial render
  useEffect(() => {
    const storedPatients = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (storedPatients) {
      try {
        const parsedPatients = JSON.parse(storedPatients);
        // Convert date strings back to Date objects
        const patientsWithDates = parsedPatients.map((patient: any) => ({
          ...patient,
          createdAt: new Date(patient.createdAt),
        }));
        setPatients(patientsWithDates);
      } catch (error) {
        console.error("Failed to parse patients from localStorage", error);
        setPatients([]);
      }
    }
  }, []);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = (patient: Omit<Patient, "id" | "createdAt">) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      ...patient,
      createdAt: new Date(),
    };
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((patient) => (patient.id === id ? { ...patient, ...updates } : patient))
    );
  };

  const deletePatient = (id: string) => {
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