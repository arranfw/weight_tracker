"use client";

import { useState, useEffect } from "react";
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
			<span className="text-sm font-medium text-gray-700">Preferred unit:</span>
			<div className="inline-flex rounded-md shadow-xs">
				<button
					type="button"
					onClick={() => handleUnitChange("kg")}
					disabled={isSaving}
					className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
						preferredUnit === "kg"
							? "bg-indigo-600 text-white border-indigo-600"
							: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
					}`}
				>
					kg
				</button>
				<button
					type="button"
					onClick={() => handleUnitChange("lbs")}
					disabled={isSaving}
					className={`px-4 py-2 text-sm font-medium rounded-r-md border border-l-0 ${
						preferredUnit === "lbs"
							? "bg-indigo-600 text-white border-indigo-600"
							: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
					}`}
				>
					lbs
				</button>
			</div>
			{isSaving && <span className="text-sm text-gray-500">Saving...</span>}
		</div>
	);
}
