"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getParticipants() {
  try {
    return await prisma.participant.findMany({
      orderBy: { name: "asc" },
      include: {
        sessions: {
          select: {
            id: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
}

export async function createParticipant(name: string) {
  try {
    const participant = await prisma.participant.create({
      data: { name },
    });
    revalidatePath("/roster");
    revalidatePath("/");
    return { success: true, participant };
  } catch (error) {
    console.error("Error creating participant:", error);
    return { success: false, error: "Failed to create participant" };
  }
}

export async function updateParticipant(id: string, name: string) {
  try {
    const participant = await prisma.participant.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/roster");
    revalidatePath("/");
    return { success: true, participant };
  } catch (error) {
    console.error("Error updating participant:", error);
    return { success: false, error: "Failed to update participant" };
  }
}

export async function deleteParticipant(id: string) {
  try {
    await prisma.participant.delete({
      where: { id },
    });
    revalidatePath("/roster");
    revalidatePath("/sessions");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting participant:", error);
    return { success: false, error: "Failed to delete participant" };
  }
}
