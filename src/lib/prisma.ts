import 'dotenv/config'
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import { env } from '../env/index.js'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ 
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
})


