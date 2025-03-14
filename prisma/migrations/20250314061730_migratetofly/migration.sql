-- CreateTable
CREATE TABLE "characterStatsThatChange" (
    "charId" SERIAL NOT NULL,
    "charName" TEXT NOT NULL,
    "currentFp" INTEGER NOT NULL,
    "currentEp" INTEGER NOT NULL,
    "currentPp" INTEGER NOT NULL,
    "currentMp" INTEGER NOT NULL,
    "currentLp" INTEGER NOT NULL,
    "atkRollResult" DOUBLE PRECISION DEFAULT 0,
    "skillCheckResult" INTEGER DEFAULT 0,
    "atkRollDice" TEXT DEFAULT '',
    "skillCheckDice" TEXT DEFAULT '',
    "activeBuffs" TEXT DEFAULT '',
    "numberOfActions" TEXT DEFAULT '',
    "gameId" TEXT DEFAULT '',
    "initiativeWithRoll" INTEGER DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characterStatsThatChange_pkey" PRIMARY KEY ("charId")
);

-- CreateIndex
CREATE UNIQUE INDEX "characterStatsThatChange_charName_key" ON "characterStatsThatChange"("charName");
