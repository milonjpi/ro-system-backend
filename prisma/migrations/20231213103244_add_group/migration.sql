-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "groupId" TEXT;

-- CreateTable
CREATE TABLE "customerGroups" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customerGroups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customerGroups_label_key" ON "customerGroups"("label");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "customerGroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
