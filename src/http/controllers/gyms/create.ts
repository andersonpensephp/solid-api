import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';

export async function handlerCreateGym(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable().default(''),
    phone: z.string().nullable().default(''),
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  });

  const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body);

  try {
    const createGymUseCase = makeCreateGymUseCase();
    const response = await createGymUseCase.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return reply.status(201).send({
      message: "Gym created successfully",
      ...response,
    });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}
