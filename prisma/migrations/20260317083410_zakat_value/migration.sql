-- CreateTable
CREATE TABLE "zakatValues" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zakatValues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zakatValues_year_key" ON "zakatValues"("year");
