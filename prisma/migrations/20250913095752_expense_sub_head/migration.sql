-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "expenseSubHeadId" TEXT;

-- CreateTable
CREATE TABLE "expenseSubHeads" (
    "id" TEXT NOT NULL,
    "expenseHeadId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenseSubHeads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expenseSubHeads_expenseHeadId_label_key" ON "expenseSubHeads"("expenseHeadId", "label");

-- AddForeignKey
ALTER TABLE "expenseSubHeads" ADD CONSTRAINT "expenseSubHeads_expenseHeadId_fkey" FOREIGN KEY ("expenseHeadId") REFERENCES "expenseHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_expenseSubHeadId_fkey" FOREIGN KEY ("expenseSubHeadId") REFERENCES "expenseSubHeads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
