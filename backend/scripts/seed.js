import {PrismaClient} from "@prisma/client"
import dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function clearDatabase() {
  await sleepWithMessage("Clearing existing data...")

  await prisma.bookingSeat.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.pricing.deleteMany()
  await prisma.ticketType.deleteMany()
  await prisma.seat.deleteMany()
  await prisma.seatType.deleteMany()
  await prisma.seatingScheme.deleteMany()
  await prisma.cinema.deleteMany()

  await sleepWithMessage("Database cleared.")
}

async function createCinemas() {
  await sleepWithMessage("Creating cinemas...")

  const cinemas = [
    {name: "Grand Cinema", color: "#FF4500"},
    {name: "City Center Multiplex", color: "#1E90FF"},
    {name: "Downtown Filmhouse", color: "#32CD32"},
  ]
  const createdCinemas = await prisma.cinema.createMany({data: cinemas})

  await sleepWithMessage(`Created ${createdCinemas.count} cinemas.`)
  return await prisma.cinema.findMany()
}

async function createSeatingSchemes(cinema) {
  await sleepWithMessage(`Creating seating schemes for cinema: ${cinema.name}`)

  const schemes = [
    {name: "Main Hall", cinema_id: cinema.id, width: 15, height: 10},
    {name: "VIP Lounge", cinema_id: cinema.id, width: 10, height: 5},
  ]

  const seatingSchemes = []
  for (const schemeData of schemes) {
    const scheme = await prisma.seatingScheme.create({data: schemeData})
    await sleepWithMessage(`Created seating scheme: ${scheme.name} for cinema: ${cinema.name}`)
    seatingSchemes.push(scheme)
  }

  return seatingSchemes
}

async function createSeatTypes() {
  await sleepWithMessage("Creating seat types...")

  const seatTypes = [{name: "Regular"}, {name: "VIP"}]
  const createdSeatTypes = await prisma.seatType.createMany({data: seatTypes})

  await sleepWithMessage(`Created ${createdSeatTypes.count} seat types.`)
  return await prisma.seatType.findMany()
}

async function createTicketTypes(seatTypeRecords) {
  await sleepWithMessage("Creating ticket types...")

  const ticketTypes = [
    {name: "Adult", seat_type_id: seatTypeRecords[0].id},
    {name: "Child", seat_type_id: seatTypeRecords[0].id},
    {name: "VIP Adult", seat_type_id: seatTypeRecords[1].id},
    {name: "VIP Child", seat_type_id: seatTypeRecords[1].id},
  ]
  const createdTicketTypes = await prisma.ticketType.createMany({data: ticketTypes})

  await sleepWithMessage(`Created ${createdTicketTypes.count} ticket types.`)
}

async function createPricing(seatTypeRecords) {
  sleepWithMessage("Creating pricing...")

  const ticketTypes = await prisma.ticketType.findMany()

  const pricingData = [
    {seat_type_id: seatTypeRecords[0].id, ticket_type_id: ticketTypes.find((tt) => tt.name === "Adult")?.id, price: 10},
    {seat_type_id: seatTypeRecords[0].id, ticket_type_id: ticketTypes.find((tt) => tt.name === "Child")?.id, price: 7},
    {
      seat_type_id: seatTypeRecords[1].id,
      ticket_type_id: ticketTypes.find((tt) => tt.name === "VIP Adult")?.id,
      price: 20,
    },
    {
      seat_type_id: seatTypeRecords[1].id,
      ticket_type_id: ticketTypes.find((tt) => tt.name === "VIP Child")?.id,
      price: 15,
    },
  ]

  const validPricingData = pricingData.filter((p) => p.ticket_type_id)

  if (validPricingData.length > 0) {
    await prisma.pricing.createMany({data: validPricingData})
    sleepWithMessage("Pricing data seeded.")
  } else {
    sleepWithMessage("No valid pricing data to seed.")
  }
}

async function createSeats(scheme, seatTypeRecords) {
  await sleepWithMessage("Creating seats...")

  const seats = []
  for (let row = 1; row <= scheme.height; row++) {
    for (let col = 1; col <= scheme.width; col++) {
      seats.push({
        seating_scheme_id: scheme.id,
        seat_type_id: col <= 5 ? seatTypeRecords[1].id : seatTypeRecords[0].id,
        row,
        place: col,
        x: col * 50,
        y: row * 50,
        width: 45,
        height: 45,
        rotation: 0,
        status: Math.random() > 0.8 ? "occupied" : "free",
      })
    }
  }

  await prisma.seat.createMany({data: seats})
  await sleepWithMessage(`Added ${seats.length} seats to scheme: ${scheme.name}`)
  return seats
}

async function createBookings(scheme, seats) {
  await sleepWithMessage("Creating bookings...")

  const bookedSeats = seats.filter((seat) => seat.status === "occupied")
  const bookings = []

  for (let i = 0; i < Math.min(5, bookedSeats.length); i += 3) {
    bookings.push({
      seating_scheme_id: scheme.id,
      session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
      status: "pending",
      created_at: new Date(),
      expires_at: new Date(new Date().getTime() + 15 * 60 * 1000),
    })
  }

  const createdBookings = await prisma.booking.createMany({data: bookings})
  await sleepWithMessage(`Created ${createdBookings.count} bookings.`)
}

async function main() {
  await clearDatabase()

  await sleepWithMessage("Seeding database...")

  const cinemas = await createCinemas()
  const seatTypes = await createSeatTypes()

  await createTicketTypes(seatTypes)
  await createPricing(seatTypes)

  for (const cinema of cinemas) {
    const schemes = await createSeatingSchemes(cinema)

    for (const scheme of schemes) {
      const seats = await createSeats(scheme, seatTypes)
      await createBookings(scheme, seats)
    }
  }

  await sleepWithMessage("Seeding completed!")
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

function sleepWithMessage(message, ms = 100) {
  console.log(message)
  return new Promise((resolve) => setTimeout(resolve, ms))
}
