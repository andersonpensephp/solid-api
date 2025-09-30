import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthenticateUseCase } from "../../use-cases/authenticateUseCase";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { InvalidCredentialsError } from '@/use-cases/erros/user-errors';
import z from "zod";

export async function handlerAuthenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = new AuthenticateUseCase(new PrismaUserRepository()); // SOLID - Dependency Inversion Principle
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