import { getParticipants } from "@/app/actions/participants";
import { getSessions } from "@/app/actions/sessions";
import { calculateStreaks, ParticipantWithSessions, SessionWithParticipants } from "@/lib/streaks";
import { DashboardClient, DashboardParticipant, MonthlyRankingData } from "./dashboard-client";
import { Dumbbell } from "lucide-react";
import { getSeasonContext } from "@/lib/seasons";
import { SeasonSelector } from "@/components/shared/season-selector";

interface HomeProps {
  searchParams: Promise<{ season?: string | string[] }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const seasonContext = await getSeasonContext(params.season);
  const [participants, sessions, allSessionsResult] = await Promise.all([
    getParticipants(seasonContext.selection),
    getSessions(seasonContext.selection),
    seasonContext.selection === "all" ? Promise.resolve(null) : getSessions("all"),
  ]);
  const allSessions = allSessionsResult ?? sessions;

  const streakData = calculateStreaks(
    participants as unknown as ParticipantWithSessions[],
    sessions as unknown as SessionWithParticipants[]
  );

  // Formatting monthly data
  const monthCounts: Record<string, number> = {};
  const monthlyRankings: Record<string, MonthlyRankingData[]> = {};

  (allSessions as (SessionWithParticipants & { date: Date })[]).forEach((s) => {
    const d = new Date(s.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    // Total sessions per month
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;

  });

  // Attendance per participant in the selected season
  (sessions as (SessionWithParticipants & { date: Date })[]).forEach((s) => {
    const d = new Date(s.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyRankings[monthKey]) {
      monthlyRankings[monthKey] = participants.map(p => ({
        id: p.id,
        name: p.name,
        count: 0
      }));
    }

    s.participants.forEach(att => {
      const participantEntry = monthlyRankings[monthKey].find(p => p.id === att.id);
      if (participantEntry) {
        participantEntry.count += 1;
      }
    });
  });

  // Sort months chronologically for the chart
  const sortedMonths = Object.keys(monthCounts).sort();

  const monthlyRecap = sortedMonths.map((month) => {
    const [year, m] = month.split('-').map(Number);
    const displayMonth = new Date(year, m - 1).toLocaleDateString("ca-ES", {
      month: "short",
      year: "numeric",
    });
    return {
      month: displayMonth,
      count: monthCounts[month],
    };
  });

  return (
    <div className="py-8">
      <div className="mb-6 flex justify-end">
        <SeasonSelector
          seasons={seasonContext.seasons}
          selection={seasonContext.selection}
        />
      </div>
      <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b pb-8 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Sanrogym
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Forjant espartans en un garatge. No et rendeixis.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-bold">
            <Dumbbell className="h-5 w-5" />
            <span>
              {allSessions.length} {allSessions.length === 1 ? "sessió registrada" : "sessions registrades"}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest px-2">
            Total històric
          </span>
        </div>
      </div>

      {allSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5">
          <Dumbbell className="h-16 w-16 text-primary animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Encara no hi ha sessions!</h2>
            <p className="max-w-md text-muted-foreground">
              Vés a la pestanya de Sessions per registrar la primera sessió de grup i començar la teva ratxa.
            </p>
          </div>
        </div>
      ) : (
        <DashboardClient
          participants={streakData as unknown as DashboardParticipant[]}
          monthlyData={monthlyRecap}
          monthlyRankings={monthlyRankings}
          hasSeasonSessions={sessions.length > 0}
        />
      )}
    </div>
  );
}
