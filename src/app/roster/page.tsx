import { getParticipants } from "@/app/actions/participants";
import { RosterClient } from "./roster-client";

export default async function RosterPage() {
  const participants = await getParticipants();

  return (
    <div className="container py-10 px-4 md:px-6">
      <RosterClient participants={participants} />
    </div>
  );
}
