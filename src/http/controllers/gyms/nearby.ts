import type { FastifyRequest, FastifyReply } from 'fastify';
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';
import { z } from 'zod';

export async function handlerNearbyGyms(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  try {
    const { userLatitude, userLongitude } = nearbyGymsQuerySchema.parse(request.query);

    const nearbyGyms = await makeFetchNearbyGymsUseCase().execute({
      userLatitude: Number(userLatitude),
      userLongitude: Number(userLongitude),
    });

    return reply.status(200).send({ gyms: nearbyGyms });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}