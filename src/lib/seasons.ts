import prisma from "@/lib/prisma";
import type { SeasonContext, SeasonOption, SeasonSelection } from "@/lib/season-types";

let developmentSeasonInitialization: Promise<void> | undefined;

function isLocalDevelopment() {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  return (
    process.env.NODE_ENV === "development" &&
    (!databaseUrl || databaseUrl.startsWith("file:"))
  );
}

export async function ensureActiveSeason() {
  const activeSeasons = await prisma.season.findMany({
    where: { isActive: true },
    orderBy: { id: "desc" },
  });

  if (activeSeasons.length === 1) return activeSeasons[0];

  return prisma.$transaction(async (tx) => {
    const activeInsideTransaction = await tx.season.findMany({
      where: { isActive: true },
      orderBy: { id: "desc" },
    });
    if (activeInsideTransaction.length === 1) return activeInsideTransaction[0];

    const seasonToKeep =
      activeInsideTransaction[0] ??
      (await tx.season.findFirst({ orderBy: { id: "desc" } }));

    if (seasonToKeep) {
      await tx.season.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
      return tx.season.update({
        where: { id: seasonToKeep.id },
        data: { isActive: true },
      });
    }

    return tx.season.create({
      data: { name: "Temporada 1", isActive: true },
    });
  });
}

function ensureDevelopmentSeason() {
  if (!isLocalDevelopment()) return Promise.resolve();

  if (!developmentSeasonInitialization) {
    developmentSeasonInitialization = prisma
      .$transaction(async (tx) => {
        const count = await tx.season.count();
        if (count >= 2) return;

        await tx.season.create({
          data: { name: "Temporada 2", isActive: false },
        });
      })
      .catch((error: unknown) => {
        developmentSeasonInitialization = undefined;
        throw error;
      });
  }

  return developmentSeasonInitialization;
}

export async function getSeasonOptions(): Promise<SeasonOption[]> {
  await ensureActiveSeason();
  await ensureDevelopmentSeason();

  const seasons = await prisma.season.findMany({
    orderBy: { id: "desc" },
    include: { _count: { select: { sessions: true } } },
  });

  return seasons.map(({ _count, ...season }) => ({
    ...season,
    sessionCount: _count.sessions,
  }));
}

export async function getSeasonContext(
  requestedSelection?: string | string[]
): Promise<SeasonContext> {
  const seasons = await getSeasonOptions();
  const activeSeason = seasons.find((season) => season.isActive);

  if (!activeSeason) {
    throw new Error("No hi ha cap temporada activa");
  }

  const requested = Array.isArray(requestedSelection)
    ? requestedSelection[0]
    : requestedSelection;

  if (requested === "all") {
    return { seasons, activeSeason, selectedSeason: null, selection: "all" };
  }

  const requestedId = requested && /^\d+$/.test(requested) ? Number(requested) : NaN;
  const selectedSeason = seasons.find((season) => season.id === requestedId) ?? activeSeason;

  return {
    seasons,
    activeSeason,
    selectedSeason,
    selection: selectedSeason.id,
  };
}

export async function getSeasonIdForSelection(
  selection?: SeasonSelection
): Promise<number | undefined> {
  const activeSeason = await ensureActiveSeason();
  if (selection === "all") return undefined;

  if (typeof selection === "number" && Number.isInteger(selection) && selection > 0) {
    const season = await prisma.season.findUnique({
      where: { id: selection },
      select: { id: true },
    });
    if (season) return season.id;
  }

  return activeSeason.id;
}
