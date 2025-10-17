import type { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '@/use-cases/erros/user-errors';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import z from "zod";

export async function handlerAuthenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase(); // SOLID - Dependency Inversion Principle
    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign({
      role: user.role,
    }, {
      sign: {
        sub: user.id,
      }
    })

    const refreshToken = await reply.jwtSign({
      role: user.role,
    }, {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      }
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(200)
      .send({
        user,
        token,
        message: 'User authenticated successfully'
      });
  } catch (error: unknown) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}