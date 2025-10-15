import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';

export async function handlerSearchGyms(request: FastifyRequest, reply: FastifyReply) {
  const searchParamsSchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchParamsSchema.parse(request.query);

  try {
    const searchGymsUseCase = makeSearchGymsUseCase();
    const gyms = await searchGymsUseCase.execute({
      query,
      page,
    });

    return reply.status(200).send({ gyms });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
