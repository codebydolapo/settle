-- DropIndex
DROP INDEX "PaymentMethod_id_key";

-- DropIndex
DROP INDEX "PaymentMethod_providerName_key";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;
