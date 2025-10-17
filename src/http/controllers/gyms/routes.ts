import { FastifyInstance } from "fastify";
import { authorization } from "@/http/middlewares/authorization";
import { handlerNearbyGyms } from "./nearby";
import { handlerSearchGyms } from "./search";
import { handlerCreateGym } from "./create";
import { verifyUserRole } from "@/http/middlewares/verifyUserRole";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authorization)

  app.post('/gyms', { preHandler: verifyUserRole('ADMIN') }, handlerCreateGym)
  app.get('/gyms/search', handlerSearchGyms)
  app.get('/gyms/nearby', handlerNearbyGyms)
}
