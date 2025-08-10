-- CreateEnum
CREATE TYPE "SoldType" AS ENUM ('SALE', 'EXCHANGE');

-- CreateTable
CREATE TABLE "soldJewelleries" (
    "id" TEXT NOT NULL,
    "soldType" "SoldType" NOT NULL,
    "jewelleryId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "soldDate" TIMESTAMP(3) NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "percent" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "soldJewelleries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "soldJewelleries" ADD CONSTRAINT "soldJewelleries_jewelleryId_fkey" FOREIGN KEY ("jewelleryId") REFERENCES "jewelleries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "soldJewelleries" ADD CONSTRAINT "soldJewelleries_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "jewelleryVendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
