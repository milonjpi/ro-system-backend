-- CreateTable
CREATE TABLE "expenseAreas" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenseAreas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenseTypes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenseTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthlyExpenseHeads" (
    "id" TEXT NOT NULL,
    "expenseTypeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthlyExpenseHeads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentSources" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymentSources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthlyExpenses" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "expenseAreaId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "expenseTypeId" TEXT NOT NULL,
    "monthlyExpenseHeadId" TEXT NOT NULL,
    "expenseDetails" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentSourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthlyExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "openingBalances" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentSourceId" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "openingBalances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "expenseAreas_label_key" ON "expenseAreas"("label");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_label_key" ON "vehicles"("label");

-- CreateIndex
CREATE UNIQUE INDEX "expenseTypes_label_key" ON "expenseTypes"("label");

-- CreateIndex
CREATE UNIQUE INDEX "monthlyExpenseHeads_expenseTypeId_label_key" ON "monthlyExpenseHeads"("expenseTypeId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "paymentSources_label_key" ON "paymentSources"("label");

-- CreateIndex
CREATE UNIQUE INDEX "openingBalances_year_month_paymentSourceId_key" ON "openingBalances"("year", "month", "paymentSourceId");

-- AddForeignKey
ALTER TABLE "monthlyExpenseHeads" ADD CONSTRAINT "monthlyExpenseHeads_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES "expenseTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthlyExpenses" ADD CONSTRAINT "monthlyExpenses_expenseAreaId_fkey" FOREIGN KEY ("expenseAreaId") REFERENCES "expenseAreas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthlyExpenses" ADD CONSTRAINT "monthlyExpenses_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthlyExpenses" ADD CONSTRAINT "monthlyExpenses_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES "expenseTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthlyExpenses" ADD CONSTRAINT "monthlyExpenses_monthlyExpenseHeadId_fkey" FOREIGN KEY ("monthlyExpenseHeadId") REFERENCES "monthlyExpenseHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthlyExpenses" ADD CONSTRAINT "monthlyExpenses_paymentSourceId_fkey" FOREIGN KEY ("paymentSourceId") REFERENCES "paymentSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "openingBalances" ADD CONSTRAINT "openingBalances_paymentSourceId_fkey" FOREIGN KEY ("paymentSourceId") REFERENCES "paymentSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
