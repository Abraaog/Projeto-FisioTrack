export interface PainRecord {
  id: string;
  patientId: string;
  date: Date;
  painLevel: number; // 0-10
  notes?: string;
}