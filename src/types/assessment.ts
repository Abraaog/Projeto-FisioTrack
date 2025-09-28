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