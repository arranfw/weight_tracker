"use client";

import { useState, useEffect } from "react";
import { addWeightRecord, getLatestWeightRecord } from "@/actions/weight";
import { useWeightUnit } from "@/contexts/WeightUnitContext";
import { convertWeight } from "@/utils/weightConversion";
import { LocalDateTime } from "@js-joda/core";
import { formatDateTimeForInput, now } from "@/utils/dateUtils";
import { WeightInput } from "./WeightInput";

export default function WeightForm() {
  const { preferredUnit } = useWeightUnit();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the last weight record on component mount
  useEffect(() => {
    async function fetchLastWeight() {
      try {
        const record = await getLatestWeightRecord();
        if (record) {
          // Convert if necessary
          if (record.unit && record.unit !== preferredUnit) {
            const converted = convertWeight(
              record.weight,
              record.unit,
              preferredUnit,
            );
            setLastWeight(converted);
          } else {
            setLastWeight(record.weight);
          }
        }
      } catch (err) {
        console.error("Error fetching last weight:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLastWeight();
  }, [preferredUnit]);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    // Add the user's preferred unit to the form data
    formData.append("unit", preferredUnit);

    try {
      await addWeightRecord(formData);

      // Update the last weight value with the new submission
      const newWeight = Number.parseFloat(formData.get("weight") as string);
      if (!Number.isNaN(newWeight)) {
        setLastWeight(newWeight);
      }

      setSuccess(true);

      // Reset the form but keep the weight value
      const form = document.getElementById("weight-form") as HTMLFormElement;
      form.reset();

      // Re-set the weight value
      const weightInput = form.elements.namedItem("weight") as HTMLInputElement;
      if (weightInput && newWeight) {
        weightInput.value = newWeight.toString();
      }

      // Reset the datetime to current time
      const dateInput = form.elements.namedItem("date") as HTMLInputElement;
      if (dateInput) {
        dateInput.value = formatDateTimeForInput(now());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Weight Record</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Weight record added successfully!
        </div>
      )}

      <form id="weight-form" action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-gray-700"
          >
            Weight ({preferredUnit})
          </label>
          <div className="mt-1 flex rounded-md shadow-xs">
            <WeightInput
              defaultValue={lastWeight !== null ? lastWeight.toFixed(1) : ""}
              placeholder={isLoading ? "Loading..." : "Enter weight"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500"
              aria-label={`Weight in ${preferredUnit}`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date and Time
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            defaultValue={formatDateTimeForInput(now())}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Weight Record
        </button>
      </form>
    </div>
  );
}
