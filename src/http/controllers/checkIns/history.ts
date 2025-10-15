import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  makeFetchUserCheckinsHistoryUseCase
} from '@/use-cases/factories/make-fetch-user-checkins-history-use-case';

export async function handlerCheckInHistory(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
  const fetchUserCheckinsHistoryUseCase = makeFetchUserCheckinsHistoryUseCase()

  const checkIns = await fetchUserCheckinsHistoryUseCase.execute({ userId: request.user.sub })

  return reply.status(200).send({ checkIns })
}
