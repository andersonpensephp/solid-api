import type { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUseCase } from "../../use-cases/registerUseCase";
import { PrismaUserRepository } from "../../repositories/prisma/prisma-user-repository";
import { UserAlreadyExistsError } from '@/use-cases/erros/user-errors';
import z from "zod";

export async function handlerRegister(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = new RegisterUseCase(new PrismaUserRepository()); // SOLID - Dependency Inversion Principle
    await registerUseCase.execute({ name, email, password });
  } catch (error: unknown) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send({ message: "User created successfully" });
}