import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PainRecordFormProps {
  onSubmit: (data: { date: Date; painLevel: number; notes?: string }) => void;
  initialData?: { date?: Date; painLevel?: number; notes?: string };
  submitButtonText?: string;
}

export function PainRecordForm({ onSubmit, initialData, submitButtonText = "Salvar" }: PainRecordFormProps) {
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [painLevel, setPainLevel] = useState<number>(initialData?.painLevel || 5);
  const [notes, setNotes] = useState<string>(initialData?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ date, painLevel, notes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitButtonText} Registro de Dor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <Label>Nível de Dor: {painLevel}/10</Label>
            <Slider
              value={[painLevel]}
              onValueChange={([value]) => setPainLevel(value)}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sem dor</span>
              <span>Dor intensa</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o nível de dor..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {submitButtonText}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}