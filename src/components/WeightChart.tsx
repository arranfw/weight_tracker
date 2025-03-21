'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type WeightRecord = {
  id: string;
  weight: number;
  date: string;
  notes?: string;
};

interface WeightChartProps {
  weightRecords: WeightRecord[];
}

export default function WeightChart({ weightRecords }: WeightChartProps) {
  // Sort records by date
  const sortedRecords = [...weightRecords].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const labels = sortedRecords.map((record) => format(new Date(record.date), 'MMM d'));
  const weights = sortedRecords.map((record) => record.weight);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weight History',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Weight: ${context.parsed.y} kg`;
          },
          afterLabel: function(context: any) {
            const recordIndex = context.dataIndex;
            const record = sortedRecords[recordIndex];
            return record.notes ? `Notes: ${record.notes}` : '';
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
        },
        min: Math.floor(Math.min(...weights) * 0.95),
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weight History</h2>
      {weightRecords.length === 0 ? (
        <p className="text-gray-500">No weight records yet. Add your first record to see the chart.</p>
      ) : (
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
} 