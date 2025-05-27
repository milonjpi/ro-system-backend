-- CreateTable
CREATE TABLE "jewelleryTypes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jewelleryTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carats" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jewelleryVendors" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jewelleryVendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jewelleryUom" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jewelleryUom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jewelleries" (
    "id" TEXT NOT NULL,
    "jewelleryTypeId" TEXT NOT NULL,
    "caratId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "dop" TIMESTAMP(3) NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "uomId" TEXT,
    "unitPrice" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION NOT NULL,
    "price" INTEGER NOT NULL,
    "remarks" TEXT,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "isExchanged" BOOLEAN NOT NULL DEFAULT false,
    "soldDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jewelleries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jewelleryTypes_label_key" ON "jewelleryTypes"("label");

-- CreateIndex
CREATE UNIQUE INDEX "carats_label_key" ON "carats"("label");

-- CreateIndex
CREATE UNIQUE INDEX "jewelleryVendors_label_key" ON "jewelleryVendors"("label");

-- CreateIndex
CREATE UNIQUE INDEX "jewelleryUom_label_key" ON "jewelleryUom"("label");

-- AddForeignKey
ALTER TABLE "jewelleries" ADD CONSTRAINT "jewelleries_jewelleryTypeId_fkey" FOREIGN KEY ("jewelleryTypeId") REFERENCES "jewelleryTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jewelleries" ADD CONSTRAINT "jewelleries_caratId_fkey" FOREIGN KEY ("caratId") REFERENCES "carats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jewelleries" ADD CONSTRAINT "jewelleries_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "jewelleryVendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jewelleries" ADD CONSTRAINT "jewelleries_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "jewelleryUom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
