import type { FastifyRequest, FastifyReply } from 'fastify';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-checkins-use-case';
import z from 'zod';

export async function handlerValidateCheckIn(request: FastifyRequest<{ Params: { checkInId: string } }>, reply: FastifyReply) {
  const validateCheckInParamSchema = z.object({
    checkInId: z.uuid(),
  })

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  const { checkInId } = validateCheckInParamSchema.parse(request.params)

  const validateCheckIn = await validateCheckInUseCase.execute({ checkInId })

  return reply.status(204).send(validateCheckIn)
}