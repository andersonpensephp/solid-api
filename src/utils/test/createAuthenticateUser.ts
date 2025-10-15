import request from 'supertest';
import { FastifyInstance } from 'fastify';

export async function createAuthenticateUser(app: FastifyInstance) {
  await request(app.server)
    .post('/users')
    .send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
    });

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: 'johndoe@example.com',
      password: '12345678',
    });

  return {
    token: authResponse.body.token,
  }
}