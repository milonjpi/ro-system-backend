-- AlterTable
ALTER TABLE "monthlyExpenses" ADD COLUMN     "expenseDetailId" TEXT;

-- CreateTable
CREATE TABLE "expenseDetails" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expenseDetails_label_key" ON "expenseDetails"("label");

-- AddForeignKey
ALTER TABLE "monthlyExpenses" ADD CONSTRAINT "monthlyExpenses_expenseDetailId_fkey" FOREIGN KEY ("expenseDetailId") REFERENCES "expenseDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
