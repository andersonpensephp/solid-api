import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

describe('Refresh Token (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.checkIn.deleteMany()
    await prisma.gym.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should refresh the token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '12345678',
      role: 'MEMBER',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '12345678',
    })

    expect(response.statusCode).toEqual(200)

    const cookies = response.headers['set-cookie']

    const refreshToken = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies!)
      .send()

    expect(refreshToken.statusCode).toEqual(200)
  });
});