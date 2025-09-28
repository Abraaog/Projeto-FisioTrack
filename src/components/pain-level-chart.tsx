import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PainRecord } from "@/types/pain-record";

interface PainLevelChartProps {
  painRecords: PainRecord[];
}

export function PainLevelChart({ painRecords }: PainLevelChartProps) {
  // Format data for the chart
  const chartData = painRecords
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString("pt-BR"),
      painLevel: record.painLevel,
    }));

  if (painRecords.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum registro de dor encontrado para este paciente.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip 
            formatter={(value) => [`${value}`, "Nível de dor"]}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="painLevel"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}