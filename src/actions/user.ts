"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

type WeightUnit = "kg" | "lbs";

/**
 * Get the user's weight unit preference
 */
export async function getUserWeightUnitPreference(): Promise<WeightUnit> {
  const session = await auth();

  if (!session?.user?.id) {
    return "kg"; // Default for unauthenticated users
  }

  try {
    // Try to find existing preference
    const preference = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
    });

    if (preference) {
      return preference.preferredWeightUnit as WeightUnit;
    }

    // Create default preference if it doesn't exist
    const newPreference = await prisma.userPreference.create({
      data: {
        userId: session.user.id,
        preferredWeightUnit: "kg",
      },
    });

    return newPreference.preferredWeightUnit as WeightUnit;
  } catch (error) {
    console.error("Error getting weight unit preference:", error);
    return "kg"; // Default fallback in case of error
  }
}

/**
 * Update the user's weight unit preference
 */
export async function updateUserWeightUnitPreference(
  unit: WeightUnit,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: { preferredWeightUnit: unit },
      create: {
        userId: session.user.id,
        preferredWeightUnit: unit,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating weight unit preference:", error);
    throw new Error("Failed to update weight unit preference");
  }
}
