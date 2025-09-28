import { useState, useEffect } from "react";
import { PainRecord } from "@/types/pain-record";
import { db } from "@/lib/database";

export const usePainRecords = () => {
  const [painRecords, setPainRecords] = useState<PainRecord[]>([]);

  // Carregar registros de dor do banco de dados
  useEffect(() => {
    const loadPainRecords = async () => {
      try {
        const allRecords = await db.painRecords.toArray();
        setPainRecords(allRecords);
      } catch (error) {
        console.error("Erro ao carregar registros de dor:", error);
      }
    };

    loadPainRecords();
  }, []);

  const addPainRecord = (record: Omit<PainRecord, "id">) => {
    const newRecord: PainRecord = {
      id: Date.now().toString(),
      ...record,
    };
    
    db.painRecords.add(newRecord);
    setPainRecords((prev) => [...prev, newRecord]);
    return newRecord;
  };

  const updatePainRecord = (id: string, updates: Partial<PainRecord>) => {
    db.painRecords.update(id, updates);
    setPainRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...updates } : record))
    );
  };

  const deletePainRecord = (id: string) => {
    db.painRecords.delete(id);
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