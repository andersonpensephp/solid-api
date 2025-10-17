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

  it('should be able to search gyms', async () => {
    const { token } = await createAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 01',
        description: 'Gym 01',
        phone: '123456789',
        latitude: -22.7568,
        longitude: -43.4607,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        userLatitude: -22.7204,
        userLongitude: -43.4601,
      });

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      gyms: [
        expect.objectContaining({
          title: 'Gym 01',
          description: 'Gym 01',
          phone: '123456789',
          latitude: -22.7568,
          longitude: -43.4607,
        }),
      ],
    });
  });
})