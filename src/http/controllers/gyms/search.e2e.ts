import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { createAuthenticateUser } from "@/utils/test/createAuthenticateUser";
import { prisma } from "@/lib/prisma";

describe('GymController (e2e)', () => {
  beforeAll(async () => {
    await prisma.checkIn.deleteMany()
    await prisma.gym.deleteMany()
    await prisma.user.deleteMany()
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms', async () => {
    const { token } = await createAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 2',
        description: 'Description 2',
        phone: '123456789',
        latitude: -23.55052,
        longitude: -46.6333093,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({
        query: 'Gym 2',
        page: 1,
      });

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      gyms: [
        expect.objectContaining({
          title: 'Gym 2',
          description: 'Description 2',
          phone: '123456789',
          latitude: -23.55052,
          longitude: -46.6333093,
        }),
      ],
    });
  });
});