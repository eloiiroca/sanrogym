import { getSessions } from "@/app/actions/sessions";
import { getParticipants } from "@/app/actions/participants";
import { SessionsClient } from "./sessions-client";
import { getSession } from "@/lib/auth";
import { getSeasonContext } from "@/lib/seasons";
import { SeasonSelector } from "@/components/shared/season-selector";

interface SessionsPageProps {
  searchParams: Promise<{ season?: string | string[] }>;
}

export default async function SessionsPage({ searchParams }: SessionsPageProps) {
  const params = await searchParams;
  const seasonContext = await getSeasonContext(params.season);
  const [sessions, participants, userSession] = await Promise.all([
    getSessions(seasonContext.selection),
    getParticipants(seasonContext.selection),
    getSession(),
  ]);

  const isAdmin = !!userSession && userSession.role === "admin";

  return (
    <div className="py-10">
      <div className="mb-6 flex justify-end">
        <SeasonSelector
          seasons={seasonContext.seasons}
          selection={seasonContext.selection}
        />
      </div>
      <SessionsClient 
        sessions={sessions} 
        participants={participants} 
        isAdmin={isAdmin}
        activeSeasonName={seasonContext.activeSeason.name}
        seasonSelection={seasonContext.selection}
      />
    </div>
  );
}
