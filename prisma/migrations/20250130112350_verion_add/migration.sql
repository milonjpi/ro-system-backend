-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "version" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "version" BOOLEAN NOT NULL DEFAULT false;
