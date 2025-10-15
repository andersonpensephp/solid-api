import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from 'supertest';
import { createAuthenticateUser } from "@/utils/test/createAuthenticateUser";

describe('ProfileController (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { token } = await createAuthenticateUser(app)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    });
  });
});
