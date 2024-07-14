-- CreateTable
CREATE TABLE "fosCustomers" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerNameBn" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fosCustomers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fosProducts" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "uom" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fosProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fosInvoices" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fosCustomerId" TEXT NOT NULL,
    "totalQty" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fosInvoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fosInvoicedProducts" (
    "id" TEXT NOT NULL,
    "fosInvoiceId" TEXT NOT NULL,
    "fosProductId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "fosInvoicedProducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fosCustomers_customerId_key" ON "fosCustomers"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "fosProducts_productId_key" ON "fosProducts"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "fosProducts_label_key" ON "fosProducts"("label");

-- CreateIndex
CREATE UNIQUE INDEX "fosInvoices_invoiceNo_key" ON "fosInvoices"("invoiceNo");

-- AddForeignKey
ALTER TABLE "fosInvoices" ADD CONSTRAINT "fosInvoices_fosCustomerId_fkey" FOREIGN KEY ("fosCustomerId") REFERENCES "fosCustomers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosInvoices" ADD CONSTRAINT "fosInvoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosInvoicedProducts" ADD CONSTRAINT "fosInvoicedProducts_fosInvoiceId_fkey" FOREIGN KEY ("fosInvoiceId") REFERENCES "fosInvoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fosInvoicedProducts" ADD CONSTRAINT "fosInvoicedProducts_fosProductId_fkey" FOREIGN KEY ("fosProductId") REFERENCES "fosProducts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
