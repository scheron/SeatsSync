import {PrismaClient} from "@prisma/client"
import {cinemas, halls, seatLayouts, seatTypes, ticketTypes} from "./mock.js"
import dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  await clearDatabase()

  await sleepWithMessage("Seeding database...")

  const cinemaRecords = await createCinemas()
  const seatTypeRecords = await createSeatTypes()

  await createTicketTypes(seatTypeRecords)
  await createPricing(seatTypeRecords)

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
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function clearDatabase() {
  await sleepWithMessage("Clearing existing data...")

  await prisma.bookingSeat.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.pricing.deleteMany()
  await prisma.ticketType.deleteMany()
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

async function createTicketTypes(seatTypeRecords) {
  await sleepWithMessage("Creating ticket types...")

  const ticketTypesWithSeatIds = ticketTypes.map((type, index) => ({
    name: type.name,
    seat_type_id: seatTypeRecords[index % seatTypeRecords.length].id,
  }))

  const createdTicketTypes = await prisma.ticketType.createMany({data: ticketTypesWithSeatIds})

  await sleepWithMessage(`Created ${createdTicketTypes.count} ticket types.`)
}

async function createPricing(seatTypeRecords) {
  await sleepWithMessage("Creating pricing...")

  const ticketTypes = await prisma.ticketType.findMany()

  const pricingData = [
    {seat_type_id: seatTypeRecords[0].id, ticket_type_id: ticketTypes.find((tt) => tt.name === "Adult")?.id, price: getRandomNumber(8, 15)},
    {seat_type_id: seatTypeRecords[0].id, ticket_type_id: ticketTypes.find((tt) => tt.name === "Child")?.id, price: getRandomNumber(5, 10)},
    {seat_type_id: seatTypeRecords[1].id, ticket_type_id: ticketTypes.find((tt) => tt.name === "VIP Adult")?.id, price: getRandomNumber(20, 30)},
    {seat_type_id: seatTypeRecords[1].id, ticket_type_id: ticketTypes.find((tt) => tt.name === "VIP Child")?.id, price: getRandomNumber(15, 25)},
  ]

  const validPricingData = pricingData.filter((p) => p.ticket_type_id)

  await prisma.pricing.createMany({data: validPricingData})

  await sleepWithMessage("Pricing data seeded.")
}

async function createSeats(hall, seatTypeRecords) {
  await sleepWithMessage(`Creating seats for hall: ${hall.name}`)

  const seatMock = seatLayouts[Math.floor(Math.random() * seatLayouts.length)]

  const seats = seatMock.map((seat) => ({
    hall_id: hall.id,
    seat_type_id: seat.row > 4 ? seatTypeRecords[1].id : seatTypeRecords[0].id,
    row: seat.row,
    place: seat.place,
    x: seat.x,
    y: seat.y,
    width: seat.width,
    height: seat.height,
    rotation: seat.rotation,
    status: Math.random() > 0.8 ? "occupied" : "free",
  }))

  await prisma.seat.createMany({data: seats})

  await sleepWithMessage(`Added ${seats.length} seats to hall: ${hall.name}`)
}

function sleepWithMessage(message, ms = 50) {
  console.log(message)
  return new Promise((resolve) => setTimeout(resolve, ms))
}
