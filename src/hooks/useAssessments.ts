import { useState, useEffect } from "react";
import { Assessment, AssessmentResponse } from "@/types/assessment";
import { Patient } from "@/types/patient";

const ASSESSMENTS_STORAGE_KEY = "fisiotrack-assessments";
const ASSESSMENT_RESPONSES_STORAGE_KEY = "fisiotrack-assessment-responses";

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);

  // Load assessments and responses from localStorage
  useEffect(() => {
    const storedAssessments = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
    const storedResponses = localStorage.getItem(ASSESSMENT_RESPONSES_STORAGE_KEY);
    
    if (storedAssessments) {
      try {
        const parsedAssessments = JSON.parse(storedAssessments);
        const assessmentsWithDates = parsedAssessments.map((assessment: any) => ({
          ...assessment,
          createdAt: new Date(assessment.createdAt),
          expiresAt: new Date(assessment.expiresAt),
          completedAt: assessment.completedAt ? new Date(assessment.completedAt) : undefined,
          sentAt: assessment.sentAt ? new Date(assessment.sentAt) : undefined,
        }));
        setAssessments(assessmentsWithDates);
      } catch (error) {
        console.error("Failed to parse assessments from localStorage", error);
        setAssessments([]);
      }
    }
    
    if (storedResponses) {
      try {
        const parsedResponses = JSON.parse(storedResponses);
        const responsesWithDates = parsedResponses.map((response: any) => ({
          ...response,
          submittedAt: new Date(response.submittedAt),
        }));
        setResponses(responsesWithDates);
      } catch (error) {
        console.error("Failed to parse responses from localStorage", error);
        setResponses([]);
      }
    }
  }, []);

  // Save assessments and responses to localStorage
  useEffect(() => {
    localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem(ASSESSMENT_RESPONSES_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

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
    setAssessments((prev) => [...prev, newAssessment]);
    return newAssessment;
  };

  const sendAssessmentToPatient = (assessmentId: string) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              isSentToPatient: true,
              sentAt: new Date(),
            }
          : assessment
      )
    );
  };

  const updateAssessment = (assessmentId: string, updates: Partial<Assessment>) => {
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId ? { ...assessment, ...updates } : assessment
      )
    );
  };

  const completeAssessment = (assessmentId: string, patientId: string, painLevel: number, notes?: string, submittedBy: 'patient' | 'therapist' = 'patient') => {
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
    
    setResponses((prev) => [...prev, newResponse]);
    
    // Update assessment
    setAssessments((prev) =>
      prev.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              isCompleted: true,
              completedAt: new Date(),
            }
          : assessment
      )
    );
    
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