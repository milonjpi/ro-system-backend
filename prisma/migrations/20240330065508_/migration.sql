-- CreateEnum
CREATE TYPE "IncomeExpenseType" AS ENUM ('Income', 'Expense');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incomeExpenseHeads" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incomeExpenseHeads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modeOfPayments" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modeOfPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incomeExpenses" (
    "id" TEXT NOT NULL,
    "type" "IncomeExpenseType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "incomeExpenseHeadId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "modeOfPaymentId" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incomeExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_label_key" ON "categories"("label");

-- CreateIndex
CREATE UNIQUE INDEX "incomeExpenseHeads_label_key" ON "incomeExpenseHeads"("label");

-- CreateIndex
CREATE UNIQUE INDEX "modeOfPayments_label_key" ON "modeOfPayments"("label");

-- AddForeignKey
ALTER TABLE "incomeExpenses" ADD CONSTRAINT "incomeExpenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomeExpenses" ADD CONSTRAINT "incomeExpenses_incomeExpenseHeadId_fkey" FOREIGN KEY ("incomeExpenseHeadId") REFERENCES "incomeExpenseHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomeExpenses" ADD CONSTRAINT "incomeExpenses_modeOfPaymentId_fkey" FOREIGN KEY ("modeOfPaymentId") REFERENCES "modeOfPayments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
