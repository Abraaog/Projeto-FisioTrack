import { useState, useEffect } from "react";
import { Assessment, AssessmentResponse } from "@/types/assessment";

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

  const createAssessment = (patientId: string) => {
    const newAssessment: Assessment = {
      id: Date.now().toString(),
      patientId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isCompleted: false,
    };
    setAssessments((prev) => [...prev, newAssessment]);
    return newAssessment;
  };

  const completeAssessment = (assessmentId: string, painLevel: number, notes?: string) => {
    // Create response
    const newResponse: AssessmentResponse = {
      id: Date.now().toString(),
      assessmentId,
      painLevel,
      notes,
      submittedAt: new Date(),
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

  return {
    assessments,
    responses,
    createAssessment,
    completeAssessment,
    getAssessmentById,
    getAssessmentResponse,
    getPatientAssessments,
  };
};