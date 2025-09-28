import { useState, useEffect } from "react";
import { Assessment, AssessmentResponse } from "@/types/assessment";
import { Patient } from "@/types/patient";
import { ExerciseResponse } from "@/types/exercise";
import { db } from "@/lib/database";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);

  // Carregar avaliações e respostas do banco de dados
  useEffect(() => {
    const loadData = async () => {
      try {
        const allAssessments = await db.assessments.toArray();
        const allResponses = await db.assessmentResponses.toArray();
        
        setAssessments(allAssessments);
        setResponses(allResponses);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      }
    };

    loadData();
  }, []);

  const createAssessment = (patient: Patient) => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.name,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isCompleted: false,
      isSentToPatient: false,
    };
    
    db.assessments.add(newAssessment);
    setAssessments((prev) => [...prev, newAssessment]);
    return newAssessment;
  };

  const sendAssessmentToPatient = (assessmentId: string) => {
    const updateData = {
      isSentToPatient: true,
      sentAt: new Date(),
    };
    
    db.assessments.update(assessmentId, updateData);
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId ? { ...assessment, ...updateData } : assessment
      )
    );
  };

  const updateAssessment = (assessmentId: string, updates: Partial<Assessment>) => {
    db.assessments.update(assessmentId, updates);
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId ? { ...assessment, ...updates } : assessment
      )
    );
  };

  const completeAssessment = (
    assessmentId: string, 
    patientId: string, 
    painLevel: number, 
    notes?: string, 
    submittedBy: 'patient' | 'therapist' = 'patient',
    exerciseResponses?: ExerciseResponse[]
  ) => {
    // Create response
    const newResponse: AssessmentResponse = {
      id: Date.now().toString(),
      assessmentId,
      patientId,
      painLevel,
      notes,
      submittedAt: new Date(),
      submittedBy,
    };
    
    db.assessmentResponses.add(newResponse);
    setResponses((prev) => [...prev, newResponse]);
    
    // Update assessment
    const updateData = {
      isCompleted: true,
      completedAt: new Date(),
    };
    
    db.assessments.update(assessmentId, updateData);
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId ? { ...assessment, ...updateData } : assessment
      )
    );
    
    // Store exercise responses in localStorage for now (could be added to database later)
    if (exerciseResponses && exerciseResponses.length > 0) {
      localStorage.setItem(`exercise-responses-${assessmentId}`, JSON.stringify(exerciseResponses));
    }
    
    return newResponse;
  };

  const getAssessmentById = (id: string) => {
    return assessments.find((assessment) => assessment.id === id);
  };

  const getAssessmentResponse = (assessmentId: string) => {
    return responses.find((response) => response.assessmentId === assessmentId);
  };

  const getPatientAssessments = (patientId: string) => {
    return assessments
      .filter((assessment) => assessment.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getPatientResponses = (patientId: string) => {
    return responses
      .filter((response) => response.patientId === patientId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  };

  const getPendingAssessments = () => {
    return assessments
      .filter((assessment) => !assessment.isSentToPatient && !assessment.isCompleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getSentAssessments = () => {
    return assessments
      .filter((assessment) => assessment.isSentToPatient && !assessment.isCompleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getCompletedAssessments = () => {
    return assessments
      .filter((assessment) => assessment.isCompleted)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  };

  return {
    assessments,
    responses,
    createAssessment,
    sendAssessmentToPatient,
    updateAssessment,
    completeAssessment,
    getAssessmentById,
    getAssessmentResponse,
    getPatientAssessments,
    getPatientResponses,
    getPendingAssessments,
    getSentAssessments,
    getCompletedAssessments,
  };
};