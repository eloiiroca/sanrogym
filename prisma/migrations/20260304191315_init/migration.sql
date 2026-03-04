-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionNumber" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_ParticipantToSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ParticipantToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ParticipantToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionNumber_key" ON "Session"("sessionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToSession_AB_unique" ON "_ParticipantToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToSession_B_index" ON "_ParticipantToSession"("B");
