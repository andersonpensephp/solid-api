import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserAlreadyExistsError } from '@/use-cases/erros/user-errors';
import z from "zod";
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case';

export async function handlerRegister(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['ADMIN', 'MEMBER']),
  });

  const { name, email, password, role } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase(); // SOLID - Dependency Inversion Principle
    await registerUseCase.execute({ name, email, password, role });
  } catch (error: unknown) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }

  return reply.status(201).send({ message: "User created successfully" });
}