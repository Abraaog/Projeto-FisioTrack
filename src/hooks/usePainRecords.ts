import { useState, useEffect } from "react";
import { PainRecord } from "@/types/pain-record";

const PAIN_RECORDS_STORAGE_KEY = "fisiotrack-pain-records";

export const usePainRecords = () => {
  const [painRecords, setPainRecords] = useState<PainRecord[]>([]);

  // Load pain records from localStorage on initial render
  useEffect(() => {
    const storedRecords = localStorage.getItem(PAIN_RECORDS_STORAGE_KEY);
    if (storedRecords) {
      try {
        const parsedRecords = JSON.parse(storedRecords);
        // Convert date strings back to Date objects
        const recordsWithDates = parsedRecords.map((record: any) => ({
          ...record,
          date: new Date(record.date),
        }));
        setPainRecords(recordsWithDates);
      } catch (error) {
        console.error("Failed to parse pain records from localStorage", error);
        setPainRecords([]);
      }
    }
  }, []);

  // Save pain records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PAIN_RECORDS_STORAGE_KEY, JSON.stringify(painRecords));
  }, [painRecords]);

  const addPainRecord = (record: Omit<PainRecord, "id">) => {
    const newRecord: PainRecord = {
      id: Date.now().toString(),
      ...record,
    };
    setPainRecords((prev) => [...prev, newRecord]);
    return newRecord;
  };

  const updatePainRecord = (id: string, updates: Partial<PainRecord>) => {
    setPainRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const deletePainRecord = (id: string) => {
    setPainRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const getPainRecordsByPatient = (patientId: string) => {
    return painRecords
      .filter((record) => record.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    painRecords,
    addPainRecord,
    updatePainRecord,
    deletePainRecord,
    getPainRecordsByPatient,
  };
};