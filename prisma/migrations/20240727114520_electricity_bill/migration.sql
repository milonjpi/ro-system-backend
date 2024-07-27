-- CreateEnum
CREATE TYPE "ElectricityBillStatus" AS ENUM ('Due', 'Paid');

-- CreateTable
CREATE TABLE "drCustomers" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerNameBn" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drCustomers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drProducts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "uom" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drInvoices" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalQty" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "InvoiceBillStatus" NOT NULL DEFAULT 'Due',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drInvoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drInvoicedProducts" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "drInvoicedProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drVouchers" (
    "id" TEXT NOT NULL,
    "voucherNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "narration" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drVouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drVoucherDetails" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiveAmount" INTEGER NOT NULL,

    CONSTRAINT "drVoucherDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meters" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "location" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electricityBills" (
    "id" TEXT NOT NULL,
    "meterId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "unit" INTEGER,
    "amount" INTEGER NOT NULL,
    "paidBy" TEXT NOT NULL,
    "remarks" TEXT,
    "status" "ElectricityBillStatus" NOT NULL DEFAULT 'Due',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electricityBills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drCustomers_customerId_key" ON "drCustomers"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "drProducts_productId_key" ON "drProducts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "drProducts_label_key" ON "drProducts"("label");

-- CreateIndex
CREATE UNIQUE INDEX "drInvoices_invoiceNo_key" ON "drInvoices"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "drVouchers_voucherNo_key" ON "drVouchers"("voucherNo");

-- CreateIndex
CREATE UNIQUE INDEX "electricityBills_month_year_key" ON "electricityBills"("month", "year");

-- AddForeignKey
ALTER TABLE "drInvoices" ADD CONSTRAINT "drInvoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "drCustomers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drInvoices" ADD CONSTRAINT "drInvoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drInvoicedProducts" ADD CONSTRAINT "drInvoicedProducts_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "drInvoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drInvoicedProducts" ADD CONSTRAINT "drInvoicedProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "drProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drVouchers" ADD CONSTRAINT "drVouchers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "drCustomers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drVouchers" ADD CONSTRAINT "drVouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drVoucherDetails" ADD CONSTRAINT "drVoucherDetails_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "drVouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drVoucherDetails" ADD CONSTRAINT "drVoucherDetails_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "drInvoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electricityBills" ADD CONSTRAINT "electricityBills_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "meters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
