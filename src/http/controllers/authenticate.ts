import type { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '@/use-cases/erros/user-errors';
import z from "zod";
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function handlerAuthenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase(); // SOLID - Dependency Inversion Principle
    const { user } = await authenticateUseCase.execute({ email, password });

    return reply.status(200).send({
      user,
      message: 'User authenticated successfully'
    });
  } catch (error: unknown) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}