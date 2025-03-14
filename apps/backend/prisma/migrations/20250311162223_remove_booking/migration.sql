/*
  Warnings:

  - The `status` column on the `Seat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `price` on the `SeatType` table. All the data in the column will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingSeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('VACANT', 'OCCUPIED', 'MAINTENANCE');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_hall_id_fkey";

-- DropForeignKey
ALTER TABLE "BookingSeat" DROP CONSTRAINT "BookingSeat_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "BookingSeat" DROP CONSTRAINT "BookingSeat_seat_id_fkey";

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "last_updated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'VACANT';

-- AlterTable
ALTER TABLE "SeatType" DROP COLUMN "price";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "BookingSeat";
