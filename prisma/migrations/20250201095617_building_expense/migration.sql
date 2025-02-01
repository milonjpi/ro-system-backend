-- CreateTable
CREATE TABLE "buildingExpenseHeads" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingExpenseHeads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingVendors" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "contactNo" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingVendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingBrands" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingBrands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingUom" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingUom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingExpenses" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "expenseHeadId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "uomId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingPaymentMethods" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingPaymentMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingPayments" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingInvestmentSources" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingInvestmentSources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildingInvestments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "investmentSourceId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "investmentDetails" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildingInvestments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildingExpenseHeads_label_key" ON "buildingExpenseHeads"("label");

-- CreateIndex
CREATE UNIQUE INDEX "buildingVendors_label_key" ON "buildingVendors"("label");

-- CreateIndex
CREATE UNIQUE INDEX "buildingBrands_label_key" ON "buildingBrands"("label");

-- CreateIndex
CREATE UNIQUE INDEX "buildingUom_label_key" ON "buildingUom"("label");

-- CreateIndex
CREATE UNIQUE INDEX "buildingPaymentMethods_label_key" ON "buildingPaymentMethods"("label");

-- CreateIndex
CREATE UNIQUE INDEX "buildingInvestmentSources_label_key" ON "buildingInvestmentSources"("label");

-- AddForeignKey
ALTER TABLE "buildingExpenses" ADD CONSTRAINT "buildingExpenses_expenseHeadId_fkey" FOREIGN KEY ("expenseHeadId") REFERENCES "buildingExpenseHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingExpenses" ADD CONSTRAINT "buildingExpenses_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "buildingVendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingExpenses" ADD CONSTRAINT "buildingExpenses_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "buildingBrands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingExpenses" ADD CONSTRAINT "buildingExpenses_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "buildingUom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingPayments" ADD CONSTRAINT "buildingPayments_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "buildingExpenses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingPayments" ADD CONSTRAINT "buildingPayments_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "buildingPaymentMethods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildingInvestments" ADD CONSTRAINT "buildingInvestments_investmentSourceId_fkey" FOREIGN KEY ("investmentSourceId") REFERENCES "buildingInvestmentSources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
