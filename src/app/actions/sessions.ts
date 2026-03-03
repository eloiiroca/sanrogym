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

export async function getSessions() {
  try {
    return await prisma.session.findMany({
      orderBy: { sessionNumber: "desc" },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

export async function createSession(date: Date, participantIds: string[]) {
  try {
    await checkAuth();
    // Get the highest current session number
    const lastSession = await prisma.session.findFirst({
      orderBy: { sessionNumber: "desc" },
      select: { sessionNumber: true },
    });

    const nextSessionNumber = (lastSession?.sessionNumber ?? 0) + 1;

    const session = await prisma.session.create({
      data: {
        sessionNumber: nextSessionNumber,
        date: date,
        participants: {
          connect: participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: true,
      },
    });

    revalidatePath("/sessions");
    revalidatePath("/");
    return { success: true, session };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: "Failed to log session" };
  }
}

export async function updateSession(
  id: string,
  date: Date,
  participantIds: string[]
) {
  try {
    await checkAuth();
    const session = await prisma.session.update({
      where: { id },
      data: {
        date: date,
        participants: {
          set: participantIds.map((id) => ({ id })),
        },
      },
      include: {
        participants: true,
      },
    });

    revalidatePath("/sessions");
    revalidatePath("/");
    return { success: true, session };
  } catch (error) {
    console.error("Error updating session:", error);
    return { success: false, error: "Failed to update session" };
  }
}

export async function deleteSession(id: string) {
  try {
    await checkAuth();
    await prisma.session.delete({
      where: { id },
    });
    revalidatePath("/sessions");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting session:", error);
    return { success: false, error: "Failed to delete session" };
  }
}
