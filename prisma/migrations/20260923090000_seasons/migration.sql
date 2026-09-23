-- Add the first season and move all historical sessions into it.
PRAGMA foreign_keys=OFF;

CREATE TABLE "Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO "Season" ("id", "name", "isActive")
VALUES (1, 'Temporada 1', true);

-- Rebuild Session so seasonId is required and has a real foreign key.
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionNumber" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seasonId" INTEGER NOT NULL,
    CONSTRAINT "Session_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Session" ("id", "sessionNumber", "date", "createdAt", "seasonId")
SELECT "id", "sessionNumber", "date", "createdAt", 1
FROM "Session";

DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";

CREATE UNIQUE INDEX "Session_sessionNumber_key" ON "Session"("sessionNumber");
CREATE INDEX "Session_seasonId_idx" ON "Session"("seasonId");

PRAGMA foreign_keys=ON;
