/*
  Warnings:

  - You are about to drop the column `seating_scheme_id` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seating_scheme_id` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the `SeatingScheme` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hall_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hall_id` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_seating_scheme_id_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_seating_scheme_id_fkey";

-- DropForeignKey
ALTER TABLE "SeatingScheme" DROP CONSTRAINT "SeatingScheme_cinema_id_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "seating_scheme_id",
ADD COLUMN     "hall_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seating_scheme_id",
ADD COLUMN     "hall_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SeatingScheme";

-- CreateTable
CREATE TABLE "Hall" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cinema_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "rows" INTEGER NOT NULL,
    "places" INTEGER NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hall" ADD CONSTRAINT "Hall_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
