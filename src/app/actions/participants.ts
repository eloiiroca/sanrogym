"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

async function checkAuth() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

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
    await checkAuth();
    const participant = await prisma.participant.create({
      data: { name },
    });
    revalidatePath("/roster");
    revalidatePath("/");
    return { success: true, participant };
  } catch (error) {
    console.error("Error creating participant:", error);
    return { success: false, error: "Error en crear el participant" };
  }
}

export async function updateParticipant(id: string, name: string) {
  try {
    await checkAuth();
    const participant = await prisma.participant.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/roster");
    revalidatePath("/");
    return { success: true, participant };
  } catch (error) {
    console.error("Error updating participant:", error);
    return { success: false, error: "Error en actualitzar el participant" };
  }
}

export async function deleteParticipant(id: string) {
  try {
    await checkAuth();
    await prisma.participant.delete({
      where: { id },
    });
    revalidatePath("/roster");
    revalidatePath("/sessions");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting participant:", error);
    return { success: false, error: "Error en eliminar el participant" };
  }
}
