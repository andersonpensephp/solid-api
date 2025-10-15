import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest';
import { createAuthenticateUser } from "@/utils/test/createAuthenticateUser";

describe('GymController (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 1',
        description: 'Description 1',
        phone: '123456789',
        latitude: -23.55052,
        longitude: -46.6333093,
      });

    expect(response.statusCode).toEqual(201);
  });
});