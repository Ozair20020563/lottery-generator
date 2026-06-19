-- CreateTable
CREATE TABLE "LotteryGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "mainMin" INTEGER NOT NULL DEFAULT 1,
    "mainMax" INTEGER NOT NULL,
    "mainCount" INTEGER NOT NULL,
    "bonusMin" INTEGER,
    "bonusMax" INTEGER,
    "bonusCount" INTEGER NOT NULL DEFAULT 0,
    "hasBonus" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricalDraw" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lotteryGameId" TEXT NOT NULL,
    "drawDate" DATETIME NOT NULL,
    "mainNumbers" TEXT NOT NULL,
    "bonusNumbers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HistoricalDraw_lotteryGameId_fkey" FOREIGN KEY ("lotteryGameId") REFERENCES "LotteryGame" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GenerationHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lotteryGameId" TEXT NOT NULL,
    "strategyUsed" TEXT NOT NULL,
    "generatedNumbers" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GenerationHistory_lotteryGameId_fkey" FOREIGN KEY ("lotteryGameId") REFERENCES "LotteryGame" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LotteryGame_name_key" ON "LotteryGame"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LotteryGame_code_key" ON "LotteryGame"("code");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalDraw_lotteryGameId_drawDate_key" ON "HistoricalDraw"("lotteryGameId", "drawDate");
