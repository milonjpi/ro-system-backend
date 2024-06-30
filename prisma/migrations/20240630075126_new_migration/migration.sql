-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "isDistributor" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "distributorId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "distClients" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerNameBn" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "distributorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distClients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distVendors" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "vendorNameBn" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distVendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distInvoices" (
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

    CONSTRAINT "distInvoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distInvoicedProducts" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "distInvoicedProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distVouchers" (
    "id" TEXT NOT NULL,
    "voucherNo" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" TEXT,
    "vendorId" TEXT,
    "narration" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distVouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distVoucherDetails" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiveAmount" INTEGER NOT NULL,

    CONSTRAINT "distVoucherDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distExpenses" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "distributorId" TEXT NOT NULL,
    "expenseHeadId" TEXT NOT NULL,
    "vendor" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distExpenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "distClients_customerId_key" ON "distClients"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "distVendors_vendorId_key" ON "distVendors"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "distInvoices_invoiceNo_key" ON "distInvoices"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "distVouchers_voucherNo_key" ON "distVouchers"("voucherNo");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distClients" ADD CONSTRAINT "distClients_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distInvoices" ADD CONSTRAINT "distInvoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "distClients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distInvoices" ADD CONSTRAINT "distInvoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distInvoicedProducts" ADD CONSTRAINT "distInvoicedProducts_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "distInvoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distInvoicedProducts" ADD CONSTRAINT "distInvoicedProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distVouchers" ADD CONSTRAINT "distVouchers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "distClients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distVouchers" ADD CONSTRAINT "distVouchers_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "distVendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distVouchers" ADD CONSTRAINT "distVouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distVoucherDetails" ADD CONSTRAINT "distVoucherDetails_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "distVouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distVoucherDetails" ADD CONSTRAINT "distVoucherDetails_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "distInvoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distExpenses" ADD CONSTRAINT "distExpenses_distributorId_fkey" FOREIGN KEY ("distributorId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distExpenses" ADD CONSTRAINT "distExpenses_expenseHeadId_fkey" FOREIGN KEY ("expenseHeadId") REFERENCES "expenseHeads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distExpenses" ADD CONSTRAINT "distExpenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
