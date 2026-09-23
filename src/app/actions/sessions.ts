"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getSeasonIdForSelection, ensureActiveSeason } from "@/lib/seasons";
import type { SeasonSelection } from "@/lib/season-types";

async function checkAuth() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function getSessions(selection?: SeasonSelection) {
  try {
    const seasonId = await getSeasonIdForSelection(selection);
    return await prisma.session.findMany({
      ...(seasonId === undefined ? {} : { where: { seasonId } }),
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
    await ensureActiveSeason();

    const session = await prisma.$transaction(async (tx) => {
      const activeSeason = await tx.season.findFirst({
        where: { isActive: true },
        select: { id: true },
      });
      if (!activeSeason) throw new Error("No hi ha cap temporada activa");

      const lastSession = await tx.session.findFirst({
        orderBy: { sessionNumber: "desc" },
        select: { sessionNumber: true },
      });

      return tx.session.create({
        data: {
          sessionNumber: (lastSession?.sessionNumber ?? 0) + 1,
          date,
          seasonId: activeSeason.id,
          participants: {
            connect: participantIds.map((id) => ({ id })),
          },
        },
        include: {
          participants: true,
        },
      });
    });

    revalidatePath("/sessions");
    revalidatePath("/");
    return { success: true, session };
  } catch (error) {
    console.error("Error creating session:", error);
    return { success: false, error: "No s'ha pogut registrar la sessió" };
  }
}

export async function updateSession(
  id: string,
  date: Date,
  participantIds: string[],
  seasonId: number
) {
  try {
    await checkAuth();
    if (!Number.isInteger(seasonId) || seasonId < 1) {
      return { success: false, error: "La temporada no és vàlida." };
    }

    const session = await prisma.$transaction(async (tx) => {
      const season = await tx.season.findUnique({
        where: { id: seasonId },
        select: { id: true },
      });
      if (!season) throw new Error("Season not found");

      return tx.session.update({
        where: { id },
        data: {
          date,
          seasonId: season.id,
          participants: {
            set: participantIds.map((participantId) => ({ id: participantId })),
          },
        },
        include: {
          participants: true,
        },
      });
    });

    revalidatePath("/sessions");
    revalidatePath("/");
    revalidatePath("/roster");
    revalidatePath("/admin/seasons");
    return { success: true, session };
  } catch (error) {
    console.error("Error updating session:", error);
    return { success: false, error: "Error en actualitzar la sessió" };
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
    return { success: false, error: "Error en eliminar la sessió" };
  }
}
