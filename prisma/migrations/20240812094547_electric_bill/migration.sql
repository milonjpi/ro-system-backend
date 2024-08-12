-- AlterTable
ALTER TABLE "electricityBills" ADD COLUMN     "meterReading" INTEGER DEFAULT 0,
ADD COLUMN     "netBill" INTEGER DEFAULT 0,
ADD COLUMN     "serviceCharge" INTEGER DEFAULT 0,
ADD COLUMN     "unitDetails" TEXT;
