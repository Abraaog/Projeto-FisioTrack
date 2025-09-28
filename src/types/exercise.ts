export interface Exercise {
  id: string;
  name: string;
  description?: string;
}

export interface ExerciseResponse {
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
}