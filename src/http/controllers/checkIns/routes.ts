import { FastifyInstance } from "fastify";
import { handlerCreateCheckIn } from "./create";
import { handlerValidateCheckIn } from "./validate";
import { handlerCheckInHistory } from "./history";
import { authorization } from "@/http/middlewares/authorization";
import { handlerCheckInsMetrics } from "./metrics";
import { verifyUserRole } from "@/http/middlewares/verifyUserRole";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authorization)

  app.post('/gyms/:gymId/check-ins', handlerCreateCheckIn)
  app.patch('/check-ins/:checkInId/validate', { preHandler: verifyUserRole('ADMIN') }, handlerValidateCheckIn as any)
  app.get('/check-ins/history', handlerCheckInHistory)
  app.get('/check-ins/metrics', handlerCheckInsMetrics)
}