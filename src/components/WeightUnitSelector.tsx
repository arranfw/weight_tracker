"use client";

import { useState } from "react";
import { useWeightUnit } from "@/contexts/WeightUnitContext";

export default function WeightUnitSelector() {
  const { preferredUnit, setPreferredUnit, isLoading } = useWeightUnit();
  const [isSaving, setIsSaving] = useState(false);

  async function handleUnitChange(unit: "kg" | "lbs") {
    setIsSaving(true);
    try {
      await setPreferredUnit(unit);
    } catch (error) {
      console.error("Failed to update unit preference:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="animate-pulse">Loading preferences...</div>;
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">Preferred unit:</span>
      <div className="inline-flex rounded-md shadow-xs">
        <button
          type="button"
          onClick={() => handleUnitChange("kg")}
          disabled={isSaving}
          className={`px-4 py-2 text-sm font-medium rounded-l-md ${
            preferredUnit === "kg"
              ? "bg-indigo-600 text-white"
              : "bg-card hover:bg-gray-50"
          }`}
        >
          kg
        </button>
        <button
          type="button"
          onClick={() => handleUnitChange("lbs")}
          disabled={isSaving}
          className={`px-4 py-2 text-sm font-medium rounded-r-md ${
            preferredUnit === "lbs"
              ? "bg-indigo-600 text-white"
              : "bg-card hover:bg-gray-50"
          }`}
        >
          lbs
        </button>
      </div>
      {isSaving && <span className="text-sm">Saving...</span>}
    </div>
  );
}
