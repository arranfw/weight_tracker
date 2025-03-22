"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LocalDateTime } from "@js-joda/core";
import { dateTimeToJsDate, parseISOToDateTime, now } from "@/utils/dateUtils";

export async function getWeightRecords() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const weightRecords = await prisma.weightRecord.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return weightRecords;
  } catch (error) {
    console.error("Error fetching weight records:", error);
    throw new Error("Failed to fetch weight records");
  }
}

export async function addWeightRecord(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const weightStringValue = formData.get("weight") as string;
  const weight = parseFloat(
    `${weightStringValue.substring(0, 3)}.${weightStringValue.substring(3)}`,
  );
  console.log("👨‍💻", {
    weightStringValue,
    weight,
  });
  const notes = formData.get("notes") as string;
  const dateTimeStr = formData.get("date") as string;
  const unit = (formData.get("unit") as string) || "kg";

  if (Number.isNaN(weight) || weight <= 0) {
    throw new Error("Weight is required and must be a positive number");
  }

  try {
    // Parse the datetime string using js-joda
    const localDateTime = dateTimeStr ? parseISOToDateTime(dateTimeStr) : now();

    // Convert to a native Date for Prisma (which doesn't directly support js-joda)
    const date = dateTimeToJsDate(localDateTime);

    await prisma.weightRecord.create({
      data: {
        weight,
        unit,
        date,
        notes: notes || undefined,
        userId,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating weight record:", error);
    throw new Error("Failed to create weight record");
  }
}

export async function deleteWeightRecord(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.weightRecord.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting weight record:", error);
    throw new Error("Failed to delete weight record");
  }
}

export async function getLatestWeightRecord() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const latestRecord = await prisma.weightRecord.findFirst({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return latestRecord;
  } catch (error) {
    console.error("Error fetching latest weight record:", error);
    throw new Error("Failed to fetch latest weight record");
  }
}
