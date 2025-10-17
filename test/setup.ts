import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { afterAll, beforeAll } from 'vitest'

// Carrega o .env.test
dotenv.config({ path: '.env.test' })

const prisma = new PrismaClient()

beforeAll(async () => {
  // Preparação de teste handled pelo globalSetup (schema isolado + migrações)
})

afterAll(async () => {
  await prisma.$disconnect()
})
