-- CreateEnum
CREATE TYPE "ZakatStatus" AS ENUM ('DUE', 'PAID');

-- AlterTable
ALTER TABLE "zakats" ADD COLUMN     "status" "ZakatStatus" NOT NULL DEFAULT 'PAID';
