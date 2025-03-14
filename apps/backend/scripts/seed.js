import {PrismaClient} from "@prisma/client"
import dotenv from "dotenv"
import {cinemas, halls, seatLayouts, seatTypes} from "./mock.js"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  await clearDatabase()

  await sleepWithMessage("Seeding database...")

  const cinemaRecords = await createCinemas()
  const seatTypeRecords = await createSeatTypes()

  for (const cinema of cinemaRecords) {
    const hallRecords = await createHalls(cinema)

    for (const hall of hallRecords) {
      await createSeats(hall, seatTypeRecords)
    }
  }

  await sleepWithMessage("Seeding completed!")
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

async function clearDatabase() {
  await sleepWithMessage("Clearing existing data...")

  await prisma.seat.deleteMany()
  await prisma.seatType.deleteMany()
  await prisma.hall.deleteMany()
  await prisma.cinema.deleteMany()

  await sleepWithMessage("Database cleared.")
}

async function createCinemas() {
  await sleepWithMessage("Creating cinemas...")

  const createdCinemas = await prisma.cinema.createMany({data: cinemas})

  await sleepWithMessage(`Created ${createdCinemas.count} cinemas.`)

  return await prisma.cinema.findMany()
}

async function createHalls(cinema) {
  await sleepWithMessage(`Creating halls for cinema: ${cinema.name}`)

  const shuffledHalls = halls.sort(() => Math.random() - 0.5).slice(0, getRandomNumber(2, 4))

  const hallsToCreate = shuffledHalls.map((hall) => {
    const seatLayout = seatLayouts[Math.floor(Math.random() * seatLayouts.length)]

    const rows = Math.max(...seatLayout.map((s) => s.row))
    const places = Math.max(...seatLayout.map((s) => s.place))

    return {
      name: hall.name,
      cinema_id: cinema.id,
      rows,
      places,
    }
  })

  const createdHalls = await prisma.hall.createMany({data: hallsToCreate})

  await sleepWithMessage(`Created ${createdHalls.length} halls for cinema: ${cinema.name}.`)

  return await prisma.hall.findMany({where: {cinema_id: cinema.id}})
}

async function createSeatTypes() {
  await sleepWithMessage("Creating seat types...")

  const createdSeatTypes = await prisma.seatType.createMany({data: seatTypes})

  await sleepWithMessage(`Created ${createdSeatTypes.count} seat types.`)

  return await prisma.seatType.findMany()
}

async function createSeats(hall, seatTypeRecords) {
  await sleepWithMessage(`Creating seats for hall: ${hall.name}`)

  const seatMock = seatLayouts[Math.floor(Math.random() * seatLayouts.length)]

  let seatDistribution
  const randomPattern = Math.floor(Math.random() * 5)

  switch (randomPattern) {
    case 0:
      seatDistribution = () => seatTypeRecords[Math.floor(Math.random() * seatTypeRecords.length)].id
      break
    case 1:
      seatDistribution = (seat) => {
        const totalRows = Math.max(...seatMock.map((s) => s.row))
        const frontRows = Math.ceil(totalRows * 0.3)
        const middleRows = Math.ceil(totalRows * 0.5)

        if (seat.row <= frontRows) return seatTypeRecords.find((st) => st.name === "Premium" || st.name === "VIP").id
        if (seat.row <= middleRows) return seatTypeRecords.find((st) => st.name === "Comfort").id
        return seatTypeRecords.find((st) => st.name === "Standard").id
      }
      break
    case 2:
      seatDistribution = (seat) => {
        const totalPlaces = Math.max(...seatMock.map((s) => s.place))
        const centerStart = Math.floor(totalPlaces * 0.3)
        const centerEnd = Math.floor(totalPlaces * 0.7)

        if (seat.place > centerStart && seat.place < centerEnd) {
          return seatTypeRecords.find((st) => st.name === "Premium" || st.name === "Luxury").id
        }
        return seatTypeRecords.find((st) => st.name === "Standard" || st.name === "Comfort").id
      }
      break
    case 3:
      seatDistribution = (seat) => {
        if (seat.row % 2 === 0 && seat.place % 3 === 0) {
          return seatTypeRecords.find((st) => st.name === "VIP" || st.name === "Luxury").id
        }
        if (seat.row === Math.max(...seatMock.map((s) => s.row))) {
          return seatTypeRecords.find((st) => st.name === "Couples").id
        }
        return seatTypeRecords.find((st) => st.name === "Standard" || st.name === "Comfort").id
      }
      break
    case 4:
      seatDistribution = (seat) => {
        if (seat.row === Math.max(...seatMock.map((s) => s.row))) {
          return seatTypeRecords.find((st) => st.name === "Couples").id
        }

        const rand = Math.random()
        if (rand < 0.7) return seatTypeRecords.find((st) => st.name === "Standard").id
        if (rand < 0.9) return seatTypeRecords.find((st) => st.name === "Comfort").id
        return seatTypeRecords.find((st) => st.name === "VIP" || st.name === "Premium").id
      }
      break
  }

  const seats = seatMock.map((seat) => ({
    hall_id: hall.id,
    seat_type_id: seatDistribution(seat),
    row: seat.row,
    place: seat.place,
    x: seat.x,
    y: seat.y,
    width: seat.width,
    height: seat.height,
    rotation: seat.rotation,
    status: Math.random() > 0.8 ? "OCCUPIED" : "VACANT",
  }))

  await prisma.seat.createMany({data: seats})

  await sleepWithMessage(`Added ${seats.length} seats to hall: ${hall.name}`)
}

function sleepWithMessage(message, ms = 50) {
  console.log(message)
  return new Promise((resolve) => setTimeout(resolve, ms))
}
