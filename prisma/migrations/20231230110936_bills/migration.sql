-- DropForeignKey
ALTER TABLE "voucherDetails" DROP CONSTRAINT "voucherDetails_invoiceId_fkey";

-- AlterTable
ALTER TABLE "voucherDetails" ADD COLUMN     "billId" TEXT,
ALTER COLUMN "invoiceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "voucherDetails" ADD CONSTRAINT "voucherDetails_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucherDetails" ADD CONSTRAINT "voucherDetails_billId_fkey" FOREIGN KEY ("billId") REFERENCES "bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
