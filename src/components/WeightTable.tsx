"use client";

import { deleteWeightRecord } from "@/actions/weight";
import { useWeightUnit } from "@/contexts/WeightUnitContext";
import { convertWeight } from "@/utils/weightConversion";
import type { WeightRecord } from "@prisma/client";
import { formatDateTime } from "@/utils/dateUtils";

interface WeightTableProps {
  weightRecords: WeightRecord[];
}

export default function WeightTable({ weightRecords }: WeightTableProps) {
  const { preferredUnit } = useWeightUnit();

  if (weightRecords.length === 0) {
    return (
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weight Records</h2>
        <p className="">No weight records found.</p>
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this record?")) {
      await deleteWeightRecord(id);
    }
  }

  function displayWeight(record: WeightRecord) {
    // Convert weight to preferred unit if needed
    const recordUnit = record.unit || "kg";
    if (recordUnit !== preferredUnit) {
      const convertedWeight = convertWeight(
        record.weight,
        recordUnit,
        preferredUnit,
      );
      return `${convertedWeight.toFixed(1)} ${preferredUnit}`;
    }
    return `${record.weight} ${recordUnit}`;
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weight Records</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-gray-200">
            {weightRecords
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDateTime(new Date(record.date))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {displayWeight(record)}
                  </td>
                  <td className="px-6 py-4 text-sm  max-w-xs truncate">
                    {record.notes || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
