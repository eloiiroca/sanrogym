export interface ParticipantWithSessions {
  id: string;
  name: string;
  sessions: { id: string; sessionNumber: number }[];
}

export interface SessionWithParticipants {
  id: string;
  sessionNumber: number;
  participants: { id: string }[];
}

export function calculateStreaks(
  participants: ParticipantWithSessions[],
  allSessions: SessionWithParticipants[]
) {
  // Sort sessions by number descending (latest first)
  const sortedSessions = [...allSessions].sort(
    (a, b) => b.sessionNumber - a.sessionNumber
  );

  return participants.map((p) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Current Streak calculation (starting from latest group session)
    for (let i = 0; i < sortedSessions.length; i++) {
      const attended = sortedSessions[i].participants.some((att) => att.id === p.id);
      if (attended) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Longest Streak calculation (anywhere in history)
    // We iterate from oldest to newest for easier logic
    const chronologicalSessions = [...sortedSessions].reverse();
    for (let i = 0; i < chronologicalSessions.length; i++) {
      const attended = chronologicalSessions[i].participants.some(
        (att) => att.id === p.id
      );
      if (attended) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    return {
      ...p,
      currentStreak,
      longestStreak,
    };
  });
}
