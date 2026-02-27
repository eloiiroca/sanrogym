import { getSessions } from "@/app/actions/sessions";
import { getParticipants } from "@/app/actions/participants";
import { SessionsClient } from "./sessions-client";

export default async function SessionsPage() {
  const [sessions, participants] = await Promise.all([
    getSessions(),
    getParticipants(),
  ]);

  return (
    <div className="container py-10 px-4 md:px-6">
      <SessionsClient sessions={sessions} participants={participants} />
    </div>
  );
}
