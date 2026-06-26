import { PrismaPg } from "@prisma/adapter-pg"
import { config } from "./data.config"
import { PrismaClient } from "../generated/prisma/client"

const adapter = new PrismaPg(config.dbUrl)
const prisma = new PrismaClient({ adapter })

export { prisma }