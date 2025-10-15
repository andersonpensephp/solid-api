import type { FastifyRequest, FastifyReply } from 'fastify';
import { makeCheckInUseCase } from '@/use-cases/factories/make-checkin-use-case';
import { z } from 'zod';

export async function handlerCreateCheckIn(
  request: FastifyRequest<{ Params: { gymId: string } }>,
  reply: FastifyReply) {
  const createCheckInParamSchema = z.object({
    gymId: z.string(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  })

  const { gymId } = createCheckInParamSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()

  const checkIn = await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude
  })

  return reply.status(201).send(checkIn)
}