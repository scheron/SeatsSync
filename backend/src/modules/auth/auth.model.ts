import {PrismaClient} from "@prisma/client"

import type {User} from "./auth.types"

const prisma = new PrismaClient()

export async function createUser(user: User): Promise<void> {
  await prisma.user.create({data: user})
}

export async function findUser({username}: {username: User["username"]}): Promise<User | null> {
  return prisma.user.findUnique({where: {username}})
}
