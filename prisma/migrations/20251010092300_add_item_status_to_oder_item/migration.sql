-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'SERVED');

-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'PENDING';
