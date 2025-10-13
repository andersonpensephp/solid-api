import { FastifyReply, FastifyRequest } from "fastify";

export async function authorization(request: FastifyRequest, reply: FastifyReply, done: any) {
  try {
    await request.jwtVerify();
    done();
  } catch (error) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
}