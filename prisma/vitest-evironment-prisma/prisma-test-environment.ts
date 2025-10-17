import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import dotenv from "dotenv";

// Carrega variáveis do ambiente de testes explicitamente
dotenv.config({ path: ".env.test" })

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Por favor, preencha a variável DATABASE_URL.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default async function globalSetup() {
  const schema = `test_${randomUUID().replace(/-/g, '')}`
  const databaseURL = generateDatabaseURL(schema)
  console.log(databaseURL)
  // Define a URL antes de qualquer interação com o Prisma
  process.env.DATABASE_URL = databaseURL

  // Importa o Prisma Client somente após definir a DATABASE_URL
  const { prisma } = await import("@/lib/prisma")

  // Garante estado limpo do schema alvo
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)

  // Em E2E, use db push para aplicar o schema no schema isolado (evita hardcode do "public" em migrations)
  execSync('npx prisma db push --force-reset --skip-generate', { stdio: 'inherit', env: process.env })

  // Retorna função de teardown para limpar após os testes
  return async function teardown() {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
    await prisma.$disconnect()
  }
}