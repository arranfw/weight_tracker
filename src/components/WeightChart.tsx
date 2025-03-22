"use client";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useWeightUnit } from "@/contexts/WeightUnitContext";
import { convertWeight } from "@/utils/weightConversion";
import { formatDate, formatDateTime } from "@/utils/dateUtils";
import type { WeightRecord } from "@prisma/client";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

interface WeightChartProps {
	weightRecords: WeightRecord[];
}

export default function WeightChart({ weightRecords }: WeightChartProps) {
	const { preferredUnit } = useWeightUnit();

	// Sort records by date
	const sortedRecords = [...weightRecords].sort((a, b) => {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});

	// Convert weights to preferred unit
	const convertedWeights = sortedRecords.map((record) => {
		const recordUnit = record.unit || "kg";
		if (recordUnit !== preferredUnit) {
			return convertWeight(record.weight, recordUnit, preferredUnit);
		}
		return record.weight;
	});

	const labels = sortedRecords.map((record) =>
		formatDate(new Date(record.date)),
	);

	const chartData = {
		labels,
		datasets: [
			{
				label: `Weight (${preferredUnit})`,
				data: convertedWeights,
				borderColor: "rgb(79, 70, 229)",
				backgroundColor: "rgba(79, 70, 229, 0.5)",
				tension: 0.1,
			},
		],
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Weight History",
			},
			tooltip: {
				callbacks: {
					label: (context) =>
						`Weight: ${context.parsed.y.toFixed(1)} ${preferredUnit}`,
					afterLabel: (context) => {
						const recordIndex = context.dataIndex;
						const record = sortedRecords[recordIndex];
						const tooltipInfo = [];

						// Add date and time
						tooltipInfo.push(`Date: ${formatDateTime(new Date(record.date))}`);

						// Add notes if available
						if (record.notes) {
							tooltipInfo.push(`Notes: ${record.notes}`);
						}

						return tooltipInfo.join("\n");
					},
				},
			},
		},
		scales: {
			y: {
				title: {
					display: true,
					text: `Weight (${preferredUnit})`,
				},
				min: Math.floor(Math.min(...convertedWeights) * 0.95),
			},
		},
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Weight History</h2>
			{weightRecords.length === 0 ? (
				<p className="text-gray-500">
					No weight records yet. Add your first record to see the chart.
				</p>
			) : (
				<div className="h-80">
					<Line data={chartData} options={options} />
				</div>
			)}
		</div>
	);
}
