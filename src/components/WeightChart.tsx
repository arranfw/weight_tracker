"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useWeightUnit } from "@/contexts/WeightUnitContext";
import { convertWeight } from "@/utils/weightConversion";
import { formatDate } from "@/utils/dateUtils";
import type { WeightRecord } from "@prisma/client";

interface WeightChartProps {
  weightRecords: WeightRecord[];
}

export function calculateWeightInFuture(
  slope: number,
  currentWeight: number,
  daysFromNow: number,
): number {
  return currentWeight + slope * daysFromNow;
}

export default function WeightChart({ weightRecords }: WeightChartProps) {
  const { preferredUnit } = useWeightUnit();

  const chartData = weightRecords.map((record) => ({
    date: record.date.getTime(),
    weight:
      record.unit !== preferredUnit
        ? convertWeight(record.weight, record.unit || "kg", preferredUnit)
        : record.weight,
  }));

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const firstRecord = weightRecords.at(-1)!;
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const lastRecord = weightRecords.at(0)!;

  const slope =
    (lastRecord.weight - firstRecord.weight) /
    (lastRecord.date.getTime() / 86400000 -
      firstRecord.date.getTime() / 86400000);

  const extendedTrendline = {
    x: lastRecord.date.getTime() + 86400000 * 7,
    y: calculateWeightInFuture(slope, lastRecord.weight, 7),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weight History</h2>
      <h3 className="text-xl font-semibold mb-4">
        Loss rate: {slope.toFixed(2)} {preferredUnit}/day
      </h3>
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
            <XAxis
              dataKey="date"
              type="number"
              domain={["dataMin ", `dataMax  + ${86400000 * 7}`]}
              tickFormatter={(value) => formatDate(new Date(value))}
            />
            <YAxis
              tickFormatter={(value) => `${value.toFixed(2)} ${preferredUnit}`}
              label={{
                value: `Weight (${preferredUnit})`,
                angle: -90,
                position: "left",
              }}
              domain={["dataMin - 5", "dataMax + 5"]}
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
              dataKey="weight"
              name={`Weight (${preferredUnit})`}
              stroke="rgb(79, 70, 229)"
              fill="rgba(79, 70, 229, 0.5)"
            />
            <ReferenceLine
              stroke="green"
              strokeDasharray="3 3"
              segment={[
                {
                  x: firstRecord.date.getTime(),
                  y: firstRecord.weight,
                },
                {
                  x: extendedTrendline.x,
                  y: extendedTrendline.y,
                },
              ]}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
