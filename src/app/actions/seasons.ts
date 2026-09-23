"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ensureActiveSeason, getSeasonOptions } from "@/lib/seasons";
import { revalidatePath } from "next/cache";

async function checkAuth() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function revalidateSeasonViews() {
  revalidatePath("/");
  revalidatePath("/sessions");
  revalidatePath("/roster");
  revalidatePath("/admin/seasons");
}

export async function getManagedSeasons() {
  await checkAuth();
  return getSeasonOptions();
}

export async function createSeason(name: string) {
  try {
    await checkAuth();
    await ensureActiveSeason();
    const trimmedName = name.trim();
    if (!trimmedName) return { success: false, error: "Escriu el nom de la temporada." };

    await prisma.season.create({
      data: { name: trimmedName, isActive: false },
    });

    revalidateSeasonViews();
    return { success: true };
  } catch (error) {
    console.error("Error creating season:", error);
    return { success: false, error: "No s'ha pogut crear la temporada." };
  }
}

export async function updateSeasonName(id: number, name: string) {
  try {
    await checkAuth();
    await ensureActiveSeason();
    const trimmedName = name.trim();
    if (!Number.isInteger(id) || id < 1) {
      return { success: false, error: "La temporada no és vàlida." };
    }
    if (!trimmedName) return { success: false, error: "El nom no pot estar buit." };

    await prisma.season.update({
      where: { id },
      data: { name: trimmedName },
    });

    revalidateSeasonViews();
    return { success: true };
  } catch (error) {
    console.error("Error updating season:", error);
    return { success: false, error: "No s'ha pogut actualitzar la temporada." };
  }
}

export async function activateSeason(id: number) {
  try {
    await checkAuth();
    await ensureActiveSeason();
    if (!Number.isInteger(id) || id < 1) {
      return { success: false, error: "La temporada no és vàlida." };
    }

    await prisma.$transaction(async (tx) => {
      const season = await tx.season.findUnique({ where: { id }, select: { id: true } });
      if (!season) throw new Error("Season not found");

      await tx.season.updateMany({
        where: { isActive: true, id: { not: id } },
        data: { isActive: false },
      });
      await tx.season.update({ where: { id }, data: { isActive: true } });
    });

    revalidateSeasonViews();
    return { success: true };
  } catch (error) {
    console.error("Error activating season:", error);
    return { success: false, error: "No s'ha pogut activar la temporada." };
  }
}

export async function deleteSeason(id: number) {
  try {
    await checkAuth();
    await ensureActiveSeason();
    if (!Number.isInteger(id) || id < 1) {
      return { success: false, error: "La temporada no és vàlida." };
    }

    await prisma.$transaction(async (tx) => {
      const season = await tx.season.findUnique({
        where: { id },
        include: { _count: { select: { sessions: true } } },
      });
      if (!season) throw new Error("Season not found");
      if (season.isActive) throw new Error("Cannot delete the active season");
      if (season._count.sessions > 0) throw new Error("Cannot delete a season with sessions");

      await tx.season.delete({ where: { id } });
    });

    revalidateSeasonViews();
    return { success: true };
  } catch (error) {
    console.error("Error deleting season:", error);
    return {
      success: false,
      error: "No es pot eliminar una temporada activa o que tingui sessions.",
    };
  }
}
