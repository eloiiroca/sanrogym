import { getSessions } from "@/app/actions/sessions";
import { getParticipants } from "@/app/actions/participants";
import { SessionsClient } from "./sessions-client";
import { getSession } from "@/lib/auth";

export default async function SessionsPage() {
  const [sessions, participants, userSession] = await Promise.all([
    getSessions(),
    getParticipants(),
    getSession(),
  ]);

  const isAdmin = !!userSession && userSession.role === "admin";

  return (
    <div className="container py-10 px-4 md:px-6">
      <SessionsClient 
        sessions={sessions} 
        participants={participants} 
        isAdmin={isAdmin}
      />
    </div>
  );
}
