import type { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function handlerCheckInsMetrics(request: FastifyRequest, reply: FastifyReply) {

  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  const metrics = await getUserMetricsUseCase.execute({ userId: request.user.sub })

  return reply.status(200).send({ metrics })
}