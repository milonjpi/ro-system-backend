-- AlterTable
ALTER TABLE "jewelleryRates" ADD COLUMN     "less" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "recipients" ADD COLUMN     "recipientGroupId" TEXT;

-- CreateTable
CREATE TABLE "recipientGroups" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipientGroups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipientGroups_label_key" ON "recipientGroups"("label");

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_recipientGroupId_fkey" FOREIGN KEY ("recipientGroupId") REFERENCES "recipientGroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
