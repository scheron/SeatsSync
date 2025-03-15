-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('VACANT', 'RESERVED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "secret" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255),
    "recovery_phrase" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cinema" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cinema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hall" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cinema_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "rows" INTEGER NOT NULL,
    "places" INTEGER NOT NULL,

    CONSTRAINT "Hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "seat_type_id" INTEGER NOT NULL,
    "row" INTEGER NOT NULL,
    "place" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "rotation" DOUBLE PRECISION NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'VACANT',
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SeatType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_recovery_phrase_key" ON "User"("recovery_phrase");

-- AddForeignKey
ALTER TABLE "Hall" ADD CONSTRAINT "Hall_cinema_id_fkey" FOREIGN KEY ("cinema_id") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "Hall"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_seat_type_id_fkey" FOREIGN KEY ("seat_type_id") REFERENCES "SeatType"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
