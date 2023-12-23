-- CreateTable
CREATE TABLE "voucherDetails" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "receiveAmount" INTEGER NOT NULL,

    CONSTRAINT "voucherDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voucherDetails" ADD CONSTRAINT "voucherDetails_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucherDetails" ADD CONSTRAINT "voucherDetails_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
