import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Exercise, ExerciseResponse } from "@/types/exercise";

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseChange: (exerciseId: string, completed: boolean) => void;
  initialResponses?: ExerciseResponse[];
}

export function ExerciseList({ exercises, onExerciseChange, initialResponses = [] }: ExerciseListProps) {
  const [responses, setResponses] = useState<ExerciseResponse[]>(
    initialResponses.length > 0 
      ? initialResponses 
      : exercises.map(exercise => ({
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          completed: false
        }))
  );

  const handleCheckboxChange = (exerciseId: string, completed: boolean) => {
    const updatedResponses = responses.map(response =>
      response.exerciseId === exerciseId
        ? { ...response, completed }
        : response
    );
    setResponses(updatedResponses);
    onExerciseChange(exerciseId, completed);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Exercícios Realizados</CardTitle>
        <p className="text-sm text-muted-foreground">
          Marque os exercícios que você realizou hoje
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exercises.map((exercise) => {
            const response = responses.find(r => r.exerciseId === exercise.id);
            return (
              <div key={exercise.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <Checkbox
                  id={`exercise-${exercise.id}`}
                  checked={response?.completed || false}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(exercise.id, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <Label 
                    htmlFor={`exercise-${exercise.id}`} 
                    className="font-medium cursor-pointer"
                  >
                    {exercise.name}
                  </Label>
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {exercise.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}