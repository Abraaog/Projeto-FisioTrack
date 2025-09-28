export interface Assessment {
  id: string;
  patientId: string;
  createdAt: Date;
  expiresAt: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  painLevel: number;
  notes?: string;
  submittedAt: Date;
}