import {PrismaClient} from "@prisma/client"
import dotenv from "dotenv"

dotenv.config({path: "../.env"})

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding data...")

  const pricingData = [
    {category: "regular", price: 10},
    {category: "VIP", price: 20},
  ]
  await prisma.pricing.createMany({data: pricingData})
  console.log("Pricing data seeded.")

  const cinemas = [
    {name: "Grand Cinema", color: "#FF4500", created_at: new Date()},
    {name: "City Center Multiplex", color: "#1E90FF", created_at: new Date()},
    {name: "Downtown Filmhouse", color: "#32CD32", created_at: new Date()},
  ]
  const createdCinemas = await prisma.cinema.createMany({data: cinemas})
  console.log(`Created ${createdCinemas.count} cinemas.`)

  const cinemaRecords = await prisma.cinema.findMany()

  for (const cinema of cinemaRecords) {
    const schemes = [
      {name: "Main Hall", cinema_id: cinema.id, created_at: new Date()},
      {name: "VIP Lounge", cinema_id: cinema.id, created_at: new Date()},
    ]

    for (const schemeData of schemes) {
      const scheme = await prisma.seating_scheme.create({data: schemeData})
      console.log(`Created seating scheme: ${scheme.name} for cinema: ${cinema.name}`)

      const seats = []
      const rows = scheme.name.includes("VIP") ? 5 : 10
      const cols = 15

      for (let x = 1; x <= rows; x++) {
        for (let y = 1; y <= cols; y++) {
          seats.push({
            scheme_id: scheme.id,
            x,
            y,
            status: Math.random() > 0.8 ? "occupied" : "free",
            category: y <= 5 ? "VIP" : "regular",
          })
        }
      }
      await prisma.seat.createMany({data: seats})
      console.log(`Added ${seats.length} seats to scheme: ${scheme.name}`)

      const bookedSeats = seats.filter((seat) => seat.status === "occupied")
      const bookings = []
      for (let i = 0; i < Math.min(5, bookedSeats.length); i += 3) {
        bookings.push({
          scheme_id: scheme.id,
          seat_ids: JSON.stringify(bookedSeats.slice(i, i + 3).map((seat) => seat.id)),
          session_id: `session_${Math.random().toString(36).substring(2, 15)}`,
          status: "pending",
          created_at: new Date(),
          expires_at: new Date(new Date().getTime() + 15 * 60 * 1000),
        })
      }
      await prisma.booking.createMany({data: bookings})
      console.log(`Created ${bookings.length} bookings.`)
    }
  }

  console.log("Seeding completed!")
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
