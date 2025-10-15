import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { createAuthenticateUser } from "@/utils/test/createAuthenticateUser";
import { prisma } from "@/lib/prisma";

describe('CheckInController (e2e)', () => {

  beforeAll(async () => {
    await prisma.checkIn.deleteMany()
    await prisma.gym.deleteMany()
    await prisma.user.deleteMany()
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to check in', async () => {
    const { token } = await createAuthenticateUser(app)

    const createGymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 1',
        description: 'Description 1',
        phone: '123456789',
        latitude: -23.55052,
        longitude: -46.6333093,
      });

    await request(app.server)
      .post(`/gyms/${createGymResponse.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.55052,
        longitude: -46.6333093,
      });

    const checkInMetricsResponse = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(checkInMetricsResponse.statusCode).toEqual(200);

    expect(checkInMetricsResponse.body.metrics.checkInsCount).toEqual(1);
  })
})