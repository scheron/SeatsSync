import fs from "fs"
import path from "path"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const cinemas = await prisma.cinema.findMany()
  const halls = await prisma.hall.findMany()
  const seatTypes = await prisma.seatType.findMany()
  const seats = await prisma.seat.findMany({
    take: 5,
    include: {
      seat_type: true,
      hall: {
        select: {
          id: true,
          name: true,
          cinema_id: true,
        },
      },
    },
  })

  const data = {
    cinemas,
    halls,
    seatTypes,
    seats,
  }

  const filePath = path.join(process.cwd(), "data.json")
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
