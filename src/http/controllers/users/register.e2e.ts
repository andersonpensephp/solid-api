import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from 'supertest';

describe("RegisterController (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server)
      .post("/users")
      .send({
        name: "Fulano Faker",
        email: "fulano@gmail.com",
        password: "12345678",
        role: 'MEMBER',
      });

    expect(response.statusCode).toEqual(201);
  });
});
