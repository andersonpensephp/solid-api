import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app";
import request from 'supertest';

describe("AuthenticateController (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    const user = await request(app.server)
      .post("/users")
      .send({
        name: "John Doe",
        email: "johncokinho@gmail.com",
        password: "12345678",
      });

    const response = await request(app.server)
      .post("/sessions")
      .send({
        email: "johncokinho@gmail.com",
        password: "12345678",
      });

    const token = response.body.token;

    expect(response.statusCode).toEqual(200);
    expect(token).toBeDefined();
    expect(token.split('.').length).toBe(3);
  });
});