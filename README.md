# Solid API

API REST construída com Fastify, Prisma e TypeScript, aplicando princípios de Clean Code e SOLID. O projeto implementa autenticação JWT (com refresh token em cookie), RBAC simples por papel, validação de entrada com Zod, testes unitários e E2E com Vitest e CI no GitHub Actions.

---

## Sumário
- **[Stack](#stack)**
- **[Arquitetura](#arquitetura)**
- **[Modelagem (Prisma)](#modelagem-prisma)**
- **[Instalação e Setup](#instalação-e-setup)**
- **[Scripts](#scripts)**
- **[Execução](#execução)**
- **[Testes](#testes)**
- **[Endpoints](#endpoints)**
- **[Autenticação e Autorização](#autenticação-e-autorização)**
- **[Qualidade de Código](#qualidade-de-código)**
- **[Observabilidade e Erros](#observabilidade-e-erros)**
- **[CI/CD](#cicd)**

---

## Stack
- **Runtime/Framework**: `Node.js` + `Fastify` (`src/app.ts`, `src/server.ts`)
- **ORM**: `Prisma` (`prisma/schema.prisma`, `@prisma/client`)
- **DB**: PostgreSQL
- **Auth**: `@fastify/jwt` (JWT + refresh token em cookie `refreshToken`)
- **Validação**: `zod`
- **Testes**: `vitest` (unit e e2e) + `supertest`
- **Build**: `tsup`, `tsx`
- **Qualidade**: `eslint`, `prettier`, `husky`, `lint-staged`
- **TypeScript**: `strict`, path aliases `@/*` via `tsconfig.json`

---

## Arquitetura
- **Bootstrap**:
  - `src/app.ts`: registra plugins (cookie, jwt), rotas (`usersRoutes`, `gymsRoutes`, `checkInsRoutes`) e error handler com `ZodError`.
  - `src/server.ts`: sobe o servidor lendo `PORT` de `env`.
- **Domínio/Use Cases**: casos de uso isolados em `src/use-cases/` (ex.: `registerUseCase.ts`). Handlers HTTP orquestram validação e chamam os casos de uso.
- **HTTP**:
  - Controladores em `src/http/controllers/**` separados por contexto (`users`, `gyms`, `checkIns`).
  - Middlewares:
    - `authorization` (`src/http/middlewares/authorization.ts`): `request.jwtVerify()` e 401 em falha.
    - `verifyUserRole` (`src/http/middlewares/verifyUserRole.ts`): RBAC por `role` (`ADMIN` | `MEMBER`).
- **Validação**: cada handler valida `params`, `query` e `body` com `zod` antes de executar o caso de uso.
- **Erros**: `ZodError` → 400; demais erros → 500 (com logging ambiente `development`).

---

## Modelagem (Prisma)
Arquivo: `prisma/schema.prisma`
```prisma
enum ROLE {
  ADMIN
  MEMBER
}

model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String   @default("")
  role          ROLE     @default(MEMBER)
  created_at    DateTime @default(now())
  checkIns      CheckIn[]
  @@map("users")
}

model Gym {
  id          String @id @default(uuid())
  title       String
  description String
  phone       String
  latitude    Float
  longitude   Float
  checkIns    CheckIn[]
  @@map("gyms")
}

model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?
  user_id      String
  gym_id       String
  user User @relation(fields: [user_id], references: [id])
  gym  Gym  @relation(fields: [gym_id], references: [id])
  @@map("check_ins")
}
```

---

## Instalação e Setup
- **Pré-requisitos**: Node 20+, PostgreSQL
- **Variáveis de ambiente** (`.env`):
```bash
NODE_ENV=development
PORT=3333
JWT_SECRET=seu-segredo
DATABASE_URL="postgresql://user:pass@localhost:5432/solid?schema=public"
```
- **Ambiente de teste** (`.env.test` ou variáveis em CI):
```bash
NODE_ENV=test
JWT_SECRET=seu-segredo-teste
DATABASE_URL="postgresql://user:pass@localhost:5432/solid_test?schema=public"
```
- **Instalação**:
```bash
npm ci
npx prisma generate
npx prisma migrate dev # ambiente local
```

> No CI, usamos `prisma migrate deploy` (ver workflow) e serviço Postgres containerizado.

---

## Scripts
Arquivo: `package.json`
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src --out-dir build --format esm",
    "start": "node build/server.js",
    "test": "vitest run --mode unit",
    "test:e2e": "vitest run --mode e2e --reporter=verbose",
    "test:watch": "vitest --watch --mode unit",
    "test:watch:e2e": "vitest --watch --mode e2e",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint --config eslint.config.ts .",
    "lint:fix": "eslint --config eslint.config.ts . --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "prepare": "husky",
    "postinstall": "prisma generate",
    "prisma:generate": "prisma generate"
  }
}
```

---

## Execução
- **Desenvolvimento**:
```bash
npm run dev
```
- **Build e produção**:
```bash
npm run build
npm start
```

---

## Testes
- **Unitários**:
```bash
npm test
npm run test:watch
```
- **E2E**:
```bash
npm run test:e2e
npm run test:watch:e2e
```
- **Cobertura**:
```bash
npm run test:coverage
```

> E2E dependem de um banco configurado em `DATABASE_URL` com schema aplicado (`prisma migrate deploy`/`dev`).

---

## Endpoints
### Users (`src/http/controllers/users/routes.ts`)
- **POST** `/users` — Registrar usuário
  - Body: `{ name, email, password, role }` (`role`: `ADMIN` | `MEMBER`)
  - 201 em sucesso
- **POST** `/sessions` — Autenticar
  - Body: `{ email, password }`
  - Retorna JWT de acesso e define `refreshToken` em cookie (via `@fastify/jwt`)
- **PATCH** `/token/refresh` — Renovar access token
  - Usa cookie `refreshToken`
- **GET** `/me` — Perfil do usuário autenticado
  - Requer header `Authorization: Bearer <token>`

### Gyms (`src/http/controllers/gyms/routes.ts`)
- **POST** `/gyms` — Criar academia
  - PreHandler: `verifyUserRole('ADMIN')`
  - Body: `{ title, description, phone, latitude, longitude }`
- **GET** `/gyms/search` — Buscar por termo
  - Query: `{ q: string, page?: number }`
- **GET** `/gyms/nearby` — Próximas ao ponto
  - Query: `{ latitude: number, longitude: number }`

### Check-ins (`src/http/controllers/checkIns/routes.ts`)
- **POST** `/gyms/:gymId/check-ins` — Check-in em uma academia
  - Params: `{ gymId: string }`
  - Body: `{ latitude: number, longitude: number }`
- **PATCH** `/check-ins/:checkInId/validate` — Validar check-in
  - PreHandler: `verifyUserRole('ADMIN')`
  - Params: `{ checkInId: string }`
- **GET** `/check-ins/history` — Histórico do usuário
- **GET** `/check-ins/metrics` — Métricas do usuário

> As rotas de `gyms` e `check-ins` usam `authorization` como hook de autenticação.

---

## Autenticação e Autorização
- **JWT** (`@fastify/jwt`):
  - Configurado em `src/app.ts` com `secret` de `env.JWT_SECRET`.
  - Access token com `expiresIn: '10m'`.
  - Refresh token armazenado em cookie `refreshToken` (não assinado) e endpoint `/token/refresh`.
- **RBAC**: `verifyUserRole(role)` compara `request.user.role` com `ADMIN` | `MEMBER`.
- **Proteção de rotas**: hook `authorization` chama `request.jwtVerify()` e retorna 401 quando inválido.

---

## Qualidade de Código
- **TypeScript**: `strict: true`, path alias `@/*`, `noUncheckedIndexedAccess: true`.
- **Lint/Format**: ESLint + Prettier integrados. `husky` + `lint-staged` para rodar lint/prettier no pre-commit.
- **Validação**: `zod` em handlers para `body`, `params` e `query` antes de chamar casos de uso.

---

## Observabilidade e Erros
- **Error handler global** em `src/app.ts`:
  - `ZodError` → 400 com `issues` formatados.
  - Outros erros → 500; log detalhado em `NODE_ENV=development` (pluggable para Sentry, etc.).

---

## CI/CD
- **Workflows** em `.github/workflows/`:
  - `run-unit-test.yml`: executa testes unitários a cada push.
  - `Run E2E Tests` (`run-e2e-test.yml`): executa testes E2E em PRs, sobe Postgres via serviço, aplica `prisma generate` e `migrate deploy`.
- **Variáveis sensíveis**: `JWT_SECRET_TEST` via `secrets` do GitHub.

---

## Exemplos de Requisição
- **Login**:
```bash
curl -X POST http://localhost:$PORT/sessions \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"12345678"}'
```
- **Criar Gym (ADMIN)**:
```bash
curl -X POST http://localhost:$PORT/gyms \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Gym A","description":"...","phone":"000","latitude":-23.5,"longitude":-46.6}'
```
- **Check-in**:
```bash
curl -X POST http://localhost:$PORT/gyms/<GYM_ID>/check-ins \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{"latitude":-23.5,"longitude":-46.6}'
```

---

## Notas
- Certifique-se de configurar `DATABASE_URL` e `JWT_SECRET` antes de rodar a aplicação.
- Asserções de tipos nos handlers seguem a tipagem do Fastify; a validação runtime é garantida por `zod`.
- Em produção, habilite monitoramento (Sentry, OpenTelemetry) e políticas de segurança para cookies e CORS.



