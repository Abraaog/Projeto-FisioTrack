import Dexie, { Table } from "dexie";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface PainRecord {
  id: string;
  patientId: string;
  date: Date;
  painLevel: number;
  notes?: string;
}

export interface Assessment {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: Date;
  expiresAt: Date;
  isCompleted: boolean;
  completedAt?: Date;
  isSentToPatient: boolean;
  sentAt?: Date;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  patientId: string;
  painLevel: number;
  notes?: string;
  submittedAt: Date;
  submittedBy?: 'patient' | 'therapist';
}

export class FisioTrackDB extends Dexie {
  patients!: Table<Patient>;
  painRecords!: Table<PainRecord>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super("FisioTrack");
    
    this.version(1).stores({
      patients: "++id, name, email, phone, createdAt",
      painRecords: "++id, patientId, date, painLevel, notes",
      assessments: "++id, patientId, patientName, createdAt, expiresAt, isCompleted, completedAt, isSentToPatient, sentAt",
      assessmentResponses: "++id, assessmentId, patientId, painLevel, notes, submittedAt, submittedBy"
    });
  }
}

export const db = new FisioTrackDB();