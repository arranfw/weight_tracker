"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ErrorBar,
  ResponsiveContainer,
} from "recharts";
import { useWeightUnit } from "@/contexts/WeightUnitContext";
import { convertWeight } from "@/utils/weightConversion";
import { formatDate } from "@/utils/dateUtils";
import type { WeightRecord } from "@prisma/client";

interface WeightChartProps {
  weightRecords: WeightRecord[];
}

interface DailyWeightStats {
  date: Date;
  avg: number;
  min: number;
  max: number;
  count: number;
  recordIds: string[];
}

export default function WeightChart({ weightRecords }: WeightChartProps) {
  const { preferredUnit } = useWeightUnit();

  const groupedData = groupWeightRecordsByDate(weightRecords, preferredUnit);

  const sortedGroupedData = [...groupedData].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const chartData = sortedGroupedData.map((day) => ({
    date: formatDate(day.date),
    avg: day.avg,
    min: day.min,
    max: day.max,
    errorMin: day.min,
    errorMax: day.max,
  }));

  console.log("😣", chartData);
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weight History</h2>
      {weightRecords.length === 0 ? (
        <p className="text-gray-500">
          No weight records yet. Add your first record to see the chart.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              label={{
                value: `Weight (${preferredUnit})`,
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value: number, name) => [
                `${value.toFixed(1)} ${preferredUnit}`,
                name,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="avg"
              name={`Weight (${preferredUnit})`}
              stroke="rgb(79, 70, 229)"
              fill="rgba(79, 70, 229, 0.5)"
            >
              <ErrorBar
                dataKey="avg"
                width={4}
                data={chartData.map((d) => ({
                  x: d.date,
                  y: d.avg,
                  errorMin: d.errorMin,
                  errorMax: d.errorMax,
                }))}
                stroke="rgba(79, 70, 229, 0.7)"
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function groupWeightRecordsByDate(
  records: WeightRecord[],
  preferredUnit: string,
): DailyWeightStats[] {
  const dateMap = new Map<string, WeightRecord[]>();

  for (const record of records) {
    const date = new Date(record.date);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }

    dateMap.get(dateKey)?.push(record);
  }

  return Array.from(dateMap.entries()).map(([dateKey, dayRecords]) => {
    const convertedWeights = dayRecords.map((record) => {
      const recordUnit = record.unit || "kg";
      return recordUnit !== preferredUnit
        ? convertWeight(record.weight, recordUnit, preferredUnit)
        : record.weight;
    });

    const min = Math.min(...convertedWeights);
    const max = Math.max(...convertedWeights);
    const sum = convertedWeights.reduce((acc, val) => acc + val, 0);
    const avg = sum / convertedWeights.length;

    const date = new Date(dayRecords[0].date);
    date.setHours(12, 0, 0, 0);

    return {
      date,
      min,
      max,
      avg,
      count: dayRecords.length,
      recordIds: dayRecords.map((record) => record.id),
    };
  });
}
