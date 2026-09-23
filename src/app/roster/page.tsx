import { getParticipants } from "@/app/actions/participants";
import { RosterClient } from "./roster-client";
import { getSeasonContext } from "@/lib/seasons";
import { SeasonSelector } from "@/components/shared/season-selector";

interface RosterPageProps {
  searchParams: Promise<{ season?: string | string[] }>;
}

export default async function RosterPage({ searchParams }: RosterPageProps) {
  const params = await searchParams;
  const seasonContext = await getSeasonContext(params.season);
  const participants = await getParticipants(seasonContext.selection);

  return (
    <div className="py-10">
      <div className="mb-6 flex justify-end">
        <SeasonSelector
          seasons={seasonContext.seasons}
          selection={seasonContext.selection}
        />
      </div>
      <RosterClient participants={participants} />
    </div>
  );
}
