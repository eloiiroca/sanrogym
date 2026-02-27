import { getParticipants } from "@/app/actions/participants";
import { getSessions } from "@/app/actions/sessions";
import { calculateStreaks, ParticipantWithSessions, SessionWithParticipants } from "@/lib/streaks";
import { DashboardClient, DashboardParticipant } from "./dashboard-client";
import { Dumbbell } from "lucide-react";

export default async function Home() {
  const [participants, sessions] = await Promise.all([
    getParticipants(),
    getSessions(),
  ]);

  const streakData = calculateStreaks(
    participants as unknown as ParticipantWithSessions[],
    sessions as unknown as SessionWithParticipants[]
  );

  // Formatting monthly recap data
  // Group sessions by month (Year-Month)
  const monthCounts: Record<string, number> = {};
  (sessions as { date: Date }[]).forEach((s) => {
    const month = new Date(s.date).toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  // Sort months chronologically
  const sortedMonths = Object.keys(monthCounts).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const monthlyData = sortedMonths.map((month) => ({
    month,
    count: monthCounts[month],
  }));

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b pb-8 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Sanrogym
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            The group gym attendance tracker. Stay consistent.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-bold">
            <Dumbbell className="h-5 w-5" />
            <span>{sessions.length} sessions logged</span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest px-2">
            All-time total
          </span>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5">
          <Dumbbell className="h-16 w-16 text-primary animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No sessions logged yet!</h2>
            <p className="max-w-md text-muted-foreground">
              Go to the Sessions tab to log your first group session and start your streak.
            </p>
          </div>
        </div>
      ) : (
        <DashboardClient
          participants={streakData as unknown as DashboardParticipant[]}
          monthlyData={monthlyData}
        />
      )}
    </div>
  );
}
